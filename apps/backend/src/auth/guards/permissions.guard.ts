import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  PERMISSIONS,
  PermissionAction,
  PermissionResource,
} from '../../config/permissions.config';

import {
  PERMISSION_KEY,
  PermissionMetadata,
} from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    /**
     * Récupération de la permission déclarée
     * sur la route avec @Permission(...)
     */
    const permission =
      this.reflector.get<PermissionMetadata>(
        PERMISSION_KEY,
        context.getHandler(),
      );

    /**
     * Si aucune permission n'est déclarée,
     * le Guard laisse passer.
     *
     * Cela permet d'ajouter progressivement
     * la sécurité aux Controllers.
     */
    if (!permission) {
      return true;
    }

    /**
     * Récupération de la requête HTTP
     */
    const request = context.switchToHttp().getRequest();

    /**
     * req.user est créé par JwtStrategy.validate()
     */
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié',
      );
    }

    /**
     * Récupération du rôle contenu dans le JWT
     */
    const role = user.role;

    if (!role) {
      throw new ForbiddenException(
        'Aucun rôle associé à cet utilisateur',
      );
    }

    /**
     * Recherche de la ressource dans la matrice.
     */
    const resourcePermissions =
      PERMISSIONS[
        permission.resource
      ] as Record<
        string,
        readonly string[]
      > | undefined;

    if (!resourcePermissions) {
      throw new ForbiddenException(
        'Ressource non autorisée',
      );
    }

    /**
     * Recherche des rôles autorisés
     * pour l'action demandée.
     */
    const allowedRoles =
      resourcePermissions[
        permission.action
      ];

    if (!allowedRoles) {
      throw new ForbiddenException(
        'Action non autorisée',
      );
    }

    /**
     * Vérification finale.
     */
    const authorized =
      allowedRoles.includes(role);

    if (!authorized) {
      throw new ForbiddenException(
        `Accès refusé : le rôle ${role} ` +
        `ne possède pas la permission ` +
        `${permission.resource}:${permission.action}`,
      );
    }

    return true;
  }
}
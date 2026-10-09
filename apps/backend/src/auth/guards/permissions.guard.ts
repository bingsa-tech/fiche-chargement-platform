
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS } from '../../config/permissions.config';
import {
  PERMISSION_KEY,
  PermissionMetadata,
} from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission =
      this.reflector.getAllAndOverride<PermissionMetadata>(
        PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      );

    // Refuser par défaut si aucune permission n'est déclarée.
    if (!permission) {
      throw new ForbiddenException(
        'Aucune permission déclarée pour cette route',
      );
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié',
      );
    }

    const role = user.role;

    if (!role) {
      throw new ForbiddenException(
        'Aucun rôle associé à cet utilisateur',
      );
    }

    const resourcePermissions =
      PERMISSIONS[permission.resource] as
        | Record<string, readonly string[]>
        | undefined;

    if (!resourcePermissions) {
      throw new ForbiddenException(
        'Ressource non autorisée',
      );
    }

    const allowedRoles =
      resourcePermissions[permission.action];

    if (!allowedRoles) {
      throw new ForbiddenException(
        'Action non autorisée',
      );
    }

    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException(
        `Accès refusé pour le rôle ${role}`,
      );
    }

    return true;
  }
}

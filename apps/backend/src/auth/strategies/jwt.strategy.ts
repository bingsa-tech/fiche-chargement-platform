
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UtilisateursService } from '../../utilisateurs/utilisateur.service';

interface JwtPayload {
  sub: number;
  username?: string;
  role?: string;
  gareId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly utilisateursService: UtilisateursService,
  ) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || !jwtSecret.trim()) {
      throw new InternalServerErrorException(
        'JWT_SECRET doit être configuré dans les variables d’environnement.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException(
        'Jeton JWT invalide : identifiant utilisateur manquant.',
      );
    }

    const utilisateur = await this.utilisateursService.findOne(
      payload.sub,
    );

    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!utilisateur.role?.code) {
      throw new UnauthorizedException(
        'Aucun rôle valide associé à cet utilisateur.',
      );
    }

    return {
      id: utilisateur.id,
      username: utilisateur.username,
      role: utilisateur.role.code,
      gareId: utilisateur.gareId,
    };
  }
}

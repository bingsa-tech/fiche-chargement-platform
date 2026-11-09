import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UtilisateursService } from '../../utilisateurs/utilisateur.service';
import { PresenceService } from '../../presence/presence.service';

interface JwtPayload {
  sub: number;
  sessionId: string;
  username: string;
  role: string;
  gareId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly utilisateursService: UtilisateursService,
    private readonly presenceService: PresenceService,
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
    // 1. Vérifier l'identifiant utilisateur
    if (!Number.isInteger(payload?.sub) || payload.sub <= 0) {
      throw new UnauthorizedException(
        'Jeton JWT invalide : identifiant utilisateur manquant.',
      );
    }

    // 2. Vérifier la présence du sessionId dans le JWT
    if (
      typeof payload.sessionId !== 'string' ||
      !payload.sessionId.trim()
    ) {
      throw new UnauthorizedException(
        'Session JWT invalide ou manquante.',
      );
    }

    // 3. Récupérer l'utilisateur depuis la base de données
    const utilisateur = await this.utilisateursService.findOne(
      payload.sub,
    );

    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    // 4. Vérifier le rôle de l'utilisateur
    if (!utilisateur.role?.code) {
      throw new UnauthorizedException(
        'Aucun rôle valide associé à cet utilisateur.',
      );
    }

    // 5. Vérifier si le compte est actif et non bloqué
    if (!utilisateur.actif || utilisateur.bloque) {
      throw new UnauthorizedException(
        'Utilisateur désactivé ou bloqué.',
      );
    }

    // 6. Vérifier que la session existe et n'est ni expirée ni révoquée
    const sessionIsValid =
      await this.presenceService.validateSession(
        payload.sessionId,
        utilisateur.id,
      );

    if (!sessionIsValid) {
      throw new UnauthorizedException(
        'Session expirée ou révoquée.',
      );
    }

    // 7. Retourner les informations fiables de l'utilisateur
    return {
      sub: utilisateur.id,
      username: utilisateur.username,
      role: utilisateur.role.code,
      gareId: utilisateur.gareId,
      sessionId: payload.sessionId,
    };
  }
}

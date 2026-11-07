
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UtilisateursService } from '../utilisateurs/utilisateur.service';
import { RefreshTokenService } from './refresh/refresh-token.service';
import { PresenceService } from '../presence/presence.service';
import { PresenceDeviceType } from '../presence/entities/presence-session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilisateursService: UtilisateursService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly presenceService: PresenceService,
  ) {}

  /**
   * Génère un Access Token JWT.
   */
  private generateAccessToken(user: {
    id: number;
    username: string;
    role: string;
    gareId: string | null;
    sessionId: string;
  }): string {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      gareId: user.gareId,
      sessionId: user.sessionId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  /**
   * Connexion utilisateur.
   */
  async login(
    username: string,
    password: string,
    userAgent?: string | null,
    ipAddress?: string | null,
  ) {
    const user =
      await this.utilisateursService.findByUsernameWithRole(
        username,
      );

    if (!user || !user.actif || user.bloque) {
      return null;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isMatch) {
      return null;
    }

    const roleCode = user.role?.code ?? 'USER';

    const expiresAt =
      this.refreshTokenService.getExpirationDate(7);

    // 1. Créer la session de présence.
    const session =
      await this.presenceService.createSession({
        utilisateurId: user.id,
        gareId: user.gareId,
        deviceType: PresenceDeviceType.WEB,
        deviceName: userAgent ?? 'Navigateur Web',
      });

    // 2. Générer le JWT avec le sessionId.
    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      role: roleCode,
      gareId: user.gareId,
      sessionId: session.id,
    });

    // 3. Créer le refresh token associé à la session.
    const refreshToken =
      await this.refreshTokenService.create(
        user,
        expiresAt,
        userAgent,
        ipAddress,
        session.id,
      );

    await this.utilisateursService.updateLastLogin(
      user.id,
    );

    return {
      accessToken,
      refreshToken: refreshToken.token,

      user: {
        id: user.id,
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: roleCode,
        gareId: user.gareId,
      },
    };
  }

  /**
   * Renouvellement du refresh token.
   * La même session est conservée pendant la rotation.
   */
  async refresh(
    refreshTokenValue: string,
    userAgent?: string | null,
    ipAddress?: string | null,
  ) {
    const currentToken =
      await this.refreshTokenService.findValidToken(
        refreshTokenValue,
      );

    if (!currentToken) {
      throw new UnauthorizedException(
        'Refresh token invalide ou expiré.',
      );
    }

    const user =
      await this.utilisateursService.findByUsernameWithRole(
        currentToken.user.username,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    if (!user.actif || user.bloque) {
      throw new UnauthorizedException(
        'Utilisateur désactivé ou bloqué.',
      );
    }

    const roleCode = user.role?.code ?? 'USER';

    const expiresAt =
      this.refreshTokenService.getExpirationDate(7);

    let sessionId = currentToken.sessionId;

    // Compatibilité avec les anciens refresh tokens
    // dont session_id est NULL.
    if (!sessionId) {
      const session =
        await this.presenceService.createSession({
          utilisateurId: user.id,
          gareId: user.gareId,
          deviceType: PresenceDeviceType.WEB,
          deviceName: userAgent ?? 'Navigateur Web',
        });

      sessionId = session.id;
    } else {
      // Conserver et prolonger la session existante.
      await this.presenceService.renewSession(
        sessionId,
        user.id,
        expiresAt,
      );
    }

    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      role: roleCode,
      gareId: user.gareId,
      sessionId,
    });

    // Créer le nouveau refresh token sur la même session.
    const replacement =
      await this.refreshTokenService.create(
        user,
        expiresAt,
        userAgent,
        ipAddress,
        sessionId,
      );

    await this.refreshTokenService.markAsReplaced(
      currentToken,
      replacement.refreshToken,
    );

    return {
      accessToken,
      refreshToken: replacement.token,

      user: {
        id: user.id,
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: roleCode,
        gareId: user.gareId,
      },
    };
  }

  /**
   * Déconnexion.
   * Révoque le refresh token et sa session.
   */
  async logout(
    refreshTokenValue: string | null,
  ): Promise<void> {
    if (!refreshTokenValue) {
      return;
    }

    const token =
      await this.refreshTokenService.findToken(
        refreshTokenValue,
      );

    if (!token) {
      return;
    }

    // Révoquer le refresh token.
    await this.refreshTokenService.revoke(token);

    // Révoquer uniquement la session correspondante.
    if (token.sessionId) {
      await this.presenceService.revokeSession(
        token.sessionId,
        token.userId,
      );
    }
  }
}

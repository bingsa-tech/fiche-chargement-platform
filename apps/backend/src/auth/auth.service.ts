import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UtilisateursService } from '../utilisateurs/utilisateur.service';
import { RefreshTokenService } from './refresh/refresh-token.service';
import { RefreshToken } from './refresh/entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilisateursService: UtilisateursService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Génère un Access Token JWT.
   */
  private generateAccessToken(user: {
    id: number;
    username: string;
    role: string;
    gareId: string | null;
  }): string {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      gareId: user.gareId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  /**
   * Connexion utilisateur.
   *
   * Retourne les données nécessaires au contrôleur
   * pour créer le cookie HttpOnly.
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

    if (!user) {
      return null;
    }

    if (!user.actif || user.bloque) {
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

    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      role: roleCode,
      gareId: user.gareId,
    });

    const refreshToken =
      await this.refreshTokenService.create(
        user,
        this.refreshTokenService.getExpirationDate(7),
        userAgent,
        ipAddress,
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
   * Rafraîchit la session.
   *
   * L'ancien refresh token est révoqué et remplacé
   * par un nouveau refresh token.
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
        'Refresh token invalide ou expiré',
      );
    }

    const user =
      await this.utilisateursService.findByUsernameWithRole(
        currentToken.user.username,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable',
      );
    }

    if (!user.actif || user.bloque) {
      throw new UnauthorizedException(
        'Utilisateur désactivé ou bloqué',
      );
    }

    const roleCode = user.role?.code ?? 'USER';

    const accessToken = this.generateAccessToken({
      id: user.id,
      username: user.username,
      role: roleCode,
      gareId: user.gareId,
    });

    const replacement =
      await this.refreshTokenService.create(
        user,
        this.refreshTokenService.getExpirationDate(7),
        userAgent,
        ipAddress,
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
   */
  async logout(
    refreshTokenValue: string | null,
  ): Promise<void> {
    if (!refreshTokenValue) {
      return;
    }

    await this.refreshTokenService.revokeByToken(
      refreshTokenValue,
    );
  }
}


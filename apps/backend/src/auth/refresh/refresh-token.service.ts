import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { randomBytes, createHash } from 'crypto';

import { RefreshToken } from './entities/refresh-token.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Génère un Refresh Token cryptographiquement aléatoire.
   */
  generateToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Hash le Refresh Token avant son stockage en base.
   *
   * Le token brut ne doit jamais être enregistré
   * dans PostgreSQL.
   */
  hashToken(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Crée un Refresh Token pour un utilisateur.
   *
   * Le token brut est retourné une seule fois
   * au code appelant.
   */
  async create(
    user: Utilisateur,
    expiresAt: Date,
    userAgent?: string | null,
    ipAddress?: string | null,
  ): Promise<{
    token: string;
    refreshToken: RefreshToken;
  }> {
    const token = this.generateToken();

    const tokenHash = this.hashToken(token);

    const refreshToken =
      this.refreshTokenRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        revokedAt: null,
        replacedByTokenId: null,
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
      });

    const savedToken =
      await this.refreshTokenRepository.save(
        refreshToken,
      );

    return {
      token,
      refreshToken: savedToken,
    };
  }

  /**
   * Recherche un Refresh Token valide à partir
   * du token brut.
   */
  async findValidToken(
    token: string,
  ): Promise<RefreshToken | null> {
    const tokenHash =
      this.hashToken(token);

    const refreshToken =
      await this.refreshTokenRepository.findOne({
        where: {
          tokenHash,
        },
        relations: {
          user: true,
        },
      });

    if (!refreshToken) {
      return null;
    }

    if (refreshToken.revokedAt) {
      return null;
    }

    if (
      refreshToken.expiresAt.getTime() <=
      Date.now()
    ) {
      return null;
    }

    return refreshToken;
  }

  /**
   * Révoque un Refresh Token.
   */
  async revoke(
    refreshToken: RefreshToken,
  ): Promise<RefreshToken> {
    refreshToken.revokedAt =
      new Date();

    return this.refreshTokenRepository.save(
      refreshToken,
    );
  }

  /**
   * Révoque un Refresh Token à partir
   * de sa valeur brute.
   */
  async revokeByToken(
    token: string,
  ): Promise<boolean> {
    const refreshToken =
      await this.findToken(token);

    if (!refreshToken) {
      return false;
    }

    await this.revoke(refreshToken);

    return true;
  }

  /**
   * Recherche un Refresh Token sans appliquer
   * les règles de validité.
   */
  async findToken(
    token: string,
  ): Promise<RefreshToken | null> {
    const tokenHash =
      this.hashToken(token);

    return this.refreshTokenRepository.findOne({
      where: {
        tokenHash,
      },
    });
  }

  /**
   * Marque un token comme remplacé par
   * un nouveau Refresh Token.
   */
  async markAsReplaced(
    refreshToken: RefreshToken,
    replacement: RefreshToken,
  ): Promise<RefreshToken> {
    refreshToken.revokedAt =
      new Date();

    refreshToken.replacedByTokenId =
      replacement.id;

    return this.refreshTokenRepository.save(
      refreshToken,
    );
  }

  /**
   * Supprime les Refresh Tokens expirés.
   *
   * Les tokens révoqués sont également supprimés
   * lorsqu'ils sont expirés.
   */
  async deleteExpired(): Promise<number> {
    const result =
      await this.refreshTokenRepository
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where(
          'expires_at < CURRENT_TIMESTAMP',
        )
        .execute();

    return result.affected ?? 0;
  }

  /**
   * Calcule une date d'expiration à partir
   * d'un nombre de jours.
   */
  getExpirationDate(
    days: number,
  ): Date {
    const expiration =
      new Date();

    expiration.setDate(
      expiration.getDate() + days,
    );

    return expiration;
  }
}


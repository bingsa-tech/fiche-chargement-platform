
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';

import {
  PresenceSession,
  PresenceDeviceType,
} from './entities/presence-session.entity';

import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

interface CreatePresenceSessionParams {
  utilisateurId: number;
  gareId: string | null;
  deviceType: PresenceDeviceType;
  deviceName?: string | null;
}

@Injectable()
export class PresenceService {
  private readonly HEARTBEAT_TIMEOUT_SECONDS = 90;
  private readonly SESSION_DURATION_DAYS = 7;

  constructor(
    @InjectRepository(PresenceSession)
    private readonly sessionRepository: Repository<PresenceSession>,

    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

  /**
   * Crée une session de présence.
   */
  async createSession(
    params: CreatePresenceSessionParams,
  ): Promise<PresenceSession> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: {
        id: params.utilisateurId,
        actif: true,
        bloque: false,
      },
    });

    if (!utilisateur) {
      throw new UnauthorizedException(
        'Utilisateur introuvable ou inactif.',
      );
    }

    // La gare provient du compte authentifié,
    // jamais d'une valeur libre envoyée par le client.
    const gareId = utilisateur.gareId ?? null;

    const now = new Date();

    const expiresAt = new Date(now);
    expiresAt.setDate(
      expiresAt.getDate() + this.SESSION_DURATION_DAYS,
    );

    const session = this.sessionRepository.create({
      utilisateurId: utilisateur.id,
      gareId,
      deviceType: params.deviceType,
      deviceName: params.deviceName ?? null,
      connectedAt: now,
      lastSeenAt: now,
      expiresAt,
      revokedAt: null,
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Actualise la dernière activité d'une session.
   */
  async heartbeat(
    sessionId: string,
    utilisateurId: number,
  ): Promise<PresenceSession> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        utilisateurId,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!session) {
      throw new UnauthorizedException(
        'Session invalide, expirée ou révoquée.',
      );
    }

    session.lastSeenAt = new Date();

    return this.sessionRepository.save(session);
  }
 /**
 * Vérifie qu'une session appartient à l'utilisateur,
 * qu'elle n'est pas révoquée et qu'elle n'est pas expirée.
 */
async validateSession(
  sessionId: string,
  utilisateurId: number,
): Promise<boolean> {
  if (!sessionId) {
    return false;
  }

  const session = await this.sessionRepository.findOne({
    where: {
      id: sessionId,
      utilisateurId,
      revokedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    },
    select: {
      id: true,
    },
  });

  return !!session;
}
  /**
   * Révoque une session précise.
   */
  async revokeSession(
    sessionId: string,
    utilisateurId: number,
  ): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        utilisateurId,
        revokedAt: IsNull(),
      },
    });

    if (!session) {
      return;
    }

    session.revokedAt = new Date();

    await this.sessionRepository.save(session);
  }

  /**
   * Révoque toutes les sessions d'un utilisateur.
   */
  async revokeAllSessions(
    utilisateurId: number,
  ): Promise<number> {
    const result = await this.sessionRepository.update(
      {
        utilisateurId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );

    return result.affected ?? 0;
  }

  /**
   * Retourne les sessions actuellement en ligne.
   */
  async getOnlineSessions(): Promise<PresenceSession[]> {
    const activeSince = new Date(
      Date.now() -
        this.HEARTBEAT_TIMEOUT_SECONDS * 1000,
    );

    return this.sessionRepository.find({
      where: {
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
        lastSeenAt: MoreThan(activeSince),
      },
      relations: {
        utilisateur: {
          role: true,
          gare: true,
        },
        gare: true,
      },
      order: {
        lastSeenAt: 'DESC',
      },
    });
  }

  /**
   * Retourne le nombre de sessions actuellement en ligne.
   */
  async getOnlineCount(): Promise<number> {
    const activeSince = new Date(
      Date.now() -
        this.HEARTBEAT_TIMEOUT_SECONDS * 1000,
    );

    return this.sessionRepository.count({
      where: {
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
        lastSeenAt: MoreThan(activeSince),
      },
    });
  }
  /**
   * gestion presence pour les utilisateurs
   */
  async renewSession(
  sessionId: string,
  utilisateurId: number,
  expiresAt: Date,
): Promise<PresenceSession> {
  const session = await this.sessionRepository.findOne({
    where: {
      id: sessionId,
      utilisateurId,
      revokedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    },
  });

  if (!session) {
    throw new UnauthorizedException(
      'Session invalide, expirée ou révoquée.',
    );
  }

  session.lastSeenAt = new Date();
  session.expiresAt = expiresAt;

  return this.sessionRepository.save(session);
}
}

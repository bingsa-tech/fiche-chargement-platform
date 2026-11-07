
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Request } from 'express';
import { isUUID } from 'class-validator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PresenceService } from './presence.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    username: string;
    role: string;
    gareId: string | null;
    sessionId?: string;
  };
}

@Controller('presence')
@UseGuards(JwtAuthGuard)
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
  ) {}

  /**
   * POST /presence/heartbeat
   * Actualise l'activité de la session issue du JWT.
   */
  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  async heartbeat(@Req() req: AuthenticatedRequest) {
    const utilisateurId = req.user?.sub;
    const sessionId = req.user?.sessionId;

    if (!utilisateurId) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié.',
      );
    }

    if (!sessionId || !isUUID(sessionId)) {
      throw new UnauthorizedException(
        'Session absente ou invalide dans le JWT. Veuillez renouveler votre authentification.',
      );
    }

    const session = await this.presenceService.heartbeat(
      sessionId,
      utilisateurId,
    );

    return {
      success: true,
      message: 'Présence actualisée.',
      sessionId: session.id,
      lastSeenAt: session.lastSeenAt,
    };
  }

  /**
   * GET /presence/online
   * Liste les utilisateurs actuellement en ligne.
   */
  @Get('online')
  async getOnlineUsers(@Req() req: AuthenticatedRequest) {
    const role = req.user?.role;

    if (
      !['ADMIN', 'AUTORITE_HABILITEE'].includes(role)
    ) {
      throw new ForbiddenException(
        'Vous ne disposez pas des droits nécessaires.',
      );
    }

    const sessions =
      await this.presenceService.getOnlineSessions();

    return {
      total: sessions.length,
      sessions: sessions.map((session) => ({
        sessionId: session.id,
        utilisateurId: session.utilisateurId,
        username: session.utilisateur.username,
        nom: session.utilisateur.nom,
        prenom: session.utilisateur.prenom,
        role: session.utilisateur.role?.code ?? null,
        gare: session.gare
          ? {
              id: session.gare.id,
              code: session.gare.code,
              nom: session.gare.nom,
              ville: session.gare.ville,
            }
          : null,
        deviceType: session.deviceType,
        deviceName: session.deviceName,
        connectedAt: session.connectedAt,
        lastSeenAt: session.lastSeenAt,
      })),
    };
  }

  /**
   * GET /presence/online/count
   * Nombre de sessions actuellement en ligne.
   */
  @Get('online/count')
  async getOnlineCount(@Req() req: AuthenticatedRequest) {
    const role = req.user?.role;

    if (
      !['ADMIN', 'AUTORITE_HABILITEE'].includes(role)
    ) {
      throw new ForbiddenException(
        'Vous ne disposez pas des droits nécessaires.',
      );
    }

    const total =
      await this.presenceService.getOnlineCount();

    return { total };
  }
}

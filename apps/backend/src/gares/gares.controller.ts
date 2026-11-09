
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';

import { CreateGareDto } from './dto/create-gare.dto';
import { UpdateGareDto } from './dto/update-gare.dto';
import { GaresService } from './gares.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    username: string;
    role: string;
    gareId: string | null;
  };
}

@ApiTags('Gares')
@ApiBearerAuth()
@Controller('gares')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GaresController {
  constructor(
    private readonly garesService: GaresService,
  ) {}

  // =====================================================
  // HELPERS
  // =====================================================

  private getUtilisateurId(req: AuthenticatedRequest): number {
    const utilisateurId = req.user?.sub;

    if (!Number.isInteger(utilisateurId) || utilisateurId <= 0) {
      throw new ForbiddenException(
        'Identité de l’utilisateur authentifié invalide.',
      );
    }

    return utilisateurId;
  }

  private getAppareilId(req: AuthenticatedRequest): string | null {
    const appareilId = req.headers['x-device-id'];

    return typeof appareilId === 'string'
      ? appareilId
      : null;
  }

  // =====================================================
  // CREATE
  // =====================================================

  @Post()
  @Permission('gares', 'CREATE')
  @ApiOperation({
    summary: 'Créer une gare',
    description:
      'Crée une gare et enregistre automatiquement l’opération dans le journal d’audit.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 201, description: 'Gare créée.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  @ApiResponse({ status: 409, description: 'Code de gare déjà utilisé.' })
  create(
    @Body() createGareDto: CreateGareDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.garesService.create(
      createGareDto,
      this.getUtilisateurId(req),
      this.getAppareilId(req),
    );
  }

  // =====================================================
  // READ ALL
  // =====================================================

  @Get()
  @Permission('gares', 'READ')
  @ApiOperation({ summary: 'Lister les gares' })
  @ApiResponse({ status: 200, description: 'Liste des gares.' })
  findAll() {
    return this.garesService.findAll();
  }

  // =====================================================
  // READ ONE
  // =====================================================

  @Get(':id')
  @Permission('gares', 'READ')
  @ApiOperation({ summary: 'Consulter une gare' })
  @ApiResponse({ status: 200, description: 'Gare trouvée.' })
  @ApiResponse({ status: 404, description: 'Gare introuvable.' })
  findOne(@Param('id') id: string) {
    return this.garesService.findOne(id);
  }

  // =====================================================
  // UPDATE
  // =====================================================

  @Patch(':id')
  @Permission('gares', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier une gare',
    description:
      'Modifie une gare et enregistre les anciennes et nouvelles valeurs dans le journal d’audit.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 200, description: 'Gare modifiée.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  @ApiResponse({ status: 404, description: 'Gare introuvable.' })
  @ApiResponse({ status: 409, description: 'Code de gare déjà utilisé.' })
  update(
    @Param('id') id: string,
    @Body() updateGareDto: UpdateGareDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.garesService.update(
      id,
      updateGareDto,
      this.getUtilisateurId(req),
      this.getAppareilId(req),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  @Delete(':id')
  @Permission('gares', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une gare',
    description:
      'Supprime une gare et conserve son historique dans le journal d’audit.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 204, description: 'Gare supprimée.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  @ApiResponse({ status: 404, description: 'Gare introuvable.' })
  @ApiResponse({ status: 409, description: 'Gare encore utilisée.' })
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.garesService.remove(
      id,
      this.getUtilisateurId(req),
      this.getAppareilId(req),
    );
  }
}


import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';

import { CreateVehiculeCompletDto } from './dto/create-vehicule-complet.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { VehiculesService } from './vehicules.service';

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

@ApiTags('Véhicules')
@ApiBearerAuth()
@Controller('vehicules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehiculesController {
  constructor(
    private readonly vehiculesService: VehiculesService,
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

  private getGareIdForCreation(
    req: AuthenticatedRequest,
    data: CreateVehiculeCompletDto,
  ): string {
    const gareId =
      req.user.role === 'ADMIN'
        ? data.gareId
        : req.user.gareId;

    if (!gareId) {
      throw new ForbiddenException(
        'Une gare doit être associée au véhicule avant sa création.',
      );
    }

    return gareId;
  }

  // =====================================================
  // CREATE
  // =====================================================

  @Post()
  @Permission('vehicules', 'CREATE')
  @ApiOperation({
    summary: 'Créer un véhicule avec ses documents',
    description:
      'Crée un véhicule, ses documents et son entrée dans le journal d’audit dans une transaction unique.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 201, description: 'Véhicule créé.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission ou gare invalide.' })
  @ApiResponse({ status: 404, description: 'Propriétaire ou gare introuvable.' })
  @ApiResponse({ status: 409, description: 'Conflit de données.' })
  create(
    @Body() data: CreateVehiculeCompletDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const utilisateurId = this.getUtilisateurId(req);
    const appareilId = this.getAppareilId(req);
    const gareId = this.getGareIdForCreation(req, data);

    return this.vehiculesService.create(
      data,
      utilisateurId,
      gareId,
      appareilId,
    );
  }

  // =====================================================
  // READ ALL
  // =====================================================

  @Get()
  @Permission('vehicules', 'READ')
  @ApiOperation({
    summary: 'Récupérer les véhicules',
  })
  @ApiResponse({ status: 200, description: 'Liste des véhicules.' })
  findAll() {
    return this.vehiculesService.findAll();
  }

  // =====================================================
  // READ ONE
  // =====================================================

  @Get(':id')
  @Permission('vehicules', 'READ')
  @ApiOperation({
    summary: 'Récupérer un véhicule par son identifiant',
  })
  @ApiResponse({ status: 200, description: 'Véhicule trouvé.' })
  @ApiResponse({ status: 400, description: 'Identifiant UUID invalide.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.vehiculesService.findOne(id);
  }

  // =====================================================
  // UPDATE
  // =====================================================

  @Patch(':id')
  @Permission('vehicules', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier un véhicule',
    description:
      'Modifie un véhicule et enregistre les changements dans le journal d’audit.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 200, description: 'Véhicule modifié.' })
  @ApiResponse({ status: 400, description: 'Identifiant ou données invalides.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  @ApiResponse({ status: 409, description: 'Conflit de données.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.vehiculesService.update(
      id,
      updateVehiculeDto,
      this.getUtilisateurId(req),
      this.getAppareilId(req),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  @Delete(':id')
  @Permission('vehicules', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un véhicule',
    description:
      'Supprime un véhicule et conserve son historique dans le journal d’audit.',
  })
  @ApiHeader({
    name: 'x-device-id',
    required: false,
    description: 'Identifiant de l’appareil utilisé.',
  })
  @ApiResponse({ status: 204, description: 'Véhicule supprimé.' })
  @ApiResponse({ status: 400, description: 'Identifiant UUID invalide.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable.' })
  @ApiResponse({ status: 409, description: 'Véhicule utilisé dans une fiche.' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.vehiculesService.remove(
      id,
      this.getUtilisateurId(req),
      this.getAppareilId(req),
    );
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateVehiculeCompletDto } from './dto/create-vehicule-complet.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { VehiculesService } from './vehicules.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

@ApiTags('Véhicules')
@ApiBearerAuth()
@Controller('vehicules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehiculesController {
  constructor(
    private readonly vehiculesService: VehiculesService,
  ) {}

  // CREATE : ADMIN, RESPONSABLE_GARE, AGENT
  @Post()
  @Permission('vehicules', 'CREATE')
  @ApiOperation({
    summary: 'Créer un véhicule avec ses documents',
    description:
      'Crée un véhicule et au moins un document associé dans une seule transaction. Si la création du véhicule ou d’un document échoue, toute l’opération est annulée.',
  })
  @ApiResponse({
    status: 201,
    description: 'Véhicule et documents créés avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Données du véhicule ou des documents invalides.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Le rôle ne permet pas de créer un véhicule.',
  })
  @ApiResponse({
    status: 404,
    description: 'Propriétaire introuvable.',
  })
  @ApiResponse({
    status: 409,
    description:
      'La plaque d’immatriculation existe déjà ou aucun document valide n’a été fourni.',
  })
  create(@Body() data: CreateVehiculeCompletDto) {
    return this.vehiculesService.create(data);
  }

  // READ ALL : tous les rôles déclarés dans la matrice
  @Get()
  @Permission('vehicules', 'READ')
  @ApiOperation({
    summary: 'Récupérer tous les véhicules',
    description:
      'Retourne tous les véhicules avec leur propriétaire et leurs documents.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des véhicules.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Le rôle ne permet pas de lire les véhicules.',
  })
  findAll() {
    return this.vehiculesService.findAll();
  }

  // READ ONE : tous les rôles déclarés dans la matrice
  @Get(':id')
  @Permission('vehicules', 'READ')
  @ApiOperation({
    summary: 'Récupérer un véhicule par son ID',
    description:
      'Retourne un véhicule avec son propriétaire et ses documents.',
  })
  @ApiResponse({
    status: 200,
    description: 'Véhicule trouvé.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Le rôle ne permet pas de lire les véhicules.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
  })
  findOne(@Param('id') id: string) {
    return this.vehiculesService.findOne(id);
  }

  // UPDATE : ADMIN, RESPONSABLE_GARE, CONTROLEUR, AGENT
  @Patch(':id')
  @Permission('vehicules', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier un véhicule',
    description:
      'Modifie les informations du véhicule. La gestion détaillée des documents reste effectuée par le module Documents.',
  })
  @ApiResponse({
    status: 200,
    description: 'Véhicule modifié avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Le rôle ne permet pas de modifier un véhicule.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
  })
  @ApiResponse({
    status: 409,
    description: 'La plaque d’immatriculation existe déjà.',
  })
  update(
    @Param('id') id: string,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
  ) {
    return this.vehiculesService.update(id, updateVehiculeDto);
  }

  // DELETE : ADMIN, RESPONSABLE_GARE
  @Delete(':id')
  @Permission('vehicules', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un véhicule',
    description:
      'Supprime un véhicule. Les documents associés sont supprimés selon la relation configurée sur DocumentVehicule.',
  })
  @ApiResponse({
    status: 204,
    description: 'Véhicule supprimé.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Le rôle ne permet pas de supprimer un véhicule.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Impossible de supprimer le véhicule car il est utilisé dans une fiche.',
  })
  remove(@Param('id') id: string) {
    return this.vehiculesService.remove(id);
  }
}

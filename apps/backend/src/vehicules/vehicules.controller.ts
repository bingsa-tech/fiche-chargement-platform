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
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateVehiculeCompletDto } from './dto/create-vehicule-complet.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { VehiculesService } from './vehicules.service';

@ApiTags('Véhicules')
@Controller('vehicules')
export class VehiculesController {
  constructor(
    private readonly vehiculesService: VehiculesService,
  ) {}

  // =====================================================
  // CREATE
  // VÉHICULE + DOCUMENTS
  // =====================================================

  @Post()
  @ApiOperation({
    summary: 'Créer un véhicule avec ses documents',
    description:
      'Crée un véhicule et au moins un document associé dans une seule transaction. Si la création du véhicule ou d’un document échoue, toute l’opération est annulée.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Véhicule et documents créés avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données du véhicule ou des documents invalides.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Propriétaire introuvable.',
  })
  @ApiResponse({
    status: 409,
    description:
      'La plaque d’immatriculation existe déjà ou aucun document valide n’a été fourni.',
  })
  create(
    @Body() data: CreateVehiculeCompletDto,
  ) {
    return this.vehiculesService.create(data);
  }

  // =====================================================
  // READ ALL
  // =====================================================

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les véhicules',
    description:
      'Retourne tous les véhicules avec leur propriétaire et leurs documents.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des véhicules.',
  })
  findAll() {
    return this.vehiculesService.findAll();
  }

  // =====================================================
  // READ ONE
  // =====================================================

  @Get(':id')
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
    status: 404,
    description: 'Véhicule introuvable.',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.vehiculesService.findOne(id);
  }

  // =====================================================
  // UPDATE
  // =====================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un véhicule',
    description:
      'Modifie les informations du véhicule. La gestion détaillée des documents reste effectuée par le module Documents.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Véhicule modifié avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
  })
  @ApiResponse({
    status: 409,
    description:
      'La plaque d’immatriculation existe déjà.',
  })
  update(
    @Param('id') id: string,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
  ) {
    return this.vehiculesService.update(
      id,
      updateVehiculeDto,
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  @Delete(':id')
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
    status: 404,
    description: 'Véhicule introuvable.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Impossible de supprimer le véhicule car il est utilisé dans une fiche.',
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.vehiculesService.remove(id);
  }
}
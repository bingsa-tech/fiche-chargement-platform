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

import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { VehiculesService } from './vehicules.service';

@ApiTags('Véhicules')
@Controller('vehicules')
export class VehiculesController {
  constructor(
    private readonly vehiculesService: VehiculesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un véhicule',
  })
  @ApiResponse({
    status: 201,
    description: 'Véhicule créé avec succès.',
  })
  @ApiResponse({
    status: 409,
    description: 'La plaque d’immatriculation existe déjà.',
  })
  create(@Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculesService.create(
      createVehiculeDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les véhicules',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des véhicules.',
  })
  findAll() {
    return this.vehiculesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un véhicule par son ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Véhicule trouvé.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
  })
  findOne(@Param('id') id: string) {
    return this.vehiculesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un véhicule',
  })
  @ApiResponse({
    status: 200,
    description: 'Véhicule modifié avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Véhicule introuvable.',
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un véhicule',
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
  remove(@Param('id') id: string) {
    return this.vehiculesService.remove(id);
  }
}
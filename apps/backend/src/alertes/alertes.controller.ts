import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AlertesService } from './alertes.service';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { UpdateAlerteDto } from './dto/update-alerte.dto';

@ApiTags('Alertes')
@Controller('api/alertes')
export class AlertesController {
  constructor(
    private readonly alertesService: AlertesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une alerte documentaire',
  })
  @ApiResponse({
    status: 201,
    description: 'Alerte créée avec succès.',
  })
  create(@Body() createAlerteDto: CreateAlerteDto) {
    return this.alertesService.create(createAlerteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les alertes',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des alertes.',
  })
  findAll() {
    return this.alertesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerte trouvée.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alerte introuvable.',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.alertesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlerteDto: UpdateAlerteDto,
  ) {
    return this.alertesService.update(
      id,
      updateAlerteDto,
    );
  }

  @Patch(':id/lue')
  @ApiOperation({
    summary: 'Marquer une alerte comme lue',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  marquerCommeLue(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('utilisateurLecture') utilisateurLecture: number,
  ) {
    return this.alertesService.marquerCommeLue(
      id,
      utilisateurLecture,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerte supprimée.',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.alertesService.remove(id);
  }
}
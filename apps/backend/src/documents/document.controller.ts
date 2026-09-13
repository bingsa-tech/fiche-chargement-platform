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

import { DocumentsService } from './document.service';

@ApiTags('Documents')
@Controller('api/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  // =====================================================
  // DOCUMENTS VEHICULE
  // =====================================================

  @Get('vehicules')
  @ApiOperation({
    summary: 'Lister les documents des véhicules',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des documents véhicules',
  })
  findAllVehicules() {
    return this.documentsService.findAllVehicule();
  }

  @Get('vehicules/:id')
  @ApiOperation({
    summary: 'Obtenir un document véhicule',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document véhicule',
  })
  @ApiResponse({
    status: 200,
    description: 'Document véhicule trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Document véhicule introuvable',
  })
  findOneVehicule(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.documentsService.findOneVehicule(id);
  }

  @Post('vehicules')
  @ApiOperation({
    summary: 'Créer un document véhicule',
  })
  @ApiResponse({
    status: 201,
    description: 'Document véhicule créé',
  })
  createVehicule(@Body() data: any) {
    return this.documentsService.createVehicule(data);
  }

  @Patch('vehicules/:id')
  @ApiOperation({
    summary: 'Modifier un document véhicule',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document véhicule',
  })
  updateVehicule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: any,
  ) {
    return this.documentsService.updateVehicule(id, data);
  }

  @Delete('vehicules/:id')
  @ApiOperation({
    summary: 'Supprimer un document véhicule',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document véhicule',
  })
  @ApiResponse({
    status: 200,
    description: 'Document véhicule supprimé',
  })
  removeVehicule(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.documentsService.removeVehicule(id);
  }

  // =====================================================
  // DOCUMENTS CHAUFFEUR
  // =====================================================

  @Get('chauffeurs')
  @ApiOperation({
    summary: 'Lister les documents des chauffeurs',
  })
  findAllChauffeurs() {
    return this.documentsService.findAllChauffeur();
  }

  @Get('chauffeurs/:id')
  @ApiOperation({
    summary: 'Obtenir un document chauffeur',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document chauffeur',
  })
  findOneChauffeur(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.documentsService.findOneChauffeur(id);
  }

  @Post('chauffeurs')
  @ApiOperation({
    summary: 'Créer un document chauffeur',
  })
  createChauffeur(@Body() data: any) {
    return this.documentsService.createChauffeur(data);
  }

  @Patch('chauffeurs/:id')
  @ApiOperation({
    summary: 'Modifier un document chauffeur',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document chauffeur',
  })
  updateChauffeur(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: any,
  ) {
    return this.documentsService.updateChauffeur(id, data);
  }

  @Delete('chauffeurs/:id')
  @ApiOperation({
    summary: 'Supprimer un document chauffeur',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document chauffeur',
  })
  removeChauffeur(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.documentsService.removeChauffeur(id);
  }



}

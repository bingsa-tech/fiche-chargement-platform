import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateDocumentVehiculeDto } from './dto/create-document-vehicule.dto';
import { UpdateDocumentVehiculeDto } from './dto/update-document-vehicule.dto';

import { CreateDocumentChauffeurDto } from './dto/create-document-chauffeur.dto';
import { UpdateDocumentChauffeurDto } from './dto/update-document-chauffeur.dto';

import { DocumentsService } from './document.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
} from '../config/permissions.config';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('api/documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  // =====================================================
  // DOCUMENTS VEHICULE
  // =====================================================

  @Get('vehicules')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.READ,
  )
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
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.READ,
  )
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
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.CREATE,
  )
  @ApiOperation({
    summary: 'Créer un document véhicule',
  })
  @ApiResponse({
    status: 201,
    description: 'Document véhicule créé',
  })
  createVehicule(
    @Body() data: CreateDocumentVehiculeDto,
  ) {
    return this.documentsService.createVehicule(data);
  }

  @Patch('vehicules/:id')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.UPDATE,
  )
  @ApiOperation({
    summary: 'Modifier un document véhicule',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document véhicule',
  })
  updateVehicule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateDocumentVehiculeDto,
  ) {
    return this.documentsService.updateVehicule(
      id,
      data,
    );
  }

  @Delete('vehicules/:id')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.DELETE,
  )
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
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Lister les documents des chauffeurs',
  })
  findAllChauffeurs() {
    return this.documentsService.findAllChauffeur();
  }

  @Get('chauffeurs/:id')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.READ,
  )
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
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.CREATE,
  )
  @ApiOperation({
    summary: 'Créer un document chauffeur supplémentaire',
  })
  createChauffeur(
    @Body() data: CreateDocumentChauffeurDto,
  ) {
    return this.documentsService.createChauffeur(data);
  }

  @Patch('chauffeurs/:id')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.UPDATE,
  )
  @ApiOperation({
    summary: 'Modifier un document chauffeur',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du document chauffeur',
  })
  updateChauffeur(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateDocumentChauffeurDto,
  ) {
    return this.documentsService.updateChauffeur(
      id,
      data,
    );
  }

  @Delete('chauffeurs/:id')
  @Permission(
    PERMISSION_RESOURCES.DOCUMENTS,
    PERMISSION_ACTIONS.DELETE,
  )
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
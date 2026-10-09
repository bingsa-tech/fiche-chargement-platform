import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

import { ItinerairesService } from './itineraires.service';
import { CreateItineraireDto } from './dto/create-itineraire.dto';
import { UpdateItineraireDto } from './dto/update-itineraire.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

@ApiTags('Itinéraires')
@ApiBearerAuth()
@Controller('api/itineraires')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ItinerairesController {
  constructor(
    private readonly itinerairesService: ItinerairesService,
  ) {}

  // CREATE : selon la matrice RBAC
  @Post()
  @Permission('itineraires', 'CREATE')
  @ApiOperation({
    summary: 'Créer un itinéraire',
  })
  @ApiResponse({
    status: 201,
    description: 'Itinéraire créé avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour créer un itinéraire.',
  })
  @ApiResponse({
    status: 409,
    description: 'Le code existe déjà pour cette destination.',
  })
  create(
    @Body() createItineraireDto: CreateItineraireDto,
  ) {
    return this.itinerairesService.create(createItineraireDto);
  }

  // READ : selon la matrice RBAC
  @Get()
  @Permission('itineraires', 'READ')
  @ApiOperation({
    summary: 'Lister les itinéraires',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des itinéraires.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les itinéraires.',
  })
  findAll() {
    return this.itinerairesService.findAll();
  }

  @Get(':id')
  @Permission('itineraires', 'READ')
  @ApiOperation({
    summary: 'Obtenir un itinéraire par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’itinéraire',
  })
  @ApiResponse({
    status: 200,
    description: 'Itinéraire trouvé.',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les itinéraires.',
  })
  @ApiResponse({
    status: 404,
    description: 'Itinéraire introuvable.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.itinerairesService.findOne(id);
  }

  // UPDATE : selon la matrice RBAC
  @Patch(':id')
  @Permission('itineraires', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier un itinéraire',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’itinéraire',
  })
  @ApiResponse({
    status: 200,
    description: 'Itinéraire modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour modifier un itinéraire.',
  })
  @ApiResponse({
    status: 404,
    description: 'Itinéraire introuvable.',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItineraireDto: UpdateItineraireDto,
  ) {
    return this.itinerairesService.update(id, updateItineraireDto);
  }

  // DELETE : selon la matrice RBAC
  @Delete(':id')
  @Permission('itineraires', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un itinéraire',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’itinéraire',
  })
  @ApiResponse({
    status: 204,
    description: 'Itinéraire supprimé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour supprimer un itinéraire.',
  })
  @ApiResponse({
    status: 404,
    description: 'Itinéraire introuvable.',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.itinerairesService.remove(id);
  }
}

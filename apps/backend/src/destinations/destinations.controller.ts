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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

@ApiTags('Destinations')
@ApiBearerAuth()
@Controller('api/destinations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DestinationsController {
  constructor(
    private readonly destinationsService: DestinationsService,
  ) {}

  // CREATE : ADMIN, RESPONSABLE_GARE, AGENT
  @Post()
  @Permission('destinations', 'CREATE')
  @ApiOperation({
    summary: 'Créer une destination',
  })
  @ApiResponse({
    status: 201,
    description: 'Destination créée avec succès.',
    type: Destination,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour créer une destination.',
  })
  @ApiResponse({
    status: 409,
    description: 'Le code de destination existe déjà.',
  })
  create(
    @Body() createDestinationDto: CreateDestinationDto,
  ) {
    return this.destinationsService.create(createDestinationDto);
  }

  // READ : rôles autorisés par la matrice RBAC
  @Get()
  @Permission('destinations', 'READ')
  @ApiOperation({
    summary: 'Lister toutes les destinations',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des destinations.',
    type: [Destination],
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les destinations.',
  })
  findAll() {
    return this.destinationsService.findAll();
  }

  @Get(':id')
  @Permission('destinations', 'READ')
  @ApiOperation({
    summary: 'Obtenir une destination par son ID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la destination',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Destination trouvée.',
    type: Destination,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les destinations.',
  })
  @ApiResponse({
    status: 404,
    description: 'Destination introuvable.',
  })
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  // UPDATE : selon la matrice RBAC existante
  @Patch(':id')
  @Permission('destinations', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier une destination',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la destination',
  })
  @ApiResponse({
    status: 200,
    description: 'Destination modifiée.',
    type: Destination,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour modifier une destination.',
  })
  @ApiResponse({
    status: 404,
    description: 'Destination introuvable.',
  })
  @ApiResponse({
    status: 409,
    description: 'Le code de destination existe déjà.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  // DELETE : selon la matrice RBAC existante
  @Delete(':id')
  @Permission('destinations', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une destination',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la destination',
  })
  @ApiResponse({
    status: 204,
    description: 'Destination supprimée.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide.',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour supprimer une destination.',
  })
  @ApiResponse({
    status: 404,
    description: 'Destination introuvable.',
  })
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }
}

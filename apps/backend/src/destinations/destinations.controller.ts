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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';

@ApiTags('Destinations')
@Controller('api/destinations')
export class DestinationsController {
  constructor(
    private readonly destinationsService: DestinationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une destination',
  })
  @ApiResponse({
    status: 201,
    description: 'Destination créée avec succès.',
    type: Destination,
  })
  @ApiResponse({
    status: 409,
    description: 'Le code de destination existe déjà.',
  })
  create(
    @Body() createDestinationDto: CreateDestinationDto,
  ) {
    return this.destinationsService.create(
      createDestinationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les destinations',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des destinations.',
    type: [Destination],
  })
  findAll() {
    return this.destinationsService.findAll();
  }

  @Get(':id')
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
    status: 404,
    description: 'Destination introuvable.',
  })
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  @Patch(':id')
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
    return this.destinationsService.update(
      id,
      updateDestinationDto,
    );
  }

  @Delete(':id')
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
    status: 404,
    description: 'Destination introuvable.',
  })
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }
}
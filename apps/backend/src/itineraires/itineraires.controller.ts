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

import { ItinerairesService } from './itineraires.service';
import { CreateItineraireDto } from './dto/create-itineraire.dto';
import { UpdateItineraireDto } from './dto/update-itineraire.dto';

@ApiTags('Itinéraires')
@Controller('api/itineraires')
export class ItinerairesController {
  constructor(
    private readonly itinerairesService: ItinerairesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un itinéraire',
  })
  @ApiResponse({
    status: 201,
    description: 'Itinéraire créé avec succès.',
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

  @Get()
  @ApiOperation({
    summary: 'Lister les itinéraires',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des itinéraires.',
  })
  findAll() {
    return this.itinerairesService.findAll();
  }

  @Get(':id')
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
    status: 404,
    description: 'Itinéraire introuvable.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.itinerairesService.findOne(id);
  }

  @Patch(':id')
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
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItineraireDto: UpdateItineraireDto,
  ) {
    return this.itinerairesService.update(
      id,
      updateItineraireDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un itinéraire',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’itinéraire',
  })
  @ApiResponse({
    status: 200,
    description: 'Itinéraire supprimé avec succès.',
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
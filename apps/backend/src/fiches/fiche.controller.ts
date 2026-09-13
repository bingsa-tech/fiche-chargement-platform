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

import { FicheService } from './fiche.service';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';

@ApiTags('Fiches')
@Controller('api/fiches')
export class FicheController {
  constructor(
    private readonly ficheService: FicheService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une fiche de chargement',
  })
  @ApiResponse({
    status: 201,
    description: 'Fiche créée avec succès',
  })
  create(@Body() createFicheDto: CreateFicheDto) {
    return this.ficheService.create(createFicheDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les fiches',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des fiches',
  })
  findAll() {
    return this.ficheService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir une fiche par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche trouvée',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ficheService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier une fiche',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFicheDto: UpdateFicheDto,
  ) {
    return this.ficheService.update(
      id,
      updateFicheDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche supprimée',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ficheService.remove(id);
  }
}
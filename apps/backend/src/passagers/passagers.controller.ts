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

import { PassagersService } from './passagers.service';
import { CreatePassagerDto } from './dto/create-passager.dto';
import { UpdatePassagerDto } from './dto/update-passager.dto';

@ApiTags('Passagers')
@Controller('api/passagers')
export class PassagersController {
  constructor(
    private readonly passagersService: PassagersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un passager',
  })
  @ApiResponse({
    status: 201,
    description: 'Passager créé avec succès',
  })
  @ApiResponse({
    status: 409,
    description: 'Le numéro de CNI existe déjà',
  })
  create(
    @Body() createPassagerDto: CreatePassagerDto,
  ) {
    return this.passagersService.create(createPassagerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les passagers',
  })
  findAll() {
    return this.passagersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un passager',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID du passager',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Passager trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Passager introuvable',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.passagersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier un passager',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePassagerDto: UpdatePassagerDto,
  ) {
    return this.passagersService.update(
      id,
      updatePassagerDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un passager',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Passager supprimé',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    await this.passagersService.remove(id);
  }
}
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

import { FichePassagersService } from './fiche-passagers.service';
import { CreateFichePassagerDto } from './dto/create-fiche-passager.dto';
import { UpdateFichePassagerDto } from './dto/update-fiche-passager.dto';

@ApiTags('Fiche Passagers')
@Controller('api/fiche-passagers')
export class FichePassagersController {
  constructor(
    private readonly fichePassagersService: FichePassagersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Associer un passager à une fiche',
  })
  @ApiResponse({
    status: 201,
    description: 'Passager associé à la fiche',
  })
  create(@Body() createDto: CreateFichePassagerDto) {
    return this.fichePassagersService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les associations fiche/passager',
  })
  findAll() {
    return this.fichePassagersService.findAll();
  }

  @Get('fiche/:ficheId')
  @ApiOperation({
    summary: 'Lister les passagers d’une fiche',
  })
  @ApiParam({
    name: 'ficheId',
    format: 'uuid',
  })
  findByFiche(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
  ) {
    return this.fichePassagersService.findByFiche(ficheId);
  }

  @Get(':ficheId/:passagerId')
  @ApiOperation({
    summary: 'Obtenir une association fiche/passager',
  })
  findOne(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
  ) {
    return this.fichePassagersService.findOne(
      ficheId,
      passagerId,
    );
  }

  @Patch(':ficheId/:passagerId')
  @ApiOperation({
    summary: 'Modifier le numéro de place',
  })
  update(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
    @Body() updateDto: UpdateFichePassagerDto,
  ) {
    return this.fichePassagersService.update(
      ficheId,
      passagerId,
      updateDto,
    );
  }

  @Delete(':ficheId/:passagerId')
  @ApiOperation({
    summary: 'Retirer un passager d’une fiche',
  })
  remove(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
  ) {
    return this.fichePassagersService.remove(
      ficheId,
      passagerId,
    );
  }
}
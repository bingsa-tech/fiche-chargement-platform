
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

import { CreateProprietaireDto } from './dto/create-proprietaire.dto';
import { UpdateProprietaireDto } from './dto/update-proprietaire.dto';
import { ProprietairesService } from './proprietaires.service';

@ApiTags('Propriétaires')
@ApiBearerAuth()
@Controller('proprietaires')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProprietairesController {
  constructor(
    private readonly proprietairesService: ProprietairesService,
  ) {}

  @Post()
  @Permission('proprietaires', 'CREATE')
  create(
    @Body() createProprietaireDto: CreateProprietaireDto,
  ) {
    return this.proprietairesService.create(
      createProprietaireDto,
    );
  }

  @Get()
  @Permission('proprietaires', 'READ')
  findAll() {
    return this.proprietairesService.findAll();
  }

  @Get(':id')
  @Permission('proprietaires', 'READ')
  findOne(@Param('id') id: string) {
    return this.proprietairesService.findOne(id);
  }

  @Patch(':id')
  @Permission('proprietaires', 'UPDATE')
  update(
    @Param('id') id: string,
    @Body() updateProprietaireDto: UpdateProprietaireDto,
  ) {
    return this.proprietairesService.update(
      id,
      updateProprietaireDto,
    );
  }

  @Delete(':id')
  @Permission('proprietaires', 'DELETE')
  remove(@Param('id') id: string) {
    return this.proprietairesService.remove(id);
  }
}

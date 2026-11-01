import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

import { AlertesService } from './alertes.service';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { UpdateAlerteDto } from './dto/update-alerte.dto';

@ApiTags('Alertes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('alertes')
export class AlertesController {
  constructor(
    private readonly alertesService: AlertesService,
  ) {}

  @Post()
  @Permission('alertes', 'CREATE')
  @ApiOperation({
    summary: 'Créer une alerte documentaire',
  })
  @ApiResponse({
    status: 201,
    description: 'Alerte créée avec succès.',
  })
  create(@Body() createAlerteDto: CreateAlerteDto) {
    return this.alertesService.create(createAlerteDto);
  }

  @Get()
  @Permission('alertes', 'READ')
  @ApiOperation({
    summary: 'Lister toutes les alertes',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des alertes.',
  })
  findAll() {
    return this.alertesService.findAll();
  }

  @Get(':id')
  @Permission('alertes', 'READ')
  @ApiOperation({
    summary: 'Récupérer une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerte trouvée.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alerte introuvable.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertesService.findOne(id);
  }

  @Patch(':id')
  @Permission('alertes', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlerteDto: UpdateAlerteDto,
  ) {
    return this.alertesService.update(id, updateAlerteDto);
  }

  @Patch(':id/lue')
  @Permission('alertes', 'PROCESS')
  @ApiOperation({
    summary: 'Marquer une alerte comme lue',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerte marquée comme lue.',
  })
  marquerCommeLue(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { id: number } },
  ) {
    return this.alertesService.marquerCommeLue(
      id,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une alerte',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’alerte',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerte supprimée.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertesService.remove(id);
  }
}

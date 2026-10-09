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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateGareDto } from './dto/create-gare.dto';
import { UpdateGareDto } from './dto/update-gare.dto';
import { GaresService } from './gares.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

@ApiTags('Gares')
@ApiBearerAuth()
@Controller('gares')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GaresController {
  constructor(
    private readonly garesService: GaresService,
  ) {}

  @Post()
  @Permission('gares', 'CREATE')
  @ApiOperation({ summary: 'Créer une gare' })
  @ApiResponse({ status: 201, description: 'Gare créée.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  create(@Body() createGareDto: CreateGareDto) {
    return this.garesService.create(createGareDto);
  }

  @Get()
  @Permission('gares', 'READ')
  @ApiOperation({ summary: 'Lister les gares' })
  @ApiResponse({ status: 200, description: 'Liste des gares.' })
  findAll() {
    return this.garesService.findAll();
  }

  @Get(':id')
  @Permission('gares', 'READ')
  @ApiOperation({ summary: 'Consulter une gare' })
  @ApiResponse({ status: 200, description: 'Gare trouvée.' })
  @ApiResponse({ status: 404, description: 'Gare introuvable.' })
  findOne(@Param('id') id: string) {
    return this.garesService.findOne(id);
  }

  @Patch(':id')
  @Permission('gares', 'UPDATE')
  @ApiOperation({ summary: 'Modifier une gare' })
  @ApiResponse({ status: 200, description: 'Gare modifiée.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  update(
    @Param('id') id: string,
    @Body() updateGareDto: UpdateGareDto,
  ) {
    return this.garesService.update(id, updateGareDto);
  }

  @Delete(':id')
  @Permission('gares', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une gare' })
  @ApiResponse({ status: 204, description: 'Gare supprimée.' })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Permission refusée.' })
  remove(@Param('id') id: string) {
    return this.garesService.remove(id);
  }
}

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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateChauffeurDto } from './dto/create-chauffeur.dto';
import { UpdateChauffeurDto } from './dto/update-chauffeur.dto';
import { ChauffeursService } from './chauffeurs.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import {
  PERMISSION_RESOURCES,
  PERMISSION_ACTIONS,
} from '../config/permissions.config';

@ApiTags('Chauffeurs')
@ApiBearerAuth()
@Controller('chauffeurs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChauffeursController {
  constructor(
    private readonly chauffeursService: ChauffeursService,
  ) {}

  // ============================================================
  // POST /chauffeurs
  // Création d'un chauffeur + son document obligatoire
  // ============================================================

  @Post()
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.CREATE,
  )
  create(
    @Body() createChauffeurDto: CreateChauffeurDto,
  ) {
    return this.chauffeursService.create(
      createChauffeurDto,
    );
  }

  // ============================================================
  // GET /chauffeurs
  // ============================================================

  @Get()
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.READ,
  )
  findAll() {
    return this.chauffeursService.findAll();
  }

  // ============================================================
  // GET /chauffeurs/:id
  // ============================================================

  @Get(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.READ,
  )
  findOne(
    @Param('id') id: string,
  ) {
    return this.chauffeursService.findOne(id);
  }

  // ============================================================
  // PATCH /chauffeurs/:id
  // ============================================================

  @Patch(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() updateChauffeurDto: UpdateChauffeurDto,
  ) {
    return this.chauffeursService.update(
      id,
      updateChauffeurDto,
    );
  }

  // ============================================================
  // DELETE /chauffeurs/:id
  // ============================================================

  @Delete(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.DELETE,
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
  ) {
    return this.chauffeursService.remove(id);
  }
}
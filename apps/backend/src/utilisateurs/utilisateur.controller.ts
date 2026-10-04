import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { UtilisateursService } from './utilisateur.service';

import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

import { Permission } from '../auth/decorators/permission.decorator';

import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
} from '../config/permissions.config';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(
    private readonly utilisateursService: UtilisateursService,
  ) {}

  // =====================================================
  // CREATE
  // ADMIN + RESPONSABLE_GARE
  // =====================================================

  @Post()
  @Permission(
    PERMISSION_RESOURCES.UTILISATEURS,
    PERMISSION_ACTIONS.CREATE,
  )
  create(
    @Body()
    createUtilisateurDto: CreateUtilisateurDto,

    @Req()
    req: any,
  ) {
    return this.utilisateursService.create(
      createUtilisateurDto,
      req.user,
    );
  }

  // =====================================================
  // FIND ALL
  // ADMIN + RESPONSABLE_GARE
  // =====================================================

  @Get()
  @Permission(
    PERMISSION_RESOURCES.UTILISATEURS,
    PERMISSION_ACTIONS.READ,
  )
  findAll() {
    return this.utilisateursService.findAll();
  }

  // =====================================================
  // FIND ONE
  // ADMIN + RESPONSABLE_GARE
  // =====================================================

  @Get(':id')
  @Permission(
    PERMISSION_RESOURCES.UTILISATEURS,
    PERMISSION_ACTIONS.READ,
  )
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.utilisateursService.findOne(id);
  }

  // =====================================================
  // UPDATE
  // ADMIN selon la matrice actuelle
  // =====================================================

  @Patch(':id')
  @Permission(
    PERMISSION_RESOURCES.UTILISATEURS,
    PERMISSION_ACTIONS.UPDATE,
  )
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateursService.update(
      id,
      updateUtilisateurDto,
    );
  }

  // =====================================================
  // DELETE
  // ADMIN selon la matrice actuelle
  // =====================================================

  @Delete(':id')
  @Permission(
    PERMISSION_RESOURCES.UTILISATEURS,
    PERMISSION_ACTIONS.DELETE,
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<void> {
    await this.utilisateursService.remove(id);
  }
}
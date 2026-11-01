
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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
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

type UtilisateurAuthentifie = {
  id: number;
  username: string;
  role: string;
  gareId: string | null;
};

type RequeteAuthentifiee = Request & {
  user: UtilisateurAuthentifie;
};

@ApiTags('Chauffeurs')
@ApiBearerAuth()
@Controller('chauffeurs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChauffeursController {
  constructor(
    private readonly chauffeursService: ChauffeursService,
  ) {}

  // POST /chauffeurs
  // ADMIN choisit la gare ; les autres rôles utilisent leur gare.
  @Post()
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.CREATE,
  )
  create(
    @Body() createChauffeurDto: CreateChauffeurDto,
    @Req() req: RequeteAuthentifiee,
  ) {
    return this.chauffeursService.create(
      createChauffeurDto,
      req.user,
    );
  }

  // GET /chauffeurs
  @Get()
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.READ,
  )
  findAll(@Req() req: RequeteAuthentifiee) {
    return this.chauffeursService.findAll(req.user);
  }

  // GET /chauffeurs/:id
  @Get(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.READ,
  )
  findOne(
    @Param('id') id: string,
    @Req() req: RequeteAuthentifiee,
  ) {
    return this.chauffeursService.findOne(id, req.user);
  }

  // PATCH /chauffeurs/:id
  @Patch(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.UPDATE,
  )
  update(
    @Param('id') id: string,
    @Body() updateChauffeurDto: UpdateChauffeurDto,
    @Req() req: RequeteAuthentifiee,
  ) {
    return this.chauffeursService.update(
      id,
      updateChauffeurDto,
      req.user,
    );
  }

  // DELETE /chauffeurs/:id
  @Delete(':id')
  @Permission(
    PERMISSION_RESOURCES.CHAUFFEURS,
    PERMISSION_ACTIONS.DELETE,
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Req() req: RequeteAuthentifiee,
  ) {
    return this.chauffeursService.remove(id, req.user);
  }
}

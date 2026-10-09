import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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

import { Request } from 'express';

import { FicheImpressionsService } from './fiche-impressions.service';
import { CreateFicheImpressionDto } from './dto/create-fiche-impression.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

import { Permission } from '../auth/decorators/permission.decorator';

import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
} from '../config/permissions.config';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: string;
    gareId: string | null;
  };
}

@ApiTags('Fiche Impressions')
@ApiBearerAuth()
@Controller('api/fiche-impressions')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class FicheImpressionsController {
  constructor(
    private readonly ficheImpressionsService: FicheImpressionsService,
  ) {}

  // =====================================================
  // CRÉER UNE IMPRESSION
  // =====================================================

  @Post()
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.FINALIZE,
  )
  @ApiOperation({
    summary: 'Enregistrer une impression de fiche',
  })
  @ApiResponse({
    status: 201,
    description: 'Impression enregistrée',
  })
  create(
    @Body()
    createDto: CreateFicheImpressionDto,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.ficheImpressionsService.create(
      createDto,
      request.user.id,
    );
  }

  // =====================================================
  // LISTER LES IMPRESSIONS
  // =====================================================

  @Get()
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Lister les impressions',
  })
  findAll() {
    return this.ficheImpressionsService.findAll();
  }

  // =====================================================
  // IMPRESSIONS D'UNE FICHE
  // =====================================================

  @Get('fiche/:ficheId')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Lister les impressions d’une fiche',
  })
  @ApiParam({
    name: 'ficheId',
    format: 'uuid',
  })
  findByFiche(
    @Param(
      'ficheId',
      new ParseUUIDPipe(),
    )
    ficheId: string,
  ) {
    return this.ficheImpressionsService.findByFiche(
      ficheId,
    );
  }

  // =====================================================
  // UNE IMPRESSION
  // =====================================================

  @Get(':id')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Obtenir une impression',
  })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,
  ) {
    return this.ficheImpressionsService.findOne(id);
  }
}
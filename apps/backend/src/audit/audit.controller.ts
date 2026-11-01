
import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuditService } from './audit.service';
import { FilterAuditDto } from './dto/filter-audit.dto';
import { AuditResponseDto } from './dto/audit-response.dto';
import { AuditPaginatedResponseDto } from './dto/audit-paginated-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    username: string;
    role: string;
    gareId: string | null;
  };
}

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Permission('audit', 'READ')
  @ApiOperation({
    summary: 'Consulter le journal des opérations',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements récupérée.',
    type: AuditPaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async findAll(
    @Query() filters: FilterAuditDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AuditPaginatedResponseDto> {
    return this.auditService.findAll(filters, req.user);
  }

  @Get(':id')
  @Permission('audit', 'READ')
  @ApiOperation({
    summary: 'Consulter le détail d’un événement d’audit',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’événement',
  })
  @ApiResponse({
    status: 200,
    description: 'Événement récupéré avec succès.',
    type: AuditResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentification requise.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  @ApiResponse({ status: 404, description: 'Événement introuvable.' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AuditResponseDto> {
    return this.auditService.findOne(id, req.user);
  }
}


import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

import { PassagersService } from './passagers.service';
import { CreatePassagerDto } from './dto/create-passager.dto';
import { UpdatePassagerDto } from './dto/update-passager.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

interface AuthenticatedRequest {
  user: {
    sub: number;
  };
  headers: {
    'x-device-id'?: string | string[];
  };
}

@ApiTags('Passagers')
@ApiBearerAuth()
@Controller('passagers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PassagersController {
  constructor(
    private readonly passagersService: PassagersService,
  ) {}

  /**
   * CREATE
   */
  @Post()
  @Permission('passagers', 'CREATE')
  @ApiOperation({
    summary: 'Créer un passager',
  })
  @ApiResponse({
    status: 201,
    description: 'Passager créé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour créer un passager',
  })
  @ApiResponse({
    status: 409,
    description: 'Le numéro de CNI existe déjà',
  })
  create(
    @Body() createPassagerDto: CreatePassagerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.passagersService.create(
      createPassagerDto,
      req.user.sub,
      this.getDeviceId(req),
    );
  }

  /**
   * READ ALL
   */
  @Get()
  @Permission('passagers', 'READ')
  @ApiOperation({
    summary: 'Lister tous les passagers',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des passagers',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les passagers',
  })
  findAll() {
    return this.passagersService.findAll();
  }

  /**
   * READ ONE
   */
  @Get(':id')
  @Permission('passagers', 'READ')
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
    status: 400,
    description: 'Identifiant UUID invalide',
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

  /**
   * UPDATE
   */
  @Patch(':id')
  @Permission('passagers', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier un passager',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Passager modifié avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide',
  })
  @ApiResponse({
    status: 404,
    description: 'Passager introuvable',
  })
  @ApiResponse({
    status: 409,
    description: 'Le numéro de CNI est déjà utilisé',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePassagerDto: UpdatePassagerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.passagersService.update(
      id,
      updatePassagerDto,
      req.user.sub,
      this.getDeviceId(req),
    );
  }

  /**
   * DELETE
   */
  @Delete(':id')
  @Permission('passagers', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un passager',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Passager supprimé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide',
  })
  @ApiResponse({
    status: 404,
    description: 'Passager introuvable',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.passagersService.remove(
      id,
      req.user.sub,
      this.getDeviceId(req),
    );
  }

  /**
   * Récupération de l'identifiant de l'appareil.
   */
  private getDeviceId(
    req: AuthenticatedRequest,
  ): string | null {
    const deviceId = req.headers['x-device-id'];

    if (Array.isArray(deviceId)) {
      return deviceId[0]?.trim() || null;
    }

    return deviceId?.trim() || null;
  }
}

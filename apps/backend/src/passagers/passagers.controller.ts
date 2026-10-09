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

@ApiTags('Passagers')
@ApiBearerAuth()
@Controller('api/passagers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PassagersController {
  constructor(
    private readonly passagersService: PassagersService,
  ) {}

  // CREATE : selon permissions.config.ts
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
  ) {
    return this.passagersService.create(createPassagerDto);
  }

  // READ : selon permissions.config.ts
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
    status: 401,
    description: 'Authentification requise ou jeton invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour lire les passagers',
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

  // UPDATE : selon permissions.config.ts
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
    description: 'Passager modifié',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour modifier un passager',
  })
  @ApiResponse({
    status: 404,
    description: 'Passager introuvable',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePassagerDto: UpdatePassagerDto,
  ) {
    return this.passagersService.update(id, updatePassagerDto);
  }

  // DELETE : selon permissions.config.ts
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
    description: 'Passager supprimé',
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiant UUID invalide',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentification requise ou jeton invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante pour supprimer un passager',
  })
  @ApiResponse({
    status: 404,
    description: 'Passager introuvable',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    await this.passagersService.remove(id);
  }
}

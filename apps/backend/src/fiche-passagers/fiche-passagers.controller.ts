
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

import {
  FichePassagersService,
  FichePassagerUser,
} from './fiche-passagers.service';

import { CreateFichePassagerDto } from './dto/create-fiche-passager.dto';
import { UpdateFichePassagerDto } from './dto/update-fiche-passager.dto';

type AuthenticatedRequest = {
  user: FichePassagerUser;
};

@ApiTags('Fiche Passagers')
@ApiBearerAuth()
@Controller('api/fiche-passagers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FichePassagersController {
  constructor(
    private readonly fichePassagersService: FichePassagersService,
  ) {}

  @Post()
  @Permission('fiches', 'CREATE')
  @ApiOperation({
    summary: 'Associer un passager à une fiche',
  })
  @ApiResponse({
    status: 201,
    description: 'Passager associé à la fiche',
  })
  create(
    @Body() createDto: CreateFichePassagerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fichePassagersService.create(createDto, req.user);
  }

  @Get()
  @Permission('fiches', 'READ')
  @ApiOperation({
    summary: 'Lister les associations fiche/passager',
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.fichePassagersService.findAll(req.user);
  }

  @Get('fiche/:ficheId')
  @Permission('fiches', 'READ')
  @ApiOperation({
    summary: 'Lister les passagers d’une fiche',
  })
  @ApiParam({
    name: 'ficheId',
    format: 'uuid',
  })
  findByFiche(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fichePassagersService.findByFiche(ficheId, req.user);
  }

  @Get(':ficheId/:passagerId')
  @Permission('fiches', 'READ')
  @ApiOperation({
    summary: 'Obtenir une association fiche/passager',
  })
  findOne(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fichePassagersService.findOne(
      ficheId,
      passagerId,
      req.user,
    );
  }

  @Patch(':ficheId/:passagerId')
  @Permission('fiches', 'UPDATE')
  @ApiOperation({
    summary: 'Modifier le numéro de place',
  })
  update(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
    @Body() updateDto: UpdateFichePassagerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fichePassagersService.update(
      ficheId,
      passagerId,
      updateDto,
      req.user,
    );
  }

  @Delete(':ficheId/:passagerId')
  @Permission('fiches', 'UPDATE')
  @ApiOperation({
    summary: 'Retirer un passager d’une fiche',
  })
  remove(
    @Param('ficheId', new ParseUUIDPipe()) ficheId: string,
    @Param('passagerId', new ParseUUIDPipe()) passagerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.fichePassagersService.remove(
      ficheId,
      passagerId,
      req.user,
    );
  }
}

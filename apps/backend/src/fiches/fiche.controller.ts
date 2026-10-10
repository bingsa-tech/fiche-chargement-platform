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
  Res,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FicheService } from './fiche.service';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';
import { ImprimerFicheDto } from '../fiche-impressions/dto/imprimer-fiche.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import { Response } from 'express';
import { BordereauPdfService } from '../fiche-impressions/bordereau-pdf.service';
import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
} from '../config/permissions.config';

@ApiTags('Fiches')
@ApiBearerAuth()
@Controller('api/fiches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FicheController {
  constructor(
    private readonly ficheService: FicheService,
    private readonly bordereauPdfService: BordereauPdfService,
  ) {}

  // =====================================================
  // CRÉER UNE FICHE
  // =====================================================

  @Post()
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.CREATE,
  )
  @ApiOperation({
    summary: 'Créer une fiche de chargement',
  })
  @ApiResponse({
    status: 201,
    description: 'Fiche créée avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou gare non autorisée',
  })
  create(
    @Body() createFicheDto: CreateFicheDto,
    @Req() request: any,
  ) {
    return this.ficheService.create(
      createFicheDto,
      request.user,
    );
  }

  // =====================================================
  // LISTER LES FICHES
  // =====================================================

  @Get()
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Lister les fiches accessibles à l’utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des fiches accessibles',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou gare non définie',
  })
  findAll(
    @Req() request: any,
  ) {
    return this.ficheService.findAll(request.user);
  }

  // =====================================================
  // OBTENIR UNE FICHE
  // =====================================================

  @Get(':id')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Obtenir une fiche par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche trouvée',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou gare non définie',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
  ) {
    return this.ficheService.findOne(
      id,
      request.user,
    );
  }

  // =====================================================
  // MODIFIER UNE FICHE
  // =====================================================

  @Patch(':id')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.UPDATE,
  )
  @ApiOperation({
    summary: 'Modifier une fiche',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche modifiée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Modification impossible selon le statut',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou accès à la gare refusé',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFicheDto: UpdateFicheDto,
    @Req() request: any,
  ) {
    return this.ficheService.update(
      id,
      updateFicheDto,
      request.user,
    );
  }

  // =====================================================
  // PRENDRE EN CHARGE
  // EN_ATTENTE → EN_COURS
  // =====================================================

  @Post(':id/prendre-en-charge')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.UPDATE,
  )
  @ApiOperation({
    summary: 'Prendre en charge une fiche',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche prise en charge avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'La fiche ne peut pas être prise en charge dans son état actuel',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou accès à la gare refusé',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  prendreEnCharge(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
  ) {
    return this.ficheService.prendreEnCharge(
      id,
      request.user,
    );
  }

  // =====================================================
  // FINALISER
  // EN_COURS → FINALISEE
  // =====================================================

  @Post(':id/finaliser')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.FINALIZE,
  )
  @ApiOperation({
    summary: 'Finaliser une fiche',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche finalisée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'La fiche ne peut pas être finalisée dans son état actuel',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou accès à la gare refusé',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  finaliser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
  ) {
    return this.ficheService.finaliser(
      id,
      request.user,
    );
  }

  // =====================================================
  // SUPPRIMER UNE FICHE
  // =====================================================

  @Delete(':id')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.DELETE,
  )
  @ApiOperation({
    summary: 'Supprimer une fiche',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiche supprimée',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou accès à la gare refusé',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
  ) {
    return this.ficheService.remove(
      id,
      request.user,
    );
  }

  // =====================================================
  // IMPRIMER UNE FICHE
  // FINALISEE → IMPRIMEE
  // =====================================================


  @Post(':id/imprimer')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.UPDATE,
  )
  @ApiOperation({
    summary: 'Imprimer le bordereau de route officiel en PDF',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la fiche',
  })
  @ApiResponse({
    status: 200,
    description: 'Bordereau PDF généré et impression enregistrée',
    content: {
      'application/pdf': {},
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Statut invalide ou motif de réimpression manquant',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante ou accès à la gare refusé',
  })
  async imprimer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
    @Body() dto: ImprimerFicheDto,
    @Res() response: Response,
  ): Promise<void> {
    const fiche = await this.ficheService.imprimer(
      id,
      request.user,
      dto,
    );

    const pdf = this.bordereauPdfService.generer(fiche);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="bordereau-${fiche.numeroBordereau}-exemplaire.pdf"`,
    );

    pdf.pipe(response);
    pdf.end();
  }


  @Get(':id/bordereau-pdf')
  @Permission(
    PERMISSION_RESOURCES.FICHES,
    PERMISSION_ACTIONS.READ,
  )
  @ApiOperation({
    summary: 'Télécharger le bordereau de route en PDF',
  })
  async telechargerBordereauPdf(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: any,
    @Res() response: Response,
  ): Promise<void> {
    const fiche = await this.ficheService.findOne(
      id,
      request.user,
    );

    const pdf = this.bordereauPdfService.generer(fiche);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="bordereau-${fiche.numeroBordereau}.pdf"`,
    );

    pdf.pipe(response);
    pdf.end();
  }

}

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

import { FicheService } from './fiche.service';
import { CreateFicheDto } from './dto/create-fiche.dto';
import { UpdateFicheDto } from './dto/update-fiche.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/decorators/permission.decorator';

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
    description: 'Permission insuffisante',
  })
  create(
    @Body() createFicheDto: CreateFicheDto,
    @Req() request: any,
  ) {
    return this.ficheService.create(
      createFicheDto,
      request.user.id,
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
    summary: 'Lister toutes les fiches',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des fiches',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante',
  })
  findAll() {
    return this.ficheService.findAll();
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
    description: 'Permission insuffisante',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ficheService.findOne(id);
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
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Permission insuffisante',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFicheDto: UpdateFicheDto,
  ) {
    return this.ficheService.update(
      id,
      updateFicheDto,
    );
  }
  // =====================================================
// PRENDRE EN CHARGE
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
  description: 'Permission insuffisante',
})
@ApiResponse({
  status: 404,
  description: 'Fiche introuvable',
})
prendreEnCharge(
  @Param('id', new ParseUUIDPipe()) id: string,
) {
  return this.ficheService.prendreEnCharge(id);
}

// =====================================================
// FINALISER
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
  description: 'Permission insuffisante',
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
    request.user.id,
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
    description: 'Permission insuffisante',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiche introuvable',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ficheService.remove(id);
  }
// =====================================================
// IMPRIMER UNE FICHE
// =====================================================

@Post(':id/imprimer')
@Permission(
  PERMISSION_RESOURCES.FICHES,
  PERMISSION_ACTIONS.UPDATE,
)
@ApiOperation({
  summary: 'Imprimer une fiche',
})
@ApiParam({
  name: 'id',
  description: 'UUID de la fiche',
})
@ApiResponse({
  status: 200,
  description: 'Fiche imprimée avec succès',
})
@ApiResponse({
  status: 400,
  description: 'La fiche ne peut pas être imprimée dans son état actuel',
})
@ApiResponse({
  status: 401,
  description: 'Utilisateur non authentifié',
})
@ApiResponse({
  status: 403,
  description: 'Permission insuffisante',
})
@ApiResponse({
  status: 404,
  description: 'Fiche introuvable',
})
imprimer(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Req() request: any,
) {
  return this.ficheService.imprimer(
    id,
    request.user.id,
  );
}
}
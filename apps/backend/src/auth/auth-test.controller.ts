import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Permission } from './decorators/permission.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('api/test-permissions')
@ApiTags('Test Permissions')
@ApiBearerAuth()
export class AuthTestController {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  @Get('fiche-create')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
@Permission('fiches', 'CREATE')
testFicheCreate() {
    return {
      message: 'Accès autorisé',
      resource: 'fiches',
      action: 'CREATE',
    };
  }

  @Get('fiche-delete')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
@Permission('fiches', 'DELETE')
testFicheDelete() {
    return {
      message: 'Accès autorisé',
      resource: 'fiches',
      action: 'DELETE',
    };
  }

 @Get('vehicule-update')
@ApiBearerAuth()
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
@Permission('vehicules', 'UPDATE')
testVehiculeUpdate() {
    return {
      message: 'Accès autorisé',
      resource: 'vehicules',
      action: 'UPDATE',
    };
  }

  @Get('protected')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
testProtected(@Req() req: Request) {
    return {
      message: 'Authentification JWT valide',
      user: req.user,
    };
  }

 @Get('short-token')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
testShortToken(@Req() req: Request) {
    const user = req.user as {
      id: number;
      username: string;
      role: string;
      gareId: string | null;
    };

    const token = this.jwtService.sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
        gareId: user.gareId,
      },
      {
        expiresIn: '10s',
      },
    );

    return {
      message: 'Access Token de test généré',
      expiresIn: '10 secondes',
      accessToken: token,
    };
  }
}


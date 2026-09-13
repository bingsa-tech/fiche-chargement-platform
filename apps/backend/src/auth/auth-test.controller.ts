import {
  Controller,
  Get,
} from '@nestjs/common';

import { Permission } from './decorators/permission.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

import {
  UseGuards,
} from '@nestjs/common';

@Controller('api/test-permissions')
export class AuthTestController {

  @Get('fiche-create')
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
}
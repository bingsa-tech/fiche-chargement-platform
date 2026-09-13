import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Test des rôles')
@ApiBearerAuth()
@Controller('api/test-roles')
export class TestRolesController {
  @Get('controleur')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTROLEUR')
  @ApiOperation({
    summary: 'Test accès CONTROLEUR',
  })
  testControleur() {
    return {
      message: 'Accès autorisé',
      roleRequis: 'CONTROLEUR',
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Test accès ADMIN',
  })
  testAdmin() {
    return {
      message: 'Accès autorisé',
      roleRequis: 'ADMIN',
    };
  }
}
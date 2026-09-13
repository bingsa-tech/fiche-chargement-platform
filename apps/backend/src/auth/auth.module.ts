import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

import { UtilisateursModule } from '../utilisateurs/utilisateur.module';
import {AuthTestController} from './auth-test.controller';
@Module({
  imports: [
    UtilisateursModule,

    JwtModule.register({
      global: true,

      secret:
        process.env.JWT_SECRET ||
        'lifefindintoinnerpeace',

      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    PermissionsGuard,
  ],

  controllers: [
    AuthController,
    AuthTestController,
  ],
})
export class AuthModule {}
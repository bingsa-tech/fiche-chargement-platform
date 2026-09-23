
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

import { UtilisateursModule } from '../utilisateurs/utilisateur.module';

import { AuthTestController } from './auth-test.controller';

import { RefreshToken } from './refresh/entities/refresh-token.entity';
import { RefreshTokenService } from './refresh/refresh-token.service';

@Module({
  imports: [
    UtilisateursModule,

    TypeOrmModule.forFeature([
      RefreshToken,
    ]),

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
    RefreshTokenService,
  ],

  controllers: [
    AuthController,
    AuthTestController,
  ],

  exports: [
    RefreshTokenService,
  ],
})
export class AuthModule {}


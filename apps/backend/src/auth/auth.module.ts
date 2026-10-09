import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionsGuard } from './guards/permissions.guard';

import { UtilisateursModule } from '../utilisateurs/utilisateur.module';

import { RefreshToken } from './refresh/entities/refresh-token.entity';
import { RefreshTokenService } from './refresh/refresh-token.service';

@Module({
  imports: [
    ConfigModule,
    UtilisateursModule,
    TypeOrmModule.forFeature([RefreshToken]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret?.trim()) {
          throw new Error(
            'JWT_SECRET doit être configuré avant le démarrage du backend.',
          );
        }

        return {
          global: true,
          secret: jwtSecret,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    PermissionsGuard,
    RefreshTokenService,
  ],

  controllers: [AuthController],

  exports: [RefreshTokenService],
})
export class AuthModule {}

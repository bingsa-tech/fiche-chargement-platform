import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const REFRESH_COOKIE_NAME = 'refresh_token';

const REFRESH_COOKIE_MAX_AGE =
  7 * 24 * 60 * 60 * 1000;

@Controller('api/auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Connexion réussie',
  })
  @ApiResponse({
    status: 401,
    description:
      'Identifiants incorrects',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result =
      await this.authService.login(
        loginDto.username,
        loginDto.password,
        req.headers['user-agent'] ?? null,
        req.ip ?? null,
      );

    if (!result) {
      throw new UnauthorizedException(
        'Identifiants incorrects',
      );
    }

    this.setRefreshCookie(
      res,
      result.refreshToken,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Rafraîchir le Access Token',
  })
  @ApiResponse({
    status: 200,
    description:
      'Access Token renouvelé',
  })
  @ApiResponse({
    status: 401,
    description:
      'Refresh token invalide ou expiré',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      this.getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token absent',
      );
    }

    const result =
      await this.authService.refresh(
        refreshToken,
        req.headers['user-agent'] ?? null,
        req.ip ?? null,
      );

    this.setRefreshCookie(
      res,
      result.refreshToken,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Déconnexion utilisateur',
  })
  @ApiResponse({
    status: 204,
    description:
      'Déconnexion réussie',
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      this.getRefreshTokenFromCookie(req);

    await this.authService.logout(
      refreshToken,
    );

    this.clearRefreshCookie(res);
  }

  /**
   * Création du cookie HttpOnly.
   */
  private setRefreshCookie(
    res: Response,
    token: string,
  ): void {
    res.cookie(
      REFRESH_COOKIE_NAME,
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === 'production',

        sameSite: 'lax',

        maxAge:
          REFRESH_COOKIE_MAX_AGE,

        path: '/api/auth',
      },
    );
  }

  /**
   * Suppression du cookie.
   */
  private clearRefreshCookie(
    res: Response,
  ): void {
    res.clearCookie(
      REFRESH_COOKIE_NAME,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV === 'production',

        sameSite: 'lax',

        path: '/api/auth',
      },
    );
  }

  /**
   * Extraction manuelle du cookie refresh_token.
   *
   * Nous n'utilisons pas cookie-parser pour le moment.
   */
  private getRefreshTokenFromCookie(
    req: Request,
  ): string | null {
    const cookieHeader =
      req.headers.cookie;

    if (!cookieHeader) {
      return null;
    }

    const cookies =
      cookieHeader.split(';');

    for (const cookie of cookies) {
      const separatorIndex =
        cookie.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const name =
        cookie
          .slice(0, separatorIndex)
          .trim();

      if (
        name !== REFRESH_COOKIE_NAME
      ) {
        continue;
      }

      const value =
        cookie
          .slice(separatorIndex + 1)
          .trim();

      return decodeURIComponent(value);
    }

    return null;
  }
}


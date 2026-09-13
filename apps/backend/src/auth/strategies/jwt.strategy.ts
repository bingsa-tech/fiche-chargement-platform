import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UtilisateursService } from '../../utilisateurs/utilisateur.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly utilisateursService: UtilisateursService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'lifefindintoinnerpeace',
    });
  }

  async validate(payload: any) {
    // payload = { sub: user.id, username: user.username, role: user.role, gareId: user.gareId }

    const utilisateur = await this.utilisateursService.findOne(payload.sub);

    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Ce qui sera injecté dans req.user
    return {
      id: utilisateur.id,
      username: utilisateur.username,
      role: payload.role,
      gareId: payload.gareId,
    };
  }
}

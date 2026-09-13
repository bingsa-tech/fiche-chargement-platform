import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UtilisateursService } from '../utilisateurs/utilisateur.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilisateursService: UtilisateursService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user =
      await this.utilisateursService.findByUsernameWithRole(username);

    if (!user) {
      return null;
    }

    if (!user.actif || user.bloque) {
      return null;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isMatch) {
      return null;
    }

    const roleCode = user.role?.code ?? 'USER';

    const payload = {
      sub: user.id,
      username: user.username,
      role: roleCode,
      gareId: user.gareId,
    };

    const token = this.jwtService.sign(payload);
    await this.utilisateursService.updateLastLogin(user.id);

    return {
      accessToken: token,

      user: {
        id: user.id,
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: roleCode,
        gareId: user.gareId,
      },
    };
  }
}
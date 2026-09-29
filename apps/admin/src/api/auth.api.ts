import api from './axios';

import type {
  LoginRequest,
  LoginResponse,
} from '../auth/auth.types';

export const authApi = {
  /**
   * Connexion utilisateur.
   *
   * Le backend :
   * - retourne l'access token dans le JSON ;
   * - place le refresh token dans un cookie HttpOnly.
   */
  async login(
    credentials: LoginRequest,
  ): Promise<LoginResponse> {
    const response =
      await api.post<LoginResponse>(
        '/api/auth/login',
        credentials,
      );

    return response.data;
  },

  /**
   * Déconnexion utilisateur.
   *
   * Le backend récupère le refresh token
   * depuis le cookie HttpOnly et le révoque.
   */
  async logout(): Promise<void> {
    await api.post(
      '/api/auth/logout',
    );
  },
}
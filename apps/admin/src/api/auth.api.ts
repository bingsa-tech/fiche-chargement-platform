import api from './axios';
import type {
  LoginRequest,
  LoginResponse,
} from '../auth/auth.types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/api/auth/login',
      credentials,
    );

    return response.data;
  },
};
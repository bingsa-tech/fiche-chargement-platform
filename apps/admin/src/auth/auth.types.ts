import type { UserRole } from './role.types';

export interface Utilisateur {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  gareId: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Utilisateur;
}
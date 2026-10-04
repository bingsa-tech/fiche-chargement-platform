import type { Role } from './role.types';
import type { Gare } from './gare.types';

export interface Utilisateur {
  id: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  actif: boolean;
  bloque: boolean;
  lastLoginAt: string | null;
  gareId: string | null;
  roleId: number | null;
  createdAt: string;
  updatedAt: string;
  role?: Role | null;
  gare?: Gare | null;
}

export interface CreateUtilisateurPayload {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
  actif?: boolean;
  bloque?: boolean;
  gareId?: string;
  roleId?: number;
}

export interface UpdateUtilisateurPayload {
  username?: string;
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  actif?: boolean;
  bloque?: boolean;
  gareId?: string;
  roleId?: number;
}
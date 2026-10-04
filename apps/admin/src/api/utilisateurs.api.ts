import api from './axios';

import type {
  Utilisateur,
  CreateUtilisateurPayload,
  UpdateUtilisateurPayload,
} from '../types/utilisateur.types';

/**
 * Récupère tous les utilisateurs.
 */
export async function getUtilisateurs(): Promise<Utilisateur[]> {
  const response = await api.get<Utilisateur[]>(
    '/utilisateurs',
  );

  return response.data;
}

/**
 * Récupère un utilisateur par son identifiant.
 */
export async function getUtilisateur(
  id: number,
): Promise<Utilisateur> {
  const response = await api.get<Utilisateur>(
    `/utilisateurs/${id}`,
  );

  return response.data;
}

/**
 * Crée un utilisateur.
 */
export async function createUtilisateur(
  payload: CreateUtilisateurPayload,
): Promise<Utilisateur> {
  const response = await api.post<Utilisateur>(
    '/utilisateurs',
    payload,
  );

  return response.data;
}

/**
 * Modifie un utilisateur.
 */
export async function updateUtilisateur(
  id: number,
  payload: UpdateUtilisateurPayload,
): Promise<Utilisateur> {
  const response = await api.patch<Utilisateur>(
    `/utilisateurs/${id}`,
    payload,
  );

  return response.data;
}

/**
 * Supprime un utilisateur.
 */
export async function deleteUtilisateur(
  id: number,
): Promise<void> {
  await api.delete(`/utilisateurs/${id}`);
}
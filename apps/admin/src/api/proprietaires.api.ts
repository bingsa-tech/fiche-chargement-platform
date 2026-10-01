import api from './axios';

import type {
  Proprietaire,
  CreateProprietairePayload,
  UpdateProprietairePayload,
} from '../types/proprietaire.types';

/**
 * Récupère tous les propriétaires.
 */
export async function getProprietaires(): Promise<
  Proprietaire[]
> {
  const response =
    await api.get<Proprietaire[]>(
      '/proprietaires',
    );

  return response.data;
}

/**
 * Récupère un propriétaire par son identifiant.
 */
export async function getProprietaire(
  id: string,
): Promise<Proprietaire> {
  const response =
    await api.get<Proprietaire>(
      `/proprietaires/${id}`,
    );

  return response.data;
}

/**
 * Crée un propriétaire.
 */
export async function createProprietaire(
  payload: CreateProprietairePayload,
): Promise<Proprietaire> {
  const response =
    await api.post<Proprietaire>(
      '/proprietaires',
      payload,
    );

  return response.data;
}

/**
 * Modifie un propriétaire.
 */
export async function updateProprietaire(
  id: string,
  payload: UpdateProprietairePayload,
): Promise<Proprietaire> {
  const response =
    await api.patch<Proprietaire>(
      `/proprietaires/${id}`,
      payload,
    );

  return response.data;
}

/**
 * Supprime un propriétaire.
 */
export async function deleteProprietaire(
  id: string,
): Promise<void> {
  await api.delete(
    `/proprietaires/${id}`,
  );
}
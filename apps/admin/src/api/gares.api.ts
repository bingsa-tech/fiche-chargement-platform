import api from './axios';

import type {
  Gare,
  CreateGarePayload,
  UpdateGarePayload,
} from '../types/gare.types';

/**
 * Récupère toutes les gares.
 */
export async function getGares(): Promise<Gare[]> {
  const response = await api.get<Gare[]>('/gares');

  return response.data;
}

/**
 * Récupère une gare par son identifiant.
 */
export async function getGare(
  id: string,
): Promise<Gare> {
  const response = await api.get<Gare>(
    `/gares/${id}`,
  );

  return response.data;
}

/**
 * Crée une nouvelle gare.
 */
export async function createGare(
  payload: CreateGarePayload,
): Promise<Gare> {
  const response = await api.post<Gare>(
    '/gares',
    payload,
  );

  return response.data;
}

/**
 * Modifie une gare.
 */
export async function updateGare(
  id: string,
  payload: UpdateGarePayload,
): Promise<Gare> {
  const response = await api.patch<Gare>(
    `/gares/${id}`,
    payload,
  );

  return response.data;
}

/**
 * Supprime une gare.
 *
 * Le backend retourne HTTP 204 No Content.
 */
export async function deleteGare(
  id: string,
): Promise<void> {
  await api.delete(`/gares/${id}`);
}
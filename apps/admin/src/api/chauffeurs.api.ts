import api from './axios';

import type {
  Chauffeur,
  CreateChauffeurPayload,
  UpdateChauffeurPayload,
} from '../types/chauffeur.types';

const CHAUFFEURS_ENDPOINT = 'api/chauffeurs';

/**
 * Récupère la liste complète des chauffeurs.
 */
export async function getChauffeurs(): Promise<Chauffeur[]> {
  const response = await api.get<Chauffeur[]>(CHAUFFEURS_ENDPOINT);
  return response.data;
}

/**
 * Récupère un chauffeur par son identifiant.
 */
export async function getChauffeur(id: string): Promise<Chauffeur> {
  const response = await api.get<Chauffeur>(
    `${CHAUFFEURS_ENDPOINT}/${id}`,
  );
  return response.data;
}

/**
 * Crée un chauffeur avec son document initial obligatoire.
 */
export async function createChauffeur(
  payload: CreateChauffeurPayload,
): Promise<Chauffeur> {
  const response = await api.post<Chauffeur>(
    CHAUFFEURS_ENDPOINT,
    payload,
  );
  return response.data;
}

/**
 * Met à jour les informations du chauffeur.
 */
export async function updateChauffeur(
  id: string,
  payload: UpdateChauffeurPayload,
): Promise<Chauffeur> {
  const response = await api.patch<Chauffeur>(
    `${CHAUFFEURS_ENDPOINT}/${id}`,
    payload,
  );
  return response.data;
}

/**
 * Supprime un chauffeur.
 */
export async function deleteChauffeur(id: string): Promise<void> {
  await api.delete(`${CHAUFFEURS_ENDPOINT}/${id}`);
}

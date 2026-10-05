import api from './axios';

import type {
  Chauffeur,
  CreateChauffeurPayload,
  UpdateChauffeurPayload,
} from '../types/chauffeur.types';

/**
 * Récupère la liste complète des chauffeurs.
 */
export async function getChauffeurs(): Promise<Chauffeur[]> {
  const response = await api.get<Chauffeur[]>('/chauffeurs');

  return response.data;
}

/**
 * Récupère un chauffeur par son identifiant.
 *
 * La réponse contient également ses documents
 * dans `documentChauffeurs`.
 */
export async function getChauffeur(
  id: string,
): Promise<Chauffeur> {
  const response = await api.get<Chauffeur>(
    `/chauffeurs/${id}`,
  );

  return response.data;
}

/**
 * Crée un chauffeur avec son document initial obligatoire.
 *
 * Le backend effectue la création du chauffeur
 * et du document dans une transaction.
 */
export async function createChauffeur(
  payload: CreateChauffeurPayload,
): Promise<Chauffeur> {
  const response = await api.post<Chauffeur>(
    '/chauffeurs',
    payload,
  );

  return response.data;
}

/**
 * Met à jour les informations du chauffeur.
 *
 * Le document n'est pas modifié par cet endpoint.
 * Les documents sont gérés via l'API Documents.
 */
export async function updateChauffeur(
  id: string,
  payload: UpdateChauffeurPayload,
): Promise<Chauffeur> {
  const response = await api.patch<Chauffeur>(
    `/chauffeurs/${id}`,
    payload,
  );

  return response.data;
}

/**
 * Supprime un chauffeur.
 */
export async function deleteChauffeur(
  id: string,
): Promise<void> {
  await api.delete(`/chauffeurs/${id}`);
}
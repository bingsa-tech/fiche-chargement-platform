import apiClient from './axios';

import type {
  Itineraire,
  CreateItinerairePayload,
  UpdateItinerairePayload,
} from '../types/itineraire.types';

/**
 * Récupérer tous les itinéraires
 */
export async function getItineraires(): Promise<Itineraire[]> {
  const response = await apiClient.get<Itineraire[]>('/api/itineraires/');
  return response.data;
}

/**
 * Récupérer un itinéraire par son ID
 */
export async function getItineraire(id: string): Promise<Itineraire> {
  const response = await apiClient.get<Itineraire>(
    `/api/itineraires/${id}`,
  );
  return response.data;
}

/**
 * Créer un itinéraire
 */
export async function createItineraire(
  payload: CreateItinerairePayload,
): Promise<Itineraire> {
  const response = await apiClient.post<Itineraire>(
    '/api/itineraires/',
    payload,
  );
  return response.data;
}

/**
 * Modifier un itinéraire
 */
export async function updateItineraire(
  id: string,
  payload: UpdateItinerairePayload,
): Promise<Itineraire> {
  const response = await apiClient.patch<Itineraire>(
    `/api/itineraires/${id}`,
    payload,
  );
  return response.data;
}

/**
 * Supprimer un itinéraire
 */
export async function deleteItineraire(id: string): Promise<void> {
  await apiClient.delete(`/api/itineraires/${id}`);
}

import api from './axios';

import type {
  Vehicule,
  CreateVehiculePayload,
  UpdateVehiculePayload,
} from '../types/vehicule.types';

/**
 * Récupérer tous les véhicules.
 *
 * Le backend retourne également :
 * - le propriétaire ;
 * - les documents du véhicule.
 */
export async function getVehicules(): Promise<Vehicule[]> {
  const response = await api.get<Vehicule[]>(
    '/vehicules',
  );

  return response.data;
}

/**
 * Récupérer un véhicule par son ID.
 *
 * Le backend retourne également :
 * - le propriétaire ;
 * - les documents du véhicule.
 */
export async function getVehicule(
  id: string,
): Promise<Vehicule> {
  const response = await api.get<Vehicule>(
    `/vehicules/${id}`,
  );

  return response.data;
}

/**
 * Créer un véhicule avec ses documents.
 *
 * La création est effectuée par le backend
 * dans une seule transaction.
 *
 * Le payload contient obligatoirement :
 * - les informations du véhicule ;
 * - le propriétaire ;
 * - au moins un document.
 */
export async function createVehicule(
  payload: CreateVehiculePayload,
): Promise<Vehicule> {
  const response = await api.post<Vehicule>(
    '/vehicules',
    payload,
  );

  return response.data;
}

/**
 * Modifier un véhicule.
 *
 * La modification concerne actuellement
 * les informations du véhicule.
 *
 * La gestion détaillée des documents reste
 * assurée par le module Documents.
 */
export async function updateVehicule(
  id: string,
  payload: UpdateVehiculePayload,
): Promise<Vehicule> {
  const response = await api.patch<Vehicule>(
    `/vehicules/${id}`,
    payload,
  );

  return response.data;
}

/**
 * Supprimer un véhicule.
 *
 * Le backend gère la suppression des documents
 * associés selon la relation configurée.
 */
export async function deleteVehicule(
  id: string,
): Promise<void> {
  await api.delete(`/vehicules/${id}`);
}
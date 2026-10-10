import api from './axios';

import type {
  Fiche,
  CreateFichePayload,
  UpdateFichePayload,
} from '../types/fiche.types';

// =====================================================
// LISTER LES FICHES ACCESSIBLES
// =====================================================

export async function getFiches(): Promise<Fiche[]> {
  const response = await api.get<Fiche[]>('/api/fiches');

  return response.data;
}

// =====================================================
// CONSULTER UNE FICHE
// =====================================================

export async function getFiche(
  id: string,
): Promise<Fiche> {
  const response = await api.get<Fiche>(
    `/api/fiches/${id}`,
  );

  return response.data;
}

// =====================================================
// CRÉER UNE FICHE
// =====================================================

export async function createFiche(
  payload: CreateFichePayload,
): Promise<Fiche> {
  const response = await api.post<Fiche>(
    '/api/fiches',
    payload,
  );

  return response.data;
}

// =====================================================
// MODIFIER UNE FICHE
// =====================================================

export async function updateFiche(
  id: string,
  payload: UpdateFichePayload,
): Promise<Fiche> {
  const response = await api.patch<Fiche>(
    `/api/fiches/${id}`,
    payload,
  );

  return response.data;
}

// =====================================================
// PRENDRE EN CHARGE UNE FICHE
// =====================================================

export async function prendreEnChargeFiche(
  id: string,
): Promise<Fiche> {
  const response = await api.post<Fiche>(
    `/api/fiches/${id}/prendre-en-charge`,
  );

  return response.data;
}

// =====================================================
// FINALISER UNE FICHE
// =====================================================

export async function finaliserFiche(
  id: string,
): Promise<Fiche> {
  const response = await api.post<Fiche>(
    `/api/fiches/${id}/finaliser`,
  );

  return response.data;
}

// =====================================================
// IMPRIMER UNE FICHE
// =====================================================

export async function imprimerFiche(
  id: string,
): Promise<Fiche> {
  const response = await api.post<Fiche>(
    `/api/fiches/${id}/imprimer`,
  );

  return response.data;
}

// =====================================================
// SUPPRIMER UNE FICHE
// =====================================================

export async function deleteFiche(
  id: string,
): Promise<void> {
  await api.delete(`/api/fiches/${id}`);
}
export interface FichePassagerDetail {
  ficheId: string;
  passagerId: string;
  numeroPlace: number | null;
  passager: {
    id: string;
    nom: string;
    prenom: string;
    numeroCni: string;
  };
}

export async function getPassagersFiche(
  ficheId: string,
): Promise<FichePassagerDetail[]> {
  const response = await api.get<FichePassagerDetail[]>(
    `/api/fiche-passagers/fiche/${ficheId}`,
  );

  return response.data;
}

export interface CreateFichePassagerPayload {
  ficheId: string;
  passagerId: string;
  numeroPlace?: number;
}

export async function associerPassagerAFiche(
  payload: CreateFichePassagerPayload,
): Promise<void> {
  await api.post(
    '/api/fiche-passagers',
    payload,
  );
}
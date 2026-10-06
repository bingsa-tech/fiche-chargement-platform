import api from './axios';

import type {
  DocumentVehicule,
  DocumentChauffeur,
  CreateDocumentVehiculePayload,
  UpdateDocumentVehiculePayload,
  CreateDocumentChauffeurPayload,
  UpdateDocumentChauffeurPayload,
} from '../types/document.types';

// =====================================================
// DOCUMENTS VÉHICULE
// =====================================================

export async function getDocumentsVehicules(): Promise<DocumentVehicule[]> {
  const response = await api.get<DocumentVehicule[]>(
    '/api/documents/vehicules',
  );

  return response.data;
}

export async function getDocumentVehicule(
  id: string,
): Promise<DocumentVehicule> {
  const response = await api.get<DocumentVehicule>(
    `/api/documents/vehicules/${id}`,
  );

  return response.data;
}

export async function createDocumentVehicule(
  payload: CreateDocumentVehiculePayload,
): Promise<DocumentVehicule> {
  const response = await api.post<DocumentVehicule>(
    '/api/documents/vehicules',
    payload,
  );

  return response.data;
}

export async function updateDocumentVehicule(
  id: string,
  payload: UpdateDocumentVehiculePayload,
): Promise<DocumentVehicule> {
  const response = await api.patch<DocumentVehicule>(
    `/api/documents/vehicules/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteDocumentVehicule(
  id: string,
): Promise<void> {
  await api.delete(
    `/api/documents/vehicules/${id}`,
  );
}

// =====================================================
// DOCUMENTS CHAUFFEUR
// =====================================================

export async function getDocumentsChauffeurs(): Promise<DocumentChauffeur[]> {
  const response = await api.get<DocumentChauffeur[]>(
    '/api/documents/chauffeurs',
  );

  return response.data;
}

export async function getDocumentChauffeur(
  id: string,
): Promise<DocumentChauffeur> {
  const response = await api.get<DocumentChauffeur>(
    `/api/documents/chauffeurs/${id}`,
  );

  return response.data;
}

export async function createDocumentChauffeur(
  payload: CreateDocumentChauffeurPayload,
): Promise<DocumentChauffeur> {
  const response = await api.post<DocumentChauffeur>(
    '/api/documents/chauffeurs',
    payload,
  );

  return response.data;
}

export async function updateDocumentChauffeur(
  id: string,
  payload: UpdateDocumentChauffeurPayload,
): Promise<DocumentChauffeur> {
  const response = await api.patch<DocumentChauffeur>(
    `/api/documents/chauffeurs/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteDocumentChauffeur(
  id: string,
): Promise<void> {
  await api.delete(
    `/api/documents/chauffeurs/${id}`,
  );
}
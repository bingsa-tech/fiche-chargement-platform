
import api from './axios';

export interface CreatePassagerPayload {
  nom: string;
  prenom: string;
  numeroCni: string;
  telephone?: string;
}

export interface Passager {
  id: string;
  nom: string;
  prenom: string;
  numeroCni: string;
  telephone: string | null;
  createdAt: string; 
  updatedAt: string;
}
export interface UpdatePassagerDto {
  nom?: string;
  prenom?: string;
  numeroCni?: string;
  telephone?: string | null;
}
export async function createPassager(
  payload: CreatePassagerPayload,
): Promise<Passager> {
  const response = await api.post<Passager>(
    '/api/passagers',
    payload,
  );

  return response.data;
}
export async function getPassagers(): Promise<Passager[]> {
  const response = await api.get<Passager[]>('/api/passagers');
  return response.data;
}

/**
 * Modifie un passager
 */
export async function updatePassager(id: string, data: UpdatePassagerDto): Promise<Passager> {
  const response = await api.patch<Passager>(`/api/passagers/${id}`, data);
  return response.data;
}

/**
 * Supprime un passager
 */
export async function deletePassager(id: string): Promise<void> {
  await api.delete(`/api/passagers/${id}`);
}
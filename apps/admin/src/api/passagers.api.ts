
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

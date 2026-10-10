
import api from './axios';

export interface CreatePassagerPayload {
  nom: string;
  prenom: string;
  numeroCni: string;
}

export interface Passager {
  id: string;
  nom: string;
  prenom: string;
  numeroCni: string;
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

import api from './axios';

export interface CreateFichePassagerPayload {
  ficheId: string;
  passagerId: string;
  numeroPlace?: number;
  tarif?: number;
  observations?: string;
}

export interface FichePassagerDetail {
  ficheId: string;
  passagerId: string;
  numeroPlace: number | null;
  tarif: number | string | null;
  observations: string | null;
  passager: {
    id: string;
    nom: string;
    prenom: string;
    numeroCni: string;
    telephone: string | null;
  };
}

export async function associerPassagerAFiche(
  payload: CreateFichePassagerPayload,
): Promise<void> {
  await api.post('/api/fiche-passagers', payload);
}

export async function getPassagersFiche(
  ficheId: string,
): Promise<FichePassagerDetail[]> {
  const response = await api.get<FichePassagerDetail[]>(
    `/api/fiche-passagers/fiche/${ficheId}`,
  );
  return response.data;
}
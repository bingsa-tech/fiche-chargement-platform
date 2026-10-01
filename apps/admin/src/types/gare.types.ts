export type GareStatut =
  | 'ACTIF'
  | 'INACTIF';

export interface Gare {
  id: string;
  code: string;
  nom: string;
  ville: string;
  adresse: string | null;
  statut: GareStatut;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGarePayload {
  code: string;
  nom: string;
  ville: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  statut: GareStatut;
}

export interface UpdateGarePayload {
  code?: string;
  nom?: string;
  ville?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  statut?: GareStatut;
}
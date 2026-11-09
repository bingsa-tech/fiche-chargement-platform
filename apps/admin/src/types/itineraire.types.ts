export type ItineraireStatut = 'ACTIF' | 'INACTIF' | 'SUSPENDU'; // Adaptez selon votre enum backend

export interface Itineraire {
  id: string;
  destinationId: string;
  code: string;
  libelle: string;
  description?: string | null;
  statut: ItineraireStatut;
  createdAt: string;
  updatedAt: string;
  destination?: {
    id: string;
    code: string;
    nom: string;
    ville: string;
  };
}

export interface CreateItinerairePayload {
  destinationId: string;
  code: string;
  libelle: string;
  description?: string;
  statut: ItineraireStatut;
}

export interface UpdateItinerairePayload extends Partial<CreateItinerairePayload> {}
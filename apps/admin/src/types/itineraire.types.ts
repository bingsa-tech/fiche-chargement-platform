export type ItineraireStatut =
  | 'ACTIF'
  | 'INACTIF'
  | 'MAINTENANCE';

export interface Itineraire {
  id: string;
  destinationId: string;
  code: string;
  libelle: string;
  description: string | null;
  statut: ItineraireStatut;
  createdAt: string;
  updatedAt: string;
}

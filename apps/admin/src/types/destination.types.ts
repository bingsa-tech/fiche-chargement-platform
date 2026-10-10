export type DestinationStatut = 'ACTIF' | 'INACTIF';

export interface Destination {
  id: string;
  code: string;
  nom: string;
  ville: string;
  pays: string;
  statut: DestinationStatut;
  createdAt: string;
  updatedAt: string;
}

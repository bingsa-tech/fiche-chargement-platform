
export type AlerteProprietaireType = 'CHAUFFEUR' | 'VEHICULE';

export type AlerteType =
  | 'INFORMATION'
  | 'ATTENTION'
  | 'URGENT'
  | 'EXPIRE';

export type AlerteStatut = 'NON_LUE' | 'LUE' | 'TRAITEE';

export interface Alerte {
  id: string;
  typeDocument: string;
  documentId: string;
  proprietaireType: AlerteProprietaireType;
  proprietaireId: string;
  dateDeclenchement: string;
  dateExpiration: string;
  typeAlerte: AlerteType;
  statut: AlerteStatut;
  dateLecture: string | null;
  utilisateurLecture: number | null;
  createdAt: string;
}

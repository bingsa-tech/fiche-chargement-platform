export interface ProprietaireVehicule {
  id: string;
  plaqueImmatriculation: string;
  type: string;
  marque: string | null;
  modele: string | null;
  capacite: number;
  statut: string;
}

export interface Proprietaire {
  id: string;

  nom: string;
  prenom: string;

  telephone: string | null;
  adresse: string | null;

  numeroPieceIdentite: string | null;
  typePieceIdentite: string | null;

  statut: string;

  createdAt: string;
  updatedAt: string;

  vehicules: ProprietaireVehicule[];
}

export interface CreateProprietairePayload {
  nom: string;
  prenom: string;

  telephone?: string;
  adresse?: string;

  numeroPieceIdentite?: string;
  typePieceIdentite?: string;

  statut: string;
}

export interface UpdateProprietairePayload {
  nom?: string;
  prenom?: string;

  telephone?: string;
  adresse?: string;

  numeroPieceIdentite?: string;
  typePieceIdentite?: string;

  statut?: string;
}
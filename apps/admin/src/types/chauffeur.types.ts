// =====================================================
// CHAUFFEUR — STATUT
// =====================================================

export type ChauffeurStatut =
  | 'ACTIF'
  | 'INACTIF';

// =====================================================
// DOCUMENT CHAUFFEUR
// =====================================================

export interface DocumentChauffeur {
  id: string;

  chauffeurId: string;

  typeDocument: string;

  numeroDocument: string | null;

  dateDelivrance: string | null;

  dateExpiration: string;

  statut: string;

  observations: string | null;

  createdAt: string;

  updatedAt: string;
}

// =====================================================
// CHAUFFEUR
// =====================================================

export interface Chauffeur {
  id: string;

  nom: string;

  prenom: string;

  telephone: string | null;

  statut: ChauffeurStatut;

  createdAt: string;

  updatedAt: string;

  documentChauffeurs: DocumentChauffeur[];
}

// =====================================================
// CHAUFFEUR — CRÉATION
// =====================================================

export interface CreateChauffeurPayload {
  nom: string;

  prenom: string;

  telephone?: string;

  statut: ChauffeurStatut;

  /**
   * Document initial obligatoire.
   *
   * Le backend crée le chauffeur et ce document
   * dans une seule transaction.
   */
  document: {
    typeDocument: string;

    numeroDocument?: string;

    dateDelivrance?: string;

    dateExpiration: string;

    statut: string;

    observations?: string;
  };
}

// =====================================================
// CHAUFFEUR — MODIFICATION
// =====================================================

export interface UpdateChauffeurPayload {
  nom?: string;

  prenom?: string;

  telephone?: string;

  statut?: ChauffeurStatut;
}
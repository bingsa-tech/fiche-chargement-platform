// =====================================================
// FICHE — STATUTS
// Alignés sur FicheStatut côté NestJS
// =====================================================

export type FicheStatut =
  | 'BROUILLON'
  | 'EN_COURS'
  | 'FINALISEE'
  | 'IMPRIMEE'
  | 'REMISE_CHAUFFEUR'
  | 'RECEPTION_CONFIRME'
  | 'CHARGEMENT'
  | 'EN_CIRCULATION'
  | 'CLOTUREE'
  | 'ANNULEE'
  | 'EN_ATTENTE';

// =====================================================
// RELATIONS — INFORMATIONS SIMPLES
// =====================================================

export interface FicheRelation {
  id: string;
  nom?: string;
  prenom?: string;
  reference?: string;
  immatriculation?: string;
  libelle?: string;
  nomGare?: string;
}

export interface FichePassager {
  id: string;
  ficheId?: string;
  passagerId?: string;
}

// =====================================================
// FICHE DE CHARGEMENT
// =====================================================

export interface Fiche {
  id: string;
  reference: string;

  gareId: string;
  vehiculeId: string;
  chauffeurId: string;
  destinationId: string;
  itineraireId: string | null;

  createurId: number;
  finalisateurId: number | null;
  annulateurId: number | null;

  dateCreation: string;
  heureArriveeGare: string | null;
  heureDepart: string | null;
  heureArriveeDestination: string | null;
  dateFinalisation: string | null;
  dateCloture: string | null;
  dateAnnulation: string | null;

  statut: FicheStatut;
  motifAnnulation: string | null;

  createdAt: string;
  updatedAt: string;

  gare?: FicheRelation;
  vehicule?: FicheRelation;
  chauffeur?: FicheRelation;
  destination?: FicheRelation;
  itineraire?: FicheRelation | null;
  createur?: FicheRelation;
  finalisateur?: FicheRelation | null;
  annulateur?: FicheRelation | null;

  fichePassagers?: FichePassager[];
}

// =====================================================
// CRÉATION
// =====================================================

export interface CreateFichePayload {
  reference: string;
  gareId: string;
  vehiculeId: string;
  chauffeurId: string;
  destinationId: string;
  itineraireId?: string;
}

// =====================================================
// MODIFICATION
// =====================================================

export interface UpdateFichePayload {
  reference?: string;
  vehiculeId?: string;
  chauffeurId?: string;
  destinationId?: string;
  itineraireId?: string | null;
}
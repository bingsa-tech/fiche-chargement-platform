// =====================================================
// DOCUMENT — STATUT
// =====================================================

export type DocumentStatut = string;

// =====================================================
// VÉHICULE ASSOCIÉ À UN DOCUMENT
// =====================================================

export interface DocumentVehiculeRelation {
  id: string;
  plaqueImmatriculation: string;
  type: string;
  marque: string;
  modele: string;
  capacite: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  proprietaireId: string | null;
}

// =====================================================
// DOCUMENT VÉHICULE
// =====================================================

export interface DocumentVehicule {
  id: string;
  vehiculeId: string;

  typeDocument: string;
  numeroDocument: string | null;

  dateDelivrance: string | null;
  dateExpiration: string;

  statut: DocumentStatut;
  observations: string | null;

  createdAt: string;
  updatedAt: string;

  vehicule?: DocumentVehiculeRelation;
}

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

  statut: DocumentStatut;
  observations: string | null;

  createdAt: string;
  updatedAt: string;
}

// =====================================================
// CRÉATION — DOCUMENT VÉHICULE
// =====================================================

export interface CreateDocumentVehiculePayload {
  vehiculeId: string;

  typeDocument: string;
  numeroDocument?: string;

  dateDelivrance?: string;
  dateExpiration: string;

  statut: string;
  observations?: string;
}

// =====================================================
// MODIFICATION — DOCUMENT VÉHICULE
// =====================================================

export interface UpdateDocumentVehiculePayload {
  vehiculeId?: string;

  typeDocument?: string;
  numeroDocument?: string;

  dateDelivrance?: string;
  dateExpiration?: string;

  statut?: string;
  observations?: string;
}

// =====================================================
// CRÉATION — DOCUMENT CHAUFFEUR
// =====================================================

export interface CreateDocumentChauffeurPayload {
  chauffeurId: string;

  typeDocument: string;
  numeroDocument?: string;

  dateDelivrance?: string;
  dateExpiration: string;

  statut: string;
  observations?: string;
}

// =====================================================
// MODIFICATION — DOCUMENT CHAUFFEUR
// =====================================================

export interface UpdateDocumentChauffeurPayload {
  typeDocument?: string;
  numeroDocument?: string;

  dateDelivrance?: string;
  dateExpiration?: string;

  statut?: string;
  observations?: string;
}
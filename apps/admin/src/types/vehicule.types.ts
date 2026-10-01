export type VehiculeStatut =
  | 'ACTIF'
  | 'INACTIF'
  | 'MAINTENANCE';

// =====================================================
// PROPRIÉTAIRE
// =====================================================

export interface VehiculeProprietaire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  statut: string;
}

// =====================================================
// DOCUMENT VÉHICULE
// =====================================================

export interface VehiculeDocument {
  id: string;

  vehiculeId: string;

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
// VÉHICULE
// =====================================================

export interface Vehicule {
  id: string;

  plaqueImmatriculation: string;

  type: string;

  marque: string | null;

  modele: string | null;

  capacite: number;

  statut: VehiculeStatut;

  proprietaireId: string | null;

  proprietaire: VehiculeProprietaire | null;

  documentsVehicules: VehiculeDocument[];

  createdAt: string;

  updatedAt: string;
}

// =====================================================
// DOCUMENT — CRÉATION
// =====================================================

export interface CreateVehiculeDocumentPayload {
  typeDocument: string;

  numeroDocument?: string;

  dateDelivrance?: string;

  dateExpiration: string;

  statut: string;

  observations?: string;
}

// =====================================================
// VÉHICULE — CRÉATION
// =====================================================

export interface CreateVehiculePayload {
  plaqueImmatriculation: string;

  type: string;

  marque?: string;

  modele?: string;

  capacite: number;

  statut: VehiculeStatut;

  proprietaireId: string;

  documents: CreateVehiculeDocumentPayload[];
}

// =====================================================
// VÉHICULE — MODIFICATION
// =====================================================

export interface UpdateVehiculePayload {
  plaqueImmatriculation?: string;

  type?: string;

  marque?: string;

  modele?: string;

  capacite?: number;

  statut?: VehiculeStatut;

  proprietaireId?: string;
}
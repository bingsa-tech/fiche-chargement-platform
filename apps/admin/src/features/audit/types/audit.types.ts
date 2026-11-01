export interface AuditLog {
  id: string;

  utilisateurId: number | null;

  action: string;

  entite: string;

  entiteId: string;

  dateHeure: string;

  ancienneValeur: Record<string, unknown> | null;

  nouvelleValeur: Record<string, unknown> | null;

  appareilId: string | null;
}

export interface AuditFilters {
  utilisateurId?: number;
  action?: string;
  entite?: string;
  entiteId?: string;
  dateDebut?: string;
  dateFin?: string;
  appareilId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditPaginatedResponse {
  data: AuditLog[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface AuditStats {
  total: number;
  creations: number;
  modifications: number;
  suppressions: number;
}
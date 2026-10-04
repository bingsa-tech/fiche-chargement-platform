export interface Role {
  id: number;
  code: string;
  libelle: string;
  description: string | null;
  actif: boolean;
  createdAt: string;
}
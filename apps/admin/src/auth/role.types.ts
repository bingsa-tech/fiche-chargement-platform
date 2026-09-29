export type UserRole =
  | 'ADMIN'
  | 'AGENT'
  | 'CONTROLEUR'
  | 'AUTORITE_HABILITEE'
  | 'RESPONSABLE_GARE';

export interface Role {
  id: number;
  code: UserRole;
  libelle: string;
}
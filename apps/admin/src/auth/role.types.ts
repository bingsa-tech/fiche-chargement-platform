export type UserRole =
  | 'ADMIN'
  | 'AGENT'
  | 'CONTROLEUR'
  | 'AUTORITE_HABILITEE'
  | 'USER';

export interface Role {
  id: number;
  code: UserRole;
  libelle: string;
}
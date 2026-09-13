export type RoleCode =
  | 'ADMIN'
  | 'CONTROLEUR'
  | 'AGENT'
  | 'RESPONSABLE_GARE'
  | 'AUTORITE_HABILITEE';

export type PermissionAction =
  | 'READ'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'FINALIZE'
  | 'CANCEL';

export const PERMISSIONS = {
  fiches: {
    READ: [
      'ADMIN',
      'RESPONSABLE_GARE',
      'CONTROLEUR',
      'AGENT',
      'AUTORITE_HABILITEE',
    ],

    CREATE: [
      'ADMIN',
      'RESPONSABLE_GARE',
      'CONTROLEUR',
      'AGENT',
    ],

    UPDATE: [
      'ADMIN',
      'RESPONSABLE_GARE',
      'CONTROLEUR',
      'AGENT',
    ],

    DELETE: ['ADMIN'],

    FINALIZE: [
      'ADMIN',
      'RESPONSABLE_GARE',
    ],

    CANCEL: [
      'ADMIN',
      'RESPONSABLE_GARE',
    ],
  },
} as const;

/**
 * ============================================================
 * CONFIGURATION CENTRALE DES PERMISSIONS
 * ============================================================
 *
 * Source centrale des règles RBAC du backend.
 * La sécurité réelle est assurée par les guards NestJS.
 */

export const ROLE_CODES = {
  ADMIN: 'ADMIN',
  RESPONSABLE_GARE: 'RESPONSABLE_GARE',
  CONTROLEUR: 'CONTROLEUR',
  AGENT: 'AGENT',
  AUTORITE_HABILITEE: 'AUTORITE_HABILITEE',
} as const;

export type RoleCode =
  (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

/**
 * Actions disponibles dans le système.
 */
export const PERMISSION_ACTIONS = {
  READ: 'READ',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  FINALIZE: 'FINALIZE',
  CANCEL: 'CANCEL',
  PROCESS: 'PROCESS',
  EXECUTE: 'EXECUTE',
} as const;

export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

/**
 * Ressources disponibles dans le système.
 */
export const PERMISSION_RESOURCES = {
  UTILISATEURS: 'utilisateurs',
  ROLES: 'roles',
  GARES: 'gares',
  VEHICULES: 'vehicules',
  CHAUFFEURS: 'chauffeurs',
  DOCUMENTS: 'documents',
  ALERTES: 'alertes',
  DESTINATIONS: 'destinations',
  ITINERAIRES: 'itineraires',
  FICHES: 'fiches',
  PASSAGERS: 'passagers',
  PROPRIETAIRES: 'proprietaires',
  AUDIT: 'audit',
  SYNC: 'sync',
} as const;

export type PermissionResource =
  (typeof PERMISSION_RESOURCES)[keyof typeof PERMISSION_RESOURCES];

/**
 * ============================================================
 * MATRICE CENTRALE DES PERMISSIONS
 * ============================================================
 *
 * Chaque action indique explicitement les rôles autorisés.
 * Une action absente doit être considérée comme interdite.
 */
export const PERMISSIONS = {
  /**
   * UTILISATEURS
   */
  [PERMISSION_RESOURCES.UTILISATEURS]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * RÔLES
   */
  [PERMISSION_RESOURCES.ROLES]: {
    READ: [
      ROLE_CODES.ADMIN,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * GARES
   */
  [PERMISSION_RESOURCES.GARES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * VÉHICULES
   */
  [PERMISSION_RESOURCES.VEHICULES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.AGENT,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
  },

  /**
   * CHAUFFEURS
   */
  [PERMISSION_RESOURCES.CHAUFFEURS]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.AGENT,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
  },

  /**
   * DOCUMENTS
   */
  [PERMISSION_RESOURCES.DOCUMENTS]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
  },

  /**
   * ALERTES
   */
  [PERMISSION_RESOURCES.ALERTES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    PROCESS: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
  },

  /**
   * DESTINATIONS
   */
  [PERMISSION_RESOURCES.DESTINATIONS]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * ITINÉRAIRES
   */
  [PERMISSION_RESOURCES.ITINERAIRES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * FICHES DE CHARGEMENT
   */
  [PERMISSION_RESOURCES.FICHES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    FINALIZE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    CANCEL: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
  },

  /**
   * PASSAGERS
   */
  [PERMISSION_RESOURCES.PASSAGERS]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
  },

  /**
   * PROPRIÉTAIRES
   *
   * READ   : ADMIN, RESPONSABLE_GARE
   * CREATE : ADMIN, RESPONSABLE_GARE
   * UPDATE : ADMIN, RESPONSABLE_GARE
   * DELETE : ADMIN uniquement
   */
  [PERMISSION_RESOURCES.PROPRIETAIRES]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    CREATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    UPDATE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
    ],
    DELETE: [
      ROLE_CODES.ADMIN,
    ],
  },

  /**
   * AUDIT
   */
  [PERMISSION_RESOURCES.AUDIT]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
  },

  /**
   * SYNCHRONISATION
   */
  [PERMISSION_RESOURCES.SYNC]: {
    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
    EXECUTE: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.CONTROLEUR,
      ROLE_CODES.AGENT,
    ],
  },
} as const;

/**
 * Types internes.
 */
export type PermissionMap = typeof PERMISSIONS;

/**
 * Vérifie si un rôle possède une permission.
 */
export function hasPermission(
  role: RoleCode,
  resource: PermissionResource,
  action: string,
): boolean {
  const resourcePermissions = PERMISSIONS[resource] as
    | Record<string, readonly RoleCode[]>
    | undefined;

  const allowedRoles = resourcePermissions?.[action];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
}

/**
 * Retourne les actions autorisées pour un rôle.
 */
export function getPermissionsByRole(
  role: RoleCode,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [resource, actions] of Object.entries(PERMISSIONS)) {
    const allowedActions = Object.entries(actions)
      .filter(([, roles]) =>
        (roles as readonly RoleCode[]).includes(role),
      )
      .map(([action]) => action);

    if (allowedActions.length > 0) {
      result[resource] = allowedActions;
    }
  }

  return result;
}

/**
 * Retourne les rôles autorisés pour une action.
 */
export function getAllowedRoles(
  resource: PermissionResource,
  action: string,
): readonly RoleCode[] {
  const resourcePermissions = PERMISSIONS[resource] as
    | Record<string, readonly RoleCode[]>
    | undefined;

  return resourcePermissions?.[action] ?? [];
}

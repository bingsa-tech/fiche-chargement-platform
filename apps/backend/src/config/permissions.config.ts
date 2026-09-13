/**
 * ============================================================
 * CONFIGURATION CENTRALE DES PERMISSIONS
 * ============================================================
 *
 * Fichier :
 * src/config/permissions.config.ts
 *
 * Principe :
 *
 * RESSOURCE
 *     ↓
 * ACTION
 *     ↓
 * RÔLES AUTORISÉS
 *
 * Cette configuration constitue la source centrale
 * des règles RBAC (Role-Based Access Control).
 *
 * Elle peut être utilisée par :
 *
 * - PermissionsGuard
 * - PermissionsService
 * - Controllers NestJS
 * - Endpoint GET /api/auth/me
 * - Dashboard Flutter
 * - Dashboard Vue 3
 *
 * IMPORTANT :
 * Le frontend utilise les permissions pour afficher
 * ou masquer les ressources/actions.
 *
 * La véritable sécurité reste toujours assurée
 * par le backend via les Guards NestJS.
 * ============================================================
 */

/**
 * ============================================================
 * 1. RÔLES DU SYSTÈME
 * ============================================================
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
 * ============================================================
 * 2. ACTIONS DISPONIBLES
 * ============================================================
 *
 * Toutes les actions possibles du système.
 *
 * Toutes les ressources n'utilisent pas forcément
 * toutes les actions.
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
 * ============================================================
 * 3. RESSOURCES DU SYSTÈME
 * ============================================================
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

  AUDIT: 'audit',

  SYNC: 'sync',
} as const;

export type PermissionResource =
  (typeof PERMISSION_RESOURCES)[keyof typeof PERMISSION_RESOURCES];

/**
 * ============================================================
 * 4. MATRICE CENTRALE DES PERMISSIONS
 * ============================================================
 *
 * Structure :
 *
 * PERMISSIONS.ressource.ACTION
 *
 * Exemple :
 *
 * PERMISSIONS.fiches.CREATE
 *
 * retourne :
 *
 * [
 *   'ADMIN',
 *   'RESPONSABLE_GARE',
 *   'CONTROLEUR',
 *   'AGENT'
 * ]
 */

export const PERMISSIONS = {


  /**
   * ==========================================================
   * UTILISATEURS
   * ==========================================================
   */

  [PERMISSION_RESOURCES.UTILISATEURS]: {

    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
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
   * ==========================================================
   * RÔLES
   * ==========================================================
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
   * ==========================================================
   * GARES
   * ==========================================================
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
   * ==========================================================
   * VÉHICULES
   * ==========================================================
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
   * ==========================================================
   * CHAUFFEURS
   * ==========================================================
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
   * ==========================================================
   * DOCUMENTS
   * ==========================================================
   *
   * Regroupe :
   *
   * - Document véhicule
   * - Document chauffeur
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
   * ==========================================================
   * ALERTES
   * ==========================================================
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
   * ==========================================================
   * DESTINATIONS
   * ==========================================================
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
   * ==========================================================
   * ITINÉRAIRES
   * ==========================================================
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
   * ==========================================================
   * FICHES DE CHARGEMENT
   * ==========================================================
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
   * ==========================================================
   * PASSAGERS
   * ==========================================================
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
   * ==========================================================
   * AUDIT
   * ==========================================================
   */

  [PERMISSION_RESOURCES.AUDIT]: {

    READ: [
      ROLE_CODES.ADMIN,
      ROLE_CODES.RESPONSABLE_GARE,
      ROLE_CODES.AUTORITE_HABILITEE,
    ],
  },

  /**
   * ==========================================================
   * SYNCHRONISATION
   * ==========================================================
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
 * ============================================================
 * 5. TYPES INTERNES
 * ============================================================
 */

export type PermissionMap = typeof PERMISSIONS;


/**
 * ============================================================
 * 6. VÉRIFIER UNE PERMISSION
 * ============================================================
 *
 * Exemple :
 *
 * hasPermission(
 *   'CONTROLEUR',
 *   'fiches',
 *   'CREATE',
 * );
 */

export function hasPermission(
  role: RoleCode,
  resource: PermissionResource,
  action: string,
): boolean {

  const resourcePermissions =
    PERMISSIONS[resource] as Record<
      string,
      readonly RoleCode[]
    >;

  const allowedRoles =
    resourcePermissions?.[action];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
}


/**
 * ============================================================
 * 7. RÉCUPÉRER LES PERMISSIONS D'UN RÔLE
 * ============================================================
 *
 * Exemple :
 *
 * getPermissionsByRole('CONTROLEUR');
 *
 * Résultat :
 *
 * {
 *   fiches: ['READ', 'CREATE', 'UPDATE'],
 *   vehicules: ['READ', 'UPDATE'],
 *   ...
 * }
 */

export function getPermissionsByRole(
  role: RoleCode,
) {
  const result: Record<
    string,
    string[]
  > = {};

  for (const [
    resource,
    actions,
  ] of Object.entries(PERMISSIONS)) {

    const allowedActions =
      Object.entries(actions)
        .filter(([, roles]) =>
          (roles as readonly RoleCode[])
            .includes(role),
        )
        .map(([action]) => action);

    if (allowedActions.length > 0) {
      result[resource] = allowedActions;
    }
  }

  return result;
}


/**
 * ============================================================
 * 8. RÉCUPÉRER LES RÔLES AUTORISÉS
 * ============================================================
 *
 * Exemple :
 *
 * getAllowedRoles(
 *   'fiches',
 *   'CREATE',
 * );
 */

export function getAllowedRoles(
  resource: PermissionResource,
  action: string,
): readonly RoleCode[] {

  const resourcePermissions =
    PERMISSIONS[resource] as Record<
      string,
      readonly RoleCode[]
    >;

  return resourcePermissions?.[action] ?? [];
}
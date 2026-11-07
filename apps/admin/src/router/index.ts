
import {
  createRouter,
  createWebHistory,
  type RouteLocationRaw,
  type RouteRecordRaw,
} from 'vue-router';

import { useAuthStore } from '../auth/auth.store';
import type { UserRole } from '../auth/role.types';

const routes: RouteRecordRaw[] = [
  // ============================================================
  // AUTHENTIFICATION
  // ============================================================
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
    },
  },

  // ============================================================
  // PAGES PUBLIQUES
  // ============================================================
  {
    path: '/accueil',
    name: 'landing',
    component: () => import('../views/public/LandingView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/public/DemoView.vue'),
    meta: {
      public: true,
    },
  },

  // ============================================================
  // APPLICATION PROTÃ‰GÃ‰E
  // ============================================================
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      // ACCUEIL
      {
        path: '',
        name: 'home',
        redirect: {
          name: 'landing',
        },
      },

      // ========================================================
      // GARES
      // ========================================================
      {
        path: 'gares',
        name: 'gares',
        component: () => import('../views/gares/GaresListView.vue'),
      },
      {
        path: 'gares/new',
        name: 'gare-create',
        component: () => import('../views/gares/GareFormView.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },
      },
      {
        path: 'gares/:id/edit',
        name: 'gare-edit',
        component: () => import('../views/gares/GareFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },

      // ========================================================
      // PROPRIÃ‰TAIRES
      // ========================================================
      {
        path: 'proprietaires',
        name: 'proprietaires',
        component: () =>
          import('../views/proprietaires/ProprietairesListView.vue'),
      },
      {
        path: 'proprietaires/new',
        name: 'proprietaire-create',
        component: () =>
          import('../views/proprietaires/ProprietairesFormView.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },
      },
      {
        path: 'proprietaires/:id/edit',
        name: 'proprietaire-edit',
        component: () =>
          import('../views/proprietaires/ProprietairesFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },

      // ========================================================
      // UTILISATEURS
      // ========================================================
      {
        path: 'utilisateurs',
        name: 'utilisateurs',
        component: () =>
          import('../views/utilisateurs/UtilisateurListView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },
      {
        path: 'utilisateurs/nouveau',
        name: 'utilisateur-create',
        component: () =>
          import('../views/utilisateurs/UtilisateurFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },
      {
        path: 'utilisateurs/:id/modifier',
        name: 'utilisateur-edit',
        component: () =>
          import('../views/utilisateurs/UtilisateurFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },
      {
        path: 'admin/supervision',
        name: 'admin-supervision',
        component: () =>
          import('../views/admin/SystemSupervisionView.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },
      },
      {
        path: 'presence',
        name: 'presence-online',
        component: () =>
          import('../views/presence/PresenceOnlineView.vue'),
        meta: {
          roles: ['ADMIN', 'AUTORITE_HABILITEE'] satisfies UserRole[],
        },
      },

      // ========================================================
      // VÃ‰HICULES
      // ========================================================
      {
        path: 'vehicules',
        name: 'vehicules',
        component: () =>
          import('../views/vehicules/VehiculesListView.vue'),
      },
      {
        path: 'vehicules/new',
        name: 'vehicule-create',
        component: () =>
          import('../views/vehicules/VehiculeFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE', 'AGENT'] satisfies UserRole[],
        },
      },
      {
        path: 'vehicules/:id/edit',
        name: 'vehicule-edit',
        component: () =>
          import('../views/vehicules/VehiculeFormView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
          ] satisfies UserRole[],
        },
      },

      // ========================================================
      // CHAUFFEURS
      // ========================================================
      {
        path: 'chauffeurs',
        name: 'chauffeurs',
        component: () =>
          import('../views/chauffeurs/ChauffeurListView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },
      {
        path: 'chauffeurs/nouveau',
        name: 'chauffeur-create',
        component: () =>
          import('../views/chauffeurs/ChauffeurFormView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE', 'AGENT'] satisfies UserRole[],
        },
      },
      {
        path: 'chauffeurs/:id/modifier',
        name: 'chauffeur-edit',
        component: () =>
          import('../views/chauffeurs/ChauffeurFormView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
          ] satisfies UserRole[],
        },
      },

      // ========================================================
      // DOCUMENTS VÃ‰HICULES
      // ========================================================
      {
        path: 'documents/vehicules',
        name: 'documents-vehicules',
        component: () =>
          import('../views/documents/DocumentVehiculeListView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },

      // ========================================================
      // DOCUMENTS CHAUFFEURS
      // ========================================================
      {
        path: 'documents/chauffeurs',
        name: 'documents-chauffeurs',
        component: () =>
          import('../views/documents/DocumentChauffeurListView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },

      // ========================================================
      // FICHES DE CHARGEMENT
      // La route new est dÃ©clarÃ©e sÃ©parÃ©ment de la liste.
      // ========================================================
      {
        path: 'fiches/new',
        name: 'fiche-create',
        component: () => import('../views/fiches/FicheCreateView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
          ] satisfies UserRole[],
        },
      },
      {
        path: 'fiches',
        name: 'fiches',
        component: () => import('../views/fiches/FichesListView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },

      {
        path: 'fiches/:id',
        name: 'fiche-detail',
        component: () => import('../views/fiches/FicheDetailView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },
      {
        path: 'alertes',
        name: 'alertes',
        component: () => import('../views/alertes/AlertesView.vue'),
        meta: {
          roles: [
            'ADMIN',
            'RESPONSABLE_GARE',
            'CONTROLEUR',
            'AGENT',
            'AUTORITE_HABILITEE',
          ] satisfies UserRole[],
        },
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('../views/audit/AuditView.vue'),
        meta: {
          roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },
      {
        path: 'passagers',
        name: 'passagers',
        component: () => import('../views/passagers/PassagersView.vue'),
        meta: {
          requiresAuth: true, // Si votre route est protÃ©gÃ©e par authentification
          // title: 'Gestion des Passagers'
        },
      },

      // ========================================================
      // ROLE HUB
      // ========================================================
      {
        path: 'role-hub',
        name: 'role-hub',
        component: () => import('../views/RoleHubView.vue'),
      },

      // ========================================================
      // TEST AUTHENTIFICATION JWT
      // ========================================================
      {
        path: 'auth-test',
        name: 'auth-test',
        component: () => import('../views/AuthTestView.vue'),
      },

      // ========================================================
      // DASHBOARDS
      // ========================================================
      {
        path: 'admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/dashboards/AdminDashboard.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },

      },
      {
        path: 'agent/dashboard',
        name: 'agent-dashboard',
        component: () => import('../views/dashboards/AgentDashboard.vue'),
        meta: {
          roles: ['AGENT'] satisfies UserRole[],
        },
      },
      {
        path: 'controleur/dashboard',
        name: 'controleur-dashboard',
        component: () =>
          import('../views/dashboards/ControleurDashboard.vue'),
        meta: {
          roles: ['CONTROLEUR'] satisfies UserRole[],
        },
      },
      {
        path: 'responsable-gare/dashboard',
        name: 'responsable-gare-dashboard',
        component: () =>
          import('../views/dashboards/ResponsableGareDashboard.vue'),
        meta: {
          roles: ['RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },
      {
        path: 'autorite/dashboard',
        name: 'autorite-dashboard',
        component: () => import('../views/dashboards/AutoriteDashboard.vue'),
        meta: {
          roles: ['AUTORITE_HABILITEE'] satisfies UserRole[],
        },
      },
    ],
  },

  // ============================================================
  // ACCÃˆS NON AUTORISÃ‰
  // ============================================================
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: {
      public: true,
    },
  },

  // ============================================================
  // PAGE 404
  // ============================================================
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      public: true,
    },
  },
];

// ============================================================
// CRÃ‰ATION DU ROUTEUR
// ============================================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

// ============================================================
// REDIRECTION VERS LE DASHBOARD SELON LE RÃ”LE
// ============================================================
export function getDashboardRoute(role: UserRole | null): RouteLocationRaw {
  switch (role) {
    case 'ADMIN':
      return { name: 'admin-dashboard' };

    case 'AGENT':
      return { name: 'agent-dashboard' };

    case 'CONTROLEUR':
      return { name: 'controleur-dashboard' };

    case 'RESPONSABLE_GARE':
      return { name: 'responsable-gare-dashboard' };

    case 'AUTORITE_HABILITEE':
      return { name: 'autorite-dashboard' };

    default:
      return { name: 'unauthorized' };
  }
}


// ============================================================
// GARDE GLOBAL : SESSION ET AUTORISATION PAR RÃ”LE
// ============================================================
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // ==========================================================
  // 1. INITIALISATION DE LA SESSION
  // ==========================================================

  authStore.initialize();

  // ==========================================================
  // 2. ROUTES PUBLIQUES
  // ==========================================================

  if (to.meta.public) {
    // Un utilisateur déjà connecté ne doit pas revenir
    // sur la page de connexion.
    if (
      to.name === 'login' &&
      authStore.isAuthenticated
    ) {
      return getDashboardRoute(authStore.role);
    }

    return true;
  }

  // ==========================================================
  // 3. REDIRECTION VERS L'ACCUEIL PUBLIC
  // ==========================================================

  if (
    to.name === 'home' &&
    !authStore.isAuthenticated
  ) {
    return { name: 'landing' };
  }

  // ==========================================================
  // 4. AUTHENTIFICATION OBLIGATOIRE
  // ==========================================================

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // ==========================================================
  // 5. CONTRÔLE DES AUTORISATIONS PAR RÔLE
  // ==========================================================
const allowedRoles = to.meta.roles as
    | UserRole[]
    | undefined;

  if (allowedRoles) {
    const currentRole = authStore.role;

    if (
      !currentRole ||
      !allowedRoles.includes(currentRole)
    ) {
      return { name: 'unauthorized' };
    }
  }

  return true;
});

router.onError((error, to, from) => {
  console.error('[Vue Router] Échec de navigation', {
    error,
    from: from.fullPath,
    to: to.fullPath,
  });
});

export default router;
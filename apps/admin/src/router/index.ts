
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
  // APPLICATION PROTÉGÉE
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
          name: 'role-hub',
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
      // PROPRIÉTAIRES
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

      // ========================================================
      // VÉHICULES
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
      // DOCUMENTS VÉHICULES
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
      // La route new est déclarée séparément de la liste.
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
  // ACCÈS NON AUTORISÉ
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
// CRÉATION DU ROUTEUR
// ============================================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

// ============================================================
// REDIRECTION VERS LE DASHBOARD SELON LE RÔLE
// ============================================================
function getDashboardRoute(role: UserRole | null): RouteLocationRaw {
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
// GARDE GLOBAL : SESSION ET AUTORISATION PAR RÔLE
// ============================================================
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // Restaurer la session si elle n'est pas déjà en mémoire.
  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // Routes publiques.
  if (to.meta.public) {
    if (to.name === 'login' && authStore.isAuthenticated) {
      return getDashboardRoute(authStore.role);
    }

    return true;
  }

  // Authentification obligatoire.
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // Vérification du rôle requis par la route.
  const allowedRoles = to.meta.roles as UserRole[] | undefined;

  if (allowedRoles) {
    const currentRole = authStore.role;

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return { name: 'unauthorized' };
    }
  }

  return true;
});

export default router;

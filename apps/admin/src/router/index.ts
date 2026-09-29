import {
  createRouter,
  createWebHistory,
  type RouteLocationRaw,
  type RouteRecordRaw,
} from 'vue-router';

import { useAuthStore } from '../auth/auth.store';
import type { UserRole } from '../auth/role.types';

/**
 * ============================================================================
 * ROUTES DE L'APPLICATION ADMIN
 * ============================================================================
 *
 * Architecture :
 *
 * /login
 *    └── route publique
 *
 * /
 *    └── AdminLayout.vue
 *         ├── /role-hub
 *         ├── /auth-test
 *         ├── /admin/dashboard
 *         ├── /agent/dashboard
 *         ├── /controleur/dashboard
 *         ├── /responsable-gare/dashboard
 *         └── /autorite/dashboard
 *
 * /unauthorized
 *    └── route publique
 *
 * /:pathMatch(.*)*
 *    └── 404
 *
 * IMPORTANT :
 * Le frontend contrôle l'affichage et la navigation.
 * La sécurité réelle reste assurée par le backend NestJS
 * et ses guards/permissions.
 */

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

const routes: RouteRecordRaw[] = [
  // ==========================================================================
  // AUTHENTIFICATION
  // ==========================================================================

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
    },
  },

  // ==========================================================================
  // APPLICATION PROTÉGÉE
  // ==========================================================================

  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
    },

    children: [
      // ========================================================================
      // ACCUEIL
      // ========================================================================

      {
        path: '',
        name: 'home',
        redirect: {
          name: 'role-hub',
        },
      },

      // ========================================================================
      // ROLE HUB
      // ========================================================================

      {
        path: 'role-hub',
        name: 'role-hub',
        component: () => import('../views/RoleHubView.vue'),
      },

      // ========================================================================
      // TEST AUTHENTIFICATION JWT
      // ========================================================================

      {
        path: 'auth-test',
        name: 'auth-test',
        component: () => import('../views/AuthTestView.vue'),
      },

      // ========================================================================
      // DASHBOARD ADMIN
      // ========================================================================

      {
        path: 'admin/dashboard',
        name: 'admin-dashboard',
        component: () =>
          import('../views/dashboards/AdminDashboard.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },
      },

      // ========================================================================
      // DASHBOARD AGENT
      // ========================================================================

      {
        path: 'agent/dashboard',
        name: 'agent-dashboard',
        component: () =>
          import('../views/dashboards/AgentDashboard.vue'),
        meta: {
          roles: ['AGENT'] satisfies UserRole[],
        },
      },

      // ========================================================================
      // DASHBOARD CONTRÔLEUR
      // ========================================================================

      {
        path: 'controleur/dashboard',
        name: 'controleur-dashboard',
        component: () =>
          import('../views/dashboards/ControleurDashboard.vue'),
        meta: {
          roles: ['CONTROLEUR'] satisfies UserRole[],
        },
      },

      // ========================================================================
      // DASHBOARD RESPONSABLE DE GARE
      // ========================================================================

      {
        path: 'responsable-gare/dashboard',
        name: 'responsable-gare-dashboard',
        component: () =>
          import(
            '../views/dashboards/ResponsableGareDashboard.vue'
          ),
        meta: {
          roles: ['RESPONSABLE_GARE'] satisfies UserRole[],
        },
      },

      // ========================================================================
      // DASHBOARD AUTORITÉ HABILITÉE
      // ========================================================================

      {
        path: 'autorite/dashboard',
        name: 'autorite-dashboard',
        component: () =>
          import('../views/dashboards/AutoriteDashboard.vue'),
        meta: {
          roles: ['AUTORITE_HABILITEE'] satisfies UserRole[],
        },
      },
    ],
  },

  // ==========================================================================
  // NON AUTORISÉ
  // ==========================================================================

  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () =>
      import('../views/UnauthorizedView.vue'),
    meta: {
      public: true,
    },
  },

  // ==========================================================================
  // PAGE 404
  // ==========================================================================

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () =>
      import('../views/NotFoundView.vue'),
    meta: {
      public: true,
    },
  },
];

/**
 * ============================================================================
 * ROUTEUR
 * ============================================================================
 */

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL,
  ),

  routes,

  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

/**
 * ============================================================================
 * DASHBOARD PAR RÔLE
 * ============================================================================
 *
 * Cette fonction détermine le dashboard initial
 * après authentification.
 */

function getDashboardRoute(
  role: UserRole | null,
): RouteLocationRaw {
  switch (role) {
    case 'ADMIN':
      return {
        name: 'admin-dashboard',
      };

    case 'AGENT':
      return {
        name: 'agent-dashboard',
      };

    case 'CONTROLEUR':
      return {
        name: 'controleur-dashboard',
      };

    case 'RESPONSABLE_GARE':
      return {
        name: 'responsable-gare-dashboard',
      };

    case 'AUTORITE_HABILITEE':
      return {
        name: 'autorite-dashboard',
      };

    default:
      return {
        name: 'unauthorized',
      };
  }
}

/**
 * ============================================================================
 * GUARD GLOBAL
 * ============================================================================
 *
 * Responsabilités :
 *
 * 1. Restaurer la session depuis localStorage.
 * 2. Bloquer les routes protégées sans authentification.
 * 3. Rediriger un utilisateur déjà connecté qui visite /login.
 * 4. Vérifier le rôle requis par la route.
 *
 * La vérification des permissions métier reste côté backend.
 */

router.beforeEach((to) => {
  const authStore = useAuthStore();

  // ==========================================================================
  // 1. RESTAURATION DE SESSION
  // ==========================================================================

  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // ==========================================================================
  // 2. ROUTE PUBLIQUE
  // ==========================================================================

  if (to.meta.public) {
    /**
     * Un utilisateur déjà authentifié n'a pas besoin
     * de revenir sur la page de connexion.
     */
    if (
      to.name === 'login' &&
      authStore.isAuthenticated
    ) {
      return getDashboardRoute(
        authStore.role,
      );
    }

    return true;
  }

  // ==========================================================================
  // 3. AUTHENTIFICATION REQUISE
  // ==========================================================================

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

  // ==========================================================================
  // 4. AUTORISATION PAR RÔLE
  // ==========================================================================

  const allowedRoles =
    to.meta.roles as UserRole[] | undefined;

  if (allowedRoles) {
    const currentRole = authStore.role;

    if (
      !currentRole ||
      !allowedRoles.includes(currentRole)
    ) {
      return {
        name: 'unauthorized',
      };
    }
  }

  // ==========================================================================
  // 5. ROUTE AUTORISÉE
  // ==========================================================================

  return true;
});

export default router;
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import { useAuthStore } from '../auth/auth.store';
import type { UserRole } from '../auth/role.types';

/**
 * Routes publiques et protégées de l'application Admin.
 *
 * Le socle applicatif est organisé autour de AdminLayout.
 * Les pages protégées sont rendues à l'intérieur du layout
 * via son <RouterView />.
 */
const routes: RouteRecordRaw[] = [
  // ===========================================================================
  // AUTHENTIFICATION
  // ===========================================================================

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
    },
  },

  // ===========================================================================
  // APPLICATION PROTÉGÉE
  // ===========================================================================

  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
    },

    children: [
      // -----------------------------------------------------------------------
      // RACINE
      // -----------------------------------------------------------------------

      {
        path: '',
        name: 'home',
        redirect: '/role-hub',
      },

      // -----------------------------------------------------------------------
      // ROLE HUB
      // -----------------------------------------------------------------------

      {
        path: 'role-hub',
        name: 'role-hub',
        component: () => import('../views/RoleHubView.vue'),
      },

      // -----------------------------------------------------------------------
      // DASHBOARD ADMIN
      // -----------------------------------------------------------------------

      {
        path: 'admin/dashboard',
        name: 'admin-dashboard',
        component: () =>
          import('../views/dashboards/AdminDashboard.vue'),
        meta: {
          roles: ['ADMIN'] satisfies UserRole[],
        },
      },

      // -----------------------------------------------------------------------
      // DASHBOARD AGENT
      // -----------------------------------------------------------------------

      {
        path: 'agent/dashboard',
        name: 'agent-dashboard',
        component: () =>
          import('../views/dashboards/AgentDashboard.vue'),
        meta: {
          roles: ['AGENT'] satisfies UserRole[],
        },
      },

      // -----------------------------------------------------------------------
      // DASHBOARD CONTROLEUR
      // -----------------------------------------------------------------------

      {
        path: 'controleur/dashboard',
        name: 'controleur-dashboard',
        component: () =>
          import('../views/dashboards/ControleurDashboard.vue'),
        meta: {
          roles: ['CONTROLEUR'] satisfies UserRole[],
        },
      },

      // -----------------------------------------------------------------------
      // DASHBOARD AUTORITÉ
      // -----------------------------------------------------------------------

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

  // ===========================================================================
  // NON AUTORISÉ
  // ===========================================================================

  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () =>
      import('../views/UnauthorizedView.vue'),
    meta: {
      public: true,
    },
  },

  // ===========================================================================
  // 404
  // ===========================================================================

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
 * Création du routeur Vue.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

/**
 * Retourne la route du dashboard correspondant au rôle.
 */
function getDashboardRoute(role: UserRole | null) {
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
 * Guard global d'authentification et d'autorisation.
 */
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // ===========================================================================
  // 1. Restaurer la session
  // ===========================================================================

  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // ===========================================================================
  // 2. Route publique
  // ===========================================================================

  if (to.meta.public) {
    /**
     * Un utilisateur déjà connecté ne doit pas revenir sur /login.
     */
    if (
      to.name === 'login' &&
      authStore.isAuthenticated
    ) {
      return getDashboardRoute(authStore.role);
    }

    return true;
  }

  // ===========================================================================
  // 3. Authentification obligatoire
  // ===========================================================================

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

  // ===========================================================================
  // 4. Autorisation par rôle
  // ===========================================================================

  /**
   * Important :
   * to.meta.roles fonctionne également pour les routes enfants.
   */
  const allowedRoles =
    to.meta.roles as UserRole[] | undefined;

  if (allowedRoles) {
    if (
      !authStore.role ||
      !allowedRoles.includes(authStore.role)
    ) {
      return {
        name: 'unauthorized',
      };
    }
  }

  // ===========================================================================
  // 5. Route autorisée
  // ===========================================================================

  return true;
});

export default router;


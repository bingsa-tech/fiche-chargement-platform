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
 * Les dashboards sont actuellement les pages de base du socle
 * d'authentification. Ils pourront ensuite être enrichis
 * progressivement avec les fonctionnalités métier.
 */
const routes: RouteRecordRaw[] = [
  // ---------------------------------------------------------------------------
  // AUTHENTIFICATION
  // ---------------------------------------------------------------------------

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
    },
  },

  // ---------------------------------------------------------------------------
  // ROLE HUB
  // ---------------------------------------------------------------------------

  {
    path: '/',
    name: 'home',
    redirect: '/role-hub',
  },

  {
    path: '/role-hub',
    name: 'role-hub',
    component: () => import('../views/RoleHubView.vue'),
    meta: {
      requiresAuth: true,
    },
  },

  // ---------------------------------------------------------------------------
  // DASHBOARD ADMIN
  // ---------------------------------------------------------------------------

  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () =>
      import('../views/dashboards/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN'] satisfies UserRole[],
    },
  },

  // ---------------------------------------------------------------------------
  // DASHBOARD AGENT
  // ---------------------------------------------------------------------------

  {
    path: '/agent/dashboard',
    name: 'agent-dashboard',
    component: () =>
      import('../views/dashboards/AgentDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['AGENT'] satisfies UserRole[],
    },
  },

  // ---------------------------------------------------------------------------
  // DASHBOARD CONTROLEUR
  // ---------------------------------------------------------------------------

  {
    path: '/controleur/dashboard',
    name: 'controleur-dashboard',
    component: () =>
      import('../views/dashboards/ControleurDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['CONTROLEUR'] satisfies UserRole[],
    },
  },

  // ---------------------------------------------------------------------------
  // DASHBOARD AUTORITÉ
  // ---------------------------------------------------------------------------

  {
    path: '/autorite/dashboard',
    name: 'autorite-dashboard',
    component: () =>
      import('../views/dashboards/AutoriteDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['AUTORITE_HABILITEE'] satisfies UserRole[],
    },
  },

  // ---------------------------------------------------------------------------
  // NON AUTORISÉ
  // ---------------------------------------------------------------------------

  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () =>
      import('../views/UnauthorizedView.vue'),
    meta: {
      public: true,
    },
  },

  // ---------------------------------------------------------------------------
  // 404
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // 1. Restaurer la session au démarrage
  // ---------------------------------------------------------------------------

  if (!authStore.isAuthenticated) {
    authStore.restoreSession();
  }

  // ---------------------------------------------------------------------------
  // 2. Route publique
  // ---------------------------------------------------------------------------

  if (to.meta.public) {
    /**
     * Si l'utilisateur est déjà connecté et tente d'accéder
     * à /login, on le redirige vers son dashboard.
     */
    if (
      to.name === 'login' &&
      authStore.isAuthenticated
    ) {
      return getDashboardRoute(authStore.role);
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // 3. Route nécessitant une authentification
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // 4. Vérification du rôle
  // ---------------------------------------------------------------------------

  const allowedRoles =
    to.meta.roles as UserRole[] | undefined;

  if (allowedRoles && authStore.role) {
    if (!allowedRoles.includes(authStore.role)) {
      return {
        name: 'unauthorized',
      };
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Route autorisée
  // ---------------------------------------------------------------------------

  return true;
});

export default router;

<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import {
  RouterLink,
  RouterView,
  useRoute,
  useRouter,
} from 'vue-router';

import { useAuthStore } from '../auth/auth.store';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
import { presenceApi } from '../api/presence.api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(false);

// ============================================================
// PRESENCE EN LIGNE - HEARTBEAT
// ============================================================

const HEARTBEAT_INTERVAL = 30_000;

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let heartbeatInProgress = false;

async function sendHeartbeat(): Promise<void> {
  if (!authStore.isAuthenticated || heartbeatInProgress) {
    return;
  }

  heartbeatInProgress = true;

  try {
    const response = await presenceApi.heartbeat();

    console.debug(
      '[PRESENCE] Heartbeat confirme :',
      response.lastSeenAt,
    );
  } catch (error: unknown) {
    console.error(
      '[PRESENCE] Echec du heartbeat :',
      error,
    );
  } finally {
    heartbeatInProgress = false;
  }
}

function startHeartbeat(): void {
  if (heartbeatTimer !== null) {
    return;
  }

  void sendHeartbeat();

  heartbeatTimer = setInterval(() => {
    void sendHeartbeat();
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat(): void {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    stopHeartbeat();

    if (isAuthenticated) {
      startHeartbeat();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  stopHeartbeat();
});

// ============================================================
// INFORMATIONS UTILISATEUR
// ============================================================

const userFullName = computed(() => {
  const user = authStore.user;

  if (!user) {
    return 'Utilisateur';
  }

  return (
    `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() ||
    'Utilisateur'
  );
});

const userRole = computed(
  () => authStore.role ?? 'ROLE_INCONNU',
);

const userEmail = computed(
  () => authStore.user?.email ?? '',
);

const userGare = computed(
  () => authStore.user?.gareId ?? 'Non affectee',
);

// ============================================================
// PERMISSIONS DE NAVIGATION
// ============================================================

const canManageUsers = computed(
  () =>
    authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE',
);

const canViewAudit = computed(
  () =>
    authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE',
);

const canViewPresenceOnline = computed(
  () =>
    authStore.role === 'ADMIN' ||
    authStore.role === 'AUTORITE_HABILITEE',
);

// ============================================================
// NAVIGATION
// ============================================================

type RouteName =
  | 'gares'
  | 'proprietaires'
  | 'vehicules'
  | 'chauffeurs'
  | 'documents-vehicules'
  | 'destinations'
  | 'documents-chauffeurs'
  | 'utilisateurs'
  | 'fiches'
  | 'alertes'
  | 'passagers'
  | 'audit'
  | 'presence-online'
  | 'itineraires';

const currentRouteName = computed(
  () => route.name?.toString() ?? '',
);

function isActive(routeName: RouteName): boolean {
  return currentRouteName.value === routeName;
}

function closeSidebar(): void {
  sidebarOpen.value = false;
}

function toggleSidebar(): void {
  sidebarOpen.value = !sidebarOpen.value;
}

function navigateTo(routeName: RouteName): void {
  closeSidebar();

  if (currentRouteName.value === routeName) {
    return;
  }

  void router.push({ name: routeName });
}

// Ferme aussi le menu si la navigation change autrement
watch(
  () => route.fullPath,
  () => {
    closeSidebar();
  },
);

// ============================================================
// DECONNEXION
// ============================================================

async function logout(): Promise<void> {
  closeSidebar();

  try {
    await authStore.logout();
  } catch (error: unknown) {
    console.error(
      'Erreur lors de la deconnexion',
      error,
    );
  } finally {
    await router.push({ name: 'home' });
  }
}
</script>

<template>
  <div class="admin-layout">
    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
      aria-label="Navigation principale"
    >
      <!-- Identite FOPTRAC -->
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo-wrapper">
            <img
              src="/icons/icon-512.png"
              alt="Logo FOPTRAC"
              class="brand-logo"
            />
          </div>

          <div class="brand-text">
            <strong>FOPTRAC</strong>
            <span>Gestion des fiches de chargement</span>
          </div>
        </div>

        <button
          type="button"
          class="close-sidebar"
          aria-label="Fermer le menu"
          @click="closeSidebar"
        >
          ×
        </button>
      </div>

      <!-- NAVIGATION -->
      <nav class="navigation">
        <!-- PRINCIPAL -->
        <div class="navigation-section">
          <span class="navigation-title">
            Principal
          </span>

          <RouterLink
            :to="{ name: 'role-hub' }"
            class="navigation-item"
            active-class="active"
            @click="closeSidebar"
          >
            <span class="navigation-icon">DB</span>
            <span>Dashboard</span>
          </RouterLink>
        </div>

        <!-- GESTION -->
        <div class="navigation-section">
          <span class="navigation-title">
            Gestion
          </span>

          <button
            v-if="canManageUsers"
            type="button"
            class="navigation-item"
            :class="{ active: isActive('utilisateurs') }"
            :aria-current="isActive('utilisateurs') ? 'page' : undefined"
            @click="navigateTo('utilisateurs')"
          >
            <span class="navigation-icon">US</span>
            <span>Utilisateurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('gares') }"
            :aria-current="isActive('gares') ? 'page' : undefined"
            @click="navigateTo('gares')"
          >
            <span class="navigation-icon">GA</span>
            <span>Gares</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('proprietaires') }"
            :aria-current="isActive('proprietaires') ? 'page' : undefined"
            @click="navigateTo('proprietaires')"
          >
            <span class="navigation-icon">PR</span>
            <span>Propriétaires</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('vehicules') }"
            :aria-current="isActive('vehicules') ? 'page' : undefined"
            @click="navigateTo('vehicules')"
          >
            <span class="navigation-icon">VH</span>
            <span>Véhicules</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('chauffeurs') }"
            :aria-current="isActive('chauffeurs') ? 'page' : undefined"
            @click="navigateTo('chauffeurs')"
          >
            <span class="navigation-icon">CH</span>
            <span>Chauffeurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('documents-vehicules') }"
            :aria-current="isActive('documents-vehicules') ? 'page' : undefined"
            @click="navigateTo('documents-vehicules')"
          >
            <span class="navigation-icon">DV</span>
            <span>Documents véhicules</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('documents-chauffeurs') }"
            :aria-current="isActive('documents-chauffeurs') ? 'page' : undefined"
            @click="navigateTo('documents-chauffeurs')"
          >
            <span class="navigation-icon">DC</span>
            <span>Documents chauffeurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('fiches') }"
            :aria-current="isActive('fiches') ? 'page' : undefined"
            @click="navigateTo('fiches')"
          >
            <span class="navigation-icon">FC</span>
            <span>Fiches de chargement</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('passagers') }"
            :aria-current="isActive('passagers') ? 'page' : undefined"
            title="Module prochainement disponible"
            @click="navigateTo('passagers')"
          >
            <span class="navigation-icon">PA</span>
            <span>Passagers</span>
          </button>

          
           <!-- DESTINATIONS -->
<button
  type="button"
  class="navigation-item"
  :class="{ active: isActive('destinations') }"
  :aria-current="isActive('destinations') ? 'page' : undefined"
  @click="navigateTo('destinations')"
>
  <span class="navigation-icon">DS</span>
  <span>Destinations</span>
</button>


           <!-- ITINÉRAIRES -->
<button
  type="button"
  class="navigation-item"
  :class="{ active: isActive('itineraires') }"
  :aria-current="
    isActive('itineraires') ? 'page' : undefined
  "
  @click="navigateTo('itineraires')"
>
  <span class="navigation-icon">IT</span>
  <span>Itinéraires</span>
</button>
        </div>

        <!-- SUPERVISION -->
        <div class="navigation-section">
          <span class="navigation-title">
            Supervision
          </span>

          <button
            type="button"
            class="navigation-item"
            :class="{ active: isActive('alertes') }"
            :aria-current="isActive('alertes') ? 'page' : undefined"
            @click="navigateTo('alertes')"
          >
            <span class="navigation-icon">AL</span>
            <span>Alertes</span>
          </button>

          <button
            v-if="canViewAudit"
            type="button"
            class="navigation-item"
            :class="{ active: isActive('audit') }"
            :aria-current="isActive('audit') ? 'page' : undefined"
            @click="navigateTo('audit')"
          >
            <span class="navigation-icon">AU</span>
            <span>Journal d'audit</span>
          </button>

          <button
            v-if="canViewPresenceOnline"
            type="button"
            class="navigation-item"
            :class="{ active: isActive('presence-online') }"
            :aria-current="isActive('presence-online') ? 'page' : undefined"
            @click="navigateTo('presence-online')"
          >
            <span class="navigation-icon">ON</span>
            <span>Présence en ligne</span>
          </button>
        </div>
      </nav>

      <!-- DECONNEXION -->
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <span class="sidebar-user-name">
            {{ userFullName }}
          </span>

          <span class="sidebar-user-role">
            {{ userRole }}
          </span>
        </div>

        <button
          type="button"
          class="logout-button"
          @click="logout"
        >
          <span class="logout-icon">↪</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>

    <!-- CONTENU PRINCIPAL -->
    <div class="main-area">
      <HeaderView
        subtitle="Administration"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="content">
        <!-- INFORMATIONS DU COMPTE -->
        <section
          class="content-user-context"
          aria-label="Informations du compte connecté"
        >
          <div class="context-item">
            <span class="context-label">Compte</span>
            <strong>{{ userFullName }}</strong>
          </div>

          <div class="context-item">
            <span class="context-label">Email</span>
            <strong>
              {{ userEmail || 'Non renseigné' }}
            </strong>
          </div>

          <div class="context-item">
            <span class="context-label">Gare</span>
            <strong>{{ userGare }}</strong>
          </div>

          <div class="context-item">
            <span class="context-label">Rôle</span>
            <strong>{{ userRole }}</strong>
          </div>
        </section>

        <!-- MODULE ACTIF -->
        <div class="page-content">
          <RouterView />
        </div>
      </main>

      <FooterView />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   LAYOUT GENERAL
============================================================ */

.admin-layout {
  min-height: 100vh;
  display: flex;
  background: var(--color-background);
  color: var(--color-text-primary);
}

/* ============================================================
   SIDEBAR
============================================================ */

.sidebar {
  position: fixed;
  z-index: 100;
  inset: 0 auto 0 0;
  width: var(--sidebar-width);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-sidebar);
  color: #ffffff;
  box-sizing: border-box;
  box-shadow: 4px 0 20px rgb(15 23 42 / 8%);
  transition: transform 0.25s ease;
}

.sidebar-header {
  min-height: 82px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  padding: 3px;
  background: #ffffff;
  border: 1px solid var(--color-brand-accent);
  border-radius: 9px;
  box-sizing: border-box;
}

.brand-logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-text strong {
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.brand-text span {
  color: #aebdd0;
  font-size: 10px;
  line-height: 1.4;
}

.close-sidebar {
  display: none;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
}

/* ============================================================
   NAVIGATION
============================================================ */

.navigation {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 22px 12px;
  scrollbar-width: thin;
  scrollbar-color: rgb(255 255 255 / 20%) transparent;
}

.navigation-section {
  margin-bottom: 26px;
}

.navigation-title {
  display: block;
  margin: 0 10px 9px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.navigation-item {
  width: 100%;
  min-height: 43px;
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 4px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: #d1d9e5;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.navigation-item:hover {
  background: rgb(255 255 255 / 8%);
  color: #ffffff;
}

.navigation-item.active {
  position: relative;
  background: var(--color-brand-primary);
  border-color: rgb(255 255 255 / 12%);
  color: #ffffff;
  font-weight: 700;
}

.navigation-item.active::before {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 0;
  width: 3px;
  border-radius: 0 4px 4px 0;
  background: var(--color-brand-accent);
  content: '';
}

.navigation-icon {
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 7px;
  background: rgb(255 255 255 / 7%);
  color: #cbd5e1;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.navigation-item.active .navigation-icon {
  background: rgb(255 255 255 / 15%);
  color: var(--color-brand-accent-light);
}

.navigation-item > span:nth-child(2) {
  flex: 1;
}

.navigation-item:focus-visible,
.logout-button:focus-visible,
.close-sidebar:focus-visible {
  outline: 2px solid var(--color-brand-accent-light);
  outline-offset: 2px;
}

/* ============================================================
   SIDEBAR FOOTER
============================================================ */

.sidebar-footer {
  padding: 14px;
  border-top: 1px solid rgb(255 255 255 / 10%);
}

.sidebar-user {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  padding: 0 4px;
}

.sidebar-user-name {
  overflow: hidden;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user-role {
  color: var(--color-brand-accent-light);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.logout-button {
  width: 100%;
  min-height: 43px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 5%);
  color: #e2e8f0;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  transition: background 0.2s ease;
}

.logout-button:hover {
  background: rgb(220 38 38 / 20%);
  color: #ffffff;
}

.logout-icon {
  color: var(--color-brand-accent-light);
  font-size: 18px;
}

/* ============================================================
   MAIN AREA
============================================================ */

.main-area {
  width: calc(100% - var(--sidebar-width));
  min-width: 0;
  min-height: 100vh;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 26px 28px;
  box-sizing: border-box;
}

/* ============================================================
   CONTEXTE UTILISATEUR
============================================================ */

.content-user-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 25px;
  padding: 18px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.context-item {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.context-label {
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.content-user-context strong {
  overflow-wrap: anywhere;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 700;
}

.page-content {
  min-width: 0;
}

/* ============================================================
   OVERLAY
============================================================ */

.sidebar-overlay {
  display: none;
}

/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 1100px) {
  .content-user-context {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content {
    padding: 22px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: min(var(--sidebar-width), 86vw);
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .close-sidebar {
    display: block;
  }

  .sidebar-overlay {
    position: fixed;
    z-index: 90;
    inset: 0;
    display: block;
    background: rgb(15 23 42 / 55%);
    backdrop-filter: blur(2px);
  }

  .main-area {
    width: 100%;
    margin-left: 0;
  }

  .content {
    padding: 20px;
  }
}

@media (max-width: 560px) {
  .content-user-context {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 15px;
  }

  .content {
    padding: 14px;
  }
}

@media (max-width: 360px) {
  .content-user-context {
    grid-template-columns: 1fr;
  }
}
</style>

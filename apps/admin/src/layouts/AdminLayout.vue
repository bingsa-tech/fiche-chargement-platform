
<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

import { useAuthStore } from '../auth/auth.store';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';

const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);

const userFullName = computed(() => {
  const user = authStore.user;

  if (!user) return 'Utilisateur';

  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});

const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');
const userEmail = computed(() => authStore.user?.email ?? '');
const userGare = computed(() => authStore.user?.gareId ?? 'Non affectée');

const canManageUsers = computed(
  () =>
    authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE',
);

function closeSidebar() {
  sidebarOpen.value = false;
}

type RouteName =
  | 'gares'
  | 'proprietaires'
  | 'vehicules'
  | 'chauffeurs'
  | 'documents-vehicules'
  | 'documents-chauffeurs'
  | 'utilisateurs'
  | 'fiches';

function navigateTo(routeName: RouteName) {
  closeSidebar();
  void router.push({ name: routeName });
}

async function logout() {
  closeSidebar();

  try {
    await authStore.logout();
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
  } finally {
    await router.push({ name: 'login' });
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

    <!-- Menu latéral -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo">FC</div>

          <div class="brand-text">
            <strong>Fiche Chargement</strong>
            <span>Administration</span>
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

      <nav class="navigation">
        <div class="navigation-section">
          <span class="navigation-title">Principal</span>

          <RouterLink
            :to="{ name: 'role-hub' }"
            class="navigation-item"
            active-class="active"
            @click="closeSidebar"
          >
            <span class="navigation-icon">⌂</span>
            <span>Dashboard</span>
          </RouterLink>
        </div>

        <div class="navigation-section">
          <span class="navigation-title">Gestion</span>

          <button
            v-if="canManageUsers"
            type="button"
            class="navigation-item"
            @click="navigateTo('utilisateurs')"
          >
            <span class="navigation-icon">U</span>
            <span>Utilisateurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('gares')"
          >
            <span class="navigation-icon">G</span>
            <span>Gares</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('proprietaires')"
          >
            <span class="navigation-icon">P</span>
            <span>Propriétaires</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('vehicules')"
          >
            <span class="navigation-icon">V</span>
            <span>Véhicules</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('chauffeurs')"
          >
            <span class="navigation-icon">C</span>
            <span>Chauffeurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('documents-vehicules')"
          >
            <span class="navigation-icon">DV</span>
            <span>Documents véhicules</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('documents-chauffeurs')"
          >
            <span class="navigation-icon">DC</span>
            <span>Documents chauffeurs</span>
          </button>

          <button
            type="button"
            class="navigation-item"
            @click="navigateTo('fiches')"
          >
            <span class="navigation-icon">F</span>
            <span>Fiches de chargement</span>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">P</span>
            <span>Passagers</span>
            <small>À venir</small>
          </button>
        </div>

        <div class="navigation-section">
          <span class="navigation-title">Supervision</span>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">!</span>
            <span>Alertes</span>
            <small>À venir</small>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">A</span>
            <span>Audit</span>
            <small>À venir</small>
          </button>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button
          type="button"
          class="logout-button"
          @click="logout"
        >
          <span>↪</span>
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>

    <!-- Contenu principal -->
    <div class="main-area">
      <!-- Header officiel avec logo FOPTRAC -->
      <HeaderView subtitle="Administration" />

      <!-- Barre utilisateur -->
      <header class="topbar">
        <button
          type="button"
          class="menu-button"
          aria-label="Ouvrir le menu"
          :aria-expanded="sidebarOpen"
          @click="sidebarOpen = true"
        >
          ☰
        </button>

     
      </header>

      <main class="content">
        <!-- Informations de session -->
        <section
          class="content-user-context"
          aria-label="Informations du compte connecté"
        >
          <div>
            <span class="context-label">Compte</span>
            <strong>{{ userFullName }}</strong>
          </div>

          <div>
            <span class="context-label">Email</span>
            <strong>{{ userEmail || 'Non renseigné' }}</strong>
          </div>

          <div>
            <span class="context-label">Gare</span>
            <strong>{{ userGare }}</strong>
          </div>

          <div>
            <span class="context-label">Rôle</span>
            <strong>{{ userRole }}</strong>
          </div>
        </section>

        <!-- Les pages enfants s'affichent ici -->
        <div class="page-content">
          <RouterView />
        </div>
      </main>

      <!-- Footer officiel avec logo FOPTRAC -->
      <FooterView />
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f4f6f8;
  color: #111827;
}

.sidebar {
  position: fixed;
  z-index: 100;
  inset: 0 auto 0 0;
  width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #111827;
  color: white;
  box-sizing: border-box;
  transition: transform 0.25s ease;
}

.sidebar-header {
  min-height: 76px;
  padding: 0 16px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  font-weight: 800;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.brand-text strong {
  font-size: 14px;
}

.brand-text span {
  color: #9ca3af;
  font-size: 11px;
}

.close-sidebar {
  display: none;
  border: none;
  background: transparent;
  color: white;
  font-size: 28px;
  cursor: pointer;
}

.navigation {
  flex: 1;
  overflow-y: auto;
  padding: 20px 14px;
}

.navigation-section {
  margin-bottom: 26px;
}

.navigation-title {
  display: block;
  margin: 0 10px 8px;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.navigation-item {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #d1d5db;
  text-align: left;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.navigation-item:hover:not(:disabled) {
  background: #1f2937;
  color: white;
}

.navigation-item.active {
  background: #2563eb;
  color: white;
}

.navigation-item.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.navigation-icon {
  width: 24px;
  flex-shrink: 0;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.navigation-item span:nth-child(2) {
  flex: 1;
}

.navigation-item small {
  color: #9ca3af;
  font-size: 10px;
}

.sidebar-footer {
  padding: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.logout-button {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: transparent;
  color: #d1d5db;
  cursor: pointer;
  font: inherit;
}

.logout-button:hover {
  background: #1f2937;
  color: white;
}

.main-area {
  width: calc(100% - 260px);
  min-width: 0;
  min-height: 100vh;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.topbar {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 28px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.topbar-title {
  flex: 1;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.menu-button {
  display: none;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 24px;
  cursor: pointer;
}

.user-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.user-info strong {
  color: #111827;
  font-size: 13px;
}

.user-info span {
  color: #6b7280;
  font-size: 11px;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 28px;
  box-sizing: border-box;
}

.content-user-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 18px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.content-user-context > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.context-label {
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content-user-context strong {
  overflow-wrap: anywhere;
  color: #111827;
  font-size: 13px;
}

.page-content {
  min-width: 0;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 1000px) {
  .content-user-context {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
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
    background: rgba(0, 0, 0, 0.4);
  }

  .main-area {
    width: 100%;
    margin-left: 0;
  }

  .menu-button {
    display: block;
  }

  .topbar {
    padding: 12px 18px;
  }

  .topbar-title {
    display: none;
  }

  .user-info {
    display: none;
  }
}

@media (max-width: 560px) {
  .content-user-context {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 14px;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);

const userFullName = computed(() => {
  const user = authStore.user;

  if (!user) {
    return 'Utilisateur';
  }

  return `${user.prenom} ${user.nom}`.trim();
});

const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');

const userEmail = computed(() => authStore.user?.email ?? '');

const userGare = computed(() => {
  return authStore.user?.gareId ?? 'Non affectée';
});

function closeSidebar() {
  sidebarOpen.value = false;
}

function goToDashboard() {
  closeSidebar();

  router.push({
    name: 'role-hub',
  });
}

function logout() {
  closeSidebar();

  authStore.logout();

  router.push({
    name: 'login',
  });
}
</script>

<template>
  <div class="admin-layout">
    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-logo">
            FC
          </div>

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
          <span class="navigation-title">
            Principal
          </span>

          <button
            type="button"
            class="navigation-item active"
            @click="goToDashboard"
          >
            <span class="navigation-icon">⌂</span>
            <span>Dashboard</span>
          </button>
        </div>

        <div class="navigation-section">
          <span class="navigation-title">
            Gestion
          </span>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">G</span>
            <span>Gares</span>
            <small>À venir</small>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">V</span>
            <span>Véhicules</span>
            <small>À venir</small>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">C</span>
            <span>Chauffeurs</span>
            <small>À venir</small>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">D</span>
            <span>Documents</span>
            <small>À venir</small>
          </button>

          <button
            type="button"
            class="navigation-item disabled"
            disabled
            title="Module prochainement disponible"
          >
            <span class="navigation-icon">F</span>
            <span>Fiches</span>
            <small>À venir</small>
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
          <span class="navigation-title">
            Supervision
          </span>

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

    <!-- Zone principale -->
    <div class="main-area">
      <header class="topbar">
        <button
          type="button"
          class="menu-button"
          aria-label="Ouvrir le menu"
          @click="sidebarOpen = true"
        >
          ☰
        </button>

        <div class="topbar-title">
          <span>Plateforme de gestion</span>
        </div>

        <div class="user-summary">
          <div class="user-avatar">
            {{ userFullName.charAt(0).toUpperCase() }}
          </div>

          <div class="user-info">
            <strong>{{ userFullName }}</strong>
            <span>{{ userRole }}</span>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="content-user-context">
          <div>
            <span class="context-label">Compte</span>
            <strong>{{ userFullName }}</strong>
          </div>

          <div>
            <span class="context-label">Email</span>
            <strong>{{ userEmail }}</strong>
          </div>

          <div>
            <span class="context-label">Gare</span>
            <strong>{{ userGare }}</strong>
          </div>

          <div>
            <span class="context-label">Rôle</span>
            <strong>{{ userRole }}</strong>
          </div>
        </div>

        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #f4f6f8;
}

/* =========================
   SIDEBAR
========================= */

.sidebar {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #111827;
  color: white;
  transform: translateX(0);
  transition: transform 0.25s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 0 20px;
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
  font-size: 14px;
  font-weight: 800;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.navigation-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  margin-bottom: 4px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #d1d5db;
  text-align: left;
  cursor: pointer;
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
}

.logout-button:hover {
  background: #1f2937;
  color: white;
}

/* =========================
   MAIN AREA
========================= */

.main-area {
  width: calc(100% - 260px);
  min-height: 100vh;
  margin-left: 260px;
}

.topbar {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
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
  gap: 2px;
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
  padding: 28px;
}

.content-user-context {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 18px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.content-user-context > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.context-label {
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.content-user-context strong {
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================
   MOBILE
========================= */

.sidebar-overlay {
  display: none;
}

@media (max-width: 1000px) {
  .content-user-context {
    grid-template-columns: repeat(2, 1fr);
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
    padding: 0 18px;
  }

  .topbar-title {
    display: none;
  }

  .user-info {
    display: none;
  }

  .content {
    padding: 20px;
  }
}

@media (max-width: 560px) {
  .content-user-context {
    grid-template-columns: 1fr;
  }
}
</style>


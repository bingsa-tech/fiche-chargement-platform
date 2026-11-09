
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { useAuthStore } from '../../auth/auth.store';
import { getDashboardStats } from '../../api/stats.api';
import type { DashboardStats } from '../../types/stats.types';

const authStore = useAuthStore();

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);
const errorMessage = ref('');

const userFullName = computed(() => {
  const user = authStore.user;

  if (!user) return 'Utilisateur';

  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});

const userInitials = computed(() => {
  const parts = userFullName.value
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';
});

const formattedRole = computed(() => {
  return authStore.role ?? 'Rôle non défini';
});

const fetchStats = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    stats.value = await getDashboardStats();
  } catch (error: unknown) {
    console.error(
      'Erreur de chargement des statistiques de supervision :',
      error,
    );

    errorMessage.value =
      'Impossible de charger les statistiques de supervision. Vérifiez votre connexion et réessayez.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);

const statistics = computed(() => [
  {
    label: 'Fiches consultables',
    description: 'Fiches enregistrées sur la plateforme',
    value: stats.value?.fiches ?? 0,
    icon: 'FC',
    color: 'blue',
  },
  {
    label: 'Gares',
    description: 'Gares enregistrées sur la plateforme',
    value: stats.value?.gares ?? 0,
    icon: 'GA',
    color: 'gold',
  },
  {
    label: 'Utilisateurs',
    description: 'Comptes utilisateurs enregistrés',
    value: stats.value?.utilisateurs ?? 0,
    icon: 'UT',
    color: 'purple',
  },
  {
    label: 'Véhicules',
    description: 'Véhicules enregistrés',
    value: stats.value?.vehicules ?? 0,
    icon: 'VE',
    color: 'green',
  },
  {
    label: 'Chauffeurs',
    description: 'Chauffeurs enregistrés',
    value: stats.value?.chauffeurs ?? 0,
    icon: 'CH',
    color: 'orange',
  },
]);

const supervisionModules = [
  {
    title: 'Consultation des fiches',
    description: 'Consultation et suivi des fiches de chargement.',
    icon: 'FC',
  },
  {
    title: 'Suivi des gares',
    description: 'Vue globale des gares et de leurs activités.',
    icon: 'GA',
  },
  {
    title: 'Consultation des alertes',
    description: 'Suivi des alertes et des événements importants.',
    icon: 'AL',
  },
  {
    title: 'Rapports',
    description: 'Consultation des rapports et indicateurs globaux.',
    icon: 'RP',
  },
];
</script>

<template>
  <main class="dashboard">

    <!-- En-tête de supervision -->
    <section class="welcome-panel">
      <div class="welcome-content">
        <span class="welcome-eyebrow">
          ESPACE DE SUPERVISION
        </span>

        <h1>
          Bienvenue, {{ userFullName }}
        </h1>

        <p>
          Accédez à une vue globale de la plateforme FOPTRAC.
          Consultez les principaux indicateurs et suivez
          les informations disponibles dans votre périmètre
          de supervision.
        </p>

        <div class="welcome-meta">
          <span class="welcome-indicator"></span>
          Supervision globale de la plateforme
        </div>
      </div>

      <div class="welcome-avatar" aria-hidden="true">
        {{ userInitials }}
      </div>
    </section>

    <!-- Informations utilisateur -->
    <section
      class="account-section"
      aria-labelledby="account-title"
    >
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">SESSION UTILISATEUR</span>
          <h2 id="account-title">Informations de votre compte</h2>
        </div>

        <span class="scope-badge">
          <span class="scope-indicator"></span>
          Supervision globale
        </span>
      </div>

      <div class="user-card">
        <article class="user-item">
          <span class="user-icon">UT</span>
          <div>
            <span class="detail-label">Utilisateur</span>
            <strong>{{ userFullName }}</strong>
          </div>
        </article>

        <article class="user-item">
          <span class="user-icon">EM</span>
          <div>
            <span class="detail-label">Adresse courriel</span>
            <strong>
              {{ authStore.user?.email ?? 'Non renseigné' }}
            </strong>
          </div>
        </article>

        <article class="user-item">
          <span class="user-icon">RL</span>
          <div>
            <span class="detail-label">Rôle</span>
            <strong>{{ formattedRole }}</strong>
          </div>
        </article>

        <article class="user-item">
          <span class="user-icon">SP</span>
          <div>
            <span class="detail-label">Périmètre</span>
            <strong>Supervision globale</strong>
          </div>
        </article>
      </div>
    </section>

    <!-- Statistiques globales -->
    <section
      class="statistics-section"
      aria-labelledby="statistics-title"
    >
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">VUE D'ENSEMBLE</span>
          <h2 id="statistics-title">Indicateurs de supervision</h2>
          <p>
            Synthèse des données enregistrées dans la plateforme.
          </p>
        </div>

        <button
          class="refresh-button"
          type="button"
          :disabled="loading"
          @click="fetchStats"
        >
          <span :class="{ spinning: loading }">↻</span>
          Actualiser
        </button>
      </div>

      <!-- Chargement -->
      <div
        v-if="loading"
        class="feedback-card"
        role="status"
      >
        <span class="loading-spinner"></span>
        <span>
          Chargement des statistiques de supervision...
        </span>
      </div>

      <!-- Erreur -->
      <div
        v-else-if="errorMessage"
        class="error-card"
        role="alert"
      >
        <div>
          <strong>Chargement impossible</strong>
          <p>{{ errorMessage }}</p>
        </div>

        <button
          type="button"
          @click="fetchStats"
        >
          Réessayer
        </button>
      </div>

      <!-- Indicateurs -->
      <div
        v-else-if="stats"
        class="statistics-grid"
      >
        <article
          v-for="stat in statistics"
          :key="stat.label"
          class="stat-card"
        >
          <div class="stat-top">
            <div
              class="stat-icon"
              :class="`icon-${stat.color}`"
              aria-hidden="true"
            >
              {{ stat.icon }}
            </div>

            <span class="stat-category">GLOBAL</span>
          </div>

          <div class="stat-value">
            {{ stat.value.toLocaleString('fr-CA') }}
          </div>

          <h3>{{ stat.label }}</h3>

          <p>{{ stat.description }}</p>

          <div class="stat-footer">
            <span class="stat-status-dot"></span>
            Indicateur disponible
          </div>
        </article>
      </div>
    </section>

    <!-- Modules de supervision -->
    <section
      class="modules-section"
      aria-labelledby="modules-title"
    >
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">CONTRÔLE ET SUIVI</span>
          <h2 id="modules-title">Modules de supervision</h2>
          <p>
            Espaces destinés à la consultation et au suivi global.
          </p>
        </div>

        <span class="module-count">
          {{ supervisionModules.length }} modules
        </span>
      </div>

      <div class="modules-grid">
        <article
          v-for="module in supervisionModules"
          :key="module.title"
          class="module-card"
        >
          <div class="module-icon" aria-hidden="true">
            {{ module.icon }}
          </div>

          <div class="module-content">
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>

            <span class="module-status">
              <span class="status-indicator"></span>
              À développer
            </span>
          </div>

          <span class="module-arrow" aria-hidden="true">
            →
          </span>
        </article>
      </div>
    </section>

    <footer class="dashboard-footer">
      <span class="footer-mark">FOPTRAC</span>
      <span>Plateforme de gestion et de supervision</span>
    </footer>

  </main>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  color: #172033;
  box-sizing: border-box;
}

/* Bienvenue */

.welcome-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 180px;
  padding: 30px 36px;
  margin-bottom: 32px;
  overflow: hidden;
  border: 1px solid rgba(197, 161, 59, 0.25);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(197, 161, 59, 0.18),
      transparent 28%
    ),
    linear-gradient(120deg, #101b2d 0%, #17365d 65%, #214b7c 100%);
  color: white;
  box-shadow: 0 12px 28px rgba(16, 27, 45, 0.12);
}

.welcome-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.welcome-eyebrow,
.section-eyebrow {
  display: block;
  margin-bottom: 9px;
  color: #c5a13b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.welcome-panel h1 {
  margin: 0;
  color: white;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 750;
  line-height: 1.3;
  letter-spacing: -0.7px;
  overflow-wrap: anywhere;
}

.welcome-panel p {
  max-width: 650px;
  margin: 12px 0 18px;
  color: #d7e1ef;
  font-size: 13px;
  line-height: 1.75;
}

.welcome-meta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #e6c86e;
  font-size: 11px;
  font-weight: 650;
}

.welcome-indicator,
.stat-status-dot,
.status-indicator,
.scope-indicator {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #36c58a;
}

.welcome-avatar {
  width: 76px;
  height: 76px;
  flex: 0 0 76px;
  display: grid;
  place-items: center;
  border: 3px solid rgba(230, 200, 110, 0.7);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.1);
  color: #e6c86e;
  font-size: 24px;
  font-weight: 800;
}

/* Sections */

.account-section,
.statistics-section,
.modules-section {
  margin-bottom: 34px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.4px;
}

.section-heading p {
  margin: 6px 0 0;
  color: #748197;
  font-size: 12px;
  line-height: 1.6;
}

.section-eyebrow {
  margin-bottom: 6px;
  color: #9a7b29;
  font-size: 9px;
}

/* Périmètre */

.scope-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e6dfc8;
  border-radius: 999px;
  background: #fffcf3;
  color: #8a6c20;
  font-size: 10px;
  font-weight: 750;
  white-space: nowrap;
}

.scope-indicator {
  background: #c5a13b;
}

/* Compte utilisateur */

.user-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #e5eaf1;
  border-radius: 14px;
  background: white;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
}

.user-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.user-item + .user-item {
  border-left: 1px solid #edf0f5;
}

.user-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f0f4fa;
  color: #17365d;
  font-size: 10px;
  font-weight: 850;
}

.user-item > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  color: #8994a5;
  font-size: 10px;
  font-weight: 650;
}

.user-item strong {
  color: #263349;
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

/* Actualisation */

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #dce3ec;
  border-radius: 9px;
  background: white;
  color: #34445d;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  border-color: #c5a13b;
  color: #17365d;
  background: #fffcf3;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.refresh-button span {
  font-size: 18px;
  line-height: 1;
}

.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Chargement et erreur */

.feedback-card,
.error-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 20px;
  border: 1px solid #e5eaf1;
  border-radius: 12px;
  background: white;
  color: #64748b;
  font-size: 12px;
}

.loading-spinner {
  width: 19px;
  height: 19px;
  flex: 0 0 19px;
  border: 2px solid #e2e8f0;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-card {
  justify-content: space-between;
  border-color: #fecaca;
  background: #fff7f7;
}

.error-card strong {
  color: #991b1b;
  font-size: 13px;
}

.error-card p {
  margin: 5px 0 0;
  color: #7f1d1d;
  line-height: 1.6;
}

.error-card button {
  flex-shrink: 0;
  padding: 9px 13px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: white;
  color: #991b1b;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

/* Statistiques */

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #e5eaf1;
  border-radius: 14px;
  background: white;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: #d4c18a;
  box-shadow: 0 9px 22px rgba(15, 23, 42, 0.07);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 17px;
}

.stat-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 850;
}

.icon-blue {
  background: #eaf1fb;
  color: #214b7c;
}

.icon-gold {
  background: #fbf4df;
  color: #98761f;
}

.icon-purple {
  background: #f1eafa;
  color: #7442a8;
}

.icon-green {
  background: #e8f6ef;
  color: #16834a;
}

.icon-orange {
  background: #fff2e5;
  color: #bd681b;
}

.stat-category {
  color: #9aa5b5;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.stat-value {
  margin-bottom: 5px;
  color: #172033;
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.stat-card h3 {
  margin: 0 0 6px;
  color: #263349;
  font-size: 13px;
  font-weight: 750;
}

.stat-card p {
  min-height: 34px;
  margin: 0 0 15px;
  color: #7a8699;
  font-size: 11px;
  line-height: 1.6;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-top: 11px;
  border-top: 1px solid #edf0f5;
  color: #8490a2;
  font-size: 10px;
  font-weight: 600;
}

/* Modules */

.module-count {
  padding: 7px 11px;
  border: 1px solid #e5eaf1;
  border-radius: 999px;
  background: white;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.module-card {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 19px;
  border: 1px solid #e5eaf1;
  border-radius: 13px;
  background: white;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  border-color: #d4c18a;
  box-shadow: 0 9px 22px rgba(15, 23, 42, 0.06);
}

.module-icon {
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  display: grid;
  place-items: center;
  border: 1px solid #e6eaf0;
  border-radius: 11px;
  background: #f2f5fa;
  color: #17365d;
  font-size: 11px;
  font-weight: 850;
}

.module-content {
  min-width: 0;
  flex: 1;
}

.module-content h3 {
  margin: 1px 0 7px;
  color: #263349;
  font-size: 13px;
  font-weight: 750;
  line-height: 1.45;
}

.module-content p {
  margin: 0 0 12px;
  color: #7a8699;
  font-size: 11px;
  line-height: 1.6;
}

.module-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #9a7b29;
  font-size: 10px;
  font-weight: 750;
}

.status-indicator {
  background: #c5a13b;
}

.module-arrow {
  align-self: center;
  color: #b49a52;
  font-size: 20px;
}

/* Pied de page */

.dashboard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 17px 2px 5px;
  border-top: 1px solid #e5eaf1;
  color: #8b96a7;
  font-size: 10px;
}

.footer-mark {
  color: #17365d;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.12em;
}

/* Responsive */

@media (max-width: 1100px) {
  .user-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .user-item:nth-child(3) {
    border-left: none;
  }

  .user-item:nth-child(n + 3) {
    border-top: 1px solid #edf0f5;
  }
}

@media (max-width: 900px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .welcome-panel {
    min-height: auto;
    padding: 23px;
  }

  .welcome-avatar {
    width: 58px;
    height: 58px;
    flex-basis: 58px;
    border-radius: 17px;
    font-size: 19px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .user-card {
    grid-template-columns: 1fr;
  }

  .user-item + .user-item,
  .user-item:nth-child(3) {
    border-top: 1px solid #edf0f5;
    border-left: none;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .scope-badge {
    font-size: 9px;
  }

  .dashboard-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 430px) {
  .welcome-avatar {
    display: none;
  }

  .section-heading h2 {
    font-size: 16px;
  }

  .refresh-button {
    padding: 8px 9px;
    font-size: 10px;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 17px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

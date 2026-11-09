
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { getDashboardStats } from '../../api/stats.api';

interface DashboardModule {
  title: string;
  description: string;
  icon: string;
  route: RouteLocationRaw | null;
}

const totalUtilisateurs = ref(0);
const totalGares = ref(0);
const totalVehicules = ref(0);
const totalChauffeurs = ref(0);
const totalFiches = ref(0);

const isLoading = ref(true);
const loadError = ref('');

const fetchDashboardStats = async () => {
  try {
    isLoading.value = true;
    loadError.value = '';

    const stats = await getDashboardStats();

    totalUtilisateurs.value = stats.utilisateurs ?? 0;
    totalGares.value = stats.gares ?? 0;
    totalVehicules.value = stats.vehicules ?? 0;
    totalChauffeurs.value = stats.chauffeurs ?? 0;
    totalFiches.value = stats.fiches ?? 0;
  } catch (error) {
    console.error(
      'Erreur lors du chargement des statistiques du dashboard',
      error,
    );
    loadError.value =
      'Impossible de récupérer les statistiques. Vérifiez votre connexion et réessayez.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardStats);

const statistics = computed(() => [
  {
    label: 'Utilisateurs',
    description: 'Comptes enregistrés sur la plateforme',
    value: totalUtilisateurs.value,
    icon: 'UT',
    color: 'blue',
  },
  {
    label: 'Gares',
    description: 'Points de gestion et d’exploitation',
    value: totalGares.value,
    icon: 'GA',
    color: 'green',
  },
  {
    label: 'Véhicules',
    description: 'Véhicules du parc automobile',
    value: totalVehicules.value,
    icon: 'VE',
    color: 'orange',
  },
  {
    label: 'Chauffeurs',
    description: 'Personnel de conduite enregistré',
    value: totalChauffeurs.value,
    icon: 'CH',
    color: 'purple',
  },
  {
    label: 'Fiches',
    description: 'Fiches de chargement enregistrées',
    value: totalFiches.value,
    icon: 'FC',
    color: 'gold',
  },
]);

const modules: DashboardModule[] = [
  {
    title: 'Gestion des utilisateurs',
    description: 'Comptes, rôles et accès à la plateforme.',
    icon: 'UT',
    route: { name: 'utilisateurs' },
  },
  {
    title: 'Gestion des gares',
    description: 'Organisation et administration des gares.',
    icon: 'GA',
    route: { name: 'gares' },
  },
  {
    title: 'Supervision du système',
    description: 'Suivi du fonctionnement de la plateforme.',
    icon: 'SS',
    route: { name: 'admin-supervision' },
  },
  {
    title: 'Journal d’audit',
    description: 'Consultation des opérations et événements.',
    icon: 'AU',
    route: { name: 'audit' },
  },
  {
    title: 'Gestion des véhicules',
    description: 'Administration du parc automobile.',
    icon: 'VE',
    route: { name: 'vehicules' },
  },
  {
    title: 'Gestion des chauffeurs',
    description: 'Administration du personnel de conduite.',
    icon: 'CH',
    route: { name: 'chauffeurs' },
  },
  {
    title: 'Fiches de chargement',
    description: 'Consultation et administration des fiches.',
    icon: 'FC',
    route: { name: 'fiches' },
  },
  {
    title: 'Propriétaires de véhicules',
    description: 'Gestion des propriétaires et de leurs véhicules.',
    icon: 'PR',
    route: { name: 'proprietaires' },
  },
  {
    title: 'Documents chauffeurs',
    description: 'Gestion des documents du personnel de conduite.',
    icon: 'DC',
    route: { name: 'documents-chauffeurs' },
  },
  {
    title: 'Documents véhicules',
    description: 'Gestion des documents du parc automobile.',
    icon: 'DV',
    route: { name: 'documents-vehicules' },
  },
  {
    title: 'Gestion des passagers',
    description: 'Création et consultation des passagers.',
    icon: 'PA',
    route: { name: 'passagers' },
  },
  {
    title: 'Présence en ligne',
    description: 'Suivi des utilisateurs connectés.',
    icon: 'PL',
    route: { name: 'presence-online' },
  },
  {
    title: 'Nos itinéraires',
    description: 'Suivi des itinéraires et de leur évolution.',
    icon: 'IT',
    route: { name: 'itineraires' },
  },
   {
    title: 'Nos destinations',
    description: 'Gestion des destinations et de leur évolution.',
    icon: 'DS',
    route: { name: 'destinations' },
  },
];
</script>

<template>
  <main class="dashboard">
    <!-- En-tête de bienvenue -->
    <section class="welcome-panel">
      <div class="welcome-content">
        <span class="welcome-eyebrow">
          ESPACE D’ADMINISTRATION
        </span>

        <h1>Tableau de bord administrateur</h1>

        <p>
          Bienvenue dans votre espace de gestion FOPTRAC.
          Retrouvez ici les principaux indicateurs de la plateforme
          et accédez rapidement aux différents modules
          d’administration et de supervision.
        </p>

        <div class="welcome-meta">
          <span class="welcome-indicator"></span>
          Vue globale de la plateforme
        </div>
      </div>

      <div class="welcome-emblem" aria-hidden="true">
        <span>F</span>
      </div>
    </section>

    <!-- Statistiques -->
    <section
      class="statistics-section"
      aria-labelledby="statistics-title"
    >
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">APERÇU DE L’ACTIVITÉ</span>
          <h2 id="statistics-title">Indicateurs statistiques</h2>
          <p>Vue synthétique des données enregistrées.</p>
        </div>

        <button
          class="refresh-button"
          type="button"
          :disabled="isLoading"
          @click="fetchDashboardStats"
        >
          <span :class="{ spinning: isLoading }">↻</span>
          Actualiser
        </button>
      </div>

      <div v-if="loadError" class="dashboard-error" role="alert">
        <div>
          <strong>Chargement impossible</strong>
          <p>{{ loadError }}</p>
        </div>

        <button type="button" @click="fetchDashboardStats">
          Réessayer
        </button>
      </div>

      <div class="statistics-grid">
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

            <span class="stat-category">TOTAL</span>
          </div>

          <div class="stat-value">
            {{ isLoading ? '—' : stat.value.toLocaleString('fr-CA') }}
          </div>

          <h3>{{ stat.label }}</h3>
          <p>{{ stat.description }}</p>

          <div class="stat-footer">
            <span class="stat-status-dot"></span>
            {{ isLoading ? 'Chargement des données' : 'Données disponibles' }}
          </div>
        </article>
      </div>
    </section>

    <!-- Modules d'administration -->
    <section
      class="modules-section"
      aria-labelledby="modules-title"
    >
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">GESTION DE LA PLATEFORME</span>
          <h2 id="modules-title">Administration et supervision</h2>
          <p>
            Accédez directement aux différents espaces de gestion.
          </p>
        </div>

        <span class="module-count">
          {{ modules.length }} modules
        </span>
      </div>

      <div class="modules-grid">
        <template v-for="module in modules" :key="module.title">
          <RouterLink
            v-if="module.route"
            :to="module.route"
            class="module-card"
          >
            <div class="module-icon" aria-hidden="true">
              {{ module.icon }}
            </div>

            <div class="module-content">
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
              <span class="module-action">Accéder au module</span>
            </div>

            <span class="module-arrow" aria-hidden="true">→</span>
          </RouterLink>

          <div
            v-else
            class="module-card module-disabled"
            aria-disabled="true"
          >
            <div class="module-icon" aria-hidden="true">
              {{ module.icon }}
            </div>

            <div class="module-content">
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
              <span class="module-action">Indisponible</span>
            </div>
          </div>
        </template>
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
  gap: 28px;
  min-height: 190px;
  overflow: hidden;
  padding: 30px 36px;
  margin-bottom: 34px;
  border: 1px solid rgba(197, 161, 59, 0.25);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 88% 15%,
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
  margin-bottom: 10px;
  color: #c5a13b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.welcome-panel h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.7px;
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
.stat-status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #36c58a;
}

.welcome-emblem {
  width: 100px;
  height: 100px;
  flex: 0 0 100px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(230, 200, 110, 0.55);
  border-radius: 27px;
  background: rgba(255, 255, 255, 0.08);
  color: #e6c86e;
  font-size: 54px;
  font-weight: 800;
  transform: rotate(4deg);
}

/* Sections */

.statistics-section,
.modules-section {
  margin-bottom: 36px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 19px;
}

.section-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 20px;
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

/* Actualisation */

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #dce3ec;
  border-radius: 9px;
  background: #fff;
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
  to { transform: rotate(360deg); }
}

/* Erreur */

.dashboard-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 18px;
  margin-bottom: 18px;
  border: 1px solid #fecaca;
  border-radius: 11px;
  background: #fff7f7;
}

.dashboard-error strong {
  color: #991b1b;
  font-size: 13px;
}

.dashboard-error p {
  margin: 4px 0 0;
  color: #7f1d1d;
  font-size: 12px;
}

.dashboard-error button {
  padding: 8px 12px;
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-width: 0;
  padding: 19px;
  border: 1px solid #e5eaf1;
  border-radius: 14px;
  background: #fff;
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
  margin-bottom: 18px;
}

.stat-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.02em;
}

.icon-blue {
  background: #eaf1fb;
  color: #214b7c;
}

.icon-green {
  background: #e8f6ef;
  color: #16834a;
}

.icon-orange {
  background: #fff2e5;
  color: #bd681b;
}

.icon-purple {
  background: #f1eafa;
  color: #7442a8;
}

.icon-gold {
  background: #fbf4df;
  color: #98761f;
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
  background: #fff;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  background: #fff;
  color: #172033;
  text-decoration: none;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.module-card:not(.module-disabled):hover {
  transform: translateY(-3px);
  border-color: #c5a13b;
  box-shadow: 0 9px 22px rgba(15, 23, 42, 0.07);
}

.module-card:focus-visible,
.refresh-button:focus-visible,
.dashboard-error button:focus-visible {
  outline: 3px solid rgba(197, 161, 59, 0.45);
  outline-offset: 3px;
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
  min-height: 34px;
  margin: 0 0 12px;
  color: #7a8699;
  font-size: 11px;
  line-height: 1.6;
}

.module-action {
  color: #9a7b29;
  font-size: 10px;
  font-weight: 750;
}

.module-arrow {
  align-self: center;
  color: #b49a52;
  font-size: 21px;
  transition: transform 0.2s ease;
}

.module-card:hover .module-arrow {
  transform: translateX(4px);
}

.module-disabled {
  opacity: 0.55;
  cursor: not-allowed;
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

@media (max-width: 1150px) {
  .statistics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .modules-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .welcome-panel {
    min-height: auto;
    padding: 24px;
  }

  .welcome-emblem {
    width: 65px;
    height: 65px;
    flex-basis: 65px;
    border-radius: 19px;
    font-size: 36px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 11px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-value {
    font-size: 25px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 11px;
  }
}

@media (max-width: 430px) {
  .welcome-panel {
    padding: 21px;
  }

  .welcome-emblem {
    display: none;
  }

  .section-heading h2 {
    font-size: 17px;
  }

  .refresh-button {
    padding: 8px 9px;
    font-size: 10px;
  }

  .dashboard-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

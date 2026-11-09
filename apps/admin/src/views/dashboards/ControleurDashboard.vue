
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useAuthStore } from '../../auth/auth.store';
import { getDashboardStats } from '../../api/stats.api';
import type { DashboardStats } from '../../types/stats.types';

const authStore = useAuthStore();

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);
const errorMessage = ref('');

const userFullName = computed(() => {
  const user = authStore.user;

  if (!user) return 'Contrôleur';

  const fullName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim();

  return fullName || user.username || 'Contrôleur';
});

const userInitials = computed(() => {
  const names = userFullName.value.split(' ').filter(Boolean);

  return names
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join('');
});

const formattedRole = computed(() => {
  return authStore.role?.replaceAll('_', ' ') ?? 'CONTRÔLEUR';
});

const formattedGare = computed(() => {
  return authStore.user?.gareId ?? 'Non affectée';
});

const statistics = computed(() => [
  {
    label: 'Fiches de la gare',
    value: stats.value?.fiches ?? 0,
    description: 'Fiches enregistrées dans votre gare',
    icon: 'document',
    color: 'blue',
  },
  {
    label: 'Véhicules',
    value: stats.value?.vehicules ?? 0,
    description: 'Véhicules référencés dans les fiches',
    icon: 'vehicle',
    color: 'gold',
  },
  {
    label: 'Chauffeurs',
    value: stats.value?.chauffeurs ?? 0,
    description: 'Chauffeurs référencés dans les fiches',
    icon: 'users',
    color: 'purple',
  },
  {
    label: 'Utilisateurs',
    value: stats.value?.utilisateurs ?? 0,
    description: 'Utilisateurs affectés à votre gare',
    icon: 'user',
    color: 'green',
  },
]);

const controlModules = [
  {
    number: '01',
    title: 'Contrôle des fiches',
    description:
      'Consulter et vérifier les fiches de chargement enregistrées dans votre gare.',
    status: 'À venir',
    icon: 'document',
  },
  {
    number: '02',
    title: 'Vérification documentaire',
    description:
      'Examiner les documents associés aux véhicules et aux chauffeurs.',
    status: 'À venir',
    icon: 'folder',
  },
  {
    number: '03',
    title: 'Suivi des alertes',
    description:
      'Consulter les alertes relatives aux documents et aux opérations.',
    status: 'À venir',
    icon: 'alert',
  },
  {
    number: '04',
    title: 'Gestion des anomalies',
    description:
      'Identifier les irrégularités et assurer leur suivi.',
    status: 'À venir',
    icon: 'shield',
  },
];

async function fetchStats() {
  loading.value = true;
  errorMessage.value = '';

  try {
    stats.value = await getDashboardStats();
  } catch (error: unknown) {
    console.error(
      'Erreur de chargement des statistiques du contrôleur :',
      error,
    );

    errorMessage.value =
      'Impossible de charger les statistiques de votre gare.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void fetchStats();
});
</script>

<template>
  <main class="dashboard">
    <div class="dashboard-container">

      <!-- En-tête -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="eyebrow">
            <span class="eyebrow-line"></span>
            ESPACE DE CONTRÔLE
          </div>

          <h1>Tableau de bord</h1>

          <p class="header-description">
            Bienvenue,
            <strong>{{ userFullName }}</strong>.
            Retrouvez ici les informations et les outils de contrôle
            de votre gare.
          </p>
        </div>

        <button
          class="refresh-button"
          type="button"
          :disabled="loading"
          @click="fetchStats"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="{ spinning: loading }"
          >
            <path d="M20 7v5h-5" />
            <path d="M4 17v-5h5" />
            <path d="M5.64 9A8 8 0 0 1 19 7l1 5" />
            <path d="M4 12l1 5a8 8 0 0 0 13.36-1" />
          </svg>

          Actualiser
        </button>
      </header>

      <!-- Bannière de bienvenue -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <span class="welcome-label">FOPTRAC · CONTRÔLE OPÉRATIONNEL</span>
            <h2>Votre espace de supervision</h2>
            <p>
              Contrôle, vérification et suivi des opérations de votre gare.
            </p>
          </div>
        </div>

        <div class="welcome-decoration">
          <span>CONTRÔLE</span>
          <strong>FOPTRAC</strong>
        </div>
      </section>

      <!-- Profil utilisateur -->
      <section class="section-block">
        <div class="section-heading">
          <div>
            <span class="section-kicker">SESSION ACTIVE</span>
            <h2>Informations du contrôleur</h2>
          </div>
        </div>

        <div class="profile-card">
          <div class="profile-identity">
            <div class="avatar">
              {{ userInitials }}
            </div>

            <div class="profile-name">
              <strong>{{ userFullName }}</strong>
              <span>Compte utilisateur actif</span>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="profile-detail">
            <span class="detail-label">Adresse courriel</span>
            <strong>{{ authStore.user?.email ?? 'Non renseignée' }}</strong>
          </div>

          <div class="profile-detail">
            <span class="detail-label">Rôle</span>
            <strong>{{ formattedRole }}</strong>
          </div>

          <div class="profile-detail">
            <span class="detail-label">Identifiant de gare</span>
            <strong>{{ formattedGare }}</strong>
          </div>
        </div>
      </section>

      <!-- Statistiques -->
      <section class="section-block">
        <div class="section-heading">
          <div>
            <span class="section-kicker">DONNÉES OPÉRATIONNELLES</span>
            <h2>Statistiques de votre gare</h2>
            <p class="section-description">
              Vue d'ensemble des ressources et des fiches enregistrées.
            </p>
          </div>
        </div>

        <div
          v-if="loading"
          class="feedback-card"
          role="status"
        >
          <span class="loader"></span>
          <p>Chargement des statistiques...</p>
        </div>

        <div
          v-else-if="errorMessage"
          class="feedback-card error-card"
          role="alert"
        >
          <div class="feedback-icon">!</div>

          <div>
            <strong>Chargement impossible</strong>
            <p>{{ errorMessage }}</p>

            <button
              type="button"
              class="retry-button"
              @click="fetchStats"
            >
              Réessayer
            </button>
          </div>
        </div>

        <div
          v-else-if="stats"
          class="stats-grid"
        >
          <article
            v-for="stat in statistics"
            :key="stat.label"
            class="stat-card"
          >
            <div class="stat-top">
              <span class="stat-label">{{ stat.label }}</span>

              <div
                class="stat-icon"
                :class="`stat-icon--${stat.color}`"
              >
                <svg
                  v-if="stat.icon === 'document'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6M8 13h8M8 17h8" />
                </svg>

                <svg
                  v-else-if="stat.icon === 'vehicle'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M5 17h14l1-6H4l1 6Z" />
                  <path d="m7 11 2-5h6l2 5M7 17v2m10-2v2" />
                  <circle cx="7.5" cy="17" r="1.5" />
                  <circle cx="16.5" cy="17" r="1.5" />
                </svg>

                <svg
                  v-else-if="stat.icon === 'users'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <strong class="stat-value">
              {{ stat.value }}
            </strong>

            <p class="stat-description">
              {{ stat.description }}
            </p>
          </article>
        </div>
      </section>

      <!-- Modules de contrôle -->
      <section class="section-block modules-section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">OUTILS MÉTIER</span>
            <h2>Modules de contrôle</h2>
            <p class="section-description">
              Les fonctionnalités prévues pour les activités du contrôleur.
            </p>
          </div>

          <span class="module-count">
            {{ controlModules.length }} modules
          </span>
        </div>

        <div class="modules-grid">
          <article
            v-for="module in controlModules"
            :key="module.number"
            class="module-card"
          >
            <div class="module-card-top">
              <span class="module-number">{{ module.number }}</span>

              <span class="module-status">
                {{ module.status }}
              </span>
            </div>

            <div class="module-icon">
              <svg
                v-if="module.icon === 'document'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6M8 13h8M8 17h5" />
              </svg>

              <svg
                v-else-if="module.icon === 'folder'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>

              <svg
                v-else-if="module.icon === 'alert'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4m0 4h.01" />
              </svg>

              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h3>{{ module.title }}</h3>

            <p>{{ module.description }}</p>

            <div class="module-card-footer">
              <span>Fonctionnalité planifiée</span>
              <span class="module-arrow">→</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Pied de page -->
      <footer class="dashboard-footer">
        <span>FOPTRAC</span>
        <span>Espace réservé au contrôle opérationnel</span>
      </footer>

    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100%;
  padding: 32px;
  background: var(--color-background, #f4f7fb);
}

.dashboard-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* En-tête */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  color: var(--color-brand-accent, #c5a13b);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.eyebrow-line {
  width: 24px;
  height: 2px;
  background: var(--color-brand-accent, #c5a13b);
}

.dashboard-header h1 {
  margin: 0;
  color: var(--color-brand-dark, #101b2d);
  font-size: clamp(27px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.8px;
}

.header-description {
  margin: 10px 0 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 14px;
  line-height: 1.7;
}

.header-description strong {
  color: var(--color-brand-primary, #17365d);
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 17px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  background: white;
  color: var(--color-brand-primary, #17365d);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  border-color: var(--color-brand-accent, #c5a13b);
  background: #fffcf4;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Bannière */

.welcome-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 174px;
  padding: 30px 36px;
  margin-bottom: 34px;
  overflow: hidden;
  border-radius: 14px;
  background: linear-gradient(112deg, #101b2d 0%, #17365d 65%, #214b7c 100%);
  color: white;
}

.welcome-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 22px;
}

.welcome-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 60px;
  width: 60px;
  height: 60px;
  border: 1px solid rgb(230 200 110 / 45%);
  border-radius: 14px;
  background: rgb(197 161 59 / 15%);
  color: #e6c86e;
}

.welcome-label {
  color: #e6c86e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.welcome-content h2 {
  margin: 8px 0 6px;
  color: white;
  font-size: 24px;
  font-weight: 800;
}

.welcome-content p {
  margin: 0;
  color: #d2dbea;
  font-size: 13px;
}

.welcome-decoration {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  color: rgb(255 255 255 / 35%);
}

.welcome-decoration span {
  font-size: 10px;
  letter-spacing: 0.2em;
}

.welcome-decoration strong {
  color: rgb(255 255 255 / 75%);
  font-size: 28px;
  letter-spacing: 0.12em;
}

/* Sections */

.section-block {
  margin-bottom: 34px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 17px;
}

.section-kicker {
  color: var(--color-brand-accent, #c5a13b);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.section-heading h2 {
  margin: 6px 0 0;
  color: var(--color-brand-dark, #101b2d);
  font-size: 19px;
  font-weight: 800;
}

.section-description {
  margin: 6px 0 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 13px;
  line-height: 1.6;
}

/* Profil */

.profile-card {
  display: grid;
  grid-template-columns: 1.3fr 1px repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 24px;
  padding: 24px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  background: white;
  box-shadow: var(--shadow-card, 0 4px 16px rgb(15 23 42 / 5%));
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border: 1px solid #e9d9a9;
  border-radius: 50%;
  background: #fbf6e8;
  color: var(--color-brand-primary, #17365d);
  font-size: 15px;
  font-weight: 800;
}

.profile-name {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.profile-name strong {
  overflow-wrap: anywhere;
  color: var(--color-brand-dark, #101b2d);
  font-size: 14px;
}

.profile-name span {
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
}

.profile-divider {
  width: 1px;
  height: 42px;
  background: var(--color-border, #e2e8f0);
}

.profile-detail {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.detail-label {
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
}

.profile-detail strong {
  overflow-wrap: anywhere;
  color: var(--color-brand-dark, #101b2d);
  font-size: 12px;
}

/* Statistiques */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  background: white;
  box-shadow: var(--shadow-card, 0 4px 16px rgb(15 23 42 / 5%));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgb(15 23 42 / 8%);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.stat-label {
  color: var(--color-text-secondary, #64748b);
  font-size: 12px;
  font-weight: 600;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 10px;
}

.stat-icon svg {
  width: 21px;
  height: 21px;
}

.stat-icon--blue {
  background: #edf3fc;
  color: #315b91;
}

.stat-icon--gold {
  background: #fbf6e8;
  color: #a8862d;
}

.stat-icon--purple {
  background: #f3effc;
  color: #7656a8;
}

.stat-icon--green {
  background: #edf7f1;
  color: #37835b;
}

.stat-value {
  display: block;
  margin: 15px 0 6px;
  color: var(--color-brand-dark, #101b2d);
  font-size: 31px;
  font-weight: 800;
  line-height: 1.1;
}

.stat-description {
  margin: 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
  line-height: 1.6;
}

/* Chargement et erreurs */

.feedback-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 110px;
  padding: 24px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  background: white;
}

.feedback-card p {
  margin: 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 13px;
}

.loader {
  width: 22px;
  height: 22px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--color-brand-primary, #17365d);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-card {
  align-items: flex-start;
  border-color: #f3d5d5;
  background: #fffafa;
}

.error-card strong {
  display: block;
  margin-bottom: 6px;
  color: #991b1b;
  font-size: 14px;
}

.feedback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 50%;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 800;
}

.retry-button {
  padding: 0;
  margin-top: 12px;
  border: none;
  background: transparent;
  color: var(--color-brand-primary, #17365d);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.retry-button:hover {
  text-decoration: underline;
}

/* Modules */

.module-count {
  padding: 7px 12px;
  border: 1px solid #e9d9a9;
  border-radius: 20px;
  background: #fbf6e8;
  color: #927323;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.module-card {
  min-width: 0;
  padding: 23px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  background: white;
  box-shadow: var(--shadow-card, 0 4px 16px rgb(15 23 42 / 5%));
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  border-color: #d7c184;
}

.module-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.module-number {
  color: #a7b1c0;
  font-size: 12px;
  font-weight: 800;
}

.module-status {
  padding: 5px 9px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-top: 17px;
  border-radius: 10px;
  background: #edf3fc;
  color: var(--color-brand-primary, #17365d);
}

.module-icon svg {
  width: 22px;
  height: 22px;
}

.module-card h3 {
  margin: 15px 0 7px;
  color: var(--color-brand-dark, #101b2d);
  font-size: 15px;
  font-weight: 800;
}

.module-card > p {
  min-height: 40px;
  margin: 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 12px;
  line-height: 1.7;
}

.module-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 15px;
  margin-top: 16px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
}

.module-arrow {
  color: var(--color-brand-accent, #c5a13b);
  font-size: 20px;
}

/* Pied de page */

.dashboard-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0 5px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
}

.dashboard-footer span:first-child {
  color: var(--color-brand-primary, #17365d);
  font-weight: 900;
  letter-spacing: 0.12em;
}

/* Responsive */

@media (max-width: 1100px) {
  .profile-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-divider {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dashboard {
    padding: 20px 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .refresh-button {
    align-self: flex-start;
  }

  .welcome-banner {
    min-height: auto;
    padding: 25px 20px;
  }

  .welcome-content {
    gap: 14px;
  }

  .welcome-icon {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }

  .welcome-content h2 {
    font-size: 19px;
  }

  .welcome-content p {
    font-size: 11px;
    line-height: 1.6;
  }

  .welcome-decoration {
    display: none;
  }

  .profile-card {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .stats-grid,
  .modules-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
  }

  .dashboard-footer {
    flex-direction: column;
    gap: 7px;
  }
}
</style>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/auth.store';
import { getDashboardStats } from '../../api/stats.api';
import type { DashboardStats } from '../../types/stats.types';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const gareId = computed(() => authStore.gareId);

const stats = ref<DashboardStats | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const logoutLoading = ref(false);

const userFullName = computed(() => {
  const prenom = user.value?.prenom?.trim() ?? '';
  const nom = user.value?.nom?.trim() ?? '';

  return `${prenom} ${nom}`.trim() ||
    user.value?.username ||
    'Responsable de gare';
});

const initials = computed(() => {
  const prenom = user.value?.prenom?.trim() ?? '';
  const nom = user.value?.nom?.trim() ?? '';

  if (prenom || nom) {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }

  return (user.value?.username?.substring(0, 2) ?? 'RG').toUpperCase();
});

const statistics = computed(() => [
  {
    label: 'Fiches de chargement',
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
]);

const quickActions = [
  {
    id: 'fiches',
    number: '01',
    title: 'Fiches de chargement',
    description: 'Consulter et gérer les fiches de votre gare.',
    icon: 'document',
  },
  {
    id: 'vehicules',
    number: '02',
    title: 'Véhicules',
    description: 'Gérer les véhicules affectés à votre gare.',
    icon: 'vehicle',
  },
  {
    id: 'chauffeurs',
    number: '03',
    title: 'Chauffeurs',
    description: 'Consulter et gérer les chauffeurs.',
    icon: 'users',
  },
  {
    id: 'documents',
    number: '04',
    title: 'Documents',
    description: 'Suivre les documents et leurs échéances.',
    icon: 'folder',
  },
  {
    id: 'alertes',
    number: '05',
    title: 'Alertes',
    description: 'Surveiller les alertes de votre gare.',
    icon: 'alert',
  },
  {
    id: 'passagers',
    number: '06',
    title: 'Passagers',
    description: 'Consulter les informations des passagers.',
    icon: 'passengers',
  },
];

async function refreshDashboard() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await getDashboardStats();

    if (result.isGlobal === true) {
      stats.value = null;
      errorMessage.value =
        'Le périmètre reçu est global. Vérifiez le rôle et les autorisations de ce compte.';
      return;
    }

    stats.value = result;
  } catch (error: unknown) {
    console.error(
      'Erreur lors du chargement du dashboard Responsable Gare :',
      error,
    );

    errorMessage.value =
      'Impossible de charger les statistiques de votre gare. Vérifiez votre connexion et vos autorisations.';
  } finally {
    loading.value = false;
  }
}

function openModule(module: string) {
  // Les routes des modules seront connectées progressivement.
  console.info(`Module demandé : ${module}`);
}

async function handleLogout() {
  if (logoutLoading.value) return;

  logoutLoading.value = true;

  try {
    await authStore.logout();
    await router.push({ name: 'login' });
  } catch (error: unknown) {
    console.error('Erreur lors de la déconnexion :', error);

    errorMessage.value =
      'La déconnexion a échoué. Réessayez.';
  } finally {
    logoutLoading.value = false;
  }
}

onMounted(() => {
  void refreshDashboard();
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
            ESPACE RESPONSABLE DE GARE
          </div>

          <h1>Tableau de bord</h1>

          <p class="subtitle">
            Bienvenue,
            <strong>{{ userFullName }}</strong>.
            Gérez et supervisez les activités opérationnelles de votre gare.
          </p>
        </div>

        <div class="header-actions">
          <button
            class="btn btn-secondary"
            type="button"
            :disabled="loading"
            @click="refreshDashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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

            {{ loading ? 'Actualisation...' : 'Actualiser' }}
          </button>

          <button
            class="btn btn-logout"
            type="button"
            :disabled="logoutLoading"
            @click="handleLogout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>

            {{ logoutLoading ? 'Déconnexion...' : 'Déconnexion' }}
          </button>
        </div>
      </header>

      <!-- Bannière -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
              <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
              <path d="M16 13v.01M16 16v.01M16 19v.01" />
            </svg>
          </div>

          <div>
            <span class="welcome-label">
              FOPTRAC · GESTION OPÉRATIONNELLE
            </span>

            <h2>Supervision de votre gare</h2>

            <p>
              Pilotez les ressources, les opérations et le suivi
              de votre établissement.
            </p>
          </div>
        </div>

        <div class="banner-decoration">
          <span>RESPONSABILITÉ</span>
          <strong>FOPTRAC</strong>
        </div>
      </section>

      <!-- Profil utilisateur -->
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">SESSION ACTIVE</span>
            <h2>Informations du responsable</h2>
          </div>
        </div>

        <div class="user-card">
          <div class="user-identity">
            <div class="user-avatar">
              {{ initials }}
            </div>

            <div class="user-info">
              <strong>{{ userFullName }}</strong>
              <span>Responsable de gare</span>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="user-detail">
            <span class="detail-label">Identifiant utilisateur</span>
            <strong>{{ user?.username || '—' }}</strong>
          </div>

          <div class="user-detail">
            <span class="detail-label">Adresse courriel</span>
            <strong>{{ user?.email || 'Non renseignée' }}</strong>
          </div>

          <div class="user-detail">
            <span class="detail-label">Gare affectée</span>
            <strong>{{ gareId || 'Non définie' }}</strong>
          </div>
        </div>
      </section>

      <!-- Statistiques -->
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">INDICATEURS OPÉRATIONNELS</span>
            <h2>Vue d'ensemble de votre gare</h2>
            <p class="section-description">
              Synthèse des principales ressources enregistrées.
            </p>
          </div>
        </div>

        <div
          v-if="loading && !stats"
          class="feedback-card"
          role="status"
        >
          <span class="loader"></span>
          <p>Chargement des statistiques de votre gare...</p>
        </div>

        <div
          v-else-if="errorMessage"
          class="feedback-card error-card"
          role="alert"
        >
          <div class="feedback-icon">!</div>

          <div>
            <strong>Impossible de charger les données</strong>
            <p>{{ errorMessage }}</p>

            <button
              class="retry-button"
              type="button"
              @click="refreshDashboard"
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
                  v-else
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
              </div>
            </div>

            <strong class="stat-value">
              {{ stat.value }}
            </strong>

            <p class="stat-description">
              {{ stat.description }}
            </p>
          </article>

          <!-- Alerte non encore connectée à l'API -->
          <article class="stat-card">
            <div class="stat-top">
              <span class="stat-label">Alertes</span>

              <div class="stat-icon stat-icon--orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
                  <path d="M12 9v4m0 4h.01" />
                </svg>
              </div>
            </div>

            <strong class="stat-value">—</strong>

            <p class="stat-description">
              Compteur en attente de connexion à l'API des alertes.
            </p>
          </article>
        </div>
      </section>

      <!-- Actions rapides -->
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">GESTION DE LA GARE</span>
            <h2>Actions rapides</h2>
            <p class="section-description">
              Accès aux principaux modules opérationnels.
            </p>
          </div>

          <span class="module-count">
            {{ quickActions.length }} modules
          </span>
        </div>

        <div class="actions-grid">
          <button
            v-for="action in quickActions"
            :key="action.id"
            class="action-card"
            type="button"
            @click="openModule(action.id)"
          >
            <div class="action-top">
              <span class="action-number">{{ action.number }}</span>

              <span class="action-arrow">→</span>
            </div>

            <div class="action-icon">
              <svg
                v-if="action.icon === 'document'"
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
                v-else-if="action.icon === 'vehicle'"
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
                v-else-if="action.icon === 'users'"
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
                v-else-if="action.icon === 'folder'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>

              <svg
                v-else-if="action.icon === 'alert'"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
            </div>

            <strong>{{ action.title }}</strong>

            <p>{{ action.description }}</p>

            <span class="action-footer">
              Accéder au module
              <span>→</span>
            </span>
          </button>
        </div>
      </section>

      <!-- Activité récente -->
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">SUIVI OPÉRATIONNEL</span>
            <h2>Activité récente</h2>
            <p class="section-description">
              Historique des dernières opérations réalisées dans votre gare.
            </p>
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>

          <h3>Aucune activité disponible</h3>

          <p>
            Les dernières opérations de votre gare apparaîtront ici
            lorsque l'API de suivi des activités sera connectée.
          </p>

          <span class="coming-soon">CONNECTEUR EN ATTENTE</span>
        </div>
      </section>

      <!-- Alertes -->
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="section-kicker">SURVEILLANCE</span>
            <h2>Alertes à traiter</h2>
            <p class="section-description">
              Suivi des alertes concernant les ressources et les opérations.
            </p>
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-icon empty-icon--alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4m0 4h.01" />
            </svg>
          </div>

          <h3>Alertes non chargées</h3>

          <p>
            Les alertes concernant les documents, les véhicules et
            les chauffeurs seront affichées ici après connexion
            de l'API des alertes.
          </p>

          <span class="coming-soon">CONNECTEUR EN ATTENTE</span>
        </div>
      </section>

      <!-- Footer -->
      <footer class="dashboard-footer">
        <strong>FOPTRAC</strong>
        <span>Espace de gestion et de supervision des gares</span>
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 12px;
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

.subtitle {
  margin: 10px 0 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 14px;
  line-height: 1.7;
}

.subtitle strong {
  color: var(--color-brand-primary, #17365d);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid var(--color-border, #e2e8f0);
  background: white;
  color: var(--color-brand-primary, #17365d);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--color-brand-accent, #c5a13b);
  background: #fffcf4;
}

.btn-logout {
  border: 1px solid #eadada;
  background: #fffafa;
  color: #a13e3e;
}

.btn-logout:hover:not(:disabled) {
  border-color: #dcaeae;
  background: #fff1f1;
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
  line-height: 1.6;
}

.banner-decoration {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  color: rgb(255 255 255 / 35%);
}

.banner-decoration span {
  font-size: 10px;
  letter-spacing: 0.2em;
}

.banner-decoration strong {
  color: rgb(255 255 255 / 75%);
  font-size: 28px;
  letter-spacing: 0.12em;
}

/* Sections */

.section {
  margin-bottom: 34px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
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

.user-card {
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

.user-identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 50px;
  width: 50px;
  height: 50px;
  border: 1px solid #e9d9a9;
  border-radius: 50%;
  background: #fbf6e8;
  color: var(--color-brand-primary, #17365d);
  font-size: 15px;
  font-weight: 800;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.user-info strong {
  overflow-wrap: anywhere;
  color: var(--color-brand-dark, #101b2d);
  font-size: 14px;
}

.user-info span {
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
}

.profile-divider {
  width: 1px;
  height: 42px;
  background: var(--color-border, #e2e8f0);
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.detail-label {
  color: var(--color-text-secondary, #64748b);
  font-size: 11px;
}

.user-detail strong {
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
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
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

.stat-icon--orange {
  background: #fff3e8;
  color: #c47732;
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
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
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

/* Actions rapides */

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

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 12px;
  background: white;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-card, 0 4px 16px rgb(15 23 42 / 5%));
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.action-card:hover {
  transform: translateY(-3px);
  border-color: #d7c184;
  box-shadow: 0 8px 22px rgb(15 23 42 / 8%);
}

.action-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.action-number {
  color: #a7b1c0;
  font-size: 11px;
  font-weight: 800;
}

.action-arrow {
  color: var(--color-brand-accent, #c5a13b);
  font-size: 20px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: 16px 0;
  border-radius: 10px;
  background: #edf3fc;
  color: var(--color-brand-primary, #17365d);
}

.action-icon svg {
  width: 22px;
  height: 22px;
}

.action-card > strong {
  color: var(--color-brand-dark, #101b2d);
  font-size: 14px;
  font-weight: 800;
}

.action-card > p {
  min-height: 38px;
  margin: 8px 0 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 12px;
  line-height: 1.7;
}

.action-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 14px;
  margin-top: 16px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  color: var(--color-text-secondary, #64748b);
  font-size: 10px;
  font-weight: 700;
}

.action-footer span {
  color: var(--color-brand-accent, #c5a13b);
  font-size: 17px;
}

/* États vides */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: white;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: #edf3fc;
  color: var(--color-brand-primary, #17365d);
}

.empty-icon--alert {
  background: #fff3e8;
  color: #c47732;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--color-brand-dark, #101b2d);
  font-size: 15px;
}

.empty-state p {
  max-width: 600px;
  margin: 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 12px;
  line-height: 1.7;
}

.coming-soon {
  padding: 6px 10px;
  margin-top: 16px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
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

.dashboard-footer strong {
  color: var(--color-brand-primary, #17365d);
  font-weight: 900;
  letter-spacing: 0.12em;
}

/* Responsive */

@media (max-width: 1100px) {
  .user-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-divider {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .actions-grid {
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

  .header-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
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
  }

  .banner-decoration {
    display: none;
  }

  .user-card {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .stats-grid,
  .actions-grid {
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

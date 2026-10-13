
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
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

const initials = computed(() => {
  const prenom = user.value?.prenom?.trim() ?? '';
  const nom = user.value?.nom?.trim() ?? '';

  if (prenom || nom) {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }

  return (
    user.value?.username?.substring(0, 2) ?? 'RG'
  ).toUpperCase();
});

async function refreshDashboard() {
  loading.value = true;
  errorMessage.value = '';

  try {
    stats.value = await getDashboardStats();

    if (stats.value.isGlobal === true) {
      errorMessage.value =
        'Le périmètre reçu est global. Vérifiez le rôle et les autorisations de ce compte.';
      stats.value = null;
    }
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
  try {
    await authStore.logout();

    await router.push({ name: 'login' });
  } catch (error: unknown) {
    console.error('Erreur lors de la déconnexion :', error);
    errorMessage.value =
      'La déconnexion a échoué. Réessayez.';
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
        <div>
          <p class="eyebrow">Espace opérationnel</p>

          <h1>Dashboard Responsable de gare</h1>

          <p class="subtitle">
            Gestion et supervision des activités de votre gare.
          </p>
        </div>

        <div class="header-actions">
          <button
            class="btn btn-secondary"
            type="button"
            :disabled="loading"
            @click="refreshDashboard"
          >
            {{ loading ? 'Actualisation...' : 'Actualiser' }}
          </button>

          <button
            class="btn btn-primary"
            type="button"
            @click="handleLogout"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <!-- Profil utilisateur -->
      <section class="user-card">
        <div class="user-avatar">
          {{ initials }}
        </div>

        <div class="user-info">
          <h2>
            {{ user?.prenom || '' }}
            {{ user?.nom || user?.username || '' }}
          </h2>

          <p>
            <strong>Utilisateur :</strong>
            {{ user?.username || '—' }}
          </p>

          <p>
            <strong>Email :</strong>
            {{ user?.email || 'Non renseigné' }}
          </p>

          <p>
            <strong>Rôle :</strong>
            Responsable de gare
          </p>

          <p>
            <strong>Gare :</strong>
            {{ gareId || 'Non définie' }}
          </p>
        </div>
      </section>

      <!-- Chargement -->
      <p
        v-if="loading && !stats"
        class="feedback"
        role="status"
      >
        Chargement des statistiques de votre gare...
      </p>

      <!-- Erreur -->
      <p
        v-if="errorMessage"
        class="error-message"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <!-- Statistiques de la gare -->
      <section
        v-if="stats"
        class="stats-grid"
        aria-label="Statistiques de la gare"
      >
        <article class="stat-card">
          <span class="stat-label">Fiches</span>

          <strong class="stat-value">
            {{ stats.fiches }}
          </strong>

          <span class="stat-description">
            Fiches enregistrées dans votre gare
          </span>
        </article>

        <article class="stat-card">
          <span class="stat-label">Véhicules</span>

          <strong class="stat-value">
            {{ stats.vehicules }}
          </strong>

          <span class="stat-description">
            Véhicules référencés dans les fiches de la gare
          </span>
        </article>

        <article class="stat-card">
          <span class="stat-label">Chauffeurs</span>

          <strong class="stat-value">
            {{ stats.chauffeurs }}
          </strong>

          <span class="stat-description">
            Chauffeurs référencés dans les fiches de la gare
          </span>
        </article>

        <article class="stat-card">
          <span class="stat-label">Alertes</span>

          <strong class="stat-value">—</strong>

          <span class="stat-description">
            Compteur à connecter à l'API des alertes
          </span>
        </article>
      </section>

      <!-- Actions rapides -->
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Opérations</p>
            <h2>Actions rapides</h2>
          </div>
        </div>

        <div class="actions-grid">
          <button
            class="action-card"
            type="button"
            @click="openModule('fiches')"
          >
            <span class="action-icon">📋</span>
            <span>
              <strong>Fiches de chargement</strong>
              <small>Consulter et gérer les fiches de la gare</small>
            </span>
          </button>

          <button
            class="action-card"
            type="button"
            @click="openModule('vehicules')"
          >
            <span class="action-icon">🚐</span>
            <span>
              <strong>Véhicules</strong>
              <small>Gérer les véhicules de la gare</small>
            </span>
          </button>

          <button
            class="action-card"
            type="button"
            @click="openModule('chauffeurs')"
          >
            <span class="action-icon">👤</span>
            <span>
              <strong>Chauffeurs</strong>
              <small>Consulter et gérer les chauffeurs</small>
            </span>
          </button>

          <button
            class="action-card"
            type="button"
            @click="openModule('documents')"
          >
            <span class="action-icon">📄</span>
            <span>
              <strong>Documents</strong>
              <small>Vérifier les documents et leurs échéances</small>
            </span>
          </button>

          <button
            class="action-card"
            type="button"
            @click="openModule('alertes')"
          >
            <span class="action-icon">⚠️</span>
            <span>
              <strong>Alertes</strong>
              <small>Consulter les alertes de la gare</small>
            </span>
          </button>

          <button
            class="action-card"
            type="button"
            @click="openModule('passagers')"
          >
            <span class="action-icon">👥</span>
            <span>
              <strong>Passagers</strong>
              <small>Consulter les informations passagers</small>
            </span>
          </button>
        </div>
      </section>

      <!-- Activité récente -->
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Suivi</p>
            <h2>Activité récente</h2>
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-icon">📊</div>

          <h3>Aucune activité disponible</h3>

          <p>
            Les dernières opérations de votre gare apparaîtront ici
            lorsque l'API de suivi des activités sera connectée.
          </p>
        </div>
      </section>

      <!-- Alertes -->
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Surveillance</p>
            <h2>Alertes à traiter</h2>
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-icon">🔔</div>

          <h3>Alertes non chargées</h3>

          <p>
            Les alertes concernant les documents, les véhicules et
            les chauffeurs seront affichées ici après connexion
            de l'API des alertes.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100%;
  padding: 32px;
  background: #f8fafc;
}

.dashboard-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  font-size: 2rem;
  line-height: 1.2;
  color: #0f172a;
}

.subtitle {
  margin-bottom: 0;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0f172a;
  color: white;
}

.btn-secondary {
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding: 22px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #0f172a;
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
}

.user-info h2 {
  margin-bottom: 8px;
  color: #0f172a;
}

.user-info p {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  min-width: 0;
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.stat-label {
  display: block;
  margin-bottom: 10px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-value {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
  font-size: 2rem;
}

.stat-description {
  color: #94a3b8;
  font-size: 0.8rem;
}

.feedback {
  padding: 16px;
  color: #475569;
}

.error-message {
  margin-bottom: 24px;
  padding: 16px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h2 {
  margin-bottom: 0;
  color: #0f172a;
  font-size: 1.25rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.action-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 18px;
  text-align: left;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(15 23 42 / 8%);
}

.action-icon {
  font-size: 1.4rem;
}

.action-card strong {
  display: block;
  margin-bottom: 5px;
  color: #0f172a;
}

.action-card small {
  display: block;
  color: #64748b;
  line-height: 1.4;
}

.empty-state {
  padding: 36px 24px;
  text-align: center;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
}

.empty-icon {
  margin-bottom: 12px;
  font-size: 2rem;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: #0f172a;
}

.empty-state p {
  max-width: 600px;
  margin: 0 auto;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dashboard {
    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .user-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

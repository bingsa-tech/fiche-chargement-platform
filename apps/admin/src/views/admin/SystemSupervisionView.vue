
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getDashboardStats } from '../../api/stats.api';

interface SystemStats {
  utilisateurs: number;
  gares: number;
  vehicules: number;
  chauffeurs: number;
  fiches: number;
}

const stats = ref<SystemStats>({
  utilisateurs: 0,
  gares: 0,
  vehicules: 0,
  chauffeurs: 0,
  fiches: 0,
});

const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const lastUpdated = ref<Date | null>(null);

const indicators = [
  { key: 'utilisateurs', label: 'Utilisateurs', icon: 'U' },
  { key: 'gares', label: 'Gares', icon: 'G' },
  { key: 'vehicules', label: 'Véhicules', icon: 'V' },
  { key: 'chauffeurs', label: 'Chauffeurs', icon: 'C' },
  { key: 'fiches', label: 'Fiches de chargement', icon: 'F' },
] as const;

const loadSupervision = async () => {
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const result = await getDashboardStats();

    stats.value = {
      utilisateurs: result.utilisateurs ?? 0,
      gares: result.gares ?? 0,
      vehicules: result.vehicules ?? 0,
      chauffeurs: result.chauffeurs ?? 0,
      fiches: result.fiches ?? 0,
    };

    lastUpdated.value = new Date();
  } catch (error) {
    console.error('Erreur de supervision :', error);
    hasError.value = true;
    errorMessage.value =
      'Impossible de récupérer les statistiques depuis le serveur.';
  } finally {
    isLoading.value = false;
  }
};

const formattedDate = () => {
  if (!lastUpdated.value) return 'Aucune actualisation';

  return lastUpdated.value.toLocaleString('fr-CA', {
    dateStyle: 'long',
    timeStyle: 'medium',
  });
};

onMounted(loadSupervision);
</script>

<template>
  <main class="supervision-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">Monotoring</span>
       
       <!--  <p>
          Vue d'ensemble des indicateurs et de l'accès aux données
          de la plateforme.
        </p> -->
      </div>

      <RouterLink
        :to="{ name: 'admin-dashboard' }"
        class="back-link"
      >
        ← Retour au tableau de bord
      </RouterLink>
    </header>

    <section class="status-panel">
      <div class="status-info">
        <span
          class="status-indicator"
          :class="{
            'status-ok': !hasError && lastUpdated,
            'status-error': hasError,
            'status-pending': !lastUpdated && !hasError,
          }"
        ></span>

        <div>
          <h2>
            {{
              hasError
                ? 'Accès aux données indisponible'
                : lastUpdated
                  ? 'Connexion aux données réussie'
                  : 'Vérification en attente'
            }}
          </h2>

          <p>{{ errorMessage || 'Vérification de la récupération des statistiques.' }}</p>
        </div>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="isLoading"
        @click="loadSupervision"
      >
        {{ isLoading ? 'Vérification...' : 'Actualiser' }}
      </button>
    </section>

    <section class="metrics-section">
      <div class="section-title">
        <div>
          <h2>Indicateurs de la plateforme</h2>
          <p>Statistiques récupérées depuis le backend.</p>
        </div>
      </div>

      <div class="metrics-grid">
        <article
          v-for="indicator in indicators"
          :key="indicator.key"
          class="metric-card"
        >
          <div class="metric-icon">{{ indicator.icon }}</div>

          <div class="metric-value">
            {{ isLoading ? '...' : stats[indicator.key] }}
          </div>

          <h3>{{ indicator.label }}</h3>
        </article>
      </div>
    </section>

    <section class="technical-section">
      <h2>État de la supervision</h2>

      <div class="technical-card">
        <div class="technical-row">
          <span>Récupération des statistiques API</span>
          <strong :class="hasError ? 'text-error' : lastUpdated ? 'text-success' : ''">
            {{
              hasError
                ? 'Échec'
                : lastUpdated
                  ? 'Opérationnelle'
                  : 'En attente'
            }}
          </strong>
        </div>

        <div class="technical-row">
          <span>Dernière actualisation</span>
          <strong>{{ formattedDate() }}</strong>
        </div>

        <div class="technical-row">
          <span>Actualisation automatique</span>
          <strong>Non configurée</strong>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.supervision-page {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  color: #172033;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.eyebrow {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.page-header h1 {
  margin: 8px 0;
  font-size: 28px;
}

.page-header p,
.section-title p {
  color: #64748b;
  font-size: 14px;
}

.back-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.status-panel,
.technical-card {
  padding: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
}

.status-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.status-info h2 {
  margin: 0 0 5px;
  font-size: 16px;
}

.status-info p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #94a3b8;
}

.status-ok {
  background: #16a34a;
}

.status-error {
  background: #dc2626;
}

.status-pending {
  background: #d97706;
}

.refresh-button {
  padding: 11px 18px;
  border: none;
  border-radius: 8px;
  background: #1d4ed8;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.metrics-section,
.technical-section {
  margin-bottom: 32px;
}

.section-title {
  margin-bottom: 18px;
}

.section-title h2,
.technical-section h2 {
  font-size: 18px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
}

.metric-card {
  padding: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
}

.metric-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 800;
}

.metric-value {
  margin: 18px 0 5px;
  font-size: 27px;
  font-weight: 800;
}

.metric-card h3 {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.technical-card {
  margin-top: 16px;
}

.technical-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #edf0f5;
  font-size: 13px;
}

.technical-row:last-child {
  border-bottom: none;
}

.text-success {
  color: #15803d;
}

.text-error {
  color: #dc2626;
}

@media (max-width: 700px) {
  .page-header,
  .status-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .technical-row {
    flex-direction: column;
    gap: 7px;
  }
}
</style>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useDestinationStore } from '../../stores/destination.store';
import DestinationStatusBadge from '../../components/destinations/DestinationStatusBadge.vue';

const route = useRoute();
const router = useRouter();
const store = useDestinationStore();

const pageError = ref('');

onMounted(async () => {
  try {
    await store.fetchDestination(String(route.params.id));
  } catch {
    pageError.value = store.error || 'Destination introuvable.';
  }
});

function goBack() {
  router.push({ name: 'destinations' });
}

function editDestination() {
  if (!store.selectedDestination) return;

  router.push({
    name: 'destination-edit',
    params: { id: store.selectedDestination.id },
  });
}

function formatDate(value: string): string {
  if (!value) return 'Non renseignée';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date invalide';

  return date.toLocaleString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <main class="page">
    <!-- Fil d'Ariane -->
    <nav class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <button type="button" @click="goBack">Destinations</button>
      <span class="separator">/</span>
      <span class="current">Détails</span>
    </nav>

    <!-- En-tête -->
    <header class="page-header">
      <div>
        <p class="eyebrow">RÉFÉRENTIEL</p>
        <h1>Détails de la destination</h1>
        <p class="subtitle">
          Consultez les informations et le statut de cette destination.
        </p>
      </div>

      <button type="button" class="back-button" @click="goBack">
        <span>←</span>
        Retour aux destinations
      </button>
    </header>

    <!-- Erreur -->
    <div v-if="pageError" class="error-message" role="alert">
      <span class="error-icon">!</span>
      {{ pageError }}
    </div>

    <!-- Chargement -->
    <section
      v-else-if="!store.selectedDestination"
      class="loading-card"
    >
      <span class="spinner"></span>
      <p>Chargement des informations de la destination…</p>
    </section>

    <!-- Détails -->
    <section v-else class="details-card">
      <div class="details-header">
        <div class="destination-identity">
          <div class="destination-icon">⌖</div>

          <div>
            <p class="eyebrow">FICHE DESTINATION</p>
            <h2>{{ store.selectedDestination.nom }}</h2>
            <span class="code">
              Code : {{ store.selectedDestination.code }}
            </span>
          </div>
        </div>

        <div class="header-actions">
          <DestinationStatusBadge
            :statut="store.selectedDestination.statut"
          />

          <button
            type="button"
            class="edit-button"
            @click="editDestination"
          >
            <span>✎</span>
            Modifier
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section-heading">
        <h3>Informations générales</h3>
        <p>Données enregistrées pour cette destination.</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Nom de la destination</span>
          <span class="info-value">
            {{ store.selectedDestination.nom }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-label">Code de référence</span>
          <span class="info-value code-value">
            {{ store.selectedDestination.code }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-label">Ville</span>
          <span class="info-value">
            {{ store.selectedDestination.ville }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-label">Pays</span>
          <span class="info-value">
            {{ store.selectedDestination.pays }}
          </span>
        </div>

        <div class="info-item">
          <span class="info-label">Statut</span>
          <span class="info-value">
            <DestinationStatusBadge
              :statut="store.selectedDestination.statut"
            />
          </span>
        </div>
      </div>

      <div class="divider metadata-divider"></div>

      <div class="section-heading">
        <h3>Informations système</h3>
        <p>Historique de création et de modification.</p>
      </div>

      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="metadata-icon">◷</span>
          <div>
            <span class="info-label">Créée le</span>
            <span class="metadata-value">
              {{ formatDate(store.selectedDestination.createdAt) }}
            </span>
          </div>
        </div>

        <div class="metadata-item">
          <span class="metadata-icon">↻</span>
          <div>
            <span class="info-label">Dernière mise à jour</span>
            <span class="metadata-value">
              {{ formatDate(store.selectedDestination.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span>Référentiel des destinations</span>
        <button type="button" class="footer-back" @click="goBack">
          Retour à la liste
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  box-sizing: border-box;
}

/* Fil d'Ariane */
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 25px;
  color: #8490a2;
  font-size: 0.82rem;
}

.breadcrumb button {
  padding: 0;
  border: none;
  background: transparent;
  color: #52647c;
  cursor: pointer;
  font: inherit;
}

.breadcrumb button:hover {
  color: #17365d;
  text-decoration: underline;
}

.separator {
  color: #c5a13b;
}

.current {
  color: #17365d;
  font-weight: 700;
}

/* En-tête */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #b18a2c;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 1.85rem;
  font-weight: 800;
}

.subtitle {
  margin: 9px 0 0;
  color: #667085;
  font-size: 0.94rem;
  line-height: 1.5;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 10px 16px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #fff;
  color: #17365d;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
}

.back-button:hover {
  background: #f4f6f9;
  border-color: #17365d;
}

/* Carte principale */
.details-card {
  overflow: hidden;
  padding: 28px;
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 24 40 / 4%);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.destination-identity {
  display: flex;
  align-items: center;
  gap: 17px;
}

.destination-icon {
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #f5f0e2;
  color: #a17c25;
  font-size: 2rem;
}

.destination-identity h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.45rem;
  font-weight: 800;
}

.code {
  display: inline-block;
  margin-top: 7px;
  color: #667085;
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #17365d;
  border-radius: 8px;
  background: #17365d;
  color: #fff;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
}

.edit-button:hover {
  background: #102944;
}

.divider {
  height: 1px;
  margin: 26px 0;
  background: #edf0f4;
}

/* Informations générales */
.section-heading {
  margin-bottom: 20px;
}

.section-heading h3 {
  margin: 0;
  color: #17365d;
  font-size: 1.05rem;
  font-weight: 750;
}

.section-heading p {
  margin: 5px 0 0;
  color: #8490a2;
  font-size: 0.83rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 17px 0;
  border-bottom: 1px solid #edf0f4;
}

.info-label {
  color: #8490a2;
  font-size: 0.78rem;
  font-weight: 600;
}

.info-value {
  color: #26364a;
  font-size: 0.94rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.code-value {
  color: #17365d;
  font-family: monospace;
  letter-spacing: 0.03em;
}

.metadata-divider {
  margin-top: 30px;
}

/* Métadonnées */
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.metadata-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 16px;
  border: 1px solid #edf0f4;
  border-radius: 9px;
  background: #fafbfc;
}

.metadata-item > div {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.metadata-icon {
  color: #b18a2c;
  font-size: 1.35rem;
}

.metadata-value {
  color: #26364a;
  font-size: 0.86rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

/* Pied de carte */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid #edf0f4;
  color: #8490a2;
  font-size: 0.78rem;
}

.footer-back {
  padding: 0;
  border: none;
  background: transparent;
  color: #17365d;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.footer-back:hover {
  color: #b18a2c;
}

/* Erreur */
.error-message {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px 16px;
  border: 1px solid #fecdca;
  border-radius: 9px;
  background: #fff5f4;
  color: #b42318;
  font-size: 0.9rem;
}

.error-icon {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #b42318;
  color: #fff;
  font-weight: 800;
}

/* Chargement */
.loading-card {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  background: #fff;
  color: #667085;
  font-size: 0.9rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e8edf3;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: 20px 16px 32px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .details-card {
    padding: 20px 16px;
  }

  .details-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .destination-identity h2 {
    font-size: 1.2rem;
  }
}
</style>

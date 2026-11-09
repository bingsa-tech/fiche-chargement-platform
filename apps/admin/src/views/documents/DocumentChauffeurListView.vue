
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { getDocumentsChauffeurs } from '../../api/documents.api';
import type { DocumentChauffeur } from '../../types/document.types';

const documents = ref<DocumentChauffeur[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const totalDocuments = computed(() => documents.value.length);

const documentsValides = computed(
  () => documents.value.filter((doc) => doc.statut?.toUpperCase() === 'VALIDE').length,
);

const documentsExpires = computed(
  () => documents.value.filter((doc) => doc.statut?.toUpperCase() === 'EXPIRE').length,
);

const documentsInactifs = computed(
  () => documents.value.filter((doc) => doc.statut?.toUpperCase() === 'INACTIF').length,
);

function formatDate(date: string | null): string {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return new Intl.DateTimeFormat('fr-CA').format(parsedDate);
}

function getStatutClass(statut: string): string {
  switch (statut.toUpperCase()) {
    case 'VALIDE':
      return 'status-valid';
    case 'EXPIRE':
      return 'status-expired';
    case 'INACTIF':
      return 'status-inactive';
    default:
      return 'status-default';
  }
}

async function loadDocuments(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    documents.value = await getDocumentsChauffeurs();
  } catch (err: unknown) {
    console.error(
      'Erreur lors du chargement des documents chauffeur:',
      err,
    );

    error.value =
      'Impossible de charger les documents des chauffeurs.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadDocuments();
});
</script>

<template>
  <section class="documents-page">

    <!-- EN-TÊTE -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <strong>Documents chauffeurs</strong>
    </div>

    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>▤</span>
        </div>

        <div>
          <h1>Documents des chauffeurs</h1>
          <p>
            Consultation et suivi des documents administratifs associés aux chauffeurs.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="loading"
        @click="loadDocuments"
      >
        <span class="refresh-icon">↻</span>
        {{ loading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </header>

    <!-- STATISTIQUES -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon stat-icon-total">▤</div>
        <div class="stat-content">
          <span class="stat-label">Total des documents</span>
          <strong>{{ totalDocuments }}</strong>
          <small>Documents enregistrés</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-valid">✓</div>
        <div class="stat-content">
          <span class="stat-label">Documents valides</span>
          <strong>{{ documentsValides }}</strong>
          <small>Documents en règle</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-expired">!</div>
        <div class="stat-content">
          <span class="stat-label">Documents expirés</span>
          <strong>{{ documentsExpires }}</strong>
          <small>À renouveler</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-inactive">○</div>
        <div class="stat-content">
          <span class="stat-label">Documents inactifs</span>
          <strong>{{ documentsInactifs }}</strong>
          <small>Documents désactivés</small>
        </div>
      </article>
    </div>

    <!-- ERREUR -->
    <div v-if="error" class="error-message" role="alert">
      <span class="error-icon">!</span>
      <span>{{ error }}</span>

      <button type="button" @click="loadDocuments">
        Réessayer
      </button>
    </div>

    <!-- CONTENU -->
    <div class="content-card">

      <div class="content-card-header">
        <div>
          <h2>Liste des documents</h2>
          <p>Documents administratifs enregistrés pour les chauffeurs.</p>
        </div>

        <span class="document-count">
          {{ totalDocuments }}
          document{{ totalDocuments > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- CHARGEMENT -->
      <div
        v-if="loading && documents.length === 0"
        class="loading-state"
      >
        <span class="spinner"></span>
        <p>Chargement des documents...</p>
      </div>

      <!-- VIDE -->
      <div
        v-else-if="!loading && documents.length === 0 && !error"
        class="empty-state"
      >
        <div class="empty-icon">▤</div>
        <h3>Aucun document trouvé</h3>
        <p>
          Aucun document chauffeur n'est actuellement disponible.
        </p>
        <button type="button" class="secondary-button" @click="loadDocuments">
          Actualiser la liste
        </button>
      </div>

      <!-- TABLEAU -->
      <div v-else-if="documents.length > 0" class="table-container">
        <table class="documents-table">
          <thead>
            <tr>
              <th>Chauffeur</th>
              <th>Document</th>
              <th>Numéro</th>
              <th>Délivrance</th>
              <th>Expiration</th>
              <th>Statut</th>
              <th>Observations</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="document in documents"
              :key="document.id"
            >
              <td>
                <div class="driver-cell">
                  <div class="driver-avatar">CH</div>
                  <div>
                    <strong class="driver-id">
                      {{ document.chauffeurId }}
                    </strong>
                    <small>ID chauffeur</small>
                  </div>
                </div>
              </td>

              <td>
                <span class="document-type">
                  {{ document.typeDocument }}
                </span>
              </td>

              <td>
                <span class="document-number">
                  {{ document.numeroDocument || '—' }}
                </span>
              </td>

              <td class="date-cell">
                {{ formatDate(document.dateDelivrance) }}
              </td>

              <td class="date-cell">
                {{ formatDate(document.dateExpiration) }}
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="getStatutClass(document.statut)"
                >
                  <span class="status-dot"></span>
                  {{ document.statut }}
                </span>
              </td>

              <td class="observations-cell">
                {{ document.observations || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CHARGEMENT LORS D'UNE ACTUALISATION -->
      <div
        v-if="loading && documents.length > 0"
        class="refresh-indicator"
      >
        Actualisation des données...
      </div>

      <!-- COMPTEUR -->
      <footer
        v-if="!loading && documents.length > 0"
        class="table-footer"
      >
        <span>
          {{ totalDocuments }}
          résultat{{ totalDocuments > 1 ? 's' : '' }}
        </span>
        <span>Documents chauffeurs</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.documents-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #263445;
}

/* BREADCRUMB */

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #8993a2;
  font-size: 0.83rem;
}

.breadcrumb strong {
  color: #17365d;
  font-weight: 700;
}

.breadcrumb-separator {
  color: #c5a13b;
}

/* EN-TÊTE */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #17365d;
  color: #e3c36b;
  font-size: 1.8rem;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 1.65rem;
  font-weight: 750;
}

.page-header p {
  margin: 7px 0 0;
  color: #7b8795;
  font-size: 0.93rem;
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 17px;
  border: 1px solid #17365d;
  border-radius: 8px;
  background: #17365d;
  color: white;
  font-size: 0.9rem;
  font-weight: 650;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background: #244b78;
  transform: translateY(-1px);
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.refresh-icon {
  color: #e3c36b;
  font-size: 1.2rem;
}

/* STATISTIQUES */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 112px;
  padding: 20px;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 35 60 / 4%);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 1.35rem;
  font-weight: 800;
}

.stat-icon-total {
  background: #eaf0f8;
  color: #17365d;
}

.stat-icon-valid {
  background: #e8f7ee;
  color: #18794e;
}

.stat-icon-expired {
  background: #fdecec;
  color: #b42318;
}

.stat-icon-inactive {
  background: #f1f2f4;
  color: #667085;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-label {
  color: #748091;
  font-size: 0.79rem;
  font-weight: 600;
}

.stat-content strong {
  color: #17365d;
  font-size: 1.55rem;
  line-height: 1.2;
}

.stat-content small {
  color: #9aa3af;
  font-size: 0.75rem;
}

/* ERREUR */

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  margin-bottom: 18px;
  border: 1px solid #f4caca;
  border-radius: 9px;
  background: #fff1f1;
  color: #b42318;
  font-size: 0.9rem;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: #b42318;
  color: white;
  font-weight: 800;
}

.error-message button {
  margin-left: auto;
  border: none;
  background: transparent;
  color: #9e1b16;
  font-weight: 700;
  cursor: pointer;
}

/* CARTE PRINCIPALE */

.content-card {
  overflow: hidden;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 35 60 / 4%);
}

.content-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f3;
}

.content-card-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.05rem;
  font-weight: 750;
}

.content-card-header p {
  margin: 5px 0 0;
  color: #8792a0;
  font-size: 0.83rem;
}

.document-count {
  padding: 6px 11px;
  border: 1px solid #e5eaf0;
  border-radius: 20px;
  background: #f7f9fb;
  color: #526174;
  font-size: 0.78rem;
  font-weight: 650;
  white-space: nowrap;
}

/* TABLEAU */

.table-container {
  width: 100%;
  overflow-x: auto;
}

.documents-table {
  width: 100%;
  min-width: 950px;
  border-collapse: collapse;
  background: white;
}

.documents-table th,
.documents-table td {
  padding: 15px 17px;
  border-bottom: 1px solid #edf0f3;
  text-align: left;
  vertical-align: middle;
}

.documents-table th {
  background: #f8fafc;
  color: #647184;
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.035em;
  text-transform: uppercase;
  white-space: nowrap;
}

.documents-table td {
  color: #465365;
  font-size: 0.85rem;
}

.documents-table tbody tr {
  transition: background 0.15s;
}

.documents-table tbody tr:hover {
  background: #f9fbfd;
}

.documents-table tbody tr:last-child td {
  border-bottom: none;
}

/* CHAUFFEUR */

.driver-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.driver-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eaf0f8;
  color: #17365d;
  font-size: 0.7rem;
  font-weight: 800;
}

.driver-cell > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.driver-id {
  color: #17365d;
  font-size: 0.82rem;
}

.driver-cell small {
  color: #98a2b3;
  font-size: 0.72rem;
}

/* DOCUMENT */

.document-type {
  color: #34465d;
  font-weight: 650;
}

.document-number {
  color: #526174;
  font-family: monospace;
  font-size: 0.83rem;
}

.date-cell {
  white-space: nowrap;
  color: #667085 !important;
}

.observations-cell {
  max-width: 220px;
  color: #778395 !important;
}

/* STATUT */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status-valid {
  background: #e8f7ee;
  color: #18794e;
}

.status-expired {
  background: #fdecec;
  color: #b42318;
}

.status-inactive {
  background: #f1f2f4;
  color: #667085;
}

.status-default {
  background: #eef2f6;
  color: #475467;
}

/* CHARGEMENT ET ÉTAT VIDE */

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 35px 20px;
  text-align: center;
}

.loading-state p {
  margin-top: 14px;
  color: #748091;
  font-size: 0.9rem;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #e8edf2;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: #edf2f8;
  color: #17365d;
  font-size: 1.8rem;
}

.empty-state h3 {
  margin: 16px 0 5px;
  color: #17365d;
  font-size: 1.05rem;
}

.empty-state p {
  margin: 0 0 17px;
  color: #8993a2;
  font-size: 0.85rem;
}

.secondary-button {
  padding: 9px 14px;
  border: 1px solid #d8e0e9;
  border-radius: 7px;
  background: white;
  color: #17365d;
  font-weight: 650;
  cursor: pointer;
}

.secondary-button:hover {
  background: #f4f7fa;
}

/* PIED DE TABLEAU */

.refresh-indicator {
  padding: 10px 20px;
  border-top: 1px solid #edf0f3;
  color: #8a6d1d;
  font-size: 0.8rem;
  text-align: center;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 22px;
  border-top: 1px solid #edf0f3;
  background: #fbfcfd;
  color: #8792a0;
  font-size: 0.8rem;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .documents-page {
    padding: 20px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 1.35rem;
  }

  .refresh-button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .table-footer {
    flex-direction: column;
  }
}
</style>

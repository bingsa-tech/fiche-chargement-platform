<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getDocumentsVehicules } from '../../api/documents.api';
import type { DocumentVehicule } from '../../types/document.types';

const documents = ref<DocumentVehicule[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// =====================================================
// FORMATAGE DES DATES
// =====================================================

function formatDate(date: string | null): string {
  if (!date) {
    return '—';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-CA').format(parsedDate);
}

// =====================================================
// STATUT DU DOCUMENT
// =====================================================

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

// =====================================================
// CHARGEMENT DES DOCUMENTS
// =====================================================

async function loadDocuments(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    documents.value = await getDocumentsVehicules();
  } catch (err: unknown) {
    console.error(
      'Erreur lors du chargement des documents véhicule:',
      err,
    );

    error.value =
      'Impossible de charger les documents des véhicules.';
  } finally {
    loading.value = false;
  }
}

// =====================================================
// INITIALISATION
// =====================================================

onMounted(() => {
  loadDocuments();
});
</script>

<template>
  <section class="documents-page">
    <!-- =================================================
         EN-TÊTE
    ================================================== -->

    <header class="page-header">
      <div>
        <h1>Documents des véhicules</h1>

        <p>
          Consultation des documents administratifs associés aux véhicules.
        </p>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="loading"
        @click="loadDocuments"
      >
        {{ loading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </header>

    <!-- =================================================
         MESSAGE D'ERREUR
    ================================================== -->

    <div
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </div>

    <!-- =================================================
         ÉTAT DE CHARGEMENT
    ================================================== -->

    <div
      v-if="loading && documents.length === 0"
      class="loading-state"
    >
      Chargement des documents...
    </div>

    <!-- =================================================
         AUCUN DOCUMENT
    ================================================== -->

    <div
      v-else-if="
        !loading &&
        documents.length === 0 &&
        !error
      "
      class="empty-state"
    >
      Aucun document véhicule trouvé.
    </div>

    <!-- =================================================
         TABLEAU
    ================================================== -->

    <div
      v-else-if="documents.length > 0"
      class="table-container"
    >
      <table class="documents-table">
        <thead>
          <tr>
            <th>Véhicule</th>
            <th>Type véhicule</th>
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
            <!-- =========================================
                 VÉHICULE
            ========================================== -->

            <td>
              <strong>
                {{
                  document.vehicule?.plaqueImmatriculation
                  || document.vehiculeId
                }}
              </strong>

              <small
                v-if="document.vehicule"
                class="vehicle-details"
              >
                {{ document.vehicule.marque }}
                {{ document.vehicule.modele }}
              </small>
            </td>

            <!-- =========================================
                 TYPE DU VÉHICULE
            ========================================== -->

            <td>
              {{ document.vehicule?.type || '—' }}
            </td>

            <!-- =========================================
                 TYPE DU DOCUMENT
            ========================================== -->

            <td>
              {{ document.typeDocument }}
            </td>

            <!-- =========================================
                 NUMÉRO DU DOCUMENT
            ========================================== -->

            <td>
              {{ document.numeroDocument || '—' }}
            </td>

            <!-- =========================================
                 DATE DE DÉLIVRANCE
            ========================================== -->

            <td>
              {{ formatDate(document.dateDelivrance) }}
            </td>

            <!-- =========================================
                 DATE D'EXPIRATION
            ========================================== -->

            <td>
              {{ formatDate(document.dateExpiration) }}
            </td>

            <!-- =========================================
                 STATUT
            ========================================== -->

            <td>
              <span
                class="status-badge"
                :class="getStatutClass(document.statut)"
              >
                {{ document.statut }}
              </span>
            </td>

            <!-- =========================================
                 OBSERVATIONS
            ========================================== -->

            <td>
              {{ document.observations || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- =================================================
         COMPTEUR
    ================================================== -->

    <footer
      v-if="!loading && documents.length > 0"
      class="results-count"
    >
      {{ documents.length }}
      document{{ documents.length > 1 ? 's' : '' }}
    </footer>
  </section>
</template>

<style scoped>
.documents-page {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.6rem;
}

.page-header p {
  margin: 0.4rem 0 0;
  color: #666;
}

.refresh-button {
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  padding: 0.9rem 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  background: #fdecec;
  color: #b42318;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.documents-table th,
.documents-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
  vertical-align: middle;
}

.documents-table th {
  font-weight: 700;
  white-space: nowrap;
}

.documents-table tbody tr:hover {
  background: #fafafa;
}

.vehicle-details {
  display: block;
  margin-top: 0.25rem;
  color: #667085;
  font-size: 0.8rem;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-valid {
  background: #e8f7ee;
  color: #18794e;
}

.status-inactive {
  background: #f1f1f1;
  color: #666;
}

.status-expired {
  background: #fdecec;
  color: #b42318;
}

.status-default {
  background: #eef2f6;
  color: #475467;
}

.results-count {
  margin-top: 0.8rem;
  color: #667085;
  font-size: 0.9rem;
}
</style>
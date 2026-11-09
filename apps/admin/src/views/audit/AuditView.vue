
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { auditApi } from '../../api/audit.api';

import AuditFilters from '../../features/audit/components/AuditFilters.vue';
import AuditTable from '../../features/audit/components/AuditTable.vue';
import AuditDetails from '../../features/audit/components/AuditDetails.vue';

import type {
  AuditFilters as AuditFiltersType,
  AuditLog,
  AuditPaginatedResponse,
} from '../../features/audit/types/audit.types';

const logs = ref<AuditLog[]>([]);
const selectedLog = ref<AuditLog | null>(null);

const loading = ref(false);
const errorMessage = ref('');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const activeFilters = ref<AuditFiltersType>({});

const hasPreviousPage = computed(
  () => pagination.page > 1,
);

const hasNextPage = computed(
  () => pagination.page < pagination.totalPages,
);

const hasActiveFilters = computed(
  () => Object.values(activeFilters.value).some(
    (value) => value !== undefined && value !== null && value !== '',
  ),
);

const displayedRange = computed(() => {
  if (pagination.total === 0) return '0 événement';

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return `${start}–${end} sur ${pagination.total}`;
});

async function loadAuditLogs(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response: AuditPaginatedResponse =
      await auditApi.findAll({
        ...activeFilters.value,
        page: pagination.page,
        limit: pagination.limit,
      });

    logs.value = response.data;

    pagination.total = response.total;
    pagination.page = response.page;
    pagination.limit = response.limit;
    pagination.totalPages = response.totalPages;
  } catch (error: unknown) {
    console.error('Erreur chargement audit :', error);

    logs.value = [];

    errorMessage.value =
      'Impossible de charger les journaux d’audit. Vérifiez votre connexion et vos autorisations.';
  } finally {
    loading.value = false;
  }
}

function applyFilters(filters: AuditFiltersType): void {
  activeFilters.value = filters;
  pagination.page = 1;

  void loadAuditLogs();
}

function resetFilters(): void {
  activeFilters.value = {};
  pagination.page = 1;

  void loadAuditLogs();
}

function changePage(page: number): void {
  if (
    page < 1 ||
    page > pagination.totalPages ||
    loading.value
  ) {
    return;
  }

  pagination.page = page;
  void loadAuditLogs();
}

function openDetails(log: AuditLog): void {
  selectedLog.value = log;
}

function closeDetails(): void {
  selectedLog.value = null;
}

onMounted(() => {
  void loadAuditLogs();
});
</script>

<template>
  <section class="audit-view">
    <!-- Fil d'Ariane -->
    <nav class="breadcrumb" aria-label="Fil d’Ariane">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Journal d'audit</span>
    </nav>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="title-icon">
          <span aria-hidden="true">◷</span>
        </div>

        <div>
          <p class="eyebrow">Sécurité et traçabilité</p>
          <h1>Journal d'audit</h1>
          <p class="subtitle">
            Suivi et traçabilité des opérations effectuées sur la plateforme FOPTRAC.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="button button-primary"
        :disabled="loading"
        @click="loadAuditLogs"
      >
        <span aria-hidden="true">↻</span>
        {{ loading ? 'Actualisation...' : 'Actualiser' }}
      </button>
    </header>

    <!-- Indicateurs -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon navy">
          <span aria-hidden="true">▤</span>
        </div>

        <div class="stat-content">
          <p>Total des événements</p>
          <strong>{{ pagination.total }}</strong>
          <span>Événements enregistrés</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold">
          <span aria-hidden="true">⌕</span>
        </div>

        <div class="stat-content">
          <p>Page consultée</p>
          <strong>{{ pagination.totalPages ? pagination.page : 0 }}</strong>
          <span>
            Sur {{ pagination.totalPages }} page(s)
          </span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">
          <span aria-hidden="true">✓</span>
        </div>

        <div class="stat-content">
          <p>Résultats affichés</p>
          <strong>{{ logs.length }}</strong>
          <span>
            {{ hasActiveFilters ? 'Avec filtres actifs' : 'Sans filtre actif' }}
          </span>
        </div>
      </article>
    </div>

    <!-- Erreur -->
    <div
      v-if="errorMessage"
      class="alert alert-error"
      role="alert"
    >
      <span class="alert-icon">!</span>

      <div class="alert-content">
        <strong>Erreur de chargement</strong>
        <p>{{ errorMessage }}</p>

        <button
          type="button"
          class="button button-secondary"
          :disabled="loading"
          @click="loadAuditLogs"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <section class="filters-card">
      <div class="section-heading">
        <div class="section-icon">⌕</div>

        <div>
          <h2>Filtres de recherche</h2>
          <p>
            Affinez les événements selon les critères disponibles.
          </p>
        </div>
      </div>

      <AuditFilters
        @filter="applyFilters"
        @reset="resetFilters"
      />
    </section>

    <!-- Tableau -->
    <section class="table-card">
      <div class="table-heading">
        <div>
          <h2>Historique des opérations</h2>
          <p>
            Consultez les événements enregistrés sur la plateforme.
          </p>
        </div>

        <span class="record-count">
          {{ pagination.total }} événement(s)
        </span>
      </div>

      <AuditTable
        :logs="logs"
        :loading="loading"
        @details="openDetails"
      />
    </section>

    <!-- Pagination -->
    <footer
      v-if="pagination.totalPages > 0"
      class="pagination"
    >
      <div class="pagination-info">
        <strong>{{ displayedRange }}</strong>
        <span>
          — Page {{ pagination.page }} sur {{ pagination.totalPages }}
        </span>
      </div>

      <div class="pagination-actions">
        <button
          type="button"
          class="pagination-button"
          :disabled="!hasPreviousPage || loading"
          @click="changePage(pagination.page - 1)"
        >
          <span aria-hidden="true">←</span>
          Précédent
        </button>

        <span class="current-page">
          {{ pagination.page }}
        </span>

        <button
          type="button"
          class="pagination-button"
          :disabled="!hasNextPage || loading"
          @click="changePage(pagination.page + 1)"
        >
          Suivant
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </footer>

    <!-- Détails -->
    <AuditDetails
      :log="selectedLog"
      @close="closeDetails"
    />
  </section>
</template>

<style scoped>
.audit-view {
  max-width: 1600px;
  min-width: 0;
  margin: 0 auto;
  padding: 28px 32px;
  color: #263445;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #7b8795;
  font-size: 13px;
}

.breadcrumb-current {
  color: #17365d;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #c5a13b;
}

/* En-tête */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 27px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 17px;
}

.title-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #edf2f8;
  color: #17365d;
  font-size: 29px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #a17d22;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 700;
}

.subtitle {
  margin: 7px 0 0;
  color: #778394;
  font-size: 14px;
  line-height: 1.5;
}

/* Boutons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.button-primary {
  border-color: #17365d;
  background: #17365d;
  color: #fff;
}

.button-primary:hover:not(:disabled) {
  border-color: #102744;
  background: #102744;
}

.button-secondary {
  border-color: #d9e0e8;
  background: #fff;
  color: #425269;
}

.button-secondary:hover:not(:disabled) {
  border-color: #c5a13b;
  background: #faf8f2;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 23px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 112px;
  padding: 19px;
  border: 1px solid #e5eaf0;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 37 63 / 4%);
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 21px;
  font-weight: 700;
}

.stat-icon.navy {
  background: #edf2f8;
  color: #17365d;
}

.stat-icon.gold {
  background: #f8f2e4;
  color: #a17d22;
}

.stat-icon.green {
  background: #eaf5ed;
  color: #34764a;
}

.stat-content p {
  margin: 0 0 6px;
  color: #778394;
  font-size: 12px;
}

.stat-content strong {
  display: block;
  color: #17365d;
  font-size: 25px;
  font-weight: 700;
}

.stat-content span {
  display: block;
  margin-top: 4px;
  color: #98a1ad;
  font-size: 11px;
}

/* Filtres */
.filters-card,
.table-card {
  margin-bottom: 21px;
  overflow: hidden;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 37 63 / 4%);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f4;
}

.section-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f5f0e3;
  color: #9a7620;
  font-size: 21px;
}

.section-heading h2,
.table-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 16px;
  font-weight: 700;
}

.section-heading p,
.table-heading p {
  margin: 5px 0 0;
  color: #8792a1;
  font-size: 12px;
}

/* En-tête du tableau */
.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f4;
}

.record-count {
  padding: 6px 10px;
  border-radius: 20px;
  background: #f5f0e3;
  color: #927020;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 18px;
  padding: 16px 19px;
  border: 1px solid #e5eaf0;
  border-radius: 10px;
  background: #fff;
}

.pagination-info {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  color: #8792a1;
  font-size: 12px;
}

.pagination-info strong {
  color: #17365d;
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid #d9e0e8;
  border-radius: 6px;
  background: #fff;
  color: #425269;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
}

.pagination-button:hover:not(:disabled) {
  border-color: #c5a13b;
  background: #faf8f2;
}

.pagination-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.current-page {
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  border-radius: 6px;
  background: #17365d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

/* Messages */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px 17px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 13px;
}

.alert-error {
  border-color: #f0caca;
  background: #fff7f7;
  color: #923737;
}

.alert-icon {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 5%);
  font-weight: 800;
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.alert-content strong {
  font-size: 14px;
}

.alert-content p {
  margin: 0;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .audit-view {
    padding: 18px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

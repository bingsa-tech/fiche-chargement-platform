
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

function applyFilters(
  filters: AuditFiltersType,
): void {
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
  <div class="audit-view">
    <header class="page-header">
      <div>
        <h1>Journal d'audit</h1>
        <p>
          Suivi et traçabilité des opérations effectuées
          sur la plateforme Fiche Chargement.
        </p>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="loading"
        @click="loadAuditLogs"
      >
        {{ loading ? 'Actualisation...' : 'Actualiser' }}
      </button>
    </header>

    <div v-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}

      <button
        type="button"
        @click="loadAuditLogs"
      >
        Réessayer
      </button>
    </div>

    <section class="audit-stats" aria-live="polite">
      <span>Total des événements d’audit</span>
      <strong>{{ pagination.total }}</strong>
    </section>

    <AuditFilters
      @filter="applyFilters"
      @reset="resetFilters"
    />

    <AuditTable
      :logs="logs"
      :loading="loading"
      @details="openDetails"
    />

    <div
      v-if="pagination.totalPages > 0"
      class="pagination"
    >
      <span>
        Page {{ pagination.page }}
        sur {{ pagination.totalPages }}
        — {{ pagination.total }} événement(s)
      </span>

      <div class="pagination-actions">
        <button
          type="button"
          :disabled="!hasPreviousPage || loading"
          @click="changePage(pagination.page - 1)"
        >
          Précédent
        </button>

        <button
          type="button"
          :disabled="!hasNextPage || loading"
          @click="changePage(pagination.page + 1)"
        >
          Suivant
        </button>
      </div>
    </div>

    <AuditDetails
      :log="selectedLog"
      @close="closeDetails"
    />
  </div>
</template>

<style scoped>
.audit-view {
  min-width: 0;
}

.audit-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  font-size: 13px;
}

.audit-stats strong {
  color: #111827;
  font-size: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 7px;
  color: #111827;
  font-size: 24px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.refresh-button {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #2563eb;
  border-radius: 7px;
  background: #2563eb;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
}

.error-message button {
  padding: 7px 12px;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  background: white;
  color: #991b1b;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 18px;
  color: #6b7280;
  font-size: 12px;
}

.pagination-actions {
  display: flex;
  gap: 8px;
}

.pagination-actions button {
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
}

.pagination-actions button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .error-message {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

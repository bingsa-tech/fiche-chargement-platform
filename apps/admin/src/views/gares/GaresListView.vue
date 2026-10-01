<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { deleteGare, getGares } from '../../api/gares.api';
import type { Gare } from '../../types/gare.types';
import { useAuthStore } from '../../auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const gares = ref<Gare[]>([]);
const loading = ref(false);
const deleting = ref<string | null>(null);
const errorMessage = ref('');
const successMessage = ref('');

const userRole = computed(
  () => authStore.user?.role ?? null,
);

const canCreate = computed(
  () => userRole.value === 'ADMIN',
);

const canEdit = computed(
  () =>
    userRole.value === 'ADMIN' ||
    userRole.value === 'RESPONSABLE_GARE',
);

const canDelete = computed(
  () => userRole.value === 'ADMIN',
);

/**
 * Chargement des gares.
 */
async function loadGares(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    gares.value = await getGares();
  } catch (error: any) {
    console.error(
      'Erreur lors du chargement des gares :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger les gares.';
  } finally {
    loading.value = false;
  }
}

/**
 * Navigation vers la création.
 */
function createGare(): void {
  router.push({
    name: 'gare-create',
  });
}

/**
 * Navigation vers la modification.
 */
function editGare(id: string): void {
  router.push({
    name: 'gare-edit',
    params: { id },
  });
}

/**
 * Suppression d'une gare.
 */
async function removeGare(gare: Gare): Promise<void> {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la gare "${gare.nom}" (${gare.code}) ?`,
  );

  if (!confirmed) {
    return;
  }

  deleting.value = gare.id;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteGare(gare.id);

    gares.value = gares.value.filter(
      (item) => item.id !== gare.id,
    );

    successMessage.value =
      'La gare a été supprimée avec succès.';
  } catch (error: any) {
    console.error(
      'Erreur lors de la suppression de la gare :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de supprimer cette gare.';
  } finally {
    deleting.value = null;
  }
}

/**
 * Formatage simple de la date.
 */
function formatDate(
  value: string,
): string {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString(
    'fr-CA',
  );
}

onMounted(() => {
  loadGares();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>Gares</h1>

        <p class="subtitle">
          Gestion des gares du réseau.
        </p>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createGare"
      >
        + Nouvelle gare
      </button>
    </div>

    <!-- Message de succès -->
    <div
      v-if="successMessage"
      class="alert alert-success"
    >
      {{ successMessage }}
    </div>

    <!-- Message d'erreur -->
    <div
      v-if="errorMessage"
      class="alert alert-error"
    >
      {{ errorMessage }}
    </div>

    <!-- Chargement -->
    <div
      v-if="loading"
      class="loading"
    >
      Chargement des gares...
    </div>

    <!-- Tableau -->
    <div
      v-else-if="gares.length > 0"
      class="table-container"
    >
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Ville</th>
            <th>Adresse</th>
            <th>Statut</th>
            <th>Créée le</th>
            <th
              v-if="canEdit || canDelete"
              class="actions-column"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="gare in gares"
            :key="gare.id"
          >
            <td>
              <strong>
                {{ gare.code }}
              </strong>
            </td>

            <td>
              {{ gare.nom }}
            </td>

            <td>
              {{ gare.ville }}
            </td>

            <td>
              {{ gare.adresse || '-' }}
            </td>

            <td>
              <span
                class="status"
                :class="{
                  'status-active':
                    gare.statut === 'ACTIF',
                  'status-inactive':
                    gare.statut === 'INACTIF',
                }"
              >
                {{ gare.statut }}
              </span>
            </td>

            <td>
              {{ formatDate(gare.createdAt) }}
            </td>

            <td
              v-if="canEdit || canDelete"
              class="actions"
            >
              <button
                v-if="canEdit"
                type="button"
                class="btn btn-secondary"
                @click="editGare(gare.id)"
              >
                Modifier
              </button>

              <button
                v-if="canDelete"
                type="button"
                class="btn btn-danger"
                :disabled="
                  deleting === gare.id
                "
                @click="removeGare(gare)"
              >
                {{
                  deleting === gare.id
                    ? 'Suppression...'
                    : 'Supprimer'
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucune gare -->
    <div
      v-else
      class="empty-state"
    >
      <h2>Aucune gare</h2>

      <p>
        Aucune gare n'est actuellement
        enregistrée.
      </p>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createGare"
      >
        Créer la première gare
      </button>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  margin: 6px 0 0;
  color: #6b7280;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.alert-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.table-container {
  overflow-x: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

th {
  background: #f9fafb;
  font-size: 13px;
  color: #374151;
}

tbody tr:hover {
  background: #f9fafb;
}

.actions-column {
  min-width: 190px;
}

.actions {
  display: flex;
  gap: 8px;
}

.status {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.btn {
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.empty-state h2 {
  margin-bottom: 8px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
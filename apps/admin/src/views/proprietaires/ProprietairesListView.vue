<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';

import {
  deleteProprietaire,
  getProprietaires,
} from '../../api/proprietaires.api';

import type {
  Proprietaire,
} from '../../types/proprietaire.types';

const router = useRouter();
const authStore = useAuthStore();

const proprietaires =
  ref<Proprietaire[]>([]);

const loading = ref(false);
const deleting =
  ref<string | null>(null);

const errorMessage = ref('');
const successMessage = ref('');

const userRole = computed(
  () => authStore.user?.role ?? null,
);

/**
 * Droits frontend.
 *
 * La sécurité réelle reste côté backend.
 */
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
 * Chargement des propriétaires.
 */
async function loadProprietaires(): Promise<void> {
  loading.value = true;

  errorMessage.value = '';
  successMessage.value = '';

  try {
    proprietaires.value =
      await getProprietaires();
  } catch (error: any) {
    console.error(
      'Erreur lors du chargement des propriétaires :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger les propriétaires.';
  } finally {
    loading.value = false;
  }
}

/**
 * Création.
 */
function createProprietaire(): void {
  router.push({
    name: 'proprietaire-create',
  });
}

/**
 * Modification.
 */
function editProprietaire(
  id: string,
): void {
  router.push({
    name: 'proprietaire-edit',
    params: { id },
  });
}

/**
 * Suppression.
 */
async function removeProprietaire(
  proprietaire: Proprietaire,
): Promise<void> {
  const fullName =
    `${proprietaire.prenom} ${proprietaire.nom}`;

  const confirmed =
    window.confirm(
      `Voulez-vous vraiment supprimer le propriétaire "${fullName}" ?`,
    );

  if (!confirmed) {
    return;
  }

  deleting.value =
    proprietaire.id;

  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteProprietaire(
      proprietaire.id,
    );

    proprietaires.value =
      proprietaires.value.filter(
        (item) =>
          item.id !== proprietaire.id,
      );

    successMessage.value =
      'Le propriétaire a été supprimé avec succès.';
  } catch (error: any) {
    console.error(
      'Erreur lors de la suppression du propriétaire :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de supprimer ce propriétaire.';
  } finally {
    deleting.value = null;
  }
}

/**
 * Date d'affichage.
 */
function formatDate(
  value: string,
): string {
  if (!value) {
    return '-';
  }

  return new Date(
    value,
  ).toLocaleDateString('fr-CA');
}

onMounted(() => {
  loadProprietaires();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>Propriétaires</h1>

        <p class="subtitle">
          Gestion des propriétaires de véhicules.
        </p>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createProprietaire"
      >
        + Nouveau propriétaire
      </button>
    </div>

    <!-- Succès -->
    <div
      v-if="successMessage"
      class="alert alert-success"
    >
      {{ successMessage }}
    </div>

    <!-- Erreur -->
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
      Chargement des propriétaires...
    </div>

    <!-- Liste -->
    <div
      v-else-if="proprietaires.length > 0"
      class="table-container"
    >
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Type de pièce</th>
            <th>Numéro de pièce</th>
            <th>Statut</th>
            <th>Véhicules</th>
            <th>Créé le</th>

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
            v-for="
              proprietaire in proprietaires
            "
            :key="proprietaire.id"
          >
            <td>
              <strong>
                {{ proprietaire.prenom }}
                {{ proprietaire.nom }}
              </strong>
            </td>

            <td>
              {{
                proprietaire.telephone ||
                '-'
              }}
            </td>

            <td>
              {{
                proprietaire.typePieceIdentite ||
                '-'
              }}
            </td>

            <td>
              {{
                proprietaire.numeroPieceIdentite ||
                '-'
              }}
            </td>

            <td>
              <span
                class="status"
                :class="{
                  'status-active':
                    proprietaire.statut ===
                    'ACTIF',

                  'status-inactive':
                    proprietaire.statut !==
                    'ACTIF',
                }"
              >
                {{ proprietaire.statut }}
              </span>
            </td>

            <td>
              {{
                proprietaire.vehicules?.length ??
                0
              }}
            </td>

            <td>
              {{
                formatDate(
                  proprietaire.createdAt,
                )
              }}
            </td>

            <td
              v-if="canEdit || canDelete"
              class="actions"
            >
              <button
                v-if="canEdit"
                type="button"
                class="btn btn-secondary"
                @click="
                  editProprietaire(
                    proprietaire.id,
                  )
                "
              >
                Modifier
              </button>

              <button
                v-if="canDelete"
                type="button"
                class="btn btn-danger"
                :disabled="
                  deleting ===
                  proprietaire.id
                "
                @click="
                  removeProprietaire(
                    proprietaire,
                  )
                "
              >
                {{
                  deleting ===
                  proprietaire.id
                    ? 'Suppression...'
                    : 'Supprimer'
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucun propriétaire -->
    <div
      v-else
      class="empty-state"
    >
      <h2>
        Aucun propriétaire
      </h2>

      <p>
        Aucun propriétaire n'est
        actuellement enregistré.
      </p>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createProprietaire"
      >
        Créer le premier propriétaire
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
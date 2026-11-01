<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1>Utilisateurs</h1>
        <p class="page-description">
          Gestion des comptes utilisateurs de la plateforme.
        </p>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn-primary"
        @click="goToCreate"
      >
        + Nouvel utilisateur
      </button>
    </div>

    <!-- ERROR -->
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>

    <!-- SUCCESS -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <!-- FILTERS -->
    <section class="filters-card">
      <div class="filter-group">
        <label for="search">Recherche</label>

        <input
          id="search"
          v-model="search"
          type="text"
          placeholder="Nom, prénom, username ou email..."
        />
      </div>

      <div class="filter-group">
        <label for="role-filter">Rôle</label>

        <select id="role-filter" v-model="roleFilter">
          <option value="">Tous les rôles</option>

          <option
            v-for="role in roles"
            :key="role"
            :value="role"
          >
            {{ role }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status-filter">Statut</label>

        <select id="status-filter" v-model="statusFilter">
          <option value="">Tous</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="blocked">Bloqués</option>
        </select>
      </div>

      <button
        type="button"
        class="btn-secondary"
        @click="resetFilters"
      >
        Réinitialiser
      </button>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      Chargement des utilisateurs...
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="filteredUtilisateurs.length === 0"
      class="empty-state"
    >
      <h2>Aucun utilisateur trouvé</h2>

      <p>
        Aucun utilisateur ne correspond aux critères sélectionnés.
      </p>

      <button
        v-if="canCreate"
        type="button"
        class="btn-primary"
        @click="goToCreate"
      >
        Créer un utilisateur
      </button>
    </div>

    <!-- TABLE -->
    <section v-else class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Gare</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="utilisateur in filteredUtilisateurs"
              :key="utilisateur.id"
            >
              <!-- UTILISATEUR -->
              <td>
                <div class="user-cell">
                  <strong>
                    {{ utilisateur.prenom }}
                    {{ utilisateur.nom }}
                  </strong>

                  <span>
                    @{{ utilisateur.username }}
                  </span>
                </div>
              </td>

              <!-- EMAIL -->
              <td>
                {{ utilisateur.email }}
              </td>

              <!-- ROLE -->
              <td>
                <span class="role-badge">
                  {{ utilisateur.role?.libelle ?? utilisateur.role?.code ?? '—' }}
                </span>
              </td>

              <!-- GARE -->
              <td>
                <span v-if="utilisateur.gare">
                  {{ utilisateur.gare.code }}
                  —
                  {{ utilisateur.gare.nom }}
                </span>

                <span v-else>
                  Aucune gare
                </span>
              </td>

              <!-- STATUT -->
              <td>
                <div class="status-list">
                  <span
                    class="status-badge"
                    :class="utilisateur.actif ? 'status-active' : 'status-inactive'"
                  >
                    {{ utilisateur.actif ? 'Actif' : 'Inactif' }}
                  </span>

                  <span
                    v-if="utilisateur.bloque"
                    class="status-badge status-blocked"
                  >
                    Bloqué
                  </span>
                </div>
              </td>

              <!-- DATE -->
              <td>
                {{ formatDate(utilisateur.createdAt) }}
              </td>

              <!-- ACTIONS -->
              <td class="actions-column">
                <div class="actions">
                  <button
                    type="button"
                    class="btn-small btn-edit"
                    @click="editUtilisateur(utilisateur.id)"
                  >
                    Modifier
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TOTAL -->
    <div v-if="!loading" class="results-summary">
      {{ filteredUtilisateurs.length }}
      utilisateur(s) affiché(s)
      sur
      {{ utilisateurs.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import { useRouter } from 'vue-router';

import { getUtilisateurs } from '../../api/utilisateurs.api';

import { useAuthStore } from '../../auth/auth.store';

import type { Utilisateur } from '../../types/utilisateur.types';

const router = useRouter();
const authStore = useAuthStore();

/* =====================================================
 * STATE
 * ===================================================== */

const utilisateurs = ref<Utilisateur[]>([]);

const loading = ref(true);

const errorMessage = ref('');

const successMessage = ref('');

const search = ref('');

const roleFilter = ref('');

const statusFilter = ref('');

/* =====================================================
 * PERMISSIONS UI
 * ===================================================== */

const canCreate = computed(() => {
  return (
    authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE'
  );
});

/* =====================================================
 * ROLES DISPONIBLES
 * ===================================================== */

const roles = computed(() => {
  const uniqueRoles = new Set<string>();

  utilisateurs.value.forEach((utilisateur) => {
    const roleCode = utilisateur.role?.code;

    if (roleCode) {
      uniqueRoles.add(roleCode);
    }
  });

  return Array.from(uniqueRoles).sort();
});

/* =====================================================
 * FILTER
 * ===================================================== */

const filteredUtilisateurs = computed(() => {
  const normalizedSearch = search.value
    .trim()
    .toLowerCase();

  return utilisateurs.value.filter((utilisateur) => {
    const matchesSearch =
      !normalizedSearch ||
      utilisateur.username
        .toLowerCase()
        .includes(normalizedSearch) ||
      utilisateur.email
        .toLowerCase()
        .includes(normalizedSearch) ||
      utilisateur.nom
        .toLowerCase()
        .includes(normalizedSearch) ||
      utilisateur.prenom
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesRole =
      !roleFilter.value ||
      utilisateur.role?.code === roleFilter.value;

    let matchesStatus = true;

    if (statusFilter.value === 'active') {
      matchesStatus =
        utilisateur.actif &&
        !utilisateur.bloque;
    }

    if (statusFilter.value === 'inactive') {
      matchesStatus =
        !utilisateur.actif;
    }

    if (statusFilter.value === 'blocked') {
      matchesStatus =
        utilisateur.bloque;
    }

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    );
  });
});

/* =====================================================
 * LOAD
 * ===================================================== */

async function loadUtilisateurs() {
  loading.value = true;
  errorMessage.value = '';

  try {
    utilisateurs.value =
      await getUtilisateurs();
  } catch (error: unknown) {
    console.error(
      'Erreur chargement utilisateurs:',
      error,
    );

    errorMessage.value =
      extractApiError(
        error,
        'Impossible de charger les utilisateurs.',
      );
  } finally {
    loading.value = false;
  }
}

/* =====================================================
 * NAVIGATION
 * ===================================================== */

function goToCreate() {
  router.push({
    name: 'utilisateur-create',
  });
}

function editUtilisateur(id: number) {
  router.push({
    name: 'utilisateur-edit',
    params: {
      id,
    },
  });
}

/* =====================================================
 * FILTER RESET
 * ===================================================== */

function resetFilters() {
  search.value = '';
  roleFilter.value = '';
  statusFilter.value = '';
}

/* =====================================================
 * DATE
 * ===================================================== */

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      dateStyle: 'short',
    },
  ).format(date);
}

/* =====================================================
 * API ERROR
 * ===================================================== */

function extractApiError(
  error: unknown,
  fallback: string,
): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const responseMessage =
    err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  return fallback;
}

/* =====================================================
 * INIT
 * ===================================================== */

onMounted(() => {
  loadUtilisateurs();
});
</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
}

.page-description {
  margin: 0;
  color: #666;
}

.filters-card {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
}

input,
select {
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.btn-primary,
.btn-secondary,
.btn-small {
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  padding: 11px 18px;
  background: #2563eb;
  color: white;
}

.btn-secondary {
  padding: 10px 16px;
  background: #e5e7eb;
  color: #111827;
}

.btn-small {
  padding: 7px 10px;
  font-size: 12px;
}

.btn-edit {
  background: #e5e7eb;
  color: #111827;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
}

.loading-state,
.empty-state {
  padding: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
}

.empty-state h2 {
  margin-top: 0;
}

.table-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid #eee;
  text-align: left;
  white-space: nowrap;
}

th {
  background: #f8fafc;
  font-size: 13px;
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.user-cell span {
  font-size: 12px;
  color: #666;
}

.role-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge {
  background: #e0e7ff;
  color: #3730a3;
}

.status-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.status-blocked {
  background: #fee2e2;
  color: #991b1b;
}

.actions-column {
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.results-summary {
  margin-top: 12px;
  color: #666;
  font-size: 13px;
}

@media (max-width: 900px) {
  .page-header,
  .filters-card {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-column {
    text-align: left;
  }
}
</style>
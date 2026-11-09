
<template>
  <section class="page">
    <!-- FIL D'ARIANE -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <strong>Utilisateurs</strong>
    </div>

    <!-- EN-TÊTE -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
        </div>

        <div>
          <h1>Gestion des utilisateurs</h1>
          <p>
            Administration et pilotage des comptes de la plateforme FOPTRAC.
          </p>
        </div>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="goToCreate"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nouvel utilisateur
      </button>
    </header>

    <!-- MESSAGES -->
    <div v-if="errorMessage" class="alert alert-error" role="alert">
      <span class="alert-icon">!</span>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="alert alert-success" role="status">
      <span class="alert-icon">✓</span>
      <p>{{ successMessage }}</p>
    </div>

    <!-- FILTRES -->
    <section class="filters-card">
      <div class="filter-group search-group">
        <label for="search">Rechercher un utilisateur</label>

        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            id="search"
            v-model="search"
            type="text"
            placeholder="Nom, prénom, username ou email..."
          />
        </div>
      </div>

      <div class="filter-group">
        <label for="role-filter">Rôle</label>
        <select id="role-filter" v-model="roleFilter">
          <option value="">Tous les rôles</option>
          <option v-for="role in roles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="blocked">Bloqués</option>
        </select>
      </div>

      <button
        type="button"
        class="btn btn-secondary reset-button"
        @click="resetFilters"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Réinitialiser
      </button>
    </section>

    <!-- CHARGEMENT -->
    <div v-if="loading" class="loading-card">
      <div class="spinner"></div>
      <p>Chargement des utilisateurs...</p>
    </div>

    <!-- ÉTAT VIDE -->
    <div
      v-else-if="filteredUtilisateurs.length === 0"
      class="empty-card"
    >
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4M8 11h6" />
        </svg>
      </div>

      <h2>Aucun utilisateur trouvé</h2>
      <p>Aucun compte ne correspond aux filtres sélectionnés.</p>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="goToCreate"
      >
        Créer un utilisateur
      </button>

      <button
        v-else
        type="button"
        class="btn btn-secondary"
        @click="resetFilters"
      >
        Réinitialiser les filtres
      </button>
    </div>

    <!-- TABLEAU -->
    <section v-else class="table-card">
      <div class="table-heading">
        <div>
          <h2>Liste des utilisateurs</h2>
          <p>Comptes enregistrés sur la plateforme.</p>
        </div>

        <span class="count-badge">
          {{ filteredUtilisateurs.length }} résultat(s)
        </span>
      </div>

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
              <td>
                <div class="user-cell">
                  <div class="user-avatar">
                    {{ (utilisateur.prenom?.charAt(0) || '') +
                      (utilisateur.nom?.charAt(0) || '') }}
                  </div>

                  <div class="user-info">
                    <strong>
                      {{ utilisateur.prenom }} {{ utilisateur.nom }}
                    </strong>
                    <span>@{{ utilisateur.username }}</span>
                  </div>
                </div>
              </td>

              <td class="email-cell">
                {{ utilisateur.email }}
              </td>

              <td>
                <span class="role-badge">
                  {{
                    utilisateur.role?.libelle ??
                    utilisateur.role?.code ??
                    '—'
                  }}
                </span>
              </td>

              <td>
                <span v-if="utilisateur.gare" class="gare-text">
                  {{ utilisateur.gare.code }} — {{ utilisateur.gare.nom }}
                </span>
                <span v-else class="text-muted">Aucune gare</span>
              </td>

              <td>
                <div class="status-list">
                  <span
                    class="status-badge"
                    :class="
                      utilisateur.actif
                        ? 'status-active'
                        : 'status-inactive'
                    "
                  >
                    <span class="status-dot"></span>
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

              <td class="date-cell">
                {{ formatDate(utilisateur.createdAt) }}
              </td>

              <td class="actions-column">
                <div class="actions">
                  <button
                    type="button"
                    class="btn btn-action btn-edit"
                    title="Modifier cet utilisateur"
                    @click="editUtilisateur(utilisateur.id)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                    </svg>
                    Modifier
                  </button>

                  <button
                    v-if="canDelete"
                    type="button"
                    class="btn btn-action btn-delete"
                    :disabled="deletingId !== null"
                    title="Supprimer cet utilisateur"
                    @click="handleDelete(utilisateur)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>

                    {{
                      deletingId === utilisateur.id
                        ? 'Suppression...'
                        : 'Supprimer'
                    }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- RÉSUMÉ -->
    <div v-if="!loading" class="results-summary">
      Affichage de
      <strong>{{ filteredUtilisateurs.length }}</strong>
      utilisateur(s) sur un total de
      <strong>{{ utilisateurs.length }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  deleteUtilisateur,
  getUtilisateurs,
} from '../../api/utilisateurs.api';

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
const deletingId = ref<number | null>(null);

/* =====================================================
 * PERMISSIONS UI
 * ===================================================== */

const canCreate = computed(() => {
  return (
    authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE'
  );
});

const canDelete = computed(() => authStore.role === 'ADMIN');

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
  const normalizedSearch = search.value.trim().toLowerCase();

  return utilisateurs.value.filter((utilisateur) => {
    const matchesSearch =
      !normalizedSearch ||
      (utilisateur.username ?? '').toLowerCase().includes(normalizedSearch) ||
      (utilisateur.email ?? '').toLowerCase().includes(normalizedSearch) ||
      (utilisateur.nom ?? '').toLowerCase().includes(normalizedSearch) ||
      (utilisateur.prenom ?? '').toLowerCase().includes(normalizedSearch);

    const matchesRole =
      !roleFilter.value ||
      utilisateur.role?.code === roleFilter.value;

    let matchesStatus = true;

    if (statusFilter.value === 'active') {
      matchesStatus = utilisateur.actif && !utilisateur.bloque;
    } else if (statusFilter.value === 'inactive') {
      matchesStatus = !utilisateur.actif;
    } else if (statusFilter.value === 'blocked') {
      matchesStatus = utilisateur.bloque;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });
});

/* =====================================================
 * LOAD
 * ===================================================== */

async function loadUtilisateurs(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getUtilisateurs();
    utilisateurs.value = Array.isArray(response) ? response : [];
  } catch (error: unknown) {
    console.error('Erreur chargement utilisateurs:', error);

    errorMessage.value = extractApiError(
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

function goToCreate(): void {
  router.push({ name: 'utilisateur-create' });
}

function editUtilisateur(id: number): void {
  router.push({
    name: 'utilisateur-edit',
    params: { id },
  });
}

/* =====================================================
 * DELETE
 * ===================================================== */

async function handleDelete(utilisateur: Utilisateur): Promise<void> {
  if (!canDelete.value || deletingId.value !== null) {
    return;
  }

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le compte de ${utilisateur.prenom} ${utilisateur.nom} (@${utilisateur.username}) ?`,
  );

  if (!confirmed) {
    return;
  }

  deletingId.value = utilisateur.id;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteUtilisateur(utilisateur.id);

    utilisateurs.value = utilisateurs.value.filter(
      (item) => item.id !== utilisateur.id,
    );

    successMessage.value =
      `L'utilisateur « ${utilisateur.username} » a été supprimé.`;
  } catch (error: unknown) {
    console.error('Erreur suppression utilisateur:', error);

    errorMessage.value = extractApiError(
      error,
      "Impossible de supprimer cet utilisateur. Vérifiez vos droits et les contraintes liées à ce compte.",
    );
  } finally {
    deletingId.value = null;
  }
}

/* =====================================================
 * FILTER RESET
 * ===================================================== */

function resetFilters(): void {
  search.value = '';
  roleFilter.value = '';
  statusFilter.value = '';
}

/* =====================================================
 * DATE
 * ===================================================== */

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'short',
  }).format(date);
}

/* =====================================================
 * API ERROR
 * ===================================================== */

function extractApiError(error: unknown, fallback: string): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const responseMessage = err?.response?.data?.message;

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
  void loadUtilisateurs();
});
</script>

<style scoped>
/* =====================================================
   PAGE
===================================================== */

.page {
  width: 100%;
  max-width: 1350px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  box-sizing: border-box;
  color: #243247;
}

/* =====================================================
   BREADCRUMB
===================================================== */

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 20px;
  color: #8a94a4;
  font-size: 12px;
}

.breadcrumb .separator {
  color: #c5a13b;
}

.breadcrumb strong {
  color: #17365d;
  font-weight: 700;
}

/* =====================================================
   HEADER
===================================================== */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-icon {
  display: grid;
  place-items: center;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #17365d;
  color: #e2c16b;
}

.header-icon svg {
  width: 27px;
  height: 27px;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 6px 0 0;
  color: #7b8797;
  font-size: 13px;
  line-height: 1.5;
}

/* =====================================================
   BUTTONS
===================================================== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
  white-space: nowrap;
}

.btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #17365d;
  color: #ffffff;
  box-shadow: 0 3px 8px rgb(23 54 93 / 14%);
}

.btn-primary:hover:not(:disabled) {
  background: #234a78;
  transform: translateY(-1px);
}

.btn-secondary {
  border-color: #dfe5ed;
  background: #ffffff;
  color: #536174;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #c5a13b;
  color: #17365d;
  background: #fdfbf5;
}

/* =====================================================
   FILTERS
===================================================== */

.filters-card {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 22px 24px;
  margin-bottom: 22px;
  background: #ffffff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgb(25 42 70 / 4%);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-width: 0;
}

.search-group {
  flex: 2;
}

.filter-group label {
  color: #394a60;
  font-size: 12px;
  font-weight: 700;
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper svg {
  position: absolute;
  top: 50%;
  left: 12px;
  width: 17px;
  height: 17px;
  color: #929eae;
  transform: translateY(-50%);
  pointer-events: none;
}

input,
select {
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #dce2e9;
  border-radius: 7px;
  outline: none;
  background: #ffffff;
  color: #293b52;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-wrapper input {
  padding-left: 38px;
}

input::placeholder {
  color: #a5adba;
}

input:focus,
select:focus {
  border-color: #c5a13b;
  box-shadow: 0 0 0 3px rgb(197 161 59 / 13%);
}

.reset-button {
  flex-shrink: 0;
}

/* =====================================================
   TABLE CARD
===================================================== */

.table-card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgb(25 42 70 / 4%);
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 19px 22px;
  border-bottom: 1px solid #edf0f4;
}

.table-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 15px;
  font-weight: 750;
}

.table-heading p {
  margin: 5px 0 0;
  color: #8792a1;
  font-size: 12px;
}

.count-badge {
  padding: 6px 11px;
  border: 1px solid #e8dfc5;
  border-radius: 20px;
  background: #fcfaf4;
  color: #8b7029;
  font-size: 11px;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px 18px;
  border-bottom: 1px solid #edf0f4;
  font-size: 12px;
  vertical-align: middle;
}

th {
  background: #f8fafc;
  color: #475569;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover td {
  background: #fcfdfd;
}

/* =====================================================
   USER
===================================================== */

.user-cell {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 175px;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid #e8dfc5;
  border-radius: 50%;
  background: #fcfaf4;
  color: #8b7029;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info strong {
  color: #1e293b;
  font-size: 12px;
  font-weight: 700;
}

.user-info span {
  color: #8b95a4;
  font-size: 11px;
}

.email-cell {
  color: #475569;
  white-space: nowrap;
}

.gare-text {
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
}

.text-muted {
  color: #94a3b8;
  font-style: italic;
  white-space: nowrap;
}

.date-cell {
  color: #64748b;
  white-space: nowrap;
}

/* =====================================================
   ROLE
===================================================== */

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  background: #f1f5f9;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

/* =====================================================
   STATUS
===================================================== */

.status-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 750;
  white-space: nowrap;
}

.status-active {
  background: #ecfdf5;
  color: #087443;
}

.status-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.status-blocked {
  background: #fef2f2;
  color: #dc2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* =====================================================
   ACTIONS
===================================================== */

.actions-column {
  text-align: right;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.btn-action {
  min-height: 32px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
}

.btn-action svg {
  width: 14px;
  height: 14px;
}

.btn-edit {
  border: 1px solid #dce2e9;
  background: #ffffff;
  color: #334155;
}

.btn-edit:hover {
  border-color: #17365d;
  background: #f3f6fa;
  color: #17365d;
}

.btn-delete {
  border: 1px solid #fee2e2;
  background: #fff7f7;
  color: #dc2626;
}

.btn-delete:hover:not(:disabled) {
  border-color: #fca5a5;
  background: #fee2e2;
}

/* =====================================================
   ALERTS
===================================================== */

.alert {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 20px;
  padding: 13px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13px;
}

.alert p {
  flex: 1;
  margin: 0;
  line-height: 1.5;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
}

.alert-error {
  border-color: #f1c3c3;
  background: #fff2f2;
  color: #a33434;
}

.alert-success {
  border-color: #b8dfc6;
  background: #eff8f1;
  color: #256c43;
}

/* =====================================================
   LOADING AND EMPTY STATES
===================================================== */

.loading-card,
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 40px;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
  color: #8792a1;
  font-size: 13px;
  box-shadow: 0 3px 12px rgb(25 42 70 / 4%);
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 14px;
  border-radius: 15px;
  background: #f1f4f8;
  color: #17365d;
}

.empty-icon svg {
  width: 30px;
  height: 30px;
}

.empty-card h2 {
  margin: 0 0 7px;
  color: #17365d;
  font-size: 18px;
}

.empty-card p {
  margin: 0 0 20px;
  color: #7b8797;
}

.spinner {
  width: 31px;
  height: 31px;
  margin-bottom: 12px;
  border: 3px solid #e7ebf1;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   RESULTS SUMMARY
===================================================== */

.results-summary {
  margin-top: 14px;
  padding-left: 4px;
  color: #64748b;
  font-size: 12px;
}

.results-summary strong {
  color: #17365d;
  font-weight: 750;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .filters-card {
    flex-wrap: wrap;
  }

  .search-group {
    flex: 1 1 100%;
  }

  .filter-group:not(.search-group) {
    flex: 1 1 180px;
  }
}

@media (max-width: 900px) {
  .page {
    padding: 24px 20px 35px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header > .btn {
    width: 100%;
  }

  .filters-card {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .filter-group,
  .filter-group:not(.search-group) {
    flex: 1 1 auto;
  }

  .reset-button {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .page {
    padding: 20px 14px 30px;
  }

  .header-content {
    align-items: flex-start;
    gap: 12px;
  }

  .header-icon {
    width: 46px;
    height: 46px;
  }

  .header-icon svg {
    width: 23px;
    height: 23px;
  }

  .page-header h1 {
    font-size: 21px;
  }

  .page-header p {
    font-size: 12px;
  }

  .filters-card {
    padding: 17px;
  }

  .table-heading {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }

  .table-wrapper table {
    min-width: 1050px;
  }

  .empty-card,
  .loading-card {
    min-height: 230px;
    padding: 25px 16px;
  }
}
</style>

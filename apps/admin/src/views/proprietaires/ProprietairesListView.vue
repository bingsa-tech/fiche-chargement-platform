
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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

const proprietaires = ref<Proprietaire[]>([]);
const loading = ref(false);
const deleting = ref<string | null>(null);

const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');

const userRole = computed(
  () => authStore.user?.role ?? null,
);

// Droits frontend : le backend reste responsable
// de la sécurité réelle.
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

// Recherche
const filteredProprietaires = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return proprietaires.value;

  return proprietaires.value.filter((proprietaire) => {
    const searchable = [
      proprietaire.nom,
      proprietaire.prenom,
      proprietaire.telephone,
      proprietaire.typePieceIdentite,
      proprietaire.numeroPieceIdentite,
      proprietaire.statut,
    ];

    return searchable.some((value) =>
      String(value ?? '').toLowerCase().includes(query),
    );
  });
});

// Statistiques
const totalProprietaires = computed(
  () => proprietaires.value.length,
);

const proprietairesActifs = computed(
  () =>
    proprietaires.value.filter(
      (item) => item.statut === 'ACTIF',
    ).length,
);

const proprietairesInactifs = computed(
  () =>
    proprietaires.value.filter(
      (item) => item.statut !== 'ACTIF',
    ).length,
);

const totalVehicules = computed(
  () =>
    proprietaires.value.reduce(
      (total, item) => total + (item.vehicules?.length ?? 0),
      0,
    ),
);

// Chargement
async function loadProprietaires(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    proprietaires.value = await getProprietaires();
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

// Navigation
function createProprietaire(): void {
  router.push({ name: 'proprietaire-create' });
}

function editProprietaire(id: string): void {
  router.push({
    name: 'proprietaire-edit',
    params: { id },
  });
}

// Suppression
async function removeProprietaire(
  proprietaire: Proprietaire,
): Promise<void> {
  const fullName =
    `${proprietaire.prenom} ${proprietaire.nom}`;

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le propriétaire "${fullName}" ?`,
  );

  if (!confirmed) return;

  deleting.value = proprietaire.id;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteProprietaire(proprietaire.id);

    proprietaires.value = proprietaires.value.filter(
      (item) => item.id !== proprietaire.id,
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

// Présentation
function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-CA');
}

function getInitials(proprietaire: Proprietaire): string {
  const first = proprietaire.prenom?.charAt(0) ?? '';
  const last = proprietaire.nom?.charAt(0) ?? '';

  return `${first}${last}`.toUpperCase() || 'P';
}

onMounted(loadProprietaires);
</script>

<template>
  <section class="page">
    <!-- Fil d'Ariane -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <span class="current">Propriétaires</span>
    </div>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">♙</div>

        <div>
          <h1>Propriétaires</h1>
          <p class="subtitle">
            Gestion des propriétaires de véhicules.
          </p>
        </div>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createProprietaire"
      >
        <span class="plus-icon">+</span>
        Nouveau propriétaire
      </button>
    </header>

    <!-- Messages -->
    <div
      v-if="successMessage"
      class="alert alert-success"
      role="status"
    >
      <span>{{ successMessage }}</span>
      <button
        type="button"
        aria-label="Fermer"
        @click="successMessage = ''"
      >
        ×
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="alert alert-error"
      role="alert"
    >
      <span>{{ errorMessage }}</span>
      <button
        type="button"
        aria-label="Fermer"
        @click="errorMessage = ''"
      >
        ×
      </button>
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon navy">♙</div>
        <div>
          <span class="stat-label">Total propriétaires</span>
          <strong>{{ totalProprietaires }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">✓</div>
        <div>
          <span class="stat-label">Propriétaires actifs</span>
          <strong>{{ proprietairesActifs }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gray">○</div>
        <div>
          <span class="stat-label">Propriétaires inactifs</span>
          <strong>{{ proprietairesInactifs }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold">▣</div>
        <div>
          <span class="stat-label">Véhicules associés</span>
          <strong>{{ totalVehicules }}</strong>
        </div>
      </article>
    </div>

    <!-- Liste -->
    <div class="content-card">
      <div class="content-header">
        <div>
          <h2>Liste des propriétaires</h2>
          <p>
            Consultez et gérez les propriétaires enregistrés.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-refresh"
          :disabled="loading"
          @click="loadProprietaires"
        >
          <span :class="{ rotating: loading }">↻</span>
          Actualiser
        </button>
      </div>

      <!-- Recherche -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher par nom, téléphone ou pièce d'identité..."
            aria-label="Rechercher un propriétaire"
          />

          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Effacer la recherche"
            @click="searchQuery = ''"
          >
            ×
          </button>
        </div>

        <span class="result-count">
          {{ filteredProprietaires.length }}
          résultat(s)
        </span>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        <p>Chargement des propriétaires...</p>
      </div>

      <!-- Tableau -->
      <div
        v-else-if="filteredProprietaires.length > 0"
        class="table-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th>Propriétaire</th>
              <th>Téléphone</th>
              <th>Type de pièce</th>
              <th>Numéro de pièce</th>
              <th>Statut</th>
              <th>Véhicules</th>
              <th>Créé le</th>
              <th v-if="canEdit || canDelete" class="actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="proprietaire in filteredProprietaires"
              :key="proprietaire.id"
            >
              <td>
                <div class="owner-cell">
                  <div class="avatar">
                    {{ getInitials(proprietaire) }}
                  </div>

                  <div class="owner-info">
                    <strong>
                      {{ proprietaire.prenom }}
                      {{ proprietaire.nom }}
                    </strong>
                    <small>
                      Réf. {{ proprietaire.id.slice(0, 8) }}
                    </small>
                  </div>
                </div>
              </td>

              <td>
                {{ proprietaire.telephone || '—' }}
              </td>

              <td>
                {{ proprietaire.typePieceIdentite || '—' }}
              </td>

              <td>
                <span
                  v-if="proprietaire.numeroPieceIdentite"
                  class="identity-number"
                >
                  {{ proprietaire.numeroPieceIdentite }}
                </span>
                <span v-else>—</span>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="
                    proprietaire.statut === 'ACTIF'
                      ? 'status-active'
                      : 'status-inactive'
                  "
                >
                  {{ proprietaire.statut }}
                </span>
              </td>

              <td>
                <span class="vehicle-count">
                  {{ proprietaire.vehicules?.length ?? 0 }}
                </span>
              </td>

              <td class="date-cell">
                {{ formatDate(proprietaire.createdAt) }}
              </td>

              <td
                v-if="canEdit || canDelete"
                class="actions-cell"
              >
                <button
                  v-if="canEdit"
                  type="button"
                  class="action-btn edit-btn"
                  title="Modifier"
                  @click="editProprietaire(proprietaire.id)"
                >
                  Modifier
                </button>

                <button
                  v-if="canDelete"
                  type="button"
                  class="action-btn delete-btn"
                  :disabled="deleting === proprietaire.id"
                  title="Supprimer"
                  @click="removeProprietaire(proprietaire)"
                >
                  {{
                    deleting === proprietaire.id
                      ? 'Suppression...'
                      : 'Supprimer'
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Aucun résultat -->
      <div v-else class="empty-state">
        <div class="empty-icon">♙</div>

        <h3>
          {{
            searchQuery
              ? 'Aucun résultat trouvé'
              : 'Aucun propriétaire enregistré'
          }}
        </h3>

        <p>
          {{
            searchQuery
              ? 'Aucun propriétaire ne correspond à votre recherche.'
              : 'Les propriétaires enregistrés apparaîtront ici.'
          }}
        </p>

        <button
          v-if="searchQuery"
          type="button"
          class="btn btn-secondary"
          @click="searchQuery = ''"
        >
          Effacer la recherche
        </button>

        <button
          v-else-if="canCreate"
          type="button"
          class="btn btn-primary"
          @click="createProprietaire"
        >
          + Créer le premier propriétaire
        </button>
      </div>

      <!-- Pied de tableau -->
      <footer
        v-if="!loading && filteredProprietaires.length > 0"
        class="table-footer"
      >
        <span>
          Affichage de {{ filteredProprietaires.length }}
          propriétaire(s) sur {{ totalProprietaires }}
        </span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  box-sizing: border-box;
  color: #243247;
}

/* Fil d'Ariane */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 20px;
  color: #8792a2;
  font-size: 13px;
}

.separator {
  color: #c4cad2;
}

.current {
  color: #17365d;
  font-weight: 600;
}

/* En-tête */
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
  color: #e2c16b;
  font-size: 27px;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  margin: 6px 0 0;
  color: #7b8797;
  font-size: 14px;
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 39px;
  padding: 9px 15px;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  border-color: #17365d;
  background: #17365d;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #102844;
}

.plus-icon {
  color: #e2c16b;
  font-size: 19px;
  line-height: 1;
}

.btn-refresh,
.btn-secondary {
  border-color: #dce2e9;
  background: #fff;
  color: #52647a;
}

.btn-refresh:hover:not(:disabled),
.btn-secondary:hover:not(:disabled) {
  border-color: #17365d;
  color: #17365d;
  background: #f5f7fa;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 94px;
  padding: 18px;
  box-sizing: border-box;
  border: 1px solid #e5e9ef;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(23 54 93 / 3%);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
}

.stat-icon.navy {
  background: #eaf0f7;
  color: #17365d;
}

.stat-icon.green {
  background: #e9f6ef;
  color: #28794e;
}

.stat-icon.gray {
  background: #f0f2f5;
  color: #667085;
}

.stat-icon.gold {
  background: #f8f2df;
  color: #9a792a;
}

.stat-label {
  display: block;
  margin-bottom: 5px;
  color: #8792a2;
  font-size: 12px;
}

.stat-card strong {
  color: #263b55;
  font-size: 23px;
  font-weight: 700;
}

/* Messages */
.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 13px;
}

.alert button {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 19px;
}

.alert-success {
  border: 1px solid #b9dfca;
  background: #eff8f2;
  color: #286744;
}

.alert-error {
  border: 1px solid #f2c9c6;
  background: #fff5f4;
  color: #963d38;
}

/* Carte principale */
.content-card {
  overflow: hidden;
  border: 1px solid #e5e9ef;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 3px 12px rgb(23 54 93 / 4%);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 21px 24px;
  border-bottom: 1px solid #edf0f4;
}

.content-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 17px;
  font-weight: 700;
}

.content-header p {
  margin: 5px 0 0;
  color: #8993a2;
  font-size: 12px;
}

.rotating {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

/* Recherche */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #edf0f4;
}

.search-box {
  display: flex;
  align-items: center;
  width: min(100%, 540px);
  min-height: 40px;
  padding: 0 11px;
  border: 1px solid #dce2e9;
  border-radius: 7px;
  background: #fff;
}

.search-box:focus-within {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 7%);
}

.search-icon {
  margin-right: 9px;
  color: #8a96a6;
  font-size: 20px;
}

.search-box input {
  width: 100%;
  min-width: 0;
  height: 38px;
  border: none;
  outline: none;
  background: transparent;
  color: #263b55;
  font-family: inherit;
  font-size: 13px;
}

.search-box input::placeholder {
  color: #aab3bf;
}

.clear-search {
  border: none;
  background: transparent;
  color: #7b8797;
  cursor: pointer;
  font-size: 19px;
}

.result-count {
  color: #8993a2;
  font-size: 12px;
  white-space: nowrap;
}

/* Tableau */
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead th {
  padding: 14px 16px;
  background: #f7f9fb;
  color: #52647a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.035em;
  text-transform: uppercase;
  white-space: nowrap;
}

tbody td {
  padding: 14px 16px;
  border-top: 1px solid #edf0f4;
  color: #526176;
  font-size: 13px;
  white-space: nowrap;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: #fafbfd;
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 190px;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eaf0f7;
  color: #17365d;
  font-size: 12px;
  font-weight: 800;
}

.owner-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.owner-info strong {
  color: #263b55;
  font-size: 13px;
  font-weight: 600;
}

.owner-info small {
  color: #9aa4b2;
  font-size: 10px;
}

.identity-number {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 5px;
  background: #f3f5f8;
  color: #52647a;
  font-size: 11px;
}

.date-cell {
  color: #7b8797;
  font-size: 12px;
}

.vehicle-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 27px;
  height: 25px;
  padding: 0 7px;
  border-radius: 6px;
  background: #f5f1e5;
  color: #8b702c;
  font-size: 12px;
  font-weight: 700;
}

/* Statut */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-active {
  background: #e9f6ef;
  color: #28794e;
}

.status-inactive {
  background: #f0f2f5;
  color: #667085;
}

/* Actions */
.actions-column {
  min-width: 165px;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 7px;
}

.action-btn {
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  transition: 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.edit-btn {
  border-color: #d7e1ee;
  background: #eef3f9;
  color: #17365d;
}

.edit-btn:hover {
  background: #dfe9f4;
}

.delete-btn {
  border-color: #f0d2d0;
  background: #fff3f2;
  color: #a3423c;
}

.delete-btn:hover:not(:disabled) {
  background: #fce4e2;
}

/* Chargement */
.loading-state {
  display: flex;
  min-height: 230px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: #8792a2;
  font-size: 13px;
}

.spinner {
  width: 25px;
  height: 25px;
  border: 3px solid #e7ebf0;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* État vide */
.empty-state {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 15px;
  border-radius: 50%;
  background: #f0f3f7;
  color: #8792a2;
  font-size: 27px;
}

.empty-state h3 {
  margin: 0;
  color: #263b55;
  font-size: 16px;
}

.empty-state p {
  margin: 8px 0 18px;
  color: #8993a2;
  font-size: 13px;
}

/* Pied de tableau */
.table-footer {
  padding: 13px 22px;
  border-top: 1px solid #edf0f4;
  background: #fafbfd;
  color: #8993a2;
  font-size: 11px;
}

/* Responsive */
@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .page {
    padding: 20px 16px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header > .btn {
    width: 100%;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .content-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
    padding: 15px 18px;
  }

  .search-box {
    width: 100%;
    box-sizing: border-box;
  }

  .result-count {
    align-self: flex-end;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    gap: 10px;
    min-height: 80px;
    padding: 12px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .stat-card strong {
    font-size: 19px;
  }

  .stat-label {
    font-size: 11px;
  }

  .actions-cell {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 420px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

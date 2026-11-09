
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

const userRole = computed(() => authStore.user?.role ?? null);

const canCreate = computed(() => userRole.value === 'ADMIN');

const canEdit = computed(
  () =>
    userRole.value === 'ADMIN' ||
    userRole.value === 'RESPONSABLE_GARE',
);

const canDelete = computed(() => userRole.value === 'ADMIN');

const totalGares = computed(() => gares.value.length);

const garesActives = computed(
  () => gares.value.filter((gare) => gare.statut === 'ACTIF').length,
);

const garesInactives = computed(
  () => gares.value.filter((gare) => gare.statut === 'INACTIF').length,
);

async function loadGares(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    gares.value = await getGares();
  } catch (error: any) {
    console.error('Erreur lors du chargement des gares :', error);

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger les gares.';
  } finally {
    loading.value = false;
  }
}

function createGare(): void {
  router.push({ name: 'gare-create' });
}

function editGare(id: string): void {
  router.push({
    name: 'gare-edit',
    params: { id },
  });
}

async function removeGare(gare: Gare): Promise<void> {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la gare "${gare.nom}" (${gare.code}) ?`,
  );

  if (!confirmed) return;

  deleting.value = gare.id;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await deleteGare(gare.id);

    gares.value = gares.value.filter(
      (item) => item.id !== gare.id,
    );

    successMessage.value = 'La gare a été supprimée avec succès.';
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la gare :', error);

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de supprimer cette gare.';
  } finally {
    deleting.value = null;
  }
}

function formatDate(value: string): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function getStatusClass(statut: string): string {
  return statut === 'ACTIF' ? 'status-active' : 'status-inactive';
}

onMounted(loadGares);
</script>

<template>
  <section class="page">
    <!-- En-tête -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <strong>Gares</strong>
    </div>

    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span class="icon">🚉</span>
        </div>

        <div>
          <h1>Gestion des gares</h1>
          <p class="subtitle">
            Administration et suivi des gares du réseau FOPTRAC.
          </p>
        </div>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="btn btn-primary"
        @click="createGare"
      >
        <span class="btn-icon">＋</span>
        Nouvelle gare
      </button>
    </header>

    <!-- Statistiques -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon stat-icon-blue">🚉</div>
        <div class="stat-content">
          <span class="stat-label">Total des gares</span>
          <strong class="stat-value">{{ totalGares }}</strong>
          <span class="stat-description">Gares enregistrées</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-green">✓</div>
        <div class="stat-content">
          <span class="stat-label">Gares actives</span>
          <strong class="stat-value">{{ garesActives }}</strong>
          <span class="stat-description">En service</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-gray">Ⅱ</div>
        <div class="stat-content">
          <span class="stat-label">Gares inactives</span>
          <strong class="stat-value">{{ garesInactives }}</strong>
          <span class="stat-description">Hors service</span>
        </div>
      </article>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="alert alert-success">
      <span>✓</span>
      <p>{{ successMessage }}</p>
      <button type="button" aria-label="Fermer" @click="successMessage = ''">
        ×
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-error">
      <span>⚠</span>
      <p>{{ errorMessage }}</p>
      <button type="button" aria-label="Fermer" @click="errorMessage = ''">
        ×
      </button>
    </div>

    <!-- Tableau -->
    <div class="content-card">
      <div class="card-header">
        <div>
          <h2>Liste des gares</h2>
          <p>Consultez les informations et les statuts des gares.</p>
        </div>

        <button
          type="button"
          class="btn btn-refresh"
          :disabled="loading"
          @click="loadGares"
        >
          <span :class="{ spinning: loading }">↻</span>
          Actualiser
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des gares...</p>
      </div>

      <div v-else-if="gares.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom de la gare</th>
              <th>Ville</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Créée le</th>
              <th v-if="canEdit || canDelete" class="actions-column">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="gare in gares" :key="gare.id">
              <td>
                <span class="code-badge">{{ gare.code }}</span>
              </td>

              <td>
                <div class="gare-name">
                  <span class="gare-avatar">
                    {{ gare.nom?.charAt(0)?.toUpperCase() || 'G' }}
                  </span>
                  <strong>{{ gare.nom }}</strong>
                </div>
              </td>

              <td>{{ gare.ville }}</td>

              <td class="address-cell">
                {{ gare.adresse || '—' }}
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="getStatusClass(gare.statut)"
                >
                  <span class="status-dot"></span>
                  {{ gare.statut }}
                </span>
              </td>

              <td class="date-cell">
                {{ formatDate(gare.createdAt) }}
              </td>

              <td v-if="canEdit || canDelete" class="actions-cell">
                <div class="actions">
                  <button
                    v-if="canEdit"
                    type="button"
                    class="action-btn action-edit"
                    title="Modifier la gare"
                    @click="editGare(gare.id)"
                  >
                    <span>✎</span>
                    Modifier
                  </button>

                  <button
                    v-if="canDelete"
                    type="button"
                    class="action-btn action-delete"
                    title="Supprimer la gare"
                    :disabled="deleting === gare.id"
                    @click="removeGare(gare)"
                  >
                    <span>×</span>
                    {{
                      deleting === gare.id
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

      <!-- État vide -->
      <div v-else class="empty-state">
        <div class="empty-icon">🚉</div>
        <h3>Aucune gare enregistrée</h3>
        <p>
          Aucune gare n'est actuellement disponible dans le réseau.
        </p>

        <button
          v-if="canCreate"
          type="button"
          class="btn btn-primary"
          @click="createGare"
        >
          ＋ Créer la première gare
        </button>
      </div>

      <div v-if="!loading && gares.length > 0" class="table-footer">
        <span>
          {{ totalGares }}
          {{ totalGares > 1 ? 'gares affichées' : 'gare affichée' }}
        </span>
        <span>FOPTRAC — Administration</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  color: #243247;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 20px;
  color: #8a94a4;
  font-size: 13px;
}

.breadcrumb strong {
  color: #17365d;
  font-weight: 700;
}

.breadcrumb-separator {
  color: #c5a13b;
}

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
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #17365d;
  color: #e2c16b;
}

.header-icon .icon {
  font-size: 25px;
}

h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 6px 0 0;
  color: #7b8797;
  font-size: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 40px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:disabled,
.action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #17365d;
  color: #fff;
  box-shadow: 0 3px 8px rgb(23 54 93 / 14%);
}

.btn-primary:hover:not(:disabled) {
  background: #234a78;
  transform: translateY(-1px);
}

.btn-icon {
  color: #e2c16b;
  font-size: 19px;
  line-height: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 112px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 11px;
  box-shadow: 0 2px 8px rgb(25 42 70 / 3%);
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 11px;
  font-size: 21px;
  font-weight: 700;
}

.stat-icon-blue {
  background: #eaf0f8;
  color: #17365d;
}

.stat-icon-green {
  background: #e8f5ed;
  color: #23834d;
}

.stat-icon-gray {
  background: #f0f1f3;
  color: #687386;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-label {
  color: #7b8797;
  font-size: 12px;
  font-weight: 550;
}

.stat-value {
  color: #17365d;
  font-size: 25px;
  line-height: 1.2;
  font-weight: 750;
}

.stat-description {
  color: #9aa3af;
  font-size: 11px;
}

.alert {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 16px;
  padding: 12px 15px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13px;
}

.alert p {
  flex: 1;
  margin: 0;
}

.alert button {
  border: 0;
  background: transparent;
  font-size: 19px;
  cursor: pointer;
}

.alert-success {
  border-color: #b8dfc6;
  background: #eff8f1;
  color: #256c43;
}

.alert-error {
  border-color: #f1c3c3;
  background: #fff2f2;
  color: #a33434;
}

.content-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 11px;
  box-shadow: 0 2px 9px rgb(25 42 70 / 3%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f4;
}

.card-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 16px;
  font-weight: 750;
}

.card-header p {
  margin: 5px 0 0;
  color: #929baa;
  font-size: 12px;
}

.btn-refresh {
  min-height: 36px;
  border-color: #e0e5ec;
  background: #fff;
  color: #536174;
}

.btn-refresh:hover:not(:disabled) {
  border-color: #c5a13b;
  color: #17365d;
}

.btn-refresh span {
  font-size: 19px;
  line-height: 1;
}

.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead th {
  padding: 14px 17px;
  background: #f7f8fa;
  color: #758195;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  white-space: nowrap;
}

tbody td {
  padding: 15px 17px;
  border-bottom: 1px solid #edf0f4;
  color: #536174;
  font-size: 13px;
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #fafbfd;
}

.code-badge {
  display: inline-block;
  padding: 5px 9px;
  border: 1px solid #e3e9f1;
  border-radius: 5px;
  background: #f2f5f9;
  color: #17365d;
  font-size: 12px;
  font-weight: 750;
}

.gare-name {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #293b52;
}

.gare-name strong {
  font-weight: 650;
}

.gare-avatar {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #edf1f7;
  color: #17365d;
  font-size: 12px;
  font-weight: 750;
}

.address-cell {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-active {
  background: #e9f6ed;
  color: #27834d;
}

.status-inactive {
  background: #f0f1f3;
  color: #687386;
}

.date-cell {
  color: #8792a1;
  font-size: 12px;
}

.actions-column {
  min-width: 190px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 9px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
}

.action-edit {
  border-color: #dce5f0;
  background: #f0f4f9;
  color: #234a78;
}

.action-edit:hover {
  border-color: #b7c9df;
  background: #e5edf7;
}

.action-delete {
  border-color: #f1dada;
  background: #fff4f4;
  color: #b44444;
}

.action-delete:hover:not(:disabled) {
  background: #fde8e8;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  gap: 13px;
  color: #8792a1;
  font-size: 13px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e7ebf1;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  text-align: center;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  margin-bottom: 15px;
  border-radius: 50%;
  background: #f0f3f7;
  font-size: 29px;
}

.empty-state h3 {
  margin: 0;
  color: #17365d;
  font-size: 17px;
}

.empty-state p {
  margin: 8px 0 20px;
  color: #929baa;
  font-size: 13px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  padding: 13px 20px;
  border-top: 1px solid #edf0f4;
  color: #929baa;
  font-size: 11px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .page {
    padding: 23px 20px 32px;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 15px;
  }
}

@media (max-width: 650px) {
  .page {
    padding: 18px 13px 28px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header > .btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 17px;
  }

  .table-footer {
    gap: 8px;
    flex-direction: column;
  }

  .actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

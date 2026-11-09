
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';
import { useDestinationStore } from '../../stores/destination.store';

import DestinationStatusBadge from '../../components/destinations/DestinationStatusBadge.vue';
import DestinationFilters from '../../components/destinations/DestinationFilters.vue';
import DestinationStats from '../../components/destinations/DestinationStats.vue';

import type {
  Destination,
  DestinationStatut,
} from '../../types/destination.types';

const store = useDestinationStore();
const router = useRouter();
const auth = useAuthStore();

const search = ref('');
const statut = ref<'TOUS' | DestinationStatut>('TOUS');
const pageError = ref('');

const canManage = computed(
  () => auth.role === 'ADMIN' || auth.role === 'RESPONSABLE_GARE',
);

const canDelete = computed(() => auth.role === 'ADMIN');

const filtered = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();

  return store.destinations.filter((destination) => {
    const matchesSearch = [
      destination.code,
      destination.nom,
      destination.ville,
      destination.pays,
    ].some((value) => value.toLocaleLowerCase().includes(query));

    const matchesStatus =
      statut.value === 'TOUS' || destination.statut === statut.value;

    return matchesSearch && matchesStatus;
  });
});

onMounted(async () => {
  pageError.value = '';

  try {
    await store.fetchDestinations();
  } catch {
    pageError.value = store.error || 'Erreur lors du chargement des destinations.';
  }
});

function goToCreate() {
  router.push({ name: 'destination-create' });
}

function goToDetails(id: string) {
  router.push({
    name: 'destination-details',
    params: { id },
  });
}

function goToEdit(id: string) {
  router.push({
    name: 'destination-edit',
    params: { id },
  });
}

async function handleDelete(item: Destination) {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer définitivement la destination « ${item.nom} » ?\n\nCette opération peut être refusée si cette destination est déjà utilisée par une fiche de chargement ou un itinéraire.`,
  );

  if (!confirmed) return;

  pageError.value = '';

  try {
    await store.removeDestination(item.id);
  } catch {
    pageError.value =
      store.error || 'Impossible de supprimer cette destination.';
  }
}
</script>

<template>
  <main class="page-container">

    <!-- EN-TÊTE -->
    <header class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <span>Administration</span>
          <span class="breadcrumb-separator">/</span>
          <span>Référentiels</span>
          <span class="breadcrumb-separator">/</span>
          <span class="current">Destinations</span>
        </div>

        <div class="title-row">
          <div class="title-icon">
            <span>📍</span>
          </div>

          <div>
            <h1>Gestion des destinations</h1>
            <p>
              Gérez les destinations utilisées dans les fiches de chargement
              et les itinéraires.
            </p>
          </div>
        </div>
      </div>

      <button
        v-if="canManage"
        class="btn-primary"
        @click="goToCreate"
      >
        <span class="btn-icon">+</span>
        Nouvelle destination
      </button>
    </header>

    <!-- STATISTIQUES EXISTANTES -->
    <section class="stats-section">
      <DestinationStats :items="store.destinations" />
    </section>

    <!-- ERREUR -->
    <div v-if="pageError" class="alert-error">
      <span class="alert-icon">!</span>
      <span>{{ pageError }}</span>
    </div>

    <!-- CONTENU PRINCIPAL -->
    <section class="content-card">

      <div class="card-header">
        <div>
          <h2>Répertoire des destinations</h2>
          <p>
            Consultez, recherchez et gérez les destinations enregistrées
            dans FOPTRAC.
          </p>
        </div>

        <span class="record-count">
          {{ filtered.length }}
          {{ filtered.length > 1 ? 'résultats' : 'résultat' }}
        </span>
      </div>

      <!-- FILTRES -->
      <div class="filters-container">
        <DestinationFilters
          v-model:search="search"
          v-model:statut="statut"
        />
      </div>

      <!-- CHARGEMENT -->
      <div v-if="store.loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des destinations...</p>
      </div>

      <!-- TABLEAU -->
      <div v-else-if="!pageError" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>DESTINATION</th>
              <th>VILLE</th>
              <th>PAYS</th>
              <th>STATUT</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in filtered"
              :key="item.id"
            >
              <td>
                <span class="code-badge">
                  {{ item.code }}
                </span>
              </td>

              <td>
                <span class="destination-name">
                  {{ item.nom }}
                </span>
              </td>

              <td>
                <span class="location-cell">
                  <span class="location-icon">⌖</span>
                  {{ item.ville }}
                </span>
              </td>

              <td>{{ item.pays }}</td>

              <td>
                <DestinationStatusBadge :statut="item.statut" />
              </td>

              <td>
                <div class="actions-cell">

                  <button
                    class="btn-action btn-details"
                    title="Consulter les détails"
                    @click="goToDetails(item.id)"
                  >
                    <span>⌕</span>
                    Voir
                  </button>

                  <button
                    v-if="canManage"
                    class="btn-action btn-edit"
                    title="Modifier cette destination"
                    @click="goToEdit(item.id)"
                  >
                    <span>✎</span>
                    Modifier
                  </button>

                  <button
                    v-if="canDelete"
                    class="btn-action btn-delete"
                    title="Supprimer cette destination"
                    :disabled="store.deletingId === item.id"
                    @click="handleDelete(item)"
                  >
                    <span>×</span>
                    {{ store.deletingId === item.id ? 'Suppression...' : 'Supprimer' }}
                  </button>

                </div>
              </td>
            </tr>

            <!-- AUCUN RÉSULTAT -->
            <tr v-if="filtered.length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <div class="empty-icon">📍</div>

                  <h3>Aucune destination trouvée</h3>

                  <p v-if="search || statut !== 'TOUS'">
                    Aucune destination ne correspond aux critères de recherche.
                  </p>

                  <p v-else>
                    Aucune destination n'est encore enregistrée dans FOPTRAC.
                  </p>

                  <button
                    v-if="canManage && !search && statut === 'TOUS'"
                    class="btn-primary btn-empty"
                    @click="goToCreate"
                  >
                    + Créer une destination
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PIED DU TABLEAU -->
      <div v-if="!store.loading && !pageError" class="table-footer">
        <span>
          {{ filtered.length }} destination(s) affichée(s)
        </span>

        <span>
          FOPTRAC — Référentiel des destinations
        </span>
      </div>

    </section>

    <!-- PIED DE PAGE -->
    <footer class="page-footer">
      <span>FOPTRAC — Gestion des transports</span>
      <span>Administration des destinations</span>
    </footer>

  </main>
</template>

<style scoped>
/* PAGE */

.page-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #1e293b;
}

/* EN-TÊTE */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 28px;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  align-items: center;
  margin-bottom: 16px;
  color: #94a3b8;
  font-size: 12px;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #17365d;
  font-weight: 600;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #17365d;
  font-size: 21px;
}

.page-header h1 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 25px;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* BOUTON PRINCIPAL */

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 18px;
  border: 1px solid #17365d;
  border-radius: 8px;
  background: #17365d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  border-color: #244a76;
  background: #244a76;
}

.btn-icon {
  color: #e2c46d;
  font-size: 20px;
  line-height: 1;
}

/* STATISTIQUES */

.stats-section {
  margin-bottom: 24px;
}

/* CARTE PRINCIPALE */

.content-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.035);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 20px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 16px;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
}

.record-count {
  flex-shrink: 0;
  padding: 6px 11px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
}

/* FILTRES */

.filters-container {
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

/* TABLEAU */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.data-table th {
  padding: 15px 20px;
  background: #f8fafc;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #fafbfd;
}

.code-badge {
  display: inline-block;
  padding: 5px 9px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: #f8fafc;
  color: #17365d;
  font-size: 11px;
  font-weight: 700;
}

.destination-name {
  color: #1e293b;
  font-weight: 600;
}

.location-cell {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.location-icon {
  color: #c5a13b;
  font-size: 17px;
}

/* ACTIONS */

.text-right {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
  white-space: nowrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-details {
  border-color: #dbe4ef;
  background: #f1f5f9;
  color: #17365d;
}

.btn-details:hover {
  background: #e2e8f0;
}

.btn-edit {
  border-color: #e8dfbd;
  background: #fbf8ed;
  color: #856b20;
}

.btn-edit:hover {
  background: #f4ebca;
}

.btn-delete {
  border-color: #fecaca;
  background: #fff7f7;
  color: #b91c1c;
}

.btn-delete:hover:not(:disabled) {
  background: #fee2e2;
}

.btn-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* CHARGEMENT */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  color: #64748b;
  font-size: 13px;
}

.loader {
  width: 30px;
  height: 30px;
  margin-bottom: 12px;
  border: 3px solid #e2e8f0;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ERREUR */

.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
}

.alert-icon {
  display: flex;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee2e2;
  font-weight: 700;
}

/* ÉTAT VIDE */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  width: 55px;
  height: 55px;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #17365d;
  font-size: 25px;
}

.empty-state h3 {
  margin: 0 0 7px;
  color: #17365d;
  font-size: 16px;
}

.empty-state p {
  margin: 0 0 18px;
  color: #94a3b8;
  font-size: 12px;
}

.btn-empty {
  padding: 9px 15px;
  font-size: 12px;
}

/* PIED DU TABLEAU */

.table-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 20px;
  border-top: 1px solid #e2e8f0;
  background: #fafbfd;
  color: #94a3b8;
  font-size: 11px;
}

/* PIED DE PAGE */

.page-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 22px;
  padding: 12px 2px;
  color: #94a3b8;
  font-size: 11px;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .page-container {
    padding: 22px 18px;
  }
}

@media (max-width: 650px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header .btn-primary {
    width: 100%;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters-container {
    padding: 14px;
  }

  .data-table {
    min-width: 900px;
  }

  .table-footer,
  .page-footer {
    flex-direction: column;
  }
}
</style>

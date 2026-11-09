
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  deleteChauffeur,
  getChauffeurs,
} from '../../api/chauffeurs.api';

import type { Chauffeur } from '../../types/chauffeur.types';

const router = useRouter();

const chauffeurs = ref<Chauffeur[]>([]);
const loading = ref(false);
const deletingId = ref<string | null>(null);
const error = ref<string | null>(null);
const search = ref('');

const totalDocuments = computed(() =>
  chauffeurs.value.reduce(
    (total, chauffeur) =>
      total + (chauffeur.documentChauffeurs?.length ?? 0),
    0,
  ),
);

const activeCount = computed(() =>
  chauffeurs.value.filter(
    (chauffeur) => chauffeur.statut === 'ACTIF',
  ).length,
);

const inactiveCount = computed(() =>
  chauffeurs.value.filter(
    (chauffeur) => chauffeur.statut === 'INACTIF',
  ).length,
);

const filteredChauffeurs = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) return chauffeurs.value;

  return chauffeurs.value.filter((chauffeur) =>
    [
      chauffeur.nom,
      chauffeur.prenom,
      chauffeur.telephone ?? '',
      chauffeur.statut,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
});

async function loadChauffeurs(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    chauffeurs.value = await getChauffeurs();
  } catch (err) {
    console.error(err);
    error.value = 'Impossible de charger la liste des chauffeurs.';
  } finally {
    loading.value = false;
  }
}

function goToCreate(): void {
  router.push({ name: 'chauffeur-create' });
}

function goToEdit(id: string): void {
  router.push({
    name: 'chauffeur-edit',
    params: { id },
  });
}

async function removeChauffeur(chauffeur: Chauffeur): Promise<void> {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le chauffeur ${chauffeur.nom} ${chauffeur.prenom} ?`,
  );

  if (!confirmed) return;

  deletingId.value = chauffeur.id;
  error.value = null;

  try {
    await deleteChauffeur(chauffeur.id);
    chauffeurs.value = chauffeurs.value.filter(
      (item) => item.id !== chauffeur.id,
    );
  } catch (err) {
    console.error(err);
    error.value = 'Impossible de supprimer ce chauffeur.';
  } finally {
    deletingId.value = null;
  }
}

function getDocumentCount(chauffeur: Chauffeur): number {
  return chauffeur.documentChauffeurs?.length ?? 0;
}

onMounted(loadChauffeurs);
</script>

<template>
  <div class="chauffeurs-page">
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <strong>Chauffeurs</strong>
    </div>

    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>CH</span>
        </div>

        <div>
          <h1>Gestion des chauffeurs</h1>
          <p>
            Consultez et gérez les chauffeurs enregistrés dans le système.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="btn-primary"
        @click="goToCreate"
      >
        <span class="button-icon">＋</span>
        Nouveau chauffeur
      </button>
    </header>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon navy">CH</div>
        <div>
          <span class="stat-label">Total chauffeurs</span>
          <strong class="stat-value">{{ chauffeurs.length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">✓</div>
        <div>
          <span class="stat-label">Chauffeurs actifs</span>
          <strong class="stat-value">{{ activeCount }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon red">!</div>
        <div>
          <span class="stat-label">Chauffeurs inactifs</span>
          <strong class="stat-value">{{ inactiveCount }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold">DOC</div>
        <div>
          <span class="stat-label">Documents associés</span>
          <strong class="stat-value">{{ totalDocuments }}</strong>
        </div>
      </article>
    </section>

    <div v-if="error" class="alert-error">
      <span>{{ error }}</span>
      <button type="button" @click="loadChauffeurs">
        Réessayer
      </button>
    </div>

    <section class="content-card">
      <div class="table-toolbar">
        <div>
          <h2>Liste des chauffeurs</h2>
          <p>
            {{ filteredChauffeurs.length }}
            résultat(s) affiché(s)
          </p>
        </div>

        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input
            v-model="search"
            type="search"
            placeholder="Rechercher un chauffeur..."
            aria-label="Rechercher un chauffeur"
          />
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        <p>Chargement des chauffeurs...</p>
      </div>

      <div
        v-else-if="!filteredChauffeurs.length"
        class="empty-state"
      >
        <div class="empty-icon">CH</div>
        <h3>
          {{ search ? 'Aucun résultat trouvé' : 'Aucun chauffeur enregistré' }}
        </h3>
        <p>
          {{
            search
              ? 'Essayez avec un autre terme de recherche.'
              : 'Commencez par enregistrer votre premier chauffeur.'
          }}
        </p>

        <button
          v-if="!search"
          type="button"
          class="btn-primary"
          @click="goToCreate"
        >
          Nouveau chauffeur
        </button>
      </div>

      <div v-else class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Chauffeur</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Documents</th>
              <th class="actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="chauffeur in filteredChauffeurs"
              :key="chauffeur.id"
            >
              <td>
                <div class="chauffeur-identity">
                  <div class="avatar">
                    {{ chauffeur.prenom?.charAt(0) }}{{ chauffeur.nom?.charAt(0) }}
                  </div>
                  <div class="identity-text">
                    <strong>
                      {{ chauffeur.nom }} {{ chauffeur.prenom }}
                    </strong>
                    <span>Chauffeur</span>
                  </div>
                </div>
              </td>

              <td class="phone-cell">
                {{ chauffeur.telephone || '—' }}
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="chauffeur.statut === 'ACTIF' ? 'status-active' : 'status-inactive'"
                >
                  <span class="status-dot"></span>
                  {{ chauffeur.statut }}
                </span>
              </td>

              <td>
                <span class="document-count">
                  {{ getDocumentCount(chauffeur) }}
                  <span>
                    {{
                      getDocumentCount(chauffeur) > 1
                        ? 'documents'
                        : 'document'
                    }}
                  </span>
                </span>
              </td>

              <td>
                <div class="row-actions">
                  <button
                    type="button"
                    class="btn-edit"
                    title="Modifier le chauffeur"
                    @click="goToEdit(chauffeur.id)"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    class="btn-delete"
                    title="Supprimer le chauffeur"
                    :disabled="deletingId === chauffeur.id"
                    @click="removeChauffeur(chauffeur)"
                  >
                    {{
                      deletingId === chauffeur.id
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

      <footer v-if="!loading && filteredChauffeurs.length" class="table-footer">
        <span>
          Affichage de {{ filteredChauffeurs.length }} chauffeur(s)
        </span>
        <button
          v-if="search"
          type="button"
          class="clear-search"
          @click="search = ''"
        >
          Effacer la recherche
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.chauffeurs-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  box-sizing: border-box;
  color: #243247;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  color: #7b8797;
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
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 26px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 13px;
  background: #17365d;
  color: #e2c46b;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
}

.page-header h1 {
  margin: 0 0 6px;
  color: #17365d;
  font-size: 27px;
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: #7b8797;
  font-size: 14px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 17px;
  border: 1px solid #17365d;
  border-radius: 7px;
  background: #17365d;
  color: white;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background: #102944;
  transform: translateY(-1px);
}

.button-icon {
  color: #e2c46b;
  font-size: 19px;
  line-height: 1;
}

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
  border: 1px solid #e7ebf0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(20 40 70 / 3%);
}

.stat-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
}

.stat-icon.navy {
  background: #eaf0f7;
  color: #17365d;
}

.stat-icon.green {
  background: #e8f5ed;
  color: #247448;
  font-size: 20px;
}

.stat-icon.red {
  background: #fceeee;
  color: #b54747;
  font-size: 20px;
}

.stat-icon.gold {
  background: #f8f2df;
  color: #92721d;
  font-size: 10px;
}

.stat-label {
  display: block;
  margin-bottom: 5px;
  color: #7b8797;
  font-size: 12px;
}

.stat-value {
  color: #17365d;
  font-size: 23px;
  font-weight: 750;
}

.alert-error {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 13px 16px;
  border: 1px solid #f1caca;
  border-radius: 8px;
  background: #fff4f4;
  color: #9b3030;
  font-size: 13px;
}

.alert-error button {
  border: 0;
  background: transparent;
  color: #8b2525;
  font-weight: 700;
  cursor: pointer;
}

.content-card {
  overflow: hidden;
  border: 1px solid #e7ebf0;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgb(20 40 70 / 3%);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f3;
}

.table-toolbar h2 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 16px;
  font-weight: 750;
}

.table-toolbar p {
  margin: 0;
  color: #8993a1;
  font-size: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  width: min(330px, 100%);
  padding: 0 12px;
  border: 1px solid #dfe4ea;
  border-radius: 7px;
  background: #fff;
}

.search-icon {
  color: #8793a2;
  font-size: 21px;
}

.search-box input {
  width: 100%;
  height: 39px;
  border: 0;
  outline: none;
  color: #243247;
  font: inherit;
  font-size: 13px;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

thead {
  background: #f7f9fb;
}

th {
  padding: 13px 18px;
  color: #68778a;
  font-size: 11px;
  font-weight: 750;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.45px;
}

td {
  padding: 15px 18px;
  border-top: 1px solid #edf0f3;
  color: #405066;
  font-size: 13px;
}

tbody tr:hover {
  background: #fbfcfe;
}

.chauffeur-identity {
  display: flex;
  align-items: center;
  gap: 11px;
}

.avatar {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #eaf0f7;
  color: #17365d;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.identity-text strong {
  display: block;
  color: #243247;
  font-size: 13px;
  font-weight: 700;
}

.identity-text span {
  display: block;
  margin-top: 3px;
  color: #929baa;
  font-size: 11px;
}

.phone-cell {
  color: #5f6d7e;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 750;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-active {
  background: #eaf5ee;
  color: #287448;
}

.status-inactive {
  background: #fceeee;
  color: #b54747;
}

.document-count {
  color: #17365d;
  font-weight: 750;
}

.document-count span {
  margin-left: 3px;
  color: #8993a1;
  font-size: 11px;
  font-weight: 500;
}

.actions-heading {
  text-align: right;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.btn-edit,
.btn-delete {
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.btn-edit {
  border-color: #dce5ef;
  background: #f0f4f9;
  color: #17365d;
}

.btn-edit:hover {
  background: #e3ebf4;
}

.btn-delete {
  border-color: #f1dada;
  background: #fff5f5;
  color: #a63c3c;
}

.btn-delete:hover {
  background: #fce8e8;
}

.btn-delete:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 20px;
  border-top: 1px solid #edf0f3;
  color: #8993a1;
  font-size: 11px;
}

.clear-search {
  border: 0;
  background: transparent;
  color: #17365d;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 30px;
  color: #7b8797;
  text-align: center;
}

.loading-state p,
.empty-state p {
  font-size: 13px;
}

.spinner {
  width: 27px;
  height: 27px;
  border: 3px solid #e6ebf1;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 10px;
  border-radius: 13px;
  background: #eaf0f7;
  color: #17365d;
  font-size: 13px;
  font-weight: 800;
}

.empty-state h3 {
  margin: 5px 0;
  color: #17365d;
  font-size: 16px;
}

.empty-state .btn-primary {
  margin-top: 12px;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .chauffeurs-page {
    padding: 20px 15px;
  }

  .page-header,
  .table-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .page-header .btn-primary {
    width: 100%;
  }

  .search-box {
    width: 100%;
    box-sizing: border-box;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 13px;
  }

  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 420px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

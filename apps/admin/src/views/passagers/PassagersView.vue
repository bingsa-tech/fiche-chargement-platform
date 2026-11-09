
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  getPassagers,
  updatePassager,
  deletePassager,
  type Passager,
} from '../../api/passagers.api';

const passagers = ref<Passager[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const searchQuery = ref('');

const isModalOpen = ref(false);
const selectedPassager = ref<Passager | null>(null);

const editForm = ref({
  nom: '',
  prenom: '',
  numeroCni: '',
  telephone: '' as string | null,
});

const errorMessage = ref('');
const successMessage = ref('');

const totalPassagers = computed(() => passagers.value.length);

const filteredPassagers = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();

  if (!query) return passagers.value;

  return passagers.value.filter((p) =>
    [p.nom, p.prenom, p.numeroCni, p.telephone || ''].some((value) =>
      value.toLocaleLowerCase().includes(query),
    ),
  );
});

const fetchPassagers = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    passagers.value = await getPassagers();
  } catch (error) {
    console.error('Erreur lors du chargement des passagers', error);
    errorMessage.value = 'Impossible de charger la liste des passagers.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPassagers);

const openEditModal = (passager: Passager) => {
  selectedPassager.value = passager;

  editForm.value = {
    nom: passager.nom,
    prenom: passager.prenom,
    numeroCni: passager.numeroCni,
    telephone: passager.telephone,
  };

  errorMessage.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  if (isSaving.value) return;

  isModalOpen.value = false;
  selectedPassager.value = null;
};

const handleUpdate = async () => {
  if (!selectedPassager.value || isSaving.value) return;

  try {
    isSaving.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await updatePassager(selectedPassager.value.id, editForm.value);

    isModalOpen.value = false;
    selectedPassager.value = null;

    await fetchPassagers();

    successMessage.value = 'Passager modifié avec succès.';
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || 'Erreur lors de la modification.';
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!window.confirm('Voulez-vous vraiment supprimer ce passager ?')) return;

  try {
    errorMessage.value = '';
    successMessage.value = '';

    await deletePassager(id);
    await fetchPassagers();

    successMessage.value = 'Passager supprimé avec succès.';
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 500) {
      errorMessage.value =
        'Impossible de supprimer ce passager car il est rattaché à une ou plusieurs fiches de chargement.';
    } else {
      errorMessage.value = 'Erreur lors de la suppression.';
    }
  }
};

function formatDate(value: string): string {
  if (!value) return 'Non renseignée';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date invalide';

  return date.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
</script>

<template>
  <main class="page">
    <!-- Fil d'Ariane -->
    <nav class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <span class="current">Passagers</span>
    </nav>

    <!-- En-tête -->
    <header class="page-header">
      <div>
        <p class="eyebrow">ANNUAIRE CENTRAL</p>
        <h1>Gestion des passagers</h1>
        <p class="subtitle">
          Consultez, modifiez et gérez les passagers enregistrés dans le système.
        </p>
      </div>
    </header>

    <!-- Messages -->
    <div v-if="successMessage" class="alert alert-success" role="status">
      <span class="alert-icon">✓</span>
      {{ successMessage }}
      <button
        type="button"
        class="alert-close"
        aria-label="Fermer"
        @click="successMessage = ''"
      >
        ×
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-error" role="alert">
      <span class="alert-icon">!</span>
      {{ errorMessage }}
      <button
        type="button"
        class="alert-close"
        aria-label="Fermer"
        @click="errorMessage = ''"
      >
        ×
      </button>
    </div>

    <!-- Statistiques -->
    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon navy-icon">♙</div>
        <div>
          <p class="stat-label">Total des passagers</p>
          <p class="stat-value">{{ totalPassagers }}</p>
          <span class="stat-description">Passagers enregistrés</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold-icon">⌕</div>
        <div>
          <p class="stat-label">Résultats affichés</p>
          <p class="stat-value">{{ filteredPassagers.length }}</p>
          <span class="stat-description">Selon votre recherche</span>
        </div>
      </article>
    </section>

    <!-- Recherche -->
    <section class="toolbar">
      <div class="search-wrapper">
        <span class="search-icon">⌕</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher par nom, prénom ou numéro CNI..."
          class="search-input"
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
        {{ filteredPassagers.length }}
        résultat(s)
      </span>
    </section>

    <!-- Tableau -->
    <section class="table-card">
      <div class="table-heading">
        <div>
          <h2>Liste des passagers</h2>
          <p>Répertoire des personnes enregistrées dans le système.</p>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <span class="spinner"></span>
        <p>Chargement des passagers…</p>
      </div>

      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom et prénom</th>
              <th>Numéro CNI</th>
              <th>Téléphone</th>
              <th>Date d'enregistrement</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in filteredPassagers" :key="p.id">
              <td>
                <div class="passager-identity">
                  <div class="avatar">
                    {{ p.nom.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <strong class="passager-name">
                      {{ p.nom }} {{ p.prenom }}
                    </strong>
                    <span class="passager-caption">Passager enregistré</span>
                  </div>
                </div>
              </td>

              <td>
                <span class="cni-code">{{ p.numeroCni }}</span>
              </td>

              <td>{{ p.telephone || 'Non renseigné' }}</td>

              <td>{{ formatDate(p.createdAt) }}</td>

              <td>
                <div class="row-actions">
                  <button
                    type="button"
                    class="action-button edit-button"
                    title="Modifier le passager"
                    @click="openEditModal(p)"
                  >
                    <span>✎</span>
                    Modifier
                  </button>

                  <button
                    type="button"
                    class="action-button delete-button"
                    title="Supprimer le passager"
                    @click="handleDelete(p.id)"
                  >
                    <span>×</span>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPassagers.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">♙</span>
                  <strong>Aucun passager trouvé</strong>
                  <p>
                    {{
                      searchQuery
                        ? 'Aucun résultat ne correspond à votre recherche.'
                        : 'Les passagers sont créés automatiquement via les fiches de chargement.'
                    }}
                  </p>
                  <button
                    v-if="searchQuery"
                    type="button"
                    class="reset-button"
                    @click="searchQuery = ''"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="!isLoading" class="table-footer">
        <span>
          {{ filteredPassagers.length }} passager(s) affiché(s)
          sur {{ totalPassagers }}
        </span>
      </footer>
    </section>

    <!-- Modal de modification -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <section
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <header class="modal-header">
            <div>
              <p class="eyebrow">ANNUAIRE CENTRAL</p>
              <h2 id="modal-title">Modifier le passager</h2>
              <p>Actualisez les informations personnelles du passager.</p>
            </div>

            <button
              type="button"
              class="modal-close"
              aria-label="Fermer"
              :disabled="isSaving"
              @click="closeModal"
            >
              ×
            </button>
          </header>

          <div class="modal-divider"></div>

          <form @submit.prevent="handleUpdate" class="modal-form">
            <div class="form-group">
              <label for="passager-nom">Nom</label>
              <input
                id="passager-nom"
                v-model.trim="editForm.nom"
                type="text"
                required
                class="form-input"
                placeholder="Nom du passager"
              />
            </div>

            <div class="form-group">
              <label for="passager-prenom">Prénom</label>
              <input
                id="passager-prenom"
                v-model.trim="editForm.prenom"
                type="text"
                required
                class="form-input"
                placeholder="Prénom du passager"
              />
            </div>

            <div class="form-group">
              <label for="passager-cni">Numéro de CNI</label>
              <input
                id="passager-cni"
                v-model.trim="editForm.numeroCni"
                type="text"
                required
                class="form-input"
                placeholder="Numéro de la pièce d'identité"
              />
            </div>

            <div class="form-group">
              <label for="passager-telephone">Téléphone</label>
              <input
                id="passager-telephone"
                v-model="editForm.telephone"
                type="tel"
                class="form-input"
                placeholder="Numéro de téléphone"
              />
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="btn-secondary"
                :disabled="isSaving"
                @click="closeModal"
              >
                Annuler
              </button>

              <button
                type="submit"
                class="btn-primary"
                :disabled="isSaving"
              >
                <span v-if="isSaving" class="button-spinner"></span>
                {{ isSaving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  box-sizing: border-box;
}

/* Fil d'Ariane */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 25px;
  color: #8490a2;
  font-size: 0.82rem;
}

.separator {
  color: #c5a13b;
}

.current {
  color: #17365d;
  font-weight: 700;
}

/* En-tête */
.page-header {
  margin-bottom: 27px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #b18a2c;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 1.85rem;
  font-weight: 800;
}

.subtitle {
  margin: 9px 0 0;
  color: #667085;
  font-size: 0.94rem;
  line-height: 1.5;
}

/* Alertes */
.alert {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 16px;
  padding: 13px 15px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 0.88rem;
  font-weight: 600;
}

.alert-success {
  border-color: #c6ebd5;
  background: #effaf3;
  color: #16834a;
}

.alert-error {
  border-color: #fecdca;
  background: #fff5f4;
  color: #b42318;
}

.alert-icon {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
  color: white;
  font-weight: 800;
}

.alert-close {
  margin-left: auto;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.3rem;
  cursor: pointer;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 25px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e4e8ef;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 24 40 / 3%);
}

.stat-icon {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 11px;
  font-size: 1.7rem;
}

.navy-icon {
  background: #edf2f8;
  color: #17365d;
}

.gold-icon {
  background: #f8f3e6;
  color: #a17c25;
}

.stat-label {
  margin: 0 0 5px;
  color: #667085;
  font-size: 0.82rem;
  font-weight: 600;
}

.stat-value {
  margin: 0;
  color: #17365d;
  font-size: 1.65rem;
  font-weight: 800;
}

.stat-description {
  display: block;
  margin-top: 4px;
  color: #98a2b3;
  font-size: 0.75rem;
}

/* Recherche */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 18px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 510px;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #8490a2;
  font-size: 1.4rem;
}

.search-input {
  width: 100%;
  padding: 12px 42px;
  border: 1px solid #dce2ea;
  border-radius: 9px;
  outline: none;
  background: white;
  color: #26364a;
  font-size: 0.88rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.clear-search {
  position: absolute;
  right: 12px;
  border: none;
  background: transparent;
  color: #8490a2;
  font-size: 1.3rem;
  cursor: pointer;
}

.result-count {
  padding: 7px 13px;
  border: 1px solid #e4e8ef;
  border-radius: 20px;
  background: #f7f8fa;
  color: #52647c;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

/* Tableau */
.table-card {
  overflow: hidden;
  border: 1px solid #e4e8ef;
  border-radius: 13px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 24 40 / 4%);
}

.table-heading {
  padding: 22px 24px;
  border-bottom: 1px solid #edf0f4;
}

.table-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.05rem;
  font-weight: 750;
}

.table-heading p {
  margin: 5px 0 0;
  color: #8490a2;
  font-size: 0.82rem;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.86rem;
  white-space: nowrap;
}

.data-table th {
  padding: 15px 18px;
  border-bottom: 1px solid #e4e8ef;
  background: #f7f8fa;
  color: #52647c;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.035em;
}

.data-table td {
  padding: 15px 18px;
  border-bottom: 1px solid #edf0f4;
  color: #52647c;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #fafbfd;
}

/* Identité du passager */
.passager-identity {
  display: flex;
  align-items: center;
  gap: 11px;
}

.avatar {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #edf2f8;
  color: #17365d;
  font-size: 0.9rem;
  font-weight: 800;
}

.passager-name {
  display: block;
  color: #17365d;
  font-weight: 750;
}

.passager-caption {
  display: block;
  margin-top: 3px;
  color: #98a2b3;
  font-size: 0.72rem;
}

.cni-code {
  padding: 5px 8px;
  border-radius: 5px;
  background: #f2f4f7;
  color: #52647c;
  font-family: monospace;
  font-size: 0.83rem;
}

/* Actions */
.text-right {
  text-align: right;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-button {
  border-color: #dce5f0;
  background: #edf2f8;
  color: #17365d;
}

.edit-button:hover {
  background: #dce5f0;
}

.delete-button {
  border-color: #fecdca;
  background: #fff5f4;
  color: #b42318;
}

.delete-button:hover {
  background: #fee4e2;
}

/* Chargement et état vide */
.loading-state {
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #667085;
  font-size: 0.88rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e8edf3;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 30px;
  text-align: center;
  white-space: normal;
}

.empty-icon {
  color: #b18a2c;
  font-size: 2rem;
}

.empty-state strong {
  color: #17365d;
  font-size: 0.95rem;
}

.empty-state p {
  max-width: 450px;
  margin: 0;
  color: #8490a2;
  font-size: 0.82rem;
  line-height: 1.5;
}

.reset-button {
  margin-top: 7px;
  padding: 8px 13px;
  border: 1px solid #dce2ea;
  border-radius: 7px;
  background: white;
  color: #17365d;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

/* Pied de tableau */
.table-footer {
  padding: 14px 20px;
  border-top: 1px solid #edf0f4;
  background: #fafbfc;
  color: #8490a2;
  font-size: 0.78rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 20px;
  background: rgb(15 23 42 / 55%);
  backdrop-filter: blur(3px);
}

.modal-card {
  width: 100%;
  max-width: 540px;
  padding: 27px;
  border: 1px solid #e4e8ef;
  border-radius: 15px;
  background: white;
  box-shadow: 0 20px 50px rgb(0 0 0 / 18%);
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.modal-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.3rem;
  font-weight: 800;
}

.modal-header p:not(.eyebrow) {
  margin: 7px 0 0;
  color: #8490a2;
  font-size: 0.82rem;
  line-height: 1.5;
}

.modal-close {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  border-radius: 7px;
  background: #f2f4f7;
  color: #52647c;
  font-size: 1.35rem;
  cursor: pointer;
}

.modal-close:hover {
  background: #e4e8ef;
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-divider {
  height: 1px;
  margin: 22px 0;
  background: #edf0f4;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  color: #52647c;
  font-size: 0.82rem;
  font-weight: 700;
}

.form-input {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #26364a;
  font-size: 0.88rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid #edf0f4;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border-color: #17365d;
  background: #17365d;
  color: white;
}

.btn-primary:hover {
  background: #102944;
}

.btn-secondary {
  border-color: #dce2ea;
  background: white;
  color: #52647c;
}

.btn-secondary:hover {
  background: #f4f6f9;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: 20px 16px 32px;
  }

  .page-header h1 {
    font-size: 1.55rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-wrapper {
    max-width: none;
  }

  .result-count {
    align-self: flex-start;
  }

  .table-heading {
    padding: 18px;
  }

  .modal-card {
    padding: 21px 17px;
  }
}

@media (max-width: 480px) {
  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>

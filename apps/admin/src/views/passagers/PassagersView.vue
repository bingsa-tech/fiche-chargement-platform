<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPassagers, updatePassager, deletePassager, type Passager } from '../../api/passagers.api';

const passagers = ref<Passager[]>([]);
const isLoading = ref(true);
const searchQuery = ref('');

// État pour le Modal de Modification (Update)
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

// Charger la liste des passagers
const fetchPassagers = async () => {
  try {
    isLoading.value = true;
    passagers.value = await getPassagers();
  } catch (error) {
    console.error("Erreur lors du chargement des passagers", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPassagers();
});

// Filtrer les passagers par nom, prénom ou CNI (Typage explicite de 'p: Passager')
const filteredPassagers = computed(() => {
  if (!searchQuery.value.trim()) return passagers.value;
  const query = searchQuery.value.toLowerCase();
  return passagers.value.filter(
    (p: Passager) =>
      p.nom.toLowerCase().includes(query) ||
      p.prenom.toLowerCase().includes(query) ||
      p.numeroCni.toLowerCase().includes(query)
  );
});

// Ouvrir le modal d'édition
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

// Fermer le modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedPassager.value = null;
};

// Soumettre la modification (Update)
const handleUpdate = async () => {
  if (!selectedPassager.value) return;
  try {
    errorMessage.value = '';
    await updatePassager(selectedPassager.value.id, editForm.value);
    successMessage.value = "Passager modifié avec succès !";
    closeModal();
    await fetchPassagers();
    setTimeout(() => (successMessage.value = ''), 4000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de la modification.";
  }
};

// Supprimer un passager (Delete)
const handleDelete = async (id: string) => {
  if (!confirm("Voulez-vous vraiment supprimer ce passager ?")) return;

  try {
    errorMessage.value = '';
    await deletePassager(id);
    successMessage.value = "Passager supprimé avec succès.";
    await fetchPassagers();
    setTimeout(() => (successMessage.value = ''), 4000);
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 500) {
      errorMessage.value = "Impossible de supprimer ce passager car il est rattaché à une ou plusieurs fiches de chargement.";
    } else {
      errorMessage.value = "Erreur lors de la suppression.";
    }
  }
};
</script>

<template>
  <main class="passagers-container">
    <header class="page-header">
      <div>
        <span class="eyebrow">ANNUAIRE CENTRAL</span>
        <h1>Gestion des Passagers</h1>
        <p>Consultez, modifiez ou supprimez les passagers enregistrés dans la base de données.</p>
      </div>
    </header>

    <!-- Messages de succès / erreur -->
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

    <!-- Barre de recherche -->
    <div class="actions-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher par nom, prénom ou CNI..."
        class="search-input"
      />
      <span class="count-badge">Total : {{ filteredPassagers.length }} passager(s)</span>
    </div>

    <!-- Tableau des passagers (Read) -->
    <div class="table-card">
      <div v-if="isLoading" class="loading-state">Chargement des passagers...</div>
      
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Nom & Prénom</th>
            <th>Numéro CNI</th>
            <th>Téléphone</th>
            <th>Date d'enregistrement</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredPassagers" :key="p.id">
            <td>
              <strong class="passager-name">{{ p.nom }} {{ p.prenom }}</strong>
            </td>
            <td><code>{{ p.numeroCni }}</code></td>
            <td>{{ p.telephone || 'Non renseigné' }}</td>
            <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
            <td class="text-right actions-cell">
              <button @click="openEditModal(p)" class="btn-icon btn-edit" title="Modifier">Modifier</button>
              <button @click="handleDelete(p.id)" class="btn-icon btn-delete" title="Supprimer">Supprimer</button>
            </td>
          </tr>
          <tr v-if="filteredPassagers.length === 0">
            <td colspan="5" class="empty-state">Aucun passager trouvé. (La création se fait automatiquement via les fiches).</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Modification (Update) -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-card">
        <h2>Modifier le passager</h2>
        
        <form @submit.prevent="handleUpdate" class="modal-form">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" v-model="editForm.nom" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Prénom</label>
            <input type="text" v-model="editForm.prenom" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Numéro de CNI</label>
            <input type="text" v-model="editForm.numeroCni" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input type="text" v-model="editForm.telephone" class="form-input" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Annuler</button>
            <button type="submit" class="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.passagers-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  color: #172033;
}
.page-header {
  margin-bottom: 24px;
}
.eyebrow {
  color: #2459b8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.page-header h1 {
  margin: 4px 0 8px;
  color: #172554;
  font-size: 26px;
}
.page-header p {
  color: #586780;
  font-size: 14px;
  margin: 0;
}
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 600;
}
.alert-success { background: #e8f8ef; color: #16834a; border: 1px solid #c6ebd5; }
.alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 16px;
}
.search-input {
  flex: 1;
  max-width: 400px;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
}
.count-badge {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
}
.table-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}
.passager-name { color: #0f172a; }
.text-right { text-align: right; }
.actions-cell { display: flex; gap: 8px; justify-content: flex-end; }

.btn-icon {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  border: none;
}
.btn-edit { background: #eff6ff; color: #2563eb; }
.btn-edit:hover { background: #dbeafe; }
.btn-delete { background: #fef2f2; color: #dc2626; }
.btn-delete:hover { background: #fee2e2; }

.loading-state, .empty-state {
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-style: italic;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal-card {
  background: white;
  padding: 28px;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}
.modal-card h2 { margin-top: 0; color: #0f172a; font-size: 20px; margin-bottom: 20px; }
.modal-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #475569; }
.form-input { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
.btn-primary { background: #2563eb; color: white; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary { background: #f1f5f9; color: #475569; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { background: #e2e8f0; }
</style>
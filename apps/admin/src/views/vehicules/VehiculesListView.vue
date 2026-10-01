<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { deleteVehicule, getVehicules } from '../../api/vehicules.api';
import type { Vehicule } from '../../types/vehicule.types';
import { useAuthStore } from '../../auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const vehicules = ref<Vehicule[]>([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const userRole = computed(() => authStore.user?.role ?? '');

const canCreate = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'AGENT'].includes(userRole.value),
);

const canEdit = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT'].includes(
    userRole.value,
  ),
);

const canDelete = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE'].includes(userRole.value),
);

async function loadVehicules() {
  loading.value = true;
  error.value = '';

  try {
    vehicules.value = await getVehicules();
  } catch (err) {
    console.error(err);
    error.value = 'Impossible de charger les véhicules.';
  } finally {
    loading.value = false;
  }
}

function goToCreate() {
  router.push({ name: 'vehicule-create' });
}

function goToEdit(id: string) {
  router.push({
    name: 'vehicule-edit',
    params: { id },
  });
}

async function removeVehicule(vehicule: Vehicule) {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le véhicule ${vehicule.plaqueImmatriculation} ?`,
  );

  if (!confirmed) {
    return;
  }

  error.value = '';
  success.value = '';

  try {
    await deleteVehicule(vehicule.id);

    success.value = 'Véhicule supprimé avec succès.';

    await loadVehicules();
  } catch (err) {
    console.error(err);
    error.value =
      'Impossible de supprimer le véhicule. Il peut être utilisé dans une fiche ou contenir des documents.';
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR');
}

function getProprietaireName(vehicule: Vehicule) {
  if (!vehicule.proprietaire) {
    return 'Aucun propriétaire';
  }

  return `${vehicule.proprietaire.nom} ${vehicule.proprietaire.prenom}`;
}

function getStatutClass(statut: string) {
  switch (statut) {
    case 'ACTIF':
      return 'status-active';

    case 'INACTIF':
      return 'status-inactive';

    case 'MAINTENANCE':
      return 'status-maintenance';

    default:
      return '';
  }
}

onMounted(loadVehicules);
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>Véhicules</h1>
        <p>Gestion des véhicules de transport.</p>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="primary-button"
        @click="goToCreate"
      >
        + Nouveau véhicule
      </button>
    </div>

    <div v-if="success" class="alert success">
      {{ success }}
    </div>

    <div v-if="error" class="alert error">
      {{ error }}
    </div>

    <div v-if="loading" class="loading">
      Chargement des véhicules...
    </div>

    <div v-else class="table-container">
      <table v-if="vehicules.length > 0">
        <thead>
          <tr>
            <th>Plaque</th>
            <th>Type</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Capacité</th>
            <th>Propriétaire</th>
            <th>Statut</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="vehicule in vehicules"
            :key="vehicule.id"
          >
            <td>
              <strong>
                {{ vehicule.plaqueImmatriculation }}
              </strong>
            </td>

            <td>
              {{ vehicule.type }}
            </td>

            <td>
              {{ vehicule.marque || '—' }}
            </td>

            <td>
              {{ vehicule.modele || '—' }}
            </td>

            <td>
              {{ vehicule.capacite }}
            </td>

            <td>
              {{ getProprietaireName(vehicule) }}
            </td>

            <td>
              <span
                class="status"
                :class="getStatutClass(vehicule.statut)"
              >
                {{ vehicule.statut }}
              </span>
            </td>

            <td>
              {{ formatDate(vehicule.createdAt) }}
            </td>

            <td class="actions">
              <button
                v-if="canEdit"
                type="button"
                class="action-button edit"
                @click="goToEdit(vehicule.id)"
              >
                Modifier
              </button>

              <button
                v-if="canDelete"
                type="button"
                class="action-button delete"
                @click="removeVehicule(vehicule)"
              >
                Supprimer
              </button>

              <span
                v-if="!canEdit && !canDelete"
                class="no-action"
              >
                Lecture seule
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>Aucun véhicule enregistré.</p>

        <button
          v-if="canCreate"
          type="button"
          class="primary-button"
          @click="goToCreate"
        >
          Ajouter le premier véhicule
        </button>
      </div>
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
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.primary-button {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.primary-button:hover {
  background: #1d4ed8;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.alert.success {
  background: #dcfce7;
  color: #166534;
}

.alert.error {
  background: #fee2e2;
  color: #991b1b;
}

.loading {
  padding: 30px;
  text-align: center;
  color: #6b7280;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 13px 14px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

tbody tr:hover {
  background: #f9fafb;
}

.status {
  display: inline-block;
  padding: 4px 9px;
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

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-button {
  border: none;
  border-radius: 6px;
  padding: 7px 10px;
  cursor: pointer;
  font-size: 13px;
}

.action-button.edit {
  background: #e0e7ff;
  color: #3730a3;
}

.action-button.delete {
  background: #fee2e2;
  color: #991b1b;
}

.no-action {
  color: #9ca3af;
  font-size: 13px;
}

.empty-state {
  padding: 50px;
  text-align: center;
  color: #6b7280;
}

.empty-state p {
  margin-bottom: 20px;
}
</style>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  deleteChauffeur,
  getChauffeurs,
} from '../../api/chauffeurs.api';

import type { Chauffeur } from '../../types/chauffeur.types';

const router = useRouter();

const chauffeurs = ref<Chauffeur[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadChauffeurs(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    chauffeurs.value = await getChauffeurs();
  } catch (err) {
    console.error(err);
    error.value =
      'Impossible de charger la liste des chauffeurs.';
  } finally {
    loading.value = false;
  }
}

function goToCreate(): void {
  router.push({
    name: 'chauffeur-create',
  });
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

  if (!confirmed) {
    return;
  }

  try {
    await deleteChauffeur(chauffeur.id);

    await loadChauffeurs();
  } catch (err) {
    console.error(err);

    error.value =
      'Impossible de supprimer ce chauffeur.';
  }
}

function getDocumentCount(chauffeur: Chauffeur): number {
  return chauffeur.documentChauffeurs?.length ?? 0;
}

onMounted(() => {
  loadChauffeurs();
});
</script>

<template>
  <div class="chauffeur-list">
    <div class="page-header">
      <div>
        <h1>Chauffeurs</h1>

        <p>
          Gestion des chauffeurs enregistrés dans le système.
        </p>
      </div>

      <button
        type="button"
        class="btn-primary"
        @click="goToCreate"
      >
        + Nouveau chauffeur
      </button>
    </div>

    <div
      v-if="error"
      class="alert-error"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      Chargement des chauffeurs...
    </div>

    <div
      v-else-if="!chauffeurs.length"
      class="empty-state"
    >
      <p>Aucun chauffeur enregistré.</p>

      <button
        type="button"
        class="btn-primary"
        @click="goToCreate"
      >
        Créer le premier chauffeur
      </button>
    </div>

    <div
      v-else
      class="table-container"
    >
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Téléphone</th>
            <th>Statut</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="chauffeur in chauffeurs"
            :key="chauffeur.id"
          >
            <td>
              {{ chauffeur.nom }}
            </td>

            <td>
              {{ chauffeur.prenom }}
            </td>

            <td>
              {{ chauffeur.telephone || '—' }}
            </td>

            <td>
              <span
                class="status"
                :class="{
                  'status-active':
                    chauffeur.statut === 'ACTIF',
                  'status-inactive':
                    chauffeur.statut === 'INACTIF',
                }"
              >
                {{ chauffeur.statut }}
              </span>
            </td>

            <td>
              {{ getDocumentCount(chauffeur) }}
            </td>

            <td class="actions">
              <button
                type="button"
                class="btn-secondary"
                @click="goToEdit(chauffeur.id)"
              >
                Modifier
              </button>

              <button
                type="button"
                class="btn-danger"
                @click="removeChauffeur(chauffeur)"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.chauffeur-list {
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
  color: #666;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  border: none;
  border-radius: 6px;
  padding: 9px 14px;
  cursor: pointer;
  font-size: 14px;
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

.alert-error {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
}

.loading,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #666;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
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
}

th {
  background: #f9fafb;
  font-weight: 600;
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
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
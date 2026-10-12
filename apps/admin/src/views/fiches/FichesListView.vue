<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/auth.store';
import {
  getFiches,
  deleteFiche,
} from '../../api/fiche.api';
import { getApiErrorMessage } from '../../api/api-error';
import type { Fiche } from '../../types/fiche.types';

const router = useRouter();
const authStore = useAuthStore();

const fiches = ref<Fiche[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const deleteErrorMessage = ref('');
const deletingFicheId = ref<string | null>(null);

const canCreateFiche = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT'].includes(
    authStore.role ?? '',
  ),
);

// Seul le rôle ADMIN peut afficher l'action de suppression.
const canDeleteFiche = computed(
  () => authStore.role === 'ADMIN',
);

const statusLabels: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  FINALISEE: 'Finalisée',
  IMPRIMEE: 'Imprimée',
  REMISE_CHAUFFEUR: 'Remise au chauffeur',
  RECEPTION_CONFIRME: 'Réception confirmée',
  CHARGEMENT: 'Chargement',
  EN_CIRCULATION: 'En circulation',
  CLOTUREE: 'Clôturée',
  ANNULEE: 'Annulée',
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

async function loadFiches(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  try {
    fiches.value = await getFiches();
  } catch (error: unknown) {
    console.error('Erreur de chargement des fiches', error);
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function createNewFiche(): void {
  if (!canCreateFiche.value) {
    router.push({ name: 'unauthorized' });
    return;
  }

  router.push({ name: 'fiche-create' });
}

function openFicheDetail(id: string): void {
  router.push({
    name: 'fiche-detail',
    params: { id },
  });
}

async function removeFiche(fiche: Fiche): Promise<void> {
  // Vérification du rôle avant toute requête de suppression.
  if (!canDeleteFiche.value) {
    router.push({ name: 'unauthorized' });
    return;
  }

  if (deletingFicheId.value !== null) {
    return;
  }

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la fiche "${fiche.reference}" ?\n\n` +
      'Cette action peut être irréversible.',
  );

  if (!confirmed) {
    return;
  }

  deletingFicheId.value = fiche.id;
  deleteErrorMessage.value = '';

  try {
    await deleteFiche(fiche.id);

    // Retirer la fiche uniquement après la réussite de la requête.
    fiches.value = fiches.value.filter(
      (item) => item.id !== fiche.id,
    );
  } catch (error: unknown) {
    console.error(
      'Erreur lors de la suppression de la fiche',
      error,
    );

    deleteErrorMessage.value = getApiErrorMessage(error);
  } finally {
    deletingFicheId.value = null;
  }
}

onMounted(loadFiches);
</script>

<template>
  <section class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Gestion opérationnelle</p>
        <h1>Fiches de chargement</h1>
        <p class="subtitle">
          Consulte les fiches accessibles à ton compte.
        </p>
      </div>

      <div class="header-actions">
        <button
          v-if="canCreateFiche"
          type="button"
          class="create-button"
          @click="createNewFiche"
        >
          <span aria-hidden="true">+</span>
          Nouvelle fiche
        </button>

        <button
          type="button"
          class="refresh-button"
          :disabled="loading || deletingFicheId !== null"
          @click="loadFiches"
        >
          {{ loading ? 'Chargement…' : 'Actualiser' }}
        </button>
      </div>
    </header>

    <p
      v-if="deleteErrorMessage"
      class="delete-error"
      role="alert"
    >
      {{ deleteErrorMessage }}
    </p>

    <div class="summary">
      <span>Total des fiches reçues</span>
      <strong>{{ fiches.length }}</strong>
    </div>

    <p v-if="loading" class="message" role="status">
      Chargement des fiches…
    </p>

    <div v-else-if="errorMessage" class="error-message" role="alert">
      <p>{{ errorMessage }}</p>

      <button
        type="button"
        :disabled="loading"
        @click="loadFiches"
      >
        Réessayer
      </button>
    </div>

    <div v-else-if="fiches.length === 0" class="empty-state">
      <h2>Aucune fiche disponible</h2>

      <p>
        Aucune fiche n’a été renvoyée par l’API pour cette session.
      </p>

      <button
        v-if="canCreateFiche"
        type="button"
        class="create-button"
        @click="createNewFiche"
      >
        Créer la première fiche
      </button>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Gare</th>
            <th>Véhicule</th>
            <th>Chauffeur</th>
            <th>Destination</th>
            <th>Création</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="fiche in fiches" :key="fiche.id">
            <td class="reference">
              {{ fiche.reference }}
            </td>

            <td>
              {{ fiche.gare?.nomGare ?? fiche.gare?.nom ?? fiche.gareId }}
            </td>

            <td>
              {{
                fiche.vehicule?.immatriculation
                  ?? fiche.vehicule?.reference
                  ?? fiche.vehiculeId
              }}
            </td>

            <td>
              {{
                [fiche.chauffeur?.prenom, fiche.chauffeur?.nom]
                  .filter(Boolean)
                  .join(' ') || fiche.chauffeurId
              }}
            </td>

            <td>
              {{
                fiche.destination?.nom
                  ?? fiche.destination?.libelle
                  ?? fiche.destinationId
              }}
            </td>

            <td>
              {{ formatDate(fiche.dateCreation) }}
            </td>

            <td>
              <span class="status">
                {{ statusLabels[fiche.statut] ?? fiche.statut }}
              </span>
            </td>

            <td>
              <div class="row-actions">
                <button
                  type="button"
                  class="detail-button"
                  :aria-label="`Voir les détails de la fiche ${fiche.reference}`"
                  @click="openFicheDetail(fiche.id)"
                >
                  Voir / Imprimer
                </button>

                <button
                  v-if="canDeleteFiche"
                  type="button"
                  class="delete-button"
                  :disabled="deletingFicheId !== null"
                  :aria-label="`Supprimer la fiche ${fiche.reference}`"
                  @click="removeFiche(fiche)"
                >
                  {{
                    deletingFicheId === fiche.id
                      ? 'Suppression…'
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
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: #111827;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  color: #6b7280;
}

.create-button,
.refresh-button,
.error-message button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font: inherit;
}

.create-button {
  background: #15803d;
}

.create-button:hover {
  background: #166534;
}

.refresh-button,
.error-message button {
  background: #2563eb;
}

.refresh-button:disabled,
.error-message button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.summary,
.empty-state,
.error-message {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
}

.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary span {
  color: #6b7280;
}

.summary strong {
  font-size: 24px;
}

.message {
  color: #6b7280;
}

.error-message,
.delete-error {
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fff;
  color: #991b1b;
}

.error-message {
  padding: 20px;
}

.delete-error {
  margin: 0;
  padding: 12px 16px;
}

.error-message button {
  margin-top: 8px;
}

.empty-state h2 {
  margin-top: 0;
}

.empty-state p {
  color: #6b7280;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  background: #f9fafb;
  color: #4b5563;
  font-size: 12px;
  text-transform: uppercase;
}

td {
  font-size: 13px;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.reference {
  font-weight: 700;
}

.status {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-button,
.delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 7px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
}

.detail-button {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.detail-button:hover {
  background: #dbeafe;
}

.delete-button {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.delete-button:hover:not(:disabled) {
  background: #fee2e2;
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.detail-button:focus-visible,
.delete-button:focus-visible,
.create-button:focus-visible,
.refresh-button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .row-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getFiches } from '../../api/fiche.api';
import type { Fiche } from '../../types/fiche.types';

const fiches = ref<Fiche[]>([]);
const loading = ref(false);
const errorMessage = ref('');

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

async function loadFiches() {
  loading.value = true;
  errorMessage.value = '';

  try {
    fiches.value = await getFiches();
  } catch (error: unknown) {
    console.error('Erreur de chargement des fiches', error);

    errorMessage.value =
      'Impossible de charger les fiches. Vérifie ta session, tes permissions et la disponibilité de l’API.';
  } finally {
    loading.value = false;
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

      <button
        type="button"
        class="refresh-button"
        :disabled="loading"
        @click="loadFiches"
      >
        {{ loading ? 'Chargement…' : 'Actualiser' }}
      </button>
    </header>

    <div class="summary">
      <span>Total des fiches reçues</span>
      <strong>{{ fiches.length }}</strong>
    </div>

    <p v-if="loading" class="message">
      Chargement des fiches…
    </p>

    <div v-else-if="errorMessage" class="error-message" role="alert">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadFiches">
        Réessayer
      </button>
    </div>

    <div v-else-if="fiches.length === 0" class="empty-state">
      <h2>Aucune fiche disponible</h2>
      <p>
        Aucune fiche n’a été renvoyée par l’API pour cette session.
      </p>
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
          </tr>
        </thead>

        <tbody>
          <tr v-for="fiche in fiches" :key="fiche.id">
            <td class="reference">{{ fiche.reference }}</td>

            <td>
              {{ fiche.gare?.nomGare ?? fiche.gareId }}
            </td>

            <td>
              {{ fiche.vehicule?.immatriculation ?? fiche.vehiculeId }}
            </td>

            <td>
              {{
                [fiche.chauffeur?.prenom, fiche.chauffeur?.nom]
                  .filter(Boolean)
                  .join(' ') || fiche.chauffeurId
              }}
            </td>

            <td>
              {{ fiche.destination?.libelle ?? fiche.destinationId }}
            </td>

            <td>{{ formatDate(fiche.dateCreation) }}</td>

            <td>
              <span class="status">
                {{ statusLabels[fiche.statut] ?? fiche.statut }}
              </span>
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

.refresh-button,
.error-message button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.refresh-button:disabled {
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

.error-message {
  border-color: #fecaca;
  color: #991b1b;
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

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }
}
</style>

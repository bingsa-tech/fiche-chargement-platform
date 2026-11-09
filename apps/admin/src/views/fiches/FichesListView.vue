
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/auth.store';
import {
  getFiches,
  deleteFiche,
  telechargerFichePdf,
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

const totalFiches = computed(() => fiches.value.length);

const statusCounts = computed(() => ({
  enCours: fiches.value.filter(
    (fiche) =>
      ['EN_COURS', 'CHARGEMENT', 'EN_CIRCULATION'].includes(fiche.statut),
  ).length,
  cloturees: fiches.value.filter(
    (fiche) => fiche.statut === 'CLOTUREE',
  ).length,
}));

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
  if (!canDeleteFiche.value) {
    router.push({ name: 'unauthorized' });
    return;
  }

  if (deletingFicheId.value !== null) return;

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la fiche "${fiche.reference}" ?\n\n` +
      'Cette action peut être irréversible.',
  );

  if (!confirmed) return;

  deletingFicheId.value = fiche.id;
  deleteErrorMessage.value = '';

  try {
    await deleteFiche(fiche.id);

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

async function genererPdf(ficheId: string): Promise<void> {
  let url: string | null = null;

  try {
    const blob = await telechargerFichePdf(ficheId);
    url = URL.createObjectURL(blob);

    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `bordereau-${ficheId}.pdf`;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
  } catch (error: unknown) {
    console.error('Erreur de téléchargement PDF :', error);
    alert('Impossible de télécharger le bordereau PDF.');
  } finally {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}

onMounted(loadFiches);
</script>

<template>
  <section class="fiche-list">
    <nav class="breadcrumb" aria-label="Fil d’Ariane">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Fiches de chargement</span>
    </nav>

    <header class="page-header">
      <div class="header-content">
        <div class="title-icon">▤</div>
        <div>
          <p class="eyebrow">Gestion opérationnelle</p>
          <h1>Fiches de chargement</h1>
          <p class="subtitle">
            Consultez et gérez les fiches accessibles à votre compte.
          </p>
        </div>
      </div>

      <div class="header-actions">
        <button
          v-if="canCreateFiche"
          type="button"
          class="button button-primary"
          @click="createNewFiche"
        >
          <span aria-hidden="true">+</span>
          Nouvelle fiche
        </button>

        <button
          type="button"
          class="button button-secondary"
          :disabled="loading || deletingFicheId !== null"
          @click="loadFiches"
        >
          <span aria-hidden="true">↻</span>
          {{ loading ? 'Chargement...' : 'Actualiser' }}
        </button>
      </div>
    </header>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon navy">▤</div>
        <div>
          <p>Total des fiches</p>
          <strong>{{ totalFiches }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold">↗</div>
        <div>
          <p>En cours de traitement</p>
          <strong>{{ statusCounts.enCours }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">✓</div>
        <div>
          <p>Fiches clôturées</p>
          <strong>{{ statusCounts.cloturees }}</strong>
        </div>
      </article>
    </div>

    <div
      v-if="deleteErrorMessage"
      class="alert alert-error"
      role="alert"
    >
      <span class="alert-icon">!</span>
      <p>{{ deleteErrorMessage }}</p>
      <button
        type="button"
        class="alert-close"
        aria-label="Fermer le message"
        @click="deleteErrorMessage = ''"
      >
        ×
      </button>
    </div>

    <div v-if="loading" class="state-card" role="status">
      <span class="spinner"></span>
      <p>Chargement des fiches de chargement...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-error" role="alert">
      <span class="alert-icon">!</span>
      <div class="alert-content">
        <strong>Erreur de chargement</strong>
        <p>{{ errorMessage }}</p>
        <button
          type="button"
          class="button button-secondary"
          @click="loadFiches"
        >
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="fiches.length === 0" class="empty-state">
      <div class="empty-icon">▤</div>
      <h2>Aucune fiche disponible</h2>
      <p>
        Aucune fiche n’a été renvoyée par l’API pour cette session.
      </p>
      <button
        v-if="canCreateFiche"
        type="button"
        class="button button-primary"
        @click="createNewFiche"
      >
        Créer la première fiche
      </button>
    </div>

    <div v-else class="table-card">
      <div class="table-heading">
        <div>
          <h2>Registre des fiches</h2>
          <p>{{ totalFiches }} fiche(s) enregistrée(s)</p>
        </div>
        <span class="record-count">{{ totalFiches }} résultats</span>
      </div>

      <div class="table-container">
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

              <td class="date-cell">
                {{ formatDate(fiche.dateCreation) }}
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="`status-${fiche.statut.toLowerCase()}`"
                >
                  {{ statusLabels[fiche.statut] ?? fiche.statut }}
                </span>
              </td>

              <td>
                <div class="row-actions">
                  <button
                    type="button"
                    class="action-button detail-button"
                    :aria-label="`Voir les détails de la fiche ${fiche.reference}`"
                    @click="openFicheDetail(fiche.id)"
                  >
                    Détails
                  </button>

                  <button
                    type="button"
                    class="action-button pdf-button"
                    :aria-label="`Générer le PDF de la fiche ${fiche.reference}`"
                    @click="genererPdf(fiche.id)"
                  >
                    PDF
                  </button>

                  <button
                    v-if="canDeleteFiche"
                    type="button"
                    class="action-button delete-button"
                    :disabled="deletingFicheId !== null"
                    :aria-label="`Supprimer la fiche ${fiche.reference}`"
                    @click="removeFiche(fiche)"
                  >
                    {{
                      deletingFicheId === fiche.id
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
    </div>
  </section>
</template>

<style scoped>
.fiche-list {
  max-width: 1600px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #263445;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #7b8795;
  font-size: 13px;
}

.breadcrumb-current {
  color: #17365d;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #c5a13b;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 26px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 17px;
}

.title-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 13px;
  background: #edf2f8;
  color: #17365d;
  font-size: 27px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #a17d22;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 700;
}

.subtitle {
  margin: 7px 0 0;
  color: #778394;
  font-size: 14px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.button-primary {
  border-color: #17365d;
  background: #17365d;
  color: #fff;
}

.button-primary:hover:not(:disabled) {
  border-color: #102744;
  background: #102744;
}

.button-secondary {
  border-color: #d9e0e8;
  background: #fff;
  color: #425269;
}

.button-secondary:hover:not(:disabled) {
  border-color: #c5a13b;
  background: #faf8f2;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 23px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 100px;
  padding: 19px;
  border: 1px solid #e5eaf0;
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 37 63 / 4%);
}

.stat-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
}

.stat-icon.navy {
  background: #edf2f8;
  color: #17365d;
}

.stat-icon.gold {
  background: #f8f2e4;
  color: #a17d22;
}

.stat-icon.green {
  background: #eaf5ed;
  color: #34764a;
}

.stat-card p {
  margin: 0 0 7px;
  color: #778394;
  font-size: 12px;
}

.stat-card strong {
  color: #17365d;
  font-size: 25px;
  font-weight: 700;
}

.table-card {
  overflow: hidden;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 37 63 / 4%);
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f4;
}

.table-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 16px;
}

.table-heading p {
  margin: 5px 0 0;
  color: #8792a1;
  font-size: 12px;
}

.record-count {
  padding: 6px 10px;
  border-radius: 20px;
  background: #f5f0e3;
  color: #927020;
  font-size: 11px;
  font-weight: 650;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #edf0f4;
  text-align: left;
}

th {
  background: #f8fafc;
  color: #687587;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

td {
  color: #425269;
  font-size: 12px;
}

tbody tr {
  transition: background 0.15s;
}

tbody tr:hover {
  background: #fafbfd;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.reference {
  color: #17365d;
  font-weight: 700;
}

.date-cell {
  color: #778394;
  font-variant-numeric: tabular-nums;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  background: #edf2f8;
  color: #17365d;
  font-size: 11px;
  font-weight: 650;
}

.status-en_cours,
.status-chargement,
.status-en_circulation {
  background: #fff4df;
  color: #966b15;
}

.status-finalisee,
.status-cloturee,
.status-reception_confirme {
  background: #eaf5ed;
  color: #34764a;
}

.status-annulee {
  background: #fceeee;
  color: #a23d3d;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 6px 9px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  transition: background 0.15s;
}

.detail-button {
  border-color: #d5dfeb;
  background: #f1f5fa;
  color: #17365d;
}

.detail-button:hover {
  background: #e4ebf4;
}

.pdf-button {
  border-color: #e8d8ae;
  background: #faf5e9;
  color: #927020;
}

.pdf-button:hover {
  background: #f3ead4;
}

.delete-button {
  border-color: #f0cece;
  background: #fff5f5;
  color: #a23d3d;
}

.delete-button:hover:not(:disabled) {
  background: #fce8e8;
}

.action-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
  padding: 15px 17px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 13px;
}

.alert p {
  margin: 0;
  line-height: 1.5;
}

.alert-error {
  border-color: #f0caca;
  background: #fff7f7;
  color: #923737;
}

.alert-icon {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 5%);
  font-weight: 800;
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.alert-content strong {
  font-size: 14px;
}

.alert-close {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  min-height: 180px;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  color: #778394;
  font-size: 14px;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e5eaf0;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 270px;
  padding: 35px 20px;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  text-align: center;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 15px;
  border-radius: 15px;
  background: #edf2f8;
  color: #17365d;
  font-size: 28px;
}

.empty-state h2 {
  margin: 0;
  color: #17365d;
  font-size: 18px;
}

.empty-state p {
  margin: 9px 0 20px;
  color: #8792a1;
  font-size: 13px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .fiche-list {
    padding: 18px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .row-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  h1 {
    font-size: 22px;
  }
}
</style>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { alertesApi } from '../../api/alertes.api';
import type {
  Alerte,
  AlerteStatut,
  AlerteType,
} from '../../features/alertes/types/alerte.types';
import { useAuthStore } from '../../auth/auth.store';

const authStore = useAuthStore();

const alertes = ref<Alerte[]>([]);
const chargement = ref(false);
const erreur = ref('');
const actionEnCours = ref<string | null>(null);

const filtreStatut = ref<'TOUTES' | AlerteStatut>('TOUTES');
const filtreType = ref<'TOUS' | AlerteType>('TOUS');

// =====================================================
// PERMISSIONS
// =====================================================

const peutMarquerCommeLue = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT']
    .includes(String(authStore.role ?? '')),
);

// =====================================================
// FILTRAGE
// =====================================================

const alertesFiltrees = computed(() =>
  alertes.value.filter((alerte) => {
    const statutOK =
      filtreStatut.value === 'TOUTES' ||
      alerte.statut === filtreStatut.value;

    const typeOK =
      filtreType.value === 'TOUS' ||
      alerte.typeAlerte === filtreType.value;

    return statutOK && typeOK;
  }),
);

const filtresActifs = computed(
  () =>
    filtreStatut.value !== 'TOUTES' ||
    filtreType.value !== 'TOUS',
);

// =====================================================
// STATISTIQUES
// =====================================================

const nombreNonLues = computed(() =>
  alertes.value.filter(
    (alerte) => alerte.statut === 'NON_LUE',
  ).length,
);

const nombreUrgentes = computed(() =>
  alertes.value.filter(
    (alerte) =>
      alerte.typeAlerte === 'URGENT' &&
      alerte.statut !== 'TRAITEE',
  ).length,
);

const nombreExpirees = computed(() =>
  alertes.value.filter((alerte) => {
    const date = new Date(
      `${alerte.dateExpiration.slice(0, 10)}T00:00:00`,
    );

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    return (
      !Number.isNaN(date.getTime()) &&
      date < aujourdHui &&
      alerte.statut !== 'TRAITEE'
    );
  }).length,
);

// =====================================================
// FORMATAGE
// =====================================================

function formaterDate(value: string | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function libelleStatut(statut: AlerteStatut): string {
  const libelles: Record<AlerteStatut, string> = {
    NON_LUE: 'Non lue',
    LUE: 'Lue',
    TRAITEE: 'Traitée',
  };

  return libelles[statut];
}

function classeStatut(statut: AlerteStatut): string {
  return {
    NON_LUE: 'status-unread',
    LUE: 'status-read',
    TRAITEE: 'status-done',
  }[statut];
}

function classeType(type: AlerteType): string {
  return {
    INFORMATION: 'type-info',
    ATTENTION: 'type-warning',
    URGENT: 'type-danger',
    EXPIRE: 'type-expired',
  }[type];
}

function libelleType(type: AlerteType): string {
  return {
    INFORMATION: 'Information',
    ATTENTION: 'Attention',
    URGENT: 'Urgente',
    EXPIRE: 'Expiré',
  }[type];
}

// =====================================================
// CHARGEMENT
// =====================================================

async function chargerAlertes(): Promise<void> {
  chargement.value = true;
  erreur.value = '';

  try {
    alertes.value = await alertesApi.findAll();
  } catch (error: unknown) {
    const status = (
      error as { response?: { status?: number } }
    )?.response?.status;

    if (status === 401) {
      erreur.value =
        'Session expirée ou authentification requise.';
    } else if (status === 403) {
      erreur.value =
        'Tu ne disposes pas des permissions nécessaires.';
    } else {
      erreur.value =
        'Impossible de charger les alertes. Réessaie.';
    }
  } finally {
    chargement.value = false;
  }
}

// =====================================================
// MARQUER UNE ALERTE COMME LUE
// =====================================================

async function marquerCommeLue(alerte: Alerte): Promise<void> {
  if (
    !peutMarquerCommeLue.value ||
    alerte.statut !== 'NON_LUE' ||
    actionEnCours.value
  ) {
    return;
  }

  actionEnCours.value = alerte.id;
  erreur.value = '';

  try {
    const alerteMiseAJour =
      await alertesApi.marquerCommeLue(alerte.id);

    const index = alertes.value.findIndex(
      (item) => item.id === alerte.id,
    );

    if (index !== -1) {
      alertes.value[index] = alerteMiseAJour;
    }
  } catch (error: unknown) {
    const status = (
      error as { response?: { status?: number } }
    )?.response?.status;

    erreur.value =
      status === 403
        ? 'Tu n’as pas le droit de modifier le statut de cette alerte.'
        : 'Impossible de marquer cette alerte comme lue.';
  } finally {
    actionEnCours.value = null;
  }
}

// =====================================================
// RÉINITIALISER LES FILTRES
// =====================================================

function reinitialiserFiltres(): void {
  filtreStatut.value = 'TOUTES';
  filtreType.value = 'TOUS';
}

// =====================================================
// INITIALISATION
// =====================================================

onMounted(chargerAlertes);
</script>

<template>
  <main class="alertes-page">

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <strong>Centre des alertes</strong>
    </div>

    <!-- EN-TÊTE -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>!</span>
        </div>

        <div>
          <h1>Centre des alertes</h1>
          <p>
            Suivi des alertes relatives aux documents des chauffeurs
            et des véhicules.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="chargement"
        @click="chargerAlertes"
      >
        <span class="refresh-icon">↻</span>
        {{ chargement ? 'Chargement...' : 'Actualiser' }}
      </button>
    </header>

    <!-- ERREUR -->
    <div
      v-if="erreur"
      class="error-banner"
      role="alert"
    >
      <span class="error-icon">!</span>
      <span>{{ erreur }}</span>

      <button
        type="button"
        @click="chargerAlertes"
      >
        Réessayer
      </button>
    </div>

    <!-- STATISTIQUES -->
    <section
      class="stats-grid"
      aria-label="Résumé des alertes"
    >
      <article class="stat-card">
        <div class="stat-icon stat-icon-total">▤</div>

        <div class="stat-content">
          <span class="stat-label">Total des alertes</span>
          <strong>{{ alertes.length }}</strong>
          <small>Alertes enregistrées</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-unread">●</div>

        <div class="stat-content">
          <span class="stat-label">Non lues</span>
          <strong>{{ nombreNonLues }}</strong>
          <small>En attente de lecture</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-urgent">!</div>

        <div class="stat-content">
          <span class="stat-label">Alertes urgentes</span>
          <strong>{{ nombreUrgentes }}</strong>
          <small>Non traitées</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon stat-icon-expired">⌛</div>

        <div class="stat-content">
          <span class="stat-label">Documents expirés</span>
          <strong>{{ nombreExpirees }}</strong>
          <small>À régulariser</small>
        </div>
      </article>
    </section>

    <!-- LISTE DES ALERTES -->
    <section class="list-panel">

      <div class="panel-header">
        <div>
          <h2>Liste des alertes</h2>
          <p>
            Consulte les alertes et suis leur état de traitement.
          </p>
        </div>

        <span class="results-count">
          {{ alertesFiltrees.length }}
          résultat{{ alertesFiltrees.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- FILTRES -->
      <div class="filters">
        <label>
          <span>Statut</span>

          <select v-model="filtreStatut">
            <option value="TOUTES">Tous les statuts</option>
            <option value="NON_LUE">Non lues</option>
            <option value="LUE">Lues</option>
            <option value="TRAITEE">Traitées</option>
          </select>
        </label>

        <label>
          <span>Type d'alerte</span>

          <select v-model="filtreType">
            <option value="TOUS">Tous les types</option>
            <option value="INFORMATION">Information</option>
            <option value="ATTENTION">Attention</option>
            <option value="URGENT">Urgente</option>
            <option value="EXPIRE">Expiré</option>
          </select>
        </label>

        <button
          v-if="filtresActifs"
          type="button"
          class="reset-button"
          @click="reinitialiserFiltres"
        >
          Réinitialiser
        </button>
      </div>

      <!-- CHARGEMENT INITIAL -->
      <div
        v-if="chargement && alertes.length === 0"
        class="loading-state"
      >
        <span class="spinner"></span>
        <p>Chargement des alertes...</p>
      </div>

      <!-- AUCUN RÉSULTAT -->
      <div
        v-else-if="!chargement && alertesFiltrees.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">!</div>

        <h3>
          {{ alertes.length === 0
            ? 'Aucune alerte disponible'
            : 'Aucun résultat trouvé'
          }}
        </h3>

        <p>
          {{ alertes.length === 0
            ? 'Aucune alerte documentaire n’est actuellement disponible.'
            : 'Aucune alerte ne correspond aux filtres sélectionnés.'
          }}
        </p>

        <button
          v-if="filtresActifs"
          type="button"
          class="secondary-button"
          @click="reinitialiserFiltres"
        >
          Effacer les filtres
        </button>
      </div>

      <!-- TABLEAU -->
      <div
        v-else-if="alertesFiltrees.length > 0"
        class="table-wrapper"
      >
        <table class="alertes-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Propriétaire</th>
              <th>Expiration</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="alerte in alertesFiltrees"
              :key="alerte.id"
              :class="{
                'row-unread': alerte.statut === 'NON_LUE',
                'row-urgent': alerte.typeAlerte === 'URGENT'
                  && alerte.statut !== 'TRAITEE',
              }"
            >
              <!-- DOCUMENT -->
              <td>
                <div class="document-cell">
                  <div class="document-icon">▤</div>

                  <div>
                    <strong>{{ alerte.typeDocument }}</strong>
                    <small>{{ alerte.documentId }}</small>
                  </div>
                </div>
              </td>

              <!-- PROPRIÉTAIRE -->
              <td>
                <div class="owner-cell">
                  <strong>{{ alerte.proprietaireType }}</strong>
                  <small>{{ alerte.proprietaireId }}</small>
                </div>
              </td>

              <!-- EXPIRATION -->
              <td class="date-cell">
                {{ formaterDate(alerte.dateExpiration) }}
              </td>

              <!-- TYPE -->
              <td>
                <span
                  class="status-pill"
                  :class="classeType(alerte.typeAlerte)"
                >
                  {{ libelleType(alerte.typeAlerte) }}
                </span>
              </td>

              <!-- STATUT -->
              <td>
                <span
                  class="status-pill"
                  :class="classeStatut(alerte.statut)"
                >
                  {{ libelleStatut(alerte.statut) }}
                </span>
              </td>

              <!-- ACTION -->
              <td>
                <button
                  v-if="
                    alerte.statut === 'NON_LUE' &&
                    peutMarquerCommeLue
                  "
                  type="button"
                  class="read-button"
                  :disabled="actionEnCours !== null"
                  @click="marquerCommeLue(alerte)"
                >
                  {{
                    actionEnCours === alerte.id
                      ? 'En cours...'
                      : 'Marquer comme lue'
                  }}
                </button>

                <span v-else class="muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ACTUALISATION -->
      <div
        v-if="chargement && alertes.length > 0"
        class="refresh-indicator"
      >
        Actualisation des alertes...
      </div>

      <!-- PIED -->
      <footer
        v-if="!chargement && alertesFiltrees.length > 0"
        class="table-footer"
      >
        <span>
          {{ alertesFiltrees.length }} alerte(s) affichée(s)
        </span>

        <span>Centre de gestion documentaire FOPTRAC</span>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.alertes-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #263445;
}

/* BREADCRUMB */

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #8993a2;
  font-size: 0.83rem;
}

.breadcrumb strong {
  color: #17365d;
  font-weight: 700;
}

.breadcrumb-separator {
  color: #c5a13b;
}

/* EN-TÊTE */

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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #17365d;
  color: #e3c36b;
  font-size: 1.8rem;
  font-weight: 800;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 1.65rem;
  font-weight: 750;
}

.page-header p {
  margin: 7px 0 0;
  color: #7b8795;
  font-size: 0.93rem;
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 17px;
  border: 1px solid #17365d;
  border-radius: 8px;
  background: #17365d;
  color: white;
  font-size: 0.9rem;
  font-weight: 650;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background: #244b78;
  transform: translateY(-1px);
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.refresh-icon {
  color: #e3c36b;
  font-size: 1.2rem;
}

/* STATISTIQUES */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 112px;
  padding: 20px;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 35 60 / 4%);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 1.35rem;
  font-weight: 800;
}

.stat-icon-total {
  background: #eaf0f8;
  color: #17365d;
}

.stat-icon-unread {
  background: #fff5d9;
  color: #a36c08;
}

.stat-icon-urgent {
  background: #fdecec;
  color: #b42318;
}

.stat-icon-expired {
  background: #fceee5;
  color: #bd541e;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-label {
  color: #748091;
  font-size: 0.79rem;
  font-weight: 600;
}

.stat-content strong {
  color: #17365d;
  font-size: 1.55rem;
  line-height: 1.2;
}

.stat-content small {
  color: #9aa3af;
  font-size: 0.75rem;
}

/* ERREUR */

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  margin-bottom: 18px;
  border: 1px solid #f4caca;
  border-radius: 9px;
  background: #fff1f1;
  color: #b42318;
  font-size: 0.9rem;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #b42318;
  color: white;
  font-weight: 800;
}

.error-banner button {
  margin-left: auto;
  border: none;
  background: transparent;
  color: #9e1b16;
  font-weight: 700;
  cursor: pointer;
}

/* PANNEAU PRINCIPAL */

.list-panel {
  overflow: hidden;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgb(16 35 60 / 4%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 21px 23px;
  border-bottom: 1px solid #edf0f3;
}

.panel-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.05rem;
  font-weight: 750;
}

.panel-header p {
  margin: 5px 0 0;
  color: #8792a0;
  font-size: 0.83rem;
}

.results-count {
  padding: 6px 11px;
  border: 1px solid #e5eaf0;
  border-radius: 20px;
  background: #f7f9fb;
  color: #526174;
  font-size: 0.78rem;
  font-weight: 650;
  white-space: nowrap;
}

/* FILTRES */

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid #edf0f3;
  background: #fbfcfd;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #526174;
  font-size: 0.8rem;
  font-weight: 650;
}

.filters select {
  min-width: 190px;
  padding: 10px 12px;
  border: 1px solid #d8e0e9;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #34465d;
  font-size: 0.85rem;
}

.filters select:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.reset-button {
  padding: 10px 13px;
  border: 1px solid #d8e0e9;
  border-radius: 8px;
  background: white;
  color: #526174;
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
}

.reset-button:hover {
  background: #f1f4f7;
}

/* TABLEAU */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.alertes-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  text-align: left;
}

.alertes-table th,
.alertes-table td {
  padding: 15px 17px;
  border-bottom: 1px solid #edf0f3;
  font-size: 0.84rem;
  vertical-align: middle;
}

.alertes-table th {
  background: #f8fafc;
  color: #647184;
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.035em;
  text-transform: uppercase;
  white-space: nowrap;
}

.alertes-table td {
  color: #465365;
}

.alertes-table tbody tr {
  transition: background 0.15s;
}

.alertes-table tbody tr:hover {
  background: #f9fbfd;
}

.alertes-table tbody tr:last-child td {
  border-bottom: none;
}

.row-unread {
  background: #fffcf2;
}

.row-unread:hover {
  background: #fff8e5 !important;
}

.row-urgent {
  box-shadow: inset 3px 0 0 #c0392b;
}

/* DOCUMENT ET PROPRIÉTAIRE */

.document-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.document-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #eaf0f8;
  color: #17365d;
  font-size: 1rem;
}

.document-cell > div:last-child,
.owner-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.document-cell strong,
.owner-cell strong {
  color: #34465d;
  font-size: 0.83rem;
}

.document-cell small,
.owner-cell small {
  max-width: 220px;
  color: #98a2b3;
  font-size: 0.73rem;
  overflow-wrap: anywhere;
}

.date-cell {
  color: #667085 !important;
  white-space: nowrap;
}

/* BADGES */

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.status-unread,
.type-warning {
  color: #92400e;
  background: #fef3c7;
}

.status-read,
.type-info {
  color: #1d4ed8;
  background: #dbeafe;
}

.status-done {
  color: #166534;
  background: #dcfce7;
}

.type-danger,
.type-expired {
  color: #991b1b;
  background: #fee2e2;
}

/* ACTION */

.read-button {
  padding: 9px 12px;
  border: 1px solid #17365d;
  border-radius: 7px;
  background: #17365d;
  color: white;
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.read-button:hover:not(:disabled) {
  background: #244b78;
}

.read-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.muted {
  color: #a0a9b5;
}

/* CHARGEMENT */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  padding: 35px 20px;
  text-align: center;
}

.loading-state p {
  margin-top: 14px;
  color: #748091;
  font-size: 0.9rem;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #e8edf2;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* VIDE */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 35px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: #edf2f8;
  color: #17365d;
  font-size: 1.8rem;
  font-weight: 800;
}

.empty-state h3 {
  margin: 16px 0 5px;
  color: #17365d;
  font-size: 1.05rem;
}

.empty-state p {
  margin: 0 0 17px;
  color: #8993a2;
  font-size: 0.85rem;
}

.secondary-button {
  padding: 9px 14px;
  border: 1px solid #d8e0e9;
  border-radius: 7px;
  background: white;
  color: #17365d;
  font-weight: 650;
  cursor: pointer;
}

.secondary-button:hover {
  background: #f4f7fa;
}

/* PIED */

.refresh-indicator {
  padding: 10px 20px;
  border-top: 1px solid #edf0f3;
  color: #8a6d1d;
  font-size: 0.8rem;
  text-align: center;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 22px;
  border-top: 1px solid #edf0f3;
  background: #fbfcfd;
  color: #8792a0;
  font-size: 0.8rem;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .alertes-page {
    padding: 20px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 1.35rem;
  }

  .refresh-button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    align-items: stretch;
    flex-direction: column;
  }

  .filters label,
  .filters select {
    width: 100%;
  }

  .reset-button {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
  }
}
</style>

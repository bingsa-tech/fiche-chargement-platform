
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

const peutMarquerCommeLue = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT']
    .includes(String(authStore.role ?? '')),
);

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

const nombreNonLues = computed(() =>
  alertes.value.filter((a) => a.statut === 'NON_LUE').length,
);

const nombreUrgentes = computed(() =>
  alertes.value.filter(
    (a) => a.typeAlerte === 'URGENT' && a.statut !== 'TRAITEE',
  ).length,
);

const nombreExpirees = computed(() =>
  alertes.value.filter((a) => {
    const date = new Date(`${a.dateExpiration.slice(0, 10)}T00:00:00`);
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    return date < aujourdHui && a.statut !== 'TRAITEE';
  }).length,
);

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
      erreur.value = 'Session expirée ou authentification requise.';
    } else if (status === 403) {
      erreur.value = 'Tu ne disposes pas des permissions nécessaires.';
    } else {
      erreur.value = 'Impossible de charger les alertes. Réessaie.';
    }
  } finally {
    chargement.value = false;
  }
}

async function marquerCommeLue(alerte: Alerte): Promise<void> {
  if (!peutMarquerCommeLue.value ||
      alerte.statut !== 'NON_LUE' ||
      actionEnCours.value) {
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

    erreur.value = status === 403
      ? 'Tu n’as pas le droit de modifier le statut de cette alerte.'
      : 'Impossible de marquer cette alerte comme lue.';
  } finally {
    actionEnCours.value = null;
  }
}

onMounted(chargerAlertes);
</script>

<template>
  <main class="alertes-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">GESTION DOCUMENTAIRE</p>
        <h1>Centre des alertes</h1>
        <p class="subtitle">
          Suivi des alertes relatives aux documents des chauffeurs
          et des véhicules.
        </p>
      </div>

      <button
        class="button-secondary"
        :disabled="chargement"
        @click="chargerAlertes"
      >
        {{ chargement ? 'Chargement…' : 'Actualiser' }}
      </button>
    </header>

    <div v-if="erreur" class="error-banner" role="alert">
      {{ erreur }}
    </div>

    <section class="stats-grid" aria-label="Résumé des alertes">
      <article class="stat-card">
        <span>Total des alertes</span>
        <strong>{{ alertes.length }}</strong>
      </article>

      <article class="stat-card">
        <span>Non lues</span>
        <strong>{{ nombreNonLues }}</strong>
      </article>

      <article class="stat-card">
        <span>Urgentes</span>
        <strong>{{ nombreUrgentes }}</strong>
      </article>

      <article class="stat-card">
        <span>Documents expirés</span>
        <strong>{{ nombreExpirees }}</strong>
      </article>
    </section>

    <section class="list-panel">
      <div class="filters">
        <label>
          Statut
          <select v-model="filtreStatut">
            <option value="TOUTES">Tous les statuts</option>
            <option value="NON_LUE">Non lues</option>
            <option value="LUE">Lues</option>
            <option value="TRAITEE">Traitées</option>
          </select>
        </label>

        <label>
          Type d'alerte
          <select v-model="filtreType">
            <option value="TOUS">Tous les types</option>
            <option value="INFORMATION">Information</option>
            <option value="ATTENTION">Attention</option>
            <option value="URGENT">Urgente</option>
            <option value="EXPIRE">Expiré</option>
          </select>
        </label>
      </div>

      <div v-if="chargement && alertes.length === 0" class="empty-state">
        Chargement des alertes…
      </div>

      <div
        v-else-if="!chargement && alertesFiltrees.length === 0"
        class="empty-state"
      >
        Aucune alerte ne correspond aux filtres sélectionnés.
      </div>

      <div v-else class="table-wrapper">
        <table>
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
              :class="{ 'row-unread': alerte.statut === 'NON_LUE' }"
            >
              <td>
                <strong>{{ alerte.typeDocument }}</strong>
                <small>{{ alerte.documentId }}</small>
              </td>

              <td>
                {{ alerte.proprietaireType }}
                <small>{{ alerte.proprietaireId }}</small>
              </td>

              <td>{{ formaterDate(alerte.dateExpiration) }}</td>

              <td>
                <span class="status-pill" :class="classeType(alerte.typeAlerte)">
                  {{ libelleType(alerte.typeAlerte) }}
                </span>
              </td>

              <td>
                <span class="status-pill" :class="classeStatut(alerte.statut)">
                  {{ libelleStatut(alerte.statut) }}
                </span>
              </td>

              <td>
                <button
                  v-if="alerte.statut === 'NON_LUE' && peutMarquerCommeLue"
                  class="button-primary"
                  :disabled="actionEnCours !== null"
                  @click="marquerCommeLue(alerte)"
                >
                  {{
                    actionEnCours === alerte.id
                      ? 'En cours…'
                      : 'Marquer comme lue'
                  }}
                </button>
                <span v-else class="muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.alertes-page {
  padding: 28px;
  color: var(--text-primary, #1f2937);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  color: #64748b;
  margin-top: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card,
.list-panel {
  background: var(--surface, #fff);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.stat-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card span,
.muted {
  color: #64748b;
  font-size: 13px;
}

.stat-card strong {
  font-size: 28px;
}

.list-panel {
  overflow: hidden;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 18px;
  border-bottom: 1px solid #e2e8f0;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}

select {
  min-width: 180px;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: white;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  vertical-align: middle;
}

th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  white-space: nowrap;
}

td strong,
td small {
  display: block;
}

td small {
  max-width: 220px;
  margin-top: 5px;
  color: #64748b;
  overflow-wrap: anywhere;
}

.row-unread {
  background: #fffbeb;
}

.status-pill {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
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

.button-primary,
.button-secondary {
  padding: 9px 12px;
  border: 0;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.button-primary {
  background: #1d4ed8;
  color: white;
}

.button-secondary {
  background: #e2e8f0;
  color: #1e293b;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
}

.error-banner {
  margin-bottom: 18px;
  padding: 12px 16px;
  color: #991b1b;
  background: #fee2e2;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .alertes-page {
    padding: 16px;
  }
}

@media (max-width: 560px) {
  .page-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

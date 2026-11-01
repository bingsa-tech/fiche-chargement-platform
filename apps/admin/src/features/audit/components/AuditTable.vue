
<script setup lang="ts">
import type { AuditLog } from '../types/audit.types';

defineProps<{
  logs: AuditLog[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: 'details', log: AuditLog): void;
}>();

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(value));
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    CREATE: 'Création',
    UPDATE: 'Modification',
    DELETE: 'Suppression',
  };

  return labels[action.toUpperCase()] ?? action;
}
</script>

<template>
  <section class="audit-table-card">
    <div class="table-heading">
      <div>
        <h2>Historique des opérations</h2>
        <p>Journal chronologique des actions effectuées.</p>
      </div>
    </div>

    <div v-if="loading" class="table-state">
      Chargement des événements...
    </div>

    <div v-else-if="logs.length === 0" class="table-state">
      Aucun événement trouvé.
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date et heure</th>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Entité</th>
            <th>ID de l'entité</th>
            <th>Appareil</th>
            <th>Détails</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td class="date-cell">
              {{ formatDate(log.dateHeure) }}
            </td>

            <td>
              {{ log.utilisateurId ?? 'Inconnu' }}
            </td>

            <td>
              <span
                class="action-badge"
                :class="log.action.toLowerCase()"
              >
                {{ actionLabel(log.action) }}
              </span>
            </td>

            <td>{{ log.entite }}</td>

            <td class="id-cell">
              {{ log.entiteId }}
            </td>

            <td>{{ log.appareilId ?? 'Non renseigné' }}</td>

            <td>
              <button
                type="button"
                class="details-button"
                @click="emit('details', log)"
              >
                Consulter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.audit-table-card {
  overflow: hidden;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.table-heading {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.table-heading h2 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #111827;
}

.table-heading p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  font-size: 12px;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

th {
  background: #f9fafb;
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

td {
  color: #374151;
}

tr:last-child td {
  border-bottom: none;
}

.date-cell {
  font-variant-numeric: tabular-nums;
}

.id-cell {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-badge {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.action-badge.create {
  background: #dcfce7;
  color: #166534;
}

.action-badge.update {
  background: #fef3c7;
  color: #92400e;
}

.action-badge.delete {
  background: #fee2e2;
  color: #991b1b;
}

.details-button {
  padding: 7px 11px;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.table-state {
  padding: 45px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}
</style>

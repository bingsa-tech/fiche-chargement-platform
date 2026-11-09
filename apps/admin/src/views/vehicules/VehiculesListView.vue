
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

// Statistiques
const totalVehicules = computed(() => vehicules.value.length);

const vehiculesActifs = computed(() =>
  vehicules.value.filter(v => v.statut === 'ACTIF').length,
);

const vehiculesInactifs = computed(() =>
  vehicules.value.filter(v => v.statut === 'INACTIF').length,
);

const vehiculesMaintenance = computed(() =>
  vehicules.value.filter(v => v.statut === 'MAINTENANCE').length,
);

async function loadVehicules(): Promise<void> {
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

function goToCreate(): void {
  void router.push({ name: 'vehicule-create' });
}

function goToEdit(id: string): void {
  void router.push({
    name: 'vehicule-edit',
    params: { id },
  });
}

async function removeVehicule(vehicule: Vehicule): Promise<void> {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le véhicule ${vehicule.plaqueImmatriculation} ?`,
  );

  if (!confirmed) return;

  error.value = '';
  success.value = '';

  try {
    await deleteVehicule(vehicule.id);

    // Mise à jour locale après suppression confirmée
    vehicules.value = vehicules.value.filter(
      v => v.id !== vehicule.id,
    );

    success.value = 'Véhicule supprimé avec succès.';
  } catch (err) {
    console.error(err);
    error.value =
      'Impossible de supprimer le véhicule. Il peut être utilisé dans une fiche ou contenir des documents.';
  }
}

function formatDate(date: string): string {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('fr-CA');
}

function getProprietaireName(vehicule: Vehicule): string {
  if (!vehicule.proprietaire) {
    return 'Aucun propriétaire';
  }

  return `${vehicule.proprietaire.nom} ${vehicule.proprietaire.prenom}`;
}

function getStatutClass(statut: string): string {
  switch (statut) {
    case 'ACTIF':
      return 'status-active';

    case 'INACTIF':
      return 'status-inactive';

    case 'MAINTENANCE':
      return 'status-maintenance';

    default:
      return 'status-unknown';
  }
}

onMounted(loadVehicules);
</script>

<template>
  <div class="vehicules-page">

    <!-- Fil d'Ariane -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <strong>Véhicules</strong>
    </div>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">VH</div>

        <div>
          <h1>Gestion des véhicules</h1>
          <p>
            Gestion et suivi du parc de véhicules de transport.
          </p>
        </div>
      </div>

      <button
        v-if="canCreate"
        type="button"
        class="primary-button"
        @click="goToCreate"
      >
        <span class="button-plus">+</span>
        Nouveau véhicule
      </button>
    </header>

    <!-- Messages -->
    <div v-if="success" class="alert success">
      <span>{{ success }}</span>
      <button
        type="button"
        aria-label="Fermer"
        @click="success = ''"
      >
        ×
      </button>
    </div>

    <div v-if="error" class="alert error">
      <span>{{ error }}</span>
      <button
        type="button"
        aria-label="Fermer"
        @click="error = ''"
      >
        ×
      </button>
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon navy">VH</div>
        <div>
          <span class="stat-label">Total véhicules</span>
          <strong class="stat-value">{{ totalVehicules }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">✓</div>
        <div>
          <span class="stat-label">Véhicules actifs</span>
          <strong class="stat-value">{{ vehiculesActifs }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon gray">—</div>
        <div>
          <span class="stat-label">Véhicules inactifs</span>
          <strong class="stat-value">{{ vehiculesInactifs }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon gold">!</div>
        <div>
          <span class="stat-label">En maintenance</span>
          <strong class="stat-value">{{ vehiculesMaintenance }}</strong>
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>Chargement des véhicules...</p>
    </div>

    <!-- Contenu -->
    <div v-else class="table-card">

      <div class="table-card-header">
        <div>
          <h2>Liste des véhicules</h2>
          <p>
            {{ totalVehicules }}
            véhicule{{ totalVehicules > 1 ? 's' : '' }} enregistré{{ totalVehicules > 1 ? 's' : '' }}
          </p>
        </div>

        <button
          type="button"
          class="refresh-button"
          :disabled="loading"
          @click="loadVehicules"
        >
          ↻ Actualiser
        </button>
      </div>

      <div v-if="vehicules.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Véhicule</th>
              <th>Type</th>
              <th>Marque / Modèle</th>
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
                <div class="vehicle-identity">
                  <div class="vehicle-avatar">VH</div>
                  <div>
                    <strong class="vehicle-plate">
                      {{ vehicule.plaqueImmatriculation }}
                    </strong>
                    <span class="vehicle-reference">
                      {{ vehicule.id.slice(0, 8) }}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span class="type-label">
                  {{ vehicule.type }}
                </span>
              </td>

              <td>
                <div class="vehicle-model">
                  <strong>{{ vehicule.marque || '—' }}</strong>
                  <span>{{ vehicule.modele || '—' }}</span>
                </div>
              </td>

              <td>
                <span class="capacity-value">
                  {{ vehicule.capacite }}
                </span>
              </td>

              <td>
                <span class="owner-name">
                  {{ getProprietaireName(vehicule) }}
                </span>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="getStatutClass(vehicule.statut)"
                >
                  <span class="status-dot"></span>
                  {{ vehicule.statut }}
                </span>
              </td>

              <td class="date-cell">
                {{ formatDate(vehicule.createdAt) }}
              </td>

              <td>
                <div class="actions">
                  <button
                    v-if="canEdit"
                    type="button"
                    class="action-button edit"
                    title="Modifier le véhicule"
                    @click="goToEdit(vehicule.id)"
                  >
                    Modifier
                  </button>

                  <button
                    v-if="canDelete"
                    type="button"
                    class="action-button delete"
                    title="Supprimer le véhicule"
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <div class="empty-icon">VH</div>
        <h3>Aucun véhicule enregistré</h3>
        <p>
          Aucun véhicule n'est actuellement disponible dans la liste.
        </p>

        <button
          v-if="canCreate"
          type="button"
          class="primary-button"
          @click="goToCreate"
        >
          + Ajouter le premier véhicule
        </button>
      </div>

      <!-- Pied de tableau -->
      <div v-if="vehicules.length > 0" class="table-footer">
        <span>
          Affichage de
          <strong>{{ vehicules.length }}</strong>
          véhicule{{ vehicules.length > 1 ? 's' : '' }}
        </span>

        <span class="footer-indicator">
          Données des véhicules
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vehicules-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  box-sizing: border-box;
  color: #243247;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #7b8797;
  font-size: 13px;
}

.breadcrumb strong,
.separator {
  color: #17365d;
}

.separator {
  color: #c5a13b;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #17365d;
  color: #e2c46b;
  font-size: 15px;
  font-weight: 800;
}

.page-header h1 {
  margin: 0 0 6px;
  color: #17365d;
  font-size: 26px;
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: #7b8797;
  font-size: 13px;
}

/* Buttons */
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 41px;
  padding: 10px 16px;
  border: 1px solid #17365d;
  border-radius: 7px;
  background: #17365d;
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.primary-button:hover {
  background: #102944;
}

.button-plus {
  color: #e2c46b;
  font-size: 19px;
  line-height: 12px;
}

/* Alerts */
.alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 17px;
  padding: 12px 15px;
  border-radius: 7px;
  font-size: 13px;
}

.alert button {
  border: 0;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.alert.success {
  border: 1px solid #cce8d4;
  background: #f0faf3;
  color: #267442;
}

.alert.error {
  border: 1px solid #f1caca;
  background: #fff4f4;
  color: #9b3030;
}

/* Statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 88px;
  padding: 17px;
  border: 1px solid #e7ebf0;
  border-radius: 9px;
  background: white;
  box-shadow: 0 2px 7px rgb(20 40 70 / 3%);
}

.stat-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
}

.stat-icon.navy {
  background: #eaf0f7;
  color: #17365d;
}

.stat-icon.green {
  background: #e8f6ed;
  color: #28804a;
}

.stat-icon.gray {
  background: #f0f2f5;
  color: #687586;
}

.stat-icon.gold {
  background: #f8f2df;
  color: #92721d;
}

.stat-label {
  display: block;
  margin-bottom: 5px;
  color: #8490a0;
  font-size: 11px;
}

.stat-value {
  color: #17365d;
  font-size: 23px;
  font-weight: 750;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  color: #7b8797;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e6ebf1;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Table card */
.table-card {
  overflow: hidden;
  border: 1px solid #e7ebf0;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgb(20 40 70 / 3%);
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f3;
}

.table-card-header h2 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 16px;
}

.table-card-header p {
  margin: 0;
  color: #8993a1;
  font-size: 12px;
}

.refresh-button {
  padding: 8px 12px;
  border: 1px solid #dce3eb;
  border-radius: 6px;
  background: white;
  color: #17365d;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.refresh-button:hover {
  background: #f5f7fa;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Table */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

thead {
  background: #f7f9fb;
}

th {
  padding: 13px 15px;
  color: #68778a;
  font-size: 11px;
  font-weight: 750;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

td {
  padding: 14px 15px;
  border-top: 1px solid #edf0f3;
  color: #46556a;
  font-size: 12px;
}

tbody tr:hover {
  background: #fafbfd;
}

/* Vehicle identity */
.vehicle-identity {
  display: flex;
  align-items: center;
  gap: 11px;
}

.vehicle-avatar {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: #eaf0f7;
  color: #17365d;
  font-size: 10px;
  font-weight: 800;
}

.vehicle-plate {
  display: block;
  color: #17365d;
  font-size: 12px;
}

.vehicle-reference {
  display: block;
  margin-top: 4px;
  color: #a0a9b5;
  font-size: 10px;
}

.type-label {
  color: #53657a;
  font-weight: 600;
}

.vehicle-model {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-model strong {
  color: #405066;
  font-size: 12px;
}

.vehicle-model span {
  color: #8993a1;
  font-size: 11px;
}

.capacity-value {
  color: #17365d;
  font-weight: 700;
}

.owner-name {
  color: #536174;
}

.date-cell {
  color: #8993a1;
  font-size: 11px;
}

/* Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 750;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-active {
  background: #e9f6ed;
  color: #267442;
}

.status-inactive {
  background: #f0f2f5;
  color: #687586;
}

.status-maintenance {
  background: #fbf3df;
  color: #92721d;
}

.status-unknown {
  background: #f0f2f5;
  color: #687586;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.action-button {
  padding: 7px 9px;
  border: 1px solid transparent;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.action-button.edit {
  border-color: #dce5ef;
  background: #f0f4f9;
  color: #17365d;
}

.action-button.edit:hover {
  background: #e3ebf4;
}

.action-button.delete {
  border-color: #f1d5d5;
  background: #fff3f3;
  color: #a13e3e;
}

.action-button.delete:hover {
  background: #fee7e7;
}

.no-action {
  color: #9ba4b0;
  font-size: 11px;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  text-align: center;
}

.empty-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin-bottom: 15px;
  border-radius: 14px;
  background: #eaf0f7;
  color: #17365d;
  font-size: 14px;
  font-weight: 800;
}

.empty-state h3 {
  margin: 0 0 7px;
  color: #17365d;
  font-size: 16px;
}

.empty-state p {
  margin: 0 0 20px;
  color: #8993a1;
  font-size: 12px;
}

/* Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-top: 1px solid #edf0f3;
  color: #8993a1;
  font-size: 11px;
}

.table-footer strong {
  color: #17365d;
}

.footer-indicator {
  color: #a0a9b5;
}

/* Responsive */
@media (max-width: 1050px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .vehicules-page {
    padding: 20px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .table-card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .table-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

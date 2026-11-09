
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useItineraireStore } from '../../stores/itineraire.store';

const router = useRouter();
const store = useItineraireStore();

onMounted(() => {
  store.fetchItineraires();
});

function goToCreate() {
  router.push({ name: 'itineraires-create' });
}

function goToEdit(id: string) {
  router.push({ name: 'itineraires-edit', params: { id } });
}

async function handleDelete(id: string) {
  const confirmed = confirm(
    'Voulez-vous vraiment supprimer cet itinéraire ? Cette action est irréversible.',
  );

  if (!confirmed) return;

  try {
    await store.removeItineraire(id);
  } catch (err: any) {
    alert(
      err?.response?.data?.message ||
      'Erreur lors de la suppression de l’itinéraire.',
    );
  }
}
</script>

<template>
  <div class="page-container">

    <!-- EN-TÊTE -->
    <header class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <span>Administration</span>
          <span class="breadcrumb-separator">/</span>
          <span class="current">Itinéraires</span>
        </div>

        <div class="title-row">
          <div class="title-icon">
            <span>↔</span>
          </div>

          <div>
            <h1>Gestion des itinéraires</h1>
            <p>
              Consultez et gérez les itinéraires et leurs destinations.
            </p>
          </div>
        </div>
      </div>

      <button class="btn-primary" @click="goToCreate">
        <span class="btn-icon">+</span>
        Nouvel itinéraire
      </button>
    </header>

    <!-- INDICATEURS -->
    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon icon-total">↔</div>
        <div>
          <span class="stat-label">Total itinéraires</span>
          <strong class="stat-value">
            {{ store.itineraires.length }}
          </strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon icon-active">✓</div>
        <div>
          <span class="stat-label">Itinéraires actifs</span>
          <strong class="stat-value">
            {{ store.itineraires.filter(i => i.statut === 'ACTIF').length }}
          </strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon icon-inactive">○</div>
        <div>
          <span class="stat-label">Itinéraires inactifs</span>
          <strong class="stat-value">
            {{ store.itineraires.filter(i => i.statut !== 'ACTIF').length }}
          </strong>
        </div>
      </article>
    </section>

    <!-- ERREUR -->
    <div v-if="store.error" class="alert-error">
      <span class="alert-icon">!</span>
      <span>{{ store.error }}</span>
    </div>

    <!-- TABLEAU -->
    <section class="content-card">

      <div class="card-header">
        <div>
          <h2>Liste des itinéraires</h2>
          <p>Répertoire des itinéraires enregistrés dans FOPTRAC.</p>
        </div>

        <span class="record-count">
          {{ store.itineraires.length }}
          {{ store.itineraires.length > 1 ? 'itinéraires' : 'itinéraire' }}
        </span>
      </div>

      <!-- CHARGEMENT -->
      <div v-if="store.loading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des itinéraires...</p>
      </div>

      <!-- CONTENU -->
      <div v-else-if="!store.error" class="table-wrapper">

        <table class="data-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>LIBELLÉ</th>
              <th>DESTINATION</th>
              <th>STATUT</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="itineraire in store.itineraires"
              :key="itineraire.id"
            >
              <td>
                <span class="code-badge">
                  {{ itineraire.code }}
                </span>
              </td>

              <td>
                <span class="route-name">
                  {{ itineraire.libelle }}
                </span>
              </td>

              <td>
                <div class="destination-cell">
                  <span class="destination-icon">📍</span>
                  {{ itineraire.destination?.nom || 'Non renseignée' }}
                </div>
              </td>

              <td>
                <span
                  :class="[
                    'status-badge',
                    itineraire.statut === 'ACTIF'
                      ? 'status-active'
                      : 'status-inactive'
                  ]"
                >
                  <span class="status-dot"></span>
                  {{ itineraire.statut }}
                </span>
              </td>

              <td>
                <div class="actions-cell">
                  <button
                    class="btn-action btn-edit"
                    title="Modifier cet itinéraire"
                    @click="goToEdit(itineraire.id)"
                  >
                    <span>✎</span>
                    Modifier
                  </button>

                  <button
                    class="btn-action btn-delete"
                    title="Supprimer cet itinéraire"
                    @click="handleDelete(itineraire.id)"
                  >
                    <span>×</span>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>

            <!-- AUCUN RÉSULTAT -->
            <tr v-if="store.itineraires.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <div class="empty-icon">↔</div>
                  <h3>Aucun itinéraire enregistré</h3>
                  <p>
                    Commencez par créer votre premier itinéraire.
                  </p>
                  <button class="btn-primary btn-empty" @click="goToCreate">
                    + Créer un itinéraire
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </section>

    <footer class="page-footer">
      <span>FOPTRAC — Gestion des transports</span>
      <span>Administration des itinéraires</span>
    </footer>

  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #1e293b;
}

/* EN-TÊTE */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 28px;
}

.breadcrumb {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 16px;
  color: #94a3b8;
  font-size: 12px;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #17365d;
  font-weight: 600;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17365d;
  color: #c5a13b;
  border-radius: 12px;
  font-size: 26px;
  font-weight: 700;
}

.page-header h1 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 25px;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* BOUTONS */

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 18px;
  border: 1px solid #17365d;
  border-radius: 8px;
  background: #17365d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary:hover {
  background: #244a76;
  border-color: #244a76;
  transform: translateY(-1px);
}

.btn-icon {
  color: #e2c46d;
  font-size: 20px;
  line-height: 1;
}

/* STATISTIQUES */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.025);
}

.stat-icon {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 21px;
  font-weight: 700;
}

.icon-total {
  background: #eaf0f7;
  color: #17365d;
}

.icon-active {
  background: #dcfce7;
  color: #15803d;
}

.icon-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.stat-label {
  display: block;
  margin-bottom: 5px;
  color: #64748b;
  font-size: 12px;
}

.stat-value {
  color: #17365d;
  font-size: 23px;
  font-weight: 700;
}

/* CARTE TABLEAU */

.content-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.035);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 20px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 16px;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
}

.record-count {
  padding: 6px 11px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
}

/* TABLEAU */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.data-table th {
  padding: 15px 20px;
  background: #f8fafc;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #fafbfd;
}

.code-badge {
  display: inline-block;
  padding: 5px 9px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: #f8fafc;
  color: #17365d;
  font-size: 11px;
  font-weight: 700;
}

.route-name {
  color: #1e293b;
  font-weight: 600;
}

.destination-cell {
  display: flex;
  align-items: center;
  gap: 7px;
}

.destination-icon {
  font-size: 13px;
}

/* STATUTS */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* ACTIONS */

.text-right {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  white-space: nowrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-edit {
  border-color: #dbe4ef;
  background: #f1f5f9;
  color: #17365d;
}

.btn-edit:hover {
  background: #e2e8f0;
}

.btn-delete {
  border-color: #fecaca;
  background: #fff7f7;
  color: #b91c1c;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* CHARGEMENT ET ERREUR */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 20px;
  color: #64748b;
  font-size: 13px;
}

.loader {
  width: 30px;
  height: 30px;
  margin-bottom: 12px;
  border: 3px solid #e2e8f0;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
}

.alert-icon {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee2e2;
  font-weight: 700;
}

/* ÉTAT VIDE */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  width: 55px;
  height: 55px;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #17365d;
  font-size: 27px;
}

.empty-state h3 {
  margin: 0 0 7px;
  color: #17365d;
  font-size: 16px;
}

.empty-state p {
  margin: 0 0 18px;
  color: #94a3b8;
  font-size: 12px;
}

.btn-empty {
  padding: 9px 15px;
  font-size: 12px;
}

/* PIED DE PAGE */

.page-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 22px;
  padding: 12px 2px;
  color: #94a3b8;
  font-size: 11px;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .page-container {
    padding: 22px 18px;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 15px;
  }
}

@media (max-width: 650px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header .btn-primary {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-footer {
    flex-direction: column;
  }

  .data-table {
    min-width: 760px;
  }
}
</style>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  presenceApi,
  type PresenceSession,
} from '../../api/presence.api';

const sessions = ref<PresenceSession[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const error = ref<string | null>(null);
const lastUpdated = ref<Date | null>(null);

const REFRESH_INTERVAL = 30_000;

let refreshTimer: ReturnType<typeof setInterval> | null = null;

const totalOnline = computed(() => sessions.value.length);

const webCount = computed(
  () => sessions.value.filter((s) => s.deviceType === 'WEB').length,
);

const mobileCount = computed(
  () => sessions.value.filter((s) => s.deviceType === 'MOBILE').length,
);

async function loadPresence(isAutomatic = false): Promise<void> {
  if (loading.value) return;

  if (isAutomatic) {
    refreshing.value = true;
  } else {
    loading.value = true;
  }

  error.value = null;

  try {
    const response = await presenceApi.getOnline();

    sessions.value = response.sessions ?? [];
    lastUpdated.value = new Date();
  } catch (err: unknown) {
    console.error('[PRESENCE] Erreur de chargement', err);
    error.value =
      'Impossible de récupérer les utilisateurs connectés.';
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date inconnue';

  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

function formatRelative(value: string): string {
  const date = new Date(value);
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );

  if (Number.isNaN(date.getTime())) return 'Inconnue';
  if (seconds < 60) return `Il y a ${seconds} s`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `Il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Il y a ${hours} h`;

  return `Il y a ${Math.floor(hours / 24)} j`;
}

function fullName(session: PresenceSession): string {
  return `${session.prenom ?? ''} ${session.nom ?? ''}`.trim()
    || session.username;
}

function deviceLabel(session: PresenceSession): string {
  if (session.deviceName) return session.deviceName;

  return session.deviceType === 'MOBILE'
    ? 'Appareil mobile'
    : 'Navigateur Web';
}

function roleLabel(role: string | null): string {
  if (!role) return 'Non défini';

  return role.replaceAll('_', ' ');
}

function stopRefresh(): void {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

onMounted(() => {
  void loadPresence();

  refreshTimer = setInterval(() => {
    void loadPresence(true);
  }, REFRESH_INTERVAL);
});

onUnmounted(stopRefresh);
</script>

<template>
  <div class="presence-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">SUPERVISION DU SYSTÈME</p>
        <h1>Présence en ligne</h1>
        <p class="subtitle">
          Suivez les utilisateurs actuellement connectés à la plateforme.
        </p>
      </div>

      <button
        class="refresh-button"
        type="button"
        :disabled="loading || refreshing"
        @click="loadPresence()"
      >
        <span>↻</span>
        {{ refreshing || loading ? 'Actualisation...' : 'Actualiser' }}
      </button>
    </div>

    <div class="update-info">
      <span class="live-dot"></span>
      Surveillance active
      <span class="update-time">
        <template v-if="lastUpdated">
          Dernière mise à jour : {{ lastUpdated.toLocaleTimeString('fr-CA') }}
        </template>
        <template v-else>
          En attente des données
        </template>
      </span>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button type="button" @click="loadPresence()">Réessayer</button>
    </div>

    <section class="stats-grid">
      <article class="stat-card main-stat">
        <div class="stat-icon">●</div>
        <div>
          <p>Utilisateurs en ligne</p>
          <strong>{{ totalOnline }}</strong>
          <span>Sessions actives</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon web-icon">⌘</div>
        <div>
          <p>Connexions Web</p>
          <strong>{{ webCount }}</strong>
          <span>Navigateurs</span>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon mobile-icon">▣</div>
        <div>
          <p>Connexions mobiles</p>
          <strong>{{ mobileCount }}</strong>
          <span>Applications mobiles</span>
        </div>
      </article>
    </section>

    <section class="users-panel">
      <div class="panel-heading">
        <div>
          <h2>Utilisateurs connectés</h2>
          <p>Liste des sessions actives en temps réel</p>
        </div>

        <span class="result-count">{{ totalOnline }} session(s)</span>
      </div>

      <div v-if="loading && !lastUpdated" class="state-message">
        Chargement des présences...
      </div>

      <div
        v-else-if="!sessions.length"
        class="empty-state"
      >
        <div class="empty-icon">◉</div>
        <h3>Aucun utilisateur en ligne</h3>
        <p>Les sessions actives apparaîtront ici.</p>
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>UTILISATEUR</th>
              <th>RÔLE</th>
              <th>GARE</th>
              <th>APPAREIL</th>
              <th>CONNECTÉ DEPUIS</th>
              <th>DERNIÈRE ACTIVITÉ</th>
              <th>STATUT</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="session in sessions" :key="session.sessionId">
              <td>
                <div class="user-cell">
                  <div class="avatar">
                    {{ fullName(session).charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <strong>{{ fullName(session) }}</strong>
                    <small>@{{ session.username }}</small>
                  </div>
                </div>
              </td>

              <td>
                <span class="role-badge">
                  {{ roleLabel(session.role) }}
                </span>
              </td>

              <td>
                <div v-if="session.gare" class="gare-cell">
                  <strong>{{ session.gare.code }}</strong>
                  <small>{{ session.gare.nom }}</small>
                </div>
                <span v-else class="muted">Non affectée</span>
              </td>

              <td>
                <div class="device-cell">
                  <span>
                    {{ session.deviceType === 'MOBILE' ? '▣' : '⌘' }}
                  </span>
                  <div>
                    {{ deviceLabel(session) }}
                    <small>{{ session.deviceType }}</small>
                  </div>
                </div>
              </td>

              <td>{{ formatDate(session.connectedAt) }}</td>

              <td>
                <strong class="activity-time">
                  {{ formatRelative(session.lastSeenAt) }}
                </strong>
              </td>

              <td>
                <span class="online-badge">
                  <i></i> En ligne
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="page-footnote">
      Actualisation automatique toutes les 30 secondes.
      Une session est considérée en ligne si son activité remonte à moins de
      90 secondes et qu'elle n'est ni expirée ni révoquée.
    </p>
  </div>
</template>

<style scoped>
.presence-page {
  color: #172033;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}

.eyebrow {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  margin: 0 0 8px;
}

h1 {
  font-size: 27px;
  margin: 0;
  font-weight: 750;
}

.subtitle,
.panel-heading p {
  color: #718096;
  font-size: 13px;
  margin: 7px 0 0;
}

.refresh-button {
  border: 0;
  border-radius: 9px;
  padding: 11px 16px;
  background: #1d4ed8;
  color: white;
  font-weight: 650;
  cursor: pointer;
}

.refresh-button:disabled {
  opacity: .6;
  cursor: wait;
}

.refresh-button span {
  margin-right: 7px;
  font-size: 17px;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #15803d;
  font-size: 12px;
  font-weight: 650;
  margin-bottom: 20px;
}

.live-dot,
.online-badge i {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
}

.update-time {
  color: #8490a3;
  font-weight: 400;
  margin-left: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 22px;
  background: white;
  border: 1px solid #e8edf3;
  border-radius: 13px;
  box-shadow: 0 3px 12px rgba(15, 23, 42, .025);
}

.main-stat {
  border-left: 4px solid #2563eb;
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #2563eb;
  background: #eff6ff;
  font-size: 23px;
}

.web-icon {
  color: #7c3aed;
  background: #f5f3ff;
}

.mobile-icon {
  color: #0891b2;
  background: #ecfeff;
}

.stat-card p {
  color: #64748b;
  font-size: 12px;
  margin: 0 0 5px;
}

.stat-card strong {
  display: block;
  font-size: 27px;
  line-height: 1.1;
}

.stat-card span {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  margin-top: 5px;
}

.users-panel {
  background: white;
  border: 1px solid #e8edf3;
  border-radius: 13px;
  overflow: hidden;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f4;
}

.panel-heading h2 {
  margin: 0;
  font-size: 16px;
}

.result-count {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 7px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
}

th {
  background: #f8fafc;
  color: #718096;
  text-align: left;
  font-size: 10px;
  letter-spacing: .055em;
  padding: 14px 16px;
  white-space: nowrap;
}

td {
  padding: 15px 16px;
  border-top: 1px solid #f0f2f5;
  font-size: 12px;
  color: #475569;
  white-space: nowrap;
}

tbody tr:hover {
  background: #fafcff;
}

.user-cell,
.device-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eaf1ff;
  color: #2456bd;
  font-weight: 800;
}

.user-cell strong,
.gare-cell strong {
  display: block;
  color: #1e293b;
  font-size: 12px;
}

.user-cell small,
.gare-cell small,
.device-cell small {
  display: block;
  color: #94a3b8;
  font-size: 10px;
  margin-top: 4px;
}

.role-badge {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 700;
}

.device-cell > span {
  font-size: 18px;
  color: #64748b;
}

.activity-time {
  color: #334155;
  font-weight: 600;
}

.online-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  background: #ecfdf3;
  color: #15803d;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.online-badge i {
  width: 6px;
  height: 6px;
}

.muted {
  color: #94a3b8;
}

.state-message,
.empty-state {
  padding: 50px 20px;
  text-align: center;
  color: #64748b;
}

.empty-icon {
  font-size: 35px;
  color: #94a3b8;
}

.empty-state h3 {
  color: #334155;
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 12px;
}

.error-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  margin-bottom: 16px;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 12px;
}

.error-message button {
  border: 0;
  background: transparent;
  color: #991b1b;
  text-decoration: underline;
  cursor: pointer;
}

.page-footnote {
  color: #94a3b8;
  font-size: 11px;
  margin-top: 15px;
}

@media (max-width: 850px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .update-info {
    flex-wrap: wrap;
  }

  .update-time {
    width: 100%;
    margin-left: 17px;
  }
}
</style>

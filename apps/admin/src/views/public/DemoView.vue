
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeSection = ref('overview');

const demoData = {
  gares: 12,
  vehicules: 48,
  chauffeurs: 36,
  fiches: 125,
};

const recentOperations = [
  {
    id: 'FC-2026-001',
    gare: 'Gare Centrale',
    chauffeur: 'Jean Dupont',
    vehicule: 'ABC-123',
    statut: 'Validée',
  },
  {
    id: 'FC-2026-002',
    gare: 'Gare du Nord',
    chauffeur: 'Marc Martin',
    vehicule: 'DEF-456',
    statut: 'En attente',
  },
  {
    id: 'FC-2026-003',
    gare: 'Gare Centrale',
    chauffeur: 'Paul Bernard',
    vehicule: 'GHI-789',
    statut: 'Validée',
  },
  {
    id: 'FC-2026-004',
    gare: 'Gare du Sud',
    chauffeur: 'David Laurent',
    vehicule: 'JKL-012',
    statut: 'À vérifier',
  },
];

const menuItems = [
  { id: 'overview', label: 'Vue générale', icon: '▦' },
  { id: 'gares', label: 'Gares', icon: '⌂' },
  { id: 'vehicules', label: 'Véhicules', icon: '▣' },
  { id: 'chauffeurs', label: 'Chauffeurs', icon: '♙' },
  { id: 'fiches', label: 'Fiches de chargement', icon: '▤' },
  { id: 'alertes', label: 'Alertes', icon: '◷' },
];

function goToLogin() {
  router.push({ name: 'login' });
}

function goToHome() {
  router.push({ name: 'landing' });
}
</script>

<template>
  <main class="demo-page">
    <header class="demo-header">
      <div class="demo-brand">
        <img src="../../assets/logo.png" alt="Logo" />
        <div>
          <strong>FICHE CHARGEMENT</strong>
          <span>Environnement de démonstration</span>
        </div>
      </div>

      <div class="demo-header-actions">
        <span class="demo-mode">
          <span></span>
          MODE DÉMONSTRATION
        </span>
        <button class="login-button" @click="goToLogin">
          Connexion réelle →
        </button>
      </div>
    </header>

    <div class="demo-banner">
      <span>ℹ</span>
      Vous consultez une démonstration. Toutes les informations affichées
      sont fictives et aucune opération réelle n'est effectuée.
    </div>

    <div class="demo-layout">
      <aside class="demo-sidebar">
        <div class="sidebar-heading">ESPACE DE TRAVAIL</div>

        <button
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          {{ item.label }}
        </button>

        <div class="sidebar-bottom">
          <div class="demo-user">
            <div class="user-avatar">D</div>
            <div>
              <strong>Utilisateur démo</strong>
              <span>Accès en lecture seule</span>
            </div>
          </div>

          <button class="back-button" @click="goToHome">
            ← Retour à l'accueil
          </button>
        </div>
      </aside>

      <section class="demo-content">
        <div class="content-heading">
          <div>
            <span class="eyebrow">TABLEAU DE BORD / DÉMONSTRATION</span>
            <h1>
              {{
                menuItems.find(item => item.id === activeSection)?.label
                ?? 'Vue générale'
              }}
            </h1>
            <p>Bienvenue dans l'environnement de démonstration.</p>
          </div>

          <span class="readonly-badge">LECTURE SEULE</span>
        </div>

        <template v-if="activeSection === 'overview'">
          <div class="stats-grid">
            <article class="stat-card">
              <div class="stat-icon blue">⌂</div>
              <span>Gares enregistrées</span>
              <strong>{{ demoData.gares }}</strong>
              <small>Données fictives</small>
            </article>

            <article class="stat-card">
              <div class="stat-icon purple">▣</div>
              <span>Véhicules</span>
              <strong>{{ demoData.vehicules }}</strong>
              <small>Données fictives</small>
            </article>

            <article class="stat-card">
              <div class="stat-icon green">♙</div>
              <span>Chauffeurs</span>
              <strong>{{ demoData.chauffeurs }}</strong>
              <small>Données fictives</small>
            </article>

            <article class="stat-card">
              <div class="stat-icon orange">▤</div>
              <span>Fiches de chargement</span>
              <strong>{{ demoData.fiches }}</strong>
              <small>Données fictives</small>
            </article>
          </div>

          <section class="data-panel">
            <div class="panel-heading">
              <div>
                <h2>Opérations récentes</h2>
                <p>Exemples de fiches de chargement fictives</p>
              </div>
              <span class="sample-label">EXEMPLES</span>
            </div>

            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Gare</th>
                    <th>Chauffeur</th>
                    <th>Véhicule</th>
                    <th>Statut</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="operation in recentOperations" :key="operation.id">
                    <td class="reference">{{ operation.id }}</td>
                    <td>{{ operation.gare }}</td>
                    <td>{{ operation.chauffeur }}</td>
                    <td>{{ operation.vehicule }}</td>
                    <td>
                      <span
                        class="status"
                        :class="{
                          validated: operation.statut === 'Validée',
                          pending: operation.statut === 'En attente',
                          warning: operation.statut === 'À vérifier',
                        }"
                      >
                        {{ operation.statut }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="data-panel section-placeholder">
            <div class="placeholder-icon">▦</div>
            <h2>{{ menuItems.find(item => item.id === activeSection)?.label }}</h2>
            <p>
              Cette section illustre une fonctionnalité de la plateforme.
              Les données affichées dans cet environnement sont fictives.
            </p>
            <span class="readonly-badge">MODULE DE DÉMONSTRATION</span>
          </section>
        </template>

        <footer class="demo-footer">
          <span>Fiche Chargement — Démonstration</span>
          <span>Aucune connexion au système de production</span>
        </footer>
      </section>
    </div>
  </main>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #17243b;
  font-family: Inter, Arial, sans-serif;
}

.demo-header {
  min-height: 75px;
  padding: 12px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #fff;
  border-bottom: 1px solid #e5eaf2;
}

.demo-brand,
.demo-header-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.demo-brand img {
  width: 43px;
  height: 43px;
  object-fit: contain;
}

.demo-brand div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-brand strong {
  color: #122b4c;
  font-size: 13px;
  letter-spacing: 0.7px;
}

.demo-brand span {
  color: #8290a4;
  font-size: 11px;
}

.demo-mode {
  color: #1764ed;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.demo-mode span {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 5px;
  border-radius: 50%;
  background: #20bf89;
}

.login-button {
  padding: 11px 16px;
  color: #fff;
  background: #1764ed;
  border: 0;
  border-radius: 7px;
  font-weight: 700;
  cursor: pointer;
}

.demo-banner {
  padding: 13px 5%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #785a16;
  background: #fff8e7;
  border-bottom: 1px solid #f2e4bd;
  font-size: 12px;
}

.demo-banner span {
  font-weight: 800;
}

.demo-layout {
  min-height: calc(100vh - 120px);
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr);
}

.demo-sidebar {
  padding: 27px 17px;
  display: flex;
  flex-direction: column;
  background: #102344;
  color: #fff;
}

.sidebar-heading {
  padding: 0 12px;
  margin-bottom: 20px;
  color: #91a7c4;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.menu-item {
  width: 100%;
  padding: 13px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #b8c8df;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s ease;
}

.menu-item:hover,
.menu-item.active {
  color: #fff;
  background: #ffffff18;
}

.menu-item.active {
  box-shadow: inset 3px 0 #65a4ff;
}

.menu-icon {
  width: 19px;
  color: #80b2ff;
  font-size: 17px;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 25px;
}

.demo-user {
  padding: 15px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #ffffff20;
}

.user-avatar {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #2468e9;
  font-weight: 800;
}

.demo-user div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.demo-user strong {
  font-size: 11px;
}

.demo-user span {
  color: #a9bad2;
  font-size: 10px;
}

.back-button {
  width: 100%;
  padding: 12px 8px;
  border: 1px solid #ffffff30;
  border-radius: 7px;
  color: #fff;
  background: transparent;
  text-align: left;
  font-size: 11px;
  cursor: pointer;
}

.demo-content {
  min-width: 0;
  padding: 38px;
}

.content-heading {
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.eyebrow {
  color: #1764ed;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.content-heading h1 {
  margin: 10px 0 6px;
  color: #152c4b;
  font-size: 27px;
}

.content-heading p {
  margin: 0;
  color: #8190a4;
  font-size: 12px;
}

.readonly-badge,
.sample-label {
  padding: 7px 10px;
  border-radius: 5px;
  color: #1764ed;
  background: #eaf1ff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
}

.stat-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #e8edf5;
  border-radius: 11px;
  background: #fff;
}

.stat-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  font-size: 20px;
}

.stat-icon.blue {
  color: #1764ed;
  background: #eaf1ff;
}

.stat-icon.purple {
  color: #8056dc;
  background: #f1eaff;
}

.stat-icon.green {
  color: #159c70;
  background: #e3f8ef;
}

.stat-icon.orange {
  color: #d88924;
  background: #fff1dc;
}

.stat-card > span {
  color: #8290a4;
  font-size: 11px;
}

.stat-card strong {
  color: #172d4c;
  font-size: 29px;
}

.stat-card small {
  color: #a0aabc;
  font-size: 10px;
}

.data-panel {
  margin-top: 25px;
  padding: 24px;
  border: 1px solid #e8edf5;
  border-radius: 11px;
  background: #fff;
}

.panel-heading {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.panel-heading h2 {
  margin: 0 0 7px;
  font-size: 16px;
}

.panel-heading p {
  margin: 0;
  color: #8996a9;
  font-size: 11px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th {
  padding: 13px 10px;
  color: #8290a4;
  background: #f7f9fc;
  font-size: 10px;
  font-weight: 700;
}

td {
  padding: 15px 10px;
  border-bottom: 1px solid #edf0f5;
  color: #526177;
  font-size: 11px;
}

.reference {
  color: #1764ed;
  font-weight: 700;
}

.status {
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

.status.validated {
  color: #16865f;
  background: #e5f8ef;
}

.status.pending {
  color: #a56c15;
  background: #fff3d9;
}

.status.warning {
  color: #c04b4b;
  background: #ffebeb;
}

.section-placeholder {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.placeholder-icon {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #1764ed;
  background: #eaf1ff;
  font-size: 28px;
}

.section-placeholder h2 {
  margin: 20px 0 5px;
}

.section-placeholder p {
  max-width: 440px;
  color: #8290a4;
  font-size: 12px;
  line-height: 1.7;
}

.demo-footer {
  margin-top: 30px;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid #e5eaf2;
  color: #98a4b5;
  font-size: 10px;
}

@media (max-width: 1050px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .demo-header {
    flex-wrap: wrap;
  }

  .demo-header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .demo-layout {
    grid-template-columns: 1fr;
  }

  .demo-sidebar {
    padding: 12px;
  }

  .sidebar-heading,
  .sidebar-bottom {
    display: none;
  }

  .demo-sidebar {
    flex-direction: row;
    overflow-x: auto;
  }

  .menu-item {
    width: auto;
    min-width: max-content;
  }

  .demo-content {
    padding: 22px 15px;
  }

  .content-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .data-panel {
    padding: 15px;
  }

  .demo-footer {
    flex-direction: column;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

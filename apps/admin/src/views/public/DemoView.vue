
<script setup lang="ts">
import { computed, ref } from 'vue';
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

const currentSection = computed(() =>
  menuItems.find(item => item.id === activeSection.value)
);

function goToLogin() {
  router.push({ name: 'login' });
}

function goToHome() {
  router.push({ name: 'landing' });
}
</script>

<template>
  <main class="demo-page">
    <!-- En-tête -->
    <header class="demo-header">
      <div class="demo-brand">
        <img src="../../assets/logo.png" alt="Logo Fiche Chargement" />

        <div class="brand-text">
          <strong>FICHE CHARGEMENT</strong>
          <span>Plateforme de gestion et de suivi</span>
        </div>
      </div>

      <div class="demo-header-actions">
        <span class="demo-mode">
          <span class="mode-indicator"></span>
          MODE DÉMONSTRATION
        </span>

        <button class="login-button" @click="goToLogin">
          <span>Connexion réelle</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
    </header>

    <!-- Information démonstration -->
    <div class="demo-banner">
      <span class="banner-icon">ⓘ</span>

      <p>
        <strong>Environnement de démonstration :</strong>
        toutes les informations affichées sont fictives et aucune opération
        réelle n'est effectuée.
      </p>
    </div>

    <div class="demo-layout">
      <!-- Barre latérale -->
      <aside class="demo-sidebar">
        <div class="sidebar-heading">
          <span class="sidebar-heading-line"></span>
          ESPACE DE TRAVAIL
        </div>

        <nav class="sidebar-navigation" aria-label="Navigation de démonstration">
          <button
            v-for="item in menuItems"
            :key="item.id"
            class="menu-item"
            :class="{ active: activeSection === item.id }"
            :aria-current="activeSection === item.id ? 'page' : undefined"
            @click="activeSection = item.id"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-label">{{ item.label }}</span>
            <span v-if="activeSection === item.id" class="active-indicator"></span>
          </button>
        </nav>

        <div class="sidebar-bottom">
          <div class="demo-user">
            <div class="user-avatar">D</div>

            <div class="user-information">
              <strong>Utilisateur démo</strong>
              <span>Accès en lecture seule</span>
            </div>
          </div>

          <button class="back-button" @click="goToHome">
            <span>←</span>
            Retour à l'accueil
          </button>
        </div>
      </aside>

      <!-- Contenu principal -->
      <section class="demo-content">
        <div class="content-heading">
          <div class="heading-information">
            <div class="breadcrumb">
              <span>TABLEAU DE BORD</span>
              <span class="breadcrumb-separator">/</span>
              <span>DÉMONSTRATION</span>
            </div>

            <h1>{{ currentSection?.label ?? 'Vue générale' }}</h1>

            <p>
              Bienvenue dans l'environnement de démonstration de Fiche Chargement.
            </p>
          </div>

          <span class="readonly-badge">
            <span class="readonly-dot"></span>
            LECTURE SEULE
          </span>
        </div>

        <!-- Vue générale -->
        <template v-if="activeSection === 'overview'">
          <div class="section-intro">
            <div>
              <h2>Vue d'ensemble</h2>
              <p>Présentation des principales données de la plateforme.</p>
            </div>

            <span class="sample-label">DONNÉES FICTIVES</span>
          </div>

          <div class="stats-grid">
            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon blue">⌂</div>
                <span class="stat-reference">01</span>
              </div>

              <span class="stat-label">Gares enregistrées</span>
              <strong class="stat-value">{{ demoData.gares }}</strong>
              <small>Exemples de données</small>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon purple">▣</div>
                <span class="stat-reference">02</span>
              </div>

              <span class="stat-label">Véhicules</span>
              <strong class="stat-value">{{ demoData.vehicules }}</strong>
              <small>Exemples de données</small>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon green">♙</div>
                <span class="stat-reference">03</span>
              </div>

              <span class="stat-label">Chauffeurs</span>
              <strong class="stat-value">{{ demoData.chauffeurs }}</strong>
              <small>Exemples de données</small>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon gold">▤</div>
                <span class="stat-reference">04</span>
              </div>

              <span class="stat-label">Fiches de chargement</span>
              <strong class="stat-value">{{ demoData.fiches }}</strong>
              <small>Exemples de données</small>
            </article>
          </div>

          <!-- Opérations récentes -->
          <section class="data-panel">
            <div class="panel-heading">
              <div>
                <span class="panel-eyebrow">ACTIVITÉ</span>
                <h2>Opérations récentes</h2>
                <p>Exemples de fiches de chargement fictives.</p>
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
                  <tr
                    v-for="operation in recentOperations"
                    :key="operation.id"
                  >
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
                        <span class="status-dot"></span>
                        {{ operation.statut }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="table-footer">
              <span>Affichage de {{ recentOperations.length }} opérations fictives</span>
              <span class="table-footer-note">Aucune donnée de production</span>
            </div>
          </section>
        </template>

        <!-- Autres sections -->
        <template v-else>
          <section class="data-panel section-placeholder">
            <div class="placeholder-icon">
              {{ currentSection?.icon ?? '▦' }}
            </div>

            <span class="placeholder-eyebrow">ENVIRONNEMENT DE DÉMONSTRATION</span>

            <h2>{{ currentSection?.label }}</h2>

            <p>
              Cette section illustre une fonctionnalité de la plateforme.
              Les données affichées dans cet environnement sont fictives.
            </p>

            <span class="readonly-badge">
              MODULE DE DÉMONSTRATION
            </span>
          </section>
        </template>

        <!-- Pied de page -->
        <footer class="demo-footer">
          <div>
            <strong>FICHE CHARGEMENT</strong>
            <span> — Environnement de démonstration</span>
          </div>

          <span class="footer-security">
            <span class="footer-dot"></span>
            Aucune connexion au système de production
          </span>
        </footer>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* =========================================
   IDENTITÉ VISUELLE FOPTRAC
   Bleu marine : #17365D
   Or           : #C5A13B
========================================= */

.demo-page {
  --primary: #17365d;
  --primary-dark: #102744;
  --primary-light: #eaf0f7;
  --gold: #c5a13b;
  --gold-light: #f8f1dc;
  --text: #26364b;
  --muted: #78879a;
  --border: #e5eaf0;
  --surface: #ffffff;
  --background: #f5f7fa;

  min-height: 100vh;
  background: var(--background);
  color: var(--text);
  font-family: Inter, Arial, sans-serif;
}

/* HEADER */

.demo-header {
  min-height: 76px;
  padding: 12px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.demo-brand,
.demo-header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.demo-brand img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.demo-brand strong {
  color: var(--primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.demo-brand span {
  color: var(--muted);
  font-size: 11px;
}

.demo-mode {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.mode-indicator,
.footer-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #2ca77c;
}

.login-button {
  padding: 11px 17px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.login-button:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.button-arrow {
  color: #e2c16b;
  font-size: 17px;
}

/* BANNIÈRE */

.demo-banner {
  min-height: 45px;
  padding: 11px 5%;
  display: flex;
  align-items: center;
  gap: 11px;
  color: #755b20;
  background: #faf5e7;
  border-bottom: 1px solid #eee3c6;
  font-size: 11px;
}

.demo-banner p {
  margin: 0;
  line-height: 1.6;
}

.demo-banner strong {
  font-weight: 800;
}

.banner-icon {
  color: var(--gold);
  font-size: 17px;
  font-weight: 800;
}

/* STRUCTURE */

.demo-layout {
  min-height: calc(100vh - 121px);
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
}

/* SIDEBAR */

.demo-sidebar {
  padding: 27px 17px 20px;
  display: flex;
  flex-direction: column;
  background: var(--primary);
  color: #fff;
}

.sidebar-heading {
  padding: 0 12px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #b8c8da;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.sidebar-heading-line {
  width: 3px;
  height: 13px;
  border-radius: 3px;
  background: var(--gold);
}

.sidebar-navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  position: relative;
  width: 100%;
  min-height: 44px;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #c4d0df;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  color: #fff;
  background: #ffffff12;
}

.menu-item.active {
  color: #fff;
  background: #ffffff18;
  font-weight: 700;
}

.menu-item.active .menu-icon {
  color: #e2c16b;
}

.menu-icon {
  width: 20px;
  flex-shrink: 0;
  color: #b6c8df;
  font-size: 17px;
  text-align: center;
}

.menu-label {
  flex: 1;
}

.active-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 25px;
}

.demo-user {
  padding: 15px 8px;
  display: flex;
  align-items: center;
  gap: 11px;
  border-top: 1px solid #ffffff24;
}

.user-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid #e2c16b66;
  border-radius: 50%;
  background: #ffffff14;
  color: #e2c16b;
  font-size: 14px;
  font-weight: 800;
}

.user-information {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.demo-user strong {
  color: #fff;
  font-size: 11px;
}

.demo-user span {
  color: #b8c8da;
  font-size: 10px;
}

.back-button {
  width: 100%;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ffffff35;
  border-radius: 5px;
  background: transparent;
  color: #e5edf6;
  text-align: left;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  border-color: var(--gold);
  color: #e2c16b;
  background: #ffffff0c;
}

/* CONTENU */

.demo-content {
  min-width: 0;
  padding: 35px 38px 25px;
}

.content-heading {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.breadcrumb-separator {
  color: var(--gold);
}

.content-heading h1 {
  margin: 10px 0 7px;
  color: var(--primary);
  font-size: 27px;
  font-weight: 800;
}

.content-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.readonly-badge {
  padding: 8px 11px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #e9dfc5;
  border-radius: 5px;
  background: var(--gold-light);
  color: #826821;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.readonly-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}

/* INTRODUCTION */

.section-intro {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-intro h2 {
  margin: 0 0 5px;
  color: var(--primary);
  font-size: 15px;
  font-weight: 800;
}

.section-intro p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

/* INDICATEURS */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
}

.stat-card {
  min-width: 0;
  padding: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface);
  box-shadow: 0 2px 7px #17365d08;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #17365d12;
}

.stat-card-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  font-size: 20px;
}

.stat-icon.blue {
  color: #315f92;
  background: #eaf1f8;
}

.stat-icon.purple {
  color: #7956a7;
  background: #f1ebf8;
}

.stat-icon.green {
  color: #218361;
  background: #e6f4ee;
}

.stat-icon.gold {
  color: #a17c22;
  background: #f8f1dc;
}

.stat-reference {
  color: #b4bdc9;
  font-size: 10px;
  font-weight: 700;
}

.stat-label {
  color: #78879a;
  font-size: 11px;
}

.stat-value {
  color: var(--primary);
  font-size: 29px;
  font-weight: 800;
  line-height: 1.2;
}

.stat-card small {
  color: #a0aaba;
  font-size: 10px;
}

/* PANNEAUX */

.data-panel {
  margin-top: 25px;
  padding: 23px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface);
  box-shadow: 0 2px 7px #17365d08;
}

.panel-heading {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-eyebrow,
.placeholder-eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--gold);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.panel-heading h2 {
  margin: 0 0 6px;
  color: var(--primary);
  font-size: 16px;
  font-weight: 800;
}

.panel-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.sample-label {
  padding: 7px 10px;
  border: 1px solid #e9dfc5;
  border-radius: 4px;
  background: var(--gold-light);
  color: #826821;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* TABLEAU */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th {
  padding: 13px 11px;
  border-bottom: 1px solid var(--border);
  background: #f7f9fb;
  color: #748297;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

td {
  padding: 15px 11px;
  border-bottom: 1px solid #edf0f4;
  color: #526177;
  font-size: 11px;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: #fafbfd;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.reference {
  color: var(--primary);
  font-weight: 800;
}

.status {
  padding: 6px 9px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status.validated {
  background: #e7f4ed;
  color: #21805b;
}

.status.pending {
  background: #faf1dc;
  color: #99721e;
}

.status.warning {
  background: #f9eaea;
  color: #b54d4d;
}

.table-footer {
  padding-top: 14px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border);
  color: #8996a8;
  font-size: 10px;
}

.table-footer-note {
  color: #a17c22;
}

/* PLACEHOLDER DES MODULES */

.section-placeholder {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.placeholder-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
  display: grid;
  place-items: center;
  border: 1px solid #e9dfc5;
  border-radius: 10px;
  background: var(--gold-light);
  color: #a17c22;
  font-size: 27px;
}

.placeholder-eyebrow {
  margin-bottom: 8px;
}

.section-placeholder h2 {
  margin: 0 0 9px;
  color: var(--primary);
  font-size: 19px;
}

.section-placeholder p {
  max-width: 440px;
  margin: 0 0 20px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

/* FOOTER */

.demo-footer {
  margin-top: 30px;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid var(--border);
  color: #8996a8;
  font-size: 10px;
}

.demo-footer strong {
  color: var(--primary);
  font-weight: 800;
  letter-spacing: 0.4px;
}

.footer-security {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

/* RESPONSIVE */

@media (max-width: 1150px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .demo-content {
    padding: 30px 25px;
  }
}

@media (max-width: 800px) {
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

  .sidebar-navigation {
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
    scrollbar-width: thin;
  }

  .menu-item {
    width: auto;
    min-width: max-content;
    padding: 11px 13px;
  }

  .menu-label {
    flex: initial;
  }

  .demo-content {
    padding: 25px 20px;
  }
}

@media (max-width: 600px) {
  .demo-header {
    padding: 12px 16px;
    flex-wrap: wrap;
  }

  .demo-header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .demo-banner {
    padding: 12px 16px;
    align-items: flex-start;
  }

  .demo-content {
    padding: 22px 14px;
  }

  .content-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-intro {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .data-panel {
    padding: 16px;
  }

  .table-footer,
  .demo-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-heading {
    align-items: flex-start;
  }
}

@media (max-width: 380px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .demo-mode {
    font-size: 9px;
  }

  .login-button {
    padding: 10px 12px;
    font-size: 11px;
  }
}
</style>


<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToLogin() {
  router.push({ name: 'login' });
}

function goToDemo() {
  router.push({ name: 'demo' });
}
</script>

<template>
  <main class="landing-page">
    <!-- En-tête -->
    <header class="landing-header">
      <div class="brand">
        <img
          src="../../assets/logo.png"
          alt="Logo de la plateforme"
          class="brand-logo"
        />

        <div class="brand-text">
          <strong>FICHE CHARGEMENT</strong>
          <span>Plateforme de gestion et de supervision</span>
        </div>
      </div>

      <nav class="header-actions" aria-label="Navigation principale">
        <button class="btn btn-outline" @click="goToDemo">
          Découvrir la plateforme
        </button>

        <button class="btn btn-primary" @click="goToLogin">
          Connexion
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </header>

    <!-- Section principale -->
    <section class="hero">
      <div class="hero-content">
        <div class="eyebrow">
          <span class="status-dot"></span>
          PLATEFORME NUMÉRIQUE DE GESTION
        </div>

        <h1>
          Une gestion plus simple,
          <span>plus rapide et plus efficace.</span>
        </h1>

        <p class="hero-description">
          Centralisez la gestion des gares, des véhicules, des chauffeurs
          et des fiches de chargement au sein d'une plateforme numérique
          moderne, sécurisée et accessible.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary btn-large" @click="goToLogin">
            Accéder à la plateforme
            <span aria-hidden="true">→</span>
          </button>

          <button class="btn btn-light btn-large" @click="goToDemo">
            Explorer la démonstration
          </button>
        </div>

        <div class="hero-note">
          <span>✓</span> Gestion centralisée
          <span>✓</span> Suivi des opérations
          <span>✓</span> Contrôle des accès
        </div>
      </div>

      <!-- Aperçu illustratif -->
      <div class="hero-visual">
        <div class="visual-glow"></div>

        <div class="dashboard-preview">
          <div class="preview-header">
            <div>
              <span class="preview-label">APERÇU DU TABLEAU DE BORD</span>
              <h3>Vue d'ensemble</h3>
            </div>

            <span class="preview-status">
              <span class="preview-status-dot"></span>
              Système actif
            </span>
          </div>

          <div class="preview-grid">
            <div class="preview-card">
              <span class="preview-icon">⌂</span>
              <span class="preview-number">12</span>
              <span class="preview-caption">Gares</span>
            </div>

            <div class="preview-card">
              <span class="preview-icon">▣</span>
              <span class="preview-number">48</span>
              <span class="preview-caption">Véhicules</span>
            </div>

            <div class="preview-card">
              <span class="preview-icon">♙</span>
              <span class="preview-number">36</span>
              <span class="preview-caption">Chauffeurs</span>
            </div>

            <div class="preview-card">
              <span class="preview-icon">▤</span>
              <span class="preview-number">125</span>
              <span class="preview-caption">Fiches</span>
            </div>
          </div>

          <div class="preview-chart">
            <div class="chart-heading">
              <strong>Activité opérationnelle</strong>
              <span>Données de démonstration</span>
            </div>

            <div class="chart-bars">
              <div class="bar" style="height: 35%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 85%"></div>
              <div class="bar" style="height: 65%"></div>
              <div class="bar" style="height: 95%"></div>
              <div class="bar" style="height: 72%"></div>
            </div>
          </div>

          <div class="preview-footer">
            <span>Interface illustrative</span>
            <span>Mode aperçu</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Fonctionnalités -->
    <section class="features">
      <div class="section-heading">
        <span class="eyebrow">UN ENVIRONNEMENT UNIFIÉ</span>

        <h2>Tous vos outils de gestion au même endroit</h2>

        <p>
          Une architecture organisée autour des principales activités
          opérationnelles de la plateforme.
        </p>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <div class="feature-icon">⌂</div>
          <h3>Gestion des gares</h3>
          <p>
            Organisez les informations et les opérations liées aux gares.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">▣</div>
          <h3>Gestion des véhicules</h3>
          <p>
            Centralisez les informations relatives au parc de véhicules.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">♙</div>
          <h3>Gestion des chauffeurs</h3>
          <p>
            Consultez et gérez les informations des chauffeurs.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">▤</div>
          <h3>Fiches de chargement</h3>
          <p>
            Facilitez le suivi et la consultation des fiches de chargement.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">◷</div>
          <h3>Alertes et échéances</h3>
          <p>
            Identifiez les documents à surveiller et les échéances à venir.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">◈</div>
          <h3>Supervision et contrôle</h3>
          <p>
            Adaptez les accès et les fonctionnalités selon les rôles.
          </p>
        </article>
      </div>
    </section>

    <!-- Appel à l'action -->
    <section class="access-section">
      <div class="access-content">
        <span class="eyebrow">PRÊT À COMMENCER ?</span>

        <h2>
          Découvrez une nouvelle façon de gérer vos opérations.
        </h2>

        <p>
          Accédez à votre espace de travail ou explorez notre démonstration.
        </p>
      </div>

      <div class="access-actions">
        <button class="btn btn-white" @click="goToLogin">
          Se connecter
          <span aria-hidden="true">→</span>
        </button>

        <button class="btn btn-transparent" @click="goToDemo">
          Voir la démonstration
        </button>
      </div>
    </section>

    <!-- Pied de page -->
    <footer class="landing-footer">
      <div class="footer-brand">
        <img src="../../assets/logo.png" alt="" />
        <span>Fiche Chargement</span>
      </div>

      <p>
        © {{ new Date().getFullYear() }} — Plateforme de gestion et de supervision.
      </p>
    </footer>
  </main>
</template>

<style scoped>
/* =========================================
   IDENTITÉ VISUELLE FOPTRAC
   Bleu marine : #17365D
   Or           : #C5A13B
========================================= */

.landing-page {
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
  color: var(--text);
  background: var(--background);
  font-family: Inter, Arial, sans-serif;
}

/* HEADER */

.landing-header {
  position: relative;
  z-index: 2;
  min-height: 80px;
  padding: 13px 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.brand,
.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 49px;
  height: 49px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.brand-text strong {
  color: var(--primary);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.brand-text span {
  color: var(--muted);
  font-size: 11px;
}

.header-actions,
.hero-actions,
.access-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* BOUTONS */

.btn {
  min-height: 42px;
  padding: 11px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:focus-visible {
  outline: 3px solid #c5a13b80;
  outline-offset: 3px;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 5px 14px #17365d20;
}

.btn-primary:hover {
  background: var(--primary-dark);
  box-shadow: 0 7px 18px #17365d30;
}

.btn-outline {
  border-color: #d8e0e9;
  background: #fff;
  color: var(--primary);
}

.btn-outline:hover {
  border-color: var(--gold);
  background: #fcfaf4;
}

.btn-light {
  background: #fff;
  color: var(--primary);
}

.btn-light:hover {
  background: var(--gold-light);
}

.btn-large {
  min-height: 49px;
  padding: 14px 21px;
}

/* HERO */

.hero {
  position: relative;
  min-height: 570px;
  padding: 75px 9%;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 55px;
  overflow: hidden;
  background:
    radial-gradient(circle at 83% 35%, #c5a13b20, transparent 34%),
    linear-gradient(120deg, #102744, #17365d 65%, #1b426b);
  color: #fff;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 650px;
  animation: slide-up 0.7s ease both;
}

.eyebrow {
  color: var(--gold);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.hero .eyebrow {
  color: #e2c16b;
}

.status-dot {
  width: 7px;
  height: 7px;
  margin-right: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #54c99a;
  box-shadow: 0 0 10px #54c99a80;
}

.hero h1 {
  margin: 24px 0;
  color: #fff;
  font-size: clamp(38px, 5vw, 57px);
  line-height: 1.13;
  letter-spacing: -1.8px;
}

.hero h1 span {
  display: block;
  color: #e2c16b;
}

.hero-description {
  max-width: 550px;
  color: #c4d1e0;
  font-size: 15px;
  line-height: 1.85;
}

.hero-actions {
  margin-top: 30px;
}

.hero-note {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #c4d1e0;
  font-size: 10px;
  line-height: 1.8;
}

.hero-note span {
  color: #e2c16b;
  font-weight: 800;
}

/* APERÇU DU TABLEAU DE BORD */

.hero-visual {
  position: relative;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slide-up 0.9s ease both;
}

.visual-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: var(--gold);
  filter: blur(115px);
  opacity: 0.13;
}

.dashboard-preview {
  position: relative;
  width: 100%;
  max-width: 490px;
  padding: 24px;
  border: 1px solid #ffffff28;
  border-radius: 10px;
  background: #ffffff0d;
  backdrop-filter: blur(18px);
  box-shadow: 0 25px 70px #0004;
}

.preview-header,
.chart-heading,
.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.preview-label {
  color: #c3d0df;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.preview-header h3 {
  margin: 8px 0 20px;
  color: #fff;
  font-size: 19px;
}

.preview-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #80d6b0;
  font-size: 10px;
  white-space: nowrap;
}

.preview-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #54c99a;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.preview-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  border: 1px solid #ffffff18;
  border-radius: 6px;
  background: #ffffff0b;
}

.preview-icon {
  color: #e2c16b;
  font-size: 19px;
}

.preview-number {
  color: #fff;
  font-size: 26px;
  font-weight: 800;
}

.preview-caption {
  color: #bdcbdc;
  font-size: 10px;
}

.preview-chart {
  margin-top: 18px;
  padding: 15px;
  border: 1px solid #ffffff12;
  border-radius: 6px;
  background: #ffffff09;
}

.chart-heading strong {
  color: #fff;
  font-size: 10px;
}

.chart-heading span {
  color: #bdcbdc;
  font-size: 9px;
}

.chart-bars {
  height: 105px;
  padding-top: 15px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 12px;
}

.bar {
  width: 9%;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(to top, #c5a13b, #e2c16b);
  animation: grow 1s ease both;
}

.preview-footer {
  margin-top: 15px;
  color: #bdcbdc;
  font-size: 9px;
}

/* SECTION FONCTIONNALITÉS */

.features {
  padding: 80px 9%;
  background: var(--background);
}

.section-heading {
  max-width: 650px;
  margin: 0 auto 42px;
  text-align: center;
}

.section-heading .eyebrow {
  color: #a17c22;
}

.section-heading h2,
.access-section h2 {
  color: var(--primary);
  font-size: 30px;
  line-height: 1.3;
  letter-spacing: -0.7px;
}

.section-heading h2 {
  margin: 15px 0 10px;
}

.section-heading p,
.access-section p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.section-heading p {
  max-width: 560px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}

.feature-card {
  min-width: 0;
  padding: 26px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 2px 8px #17365d07;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #d9c68e;
  box-shadow: 0 12px 28px #17365d10;
}

.feature-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid #e9dfc5;
  border-radius: 7px;
  background: var(--gold-light);
  color: #a17c22;
  font-size: 21px;
}

.feature-card h3 {
  margin: 18px 0 9px;
  color: var(--primary);
  font-size: 15px;
  font-weight: 800;
}

.feature-card p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}

/* APPEL À L'ACTION */

.access-section {
  margin: 0 7% 60px;
  padding: 45px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  border: 1px solid #29496b;
  border-radius: 9px;
  background:
    radial-gradient(circle at 80% 20%, #c5a13b20, transparent 40%),
    linear-gradient(120deg, #102744, #17365d);
  color: #fff;
}

.access-content {
  max-width: 590px;
}

.access-section .eyebrow {
  color: #e2c16b;
}

.access-section h2 {
  margin: 13px 0 10px;
  color: #fff;
}

.access-section p {
  margin: 0;
  color: #c4d1e0;
}

.access-actions {
  flex-shrink: 0;
}

.btn-white {
  background: #fff;
  color: var(--primary);
}

.btn-white:hover {
  background: var(--gold-light);
}

.btn-transparent {
  border-color: #ffffff65;
  background: transparent;
  color: #fff;
}

.btn-transparent:hover {
  border-color: var(--gold);
  background: #ffffff10;
}

/* FOOTER */

.landing-footer {
  min-height: 76px;
  padding: 20px 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-top: 1px solid var(--border);
  background: #fff;
}

.footer-brand img {
  width: 31px;
  height: 31px;
  object-fit: contain;
}

.footer-brand span {
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
}

.landing-footer p {
  margin: 0;
  color: #8491a5;
  font-size: 10px;
}

/* ANIMATIONS */

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes grow {
  from {
    transform: scaleY(0);
    transform-origin: bottom;
  }

  to {
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

/* RESPONSIVE */

@media (max-width: 1050px) {
  .hero {
    gap: 35px;
    padding-right: 6%;
    padding-left: 6%;
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .access-section {
    padding: 35px;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 65px 7%;
  }

  .hero-content {
    max-width: 700px;
  }

  .hero-visual {
    margin-top: 15px;
  }

  .dashboard-preview {
    max-width: 540px;
  }

  .access-section {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .landing-header {
    padding: 13px 5%;
    flex-wrap: wrap;
  }

  .brand-text span {
    display: none;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
    padding: 10px;
    font-size: 11px;
  }

  .hero {
    min-height: auto;
    padding: 55px 6%;
  }

  .hero h1 {
    font-size: 38px;
    letter-spacing: -1px;
  }

  .hero-description {
    font-size: 13px;
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .hero-note {
    gap: 8px;
    font-size: 9px;
  }

  .dashboard-preview {
    padding: 17px;
  }

  .preview-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-header h3 {
    margin-bottom: 15px;
  }

  .chart-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .features {
    padding: 60px 6%;
  }

  .section-heading h2,
  .access-section h2 {
    font-size: 25px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 22px;
  }

  .access-section {
    margin: 0 5% 40px;
    padding: 30px 22px;
  }

  .access-actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .access-actions .btn {
    width: 100%;
  }

  .landing-footer {
    padding: 22px 5%;
    flex-direction: column;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>


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

      <nav class="header-actions">
        <button class="btn btn-outline" @click="goToDemo">
          Découvrir la plateforme
        </button>
        <button class="btn btn-primary" @click="goToLogin">
          Connexion
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </header>

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

      <div class="hero-visual">
        <div class="visual-glow"></div>

        <div class="dashboard-preview">
          <div class="preview-header">
            <div>
              <span class="preview-label">APERÇU DU TABLEAU DE BORD</span>
              <h3>Vue d'ensemble</h3>
            </div>
            <span class="preview-status">● Système actif</span>
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

    <section class="access-section">
      <div>
        <span class="eyebrow">PRÊT À COMMENCER ?</span>
        <h2>Découvrez une nouvelle façon de gérer vos opérations.</h2>
        <p>
          Accédez à votre espace de travail ou explorez notre démonstration.
        </p>
      </div>

      <div class="access-actions">
        <button class="btn btn-white" @click="goToLogin">
          Se connecter
        </button>
        <button class="btn btn-transparent" @click="goToDemo">
          Voir la démonstration
        </button>
      </div>
    </section>

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
.landing-page {
  min-height: 100vh;
  color: #17243b;
  background: #f7f9fc;
  font-family: Inter, Arial, sans-serif;
}

.landing-header {
  min-height: 82px;
  padding: 14px 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: #fff;
  border-bottom: 1px solid #e8edf5;
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
  gap: 4px;
}

.brand-text strong {
  font-size: 15px;
  letter-spacing: 1px;
  color: #102344;
}

.brand-text span {
  color: #78869b;
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

.btn {
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: 0.25s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: #1764ed;
  color: #fff;
  box-shadow: 0 8px 20px #1764ed30;
}

.btn-primary:hover {
  background: #0e52d0;
}

.btn-outline {
  background: #fff;
  color: #1c355b;
  border: 1px solid #dce4ef;
}

.btn-light {
  background: #fff;
  color: #15315a;
}

.btn-large {
  padding: 15px 22px;
}

.hero {
  min-height: 570px;
  padding: 80px 9%;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 60px;
  overflow: hidden;
  background:
    radial-gradient(circle at 80% 35%, #1b4d9228, transparent 35%),
    linear-gradient(120deg, #0b1830, #102b50);
  color: #fff;
}

.hero-content {
  max-width: 650px;
  animation: slide-up 0.7s ease both;
}

.eyebrow {
  color: #3d8cff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.hero .eyebrow {
  color: #8dbaff;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 7px;
  border-radius: 50%;
  background: #41d9a1;
  box-shadow: 0 0 12px #41d9a1;
}

.hero h1 {
  margin: 25px 0;
  font-size: clamp(38px, 5vw, 58px);
  line-height: 1.12;
  letter-spacing: -2px;
}

.hero h1 span {
  display: block;
  color: #65a4ff;
}

.hero-description {
  max-width: 550px;
  color: #b8c8df;
  font-size: 16px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 32px;
}

.hero-note {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: #b8c8df;
  font-size: 11px;
}

.hero-note span {
  color: #4de0a7;
  font-weight: 800;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  animation: slide-up 0.9s ease both;
}

.visual-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  background: #2375ff;
  filter: blur(110px);
  opacity: 0.25;
}

.dashboard-preview {
  position: relative;
  width: 100%;
  max-width: 490px;
  padding: 25px;
  border: 1px solid #ffffff25;
  border-radius: 17px;
  background: #ffffff12;
  backdrop-filter: blur(18px);
  box-shadow: 0 25px 80px #0005;
}

.preview-header,
.chart-heading,
.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.preview-label,
.preview-caption,
.preview-footer,
.chart-heading span {
  color: #a9bad2;
  font-size: 10px;
}

.preview-header h3 {
  margin: 8px 0 20px;
  font-size: 20px;
}

.preview-status {
  color: #5be2ad;
  font-size: 10px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preview-card {
  padding: 17px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  border: 1px solid #ffffff15;
  border-radius: 10px;
  background: #ffffff0b;
}

.preview-icon {
  color: #70aaff;
  font-size: 20px;
}

.preview-number {
  font-size: 27px;
  font-weight: 800;
}

.preview-chart {
  margin-top: 20px;
  padding: 16px;
  border-radius: 10px;
  background: #ffffff0b;
}

.chart-heading strong {
  font-size: 11px;
}

.chart-bars {
  height: 105px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 12px;
  padding-top: 15px;
}

.bar {
  width: 9%;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(#69aaff, #2468e9);
  animation: grow 1s ease both;
}

.preview-footer {
  margin-top: 17px;
}

.features {
  padding: 85px 9%;
}

.section-heading {
  max-width: 650px;
  margin: 0 auto 45px;
  text-align: center;
}

.section-heading h2,
.access-section h2 {
  color: #142947;
  font-size: 32px;
  line-height: 1.25;
  letter-spacing: -1px;
}

.section-heading p,
.access-section p {
  color: #78869b;
  font-size: 14px;
  line-height: 1.7;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.feature-card {
  padding: 28px;
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 13px;
  transition: 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #b7d1ff;
  box-shadow: 0 15px 35px #1023440c;
}

.feature-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: #1764ed;
  background: #eaf1ff;
  font-size: 22px;
}

.feature-card h3 {
  margin: 20px 0 10px;
  font-size: 16px;
}

.feature-card p {
  margin: 0;
  color: #78869b;
  font-size: 13px;
  line-height: 1.7;
}

.access-section {
  margin: 0 7% 65px;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  border-radius: 17px;
  background: linear-gradient(120deg, #102344, #174b88);
  color: #fff;
}

.access-section h2 {
  max-width: 560px;
  color: #fff;
}

.access-section p {
  color: #c1d0e5;
}

.btn-white {
  background: #fff;
  color: #14325b;
}

.btn-transparent {
  color: #fff;
  background: transparent;
  border: 1px solid #ffffff60;
}

.landing-footer {
  padding: 25px 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-top: 1px solid #e8edf5;
  background: #fff;
}

.footer-brand img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.footer-brand span {
  font-weight: 700;
  font-size: 13px;
}

.landing-footer p {
  color: #8491a5;
  font-size: 11px;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes grow {
  from {
    height: 0;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 65px 7%;
  }

  .hero-visual {
    margin-top: 20px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .access-section {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .landing-header {
    padding: 14px 5%;
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
  }

  .hero h1 {
    font-size: 39px;
  }

  .hero-note {
    line-height: 2;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .features {
    padding: 60px 6%;
  }

  .access-section {
    margin: 0 5% 45px;
    padding: 30px 22px;
  }

  .access-actions {
    width: 100%;
  }

  .access-actions .btn {
    flex: 1;
  }

  .landing-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>

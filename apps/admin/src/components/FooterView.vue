
<script setup lang="ts">
import logoSrc from '../assets/logo-final.png';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-logo-container">
          <img
            :src="logoSrc"
            alt="Logo FOPTRAC"
            class="footer-logo"
          />
        </div>

        <div class="footer-text">
          <p class="footer-title">
            Fédération des Organisations Socio-Professionnelles
            du Transport Routier du Cameroun
          </p>

          <p class="footer-subtitle">
            FOPTRAC — Plateforme de gestion des fiches de chargement
          </p>
        </div>
      </div>

      <div class="footer-legal">
        <span>© {{ currentYear }}</span>
        <span class="footer-separator">•</span>
        <span>Tous droits réservés</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  margin-top: auto;
  padding: 18px 28px;
  background: var(--color-brand-dark);
  border-top: 2px solid var(--color-brand-accent);
  color: #cbd5e1;
  box-sizing: border-box;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.footer-logo-container {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 3px;
  background: #ffffff;
  border: 1px solid var(--color-brand-accent);
  border-radius: 8px;
  box-sizing: border-box;
}

.footer-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.footer-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.footer-title {
  margin: 0;
  color: #f8fafc;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
}

.footer-subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 10px;
}

.footer-legal {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 11px;
}

.footer-separator {
  color: var(--color-brand-accent);
}

@media (max-width: 768px) {
  .app-footer {
    padding: 16px 18px;
  }

  .footer-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 14px;
  }

  .footer-brand {
    align-items: flex-start;
  }

  .footer-title {
    font-size: 10px;
  }

  .footer-legal {
    font-size: 10px;
  }
}
</style>

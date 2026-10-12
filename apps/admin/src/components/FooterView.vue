<script setup lang="ts">
import logoSrc from '../assets/logo-Fede.png';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-logo-container">
        <img :src="logoSrc" alt="Logo FOPTRAC" class="footer-logo" />
      </div>
      <div class="footer-text">
        <p class="footer-title">Fédération des Organisations Socio-Professionnelles du Transport Routier du Cameroun (FOPTRAC)</p>
        <p class="footer-copy">&copy; {{ currentYear }} — Tous droits réservés. Plateforme officielle de gestion des fiches de chargement.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  padding: 24px;
  background: #0b0f19;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
}

.footer-logo-container {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.footer-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.footer-title {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
}

.footer-copy {
  margin: 0;
  font-size: 10px;
  color: #64748b;
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

<script setup lang="ts">
// Vous pouvez ajuster le chemin d'importation de l'image selon la structure exacte de votre projet
import logoSrc from '../assets/logo-Fede.png';

defineProps<{
  subtitle?: string;
}>();
</script>

<template>
  <header class="app-header">
    <div class="header-brand">
      <div class="logo-wrapper">
        <img :src="logoSrc" alt="Logo FOPTRAC" class="header-logo" />
      </div>
      <div class="header-titles">
        <span class="federation-name">FOPTRAC</span>
        <strong class="platform-name">Fiche de Chargement - Administration</strong>
      </div>
    </div>

    <div v-if="subtitle" class="header-subtitle">
      <span>{{ subtitle }}</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 24px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  box-sizing: border-box;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.header-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.federation-name {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a855f7;
}

.platform-name {
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: -0.2px;
}

.header-subtitle {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .header-subtitle {
    display: none;
  }
}
</style>
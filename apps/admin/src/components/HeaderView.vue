
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../auth/auth.store';
import logoSrc from '../assets/logo-Fede.png';

defineProps<{
  subtitle?: string;
}>();

const authStore = useAuthStore();

const fullName = computed(() => {
  const user = authStore.user;

  if (!user) return 'Administrateur';

  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim()
    || 'Administrateur';
});

const initials = computed(() =>
  fullName.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
);
</script>

<template>
  <header class="app-header">
    <!-- Identité de la plateforme -->
    <div class="header-brand">
      <div class="logo-wrapper">
        <img
          :src="logoSrc"
          alt="Logo FOPTRAC"
          class="header-logo"
        />
      </div>

      <div class="header-titles">
        <span class="federation-name">FOPTRAC</span>
        <strong class="platform-name">
          Fiche de Chargement - Administration
        </strong>
      </div>
    </div>

    <!-- Accueil personnalisé -->
    <div class="welcome-content">
      <span class="welcome-eyebrow">
        ESPACE ADMINISTRATION
      </span>

      <h1>Bonjour, {{ fullName }} !</h1>

      <p>
        Bienvenue dans votre espace de pilotage FOPTRAC.
      </p>
    </div>

    <!-- Avatar de l'utilisateur -->
    <div
      class="welcome-avatar"
      :aria-label="`Initiales de ${fullName}`"
      :title="fullName"
    >
      {{ initials || 'AD' }}
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 20px 28px;
  background: linear-gradient(110deg, #0f172a, #172b4d);
  border-bottom: 3px solid #c5a13b;
  color: white;
  box-sizing: border-box;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.logo-wrapper {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
  border: 2px solid #d4af37;
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  gap: 5px;
}

.federation-name {
  color: #e6c86e;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.platform-name {
  max-width: 270px;
  color: #f8fafc;
  font-size: 13px;
  line-height: 1.5;
}

.welcome-content {
  flex: 1;
  min-width: 0;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-eyebrow {
  color: #e6c86e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.welcome-content h1 {
  margin: 5px 0;
  color: white;
  font-size: 21px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.welcome-content p {
  margin: 0;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.6;
}

.welcome-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #e6c86e;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .app-header {
    flex-wrap: wrap;
    padding: 18px;
  }

  .welcome-content {
    flex-basis: 60%;
  }
}

@media (max-width: 640px) {
  .app-header {
    gap: 16px;
  }

  .logo-wrapper {
    width: 46px;
    height: 46px;
  }

  .platform-name {
    max-width: 200px;
    font-size: 11px;
  }

  .welcome-content {
    flex-basis: 100%;
    order: 3;
    padding: 14px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-left: none;
  }

  .welcome-content h1 {
    font-size: 19px;
  }

  .welcome-avatar {
    width: 42px;
    height: 42px;
  }
}
</style>

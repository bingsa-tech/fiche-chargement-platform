
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../auth/auth.store';



withDefaults(
  defineProps<{
    subtitle?: string;
  }>(),
  {
    subtitle: 'Administration',
  },
);

const emit = defineEmits<{
  (event: 'toggle-sidebar'): void;
}>();

const authStore = useAuthStore();

const fullName = computed(() => {
  const user = authStore.user;

  if (!user) return 'Utilisateur';

  return (
    `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() ||
    'Utilisateur'
  );
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
    <div class="header-main">
      <button
        type="button"
        class="menu-button"
        aria-label="Ouvrir ou fermer le menu de navigation"
        @click="emit('toggle-sidebar')"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      

      <div class="header-divider"></div>

      <div class="welcome-content">
        <span class="welcome-eyebrow">
          ESPACE ADMINISTRATION
        </span>

        <h1>Bonjour, {{ fullName }} !</h1>

        <p>
          Bienvenue dans votre espace de pilotage FOPTRAC.
        </p>
      </div>

      <div
        class="welcome-avatar"
        :aria-label="`Initiales de ${fullName}`"
        :title="fullName"
      >
        {{ initials || 'UT' }}
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  width: 100%;
  background: linear-gradient(
    110deg,
    var(--color-brand-dark),
    var(--color-brand-primary)
  );
  border-bottom: 3px solid var(--color-brand-accent);
  color: #ffffff;
  box-sizing: border-box;
}

.header-main {
  min-height: 112px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 28px;
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
  flex-shrink: 0;
  overflow: hidden;
  background: #ffffff;
  border: 2px solid var(--color-brand-accent);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  box-sizing: border-box;
}

.header-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.federation-name {
  color: var(--color-brand-accent-light);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.platform-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.platform-subtitle {
  color: #cbd5e1;
  font-size: 11px;
}

.header-divider {
  align-self: stretch;
  width: 1px;
  flex-shrink: 0;
  background: rgb(255 255 255 / 20%);
}

.welcome-content {
  flex: 1;
  min-width: 0;
}

.welcome-eyebrow {
  color: var(--color-brand-accent-light);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.welcome-content h1 {
  margin: 5px 0;
  color: #ffffff;
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
  border: 2px solid var(--color-brand-accent-light);
  border-radius: 50%;
  background: var(--color-primary-hover);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
}

.menu-button {
  display: none;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 8%);
  cursor: pointer;
}

.menu-button span {
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: #ffffff;
}

@media (max-width: 900px) {
  .header-main {
    gap: 16px;
    padding: 16px 20px;
  }

  .welcome-content h1 {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .header-main {
    min-height: 90px;
    gap: 14px;
    padding: 14px 18px;
  }

  .menu-button {
    display: flex;
  }

  .header-divider {
    display: none;
  }

  .welcome-content {
    display: none;
  }

  .header-brand {
    flex: 1;
    min-width: 0;
  }

  .welcome-avatar {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 480px) {
  .header-main {
    gap: 10px;
    padding: 12px;
  }

  .logo-wrapper {
    width: 44px;
    height: 44px;
  }

  .header-brand {
    gap: 10px;
  }

  .platform-name {
    font-size: 12px;
  }

  .platform-subtitle {
    font-size: 10px;
  }

  .federation-name {
    font-size: 10px;
  }
}
</style>

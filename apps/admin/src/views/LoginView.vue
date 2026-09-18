<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '../auth/auth.store';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const { loading, error } = storeToRefs(authStore);

const username = ref('');
const password = ref('');

async function handleLogin() {
  if (!username.value.trim() || !password.value) {
    return;
  }

  try {
    await authStore.login(
      username.value.trim(),
      password.value,
    );

    /**
     * Si une route protégée avait été demandée avant
     * la connexion, on y retourne.
     *
     * Sinon, on utilise le dashboard correspondant au rôle.
     */
    const redirect = route.query.redirect;

    if (typeof redirect === 'string' && redirect) {
      await router.push(redirect);
      return;
    }

    switch (authStore.role) {
      case 'ADMIN':
        await router.push({
          name: 'admin-dashboard',
        });
        break;

      case 'AGENT':
        await router.push({
          name: 'agent-dashboard',
        });
        break;

      case 'CONTROLEUR':
        await router.push({
          name: 'controleur-dashboard',
        });
        break;

      case 'AUTORITE_HABILITEE':
        await router.push({
          name: 'autorite-dashboard',
        });
        break;

      default:
        await router.push({
          name: 'unauthorized',
        });
    }
  } catch {
    // L'erreur est déjà stockée dans authStore.error.
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-header">
        <h1>Gare Routière</h1>

        <p>
          Administration de la plateforme
        </p>
      </div>

      <form
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <div class="form-group">
          <label for="username">
            Nom d'utilisateur
          </label>

          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Entrez votre nom d'utilisateur"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">
            Mot de passe
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Entrez votre mot de passe"
            :disabled="loading"
          />
        </div>

        <div
          v-if="error"
          class="login-error"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="
            loading ||
            !username.trim() ||
            !password
          "
        >
          <span v-if="loading">
            Connexion...
          </span>

          <span v-else>
            Se connecter
          </span>
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f4f6f8;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.login-header {
  margin-bottom: 28px;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.login-header p {
  margin: 0;
  color: #666;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d0d5d9;
  border-radius: 8px;
  font-size: 15px;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
}

button {
  width: 100%;
  padding: 13px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.login-error {
  padding: 12px;
  border-radius: 8px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
}
</style>
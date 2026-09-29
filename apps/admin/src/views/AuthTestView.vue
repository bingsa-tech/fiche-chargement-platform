<template>
  <div class="auth-test">
    <h1>Test authentification JWT</h1>

    <p>
      Cette page permet de tester l'accès à une route protégée
      du backend NestJS.
    </p>

    <div class="actions">
      <button
        :disabled="loading"
        @click="testProtectedRoute"
      >
        {{
          loading
            ? 'Test en cours...'
            : 'Tester l’authentification JWT'
        }}
      </button>

      <button
        :disabled="shortTokenLoading"
        @click="generateShortToken"
      >
        {{
          shortTokenLoading
            ? 'Génération en cours...'
            : 'Générer un token de test (10 s)'
        }}
      </button>
    </div>

    <div v-if="error" class="error">
      <strong>Erreur :</strong>
      {{ error }}
    </div>

    <div v-if="shortTokenMessage" class="info">
      {{ shortTokenMessage }}
    </div>

    <div v-if="result" class="success">
      <h2>Réponse du backend</h2>

      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import api from '../api/axios';

const ACCESS_TOKEN_KEY = 'access_token';

const loading = ref(false);
const shortTokenLoading = ref(false);

const error = ref<string | null>(null);
const shortTokenMessage = ref<string | null>(null);

const result = ref<unknown>(null);

async function testProtectedRoute(): Promise<void> {
  loading.value = true;
  error.value = null;
  result.value = null;

  try {
    const response = await api.get(
      '/api/test-permissions/protected',
    );

    result.value = response.data;
  } catch (err: unknown) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Une erreur est survenue.';
  } finally {
    loading.value = false;
  }
}

async function generateShortToken(): Promise<void> {
  shortTokenLoading.value = true;
  error.value = null;
  shortTokenMessage.value = null;
  result.value = null;

  try {
    const response = await api.get(
      '/api/test-permissions/short-token',
    );

    const shortToken =
      response.data?.accessToken;

    if (!shortToken) {
      throw new Error(
        'Le backend n’a pas retourné de token de test.',
      );
    }

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      shortToken,
    );

    shortTokenMessage.value =
      'Token de test installé. Il expire dans 10 secondes.';

    result.value = {
      message: response.data?.message,
      expiresIn: response.data?.expiresIn,
    };
  } catch (err: unknown) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Impossible de générer le token de test.';
  } finally {
    shortTokenLoading.value = false;
  }
}
</script>

<style scoped>
.auth-test {
  padding: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

button {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
}

.info {
  margin-top: 1rem;
  padding: 1rem;
}

.success {
  margin-top: 1rem;
}

pre {
  padding: 1rem;
  overflow-x: auto;
}
</style>
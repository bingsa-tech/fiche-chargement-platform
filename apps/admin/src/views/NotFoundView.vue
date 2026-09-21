<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'role-hub' });
}

function goLogin() {
  router.push({ name: 'login' });
}
</script>

<template>
  <main class="not-found-page">
    <section class="not-found-card">
      <div class="error-code">
        404
      </div>

      <h1>Page introuvable</h1>

      <p>
        La page que vous recherchez n'existe pas
        ou l'adresse saisie est incorrecte.
      </p>

      <div class="actions">
        <button type="button" @click="goHome">
          Retour à mon espace
        </button>

        <button
          type="button"
          class="secondary"
          @click="goLogin"
        >
          Retour à la connexion
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f4f6f8;
}

.not-found-card {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.error-code {
  margin-bottom: 10px;
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  color: #2563eb;
}

h1 {
  margin: 0 0 12px;
  font-size: 28px;
  color: #1f2937;
}

p {
  margin: 0 0 28px;
  line-height: 1.6;
  color: #6b7280;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

button {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

button.secondary {
  background: #e5e7eb;
  color: #374151;
}
</style>
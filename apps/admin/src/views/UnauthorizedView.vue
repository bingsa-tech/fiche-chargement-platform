<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
  router.push({ name: 'role-hub' });
}

function goToLogin() {
  router.push({ name: 'login' });
}
</script>

<template>
  <main class="unauthorized-page">
    <section class="unauthorized-card">
      <div class="icon">
        🔒
      </div>

      <h1>Accès refusé</h1>

      <p>
        Vous n'avez pas les autorisations nécessaires
        pour accéder à cette page.
      </p>

      <div class="actions">
        <button type="button" @click="goToHome">
          Retour à mon espace
        </button>

        <button
          type="button"
          class="secondary"
          @click="goToLogin"
        >
          Retour à la connexion
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f4f6f8;
}

.unauthorized-card {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.icon {
  margin-bottom: 16px;
  font-size: 48px;
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
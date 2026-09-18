<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <main class="dashboard">
    <div class="dashboard-card">
      <h1>Dashboard Contrôleur</h1>

      <p>
        Bienvenue {{ authStore.user?.prenom }}
        {{ authStore.user?.nom }}.
      </p>

      <p>
        Rôle : <strong>{{ authStore.role }}</strong>
      </p>

      <button type="button" @click="logout">
        Se déconnecter
      </button>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f4f6f8;
}

.dashboard-card {
  width: 100%;
  max-width: 700px;
  padding: 32px;
  background: white;
  border-radius: 12px;
}

button {
  margin-top: 20px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
</style>
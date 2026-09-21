<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../auth/auth.store';

const router = useRouter();
const authStore = useAuthStore();

function redirectByRole() {
  switch (authStore.role) {
    case 'ADMIN':
      router.replace({ name: 'admin-dashboard' });
      break;

    case 'AGENT':
      router.replace({ name: 'agent-dashboard' });
      break;

    case 'CONTROLEUR':
      router.replace({ name: 'controleur-dashboard' });
      break;

    case 'AUTORITE_HABILITEE':
      router.replace({ name: 'autorite-dashboard' });
      break;

    default:
      router.replace({ name: 'unauthorized' });
      break;
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.replace({ name: 'login' });
    return;
  }

  redirectByRole();
});
</script>

<template>
  <main class="role-hub">
    <section class="role-hub-card">
      <div class="loader"></div>

      <h1>Chargement de votre espace</h1>

      <p>
        Redirection vers votre tableau de bord...
      </p>
    </section>
  </main>
</template>

<style scoped>
.role-hub {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f4f6f8;
}

.role-hub-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  text-align: center;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.loader {
  width: 36px;
  height: 36px;
  margin: 0 auto 20px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

h1 {
  margin: 0 0 10px;
  font-size: 22px;
  color: #1f2937;
}

p {
  margin: 0;
  color: #6b7280;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
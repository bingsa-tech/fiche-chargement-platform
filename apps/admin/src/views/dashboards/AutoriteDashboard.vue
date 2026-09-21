<script setup lang="ts">
//import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';

//const router = useRouter();
const authStore = useAuthStore();

//function logout() {
//  authStore.logout();
//
//  router.push({
//    name: 'login',
//  });
//}
</script>

<template>
  <main class="dashboard">
    <section class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <p class="eyebrow">Espace supervision</p>

          <h1>Dashboard Autorité habilitée</h1>

          <p class="welcome">
            Bienvenue
            <strong>
              {{ authStore.user?.prenom }}
              {{ authStore.user?.nom }}
            </strong>
          </p>
        </div>

        <!-- <button type="button" class="logout-button" @click="logout">
          Se déconnecter
        </button> -->
      </header>

      <section class="user-card">
        <div>
          <span class="label">Utilisateur</span>
          <strong>
            {{ authStore.user?.prenom }}
            {{ authStore.user?.nom }}
          </strong>
        </div>

        <div>
          <span class="label">Email</span>
          <strong>{{ authStore.user?.email }}</strong>
        </div>

        <div>
          <span class="label">Rôle</span>
          <strong>{{ authStore.role }}</strong>
        </div>

        <div>
          <span class="label">Gare</span>
          <strong>{{ authStore.user?.gareId ?? 'Non affectée' }}</strong>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">Fiches consultables</span>
          <strong>0</strong>
          <p>À venir</p>
        </article>

        <article class="stat-card">
          <span class="stat-label">Gares</span>
          <strong>0</strong>
          <p>À venir</p>
        </article>

        <article class="stat-card">
          <span class="stat-label">Alertes</span>
          <strong>0</strong>
          <p>À venir</p>
        </article>

        <article class="stat-card">
          <span class="stat-label">Rapports</span>
          <strong>0</strong>
          <p>À venir</p>
        </article>
      </section>

      <section class="modules-card">
        <p class="eyebrow">Supervision</p>

        <h2>Informations disponibles</h2>

        <p>
          Les fonctionnalités de consultation et de supervision seront
          intégrées progressivement.
        </p>

        <div class="module-list">
          <div class="module-item">
            <strong>Consultation des fiches</strong>
            <span>À venir</span>
          </div>

          <div class="module-item">
            <strong>Suivi des gares</strong>
            <span>À venir</span>
          </div>

          <div class="module-item">
            <strong>Consultation des alertes</strong>
            <span>À venir</span>
          </div>

          <div class="module-item">
            <strong>Rapports</strong>
            <span>À venir</span>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 32px;
  background: #f4f6f8;
}

.dashboard-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
}

.welcome {
  margin: 10px 0 0;
  color: #6b7280;
}

.user-card,
.modules-card,
.stat-card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.user-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.user-card > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label,
.stat-label {
  color: #6b7280;
  font-size: 13px;
}

.user-card strong {
  color: #111827;
  word-break: break-word;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 22px;
}

.stat-card strong {
  display: block;
  margin: 8px 0;
  color: #111827;
  font-size: 30px;
}

.stat-card p {
  margin: 0;
  color: #9ca3af;
  font-size: 13px;
}

.modules-card {
  padding: 28px;
}

.modules-card h2 {
  margin: 0 0 8px;
  color: #111827;
}

.modules-card > p:not(.eyebrow) {
  color: #6b7280;
}

.module-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.module-item span {
  color: #6b7280;
  font-size: 13px;
}

.logout-button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background: #b91c1c;
}

@media (max-width: 900px) {
  .user-card,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .user-card,
  .stats-grid,
  .module-list {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 26px;
  }
}
</style>


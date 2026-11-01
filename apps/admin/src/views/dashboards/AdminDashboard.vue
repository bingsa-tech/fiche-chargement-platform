<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getDashboardStats } from '../../api/stats.api';
//import { useAuthStore } from '../../auth/auth.store';
import type { RouteLocationRaw } from 'vue-router';

interface DashboardModule {
  title: string;
  description: string;
  status: string;
  icon: string;
  route: RouteLocationRaw | null;
}
//const authStore = useAuthStore();

/**
 * Informations utilisateur dynamiques (utilisÃ©es dans le template)
 */
/* const userFullName = computed(() => {
  const user = authStore.user;
  if (!user) return 'Utilisateur';
  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});

const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');
const userEmail = computed(() => authStore.user?.email ?? 'Non renseignÃ©');
const userGare = computed(() => authStore.user?.gareId ?? 'Non affectÃ©e');
 */
// Variables rÃ©actives pour les statistiques
const totalUtilisateurs = ref(0);
const totalGares = ref(0);
const totalVehicules = ref(0);
const totalChauffeurs = ref(0);
const totalFiches = ref(0);
const isLoading = ref(true);

const fetchDashboardStats = async () => {
  try {
    isLoading.value = true;
    const stats = await getDashboardStats();
    totalUtilisateurs.value = stats.utilisateurs ?? 0;
    totalGares.value = stats.gares ?? 0;
    totalVehicules.value = stats.vehicules ?? 0;
    totalChauffeurs.value = stats.chauffeurs ?? 0;
    totalFiches.value = stats.fiches ?? 0;
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques du dashboard", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardStats();
});

const statistics = computed(() => [
  {
    label: 'Utilisateurs',
    description: 'Comptes de la plateforme',
    value: totalUtilisateurs.value,
    icon: 'U',
    color: 'blue',
  },
  {
    label: 'Gares',
    description: 'Points de gestion',
    value: totalGares.value,
    icon: 'G',
    color: 'green',
  },
  {
    label: 'VÃ©hicules',
    description: 'Parc automobile',
    value: totalVehicules.value,
    icon: 'V',
    color: 'orange',
  },
  {
    label: 'Chauffeurs',
    description: 'Personnel de conduite',
    value: totalChauffeurs.value,
    icon: 'C',
    color: 'purple',
  },
  {
    label: 'Fiches',
    description: 'Documents de gestion',
    value: totalFiches.value,
    icon: 'F',
    color: 'red',
  },
]);

const modules: DashboardModule[] = [
  {
    title: 'Gestion des utilisateurs',
    description: 'Comptes, rôles et accès à la plateforme.',
    status: 'À connecter à l’API',
    icon: 'U',
    route: { name: 'utilisateurs' },
  },
  {
    title: 'Gestion des gares',
    description: 'Organisation et administration des gares.',
    status: 'Module existant',
    icon: 'G',
    route: { name: 'gares' },
  },
  {
    title: 'Supervision du système',
    description: 'Suivi du fonctionnement de la plateforme.',
    status: 'Module disponible',
    icon: 'S',
    route: { name: 'admin-supervision' },
  },
  {
    title: 'Journal d’audit',
    description: 'Consultation des opérations et événements.',
    status: 'À venir',
    icon: 'A',
    route: { name: 'audit' },
  },
];
</script>

<template>
  <main class="dashboard">
    <!-- Panneau de bienvenue -->





    <!-- Statistiques -->
    <section class="statistics-section" aria-labelledby="statistics-title">
      <div class="section-heading">
        <span class="data-badge">Nos Indicateurs Statistiques</span>
      </div>

      <div class="statistics-grid">
        <article
          v-for="stat in statistics"
          :key="stat.label"
          class="stat-card"
        >
          <div class="stat-top">
            <div class="stat-icon" :class="`icon-${stat.color}`">
              {{ stat.icon }}
            </div>
            <span class="stat-value-badge" aria-hidden="true">
              {{ isLoading ? '...' : stat.value }}
            </span>
          </div>

          <h3>{{ stat.label }}</h3>
          <p>{{ stat.description }}</p>
          <span class="stat-placeholder">
            {{ isLoading ? 'Chargement...' : 'SynchronisÃ© avec la BD' }}
          </span>
        </article>
      </div>
    </section>

    <!-- Modules -->
    <section class="modules-section" aria-labelledby="modules-title">
      <div class="section-heading">
        <div>
          <h2 id="modules-title" class="data-badge">Administration et supervision</h2>
        </div>
      </div>

<div class="modules-grid">
  <template v-for="module in modules" :key="module.title">
    <RouterLink
      v-if="module.route"
      :to="module.route"
      class="module-card"
    >
      <div class="module-icon">{{ module.icon }}</div>
      <div class="module-content">
        <h3>{{ module.title }}</h3>
        <p>{{ module.description }}</p>
        <span class="module-status">{{ module.status }}</span>
      </div>
      <span class="module-arrow" aria-hidden="true">→</span>
    </RouterLink>

    <div v-else class="module-card module-disabled" aria-disabled="true">
      <div class="module-icon">{{ module.icon }}</div>
      <div class="module-content">
        <h3>{{ module.title }}</h3>
        <p>{{ module.description }}</p>
        <span class="module-status">{{ module.status }}</span>
      </div>
    </div>
  </template>
</div>

    </section>

    <p class="dashboard-note">
      Les statistiques sont récupérées en temps réel depuis la base de données.
    </p>
  </main>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
  color: #172033;
  box-sizing: border-box;
}

.welcome-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #dce7fb;
  border-radius: 18px;
  background: linear-gradient(120deg, #eff6ff 0%, #ffffff 75%);
}

.welcome-content {
  max-width: 760px;
}

.welcome-eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #2459b8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.welcome-panel h1 {
  margin: 0;
  color: #172554;
  font-size: clamp(25px, 3vw, 34px);
  line-height: 1.25;
  letter-spacing: -0.8px;
}

.welcome-panel p {
  max-width: 620px;
  margin: 12px 0 0;
  color: #586780;
  font-size: 14px;
  line-height: 1.7;
}

.welcome-avatar {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 4px solid white;
  border-radius: 22px;
  background: #2459b8;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 89, 184, 0.18);
  font-size: 23px;
  font-weight: 800;
}

.account-section,
.statistics-section,
.modules-section {
  margin-bottom: 32px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.account-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #e3e8f0;
  border-radius: 14px;
  background: white;
}

.account-item {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 22px;
}

.account-item + .account-item {
  border-left: 1px solid #edf0f5;
}

.detail-label {
  color: #7a8699;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.account-item strong {
  color: #263349;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.data-badge {
  padding: 7px 11px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #f8fafc;
  color: #64748b;
  font-size: 11px;
  font-weight: 650;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid #e3e8f0;
  border-radius: 15px;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: #cbd8ec;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 19px;
}

.stat-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
}

.icon-blue { background: #eaf2ff; color: #2563eb; }
.icon-green { background: #e8f8ef; color: #16834a; }
.icon-orange { background: #fff3e7; color: #c66b14; }
.icon-purple { background: #f1eafe; color: #7c3aed; }
.icon-red {
  background: #fee2e2;
  color: #dc2626;
}
.stat-value-badge {
  color: #172033;
  font-size: 20px;
  font-weight: 800;
}

.stat-card h3 {
  margin: 0 0 7px;
  color: #263349;
  font-size: 15px;
}

.stat-card p {
  min-height: 36px;
  margin: 0 0 16px;
  color: #7a8699;
  font-size: 12px;
  line-height: 1.6;
}

.stat-placeholder {
  display: inline-block;
  padding-top: 11px;
  border-top: 1px solid #edf0f5;
  color: #7a8699;
  font-size: 11px;
  font-weight: 600;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(240px, 1fr)
  );
  gap: 20px;
}

.module-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #1f2937;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.module-card:not(.module-disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-color: #166534;
}

.module-disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #ecfdf5;
  color: #166534;
  font-weight: 800;
  font-size: 20px;
}

.module-content {
  flex: 1;
}

.module-content h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.module-content p {
  margin: 0 0 12px;
  color: #6b7280;
  font-size: 13px;
}

.module-status {
  font-size: 11px;
  font-weight: 600;
  color: #166534;
}

.module-arrow {
  font-size: 22px;
  color: #166534;

}
</style>

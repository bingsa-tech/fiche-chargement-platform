<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../auth/auth.store';
import { getDashboardStats } from '../../api/stats.api';

const authStore = useAuthStore();

/**
 * Informations utilisateur dynamiques
 */
const userFullName = computed(() => {
  const user = authStore.user;
  if (!user) return 'Utilisateur';
  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});

const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');
const userEmail = computed(() => authStore.user?.email ?? 'Non renseigné');
const userGare = computed(() => authStore.user?.gareId ?? 'Non affectée');

// Variables réactives pour les statistiques
const totalUtilisateurs = ref(0);
const totalGares = ref(0);
const totalVehicules = ref(0);
const totalChauffeurs = ref(0);
const isLoading = ref(true);

const fetchDashboardStats = async () => {
  try {
    isLoading.value = true;
    const stats = await getDashboardStats();
    totalUtilisateurs.value = stats.utilisateurs ?? 0;
    totalGares.value = stats.gares ?? 0;
    totalVehicules.value = stats.vehicules ?? 0;
    totalChauffeurs.value = stats.chauffeurs ?? 0;
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
    label: 'Véhicules',
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
]);

const modules = [
  {
    title: 'Gestion des utilisateurs',
    description: 'Comptes, rôles et accès à la plateforme.',
    status: 'À connecter à l’API',
    icon: 'U',
  },
  {
    title: 'Gestion des gares',
    description: 'Organisation et administration des gares.',
    status: 'Module existant',
    icon: 'G',
  },
  {
    title: 'Supervision du système',
    description: 'Suivi du fonctionnement de la plateforme.',
    status: 'À venir',
    icon: 'S',
  },
  {
    title: 'Journal d’audit',
    description: 'Consultation des opérations et événements.',
    status: 'À venir',
    icon: 'A',
  },
];
</script>

<template>
  <main class="dashboard">
    <!-- Panneau de bienvenue (Utilise userFullName) -->
    <section class="welcome-panel">
      <div class="welcome-content">
        <span class="welcome-eyebrow">ESPACE ADMINISTRATION</span>
        <h1>Bienvenue, {{ userFullName }}</h1>
        <p>Gérez et supervisez l'ensemble des activités, gares et ressources de la plateforme en temps réel.</p>
      </div>
      <div class="welcome-avatar">
        {{ userFullName.charAt(0).toUpperCase() }}
      </div>
    </section>

    <!-- Détails du compte (Utilise userRole, userEmail et userGare) -->
    <section class="account-section">
      <div class="account-card">
        <div class="account-item">
          <span class="detail-label">RÔLE ACTUEL</span>
          <strong>{{ userRole }}</strong>
        </div>
        <div class="account-item">
          <span class="detail-label">EMAIL</span>
          <strong>{{ userEmail }}</strong>
        </div>
        <div class="account-item">
          <span class="detail-label">GARE RATTACHÉE</span>
          <strong>{{ userGare }}</strong>
        </div>
      </div>
    </section>
   
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
            {{ isLoading ? 'Chargement...' : 'Synchronisé avec la BD' }}
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
        <article
          v-for="module in modules"
          :key="module.title"
          class="module-card"
        >
          <div class="module-icon">
            {{ module.icon }}
          </div>

          <div class="module-body">
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>

            <span
              class="module-status"
              :class="{
                'status-ready': module.status === 'Module existant',
                'status-pending': module.status !== 'Module existant',
              }"
            >
              <span class="status-dot"></span>
              {{ module.status }}
            </span>
          </div>

          <span class="module-arrow" aria-hidden="true">›</span>
        </article>
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.module-card {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border: 1px solid #e3e8f0;
  border-radius: 14px;
  background: white;
}

.module-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  background: #f0f4fa;
  color: #405777;
}


</style>
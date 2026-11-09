
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useDestinationStore } from '../../stores/destination.store';
import DestinationForm from '../../components/destinations/DestinationForm.vue';

const route = useRoute();
const router = useRouter();
const store = useDestinationStore();

const id = computed(() => String(route.params.id || ''));
const isEdit = computed(() => Boolean(id.value));

const initial = ref<Awaited<ReturnType<typeof store.fetchDestination>> | null>(null);
const pageError = ref('');

onMounted(async () => {
  if (!isEdit.value) return;

  try {
    initial.value = await store.fetchDestination(id.value);
  } catch {
    pageError.value = store.error || 'Destination introuvable.';
  }
});

async function submit(payload: Parameters<typeof store.addDestination>[0]) {
  pageError.value = '';

  try {
    if (isEdit.value) {
      await store.editDestination(id.value, payload);
    } else {
      await store.addDestination(payload);
    }

    await router.push({ name: 'destinations' });
  } catch {
    pageError.value = store.error || 'Une erreur est survenue.';
  }
}

function goBack() {
  router.push({ name: 'destinations' });
}
</script>

<template>
  <main class="page">
    <!-- Fil d'Ariane -->
    <nav class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <button type="button" @click="goBack">Destinations</button>
      <span class="separator">/</span>
      <span class="current">
        {{ isEdit ? 'Modification' : 'Nouvelle destination' }}
      </span>
    </nav>

    <!-- En-tête -->
    <header class="page-header">
      <div class="heading-content">
        <p class="eyebrow">RÉFÉRENTIEL</p>

        <h1>
          {{ isEdit ? 'Modifier la destination' : 'Nouvelle destination' }}
        </h1>

        <p class="subtitle">
          {{
            isEdit
              ? 'Mettez à jour les informations de cette destination.'
              : 'Enregistrez une nouvelle destination dans le référentiel.'
          }}
        </p>
      </div>

      <button type="button" class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        Retour
      </button>
    </header>

    <!-- Erreur -->
    <div v-if="pageError" class="error-message" role="alert">
      <span class="error-icon">!</span>
      <span>{{ pageError }}</span>
    </div>

    <!-- Chargement de la destination en mode édition -->
    <section v-if="isEdit && !initial && !pageError" class="loading-card">
      <span class="spinner"></span>
      <p>Chargement des informations de la destination…</p>
    </section>

    <!-- Formulaire -->
    <section v-else-if="!pageError" class="form-card">
      <div class="card-header">
        <div class="card-icon">
          <span>{{ isEdit ? '✎' : '+' }}</span>
        </div>

        <div>
          <h2>
            {{ isEdit ? 'Informations de la destination' : 'Informations générales' }}
          </h2>
          <p>
            Renseignez les champs nécessaires à l'enregistrement.
          </p>
        </div>
      </div>

      <div class="card-divider"></div>

      <DestinationForm
        :initial-value="initial"
        :submitting="store.saving"
        @submit="submit"
        @cancel="goBack"
      />

      <p class="form-note">
        Les données sont validées par le backend conformément au contrat de l’API.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  box-sizing: border-box;
}

/* Fil d'Ariane */
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 25px;
  color: #8490a2;
  font-size: 0.82rem;
}

.breadcrumb button {
  border: none;
  padding: 0;
  background: transparent;
  color: #52647c;
  cursor: pointer;
  font: inherit;
}

.breadcrumb button:hover {
  color: #17365d;
  text-decoration: underline;
}

.separator {
  color: #c5a13b;
}

.current {
  color: #17365d;
  font-weight: 700;
}

/* En-tête */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #b18a2c;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.25;
}

.subtitle {
  margin: 9px 0 0;
  color: #667085;
  font-size: 0.94rem;
  line-height: 1.5;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 10px 16px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #fff;
  color: #17365d;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.back-button:hover {
  background: #f4f6f9;
  border-color: #17365d;
}

.back-icon {
  font-size: 1.1rem;
}

/* Carte du formulaire */
.form-card {
  overflow: hidden;
  padding: 26px 28px;
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 24 40 / 4%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 22px;
}

.card-icon {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f5f0e2;
  color: #a17c25;
  font-size: 1.55rem;
  font-weight: 700;
}

.card-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 1.08rem;
  font-weight: 750;
}

.card-header p {
  margin: 5px 0 0;
  color: #8490a2;
  font-size: 0.84rem;
}

.card-divider {
  height: 1px;
  margin-bottom: 25px;
  background: #edf0f4;
}

/* Message d'erreur */
.error-message {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecdca;
  border-radius: 9px;
  background: #fff5f4;
  color: #b42318;
  font-size: 0.9rem;
}

.error-icon {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #b42318;
  color: #fff;
  font-weight: 800;
}

/* Chargement */
.loading-card {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  background: #fff;
  color: #667085;
  font-size: 0.9rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e8edf3;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Note */
.form-note {
  margin: 22px 0 0;
  padding-top: 15px;
  border-top: 1px solid #edf0f4;
  color: #8490a2;
  font-size: 0.78rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .page {
    padding: 20px 16px 32px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header h1 {
    font-size: 1.55rem;
  }

  .back-button {
    align-self: flex-start;
  }

  .form-card {
    padding: 20px 16px;
  }
}
</style>

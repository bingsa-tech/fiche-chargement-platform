<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  createGare,
  getGare,
  updateGare,
} from '../../api/gares.api';

import type {
  GareStatut,
  CreateGarePayload,
  UpdateGarePayload,
} from '../../types/gare.types';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');

const isEditMode = computed(
  () => Boolean(route.params.id),
);

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Modifier la gare'
    : 'Nouvelle gare',
);

const form = reactive<
  CreateGarePayload
>({
  code: '',
  nom: '',
  ville: '',
  adresse: '',
  latitude: undefined,
  longitude: undefined,
  statut: 'ACTIF',
});

const statutOptions: GareStatut[] = [
  'ACTIF',
  'INACTIF',
];

/**
 * Charge la gare à modifier.
 */
async function loadGare(): Promise<void> {
  if (!isEditMode.value) {
    return;
  }

  const id = String(
    route.params.id,
  );

  loading.value = true;
  errorMessage.value = '';

  try {
    const gare = await getGare(id);

    form.code = gare.code;
    form.nom = gare.nom;
    form.ville = gare.ville;
    form.adresse =
      gare.adresse ?? '';
    form.latitude =
      gare.latitude ?? undefined;
    form.longitude =
      gare.longitude ?? undefined;
    form.statut = gare.statut;
  } catch (error: any) {
    console.error(
      'Erreur lors du chargement de la gare :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger cette gare.';
  } finally {
    loading.value = false;
  }
}

/**
 * Retour vers la liste.
 */
function cancel(): void {
  router.push({
    name: 'gares',
  });
}



/**
 * Validation frontend minimale.
 */
function validateForm(): string | null {
  if (!form.code.trim()) {
    return 'Le code de la gare est obligatoire.';
  }

  if (!form.nom.trim()) {
    return 'Le nom de la gare est obligatoire.';
  }

  if (!form.ville.trim()) {
    return 'La ville est obligatoire.';
  }

  if (!form.statut) {
    return 'Le statut de la gare est obligatoire.';
  }

  return null;
}

/**
 * Enregistre la gare.
 */
async function submit(): Promise<void> {
  errorMessage.value = '';

  const validationError =
    validateForm();

  if (validationError) {
    errorMessage.value =
      validationError;

    return;
  }

  saving.value = true;

  try {
    if (isEditMode.value) {
      const payload: UpdateGarePayload = {
        code: form.code.trim(),
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse:
          form.adresse?.trim() || undefined,
        latitude:
          form.latitude,
        longitude:
          form.longitude,
        statut: form.statut,
      };

      await updateGare(
        String(route.params.id),
        payload,
      );
    } else {
      const payload: CreateGarePayload = {
        code: form.code.trim(),
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse:
          form.adresse?.trim() || undefined,
        latitude:
          form.latitude,
        longitude:
          form.longitude,
        statut: form.statut,
      };

      await createGare(payload);
    }

    router.push({
      name: 'gares',
    });
  } catch (error: any) {
    console.error(
      'Erreur lors de l’enregistrement de la gare :',
      error,
    );

    const message =
      error?.response?.data?.message;

    if (Array.isArray(message)) {
      errorMessage.value =
        message.join(' ');
    } else {
      errorMessage.value =
        message ??
        "Impossible d'enregistrer la gare.";
    }
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadGare();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>
          {{ pageTitle }}
        </h1>

        <p class="subtitle">
          {{
            isEditMode
              ? 'Modification des informations de la gare.'
              : 'Enregistrement d’une nouvelle gare.'
          }}
        </p>
      </div>
    </div>

    <!-- Chargement modification -->
    <div
      v-if="loading"
      class="loading"
    >
      Chargement de la gare...
    </div>

    <!-- Formulaire -->
    <form
      v-else
      class="form-card"
      @submit.prevent="submit"
    >
      <!-- Erreur -->
      <div
        v-if="errorMessage"
        class="alert alert-error"
      >
        {{ errorMessage }}
      </div>

      <div class="form-grid">
        <!-- Code -->
        <div class="form-group">
          <label for="code">
            Code *
          </label>

          <input
            id="code"
            v-model="form.code"
            type="text"
            maxlength="30"
            placeholder="Ex. GARE-001"
            required
          />

          <small>
            Code unique de la gare.
          </small>
        </div>

        <!-- Nom -->
        <div class="form-group">
          <label for="nom">
            Nom *
          </label>

          <input
            id="nom"
            v-model="form.nom"
            type="text"
            maxlength="150"
            placeholder="Ex. Gare routière centrale"
            required
          />
        </div>

        <!-- Ville -->
        <div class="form-group">
          <label for="ville">
            Ville *
          </label>

          <input
            id="ville"
            v-model="form.ville"
            type="text"
            maxlength="100"
            placeholder="Ex. Yaoundé"
            required
          />
        </div>

        <!-- Statut -->
        <div class="form-group">
          <label for="statut">
            Statut *
          </label>

          <select
            id="statut"
            v-model="form.statut"
            required
          >
            <option
              v-for="statut in statutOptions"
              :key="statut"
              :value="statut"
            >
              {{ statut }}
            </option>
          </select>
        </div>

        <!-- Adresse -->
        <div class="form-group full-width">
          <label for="adresse">
            Adresse
          </label>

          <input
            id="adresse"
            v-model="form.adresse"
            type="text"
            maxlength="255"
            placeholder="Adresse complète"
          />
        </div>

        <!-- Latitude -->
        <div class="form-group">
          <label for="latitude">
            Latitude
          </label>

          <input
            id="latitude"
            v-model.number="form.latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            placeholder="Ex. 3.8480"
          />

          <small>
            Valeur comprise entre -90 et 90.
          </small>
        </div>

        <!-- Longitude -->
        <div class="form-group">
          <label for="longitude">
            Longitude
          </label>

          <input
            id="longitude"
            v-model.number="form.longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            placeholder="Ex. 11.5021"
          />

          <small>
            Valeur comprise entre -180 et 180.
          </small>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="saving"
          @click="cancel"
        >
          Annuler
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="saving"
        >
          {{
            saving
              ? 'Enregistrement...'
              : isEditMode
                ? 'Enregistrer les modifications'
                : 'Créer la gare'
          }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  margin: 6px 0 0;
  color: #6b7280;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.form-card {
  max-width: 900px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  font-size: 14px;
  background: white;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
}

small {
  color: #6b7280;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  border: none;
  border-radius: 7px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

@media (max-width: 700px) {
  .page {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
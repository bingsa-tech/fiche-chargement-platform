<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';

import {
  useRoute,
  useRouter,
} from 'vue-router';

import {
  createProprietaire,
  getProprietaire,
  updateProprietaire,
} from '../../api/proprietaires.api';

import type {
  CreateProprietairePayload,
  UpdateProprietairePayload,
} from '../../types/proprietaire.types';

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
    ? 'Modifier le propriétaire'
    : 'Nouveau propriétaire',
);

const form = reactive<
  CreateProprietairePayload
>({
  nom: '',
  prenom: '',
  telephone: '',
  adresse: '',
  numeroPieceIdentite: '',
  typePieceIdentite: '',
  statut: 'ACTIF',
});

const statutOptions = [
  'ACTIF',
  'INACTIF',
];

/**
 * Charge le propriétaire
 * en mode modification.
 */
async function loadProprietaire(): Promise<void> {
  if (!isEditMode.value) {
    return;
  }

  const id =
    String(route.params.id);

  loading.value = true;
  errorMessage.value = '';

  try {
    const proprietaire =
      await getProprietaire(id);

    form.nom =
      proprietaire.nom;

    form.prenom =
      proprietaire.prenom;

    form.telephone =
      proprietaire.telephone ??
      '';

    form.adresse =
      proprietaire.adresse ??
      '';

    form.numeroPieceIdentite =
      proprietaire.numeroPieceIdentite ??
      '';

    form.typePieceIdentite =
      proprietaire.typePieceIdentite ??
      '';

    form.statut =
      proprietaire.statut;
  } catch (error: any) {
    console.error(
      'Erreur lors du chargement du propriétaire :',
      error,
    );

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger ce propriétaire.';
  } finally {
    loading.value = false;
  }
}

/**
 * Retour vers la liste.
 */
function cancel(): void {
  router.push({
    name: 'proprietaires',
  });
}

/**
 * Validation frontend minimale.
 */
function validateForm(): string | null {
  if (!form.nom.trim()) {
    return 'Le nom est obligatoire.';
  }

  if (!form.prenom.trim()) {
    return 'Le prénom est obligatoire.';
  }

  if (!form.statut) {
    return 'Le statut est obligatoire.';
  }

  return null;
}

/**
 * Enregistrement.
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
      const payload:
        UpdateProprietairePayload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),

        telephone:
          form.telephone?.trim() ||
          undefined,

        adresse:
          form.adresse?.trim() ||
          undefined,

        numeroPieceIdentite:
          form.numeroPieceIdentite?.trim() ||
          undefined,

        typePieceIdentite:
          form.typePieceIdentite?.trim() ||
          undefined,

        statut: form.statut,
      };

      await updateProprietaire(
        String(route.params.id),
        payload,
      );
    } else {
      const payload:
        CreateProprietairePayload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),

        telephone:
          form.telephone?.trim() ||
          undefined,

        adresse:
          form.adresse?.trim() ||
          undefined,

        numeroPieceIdentite:
          form.numeroPieceIdentite?.trim() ||
          undefined,

        typePieceIdentite:
          form.typePieceIdentite?.trim() ||
          undefined,

        statut: form.statut,
      };

      await createProprietaire(
        payload,
      );
    }

    router.push({
      name: 'proprietaires',
    });
  } catch (error: any) {
    console.error(
      'Erreur lors de l’enregistrement du propriétaire :',
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
        "Impossible d'enregistrer le propriétaire.";
    }
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadProprietaire();
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
              ? 'Modification des informations du propriétaire.'
              : 'Enregistrement d’un nouveau propriétaire.'
          }}
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      Chargement du propriétaire...
    </div>

    <form
      v-else
      class="form-card"
      @submit.prevent="submit"
    >
      <div
        v-if="errorMessage"
        class="alert alert-error"
      >
        {{ errorMessage }}
      </div>

      <div class="form-grid">
        <!-- Nom -->
        <div class="form-group">
          <label for="nom">
            Nom *
          </label>

          <input
            id="nom"
            v-model="form.nom"
            type="text"
            maxlength="100"
            placeholder="Ex. Kameni"
            required
          />
        </div>

        <!-- Prénom -->
        <div class="form-group">
          <label for="prenom">
            Prénom *
          </label>

          <input
            id="prenom"
            v-model="form.prenom"
            type="text"
            maxlength="100"
            placeholder="Ex. Jean"
            required
          />
        </div>

        <!-- Téléphone -->
        <div class="form-group">
          <label for="telephone">
            Téléphone
          </label>

          <input
            id="telephone"
            v-model="form.telephone"
            type="tel"
            maxlength="30"
            placeholder="Ex. 699123456"
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

        <!-- Type pièce -->
        <div class="form-group">
          <label for="typePieceIdentite">
            Type de pièce d'identité
          </label>

          <input
            id="typePieceIdentite"
            v-model="
              form.typePieceIdentite
            "
            type="text"
            maxlength="50"
            placeholder="Ex. CNI"
          />
        </div>

        <!-- Numéro pièce -->
        <div class="form-group">
          <label for="numeroPieceIdentite">
            Numéro de pièce d'identité
          </label>

          <input
            id="numeroPieceIdentite"
            v-model="
              form.numeroPieceIdentite
            "
            type="text"
            maxlength="100"
            placeholder="Ex. 123456789"
          />
        </div>

        <!-- Adresse -->
        <div class="form-group full-width">
          <label for="adresse">
            Adresse
          </label>

          <textarea
            id="adresse"
            v-model="form.adresse"
            rows="3"
            placeholder="Adresse complète"
          />
        </div>
      </div>

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
                : 'Créer le propriétaire'
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
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
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
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  font-size: 14px;
  font-family: inherit;
  background: white;
}

textarea {
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
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

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
  isEditMode.value ? 'Modifier la gare' : 'Nouvelle gare',
);

const form = reactive<CreateGarePayload>({
  code: '',
  nom: '',
  ville: '',
  adresse: '',
  latitude: undefined,
  longitude: undefined,
  statut: 'ACTIF',
});

const statutOptions: GareStatut[] = ['ACTIF', 'INACTIF'];

async function loadGare(): Promise<void> {
  if (!isEditMode.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const gare = await getGare(String(route.params.id));

    form.code = gare.code;
    form.nom = gare.nom;
    form.ville = gare.ville;
    form.adresse = gare.adresse ?? '';
    form.latitude = gare.latitude ?? undefined;
    form.longitude = gare.longitude ?? undefined;
    form.statut = gare.statut;
  } catch (error: any) {
    console.error('Erreur lors du chargement de la gare :', error);

    errorMessage.value =
      error?.response?.data?.message ??
      'Impossible de charger cette gare.';
  } finally {
    loading.value = false;
  }
}

function cancel(): void {
  router.push({ name: 'gares' });
}

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

  if (
    form.latitude !== undefined &&
    (Number(form.latitude) < -90 || Number(form.latitude) > 90)
  ) {
    return 'La latitude doit être comprise entre -90 et 90.';
  }

  if (
    form.longitude !== undefined &&
    (Number(form.longitude) < -180 || Number(form.longitude) > 180)
  ) {
    return 'La longitude doit être comprise entre -180 et 180.';
  }

  return null;
}

async function submit(): Promise<void> {
  errorMessage.value = '';

  const validationError = validateForm();

  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  saving.value = true;

  try {
    if (isEditMode.value) {
      const payload: UpdateGarePayload = {
        code: form.code.trim(),
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse: form.adresse?.trim() || undefined,
        latitude: form.latitude,
        longitude: form.longitude,
        statut: form.statut,
      };

      await updateGare(String(route.params.id), payload);
    } else {
      const payload: CreateGarePayload = {
        code: form.code.trim(),
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse: form.adresse?.trim() || undefined,
        latitude: form.latitude,
        longitude: form.longitude,
        statut: form.statut,
      };

      await createGare(payload);
    }

    router.push({ name: 'gares' });
  } catch (error: any) {
    console.error(
      'Erreur lors de l’enregistrement de la gare :',
      error,
    );

    const message = error?.response?.data?.message;

    errorMessage.value = Array.isArray(message)
      ? message.join(' ')
      : message ?? "Impossible d'enregistrer la gare.";
  } finally {
    saving.value = false;
  }
}

onMounted(loadGare);
</script>

<template>
  <section class="page">
    <!-- Fil d'Ariane -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <button type="button" @click="cancel">Gares</button>
      <span class="separator">/</span>
      <span class="current">
        {{ isEditMode ? 'Modification' : 'Nouvelle gare' }}
      </span>
    </div>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">▤</div>

        <div>
          <h1>{{ pageTitle }}</h1>
          <p class="subtitle">
            {{
              isEditMode
                ? 'Modification des informations de la gare.'
                : 'Enregistrement d’une nouvelle gare.'
            }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-secondary"
        :disabled="saving"
        @click="cancel"
      >
        <span class="back-icon">←</span>
        Retour à la liste
      </button>
    </header>

    <!-- Chargement -->
    <div v-if="loading" class="loading-card">
      <span class="spinner"></span>
      <p>Chargement de la gare...</p>
    </div>

    <!-- Formulaire -->
    <form
      v-else
      class="form-card"
      @submit.prevent="submit"
    >
      <div class="form-card-header">
        <div>
          <h2>Informations de la gare</h2>
          <p>Renseignez les informations nécessaires ci-dessous.</p>
        </div>

        <span class="required-note">* Champs obligatoires</span>
      </div>

      <div
        v-if="errorMessage"
        class="alert alert-error"
        role="alert"
      >
        <span class="alert-icon">!</span>
        <span>{{ errorMessage }}</span>
        <button
          type="button"
          class="alert-close"
          aria-label="Fermer"
          @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <!-- Identification -->
      <div class="form-section">
        <div class="section-heading">
          <span class="section-number">01</span>
          <div>
            <h3>Identification</h3>
            <p>Informations générales et administratives de la gare.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="code">Code de la gare <span>*</span></label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              maxlength="30"
              placeholder="Ex. GARE-001"
              required
            />
            <small>Code unique permettant d'identifier la gare.</small>
          </div>

          <div class="form-group">
            <label for="nom">Nom de la gare <span>*</span></label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              maxlength="150"
              placeholder="Ex. Gare routière centrale"
              required
            />
          </div>

          <div class="form-group">
            <label for="ville">Ville <span>*</span></label>
            <input
              id="ville"
              v-model="form.ville"
              type="text"
              maxlength="100"
              placeholder="Ex. Yaoundé"
              required
            />
          </div>

          <div class="form-group">
            <label for="statut">Statut <span>*</span></label>
            <select id="statut" v-model="form.statut" required>
              <option
                v-for="statut in statutOptions"
                :key="statut"
                :value="statut"
              >
                {{ statut }}
              </option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="adresse">Adresse</label>
            <input
              id="adresse"
              v-model="form.adresse"
              type="text"
              maxlength="255"
              placeholder="Adresse complète de la gare"
            />
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Géolocalisation -->
      <div class="form-section">
        <div class="section-heading">
          <span class="section-number">02</span>
          <div>
            <h3>Géolocalisation</h3>
            <p>Coordonnées géographiques de la gare.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input
              id="latitude"
              v-model.number="form.latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              placeholder="Ex. 3.8480"
            />
            <small>Valeur comprise entre -90 et 90.</small>
          </div>

          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input
              id="longitude"
              v-model.number="form.longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              placeholder="Ex. 11.5021"
            />
            <small>Valeur comprise entre -180 et 180.</small>
          </div>
        </div>

        <div class="info-note">
          <span class="info-icon">i</span>
          Les coordonnées géographiques sont facultatives.
          Elles pourront servir à localiser la gare sur une carte.
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
          <span v-if="saving" class="button-spinner"></span>
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
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  box-sizing: border-box;
  color: #243247;
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 20px;
  color: #8792a2;
  font-size: 13px;
}

.breadcrumb button {
  padding: 0;
  border: none;
  background: transparent;
  color: #52647a;
  cursor: pointer;
  font: inherit;
}

.breadcrumb button:hover {
  color: #17365d;
  text-decoration: underline;
}

.separator {
  color: #c4cad2;
}

.current {
  color: #17365d;
  font-weight: 600;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #17365d;
  color: #e2c16b;
  font-size: 27px;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  margin: 6px 0 0;
  color: #7b8797;
  font-size: 14px;
  line-height: 1.5;
}

.form-card {
  max-width: 1050px;
  overflow: hidden;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 12px rgb(23 54 93 / 5%);
}

.form-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px;
  border-bottom: 1px solid #edf0f4;
}

.form-card-header h2 {
  margin: 0;
  color: #17365d;
  font-size: 18px;
  font-weight: 700;
}

.form-card-header p {
  margin: 6px 0 0;
  color: #8792a2;
  font-size: 13px;
}

.required-note {
  color: #8993a2;
  font-size: 12px;
  white-space: nowrap;
}

.form-section {
  padding: 26px 28px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 23px;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #f5f1e5;
  color: #9a792a;
  font-size: 12px;
  font-weight: 800;
}

.section-heading h3 {
  margin: 0;
  color: #263b55;
  font-size: 15px;
  font-weight: 700;
}

.section-heading p {
  margin: 5px 0 0;
  color: #8993a2;
  font-size: 12px;
}

.section-divider {
  height: 1px;
  margin: 0 28px;
  background: #edf0f4;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #46566b;
  font-size: 13px;
  font-weight: 600;
}

.form-group label span {
  color: #b4534b;
}

.form-group input,
.form-group select {
  width: 100%;
  min-height: 42px;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #dce2e9;
  border-radius: 7px;
  outline: none;
  background: #fff;
  color: #263b55;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #aab3bf;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.form-group small {
  color: #8993a2;
  font-size: 11px;
  line-height: 1.5;
}

.info-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 22px;
  padding: 13px 15px;
  border: 1px solid #e5eaf1;
  border-radius: 8px;
  background: #f7f9fc;
  color: #617087;
  font-size: 12px;
  line-height: 1.6;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #17365d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 28px 0;
  padding: 13px 15px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.alert-error {
  border: 1px solid #f2c9c6;
  background: #fff5f4;
  color: #963d38;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #963d38;
  color: #fff;
  font-weight: 700;
}

.alert-close {
  margin-left: auto;
  padding: 0 4px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  border-top: 1px solid #edf0f4;
  background: #fafbfd;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 40px;
  padding: 10px 17px;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  border-color: #17365d;
  background: #17365d;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  border-color: #102844;
  background: #102844;
}

.btn-secondary {
  border-color: #dce2e9;
  background: #fff;
  color: #52647a;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #17365d;
  background: #f5f7fa;
  color: #17365d;
}

.back-icon {
  font-size: 17px;
}

.loading-card {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
  background: #fff;
  color: #7b8797;
  font-size: 14px;
}

.spinner,
.button-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #e7ebf0;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-color: rgb(255 255 255 / 35%);
  border-top-color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .page {
    padding: 20px 16px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .page-header > .btn {
    width: 100%;
  }

  .form-card-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .form-section {
    padding: 22px 20px;
  }

  .section-divider {
    margin: 0 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .alert {
    margin-right: 20px;
    margin-left: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
    padding: 18px 20px;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>

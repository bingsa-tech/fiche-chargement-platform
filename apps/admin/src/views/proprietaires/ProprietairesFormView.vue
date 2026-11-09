
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

const isEditMode = computed(() => Boolean(route.params.id));

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Modifier le propriétaire'
    : 'Nouveau propriétaire',
);

const form = reactive<CreateProprietairePayload>({
  nom: '',
  prenom: '',
  telephone: '',
  adresse: '',
  numeroPieceIdentite: '',
  typePieceIdentite: '',
  statut: 'ACTIF',
});

const statutOptions = ['ACTIF', 'INACTIF'];

async function loadProprietaire(): Promise<void> {
  if (!isEditMode.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const proprietaire = await getProprietaire(
      String(route.params.id),
    );

    form.nom = proprietaire.nom;
    form.prenom = proprietaire.prenom;
    form.telephone = proprietaire.telephone ?? '';
    form.adresse = proprietaire.adresse ?? '';
    form.numeroPieceIdentite =
      proprietaire.numeroPieceIdentite ?? '';
    form.typePieceIdentite =
      proprietaire.typePieceIdentite ?? '';
    form.statut = proprietaire.statut;
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

function cancel(): void {
  router.push({ name: 'proprietaires' });
}

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
      const payload: UpdateProprietairePayload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        telephone: form.telephone?.trim() || undefined,
        adresse: form.adresse?.trim() || undefined,
        numeroPieceIdentite:
          form.numeroPieceIdentite?.trim() || undefined,
        typePieceIdentite:
          form.typePieceIdentite?.trim() || undefined,
        statut: form.statut,
      };

      await updateProprietaire(
        String(route.params.id),
        payload,
      );
    } else {
      const payload: CreateProprietairePayload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        telephone: form.telephone?.trim() || undefined,
        adresse: form.adresse?.trim() || undefined,
        numeroPieceIdentite:
          form.numeroPieceIdentite?.trim() || undefined,
        typePieceIdentite:
          form.typePieceIdentite?.trim() || undefined,
        statut: form.statut,
      };

      await createProprietaire(payload);
    }

    router.push({ name: 'proprietaires' });
  } catch (error: any) {
    console.error(
      'Erreur lors de l’enregistrement du propriétaire :',
      error,
    );

    const message = error?.response?.data?.message;

    errorMessage.value = Array.isArray(message)
      ? message.join(' ')
      : message ?? "Impossible d'enregistrer le propriétaire.";
  } finally {
    saving.value = false;
  }
}

onMounted(loadProprietaire);
</script>

<template>
  <section class="page">
    <!-- En-tête -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <button type="button" @click="cancel">
        Propriétaires
      </button>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">
        {{ isEditMode ? 'Modification' : 'Nouveau' }}
      </span>
    </div>

    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>♙</span>
        </div>

        <div>
          <h1>{{ pageTitle }}</h1>
          <p class="subtitle">
            {{
              isEditMode
                ? 'Modification des informations du propriétaire.'
                : 'Enregistrement d’un nouveau propriétaire.'
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
        <span class="btn-icon">←</span>
        Retour à la liste
      </button>
    </header>

    <!-- Chargement -->
    <div v-if="loading" class="loading-card">
      <span class="spinner"></span>
      <p>Chargement du propriétaire...</p>
    </div>

    <form
      v-else
      class="form-card"
      @submit.prevent="submit"
    >
      <div class="form-card-header">
        <div>
          <h2>Informations du propriétaire</h2>
          <p>
            Renseignez les informations nécessaires ci-dessous.
          </p>
        </div>

        <span class="required-note">
          * Champs obligatoires
        </span>
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

      <!-- Identité -->
      <div class="form-section">
        <div class="section-heading">
          <span class="section-number">01</span>
          <div>
            <h3>Identité</h3>
            <p>Informations personnelles du propriétaire.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="nom">Nom <span>*</span></label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              maxlength="100"
              placeholder="Ex. Kameni"
              autocomplete="family-name"
              required
            />
          </div>

          <div class="form-group">
            <label for="prenom">
              Prénom <span>*</span>
            </label>
            <input
              id="prenom"
              v-model="form.prenom"
              type="text"
              maxlength="100"
              placeholder="Ex. Jean"
              autocomplete="given-name"
              required
            />
          </div>

          <div class="form-group">
            <label for="telephone">Téléphone</label>
            <input
              id="telephone"
              v-model="form.telephone"
              type="tel"
              maxlength="30"
              placeholder="Ex. 699123456"
              autocomplete="tel"
            />
          </div>

          <div class="form-group">
            <label for="statut">
              Statut <span>*</span>
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
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Pièce d'identité -->
      <div class="form-section">
        <div class="section-heading">
          <span class="section-number">02</span>
          <div>
            <h3>Pièce d'identité</h3>
            <p>Références du document d'identification.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="typePieceIdentite">
              Type de pièce d'identité
            </label>
            <input
              id="typePieceIdentite"
              v-model="form.typePieceIdentite"
              type="text"
              maxlength="50"
              placeholder="Ex. CNI"
            />
          </div>

          <div class="form-group">
            <label for="numeroPieceIdentite">
              Numéro de pièce d'identité
            </label>
            <input
              id="numeroPieceIdentite"
              v-model="form.numeroPieceIdentite"
              type="text"
              maxlength="100"
              placeholder="Ex. 123456789"
            />
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Adresse -->
      <div class="form-section">
        <div class="section-heading">
          <span class="section-number">03</span>
          <div>
            <h3>Coordonnées</h3>
            <p>Adresse et informations complémentaires.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label for="adresse">Adresse</label>
            <textarea
              id="adresse"
              v-model="form.adresse"
              rows="3"
              placeholder="Adresse complète du propriétaire"
            ></textarea>
          </div>
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
                : 'Créer le propriétaire'
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

/* Fil d'Ariane */
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
  background: none;
  color: #52647a;
  cursor: pointer;
  font: inherit;
}

.breadcrumb button:hover {
  color: #17365d;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #c4cad2;
}

.breadcrumb-current {
  color: #17365d;
  font-weight: 600;
}

/* En-tête */
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
  font-size: 28px;
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

/* Carte formulaire */
.form-card {
  max-width: 1050px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
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

/* Sections */
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

/* Champs */
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
.form-group select,
.form-group textarea {
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

.form-group textarea {
  resize: vertical;
  min-height: 90px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #aab3bf;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background: #f5f6f8;
  cursor: not-allowed;
}

/* Alertes */
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

/* Boutons */
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

.btn-icon {
  font-size: 17px;
  line-height: 1;
}

/* Chargement */
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

/* Responsive */
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

  .form-actions .btn,
  .page-header > .btn {
    width: 100%;
  }
}
</style>

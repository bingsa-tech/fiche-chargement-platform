
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  createChauffeur,
  getChauffeur,
  updateChauffeur,
} from '../../api/chauffeurs.api';

import type {
  CreateChauffeurPayload,
  UpdateChauffeurPayload,
} from '../../types/chauffeur.types';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const loadFailed = ref(false);
const error = ref<string | null>(null);

const isEditMode = computed(() => Boolean(route.params.id));

const chauffeurId = computed(() =>
  typeof route.params.id === 'string'
    ? route.params.id
    : undefined,
);

const form = reactive<CreateChauffeurPayload>({
  nom: '',
  prenom: '',
  telephone: '',
  statut: 'ACTIF',
  document: {
    typeDocument: '',
    numeroDocument: '',
    dateDelivrance: '',
    dateExpiration: '',
    statut: '',
    observations: '',
  },
});

function resetForm(): void {
  form.nom = '';
  form.prenom = '';
  form.telephone = '';
  form.statut = 'ACTIF';

  form.document.typeDocument = '';
  form.document.numeroDocument = '';
  form.document.dateDelivrance = '';
  form.document.dateExpiration = '';
  form.document.statut = '';
  form.document.observations = '';
}

async function loadChauffeur(): Promise<void> {
  if (!chauffeurId.value) {
    loadFailed.value = true;
    error.value = 'Identifiant du chauffeur introuvable.';
    return;
  }

  loading.value = true;
  loadFailed.value = false;
  error.value = null;

  try {
    const chauffeur = await getChauffeur(chauffeurId.value);

    form.nom = chauffeur.nom;
    form.prenom = chauffeur.prenom;
    form.telephone = chauffeur.telephone ?? '';
    form.statut = chauffeur.statut;
  } catch (err) {
    console.error('Erreur chargement chauffeur :', err);

    loadFailed.value = true;
    error.value =
      'Impossible de charger les informations du chauffeur.';
  } finally {
    loading.value = false;
  }
}

async function submit(): Promise<void> {
  if (saving.value || loading.value || loadFailed.value) {
    return;
  }

  error.value = null;
  saving.value = true;

  try {
    if (isEditMode.value) {
      if (!chauffeurId.value) {
        throw new Error('Identifiant du chauffeur introuvable.');
      }

      const payload: UpdateChauffeurPayload = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || undefined,
        statut: form.statut,
      };

      await updateChauffeur(chauffeurId.value, payload);
    } else {
      const payload: CreateChauffeurPayload = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || undefined,
        statut: form.statut,
        document: {
          typeDocument: form.document.typeDocument,
          numeroDocument:
            form.document.numeroDocument || undefined,
          dateDelivrance:
            form.document.dateDelivrance || undefined,
          dateExpiration: form.document.dateExpiration,
          statut: form.document.statut,
          observations:
            form.document.observations || undefined,
        },
      };

      await createChauffeur(payload);
    }

    await router.push({ name: 'chauffeurs' });
  } catch (err) {
    console.error('Erreur enregistrement chauffeur :', err);

    error.value = isEditMode.value
      ? 'Impossible de modifier le chauffeur. Vérifiez les informations et réessayez.'
      : 'Impossible de créer le chauffeur. Vérifiez les informations et réessayez.';
  } finally {
    saving.value = false;
  }
}

function cancel(): void {
  void router.push({ name: 'chauffeurs' });
}

onMounted(async () => {
  if (isEditMode.value) {
    await loadChauffeur();
  } else {
    resetForm();
  }
});
</script>

<template>
  <div class="chauffeur-form-page">
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <button type="button" @click="cancel">Chauffeurs</button>
      <span class="separator">/</span>
      <strong>
        {{ isEditMode ? 'Modification' : 'Nouveau chauffeur' }}
      </strong>
    </div>

    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">CH</div>
        <div>
          <h1>
            {{ isEditMode ? 'Modifier le chauffeur' : 'Nouveau chauffeur' }}
          </h1>
          <p>
            {{
              isEditMode
                ? 'Modifiez les informations du chauffeur.'
                : 'Enregistrez un chauffeur et son document initial.'
            }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="btn-back"
        :disabled="saving"
        @click="cancel"
      >
        ← Retour à la liste
      </button>
    </header>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span>
      <p>Chargement des informations...</p>
    </div>

    <div v-else-if="loadFailed" class="form-card">
      <div class="alert-error">
        {{ error }}
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="cancel">
          Retour
        </button>
        <button type="button" class="btn-primary" @click="loadChauffeur">
          Réessayer
        </button>
      </div>
    </div>

    <div v-else class="form-card">
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <form @submit.prevent="submit">
        <section class="form-section">
          <div class="section-heading">
            <div class="section-number">01</div>
            <div>
              <h2>Informations du chauffeur</h2>
              <p>Renseignements personnels et coordonnées.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="nom">Nom <span>*</span></label>
              <input
                id="nom"
                v-model.trim="form.nom"
                type="text"
                maxlength="100"
                autocomplete="family-name"
                required
              />
            </div>

            <div class="form-group">
              <label for="prenom">Prénom <span>*</span></label>
              <input
                id="prenom"
                v-model.trim="form.prenom"
                type="text"
                maxlength="100"
                autocomplete="given-name"
                required
              />
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone</label>
              <input
                id="telephone"
                v-model.trim="form.telephone"
                type="tel"
                maxlength="30"
                autocomplete="tel"
                placeholder="Numéro de téléphone"
              />
            </div>

            <div class="form-group">
              <label for="statut">Statut <span>*</span></label>
              <select id="statut" v-model="form.statut" required>
                <option value="ACTIF">ACTIF</option>
                <option value="INACTIF">INACTIF</option>
              </select>
            </div>
          </div>
        </section>

        <section v-if="!isEditMode" class="form-section">
          <div class="section-heading">
            <div class="section-number gold">02</div>
            <div>
              <h2>Document initial</h2>
              <p>Document obligatoire lors de la création.</p>
            </div>
          </div>

          <div class="document-notice">
            <strong>À renseigner obligatoirement</strong>
            <p>
              Le chauffeur et son document initial sont enregistrés
              ensemble par le backend.
            </p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="typeDocument">
                Type de document <span>*</span>
              </label>
              <input
                id="typeDocument"
                v-model.trim="form.document.typeDocument"
                type="text"
                maxlength="50"
                required
              />
            </div>

            <div class="form-group">
              <label for="numeroDocument">Numéro du document</label>
              <input
                id="numeroDocument"
                v-model.trim="form.document.numeroDocument"
                type="text"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="dateDelivrance">Date de délivrance</label>
              <input
                id="dateDelivrance"
                v-model="form.document.dateDelivrance"
                type="date"
              />
            </div>

            <div class="form-group">
              <label for="dateExpiration">
                Date d'expiration <span>*</span>
              </label>
              <input
                id="dateExpiration"
                v-model="form.document.dateExpiration"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="documentStatut">
                Statut du document <span>*</span>
              </label>
              <input
                id="documentStatut"
                v-model.trim="form.document.statut"
                type="text"
                maxlength="20"
                required
              />
            </div>

            <div class="form-group form-group-full">
              <label for="observations">Observations</label>
              <textarea
                id="observations"
                v-model.trim="form.document.observations"
                rows="4"
                placeholder="Observations complémentaires..."
              ></textarea>
            </div>
          </div>
        </section>

        <div v-if="isEditMode" class="info-message">
          <span class="info-icon">i</span>
          <p>
            <strong>Gestion séparée des documents</strong>
            La modification du chauffeur ne modifie pas ses documents.
            Utilisez le module Documents chauffeurs pour les gérer.
          </p>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            :disabled="saving"
            @click="cancel"
          >
            Annuler
          </button>

          <button
            type="submit"
            class="btn-primary"
            :disabled="saving"
          >
            <span v-if="saving" class="button-spinner"></span>
            {{
              saving
                ? 'Enregistrement...'
                : isEditMode
                  ? 'Enregistrer les modifications'
                  : 'Créer le chauffeur'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chauffeur-form-page {
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
  padding: 28px 32px;
  box-sizing: border-box;
  color: #243247;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #7b8797;
  font-size: 13px;
}

.breadcrumb button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7b8797;
  font: inherit;
  cursor: pointer;
}

.breadcrumb button:hover {
  color: #17365d;
}

.breadcrumb strong,
.separator {
  color: #17365d;
}

.separator {
  color: #c5a13b;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 13px;
  background: #17365d;
  color: #e2c46b;
  font-size: 15px;
  font-weight: 800;
}

.page-header h1 {
  margin: 0 0 6px;
  color: #17365d;
  font-size: 26px;
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: #7b8797;
  font-size: 13px;
}

.btn-back {
  min-height: 39px;
  padding: 8px 13px;
  border: 1px solid #dce3eb;
  border-radius: 7px;
  background: white;
  color: #17365d;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.form-card {
  padding: 26px;
  border: 1px solid #e7ebf0;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgb(20 40 70 / 3%);
}

.form-section {
  margin-bottom: 30px;
}

.form-section + .form-section {
  padding-top: 26px;
  border-top: 1px solid #edf0f3;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.section-number {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #eaf0f7;
  color: #17365d;
  font-size: 12px;
  font-weight: 800;
}

.section-number.gold {
  background: #f8f2df;
  color: #92721d;
}

.section-heading h2 {
  margin: 0 0 5px;
  color: #17365d;
  font-size: 16px;
}

.section-heading p {
  margin: 0;
  color: #8993a1;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 19px 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-group label {
  color: #405066;
  font-size: 12px;
  font-weight: 700;
}

.form-group label span {
  color: #b54747;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #dfe4ea;
  border-radius: 7px;
  outline: none;
  background: white;
  color: #243247;
  font: inherit;
  font-size: 13px;
}

.form-group input,
.form-group select {
  min-height: 42px;
}

.form-group textarea {
  min-height: 95px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #54769b;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 8%);
}

.document-notice {
  margin-bottom: 22px;
  padding: 13px 16px;
  border: 1px solid #eadfb9;
  border-radius: 7px;
  background: #fcf9ee;
}

.document-notice strong {
  color: #80651d;
  font-size: 12px;
}

.document-notice p {
  margin: 5px 0 0;
  color: #81734e;
  font-size: 12px;
  line-height: 1.6;
}

.info-message {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #dce5ef;
  border-radius: 8px;
  background: #f3f7fb;
}

.info-icon {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #17365d;
  color: white;
  font-size: 13px;
  font-weight: 800;
}

.info-message p {
  margin: 0;
  color: #53657a;
  font-size: 12px;
  line-height: 1.6;
}

.info-message strong {
  display: block;
  margin-bottom: 3px;
  color: #17365d;
}

.alert-error {
  margin-bottom: 22px;
  padding: 13px 15px;
  border: 1px solid #f1caca;
  border-radius: 8px;
  background: #fff4f4;
  color: #9b3030;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 21px;
  border-top: 1px solid #edf0f3;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 41px;
  padding: 9px 17px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border-color: #17365d;
  background: #17365d;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #102944;
}

.btn-secondary {
  border-color: #dce3eb;
  background: white;
  color: #536174;
}

.btn-secondary:hover:not(:disabled) {
  background: #f5f7fa;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-back:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  color: #7b8797;
}

.spinner,
.button-spinner {
  display: inline-block;
  border: 3px solid #e6ebf1;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner {
  width: 29px;
  height: 29px;
}

.button-spinner {
  width: 13px;
  height: 13px;
  border-width: 2px;
  border-top-color: white;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 700px) {
  .chauffeur-form-page {
    padding: 20px 15px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-card {
    padding: 19px 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group-full {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>

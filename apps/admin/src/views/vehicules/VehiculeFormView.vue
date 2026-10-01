<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';

import { useRoute, useRouter } from 'vue-router';

import {
  createVehicule,
  getVehicule,
  updateVehicule,
} from '../../api/vehicules.api';

import {
  getProprietaires,
} from '../../api/proprietaires.api';

import type {
  CreateVehiculePayload,
  UpdateVehiculePayload,
  VehiculeStatut,
} from '../../types/vehicule.types';

import type {
  Proprietaire,
} from '../../types/proprietaire.types';

// =====================================================
// ROUTER
// =====================================================

const route = useRoute();
const router = useRouter();

// =====================================================
// STATE
// =====================================================

const loading = ref(false);
const saving = ref(false);
const error = ref('');

const proprietaires = ref<Proprietaire[]>([]);

let documentCounter = 0;

// =====================================================
// MODE
// =====================================================

const isEditMode = computed(() =>
  Boolean(route.params.id),
);

const pageTitle = computed(() =>
  isEditMode.value
    ? 'Modifier le véhicule'
    : 'Nouveau véhicule',
);

// =====================================================
// TYPES LOCAUX
// =====================================================

interface DocumentForm {
  localId: number;
  typeDocument: string;
  numeroDocument: string;
  dateDelivrance: string;
  dateExpiration: string;
  statut: string;
  observations: string;
}

// =====================================================
// FORMULAIRE
// =====================================================

const form = reactive<{
  plaqueImmatriculation: string;
  type: string;
  marque: string;
  modele: string;
  capacite: number;
  statut: VehiculeStatut;
  proprietaireId: string;
  documents: DocumentForm[];
}>({
  plaqueImmatriculation: '',
  type: '',
  marque: '',
  modele: '',
  capacite: 0,
  statut: 'ACTIF',
  proprietaireId: '',
  documents: [],
});

// =====================================================
// DOCUMENT FACTORY
// =====================================================

function createEmptyDocument(): DocumentForm {
  documentCounter += 1;

  return {
    localId: documentCounter,
    typeDocument: '',
    numeroDocument: '',
    dateDelivrance: '',
    dateExpiration: '',
    statut: 'VALIDE',
    observations: '',
  };
}

// =====================================================
// PROPRIÉTAIRES
// =====================================================

async function loadProprietaires() {
  try {
    proprietaires.value =
      await getProprietaires();
  } catch (err) {
    console.error(err);

    error.value =
      'Impossible de charger la liste des propriétaires.';
  }
}

// =====================================================
// VÉHICULE
// =====================================================

async function loadVehicule() {
  if (!isEditMode.value) {
    return;
  }

  const id = String(route.params.id);

  loading.value = true;
  error.value = '';

  try {
    const vehicule =
      await getVehicule(id);

    form.plaqueImmatriculation =
      vehicule.plaqueImmatriculation;

    form.type =
      vehicule.type;

    form.marque =
      vehicule.marque ?? '';

    form.modele =
      vehicule.modele ?? '';

    form.capacite =
      vehicule.capacite;

    form.statut =
      vehicule.statut;

    form.proprietaireId =
      vehicule.proprietaireId ?? '';

    // -----------------------------------------------
    // Documents existants
    // -----------------------------------------------

    form.documents =
      (vehicule.documentsVehicules ?? []).map(
        (document) => {
          documentCounter += 1;

          return {
            localId: documentCounter,

            typeDocument:
              document.typeDocument ?? '',

            numeroDocument:
              document.numeroDocument ?? '',

            dateDelivrance:
              normalizeDate(
                document.dateDelivrance,
              ),

            dateExpiration:
              normalizeDate(
                document.dateExpiration,
              ),

            statut:
              document.statut ?? 'VALIDE',

            observations:
              document.observations ?? '',
          };
        },
      );
  } catch (err) {
    console.error(err);

    error.value =
      'Impossible de charger le véhicule.';
  } finally {
    loading.value = false;
  }
}

// =====================================================
// DATE
// =====================================================

function normalizeDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return '';
  }

  return value.substring(0, 10);
}

// =====================================================
// DOCUMENTS
// =====================================================

function addDocument() {
  form.documents.push(
    createEmptyDocument(),
  );
}

function removeDocument(index: number) {
  form.documents.splice(index, 1);
}

// =====================================================
// VALIDATION
// =====================================================

function validateForm(): boolean {
  error.value = '';

  // ---------------------------------------------------
  // Véhicule
  // ---------------------------------------------------

  if (!form.plaqueImmatriculation.trim()) {
    error.value =
      "La plaque d'immatriculation est obligatoire.";

    return false;
  }

  if (!form.type.trim()) {
    error.value =
      'Le type du véhicule est obligatoire.';

    return false;
  }

  if (!form.capacite || form.capacite <= 0) {
    error.value =
      'La capacité doit être supérieure à 0.';

    return false;
  }

  if (!form.statut) {
    error.value =
      'Le statut est obligatoire.';

    return false;
  }

  if (!form.proprietaireId) {
    error.value =
      'Le propriétaire est obligatoire.';

    return false;
  }

  // ---------------------------------------------------
  // Documents
  // ---------------------------------------------------

  if (!isEditMode.value) {
    if (form.documents.length === 0) {
      error.value =
        'Au moins un document est obligatoire pour créer un véhicule.';

      return false;
    }

    for (
      let index = 0;
      index < form.documents.length;
      index += 1
    ) {
      const document =
        form.documents[index];

      if (!document.typeDocument.trim()) {
        error.value =
          `Le type du document ${index + 1} est obligatoire.`;

        return false;
      }

      if (!document.dateExpiration) {
        error.value =
          `La date d'expiration du document ${index + 1} est obligatoire.`;

        return false;
      }

      if (!document.statut.trim()) {
        error.value =
          `Le statut du document ${index + 1} est obligatoire.`;

        return false;
      }
    }
  }

  return true;
}

// =====================================================
// CREATE PAYLOAD
// =====================================================

function buildCreatePayload(): CreateVehiculePayload {
  return {
    plaqueImmatriculation:
      form.plaqueImmatriculation.trim(),

    type:
      form.type.trim(),

    marque:
      form.marque.trim() || undefined,

    modele:
      form.modele.trim() || undefined,

    capacite:
      Number(form.capacite),

    statut:
      form.statut,

    proprietaireId:
      form.proprietaireId,

    documents:
      form.documents.map((document) => ({
        typeDocument:
          document.typeDocument.trim(),

        numeroDocument:
          document.numeroDocument.trim() || undefined,

        dateDelivrance:
          document.dateDelivrance || undefined,

        dateExpiration:
          document.dateExpiration,

        statut:
          document.statut.trim(),

        observations:
          document.observations.trim() || undefined,
      })),
  };
}

// =====================================================
// UPDATE PAYLOAD
// =====================================================

function buildUpdatePayload(): UpdateVehiculePayload {
  return {
    plaqueImmatriculation:
      form.plaqueImmatriculation.trim(),

    type:
      form.type.trim(),

    marque:
      form.marque.trim() || undefined,

    modele:
      form.modele.trim() || undefined,

    capacite:
      Number(form.capacite),

    statut:
      form.statut,

    proprietaireId:
      form.proprietaireId,
  };
}

// =====================================================
// SUBMIT
// =====================================================

async function submitForm() {
  if (!validateForm()) {
    return;
  }

  saving.value = true;
  error.value = '';

  try {
    // -------------------------------------------------
    // MODIFICATION
    // -------------------------------------------------

    if (isEditMode.value) {
      const updatePayload =
        buildUpdatePayload();

      await updateVehicule(
        String(route.params.id),
        updatePayload,
      );
    }

    // -------------------------------------------------
    // CRÉATION
    // -------------------------------------------------

    else {
      const payload =
        buildCreatePayload();

      await createVehicule(payload);
    }

    router.push({
      name: 'vehicules',
    });
  } catch (err: any) {
    console.error(err);

    if (err?.response?.data?.message) {
      error.value = Array.isArray(
        err.response.data.message,
      )
        ? err.response.data.message.join(', ')
        : err.response.data.message;
    } else {
      error.value =
        isEditMode.value
          ? 'Impossible de modifier le véhicule.'
          : 'Impossible de créer le véhicule.';
    }
  } finally {
    saving.value = false;
  }
}

// =====================================================
// CANCEL
// =====================================================

function cancel() {
  router.push({
    name: 'vehicules',
  });
}

// =====================================================
// INIT
// =====================================================

onMounted(async () => {
  await loadProprietaires();

  await loadVehicule();

  // En création : proposer directement
  // un premier document.
  if (
    !isEditMode.value &&
    form.documents.length === 0
  ) {
    addDocument();
  }
});
</script>

<template>
  <section class="page">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="page-header">
      <div>
        <h1>
          {{ pageTitle }}
        </h1>

        <p>
          {{
            isEditMode
              ? 'Modifier les informations du véhicule.'
              : 'Enregistrer un véhicule avec ses documents.'
          }}
        </p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- LOADING -->
    <!-- ================================================= -->

    <div
      v-if="loading"
      class="loading"
    >
      Chargement du véhicule...
    </div>

    <!-- ================================================= -->
    <!-- FORM -->
    <!-- ================================================= -->

    <form
      v-else
      class="form-card"
      @submit.prevent="submitForm"
    >

      <!-- ================================================= -->
      <!-- ERROR -->
      <!-- ================================================= -->

      <div
        v-if="error"
        class="alert error"
      >
        {{ error }}
      </div>

      <!-- ================================================= -->
      <!-- VÉHICULE -->
      <!-- ================================================= -->

      <div class="section-title">
        <h2>
          Informations du véhicule
        </h2>

        <p>
          Les champs marqués d'un * sont obligatoires.
        </p>
      </div>

      <div class="form-grid">

        <!-- PLAQUE -->

        <div class="form-group">
          <label for="plaque">
            Plaque d'immatriculation *
          </label>

          <input
            id="plaque"
            v-model="form.plaqueImmatriculation"
            type="text"
            maxlength="30"
            placeholder="Ex. CE-1234-AA"
          />
        </div>

        <!-- TYPE -->

        <div class="form-group">
          <label for="type">
            Type *
          </label>

          <input
            id="type"
            v-model="form.type"
            type="text"
            maxlength="30"
            placeholder="Ex. BUS"
          />
        </div>

        <!-- MARQUE -->

        <div class="form-group">
          <label for="marque">
            Marque
          </label>

          <input
            id="marque"
            v-model="form.marque"
            type="text"
            maxlength="80"
            placeholder="Ex. Mercedes"
          />
        </div>

        <!-- MODÈLE -->

        <div class="form-group">
          <label for="modele">
            Modèle
          </label>

          <input
            id="modele"
            v-model="form.modele"
            type="text"
            maxlength="80"
            placeholder="Ex. Sprinter"
          />
        </div>

        <!-- CAPACITÉ -->

        <div class="form-group">
          <label for="capacite">
            Capacité *
          </label>

          <input
            id="capacite"
            v-model.number="form.capacite"
            type="number"
            min="1"
            step="1"
          />
        </div>

        <!-- STATUT -->

        <div class="form-group">
          <label for="statut">
            Statut *
          </label>

          <select
            id="statut"
            v-model="form.statut"
          >
            <option value="ACTIF">
              ACTIF
            </option>

            <option value="INACTIF">
              INACTIF
            </option>

            <option value="MAINTENANCE">
              MAINTENANCE
            </option>
          </select>
        </div>

        <!-- PROPRIÉTAIRE -->

        <div class="form-group full-width">
          <label for="proprietaire">
            Propriétaire *
          </label>

          <select
            id="proprietaire"
            v-model="form.proprietaireId"
          >
            <option
              value=""
              disabled
            >
              Sélectionner un propriétaire
            </option>

            <option
              v-for="proprietaire in proprietaires"
              :key="proprietaire.id"
              :value="proprietaire.id"
            >
              {{ proprietaire.nom }}
              {{ proprietaire.prenom }}

              <template
                v-if="proprietaire.telephone"
              >
                — {{ proprietaire.telephone }}
              </template>
            </option>
          </select>
        </div>

      </div>

      <!-- ================================================= -->
      <!-- DOCUMENTS -->
      <!-- ================================================= -->

      <div class="documents-section">

        <div class="section-title documents-title">
          <div>
            <h2>
              Documents du véhicule
            </h2>

            <p>
              Au moins un document est obligatoire lors
              de la création du véhicule.
            </p>
          </div>

          <button
            type="button"
            class="secondary-button"
            @click="addDocument"
          >
            + Ajouter un document
          </button>
        </div>

        <!-- DOCUMENTS -->

        <div
          v-if="form.documents.length === 0"
          class="empty-documents"
        >
          Aucun document ajouté.
        </div>

        <div
          v-for="(document, index) in form.documents"
          :key="document.localId"
          class="document-card"
        >

          <div class="document-header">
            <h3>
              Document {{ index + 1 }}
            </h3>

            <button
              type="button"
              class="remove-button"
              @click="removeDocument(index)"
            >
              Supprimer
            </button>
          </div>

          <div class="form-grid">

            <!-- TYPE DOCUMENT -->

            <div class="form-group">
              <label
                :for="`document-type-${index}`"
              >
                Type de document *
              </label>

              <input
                :id="`document-type-${index}`"
                v-model="document.typeDocument"
                type="text"
                maxlength="50"
                placeholder="Ex. ASSURANCE"
              />
            </div>

            <!-- NUMÉRO -->

            <div class="form-group">
              <label
                :for="`document-numero-${index}`"
              >
                Numéro du document
              </label>

              <input
                :id="`document-numero-${index}`"
                v-model="document.numeroDocument"
                type="text"
                maxlength="100"
                placeholder="Ex. ASS-2026-001"
              />
            </div>

            <!-- DATE DÉLIVRANCE -->

            <div class="form-group">
              <label
                :for="`document-delivrance-${index}`"
              >
                Date de délivrance
              </label>

              <input
                :id="`document-delivrance-${index}`"
                v-model="document.dateDelivrance"
                type="date"
              />
            </div>

            <!-- DATE EXPIRATION -->

            <div class="form-group">
              <label
                :for="`document-expiration-${index}`"
              >
                Date d'expiration *
              </label>

              <input
                :id="`document-expiration-${index}`"
                v-model="document.dateExpiration"
                type="date"
              />
            </div>

            <!-- STATUT -->

            <div class="form-group">
              <label
                :for="`document-statut-${index}`"
              >
                Statut *
              </label>

              <input
                :id="`document-statut-${index}`"
                v-model="document.statut"
                type="text"
                maxlength="20"
                placeholder="Ex. VALIDE"
              />
            </div>

            <!-- OBSERVATIONS -->

            <div class="form-group full-width">
              <label
                :for="`document-observations-${index}`"
              >
                Observations
              </label>

              <textarea
                :id="`document-observations-${index}`"
                v-model="document.observations"
                rows="3"
                placeholder="Observations éventuelles..."
              />
            </div>

          </div>
        </div>

      </div>

      <!-- ================================================= -->
      <!-- ACTIONS -->
      <!-- ================================================= -->

      <div class="form-actions">

        <button
          type="button"
          class="secondary-button"
          :disabled="saving"
          @click="cancel"
        >
          Annuler
        </button>

        <button
          type="submit"
          class="primary-button"
          :disabled="saving"
        >
          {{
            saving
              ? 'Enregistrement...'
              : isEditMode
                ? 'Enregistrer les modifications'
                : 'Créer le véhicule'
          }}
        </button>

      </div>

    </form>

  </section>
</template>

<style scoped>
.page {
  padding: 24px;
  max-width: 1000px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.loading {
  padding: 30px;
  text-align: center;
  color: #6b7280;
}

.form-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
}

.section-title {
  margin-bottom: 20px;
}

.section-title h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.section-title p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert.error {
  background: #fee2e2;
  color: #991b1b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(0, 1fr)
  );
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.documents-section {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid #e5e7eb;
}

.documents-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.document-card {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  background: #f9fafb;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.document-header h3 {
  margin: 0;
  font-size: 17px;
}

.empty-documents {
  padding: 24px;
  text-align: center;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.primary-button,
.secondary-button,
.remove-button {
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
}

.primary-button {
  border: none;
  background: #2563eb;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}

.secondary-button {
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  color: #374151;
}

.secondary-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.remove-button {
  border: 1px solid #fecaca;
  background: white;
  color: #b91c1c;
}

.remove-button:hover:not(:disabled) {
  background: #fef2f2;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .page {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .documents-title,
  .document-header {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
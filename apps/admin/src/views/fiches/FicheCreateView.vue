
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/auth.store';
import { getApiErrorMessage } from '../../api/api-error';
import { getGares } from '../../api/gares.api';
import { getVehicules } from '../../api/vehicules.api';
import { getChauffeurs } from '../../api/chauffeurs.api';
import { getDestinations } from '../../api/destinations.api';
import { getItineraires } from '../../api/itineraires.api';
import { createFiche } from '../../api/fiche.api';

import type { Gare } from '../../types/gare.types';
import type { Vehicule } from '../../types/vehicule.types';
import type { Chauffeur } from '../../types/chauffeur.types';
import type { Destination } from '../../types/destination.types';
import type { Itineraire } from '../../types/itineraire.types';
import type { CreateFichePayload } from '../../types/fiche.types';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const gares = ref<Gare[]>([]);
const vehicules = ref<Vehicule[]>([]);
const chauffeurs = ref<Chauffeur[]>([]);
const destinations = ref<Destination[]>([]);
const itineraires = ref<Itineraire[]>([]);

const form = reactive({
  reference: '',
  gareId: '',
  vehiculeId: '',
  chauffeurId: '',
  destinationId: '',
  itineraireId: '',
});

const isAdmin = computed(() => authStore.role === 'ADMIN');

const canCreate = computed(() =>
  ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT'].includes(
    authStore.role ?? '',
  ),
);

const availableGares = computed(() =>
  gares.value.filter((gare) => gare.statut === 'ACTIF'),
);

const availableVehicules = computed(() =>
  vehicules.value.filter((vehicule) => vehicule.statut === 'ACTIF'),
);

const availableChauffeurs = computed(() =>
  chauffeurs.value.filter((chauffeur) => chauffeur.statut === 'ACTIF'),
);

const availableDestinations = computed(() =>
  destinations.value.filter((destination) => destination.statut === 'ACTIF'),
);

const availableItineraires = computed(() =>
  itineraires.value.filter(
    (itineraire) =>
      itineraire.statut === 'ACTIF' &&
      itineraire.destinationId === form.destinationId,
  ),
);

async function loadData(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  try {
    const [
      garesData,
      vehiculesData,
      chauffeursData,
      destinationsData,
      itinerairesData,
    ] = await Promise.all([
      getGares(),
      getVehicules(),
      getChauffeurs(),
      getDestinations(),
      getItineraires(),
    ]);

    gares.value = garesData;
    vehicules.value = vehiculesData;
    chauffeurs.value = chauffeursData;
    destinations.value = destinationsData;
    itineraires.value = itinerairesData;

    if (!isAdmin.value) {
      const userGareId = authStore.gareId;

      if (!userGareId) {
        errorMessage.value =
          'Votre compte n’est associé à aucune gare. Contactez un administrateur.';
        return;
      }

      const gareAutorisee = availableGares.value.some(
        (gare) => gare.id === userGareId,
      );

      if (!gareAutorisee) {
        errorMessage.value =
          'Votre gare est inactive ou indisponible. Contactez un administrateur.';
        return;
      }

      form.gareId = userGareId;
    }
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function onDestinationChange(): void {
  form.itineraireId = '';
}
function onItineraireChange(): void {
  form.itineraireId = '';
}
async function submitForm(): Promise<void> {
  errorMessage.value = '';
  successMessage.value = '';

  if (!canCreate.value) {
    errorMessage.value =
      'Votre rôle ne permet pas de créer une fiche de chargement.';
    return;
  }

  if (
    !form.reference.trim() ||
    !form.gareId ||
    !form.vehiculeId ||
    !form.chauffeurId ||
    !form.destinationId
  ) {
    errorMessage.value =
      'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  if (!isAdmin.value && form.gareId !== authStore.gareId) {
    errorMessage.value =
      'Vous ne pouvez créer une fiche que pour votre propre gare.';
    return;
  }

  const payload: CreateFichePayload = {
    reference: form.reference.trim(),
    gareId: form.gareId,
    vehiculeId: form.vehiculeId,
    chauffeurId: form.chauffeurId,
    destinationId: form.destinationId,
    ...(form.itineraireId
      ? { itineraireId: form.itineraireId }
      : {}),
  };

  submitting.value = true;

  try {
    await createFiche(payload);
    successMessage.value = 'La fiche de chargement a été créée.';
    await router.push({ name: 'fiches' });
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    submitting.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <section class="fiche-create">
    <nav class="breadcrumb" aria-label="Fil d’Ariane">
      <span>Administration</span>
      <span class="breadcrumb-separator">/</span>
      <button type="button" @click="router.push({ name: 'fiches' })">
        Fiches de chargement
      </button>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Nouvelle fiche</span>
    </nav>

    <header class="page-header">
      <div class="header-content">
        <div class="title-icon">▤</div>
        <div>
          <p class="eyebrow">Gestion opérationnelle</p>
          <h1>Nouvelle fiche de chargement</h1>
          <p class="subtitle">
            Renseignez les informations nécessaires à la création d'une fiche.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="button button-secondary"
        @click="router.push({ name: 'fiches' })"
      >
        <span aria-hidden="true">←</span>
        Retour à la liste
      </button>
    </header>

    <div v-if="loading" class="state-card" role="status">
      <span class="spinner"></span>
      <p>Chargement des données nécessaires...</p>
    </div>

    <div v-else-if="errorMessage && !gares.length" class="alert alert-error" role="alert">
      <span class="alert-icon">!</span>
      <div class="alert-content">
        <strong>Impossible de charger les données</strong>
        <p>{{ errorMessage }}</p>
        <button type="button" class="button button-secondary" @click="loadData">
          Réessayer
        </button>
      </div>
    </div>

    <template v-else>
      <div v-if="errorMessage" class="alert alert-error" role="alert">
        <span class="alert-icon">!</span>
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="alert alert-success" role="status">
        <span class="alert-icon">✓</span>
        <p>{{ successMessage }}</p>
      </div>

      <form class="fiche-form" @submit.prevent="submitForm">
        <div class="form-card">
          <div class="section-heading">
            <div class="section-icon">01</div>
            <div>
              <h2>Informations générales</h2>
              <p>Identification de la fiche de chargement.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="reference">Référence <span>*</span></label>
              <input
                id="reference"
                v-model.trim="form.reference"
                type="text"
                maxlength="50"
                required
                placeholder="Ex. FCH-2026-001"
              />
              <small>Référence unique de la fiche.</small>
            </div>

            <div class="form-group">
              <label for="gare">Gare <span>*</span></label>
              <select
                id="gare"
                v-model="form.gareId"
                required
                :disabled="!isAdmin"
              >
                <option value="" disabled>Sélectionner une gare</option>
                <option
                  v-for="gare in availableGares"
                  :key="gare.id"
                  :value="gare.id"
                >
                  {{ gare.nom }} — {{ gare.ville }}
                </option>
              </select>
              <small v-if="!isAdmin">
                La gare est déterminée par votre compte.
              </small>
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="section-heading">
            <div class="section-icon">02</div>
            <div>
              <h2>Ressources de transport</h2>
              <p>Sélection du véhicule et du chauffeur.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="vehicule">Véhicule <span>*</span></label>
              <select
                id="vehicule"
                v-model="form.vehiculeId"
                required
              >
                <option value="" disabled>Sélectionner un véhicule</option>
                <option
                  v-for="vehicule in availableVehicules"
                  :key="vehicule.id"
                  :value="vehicule.id"
                >
                  {{ vehicule.plaqueImmatriculation }}
                  — {{ vehicule.marque }} {{ vehicule.modele }}
                </option>
              </select>
              <small v-if="availableVehicules.length === 0">
                Aucun véhicule actif disponible.
              </small>
            </div>

            <div class="form-group">
              <label for="chauffeur">Chauffeur <span>*</span></label>
              <select
                id="chauffeur"
                v-model="form.chauffeurId"
                required
              >
                <option value="" disabled>Sélectionner un chauffeur</option>
                <option
                  v-for="chauffeur in availableChauffeurs"
                  :key="chauffeur.id"
                  :value="chauffeur.id"
                >
                  {{ chauffeur.nom }} {{ chauffeur.prenom }}
                </option>
              </select>
              <small v-if="availableChauffeurs.length === 0">
                Aucun chauffeur actif disponible.
              </small>
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="section-heading">
            <div class="section-icon">03</div>
            <div>
              <h2>Destination et itinéraire</h2>
              <p>Définissez la destination du transport et son parcours.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="destination">Destination <span>*</span></label>
              <select
                id="destination"
                v-model="form.destinationId"
                required
                @change="onDestinationChange"
              >
                <option value="" disabled>Sélectionner une destination</option>
                <option
                  v-for="destination in availableDestinations"
                  :key="destination.id"
                  :value="destination.id"
                >
                  {{ destination.nom }} — {{ destination.ville }}
                </option>
              </select>
              <small v-if="availableDestinations.length === 0">
                Aucune destination active disponible.
              </small>
            </div>

            <div class="form-group">
              <label for="itineraire">Itinéraire</label>
              <select
                id="itineraire"
                v-model="form.itineraireId"
                required
                @change="onItineraireChange"
              >
                <option value="" disabled>Sélectionner un itinéraire</option>
                <option
                  v-for="itineraire in availableItineraires"
                  :key="itineraire.id"
                  :value="itineraire.id"
                >
                  {{ itineraire.code }} — {{ itineraire.libelle }}
                </option>
              </select>
              <small>
                Facultatif. Les itinéraires proposés dépendent de la destination.
              </small>
              <small v-if="form.destinationId && availableItineraires.length === 0">
                Aucun itinéraire actif pour cette destination.
              </small>
            </div>
          </div>
        </div>

        <footer class="form-actions">
          <p class="required-note"><span>*</span> Champs obligatoires</p>

          <div class="action-buttons">
            <button
              type="button"
              class="button button-secondary"
              :disabled="submitting"
              @click="router.push({ name: 'fiches' })"
            >
              Annuler
            </button>

            <button
              type="submit"
              class="button button-primary"
              :disabled="submitting || !canCreate"
            >
              {{ submitting ? 'Création en cours...' : 'Créer la fiche' }}
            </button>
          </div>
        </footer>
      </form>
    </template>
  </section>
</template>

<style scoped>
.fiche-create {
  max-width: 1500px;
  margin: 0 auto;
  padding: 28px 32px;
  color: #263445;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #7b8795;
  font-size: 13px;
}

.breadcrumb button {
  padding: 0;
  border: 0;
  background: none;
  color: #17365d;
  cursor: pointer;
  font: inherit;
}

.breadcrumb-current {
  color: #17365d;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #c5a13b;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 17px;
}

.title-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 13px;
  background: #edf2f8;
  color: #17365d;
  font-size: 27px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #a17d22;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 700;
}

.subtitle {
  margin: 7px 0 0;
  color: #778394;
  font-size: 14px;
}

.form-card {
  margin-bottom: 20px;
  padding: 25px;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(16 37 63 / 4%);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 24px;
  padding-bottom: 17px;
  border-bottom: 1px solid #edf0f4;
}

.section-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f5f0e3;
  color: #9a7620;
  font-size: 13px;
  font-weight: 800;
}

.section-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 16px;
}

.section-heading p {
  margin: 5px 0 0;
  color: #8490a0;
  font-size: 13px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #344256;
  font-size: 13px;
  font-weight: 650;
}

.form-group label span,
.required-note span {
  color: #c0392b;
}

input,
select {
  width: 100%;
  min-height: 44px;
  padding: 10px 13px;
  border: 1px solid #d8dee7;
  border-radius: 7px;
  outline: none;
  background: #fff;
  color: #263445;
  font: inherit;
  font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
select:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 10%);
}

input:disabled,
select:disabled {
  background: #f3f5f8;
  color: #8490a0;
  cursor: not-allowed;
}

.form-group small {
  color: #8792a1;
  font-size: 11px;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 24px;
  padding: 20px 0 0;
  border-top: 1px solid #e5eaf0;
}

.required-note {
  margin: 0;
  color: #8490a0;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 17px;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.button-primary {
  border-color: #17365d;
  background: #17365d;
  color: #fff;
}

.button-primary:hover:not(:disabled) {
  border-color: #102744;
  background: #102744;
}

.button-secondary {
  border-color: #d9e0e8;
  background: #fff;
  color: #425269;
}

.button-secondary:hover:not(:disabled) {
  border-color: #c5a13b;
  background: #faf8f2;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px 17px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 13px;
}

.alert p {
  margin: 0;
  line-height: 1.5;
}

.alert-error {
  border-color: #f0caca;
  background: #fff7f7;
  color: #923737;
}

.alert-success {
  border-color: #c8e5d1;
  background: #f4fbf6;
  color: #286a3b;
}

.alert-icon {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 5%);
  font-weight: 800;
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.alert-content strong {
  font-size: 14px;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  min-height: 180px;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  background: #fff;
  color: #778394;
  font-size: 14px;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e5eaf0;
  border-top-color: #17365d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 700px) {
  .fiche-create {
    padding: 18px 15px;
  }

  .page-header {
    align-items: flex-start;
  }

  h1 {
    font-size: 22px;
  }

  .form-card {
    padding: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .action-buttons {
    width: 100%;
  }

  .action-buttons .button {
    flex: 1;
  }
}
</style>

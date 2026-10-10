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

  if (
    !isAdmin.value &&
    form.gareId !== authStore.gareId
  ) {
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
    <header class="page-header">
      <div>
        <h1>Nouvelle fiche de chargement</h1>
        <p>Renseignez les informations nécessaires à la création.</p>
      </div>

      <button
        type="button"
        class="button button-secondary"
        @click="router.push({ name: 'fiches' })"
      >
        Retour à la liste
      </button>
    </header>

    <div v-if="loading" class="message">
      Chargement des données...
    </div>

    <div v-else-if="errorMessage && !gares.length" class="message error">
      {{ errorMessage }}
      <button type="button" class="button" @click="loadData">
        Réessayer
      </button>
    </div>

    <template v-else>
      <div v-if="errorMessage" class="message error" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="message success" role="status">
        {{ successMessage }}
      </div>

      <form class="fiche-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="reference">Référence *</label>
          <input
            id="reference"
            v-model.trim="form.reference"
            type="text"
            maxlength="50"
            required
            placeholder="Ex. FCH-2026-001"
          />
        </div>

        <div class="form-group">
          <label for="gare">Gare *</label>
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

        <div class="form-group">
          <label for="vehicule">Véhicule *</label>
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
          <label for="chauffeur">Chauffeur *</label>
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

        <div class="form-group">
          <label for="destination">Destination *</label>
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
        </div>

        <div class="form-group">
          <label for="itineraire">Itinéraire (facultatif)</label>
          <select
            id="itineraire"
            v-model="form.itineraireId"
            :disabled="!form.destinationId || availableItineraires.length === 0"
          >
            <option value="">Aucun itinéraire sélectionné</option>
            <option
              v-for="itineraire in availableItineraires"
              :key="itineraire.id"
              :value="itineraire.id"
            >
              {{ itineraire.code }} — {{ itineraire.libelle }}
            </option>
          </select>
          <small v-if="form.destinationId && availableItineraires.length === 0">
            Aucun itinéraire actif pour cette destination.
          </small>
        </div>

        <footer class="form-actions">
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
        </footer>
      </form>
    </template>
  </section>
</template>

<style scoped>
.fiche-create {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 1.7rem;
}

.page-header p,
small {
  color: #64748b;
}

.fiche-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
}

input,
select {
  width: 100%;
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  font: inherit;
}

input:focus,
select:focus {
  outline: 2px solid #93c5fd;
  border-color: #2563eb;
}

select:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.button {
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-primary {
  color: white;
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.button-secondary {
  background: white;
  color: #334155;
}

.message {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 8px;
}

.error {
  color: #991b1b;
  background: #fee2e2;
}

.success {
  color: #166534;
  background: #dcfce7;
}

@media (max-width: 700px) {
  .fiche-create {
    padding: 16px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .fiche-form {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>

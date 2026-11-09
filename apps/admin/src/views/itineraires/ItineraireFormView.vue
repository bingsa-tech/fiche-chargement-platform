
<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useItineraireStore } from '../../stores/itineraire.store';
import { getItineraire } from '../../api/itineraires.api';
import { getDestinations } from '../../api/destinations.api';

import type { ItineraireStatut } from '../../types/itineraire.types';

interface DestinationOption {
  id: string;
  code: string;
  nom: string;
  ville: string;
  statut: string;
}

const router = useRouter();
const route = useRoute();
const store = useItineraireStore();

const destinations = ref<DestinationOption[]>([]);
const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref('');

const isEditMode = computed(() => Boolean(route.params.id));

const form = reactive({
  destinationId: '',
  code: '',
  libelle: '',
  description: '',
  statut: 'ACTIF' as ItineraireStatut,
});

onMounted(async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const dests = await getDestinations();
    destinations.value = dests;

    if (isEditMode.value) {
      const data = await getItineraire(String(route.params.id));

      form.destinationId = data.destinationId;
      form.code = data.code;
      form.libelle = data.libelle;
      form.description = data.description || '';
      form.statut = data.statut;
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement du formulaire itinéraire', err);

    errorMessage.value =
      err?.response?.data?.message ||
      'Impossible de charger les données nécessaires au formulaire.';
  } finally {
    loading.value = false;
  }
});

async function handleSubmit() {
  if (submitting.value) return;

  submitting.value = true;
  errorMessage.value = '';

  try {
    if (isEditMode.value) {
      await store.editItineraire(String(route.params.id), form);
    } else {
      await store.addItineraire(form);
    }

    await router.push({ name: 'itineraires' });
  } catch (err: any) {
    console.error('Erreur lors de l’enregistrement de l’itinéraire', err);

    const message = err?.response?.data?.message;

    errorMessage.value = Array.isArray(message)
      ? message.join(' ')
      : message || 'Une erreur est survenue lors de l’enregistrement.';
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push({ name: 'itineraires' });
}
</script>

<template>
  <main class="page">
    <!-- Fil d'Ariane -->
    <nav class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <button type="button" @click="goBack">Itinéraires</button>
      <span class="separator">/</span>
      <span class="current">
        {{ isEditMode ? 'Modification' : 'Nouvel itinéraire' }}
      </span>
    </nav>

    <!-- En-tête -->
    <header class="page-header">
      <div>
        <p class="eyebrow">RÉFÉRENTIEL</p>

        <h1>
          {{ isEditMode ? 'Modifier un itinéraire' : 'Nouvel itinéraire' }}
        </h1>

        <p class="subtitle">
          {{
            isEditMode
              ? 'Modifiez les informations et les paramètres de cet itinéraire.'
              : 'Enregistrez un nouvel itinéraire et associez-le à une destination.'
          }}
        </p>
      </div>

      <button type="button" class="back-button" @click="goBack">
        <span>←</span>
        Retour
      </button>
    </header>

    <!-- Chargement -->
    <section v-if="loading" class="loading-card">
      <span class="spinner"></span>
      <p>Chargement des informations…</p>
    </section>

    <template v-else>
      <!-- Erreur -->
      <div v-if="errorMessage" class="error-message" role="alert">
        <span class="error-icon">!</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Formulaire -->
      <section class="form-card">
        <div class="card-header">
          <div class="card-icon">
            <span>{{ isEditMode ? '✎' : '+' }}</span>
          </div>

          <div>
            <h2>Informations de l'itinéraire</h2>
            <p>
              Complétez les champs obligatoires pour enregistrer l'itinéraire.
            </p>
          </div>
        </div>

        <div class="card-divider"></div>

        <form @submit.prevent="handleSubmit" class="form-content">
          <!-- Destination -->
          <div class="form-section">
            <div class="section-heading">
              <h3>Destination associée</h3>
              <p>Sélectionnez la destination concernée par cet itinéraire.</p>
            </div>

            <div class="form-group">
              <label for="destination">Destination <span>*</span></label>

              <select
                id="destination"
                v-model="form.destinationId"
                required
                class="form-control"
              >
                <option value="" disabled>
                  Sélectionner une destination
                </option>

                <option
                  v-for="dest in destinations"
                  :key="dest.id"
                  :value="dest.id"
                  :disabled="dest.statut === 'INACTIF' && dest.id !== form.destinationId"
                >
                  {{ dest.code }} — {{ dest.nom }} ({{ dest.ville }})
                  {{ dest.statut === 'INACTIF' ? ' - INACTIVE' : '' }}
                </option>
              </select>

              <small class="field-hint">
                Seules les destinations actives devraient être utilisées pour
                les nouveaux itinéraires.
              </small>
            </div>
          </div>

          <div class="card-divider"></div>

          <!-- Informations générales -->
          <div class="form-section">
            <div class="section-heading">
              <h3>Informations générales</h3>
              <p>Définissez l'identification et le libellé de l'itinéraire.</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="code">Code <span>*</span></label>

                <input
                  id="code"
                  v-model.trim="form.code"
                  type="text"
                  maxlength="30"
                  required
                  class="form-control"
                  placeholder="Ex. : ITIN-01"
                />
              </div>

              <div class="form-group">
                <label for="libelle">Libellé <span>*</span></label>

                <input
                  id="libelle"
                  v-model.trim="form.libelle"
                  type="text"
                  maxlength="150"
                  required
                  class="form-control"
                  placeholder="Ex. : Yaoundé - Douala"
                />
              </div>
            </div>

            <div class="form-group description-group">
              <label for="description">Description</label>

              <textarea
                id="description"
                v-model.trim="form.description"
                rows="4"
                class="form-control"
                placeholder="Informations complémentaires sur cet itinéraire..."
              ></textarea>
            </div>
          </div>

          <div class="card-divider"></div>

          <!-- Statut -->
          <div class="form-section">
            <div class="section-heading">
              <h3>État de l'itinéraire</h3>
              <p>Définissez le statut opérationnel de cet itinéraire.</p>
            </div>

            <div class="form-group status-group">
              <label for="statut">Statut <span>*</span></label>

              <select
                id="statut"
                v-model="form.statut"
                required
                class="form-control status-select"
              >
                <option value="ACTIF">ACTIF</option>
                <option value="INACTIF">INACTIF</option>
              </select>

              <small class="field-hint">
                Un itinéraire inactif ne devrait pas être proposé pour de
                nouvelles opérations.
              </small>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              :disabled="submitting"
              @click="goBack"
            >
              Annuler
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="submitting || destinations.length === 0"
            >
              <span v-if="submitting" class="button-spinner"></span>

              {{
                submitting
                  ? 'Enregistrement…'
                  : isEditMode
                    ? 'Enregistrer les modifications'
                    : 'Créer l’itinéraire'
              }}
            </button>
          </div>
        </form>
      </section>
    </template>
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
  padding: 0;
  border: none;
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
  background: white;
  color: #17365d;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
}

.back-button:hover {
  background: #f4f6f9;
  border-color: #17365d;
}

/* Carte formulaire */
.form-card {
  overflow: hidden;
  padding: 26px 28px;
  border: 1px solid #e4e8ef;
  border-radius: 14px;
  background: white;
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
  margin: 24px 0;
  background: #edf0f4;
}

.form-content {
  display: flex;
  flex-direction: column;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-heading h3 {
  margin: 0;
  color: #17365d;
  font-size: 1rem;
  font-weight: 750;
}

.section-heading p {
  margin: 5px 0 0;
  color: #8490a2;
  font-size: 0.82rem;
}

/* Champs */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-group label {
  color: #52647c;
  font-size: 0.83rem;
  font-weight: 700;
}

.form-group label span {
  color: #b42318;
}

.form-control {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #26364a;
  font-family: inherit;
  font-size: 0.88rem;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: #17365d;
  box-shadow: 0 0 0 3px rgb(23 54 93 / 9%);
}

.form-control::placeholder {
  color: #a0a8b5;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.description-group {
  margin-top: 20px;
}

.field-hint {
  color: #8490a2;
  font-size: 0.75rem;
  line-height: 1.5;
}

.status-group {
  max-width: 420px;
}

.status-select {
  font-weight: 700;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #edf0f4;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
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
  border-color: #dce2ea;
  background: white;
  color: #52647c;
}

.btn-secondary:hover:not(:disabled) {
  background: #f4f6f9;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Erreur */
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
  color: white;
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
  background: white;
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

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>

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
const error = ref<string | null>(null);

const isEditMode = computed(() => {
  return Boolean(route.params.id);
});

const chauffeurId = computed(() => {
  return route.params.id as string | undefined;
});

/**
 * Formulaire principal.
 *
 * En création :
 * - informations du chauffeur
 * - document initial obligatoire
 *
 * En modification :
 * - seules les informations du chauffeur
 *   sont envoyées au PATCH.
 */
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

/**
 * Réinitialise complètement le formulaire.
 */
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

/**
 * Charge un chauffeur existant en mode modification.
 */
async function loadChauffeur(): Promise<void> {
  if (!chauffeurId.value) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const chauffeur = await getChauffeur(
      chauffeurId.value,
    );

    form.nom = chauffeur.nom;
    form.prenom = chauffeur.prenom;
    form.telephone = chauffeur.telephone ?? '';
    form.statut = chauffeur.statut;
  } catch (err) {
    console.error(err);

    error.value =
      'Impossible de charger les informations du chauffeur.';
  } finally {
    loading.value = false;
  }
}

/**
 * Soumission du formulaire.
 *
 * Création :
 * POST /chauffeurs
 *
 * Le backend crée dans une transaction :
 * - le chauffeur
 * - son document initial
 *
 * Modification :
 * PATCH /chauffeurs/:id
 *
 * Le document n'est pas modifié par cet endpoint.
 */
async function submit(): Promise<void> {
  error.value = null;
  saving.value = true;

  try {
    if (isEditMode.value && chauffeurId.value) {
      const payload: UpdateChauffeurPayload = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || undefined,
        statut: form.statut,
      };

      await updateChauffeur(
        chauffeurId.value,
        payload,
      );
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
          dateExpiration:
            form.document.dateExpiration,
          statut: form.document.statut,
          observations:
            form.document.observations || undefined,
        },
      };

      await createChauffeur(payload);
    }

    await router.push({
      name: 'chauffeurs',
    });
  } catch (err) {
    console.error(err);

    error.value = isEditMode.value
      ? 'Impossible de modifier le chauffeur.'
      : 'Impossible de créer le chauffeur.';
  } finally {
    saving.value = false;
  }
}

/**
 * Annule l'opération et retourne à la liste.
 */
function cancel(): void {
  router.push({
    name: 'chauffeurs',
  });
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
  <div class="chauffeur-form">
    <div class="page-header">
      <div>
        <h1>
          {{
            isEditMode
              ? 'Modifier le chauffeur'
              : 'Nouveau chauffeur'
          }}
        </h1>

        <p>
          {{
            isEditMode
              ? 'Modifier les informations du chauffeur.'
              : 'Créer un chauffeur avec son document initial.'
          }}
        </p>
      </div>
    </div>

    <!-- Chargement du chauffeur en mode modification -->
    <div
      v-if="loading"
      class="loading"
    >
      Chargement...
    </div>

    <div
      v-else
      class="form-container"
    >
      <!-- Message d'erreur -->
      <div
        v-if="error"
        class="alert-error"
      >
        {{ error }}
      </div>

      <!--
        IMPORTANT :
        submit() est explicitement appelé ici.
      -->
      <form @submit.prevent="submit">
        <!-- ========================================= -->
        <!-- INFORMATIONS CHAUFFEUR                    -->
        <!-- ========================================= -->

        <section>
          <h2>Informations du chauffeur</h2>

          <div class="form-grid">
            <!-- Nom -->
            <div class="form-group">
              <label for="nom">
                Nom *
              </label>

              <input
                id="nom"
                v-model.trim="form.nom"
                type="text"
                maxlength="100"
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
                v-model.trim="form.prenom"
                type="text"
                maxlength="100"
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
                v-model.trim="form.telephone"
                type="tel"
                maxlength="30"
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
                <option value="ACTIF">
                  ACTIF
                </option>

                <option value="INACTIF">
                  INACTIF
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- ========================================= -->
        <!-- DOCUMENT INITIAL                           -->
        <!-- ========================================= -->

        <!--
          Le document initial est obligatoire uniquement
          lors de la création du chauffeur.
        -->
        <section v-if="!isEditMode">
          <h2>Document initial</h2>

          <p class="section-description">
            Un document est obligatoire lors de la création
            d'un nouveau chauffeur.
          </p>

          <div class="form-grid">
            <!-- Type document -->
            <div class="form-group">
              <label for="typeDocument">
                Type de document *
              </label>

              <input
                id="typeDocument"
                v-model.trim="form.document.typeDocument"
                type="text"
                maxlength="50"
                required
              />
            </div>

            <!-- Numéro document -->
            <div class="form-group">
              <label for="numeroDocument">
                Numéro du document
              </label>

              <input
                id="numeroDocument"
                v-model.trim="form.document.numeroDocument"
                type="text"
                maxlength="100"
              />
            </div>

            <!-- Date délivrance -->
            <div class="form-group">
              <label for="dateDelivrance">
                Date de délivrance
              </label>

              <input
                id="dateDelivrance"
                v-model="form.document.dateDelivrance"
                type="date"
              />
            </div>

            <!-- Date expiration -->
            <div class="form-group">
              <label for="dateExpiration">
                Date d'expiration *
              </label>

              <input
                id="dateExpiration"
                v-model="form.document.dateExpiration"
                type="date"
                required
              />
            </div>

            <!-- Statut document -->
            <div class="form-group">
              <label for="documentStatut">
                Statut du document *
              </label>

              <input
                id="documentStatut"
                v-model.trim="form.document.statut"
                type="text"
                maxlength="20"
                required
              />
            </div>

            <!-- Observations -->
            <div class="form-group form-group-full">
              <label for="observations">
                Observations
              </label>

              <textarea
                id="observations"
                v-model.trim="form.document.observations"
                rows="4"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- ========================================= -->
        <!-- INFORMATION MODE MODIFICATION              -->
        <!-- ========================================= -->

        <div
          v-if="isEditMode"
          class="info-message"
        >
          Les documents du chauffeur sont gérés séparément.
          La modification du chauffeur ne modifie pas ses documents.
        </div>

        <!-- ========================================= -->
        <!-- ACTIONS                                    -->
        <!-- ========================================= -->

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
            {{
              saving
                ? 'Enregistrement...'
                : 'Enregistrer'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chauffeur-form {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
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
  color: #666;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

section {
  margin-bottom: 32px;
}

section h2 {
  margin: 0 0 18px;
  font-size: 20px;
}

.section-description {
  margin: -8px 0 20px;
  color: #666;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group-full {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  font-size: 14px;
}

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font: inherit;
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

.alert-error {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
}

.info-message {
  margin-bottom: 24px;
  padding: 12px 16px;
  border-radius: 6px;
  background: #eff6ff;
  color: #1e40af;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group-full {
    grid-column: auto;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
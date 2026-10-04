<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1>
          {{ isEditMode
            ? 'Modifier un utilisateur'
            : 'Nouvel utilisateur' }}
        </h1>

        <p>
          {{
            isEditMode
              ? 'Modifier les informations du compte utilisateur.'
              : 'Créer un nouveau compte utilisateur.'
          }}
        </p>
      </div>

      <button
        type="button"
        class="btn-secondary"
        :disabled="submitting"
        @click="goBack"
      >
        Retour
      </button>
    </div>

    <!-- LOADING -->
    <div
      v-if="loadingData"
      class="loading-state"
    >
      Chargement...
    </div>

    <template v-else>
      <!-- ERROR -->
      <div
        v-if="errorMessage"
        class="alert alert-error"
      >
        {{ errorMessage }}
      </div>

      <!-- SUCCESS -->
      <div
        v-if="successMessage"
        class="alert alert-success"
      >
        {{ successMessage }}
      </div>

      <form
        class="form-card"
        @submit.prevent="handleSubmit"
      >
        <!-- =====================================================
             IDENTITÉ
        ====================================================== -->

        <section class="form-section">
          <h2>Identité</h2>

          <div class="form-grid">
            <div class="form-group">
              <label for="nom">
                Nom *
              </label>

              <input
                id="nom"
                v-model.trim="form.nom"
                type="text"
                required
                maxlength="100"
                autocomplete="family-name"
              />
            </div>

            <div class="form-group">
              <label for="prenom">
                Prénom *
              </label>

              <input
                id="prenom"
                v-model.trim="form.prenom"
                type="text"
                required
                maxlength="100"
                autocomplete="given-name"
              />
            </div>

            <div class="form-group">
              <label for="telephone">
                Téléphone
              </label>

              <input
                id="telephone"
                v-model.trim="form.telephone"
                type="tel"
                maxlength="20"
                autocomplete="tel"
              />
            </div>
          </div>
        </section>

        <!-- =====================================================
             COMPTE
        ====================================================== -->

        <section class="form-section">
          <h2>Compte</h2>

          <div class="form-grid">
            <div class="form-group">
              <label for="username">
                Nom d'utilisateur *
              </label>

              <input
                id="username"
                v-model.trim="form.username"
                type="text"
                required
                maxlength="50"
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label for="email">
                Email *
              </label>

              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                required
                maxlength="100"
                autocomplete="email"
              />
            </div>

            <!-- PASSWORD UNIQUEMENT À LA CRÉATION -->
            <div
              v-if="!isEditMode"
              class="form-group"
            >
              <label for="password">
                Mot de passe *
              </label>

              <div class="password-wrapper">
                <input
                  id="password"
                  v-model="form.password"
                  :type="
                    showPassword
                      ? 'text'
                      : 'password'
                  "
                  required
                  minlength="6"
                  maxlength="100"
                  autocomplete="new-password"
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{
                    showPassword
                      ? 'Masquer'
                      : 'Afficher'
                  }}
                </button>
              </div>
            </div>

            <div
              v-if="!isEditMode"
              class="form-group"
            >
              <label for="passwordConfirmation">
                Confirmation *
              </label>

              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                :type="
                  showPassword
                    ? 'text'
                    : 'password'
                "
                required
                minlength="6"
                maxlength="100"
                autocomplete="new-password"
              />

              <small
                v-if="passwordMismatch"
                class="field-error"
              >
                Les mots de passe ne correspondent pas.
              </small>
            </div>
          </div>
        </section>

        <!-- =====================================================
             AFFECTATION
        ====================================================== -->

        <section class="form-section">
          <h2>Affectation</h2>

          <div class="form-grid">
            <div class="form-group">
              <label for="role">
                Rôle *
              </label>

              <select
                id="role"
                v-model="form.roleId"
                required
              >
                <option :value="null">
                  Sélectionner un rôle
                </option>

                <option
                  v-for="role in availableRoles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.libelle }} ({{ role.code }})
                </option>
              </select>

              <small v-if="isResponsableGare">
                Vous pouvez uniquement créer un
                AGENT ou un CONTROLEUR.
              </small>
            </div>

            <div class="form-group">
              <label for="gare">
                Gare
              </label>

              <select
                id="gare"
                v-model="form.gareId"
                :disabled="isResponsableGare"
              >
                <option :value="null">
                  Aucune gare
                </option>

                <option
                  v-for="gare in gares"
                  :key="gare.id"
                  :value="gare.id"
                >
                  {{ gare.code }} — {{ gare.nom }}
                </option>
              </select>

              <small v-if="isResponsableGare">
                La gare est automatiquement définie
                sur votre gare d'affectation.
              </small>
            </div>
          </div>
        </section>

        <!-- =====================================================
             STATUT
        ====================================================== -->

        <section class="form-section">
          <h2>Statut</h2>

          <label class="checkbox-row">
            <input
              v-model="form.actif"
              type="checkbox"
            />

            <span>
              Compte actif
            </span>
          </label>
        </section>

        <!-- =====================================================
             ACTIONS
        ====================================================== -->

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
            :disabled="
              submitting ||
              passwordMismatch
            "
          >
            <span v-if="submitting">
              {{
                isEditMode
                  ? 'Enregistrement...'
                  : 'Création...'
              }}
            </span>

            <span v-else>
              {{
                isEditMode
                  ? 'Enregistrer'
                  : 'Créer le compte'
              }}
            </span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

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

import { useAuthStore } from '../../auth/auth.store';

import {
  getRoles,
} from '../../api/roles.api';

import {
  createUtilisateur,
  getUtilisateur,
  updateUtilisateur,
} from '../../api/utilisateurs.api';

import {
  getGares,
} from '../../api/gares.api';

import type { Role } from '../../types/role.types';

import type { Gare } from '../../types/gare.types';

import type {
  CreateUtilisateurPayload,
  UpdateUtilisateurPayload,
} from '../../types/utilisateur.types';

/* =====================================================
 * ROUTER
 * ===================================================== */

const router = useRouter();
const route = useRoute();

/* =====================================================
 * AUTH
 * ===================================================== */

const authStore = useAuthStore();

/* =====================================================
 * STATE
 * ===================================================== */

const roles = ref<Role[]>([]);

const gares = ref<Gare[]>([]);

const loadingData = ref(true);

const submitting = ref(false);

const errorMessage = ref('');

const successMessage = ref('');

const showPassword = ref(false);

/* =====================================================
 * FORM
 * ===================================================== */

const form = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  nom: '',
  prenom: '',
  telephone: '',
  roleId: null as number | null,
  gareId: null as string | null,
  actif: true,
});

/* =====================================================
 * MODE
 * ===================================================== */

const utilisateurId = computed(() => {
  const value = route.params.id;

  if (!value) {
    return null;
  }

  const id = Number(value);

  return Number.isInteger(id)
    ? id
    : null;
});

const isEditMode = computed(() => {
  return utilisateurId.value !== null;
});

/* =====================================================
 * CURRENT ROLE
 * ===================================================== */

const currentRole = computed(() => {
  return authStore.role;
});

const isAdmin = computed(() => {
  return currentRole.value === 'ADMIN';
});

const isResponsableGare = computed(() => {
  return currentRole.value === 'RESPONSABLE_GARE';
});

/* =====================================================
 * PASSWORD
 * ===================================================== */

const passwordMismatch = computed(() => {
  return (
    !isEditMode.value &&
    form.password.length > 0 &&
    form.passwordConfirmation.length > 0 &&
    form.password !==
      form.passwordConfirmation
  );
});

/* =====================================================
 * AVAILABLE ROLES
 * ===================================================== */

const availableRoles = computed(() => {
  const activeRoles =
    roles.value.filter(
      (role) => role.actif,
    );

  if (isAdmin.value) {
    return activeRoles;
  }

  if (isResponsableGare.value) {
    return activeRoles.filter(
      (role) =>
        role.code === 'AGENT' ||
        role.code === 'CONTROLEUR',
    );
  }

  return [];
});

/* =====================================================
 * LOAD ROLES + GARES
 * ===================================================== */

async function loadReferenceData() {
  const [
    rolesResponse,
    garesResponse,
  ] = await Promise.all([
    getRoles(),
    getGares(),
  ]);

  roles.value = rolesResponse;
  gares.value = garesResponse;
}

/* =====================================================
 * LOAD USER FOR EDIT
 * ===================================================== */

async function loadUtilisateur() {
  if (!utilisateurId.value) {
    return;
  }

  const utilisateur =
    await getUtilisateur(
      utilisateurId.value,
    );

  form.username =
    utilisateur.username;

  form.email =
    utilisateur.email;

  form.nom =
    utilisateur.nom;

  form.prenom =
    utilisateur.prenom;

  form.telephone =
    utilisateur.telephone ?? '';

  form.actif =
    utilisateur.actif;

  form.gareId =
    utilisateur.gareId;

  form.roleId =
    utilisateur.roleId ??
    utilisateur.role?.id ??
    null;
}

/* =====================================================
 * INITIALISATION
 * ===================================================== */

async function loadData() {
  loadingData.value = true;
  errorMessage.value = '';

  try {
    await loadReferenceData();

    if (isEditMode.value) {
      await loadUtilisateur();
    } else {
      if (
        isResponsableGare.value &&
        authStore.gareId
      ) {
        form.gareId =
          authStore.gareId;
      }

      if (
        availableRoles.value.length === 1
      ) {
        form.roleId =
          availableRoles.value[0].id;
      }
    }
  } catch (error: unknown) {
    console.error(
      'Erreur chargement formulaire utilisateur:',
      error,
    );

    errorMessage.value =
      extractApiError(
        error,
        'Impossible de charger les données du formulaire.',
      );
  } finally {
    loadingData.value = false;
  }
}

/* =====================================================
 * SUBMIT
 * ===================================================== */

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  /* ---------------------------------------------------
   * VALIDATION PASSWORD CREATION
   * --------------------------------------------------- */

  if (!isEditMode.value) {
    if (
      form.password !==
      form.passwordConfirmation
    ) {
      errorMessage.value =
        'Les mots de passe ne correspondent pas.';

      return;
    }

    if (form.password.length < 6) {
      errorMessage.value =
        'Le mot de passe doit contenir au moins 6 caractères.';

      return;
    }
  }

  /* ---------------------------------------------------
   * VALIDATION ROLE
   * --------------------------------------------------- */

  if (!form.roleId) {
    errorMessage.value =
      'Veuillez sélectionner un rôle.';

    return;
  }

  const selectedRole =
    availableRoles.value.find(
      (role) =>
        role.id === form.roleId,
    );

  if (!selectedRole) {
    errorMessage.value =
      'Le rôle sélectionné n’est pas autorisé.';

    return;
  }

  /* ---------------------------------------------------
   * VALIDATION RESPONSABLE GARE
   * --------------------------------------------------- */

  if (isResponsableGare.value) {
    if (
      selectedRole.code !== 'AGENT' &&
      selectedRole.code !== 'CONTROLEUR'
    ) {
      errorMessage.value =
        'Un responsable de gare peut uniquement créer un AGENT ou un CONTROLEUR.';

      return;
    }

    if (
      !authStore.gareId ||
      form.gareId !== authStore.gareId
    ) {
      errorMessage.value =
        'Le nouvel utilisateur doit appartenir à votre gare.';

      return;
    }
  }

  submitting.value = true;

  try {
    /* =================================================
     * CREATION
     * ================================================= */

    if (!isEditMode.value) {
      const payload: CreateUtilisateurPayload = {
        username: form.username,
        email: form.email,
        password: form.password,
        nom: form.nom,
        prenom: form.prenom,
        actif: form.actif,
        roleId: form.roleId,
      };

      if (form.telephone) {
        payload.telephone =
          form.telephone;
      }

      if (form.gareId) {
        payload.gareId =
          form.gareId;
      }

      await createUtilisateur(
        payload,
      );

      successMessage.value =
        'Le compte utilisateur a été créé avec succès.';
    }

    /* =================================================
     * MODIFICATION
     * ================================================= */

    else {
      if (!utilisateurId.value) {
        throw new Error(
          'Identifiant utilisateur invalide.',
        );
      }

      const payload: UpdateUtilisateurPayload = {
        username: form.username,
        email: form.email,
        nom: form.nom,
        prenom: form.prenom,
        actif: form.actif,
        roleId: form.roleId,
        gareId: form.gareId ?? undefined,
      };

      if (form.telephone) {
        payload.telephone =
          form.telephone;
      }

      await updateUtilisateur(
        utilisateurId.value,
        payload,
      );

      successMessage.value =
        'Le compte utilisateur a été modifié avec succès.';
    }

    setTimeout(() => {
      router.push({
        name: 'utilisateurs',
      });
    }, 800);
  } catch (error: unknown) {
    console.error(
      'Erreur utilisateur:',
      error,
    );

    errorMessage.value =
      extractApiError(
        error,
        isEditMode.value
          ? 'Impossible de modifier le compte utilisateur.'
          : 'Impossible de créer le compte utilisateur.',
      );
  } finally {
    submitting.value = false;
  }
}

/* =====================================================
 * BACK
 * ===================================================== */

function goBack() {
  router.push({
    name: 'utilisateurs',
  });
}

/* =====================================================
 * API ERROR
 * ===================================================== */

function extractApiError(
  error: unknown,
  fallback: string,
): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const responseMessage =
    err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (
    typeof responseMessage === 'string'
  ) {
    return responseMessage;
  }

  return fallback;
}

/* =====================================================
 * INIT
 * ===================================================== */

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
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

.form-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 24px;
}

.form-section {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.form-section:last-of-type {
  border-bottom: 0;
}

.form-section h2 {
  margin: 0 0 18px;
  font-size: 19px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  min-height: 42px;
  padding: 9px 11px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
}

input:disabled,
select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group small {
  color: #666;
  font-size: 12px;
}

.password-wrapper {
  display: flex;
  gap: 8px;
}

.password-wrapper input {
  flex: 1;
}

.password-toggle {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0 12px;
  background: #f8fafc;
  cursor: pointer;
}

.field-error {
  color: #b91c1c !important;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-row input {
  width: auto;
  min-height: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  min-height: 42px;
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
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

.alert {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 8px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
}

.loading-state {
  padding: 50px;
  text-align: center;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
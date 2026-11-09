<template>
  <section class="page">
    <!-- Fil d'Ariane -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <span>Utilisateurs</span>
      <span class="separator">/</span>
      <strong>{{ isEditMode ? 'Modification' : 'Création' }}</strong>
    </div>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>♙</span>
        </div>

        <div>
          <h1>
            {{ isEditMode ? 'Modifier un utilisateur' : 'Nouvel utilisateur' }}
          </h1>
          <p>
            {{
              isEditMode
                ? 'Modifier les informations et les accès du compte utilisateur.'
                : 'Créer un compte et configurer ses accès à la plateforme FOPTRAC.'
            }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-secondary"
        :disabled="submitting"
        @click="goBack"
      >
        ← Retour
      </button>
    </header>

    <!-- Chargement -->
    <div v-if="loadingData" class="loading-card">
      <div class="spinner"></div>
      <p>Chargement des informations...</p>
    </div>

    <template v-else>
      <!-- Messages -->
      <div v-if="errorMessage" class="alert alert-error" role="alert">
        <span>⚠</span>
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="alert alert-success" role="status">
        <span>✓</span>
        <p>{{ successMessage }}</p>
      </div>

      <form class="form-card" @submit.prevent="handleSubmit">

        <!-- IDENTITÉ -->
        <section class="form-section">
          <div class="section-heading">
            <div class="section-icon">♙</div>
            <div>
              <h2>Identité</h2>
              <p>Informations personnelles de l'utilisateur.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="nom">Nom <span>*</span></label>
              <input
                id="nom"
                v-model.trim="form.nom"
                type="text"
                required
                maxlength="100"
                autocomplete="family-name"
                placeholder="Nom de famille"
              />
            </div>

            <div class="form-group">
              <label for="prenom">Prénom <span>*</span></label>
              <input
                id="prenom"
                v-model.trim="form.prenom"
                type="text"
                required
                maxlength="100"
                autocomplete="given-name"
                placeholder="Prénom"
              />
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone</label>
              <input
                id="telephone"
                v-model.trim="form.telephone"
                type="tel"
                maxlength="20"
                autocomplete="tel"
                placeholder="Numéro de téléphone"
              />
            </div>
          </div>
        </section>

        <!-- COMPTE -->
        <section class="form-section">
          <div class="section-heading">
            <div class="section-icon">▣</div>
            <div>
              <h2>Compte utilisateur</h2>
              <p>Identifiants de connexion à FOPTRAC.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="username">
                Nom d'utilisateur <span>*</span>
              </label>
              <input
                id="username"
                v-model.trim="form.username"
                type="text"
                required
                maxlength="50"
                autocomplete="username"
                placeholder="Nom d'utilisateur"
              />
            </div>

            <div class="form-group">
              <label for="email">Email <span>*</span></label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                required
                maxlength="100"
                autocomplete="email"
                placeholder="exemple@domaine.com"
              />
            </div>

            <!-- Mot de passe uniquement à la création -->
            <div v-if="!isEditMode" class="form-group">
              <label for="password">
                Mot de passe <span>*</span>
              </label>

              <div class="password-wrapper">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  maxlength="100"
                  autocomplete="new-password"
                  placeholder="Mot de passe"
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Masquer' : 'Afficher' }}
                </button>
              </div>
              <small>Minimum 6 caractères.</small>
            </div>

            <div v-if="!isEditMode" class="form-group">
              <label for="passwordConfirmation">
                Confirmation du mot de passe <span>*</span>
              </label>

              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                maxlength="100"
                autocomplete="new-password"
                placeholder="Confirmer le mot de passe"
              />

              <small v-if="passwordMismatch" class="field-error">
                Les mots de passe ne correspondent pas.
              </small>
            </div>
          </div>

          <div v-if="isEditMode" class="info-note">
            Le mot de passe n'est pas modifié depuis ce formulaire.
          </div>
        </section>

        <!-- AFFECTATION -->
        <section class="form-section">
          <div class="section-heading">
            <div class="section-icon">⌖</div>
            <div>
              <h2>Affectation et permissions</h2>
              <p>Définition du rôle et de la gare de rattachement.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="role">Rôle <span>*</span></label>

              <select
                id="role"
                v-model="form.roleId"
                required
                :disabled="loadingReferenceData || availableRoles.length === 0"
              >
                <option :value="null" disabled>
                  {{
                    loadingReferenceData
                      ? 'Chargement des rôles...'
                      : availableRoles.length === 0
                        ? 'Aucun rôle disponible'
                        : 'Sélectionner un rôle'
                  }}
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
                Vous pouvez uniquement attribuer les rôles AGENT et CONTROLEUR.
              </small>

              <small
                v-if="!loadingReferenceData && availableRoles.length === 0"
                class="field-error"
              >
                Aucun rôle autorisé n'est disponible.
              </small>
            </div>

            <div class="form-group">
              <label for="gare">Gare de rattachement</label>

              <select
                id="gare"
                v-model="form.gareId"
                :disabled="isResponsableGare"
              >
                <option value="">Aucune gare</option>

                <option
                  v-for="gare in gares"
                  :key="gare.id"
                  :value="gare.id"
                >
                  {{ gare.code }} — {{ gare.nom }}
                </option>
              </select>

              <small v-if="isResponsableGare">
                La gare est automatiquement définie selon votre affectation.
              </small>

              <small v-else>
                Sélectionnez la gare de rattachement de l'utilisateur.
              </small>
            </div>
          </div>
        </section>

        <!-- STATUT -->
        <section class="form-section status-section">
          <div class="section-heading">
            <div class="section-icon">✓</div>
            <div>
              <h2>Statut du compte</h2>
              <p>Définissez si le compte est actif.</p>
            </div>
          </div>

          <label class="checkbox-row">
            <input v-model="form.actif" type="checkbox" />
            <span class="custom-checkbox"></span>

            <span class="checkbox-content">
              <strong>Compte actif</strong>
              <small>
                L'utilisateur pourra accéder à la plateforme selon
                les permissions de son rôle.
              </small>
            </span>
          </label>
        </section>

        <!-- ACTIONS -->
        <footer class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="submitting"
            @click="goBack"
          >
            Annuler
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="
              submitting ||
              passwordMismatch ||
              loadingReferenceData ||
              availableRoles.length === 0
            "
          >
            <span v-if="submitting" class="button-spinner"></span>
            <span v-else>✓</span>

            {{
              submitting
                ? (isEditMode ? 'Enregistrement...' : 'Création...')
                : (isEditMode ? 'Enregistrer les modifications' : 'Créer le compte')
            }}
          </button>
        </footer>
      </form>
    </template>
  </section>
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

const loadingReferenceData = ref(false);

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
  const activeRoles = roles.value.filter(
    (role) => role.actif !== false,
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

async function loadReferenceData(): Promise<void> {
  loadingReferenceData.value = true;

  const errors: string[] = [];

  try {
    const [rolesResult, garesResult] = await Promise.allSettled([
      getRoles(),
      getGares(),
    ]);

    if (rolesResult.status === 'fulfilled') {
      const rolesResponse = rolesResult.value;

      roles.value = Array.isArray(rolesResponse)
        ? rolesResponse.filter((role) => role.actif !== false)
        : [];

      if (!Array.isArray(rolesResponse)) {
        errors.push(
          'La réponse du serveur pour les rôles est invalide.',
        );
      }
    } else {
      console.error('Erreur chargement rôles:', rolesResult.reason);

      errors.push(
        extractApiError(
          rolesResult.reason,
          'Impossible de charger les rôles. Vérifiez la route GET /api/roles.',
        ),
      );
    }

    if (garesResult.status === 'fulfilled') {
      const garesResponse = garesResult.value;

      gares.value = Array.isArray(garesResponse)
        ? garesResponse.filter((gare) => gare.statut === 'ACTIF')
        : [];

      if (!Array.isArray(garesResponse)) {
        errors.push(
          'La réponse du serveur pour les gares est invalide.',
        );
      }
    } else {
      console.error('Erreur chargement gares:', garesResult.reason);

      errors.push(
        extractApiError(
          garesResult.reason,
          'Impossible de charger les gares.',
        ),
      );
    }

    if (errors.length > 0) {
      errorMessage.value = errors.join(' ');
    }
  } finally {
    loadingReferenceData.value = false;
  }
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

async function loadData(): Promise<void> {
  loadingData.value = true;
  errorMessage.value = '';

  try {
    await loadReferenceData();

    if (isEditMode.value) {
      await loadUtilisateur();
    } else {
      if (isResponsableGare.value && authStore.gareId) {
        form.gareId = authStore.gareId;
      }

      if (availableRoles.value.length === 1) {
        form.roleId = availableRoles.value[0].id;
      }
    }
  } catch (error: unknown) {
    console.error('Erreur initialisation formulaire:', error);

    errorMessage.value = extractApiError(
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
.page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 32px 40px;
  color: #243247;
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 20px;
  color: #8a94a4;
  font-size: 13px;
}

.breadcrumb .separator {
  color: #c5a13b;
}

.breadcrumb strong {
  color: #17365d;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-icon {
  display: grid;
  place-items: center;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #17365d;
  color: #e2c16b;
  font-size: 27px;
}

.page-header h1 {
  margin: 0;
  color: #17365d;
  font-size: 27px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 6px 0 0;
  color: #7b8797;
  font-size: 13px;
  line-height: 1.5;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 10px 18px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #17365d;
  color: #fff;
  box-shadow: 0 3px 8px rgb(23 54 93 / 14%);
}

.btn-primary:hover:not(:disabled) {
  background: #234a78;
  transform: translateY(-1px);
}

.btn-secondary {
  border-color: #dfe5ed;
  background: #fff;
  color: #536174;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #c5a13b;
  color: #17365d;
}

.form-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgb(25 42 70 / 4%);
}

.form-section {
  padding: 25px 28px;
  border-bottom: 1px solid #edf0f4;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 23px;
}

.section-icon {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #edf2f8;
  color: #17365d;
  font-size: 19px;
  font-weight: 700;
}

.section-heading h2 {
  margin: 0;
  color: #17365d;
  font-size: 16px;
  font-weight: 750;
}

.section-heading p {
  margin: 4px 0 0;
  color: #929baa;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-group label {
  color: #394a60;
  font-size: 13px;
  font-weight: 650;
}

.form-group label span {
  color: #bd8d27;
}

.form-group input,
.form-group select {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #dce2e9;
  border-radius: 7px;
  outline: none;
  background: #fff;
  color: #293b52;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #a5adba;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #c5a13b;
  box-shadow: 0 0 0 3px rgb(197 161 59 / 13%);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f2f4f7;
  color: #687386;
  cursor: not-allowed;
}

.form-group small {
  color: #8b95a4;
  font-size: 11px;
  line-height: 1.5;
}

.password-wrapper {
  position: relative;
  display: flex;
}

.password-wrapper input {
  padding-right: 90px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 11px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #234a78;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.field-error {
  color: #b44444 !important;
}

.info-note {
  margin-top: 18px;
  padding: 11px 14px;
  border: 1px solid #e3e9f1;
  border-radius: 7px;
  background: #f4f7fb;
  color: #536174;
  font-size: 12px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  cursor: pointer;
}

.checkbox-row input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.custom-checkbox {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 1px solid #cbd3df;
  border-radius: 5px;
  background: #fff;
  transition: 0.2s ease;
}

.checkbox-row input:checked + .custom-checkbox {
  border-color: #17365d;
  background: #17365d;
}

.checkbox-row input:checked + .custom-checkbox::after {
  content: '✓';
  color: #e2c16b;
  font-size: 13px;
  font-weight: 800;
}

.checkbox-row input:focus-visible + .custom-checkbox {
  outline: 3px solid rgb(197 161 59 / 25%);
}

.checkbox-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-content strong {
  color: #394a60;
  font-size: 13px;
}

.checkbox-content small {
  color: #929baa;
  font-size: 11px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 11px;
  padding: 20px 28px;
  border-top: 1px solid #edf0f4;
  background: #fafbfd;
}

.alert {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 17px;
  padding: 13px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 13px;
}

.alert p {
  flex: 1;
  margin: 0;
}

.alert-error {
  border-color: #f1c3c3;
  background: #fff2f2;
  color: #a33434;
}

.alert-success {
  border-color: #b8dfc6;
  background: #eff8f1;
  color: #256c43;
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  gap: 14px;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  background: #fff;
  color: #8792a1;
  font-size: 13px;
}

.spinner,
.button-spinner {
  border: 3px solid #e7ebf1;
  border-top-color: #c5a13b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner {
  width: 31px;
  height: 31px;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-top-color: #e2c16b;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .page {
    padding: 20px 16px 30px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header > .btn {
    width: 100%;
  }

  .form-section {
    padding: 21px 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 17px;
  }

  .form-actions {
    flex-direction: column-reverse;
    padding: 18px;
  }

  .form-actions .btn {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 16px 11px 25px;
  }

  .page-header h1 {
    font-size: 23px;
  }

  .header-icon {
    width: 45px;
    height: 45px;
  }

  .section-heading {
    align-items: flex-start;
  }
}
</style>
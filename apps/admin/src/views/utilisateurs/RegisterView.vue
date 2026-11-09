
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../auth/auth.store';
import { getRoles } from '../../api/roles.api';
import { createUtilisateur } from '../../api/utilisateurs.api';
import { getGares } from '../../api/gares.api';

import type { Role } from '../../types/role.types';
import type { CreateUtilisateurPayload } from '../../types/utilisateur.types';
import type { Gare } from '../../types/gare.types';

const router = useRouter();
const authStore = useAuthStore();

const roles = ref<Role[]>([]);
const gares = ref<Gare[]>([]);

const loadingData = ref(true);
const submitting = ref(false);

const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);

let redirectTimer: ReturnType<typeof setTimeout> | null = null;

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

const currentRole = computed(() => authStore.role);
const isAdmin = computed(() => currentRole.value === 'ADMIN');
const isResponsableGare = computed(
  () => currentRole.value === 'RESPONSABLE_GARE',
);

const passwordMismatch = computed(
  () =>
    form.password.length > 0 &&
    form.passwordConfirmation.length > 0 &&
    form.password !== form.passwordConfirmation,
);

const availableRoles = computed(() => {
  const activeRoles = roles.value.filter((role) => role.actif);

  if (isAdmin.value) {
    return activeRoles;
  }

  if (isResponsableGare.value) {
    return activeRoles.filter(
      (role) => role.code === 'AGENT' || role.code === 'CONTROLEUR',
    );
  }

  return [];
});

async function loadData(): Promise<void> {
  loadingData.value = true;
  errorMessage.value = '';

  try {
    const [rolesResponse, garesResponse] = await Promise.all([
      getRoles(),
      getGares(),
    ]);

    roles.value = rolesResponse;
    gares.value = garesResponse;

    if (isResponsableGare.value && authStore.gareId) {
      form.gareId = authStore.gareId;
    }

    if (availableRoles.value.length === 1) {
      form.roleId = availableRoles.value[0].id;
    }
  } catch (error: unknown) {
    console.error('Erreur chargement formulaire utilisateur:', error);

    errorMessage.value = extractApiError(
      error,
      'Impossible de charger les données du formulaire.',
    );
  } finally {
    loadingData.value = false;
  }
}

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';
  successMessage.value = '';

  if (form.password !== form.passwordConfirmation) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value =
      'Le mot de passe doit contenir au moins 6 caractères.';
    return;
  }

  if (!form.roleId) {
    errorMessage.value = 'Veuillez sélectionner un rôle.';
    return;
  }

  const selectedRole = availableRoles.value.find(
    (role) => role.id === form.roleId,
  );

  if (!selectedRole) {
    errorMessage.value = 'Le rôle sélectionné n’est pas autorisé.';
    return;
  }

  if (isResponsableGare.value) {
    if (
      selectedRole.code !== 'AGENT' &&
      selectedRole.code !== 'CONTROLEUR'
    ) {
      errorMessage.value =
        'Un responsable de gare peut uniquement créer un AGENT ou un CONTROLEUR.';
      return;
    }

    if (!authStore.gareId || form.gareId !== authStore.gareId) {
      errorMessage.value =
        'Le nouvel utilisateur doit appartenir à votre gare.';
      return;
    }
  }

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
    payload.telephone = form.telephone;
  }

  if (form.gareId) {
    payload.gareId = form.gareId;
  }

  submitting.value = true;

  try {
    await createUtilisateur(payload);

    successMessage.value =
      'Le compte utilisateur a été créé avec succès.';

    redirectTimer = setTimeout(() => {
      router.push('/utilisateurs');
    }, 800);
  } catch (error: unknown) {
    console.error('Erreur création utilisateur:', error);

    errorMessage.value = extractApiError(
      error,
      'Impossible de créer le compte utilisateur.',
    );
  } finally {
    submitting.value = false;
  }
}

function extractApiError(error: unknown, fallback: string): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  return fallback;
}

function goBack(): void {
  router.push('/utilisateurs');
}

onMounted(() => {
  loadData();
});

onBeforeUnmount(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});
</script>

<template>
  <section class="page">
    <!-- Fil d'Ariane -->
    <div class="breadcrumb">
      <span>Administration</span>
      <span class="separator">/</span>
      <span>Utilisateurs</span>
      <span class="separator">/</span>
      <strong>Nouvel utilisateur</strong>
    </div>

    <!-- En-tête -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <span>♙</span>
        </div>

        <div>
          <h1>Créer un utilisateur</h1>
          <p>
            Création d'un nouveau compte et configuration de ses accès
            à la plateforme FOPTRAC.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-secondary"
        :disabled="submitting"
        @click="goBack"
      >
        <span>←</span>
        Retour
      </button>
    </header>

    <!-- Messages -->
    <div v-if="errorMessage" class="alert alert-error">
      <span class="alert-icon">⚠</span>
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        aria-label="Fermer"
        @click="errorMessage = ''"
      >
        ×
      </button>
    </div>

    <div v-if="successMessage" class="alert alert-success">
      <span class="alert-icon">✓</span>
      <p>{{ successMessage }}</p>
    </div>

    <!-- Chargement -->
    <div v-if="loadingData" class="loading-card">
      <div class="spinner"></div>
      <p>Chargement des rôles et des gares...</p>
    </div>

    <!-- Formulaire -->
    <form
      v-else
      class="form-card"
      @submit.prevent="handleSubmit"
    >
      <!-- Identité -->
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
              maxlength="100"
              required
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
              maxlength="100"
              required
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

      <!-- Compte -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-icon">▣</div>
          <div>
            <h2>Compte utilisateur</h2>
            <p>Identifiants de connexion à la plateforme.</p>
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
              maxlength="50"
              required
              autocomplete="username"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div class="form-group">
            <label for="email">
              Adresse email <span>*</span>
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              maxlength="100"
              required
              autocomplete="email"
              placeholder="exemple@domaine.com"
            />
          </div>

          <div class="form-group">
            <label for="password">
              Mot de passe <span>*</span>
            </label>

            <div class="password-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                minlength="6"
                maxlength="100"
                required
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

          <div class="form-group">
            <label for="passwordConfirmation">
              Confirmation du mot de passe <span>*</span>
            </label>

            <input
              id="passwordConfirmation"
              v-model="form.passwordConfirmation"
              :type="showPassword ? 'text' : 'password'"
              minlength="6"
              maxlength="100"
              required
              autocomplete="new-password"
              placeholder="Confirmer le mot de passe"
              :class="{ 'input-error': passwordMismatch }"
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

      <!-- Affectation -->
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
            >
              <option :value="null" disabled>
                Sélectionner un rôle
              </option>

              <option
                v-for="role in availableRoles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.libelle }}
              </option>
            </select>

            <small v-if="isResponsableGare">
              Vous pouvez uniquement attribuer les rôles AGENT et
              CONTROLEUR.
            </small>
          </div>

          <div class="form-group">
            <label for="gare">Gare de rattachement</label>

            <select
              id="gare"
              v-model="form.gareId"
              :disabled="isResponsableGare"
            >
              <option :value="null">Aucune gare</option>

              <option
                v-for="gare in gares"
                :key="gare.id"
                :value="gare.id"
              >
                {{ gare.code }} — {{ gare.nom }}
              </option>
            </select>

            <small v-if="isResponsableGare">
              La gare est automatiquement définie sur votre gare
              d'affectation.
            </small>

            <small v-else>
              Sélectionnez une gare si le rôle de l'utilisateur
              nécessite un rattachement.
            </small>
          </div>
        </div>
      </section>

      <!-- Statut -->
      <section class="form-section status-section">
        <div class="section-heading">
          <div class="section-icon">✓</div>
          <div>
            <h2>Statut du compte</h2>
            <p>Définissez si le compte sera actif dès sa création.</p>
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

      <!-- Actions -->
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
            availableRoles.length === 0
          "
        >
          <span v-if="submitting" class="button-spinner"></span>
          <span v-else>＋</span>
          {{ submitting ? 'Création en cours...' : 'Créer le compte' }}
        </button>
      </footer>
    </form>
  </section>
</template>

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

.input-error {
  border-color: #d45a5a !important;
}

.field-error {
  color: #b44444 !important;
}

.status-section {
  border-bottom: none;
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

.alert button {
  border: none;
  background: transparent;
  font-size: 19px;
  cursor: pointer;
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

.alert-icon {
  font-weight: 800;
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

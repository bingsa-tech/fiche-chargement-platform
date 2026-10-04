<template>
  <div class="register-page">
    <div class="register-card">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1>Créer un utilisateur</h1>
          <p>Créer un nouveau compte utilisateur de la plateforme.</p>
        </div>

        <button
          type="button"
          class="btn-secondary"
          @click="goBack"
        >
          Retour
        </button>
      </div>

      <!-- MESSAGES / ALERTS -->
      <div
        v-if="errorMessage"
        class="alert alert-error"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="alert alert-success"
      >
        {{ successMessage }}
      </div>

      <!-- LOADING -->
      <div
        v-if="loadingData"
        class="loading"
      >
        Chargement des rôles et des gares...
      </div>

      <!-- FORM -->
      <form
        v-else
        class="register-form"
        @submit.prevent="handleSubmit"
      >
        <!-- IDENTITÉ -->
        <section class="form-section">
          <h2>Identité</h2>

          <div class="form-grid">
            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                id="nom"
                v-model.trim="form.nom"
                type="text"
                maxlength="100"
                required
                autocomplete="family-name"
              />
            </div>

            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input
                id="prenom"
                v-model.trim="form.prenom"
                type="text"
                maxlength="100"
                required
                autocomplete="given-name"
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
              />
            </div>
          </div>
        </section>

        <!-- COMPTE -->
        <section class="form-section">
          <h2>Compte</h2>

          <div class="form-grid">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input
                id="username"
                v-model.trim="form.username"
                type="text"
                maxlength="50"
                required
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label for="email">Adresse email</label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                maxlength="100"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="password-wrapper">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  minlength="6"
                  maxlength="100"
                  required
                  autocomplete="new-password"
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
              <label for="passwordConfirmation">Confirmation du mot de passe</label>
              <input
                id="passwordConfirmation"
                v-model="form.passwordConfirmation"
                :type="showPassword ? 'text' : 'password'"
                minlength="6"
                maxlength="100"
                required
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

        <!-- AFFECTATION -->
        <section class="form-section">
          <h2>Affectation</h2>

          <div class="form-grid">
            <!-- ROLE -->
            <div class="form-group">
              <label for="role">Rôle</label>
              <select
                id="role"
                v-model="form.roleId"
                required
              >
                <option
                  :value="null"
                  disabled
                >
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
            </div>

            <!-- GARE -->
            <div class="form-group">
              <label for="gare">Gare</label>
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
                La gare est automatiquement définie sur votre gare d'affectation.
              </small>
            </div>
          </div>
        </section>

        <!-- STATUT -->
        <section class="form-section">
          <h2>Statut</h2>
          <label class="checkbox-row">
            <input
              v-model="form.actif"
              type="checkbox"
            />
            <span>Compte actif</span>
          </label>
        </section>

        <!-- ACTIONS -->
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
            :disabled="submitting || passwordMismatch"
          >
            <span v-if="submitting">Création...</span>
            <span v-else>Créer le compte</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

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

// STATE
const roles = ref<Role[]>([]);
const gares = ref<Gare[]>([]);

const loadingData = ref(true);
const submitting = ref(false);

const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);

let redirectTimer: ReturnType<typeof setTimeout> | null = null;

// FORM
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

// COMPUTED
const currentRole = computed(() => authStore.role);
const isAdmin = computed(() => currentRole.value === 'ADMIN');
const isResponsableGare = computed(() => currentRole.value === 'RESPONSABLE_GARE');

const passwordMismatch = computed(
  () =>
    form.password.length > 0 &&
    form.passwordConfirmation.length > 0 &&
    form.password !== form.passwordConfirmation
);

const availableRoles = computed(() => {
  const activeRoles = roles.value.filter((role) => role.actif);

  if (isAdmin.value) {
    return activeRoles;
  }

  if (isResponsableGare.value) {
    return activeRoles.filter(
      (role) => role.code === 'AGENT' || role.code === 'CONTROLEUR'
    );
  }

  return [];
});

// METHODS
async function loadData() {
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
      'Impossible de charger les données du formulaire.'
    );
  } finally {
    loadingData.value = false;
  }
}

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  if (form.password !== form.passwordConfirmation) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères.';
    return;
  }

  if (!form.roleId) {
    errorMessage.value = 'Veuillez sélectionner un rôle.';
    return;
  }

  const selectedRole = availableRoles.value.find((role) => role.id === form.roleId);

  if (!selectedRole) {
    errorMessage.value = 'Le rôle sélectionné n’est pas autorisé.';
    return;
  }

  if (isResponsableGare.value) {
    if (selectedRole.code !== 'AGENT' && selectedRole.code !== 'CONTROLEUR') {
      errorMessage.value =
        'Un responsable de gare peut uniquement créer un AGENT ou un CONTROLEUR.';
      return;
    }

    if (!authStore.gareId || form.gareId !== authStore.gareId) {
      errorMessage.value = 'Le nouvel utilisateur doit appartenir à votre gare.';
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
    successMessage.value = 'Le compte utilisateur a été créé avec succès.';

    redirectTimer = setTimeout(() => {
      router.push('/utilisateurs');
    }, 800);
  } catch (error: unknown) {
    console.error('Erreur création utilisateur:', error);
    errorMessage.value = extractApiError(
      error,
      'Impossible de créer le compte utilisateur.'
    );
  } finally {
    submitting.value = false;
  }
}

function extractApiError(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string | string[] } } };
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {

    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  return fallback;
}

function goBack() {
  router.push('/utilisateurs');
}

// LIFECYCLE
onMounted(() => {
  loadData();
});

onBeforeUnmount(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});
</script>

<style scoped>
.register-page {
  min-height: 100%;
  padding: 32px;
}

.register-card {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

.form-section {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 650;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-group select:disabled {
  background: #f1f5f9;
  color: #475569;
  cursor: not-allowed;
}

.form-group small {
  color: #64748b;
  font-size: 12px;
}

.field-error {
  color: #dc2626 !important;
}

.password-wrapper {
  display: flex;
  position: relative;
}

.password-wrapper input {
  padding-right: 95px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  cursor: pointer;
}

.checkbox-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #334155;
  font-size: 14px;
}

.checkbox-row input {
  width: 17px;
  height: 17px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.btn-primary,
.btn-secondary {
  min-height: 44px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8fafc;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  margin-bottom: 20px;
  padding: 13px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.loading {
  padding: 40px 0;
  text-align: center;
  color: #64748b;
}

@media (max-width: 768px) {
  .register-page {
    padding: 16px;
  }

  .register-card {
    padding: 20px;
  }

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
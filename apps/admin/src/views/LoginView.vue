<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '../auth/auth.store';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const { loading, error } = storeToRefs(authStore);

const username = ref('');
const password = ref('');
const showPassword = ref(false);

async function handleLogin() {
  if (!username.value.trim() || !password.value) {
    return;
  }

  try {
    await authStore.login(
      username.value.trim(),
      password.value,
    );

    const redirect = route.query.redirect;

    if (typeof redirect === 'string' && redirect) {
      await router.push(redirect);
      return;
    }

    switch (authStore.role) {
      case 'ADMIN':
        await router.push({
          name: 'admin-dashboard',
        });
        break;

      case 'AGENT':
        await router.push({
          name: 'agent-dashboard',
        });
        break;

      case 'CONTROLEUR':
        await router.push({
          name: 'controleur-dashboard',
        });
        break;

      case 'AUTORITE_HABILITEE':
        await router.push({
          name: 'autorite-dashboard',
        });
        break;

      default:
        await router.push({
          name: 'unauthorized',
        });
    }
  } catch {
    // L'erreur est déjà gérée par authStore.error.
  }
}
</script>

<template>
  <main class="login-page">

    <section class="login-container">

      <!-- ========================= -->
      <!-- PANNEAU SÉCURITÉ ROUTIÈRE -->
      <!-- ========================= -->
      <div class="security-panel">

        <div class="security-content">

          <div class="brand">
            <div class="brand-icon">
              🚍
            </div>

            <div>
              <h1>Gare Routière</h1>
              <span>Plateforme de gestion</span>
            </div>
          </div>

          <div class="security-main">

            <span class="security-label">
              SÉCURITÉ ROUTIÈRE
            </span>

            <h2>
              La sécurité des voyageurs
              commence avant le départ.
            </h2>

            <p>
              Une gestion rigoureuse des véhicules,
              des chauffeurs et des documents contribue
              à assurer des conditions de transport
              plus sûres pour tous.
            </p>

            <div class="security-items">

              <div class="security-item">
                <div class="item-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Véhicules contrôlés
                  </strong>

                  <span>
                    Suivi des véhicules et de leur état.
                  </span>
                </div>
              </div>

              <div class="security-item">
                <div class="item-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Documents vérifiés
                  </strong>

                  <span>
                    Suivi des documents obligatoires.
                  </span>
                </div>
              </div>

              <div class="security-item">
                <div class="item-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Départs mieux maîtrisés
                  </strong>

                  <span>
                    Une information fiable pour les opérations.
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div class="security-footer">
            <span>
              Une plateforme au service d'un transport
              plus sûr et mieux organisé.
            </span>
          </div>

        </div>
      </div>

      <!-- ========================= -->
      <!-- PANNEAU CONNEXION -->
      <!-- ========================= -->
      <div class="login-panel">

        <div class="login-card">

          <div class="login-header">

            <div class="login-icon">
              🔐
            </div>

            <h2>
              Connexion
            </h2>

            <p>
              Accédez à votre espace de travail
            </p>

          </div>

          <form
            class="login-form"
            @submit.prevent="handleLogin"
          >

            <!-- Nom utilisateur -->
            <div class="form-group">

              <label for="username">
                Nom d'utilisateur
              </label>

              <div class="input-wrapper">

                <span class="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  v-model="username"
                  type="text"
                  autocomplete="username"
                  placeholder="Votre nom d'utilisateur"
                  :disabled="loading"
                  required
                />

              </div>

            </div>

            <!-- Mot de passe -->
            <div class="form-group">

              <label for="password">
                Mot de passe
              </label>

              <div class="input-wrapper">

                <span class="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Votre mot de passe"
                  :disabled="loading"
                  required
                />

                <button
                  type="button"
                  class="password-toggle"
                  :aria-label="
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  "
                  :disabled="loading"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>

              </div>

            </div>

            <!-- Erreur -->
            <div
              v-if="error"
              class="login-error"
              role="alert"
            >
              <span class="error-icon">
                ⚠
              </span>

              <span>
                {{ error }}
              </span>
            </div>

            <!-- Bouton -->
            <button
              type="submit"
              class="login-button"
              :disabled="
                loading ||
                !username.trim() ||
                !password
              "
            >

              <span v-if="loading" class="button-content">
                <span class="spinner"></span>
                Connexion en cours...
              </span>

              <span
                v-else
                class="button-content"
              >
                Se connecter
                <span class="arrow">
                  →
                </span>
              </span>

            </button>

          </form>

          <div class="login-security">

            <span class="lock-icon">
              🔒
            </span>

            <span>
              Connexion sécurisée
            </span>

          </div>

        </div>

      </div>

    </section>

  </main>
</template>

<style scoped>
/* =========================
   PAGE
========================= */

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;

  background:
    radial-gradient(
      circle at top left,
      #eaf2ff 0%,
      transparent 35%
    ),
    #f3f6fa;
}

/* =========================
   CONTENEUR PRINCIPAL
========================= */

.login-container {
  width: 100%;
  max-width: 1050px;
  min-height: 650px;

  display: grid;
  grid-template-columns: 1.08fr 0.92fr;

  overflow: hidden;

  background: #ffffff;

  border-radius: 22px;

  box-shadow:
    0 25px 60px rgba(15, 23, 42, 0.12),
    0 8px 20px rgba(15, 23, 42, 0.06);
}

/* =========================
   PANNEAU SÉCURITÉ
========================= */

.security-panel {
  position: relative;

  display: flex;

  padding: 48px;

  color: white;

  background:
    linear-gradient(
      145deg,
      #0f3d68 0%,
      #155d91 55%,
      #1976a8 100%
    );

  overflow: hidden;
}

.security-panel::before {
  content: '';

  position: absolute;

  width: 280px;
  height: 280px;

  top: -120px;
  right: -100px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
}

.security-panel::after {
  content: '';

  position: absolute;

  width: 220px;
  height: 220px;

  bottom: -120px;
  left: -80px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);
}

.security-content {
  position: relative;
  z-index: 1;

  width: 100%;

  display: flex;
  flex-direction: column;
}

/* =========================
   BRAND
========================= */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: rgba(255, 255, 255, 0.14);

  font-size: 25px;
}

.brand h1 {
  margin: 0;

  font-size: 21px;
  font-weight: 700;
}

.brand span {
  display: block;

  margin-top: 3px;

  color: rgba(255, 255, 255, 0.72);

  font-size: 13px;
}

/* =========================
   SECURITY CONTENT
========================= */

.security-main {
  margin-top: auto;
  margin-bottom: auto;

  max-width: 500px;
}

.security-label {
  display: inline-block;

  margin-bottom: 18px;

  padding: 7px 12px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.09);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.3px;
}

.security-main h2 {
  margin: 0 0 18px;

  font-size: 36px;
  line-height: 1.15;
  font-weight: 700;
}

.security-main > p {
  margin: 0;

  max-width: 470px;

  color: rgba(255, 255, 255, 0.82);

  font-size: 15px;
  line-height: 1.7;
}

/* =========================
   SECURITY ITEMS
========================= */

.security-items {
  display: flex;
  flex-direction: column;

  gap: 18px;

  margin-top: 32px;
}

.security-item {
  display: flex;
  align-items: center;

  gap: 14px;
}

.item-icon {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.14);

  font-size: 14px;
  font-weight: 700;
}

.security-item strong {
  display: block;

  margin-bottom: 3px;

  font-size: 14px;
}

.security-item span {
  color: rgba(255, 255, 255, 0.68);

  font-size: 12px;
}

/* =========================
   SECURITY FOOTER
========================= */

.security-footer {
  color: rgba(255, 255, 255, 0.55);

  font-size: 12px;
  line-height: 1.5;
}

/* =========================
   LOGIN PANEL
========================= */

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 48px;

  background: #ffffff;
}

.login-card {
  width: 100%;
  max-width: 360px;
}

/* =========================
   LOGIN HEADER
========================= */

.login-header {
  margin-bottom: 34px;
}

.login-icon {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 18px;

  border-radius: 12px;

  background: #eef4ff;

  font-size: 21px;
}

.login-header h2 {
  margin: 0 0 7px;

  color: #172033;

  font-size: 28px;
  font-weight: 700;
}

.login-header p {
  margin: 0;

  color: #697386;

  font-size: 14px;
}

/* =========================
   FORM
========================= */

.login-form {
  display: flex;
  flex-direction: column;

  gap: 21px;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.form-group label {
  color: #344054;

  font-size: 13px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;

  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;

  font-size: 15px;

  opacity: 0.6;

  pointer-events: none;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;

  padding: 13px 42px;

  border: 1px solid #d7dce3;
  border-radius: 9px;

  color: #172033;

  background: #ffffff;

  font-size: 14px;

  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #98a2b3;
}

.form-group input:focus {
  outline: none;

  border-color: #2878d4;

  box-shadow:
    0 0 0 3px rgba(40, 120, 212, 0.1);
}

.form-group input:disabled {
  background: #f5f6f8;
}

/* =========================
   PASSWORD
========================= */

.password-toggle {
  position: absolute;

  right: 9px;

  width: 34px;
  height: 34px;

  padding: 0;

  border: none;

  background: transparent;

  color: #667085;

  cursor: pointer;

  font-size: 15px;
}

.password-toggle:hover {
  opacity: 0.75;
}

/* =========================
   ERROR
========================= */

.login-error {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  padding: 11px 12px;

  border: 1px solid #fecaca;
  border-radius: 8px;

  background: #fff1f2;

  color: #b42318;

  font-size: 13px;
  line-height: 1.45;
}

.error-icon {
  flex-shrink: 0;
}

/* =========================
   LOGIN BUTTON
========================= */

.login-button {
  width: 100%;

  padding: 14px 16px;

  border: none;
  border-radius: 9px;

  background: #1769aa;

  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.1s;
}

.login-button:hover:not(:disabled) {
  background: #12598f;
}

.login-button:active:not(:disabled) {
  transform: translateY(1px);
}

.login-button:disabled {
  cursor: not-allowed;

  opacity: 0.55;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
}

.arrow {
  font-size: 17px;
}

/* =========================
   SPINNER
========================= */

.spinner {
  width: 15px;
  height: 15px;

  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   LOGIN SECURITY
========================= */

.login-security {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 25px;

  color: #98a2b3;

  font-size: 11px;
}

.lock-icon {
  font-size: 12px;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 850px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 520px;
  }

  .security-panel {
    min-height: 380px;

    padding: 35px;
  }

  .security-main h2 {
    font-size: 29px;
  }

  .login-panel {
    padding: 40px 35px;
  }
}

@media (max-width: 500px) {
  .login-page {
    padding: 12px;
  }

  .login-container {
    border-radius: 16px;
  }

  .security-panel {
    padding: 28px 24px;
  }

  .security-main h2 {
    font-size: 26px;
  }

  .login-panel {
    padding: 32px 24px;
  }
}
</style>
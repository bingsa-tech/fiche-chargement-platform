
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '../auth/auth.store';
import { getClientInfo } from '../utils/client-info';
import logo from '../assets/logo-final.png';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const username = ref('');
const password = ref('');
const showPassword = ref(false);

async function handleLogin(): Promise<void> {
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
        await router.push({ name: 'admin-dashboard' });
        break;

      case 'AGENT':
        await router.push({ name: 'agent-dashboard' });
        break;

      case 'CONTROLEUR':
        await router.push({ name: 'controleur-dashboard' });
        break;

      case 'AUTORITE_HABILITEE':
        await router.push({ name: 'autorite-dashboard' });
        break;

      case 'RESPONSABLE_GARE':
        await router.push({
          name: 'responsable-gare-dashboard',
        });
        break;

      default:
        await router.push({ name: 'unauthorized' });
    }
  } catch {
    // L'erreur est déjà gérée par authStore.error.
  }
}

function testerInformationsClient() {
  const infos = getClientInfo();
  console.table(infos);
  return infos;
}
</script>

<template>
  <main class="login-page">
    <div class="login-background-decoration decoration-one"></div>
    <div class="login-background-decoration decoration-two"></div>

    <section class="login-container">

      <!-- PANNEAU INSTITUTIONNEL -->
      <aside class="security-panel">
        <div class="security-overlay"></div>

        <div class="security-content">

          <div class="brand">
            <div class="brand-logo">
              <img
                :src="logo"
                alt="Logo FOPTRAC"
              />
            </div>

            <div class="brand-information">
              <span class="brand-name">FOPTRAC</span>
              <span class="brand-subtitle">
                Plateforme de gestion
              </span>
            </div>
          </div>

          <div class="security-main">
            <div class="security-label">
              <span class="status-dot"></span>
              SÉCURITÉ ET GESTION DU TRANSPORT
            </div>

            <h1>
              Une gestion rigoureuse.
              <span>Des déplacements plus sûrs.</span>
            </h1>

            <p class="security-description">
              FOPTRAC centralise les opérations de gestion des gares,
              des véhicules, des chauffeurs et des documents afin
              de renforcer le contrôle et la sécurité des voyageurs.
            </p>

            <div class="security-items">

              <div class="security-item">
                <div class="item-icon">
                  <span>✓</span>
                </div>
                <div>
                  <strong>Véhicules contrôlés</strong>
                  <span>
                    Suivi des véhicules et de leur état.
                  </span>
                </div>
              </div>

              <div class="security-item">
                <div class="item-icon">
                  <span>✓</span>
                </div>
                <div>
                  <strong>Documents vérifiés</strong>
                  <span>
                    Suivi des documents obligatoires.
                  </span>
                </div>
              </div>

              <div class="security-item">
                <div class="item-icon">
                  <span>✓</span>
                </div>
                <div>
                  <strong>Départs mieux maîtrisés</strong>
                  <span>
                    Une information fiable pour les opérations.
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div class="security-footer">
            <span class="footer-line"></span>
            <p>
              Une plateforme au service d'un transport
              plus sûr et mieux organisé.
            </p>
          </div>

        </div>
      </aside>

      <!-- PANNEAU DE CONNEXION -->
      <section class="login-panel">
        <div class="login-card">

          <div class="mobile-brand">
            <img :src="logo" alt="Logo FOPTRAC" />
            <span>FOPTRAC</span>
          </div>

          <div class="login-header">
            <div class="login-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
                <path
                  d="M19 10.2V7.5a7 7 0 0 0-14 0v2.7"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
                <path
                  d="M5 10h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <span class="welcome-label">
              ESPACE PROFESSIONNEL
            </span>

            <h2>Bienvenue</h2>

            <p>
              Connectez-vous pour accéder à votre espace de travail.
            </p>
          </div>

          <form
            class="login-form"
            @submit.prevent="handleLogin"
          >

            <!-- NOM D'UTILISATEUR -->
            <div class="form-group">
              <label for="username">
                Nom d'utilisateur
              </label>

              <div class="input-wrapper">
                <svg
                  class="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <path
                    d="M4 20c.8-4 3.4-6 8-6s7.2 2 8 6"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                </svg>

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

            <!-- MOT DE PASSE -->
            <div class="form-group">
              <label for="password">
                Mot de passe
              </label>

              <div class="input-wrapper">
                <svg
                  class="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                  <path
                    d="M12 14v3"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                </svg>

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
                  <svg
                    v-if="!showPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      stroke-width="1.7"
                    />
                  </svg>

                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                    <path
                      d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- MESSAGE D'ERREUR -->
            <div
              v-if="error"
              class="login-error"
              role="alert"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <path
                  d="M12 7v6m0 3v.1"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>

              <span>{{ error }}</span>
            </div>

            <!-- BOUTON DE CONNEXION -->
            <button
              type="submit"
              class="login-button"
              :disabled="
                loading ||
                !username.trim() ||
                !password
              "
            >
              <span
                v-if="loading"
                class="button-content"
              >
                <span class="spinner"></span>
                Connexion en cours...
              </span>

              <span
                v-else
                class="button-content"
              >
                Se connecter

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>

            <!-- OUTIL DE DIAGNOSTIC CONSERVÉ -->
            <button
              type="button"
              class="secondary-button"
              :disabled="loading"
              @click="testerInformationsClient"
            >
              Tester les informations du navigateur
            </button>

          </form>

          <div class="login-security">
            <div class="security-lock">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <span>Connexion sécurisée</span>
            <span class="security-separator">•</span>
            <span>Accès réservé</span>
          </div>

          <div class="login-copyright">
            © {{ new Date().getFullYear() }} FOPTRAC
          </div>

        </div>
      </section>

    </section>
  </main>
</template>

<style scoped>
/* =========================================
   PAGE
========================================= */

.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
  box-sizing: border-box;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(37, 99, 235, 0.08),
      transparent 32%
    ),
    #f3f6fb;
}

.login-background-decoration {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.decoration-one {
  width: 380px;
  height: 380px;
  top: -220px;
  right: -100px;
  background: rgba(197, 161, 59, 0.08);
}

.decoration-two {
  width: 300px;
  height: 300px;
  bottom: -190px;
  left: -100px;
  background: rgba(23, 54, 93, 0.06);
}

/* =========================================
   CONTENEUR
========================================= */

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  min-height: 680px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow:
    0 25px 65px rgba(15, 23, 42, 0.10),
    0 5px 18px rgba(15, 23, 42, 0.04);
}

/* =========================================
   PANNEAU INSTITUTIONNEL
========================================= */

.security-panel {
  position: relative;
  display: flex;
  padding: 48px;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(
      145deg,
      #101b2d 0%,
      #17365d 55%,
      #214b7c 100%
    );
}

.security-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.025) 1px,
      transparent 1px
    );
  background-size: 38px 38px;
}

.security-panel::before {
  content: '';
  position: absolute;
  width: 360px;
  height: 360px;
  top: -180px;
  right: -160px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 50%;
  box-shadow:
    0 0 0 35px rgba(255, 255, 255, 0.025),
    0 0 0 70px rgba(255, 255, 255, 0.02);
}

.security-panel::after {
  content: '';
  position: absolute;
  width: 250px;
  height: 250px;
  bottom: -170px;
  left: -100px;
  border-radius: 50%;
  background: rgba(197, 161, 59, 0.10);
}

.security-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* =========================================
   IDENTITÉ FOPTRAC
========================================= */

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-logo {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-information {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-name {
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 2px;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.70);
  font-size: 12px;
  letter-spacing: 0.3px;
}

.mobile-brand {
  display: none;
}

/* =========================================
   CONTENU DE PRÉSENTATION
========================================= */

.security-main {
  margin-top: auto;
  margin-bottom: auto;
  padding: 65px 0;
  max-width: 480px;
}

.security-label {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 23px;
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, 0.20);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d6b34d;
  box-shadow: 0 0 10px rgba(214, 179, 77, 0.65);
}

.security-main h1 {
  margin: 0 0 22px;
  color: #fff;
  font-size: clamp(30px, 3vw, 39px);
  line-height: 1.17;
  font-weight: 750;
  letter-spacing: -0.8px;
}

.security-main h1 span {
  display: block;
  margin-top: 7px;
  color: #e6c86e;
}

.security-description {
  max-width: 460px;
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 14px;
  line-height: 1.8;
}

/* =========================================
   AVANTAGES
========================================= */

.security-items {
  display: flex;
  flex-direction: column;
  gap: 21px;
  margin-top: 35px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(230, 200, 110, 0.35);
  border-radius: 11px;
  background: rgba(230, 200, 110, 0.12);
  color: #e6c86e;
  font-size: 15px;
  font-weight: 800;
}

.security-item strong {
  display: block;
  margin-bottom: 4px;
  color: #fff;
  font-size: 13px;
  font-weight: 650;
}

.security-item span {
  color: rgba(255, 255, 255, 0.64);
  font-size: 11px;
  line-height: 1.5;
}

/* =========================================
   PIED DU PANNEAU
========================================= */

.security-footer {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: auto;
}

.footer-line {
  width: 3px;
  min-height: 35px;
  flex-shrink: 0;
  border-radius: 3px;
  background: #c5a13b;
}

.security-footer p {
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 11px;
  line-height: 1.7;
}

/* =========================================
   PANNEAU CONNEXION
========================================= */

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 55px 48px;
  background: #fff;
}

.login-card {
  width: 100%;
  max-width: 370px;
}

/* =========================================
   EN-TÊTE CONNEXION
========================================= */

.login-header {
  margin-bottom: 35px;
}

.login-icon {
  width: 51px;
  height: 51px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 23px;
  border: 1px solid #e1eaf5;
  border-radius: 14px;
  background: #f0f5fb;
  color: #17365d;
}

.login-icon svg {
  width: 25px;
  height: 25px;
}

.welcome-label {
  display: block;
  margin-bottom: 9px;
  color: #a18432;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.3px;
}

.login-header h2 {
  margin: 0 0 9px;
  color: #172033;
  font-size: 31px;
  font-weight: 750;
  letter-spacing: -0.7px;
}

.login-header p {
  margin: 0;
  color: #718096;
  font-size: 13px;
  line-height: 1.7;
}

/* =========================================
   FORMULAIRE
========================================= */

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group label {
  color: #344054;
  font-size: 12px;
  font-weight: 650;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 19px;
  height: 19px;
  color: #8290a3;
  pointer-events: none;
}

.form-group input {
  width: 100%;
  height: 49px;
  box-sizing: border-box;
  padding: 0 45px;
  border: 1px solid #dce3ec;
  border-radius: 10px;
  outline: none;
  color: #172033;
  background: #fff;
  font-family: inherit;
  font-size: 13px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-group input::placeholder {
  color: #a0aaba;
}

.form-group input:focus {
  border-color: #214b7c;
  box-shadow: 0 0 0 3px rgba(33, 75, 124, 0.10);
}

.form-group input:disabled {
  background: #f4f6f9;
  cursor: not-allowed;
}

/* =========================================
   AFFICHAGE MOT DE PASSE
========================================= */

.password-toggle {
  position: absolute;
  right: 8px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #718096;
  cursor: pointer;
  transition: background 0.2s ease;
}

.password-toggle svg {
  width: 19px;
  height: 19px;
}

.password-toggle:hover:not(:disabled) {
  background: #f0f4f8;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* =========================================
   ERREURS
========================================= */

.login-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 13px;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #fff5f5;
  color: #b42318;
  font-size: 12px;
  line-height: 1.6;
}

.login-error svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* =========================================
   BOUTON PRINCIPAL
========================================= */

.login-button {
  width: 100%;
  min-height: 49px;
  padding: 13px 17px;
  border: 1px solid #17365d;
  border-radius: 10px;
  background: linear-gradient(110deg, #17365d, #214b7c);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(23, 54, 93, 0.14);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(23, 54, 93, 0.20);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
}

.button-content svg {
  width: 18px;
  height: 18px;
}

/* =========================================
   BOUTON SECONDAIRE
========================================= */

.secondary-button {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e4e9f0;
  border-radius: 8px;
  background: #fff;
  color: #718096;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.secondary-button:hover:not(:disabled) {
  background: #f5f7fa;
}

.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* =========================================
   CHARGEMENT
========================================= */

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================
   SÉCURITÉ ET COPYRIGHT
========================================= */

.login-security {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 27px;
  color: #8491a3;
  font-size: 10px;
}

.security-lock {
  display: flex;
  align-items: center;
  color: #27845a;
}

.security-lock svg {
  width: 15px;
  height: 15px;
}

.security-separator {
  color: #cbd5e1;
}

.login-copyright {
  margin-top: 17px;
  color: #b0bac7;
  font-size: 10px;
  text-align: center;
}

/* =========================================
   RESPONSIVE TABLETTE
========================================= */

@media (max-width: 900px) {
  .login-container {
    max-width: 570px;
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .security-panel {
    min-height: 420px;
    padding: 38px;
  }

  .security-main {
    padding: 50px 0 35px;
  }

  .security-main h1 {
    font-size: 32px;
  }

  .security-items {
    gap: 16px;
    margin-top: 25px;
  }

  .login-panel {
    padding: 45px 40px;
  }

  .security-footer {
    margin-top: 10px;
  }
}

/* =========================================
   RESPONSIVE MOBILE
========================================= */

@media (max-width: 520px) {
  .login-page {
    min-height: 100vh;
    padding: 14px;
  }

  .login-container {
    border-radius: 15px;
  }

  .security-panel {
    min-height: auto;
    padding: 25px 23px;
  }

  .brand-logo {
    width: 49px;
    height: 49px;
  }

  .brand-name {
    font-size: 19px;
  }

  .security-main {
    padding: 36px 0 25px;
  }

  .security-main h1 {
    font-size: 27px;
  }

  .security-description {
    font-size: 12px;
  }

  .security-items {
    gap: 14px;
    margin-top: 22px;
  }

  .security-item strong {
    font-size: 12px;
  }

  .security-item span {
    font-size: 10px;
  }

  .security-footer {
    margin-top: 5px;
  }

  .login-panel {
    padding: 32px 23px;
  }

  .login-header {
    margin-bottom: 27px;
  }

  .login-header h2 {
    font-size: 27px;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 25px;
    color: #17365d;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .mobile-brand img {
    width: 35px;
    height: 35px;
    object-fit: contain;
  }
}

/* =========================================
   ACCESSIBILITÉ
========================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

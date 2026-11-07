
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { authApi } from '../api/auth.api';
import { getApiErrorMessage } from '../api/api-error';

import type { Utilisateur } from './auth.types';

const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const useAuthStore = defineStore('auth', () => {
  // ============================================================
  // STATE
  // ============================================================

  const user = ref<Utilisateur | null>(null);
  const accessToken = ref<string | null>(null);

  const loading = ref(false);
  const initialized = ref(false);
  const error = ref<string | null>(null);

  // ============================================================
  // COMPUTED
  // ============================================================

  const isAuthenticated = computed(
    () => !!accessToken.value && !!user.value,
  );

  const role = computed(() => user.value?.role ?? null);
  const userId = computed(() => user.value?.id ?? null);
  const gareId = computed(() => user.value?.gareId ?? null);

  // ============================================================
  // INITIALISATION DE L'AUTHENTIFICATION
  // ============================================================

  function initialize(): boolean {
    if (initialized.value) {
      return isAuthenticated.value;
    }

    return restoreSession();
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login({
        username,
        password,
      });

      accessToken.value = response.accessToken;
      user.value = response.user;

      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        response.accessToken,
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.user),
      );

      initialized.value = true;

      return response;
    } catch (err: unknown) {
      clearLocalSession();

      error.value = getApiErrorMessage(err);

      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ============================================================
  // RESTORE SESSION
  // ============================================================

  function restoreSession(): boolean {
    const storedToken = localStorage.getItem(
      ACCESS_TOKEN_KEY,
    );

    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken || !storedUser) {
      clearLocalSession();
      return false;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as Utilisateur;

      accessToken.value = storedToken;
      user.value = parsedUser;
      initialized.value = true;

      return isAuthenticated.value;
    } catch {
      clearLocalSession();
      return false;
    }
  }

  // ============================================================
  // CLEAR LOCAL SESSION
  // ============================================================

  function clearLocalSession(): void {
    user.value = null;
    accessToken.value = null;
    error.value = null;
    initialized.value = true;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  async function logout(): Promise<void> {
    error.value = null;

    try {
      // Le backend récupère le refresh token
      // depuis le cookie HttpOnly et le révoque.
      await authApi.logout();
    } catch (err: unknown) {
      // La session locale sera supprimée même
      // si l'appel au backend échoue.
      error.value = getApiErrorMessage(err);
    } finally {
      clearLocalSession();
    }
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    user,
    accessToken,
    loading,
    initialized,
    error,

    isAuthenticated,
    role,
    userId,
    gareId,

    initialize,
    login,
    restoreSession,
    clearLocalSession,
    logout,
  };
});

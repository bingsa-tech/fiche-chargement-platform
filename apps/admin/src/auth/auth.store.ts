import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { authApi } from '../api/auth.api';
import { getApiErrorMessage } from '../api/api-error';

import type { Utilisateur } from './auth.types';

const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Utilisateur | null>(null);
  const accessToken = ref<string | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  // ===========================================================================
  // COMPUTED
  // ===========================================================================

  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value;
  });

  const role = computed(() => {
    return user.value?.role ?? null;
  });

  const userId = computed(() => {
    return user.value?.id ?? null;
  });

  const gareId = computed(() => {
    return user.value?.gareId ?? null;
  });

  // ===========================================================================
  // LOGIN
  // ===========================================================================

  async function login(
    username: string,
    password: string,
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login({
        username,
        password,
      });

      accessToken.value =
        response.accessToken;

      user.value = response.user;

      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        response.accessToken,
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.user),
      );

      return response;
    } catch (err: unknown) {
      user.value = null;
      accessToken.value = null;

      localStorage.removeItem(
        ACCESS_TOKEN_KEY,
      );

      localStorage.removeItem(USER_KEY);

      error.value =
        getApiErrorMessage(err);

      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ===========================================================================
  // RESTORE SESSION
  // ===========================================================================

  function restoreSession(): boolean {
    const storedToken =
      localStorage.getItem(
        ACCESS_TOKEN_KEY,
      );

    const storedUser =
      localStorage.getItem(USER_KEY);

    if (!storedToken || !storedUser) {
      return false;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser) as Utilisateur;

      accessToken.value = storedToken;
      user.value = parsedUser;

      return true;
    } catch {
      logout();

      return false;
    }
  }

  // ===========================================================================
  // LOGOUT
  // ===========================================================================

  function logout() {
    user.value = null;
    accessToken.value = null;
    error.value = null;

    localStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );

    localStorage.removeItem(USER_KEY);
  }

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    user,
    accessToken,
    loading,
    error,

    isAuthenticated,
    role,
    userId,
    gareId,

    login,
    restoreSession,
    logout,
  };
});


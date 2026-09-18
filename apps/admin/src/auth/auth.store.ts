import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { authApi } from '../api/auth.api';
import type { Utilisateur } from './auth.types';

const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Utilisateur | null>(null);
  const accessToken = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

      return response;
    } catch (err: any) {
      user.value = null;
      accessToken.value = null;

      error.value =
        err?.response?.data?.message ??
        'Échec de la connexion.';

      throw err;
    } finally {
      loading.value = false;
    }
  }

  function restoreSession() {
    const storedToken =
      localStorage.getItem(ACCESS_TOKEN_KEY);

    const storedUser =
      localStorage.getItem(USER_KEY);

    if (!storedToken || !storedUser) {
      return false;
    }

    try {
      accessToken.value = storedToken;
      user.value = JSON.parse(storedUser) as Utilisateur;

      return true;
    } catch {
      logout();
      return false;
    }
  }

  function logout() {
    user.value = null;
    accessToken.value = null;
    error.value = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

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
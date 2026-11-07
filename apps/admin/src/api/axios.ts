
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { useLoadingStore } from '../stores/loading.store';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:8085';

const ACCESS_TOKEN_KEY = 'access_token';

type TrackedRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _loadingTracked?: boolean;
  _skipGlobalLoading?: boolean;
};

/**
 * Client Axios principal.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

/**
 * Client séparé pour le renouvellement du token.
 * Il ne passe pas par les intercepteurs du client principal.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

/**
 * Gestion du chargement global.
 *
 * Chaque requête ne démarre le chargement qu'une seule fois,
 * même lorsqu'elle est rejouée après un refresh JWT.
 */
function shouldSkipGlobalLoading(
  config: TrackedRequestConfig,
): boolean {
  const url = config.url ?? '';

  const excludedEndpoints = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/presence/heartbeat',
  ];

  return (
    config._skipGlobalLoading === true ||
    excludedEndpoints.some((endpoint) =>
      url.includes(endpoint),
    )
  );
}

function startRequestLoading(
  config: TrackedRequestConfig,
): void {
  if (shouldSkipGlobalLoading(config)) {
    return;
  }

  if (config._loadingTracked) {
    return;
  }

  config._loadingTracked = true;

  useLoadingStore().startLoading(
    'Communication avec le serveur...',
  );
}

/**
 * Termine le chargement d'une requête.
 * Le contrôle évite de décrémenter plusieurs fois le compteur.
 */
function stopRequestLoading(
  config?: TrackedRequestConfig,
): void {
  if (!config?._loadingTracked) {
    return;
  }

  config._loadingTracked = false;

  useLoadingStore().stopLoading();
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveAccessToken(accessToken: string): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );
}

function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Réveille les requêtes qui attendaient le refresh.
 */
function processQueue(
  error: unknown,
  token: string | null = null,
): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
}

/**
 * REQUEST INTERCEPTOR
 *
 * 1. Démarre le chargement global.
 * 2. Ajoute le JWT si disponible.
 */
api.interceptors.request.use(
  (config) => {
    const trackedConfig =
      config as TrackedRequestConfig;

    startRequestLoading(trackedConfig);

    const accessToken = getAccessToken();

    if (accessToken) {
      trackedConfig.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return trackedConfig;
  },

  (error: AxiosError) => {
    const config =
      error.config as TrackedRequestConfig | undefined;

    stopRequestLoading(config);

    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => {
    stopRequestLoading(
      response.config as TrackedRequestConfig,
    );

    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as TrackedRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Les erreurs autres que 401
     * terminent immédiatement le chargement.
     */
    if (error.response?.status !== 401) {
      stopRequestLoading(originalRequest);

      return Promise.reject(error);
    }

    /**
     * Ne jamais rafraîchir le endpoint de refresh lui-même.
     */
    if (
      originalRequest.url?.includes('/api/auth/refresh')
    ) {
      clearAccessToken();
      stopRequestLoading(originalRequest);

      return Promise.reject(error);
    }

    /**
     * Empêche une boucle infinie.
     */
    if (originalRequest._retry) {
      clearAccessToken();
      stopRequestLoading(originalRequest);

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * Un refresh est déjà en cours :
     * cette requête attend le nouveau token.
     *
     * Le chargement reste actif pendant l'attente.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            resolve(api(originalRequest));
          },

          reject: (queueError: unknown) => {
            stopRequestLoading(originalRequest);
            reject(queueError);
          },
        });
      });
    }

    /**
     * Cette requête lance le refresh.
     */
    isRefreshing = true;

    try {
      const response = await refreshClient.post(
        '/api/auth/refresh',
      );

      const newAccessToken =
        response.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          'Aucun access token retourné par /api/auth/refresh.',
        );
      }

      /**
       * Enregistre le nouveau token.
       */
      saveAccessToken(newAccessToken);

      /**
       * Réveille les requêtes en attente.
       */
      processQueue(null, newAccessToken);

      /**
       * Met à jour la requête initiale.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      /**
       * Rejoue la requête initiale.
       *
       * Le compteur de chargement n'est pas
       * incrémenté une deuxième fois.
       */
      return api(originalRequest);

    } catch (refreshError) {
      /**
       * Le refresh a échoué.
       */
      processQueue(refreshError, null);

      clearAccessToken();

      stopRequestLoading(originalRequest);

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

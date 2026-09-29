import axios, {
  AxiosError,
} from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:8085';

const ACCESS_TOKEN_KEY =
  'access_token';

/**
 * Client Axios principal.
 *
 * withCredentials = true permet au navigateur
 * d'envoyer le cookie HttpOnly refresh_token.
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
 * Client séparé utilisé uniquement
 * pour /api/auth/refresh.
 *
 * Cela évite que le refresh lui-même
 * déclenche notre intercepteur 401.
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

/**
 * Requêtes qui attendent un refresh
 * déjà en cours.
 */
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;

let failedQueue: FailedRequest[] = [];

/**
 * Récupère l'access token depuis localStorage.
 */
function getAccessToken(): string | null {
  return localStorage.getItem(
    ACCESS_TOKEN_KEY,
  );
}

/**
 * Enregistre le nouvel access token.
 */
function saveAccessToken(
  accessToken: string,
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );
}

/**
 * Supprime l'access token.
 */
function clearAccessToken(): void {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );
}

/**
 * Réveille toutes les requêtes qui
 * attendaient le refresh.
 */
function processQueue(
  error: unknown,
  token: string | null = null,
): void {
  failedQueue.forEach(
    ({
      resolve,
      reject,
    }) => {
      if (error) {
        reject(error);
        return;
      }

      if (token) {
        resolve(token);
      }
    },
  );

  failedQueue = [];
}

/**
 * REQUEST INTERCEPTOR
 *
 * Ajoute automatiquement :
 *
 * Authorization: Bearer <accessToken>
 */
api.interceptors.request.use(
  (config) => {
    const accessToken =
      getAccessToken();

    if (accessToken) {
      config.headers =
        config.headers ?? {};

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 *
 * Si une requête retourne 401 :
 *
 * 1. appel /api/auth/refresh
 * 2. récupération du nouveau accessToken
 * 3. sauvegarde du token
 * 4. nouvelle tentative de la requête initiale
 */
api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError,
  ) => {
    const originalRequest =
      error.config as
        | typeof error.config & {
            _retry?: boolean;
          }
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Seules les erreurs 401
     * déclenchent le refresh.
     */
    if (
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    /**
     * Ne jamais essayer de rafraîchir
     * l'endpoint de refresh lui-même.
     */
    if (
      originalRequest.url ===
      '/api/auth/refresh'
    ) {
      clearAccessToken();

      return Promise.reject(error);
    }

    /**
     * Empêche une boucle infinie.
     */
    if (originalRequest._retry) {
      clearAccessToken();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /**
     * Un refresh est déjà en cours.
     *
     * Cette requête attend le nouveau token.
     */
    if (isRefreshing) {
      return new Promise(
        (
          resolve,
          reject,
        ) => {
          failedQueue.push({
            resolve: (
              token: string,
            ) => {
              originalRequest.headers =
                originalRequest.headers ??
                {};

              originalRequest.headers.Authorization =
                `Bearer ${token}`;

              resolve(
                api(originalRequest),
              );
            },

            reject,
          });
        },
      );
    }

    /**
     * Cette requête lance le refresh.
     */
    isRefreshing = true;

    try {
      const response =
        await refreshClient.post(
          '/api/auth/refresh',
        );

      const newAccessToken =
        response.data
          ?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          'Aucun access token retourné par /api/auth/refresh.',
        );
      }

      /**
       * Sauvegarde du nouveau token.
       */
      saveAccessToken(
        newAccessToken,
      );

      /**
       * Réveille les requêtes
       * qui attendaient le refresh.
       */
      processQueue(
        null,
        newAccessToken,
      );

      /**
       * Met à jour le Authorization
       * de la requête originale.
       */
      originalRequest.headers =
        originalRequest.headers ??
        {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      /**
       * Rejoue la requête originale.
       */
      return api(originalRequest);
    } catch (refreshError) {
      /**
       * Le refresh a échoué.
       */
      processQueue(
        refreshError,
        null,
      );

      clearAccessToken();

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
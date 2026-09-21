import axios from 'axios';

import { normalizeApiError } from './api-error';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    'http://localhost:8085',

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  timeout: 10000,
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem('access_token');

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      normalizeApiError(error),
    );
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
   
    return Promise.reject(
      normalizeApiError(error),
    );
  },
);

export default api;


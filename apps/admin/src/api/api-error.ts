import axios from 'axios';

/**
 * Erreur applicative normalisée provenant de l'API.
 */
export class ApiError extends Error {
  status: number | null;
  code: string | null;
  details: unknown;

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    details: unknown = null,
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Transforme une erreur Axios ou JavaScript
 * en erreur applicative normalisée.
 */
export function normalizeApiError(error: unknown): ApiError {
  // ---------------------------------------------------------------------------
  // Erreur Axios avec réponse du backend
  // ---------------------------------------------------------------------------

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const data = error.response?.data;

    let message = 'Une erreur est survenue.';
    let code: string | null = null;

    if (typeof data?.message === 'string') {
      message = data.message;
    } else if (Array.isArray(data?.message)) {
      message = data.message.join(', ');
    } else if (error.code === 'ECONNABORTED') {
      message = 'La requête a expiré.';
    } else if (!error.response) {
      message = 'Impossible de communiquer avec le serveur.';
    } else {
      switch (status) {
        case 400:
          message = 'Requête invalide.';
          break;

        case 401:
          message = 'Authentification requise.';
          break;

        case 403:
          message = 'Accès refusé.';
          break;

        case 404:
          message = 'Ressource introuvable.';
          break;

        case 409:
          message = 'Conflit avec les données existantes.';
          break;

        case 422:
          message = 'Les données fournies sont invalides.';
          break;

        case 500:
          message = 'Erreur interne du serveur.';
          break;

        default:
          message = 'Une erreur est survenue lors de la requête.';
      }
    }

    if (typeof data?.error === 'string') {
      code = data.error;
    }

    return new ApiError(
      message,
      status,
      code,
      data,
    );
  }

  // ---------------------------------------------------------------------------
  // Erreur JavaScript classique
  // ---------------------------------------------------------------------------

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  // ---------------------------------------------------------------------------
  // Erreur inconnue
  // ---------------------------------------------------------------------------

  return new ApiError('Une erreur inconnue est survenue.');
}

/**
 * Retourne un message exploitable pour l'interface utilisateur.
 */
export function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}


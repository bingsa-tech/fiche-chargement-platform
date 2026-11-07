
import api from './axios';
import type { InternalAxiosRequestConfig } from 'axios';

type TrackedPresenceRequestConfig =
  InternalAxiosRequestConfig & {
    _skipGlobalLoading?: boolean;
  }
// ============================================================
// TYPES
// ============================================================

export interface PresenceSession {
  sessionId: string;
  utilisateurId: number;
  username: string;
  nom: string | null;
  prenom: string | null;
  role: string | null;

  gare: {
    id: string;
    code: string;
    nom: string;
    ville: string | null;
  } | null;

  deviceType: 'WEB' | 'MOBILE';
  deviceName: string | null;
  connectedAt: string;
  lastSeenAt: string;
}

export interface OnlinePresenceResponse {
  total: number;
  sessions: PresenceSession[];
}

export interface HeartbeatResponse {
  message?: string;
  lastSeenAt: string;
}

// ============================================================
// API PRÉSENCE
// ============================================================

export const presenceApi = {
  /**
   * Envoie un heartbeat pour maintenir la session active.
   * Aucun overlay global pour cette opération automatique.
   */
  async heartbeat(): Promise<HeartbeatResponse> {
    const response = await api.post<HeartbeatResponse>(
      '/api/presence/heartbeat',
    );

    return response.data;
  },

  /**
   * Récupère la liste des utilisateurs en ligne.
   * trackLoading = false pour les actualisations automatiques.
   */
  async getOnline(
    trackLoading = true,
  ): Promise<OnlinePresenceResponse> {
    const response = await api.get<OnlinePresenceResponse>(
      '/api/presence/online',
      {
        _skipGlobalLoading: !trackLoading,
      } as TrackedPresenceRequestConfig,
    );

    return response.data;
  },
};
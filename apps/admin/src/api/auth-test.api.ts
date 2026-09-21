
import api from './axios';

export interface PermissionTestResponse {
  message: string;
  resource: string;
  action: string;
}

export const authTestApi = {
  async testFicheCreate(): Promise<PermissionTestResponse> {
    const response =
      await api.get<PermissionTestResponse>(
        '/api/test-permissions/fiche-create',
      );

    return response.data;
  },

  async testFicheDelete(): Promise<PermissionTestResponse> {
    const response =
      await api.get<PermissionTestResponse>(
        '/api/test-permissions/fiche-delete',
      );

    return response.data;
  },

  async testVehiculeUpdate(): Promise<PermissionTestResponse> {
    const response =
      await api.get<PermissionTestResponse>(
        '/api/test-permissions/vehicule-update',
      );

    return response.data;
  },
};


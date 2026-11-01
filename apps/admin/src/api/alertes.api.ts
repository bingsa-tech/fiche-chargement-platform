
import api from './axios';
import type { Alerte } from '../features/alertes/types/alerte.types';

const BASE_URL = 'api/alertes';

export const alertesApi = {
  async findAll(): Promise<Alerte[]> {
    const response = await api.get<Alerte[]>(BASE_URL);
    return response.data;
  },

  async findOne(id: string): Promise<Alerte> {
    const response = await api.get<Alerte>(
      `${BASE_URL}/${encodeURIComponent(id)}`,
    );
    return response.data;
  },

  async marquerCommeLue(id: string): Promise<Alerte> {
    const response = await api.patch<Alerte>(
      `${BASE_URL}/${encodeURIComponent(id)}/lue`,
    );
    return response.data;
  },
};

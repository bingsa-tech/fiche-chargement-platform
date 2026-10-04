import api from './axios';

import type { Role } from '../types/role.types';

/**
 * Récupère tous les rôles.
 */
export async function getRoles(): Promise<Role[]> {
  const response = await api.get<Role[]>('/roles');

  return response.data;
}
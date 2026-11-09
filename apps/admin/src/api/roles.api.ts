import api from './axios';
import type { Role } from '../types/role.types';

export async function getRoles(): Promise<Role[]> {
  const response = await api.get<Role[]>('/api/roles/');
  return response.data;
}
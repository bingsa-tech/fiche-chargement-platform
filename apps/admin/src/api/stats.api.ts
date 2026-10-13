import api from './axios';
import type { DashboardStats } from '../types/stats.types';

/**
 * Récupère les indicateurs statistiques du tableau de bord.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/api/dashboard-stats');
  return response.data;
}
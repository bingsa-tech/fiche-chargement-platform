
import api from './axios';
import type { Destination } from '../types/destination.types';

export async function getDestinations(): Promise<Destination[]> {
  const response = await api.get<Destination[]>('/api/destinations');
  return response.data;
}

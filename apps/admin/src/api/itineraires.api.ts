
import api from './axios';
import type { Itineraire } from '../types/itineraire.types';

export async function getItineraires(): Promise<Itineraire[]> {
  const response = await api.get<Itineraire[]>('/api/itineraires');
  return response.data;
}

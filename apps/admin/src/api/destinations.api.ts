import api from './axios';
import type { Destination, CreateDestinationPayload, UpdateDestinationPayload } from '../types/destinations.type';

const RESOURCE = '/api/destinations';

export const getDestinations = async (): Promise<Destination[]> => {
  const { data } = await api.get<Destination[]>(RESOURCE);
  return data;
};

export const getDestination = async (id: string): Promise<Destination> => {
  const { data } = await api.get<Destination>(`${RESOURCE}/${id}`);
  return data;
};

export const createDestination = async (payload: CreateDestinationPayload): Promise<Destination> => {
  const { data } = await api.post<Destination>(RESOURCE, payload);
  return data;
};

export const updateDestination = async (id: string, payload: UpdateDestinationPayload): Promise<Destination> => {
  const { data } = await api.patch<Destination>(`${RESOURCE}/${id}`, payload);
  return data;
};

export const deleteDestination = async (id: string): Promise<void> => {
  await api.delete(`${RESOURCE}/${id}`);
};

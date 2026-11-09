import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue';
import type { Itineraire, CreateItinerairePayload, UpdateItinerairePayload } from '../types/itineraire.types';
import { getItineraires, createItineraire, updateItineraire, deleteItineraire } from '../api/itineraires.api';

export const useItineraireStore = defineStore('itineraires', () => {
  const itineraires = vueRef<Itineraire[]>([]);
  const loading = vueRef(false);
  const error = vueRef<string | null>(null);

  async function fetchItineraires() {
    loading.value = true;
    error.value = null;
    try {
      itineraires.value = await getItineraires();
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Impossible de charger les itinéraires.';
    } finally {
      loading.value = false;
    }
  }

  async function addItineraire(payload: CreateItinerairePayload) {
    const newItem = await createItineraire(payload);
    itineraires.value.push(newItem);
    return newItem;
  }

  async function editItineraire(id: string, payload: UpdateItinerairePayload) {
    const updatedItem = await updateItineraire(id, payload);
    const index = itineraires.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      itineraires.value[index] = updatedItem;
    }
    return updatedItem;
  }

  async function removeItineraire(id: string) {
    await deleteItineraire(id);
    itineraires.value = itineraires.value.filter((i) => i.id !== id);
  }

  return {
    itineraires,
    loading,
    error,
    fetchItineraires,
    addItineraire,
    editItineraire,
    removeItineraire,
  };
});
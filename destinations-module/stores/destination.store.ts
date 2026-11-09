import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as destinationsApi from '../api/destinations.api';
import type { Destination, CreateDestinationPayload, UpdateDestinationPayload } from '../types/destination.types';

function messageFrom(error: unknown, fallback: string): string {
  const e = error as { response?: { data?: { message?: string | string[] } }; message?: string };
  const message = e?.response?.data?.message ?? e?.message;
  return Array.isArray(message) ? message.join(', ') : (message || fallback);
}

export const useDestinationStore = defineStore('destinations', () => {
  const destinations = ref<Destination[]>([]);
  const selectedDestination = ref<Destination | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const deletingId = ref<string | null>(null);
  const error = ref<string | null>(null);

  async function fetchDestinations() {
    loading.value = true; error.value = null;
    try { destinations.value = await destinationsApi.getDestinations(); }
    catch (e) { error.value = messageFrom(e, 'Impossible de charger les destinations.'); throw e; }
    finally { loading.value = false; }
  }

  async function fetchDestination(id: string) {
    loading.value = true; error.value = null;
    try { selectedDestination.value = await destinationsApi.getDestination(id); return selectedDestination.value; }
    catch (e) { error.value = messageFrom(e, 'Destination introuvable.'); throw e; }
    finally { loading.value = false; }
  }

  async function addDestination(payload: CreateDestinationPayload) {
    saving.value = true; error.value = null;
    try { const created = await destinationsApi.createDestination(payload); destinations.value.unshift(created); return created; }
    catch (e) { error.value = messageFrom(e, 'Échec de la création de la destination.'); throw e; }
    finally { saving.value = false; }
  }

  async function editDestination(id: string, payload: UpdateDestinationPayload) {
    saving.value = true; error.value = null;
    try {
      const updated = await destinationsApi.updateDestination(id, payload);
      const index = destinations.value.findIndex(item => item.id === id);
      if (index !== -1) destinations.value[index] = updated;
      if (selectedDestination.value?.id === id) selectedDestination.value = updated;
      return updated;
    } catch (e) { error.value = messageFrom(e, 'Échec de la mise à jour.'); throw e; }
    finally { saving.value = false; }
  }

  async function removeDestination(id: string) {
    deletingId.value = id; error.value = null;
    try {
      await destinationsApi.deleteDestination(id);
      destinations.value = destinations.value.filter(item => item.id !== id);
      if (selectedDestination.value?.id === id) selectedDestination.value = null;
    } catch (e) { error.value = messageFrom(e, 'Suppression impossible. Vérifiez si cette destination est utilisée par une fiche ou un itinéraire.'); throw e; }
    finally { deletingId.value = null; }
  }

  return { destinations, selectedDestination, loading, saving, deletingId, error, fetchDestinations, fetchDestination, addDestination, editDestination, removeDestination };
});

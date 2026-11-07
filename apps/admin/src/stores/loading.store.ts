
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const MIN_VISIBLE_DURATION = 700;

export const useLoadingStore = defineStore('loading', () => {
  const pendingRequests = ref(0);
  const message = ref('Chargement en cours...');
  const visible = ref(false);

  let visibleSince: number | null = null;

  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const isLoading = computed(() => visible.value);

  function clearHideTimer(): void {
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function startLoading(customMessage?: string): void {
    clearHideTimer();

    if (customMessage) {
      message.value = customMessage;
    }

    pendingRequests.value++;

    if (!visible.value) {
      visible.value = true;
      visibleSince = Date.now();
    }
  }

  function stopLoading(): void {
    pendingRequests.value = Math.max(
      0,
      pendingRequests.value - 1,
    );

    // D'autres requêtes sont toujours en cours.
    if (pendingRequests.value > 0) {
      return;
    }

    // Durée minimale d'affichage.
    const elapsed = visibleSince !== null
      ? Date.now() - visibleSince
      : MIN_VISIBLE_DURATION;

    const remaining = Math.max(
      0,
      MIN_VISIBLE_DURATION - elapsed,
    );

    clearHideTimer();

    hideTimer = setTimeout(() => {
      if (pendingRequests.value === 0) {
        visible.value = false;
        visibleSince = null;
        message.value = 'Chargement en cours...';
      }

      hideTimer = null;
    }, remaining);
  }

  function resetLoading(): void {
    clearHideTimer();

    pendingRequests.value = 0;
    visible.value = false;
    visibleSince = null;
    message.value = 'Chargement en cours...';
  }

  return {
    pendingRequests,
    message,
    isLoading,
    startLoading,
    stopLoading,
    resetLoading,
  };
});

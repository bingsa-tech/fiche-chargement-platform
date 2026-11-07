
<script setup lang="ts">
import AppLoading from './AppLoading.vue';

withDefaults(
  defineProps<{
    visible: boolean;
    message?: string;
  }>(),
  {
    message: 'Chargement en cours...',
  },
);
</script>

<template>
  <Transition name="loading-fade">
    <div
      v-if="visible"
      class="loading-overlay"
      role="status"
      aria-live="polite"
    >
      <AppLoading :message="message" />
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background: rgba(7, 18, 37, 0.96);
  backdrop-filter: blur(6px);
}

.loading-fade-enter-active {
  transition: opacity 0.25s ease;
}

.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: none;
  }
}
</style>

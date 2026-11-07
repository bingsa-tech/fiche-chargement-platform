
<script setup lang="ts">
import { RouterView } from 'vue-router';
import LoadingOverlay from './components/loading/LoadingOverlay.vue';
import { useLoadingStore } from './stores/loading.store';

const loadingStore = useLoadingStore();
</script>

<template>
  <div class="app-root">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page-fade" mode="out-in">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </Transition>
    </RouterView>

    <LoadingOverlay
      :visible="loadingStore.isLoading"
      :message="loadingStore.message"
    />
  </div>
</template>

<style>
.app-root {
  position: relative;
  min-height: 100vh;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

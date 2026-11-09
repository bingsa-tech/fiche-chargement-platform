<script setup lang="ts">
import type { DestinationStatut } from '../../types/destination.types';
defineProps<{ statut: DestinationStatut }>();
</script>
<template>
  <span class="status" :class="statut === 'ACTIF' ? 'active' : 'inactive'">{{ statut === 'ACTIF' ? 'Actif' : 'Inactif' }}</span>
</template>
<style scoped>
.status{display:inline-flex;padding:4px 10px;border-radius:999px;font-size:.78rem;font-weight:700}.active{background:#e7f6ed;color:#187044}.inactive{background:#f1f2f4;color:#596273}
</style>

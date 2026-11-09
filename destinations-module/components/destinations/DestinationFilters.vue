<script setup lang="ts">
import type { DestinationStatut } from '../../types/destination.types';
defineProps<{ search: string; statut: 'TOUS' | DestinationStatut }>();
defineEmits<{ 'update:search': [value:string]; 'update:statut': [value:'TOUS' | DestinationStatut] }>();
</script>
<template><div class="filters"><input :value="search" placeholder="Rechercher code, nom, ville ou pays…" @input="$emit('update:search', ($event.target as HTMLInputElement).value)"/><select :value="statut" @change="$emit('update:statut', ($event.target as HTMLSelectElement).value as 'TOUS' | DestinationStatut)"><option value="TOUS">Tous les statuts</option><option value="ACTIF">Actif</option><option value="INACTIF">Inactif</option></select></div></template>
<style scoped>.filters{display:flex;gap:12px;flex-wrap:wrap}.filters input{flex:1;min-width:220px}.filters input,.filters select{border:1px solid #d5dbe5;border-radius:9px;padding:11px 12px;font:inherit;background:white}</style>

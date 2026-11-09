<script setup lang="ts">
import { computed } from 'vue';
import type { Destination } from '../../types/destination.types';
const props=defineProps<{ items: Destination[] }>();
const active=computed(()=>props.items.filter(x=>x.statut==='ACTIF').length);
const inactive=computed(()=>props.items.filter(x=>x.statut==='INACTIF').length);
</script>
<template><div class="stats"><article><span>Total destinations</span><strong>{{ items.length }}</strong></article><article><span>Actives</span><strong>{{ active }}</strong></article><article><span>Inactives</span><strong>{{ inactive }}</strong></article></div></template>
<style scoped>.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.stats article{padding:17px 19px;background:white;border:1px solid #e4e8ef;border-radius:12px;display:grid;gap:8px}.stats span{color:#667085;font-size:.85rem}.stats strong{font-size:1.65rem;color:#17365d}@media(max-width:600px){.stats{grid-template-columns:1fr}}</style>

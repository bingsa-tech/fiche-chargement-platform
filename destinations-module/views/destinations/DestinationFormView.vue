<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDestinationStore } from '../../stores/destination.store';
import DestinationForm from '../../components/destinations/DestinationForm.vue';
import type { CreateDestinationPayload } from '../../types/destination.types';
const route=useRoute();const router=useRouter();const store=useDestinationStore();
const id=computed(()=>String(route.params.id||''));const isEdit=computed(()=>Boolean(id.value));const initial=ref<Awaited<ReturnType<typeof store.fetchDestination>>|null>(null);const pageError=ref('');
onMounted(async()=>{if(isEdit.value){try{initial.value=await store.fetchDestination(id.value)}catch{pageError.value=store.error||'Destination introuvable.'}}});
async function submit(payload:CreateDestinationPayload){pageError.value='';try{if(isEdit.value)await store.editDestination(id.value,payload);else await store.addDestination(payload);await router.push({name:'destinations'})}catch{pageError.value=store.error||'Une erreur est survenue.'}}
</script>
<template><main class="page"><button class="back" @click="router.push({name:'destinations'})">← Retour aux destinations</button><section class="card"><p class="eyebrow">RÉFÉRENTIEL</p><h1>{{ isEdit?'Modifier la destination':'Nouvelle destination' }}</h1><p class="sub">Les champs sont validés par le backend selon le contrat de l’API.</p><p v-if="pageError" class="error">{{ pageError }}</p><p v-if="isEdit&&!initial&&!pageError">Chargement…</p><DestinationForm v-else :initial-value="initial" :submitting="store.saving" @submit="submit" @cancel="router.push({name:'destinations'})"/></section></main></template>
<style scoped>.page{padding:28px;max-width:900px;margin:auto}.back{border:0;background:none;color:#17569a;font-weight:700;cursor:pointer;margin-bottom:18px}.card{background:white;border:1px solid #e4e8ef;border-radius:14px;padding:26px}.eyebrow{color:#b18a2c;font-weight:800;font-size:.72rem;letter-spacing:.12em}.card h1{color:#17365d;margin:0}.sub{color:#667085;margin:8px 0 24px}.error{background:#fff1f0;color:#b42318;padding:12px;border-radius:8px}</style>

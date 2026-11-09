<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';
import { useDestinationStore } from '../../stores/destination.store';
import DestinationStatusBadge from '../../components/destinations/DestinationStatusBadge.vue';
import DestinationFilters from '../../components/destinations/DestinationFilters.vue';
import DestinationStats from '../../components/destinations/DestinationStats.vue';
import type { Destination, DestinationStatut } from '../../types/destination.types';
const store=useDestinationStore(); const router=useRouter(); const auth=useAuthStore();
const search=ref(''); const statut=ref<'TOUS'|DestinationStatut>('TOUS'); const pageError=ref('');
const canManage=computed(()=>auth.role==='ADMIN'||auth.role==='RESPONSABLE_GARE');
const canDelete=computed(()=>auth.role==='ADMIN');
const filtered=computed(()=>store.destinations.filter(d=>{
 const q=search.value.toLocaleLowerCase(); const matches=[d.code,d.nom,d.ville,d.pays].some(v=>v.toLocaleLowerCase().includes(q));
 return matches&&(statut.value==='TOUS'||d.statut===statut.value);
}));
onMounted(async()=>{try{await store.fetchDestinations()}catch{pageError.value=store.error||'Erreur de chargement.'}});
async function remove(item:Destination){if(!window.confirm(`Supprimer définitivement la destination « ${item.nom} » ? Cette opération peut être refusée si elle est liée à une fiche ou un itinéraire.`))return;pageError.value='';try{await store.removeDestination(item.id)}catch{pageError.value=store.error||'Suppression impossible.'}}
</script>
<template>
 <main class="page">
  <header class="heading"><div><p class="eyebrow">RÉFÉRENTIEL</p><h1>Destinations</h1><p class="sub">Gestion des destinations utilisées dans les fiches de chargement et les itinéraires.</p></div><button v-if="canManage" class="primary" @click="router.push({name:'destination-create'})">+ Nouvelle destination</button></header>
  <DestinationStats :items="store.destinations" />
  <p v-if="pageError" class="error">{{ pageError }}</p><p v-if="store.loading" class="info">Chargement des destinations…</p>
  <section class="panel"><DestinationFilters v-model:search="search" v-model:statut="statut"/><div class="table-wrap"><table><thead><tr><th>Code</th><th>Destination</th><th>Ville</th><th>Pays</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
   <tr v-for="item in filtered" :key="item.id"><td class="code">{{ item.code }}</td><td>{{ item.nom }}</td><td>{{ item.ville }}</td><td>{{ item.pays }}</td><td><DestinationStatusBadge :statut="item.statut"/></td><td><div class="row-actions"><button class="link" @click="router.push({name:'destination-detail',params:{id:item.id}})">Voir</button><button v-if="canManage" class="link" @click="router.push({name:'destination-edit',params:{id:item.id}})">Modifier</button><button v-if="canDelete" class="link danger" :disabled="store.deletingId===item.id" @click="remove(item)">Supprimer</button></div></td></tr>
   <tr v-if="!store.loading&&!filtered.length"><td colspan="6" class="empty">Aucune destination ne correspond à votre recherche.</td></tr>
  </tbody></table></div><p class="count">{{ filtered.length }} résultat(s)</p></section>
 </main>
</template>
<style scoped>
.page{padding:28px;display:grid;gap:22px;color:#1d2939}.heading{display:flex;justify-content:space-between;align-items:center;gap:18px}.eyebrow{font-size:.72rem;letter-spacing:.12em;font-weight:800;color:#b18a2c;margin:0 0 6px}.heading h1{margin:0;color:#17365d;font-size:1.8rem}.sub{color:#667085;margin:7px 0 0}.primary{border:0;border-radius:9px;background:#17365d;color:#fff;padding:12px 16px;font-weight:700;cursor:pointer}.panel{background:#fff;border:1px solid #e4e8ef;border-radius:13px;padding:18px;display:grid;gap:18px}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:760px}th,td{text-align:left;padding:13px 12px;border-bottom:1px solid #edf0f4;font-size:.9rem}th{color:#667085;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em}.code{font-weight:700;color:#17365d}.row-actions{display:flex;gap:12px;flex-wrap:wrap}.link{border:0;background:none;color:#17569a;font-weight:700;cursor:pointer;padding:0}.danger{color:#b42318}.empty,.count,.info{color:#667085}.empty{text-align:center;padding:28px}.count{font-size:.82rem;margin:0}.error{background:#fff1f0;color:#b42318;padding:12px;border-radius:8px;margin:0}@media(max-width:650px){.page{padding:16px}.heading{align-items:flex-start;flex-direction:column}}
</style>

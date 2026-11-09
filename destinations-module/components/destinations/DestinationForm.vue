<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Destination, DestinationStatut, CreateDestinationPayload } from '../../types/destination.types';
const props = defineProps<{ initialValue?: Destination | null; submitting?: boolean }>();
const emit = defineEmits<{ submit: [payload: CreateDestinationPayload]; cancel: [] }>();
const form = reactive<CreateDestinationPayload>({ code:'', nom:'', ville:'', pays:'', statut:'ACTIF' });
watch(() => props.initialValue, value => {
  Object.assign(form, value ? { code:value.code, nom:value.nom, ville:value.ville, pays:value.pays, statut:value.statut } : { code:'', nom:'', ville:'', pays:'', statut:'ACTIF' });
}, { immediate:true });
function submit() { emit('submit', { code:form.code.trim(), nom:form.nom.trim(), ville:form.ville.trim(), pays:form.pays.trim(), statut:form.statut }); }
</script>
<template>
  <form class="form" @submit.prevent="submit">
    <div class="grid">
      <label>Code<input v-model.trim="form.code" maxlength="30" required autocomplete="off" placeholder="Ex. DST-001" /></label>
      <label>Nom<input v-model.trim="form.nom" maxlength="150" required /></label>
      <label>Ville<input v-model.trim="form.ville" maxlength="100" required /></label>
      <label>Pays<input v-model.trim="form.pays" maxlength="100" required /></label>
      <label>Statut<select v-model="form.statut"><option value="ACTIF">Actif</option><option value="INACTIF">Inactif</option></select></label>
    </div>
    <div class="actions"><button type="button" class="secondary" @click="emit('cancel')">Annuler</button><button type="submit" :disabled="submitting">{{ submitting ? 'Enregistrement…' : 'Enregistrer' }}</button></div>
  </form>
</template>
<style scoped>
.form{display:grid;gap:24px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}label{display:grid;gap:7px;color:#344054;font-size:.9rem;font-weight:600}input,select{width:100%;box-sizing:border-box;border:1px solid #d5dbe5;border-radius:9px;padding:11px 12px;font:inherit;background:white}.actions{display:flex;justify-content:flex-end;gap:10px}button{border:0;border-radius:8px;padding:11px 18px;background:#17365d;color:white;font-weight:700;cursor:pointer}button.secondary{background:#eef1f5;color:#344054}button:disabled{opacity:.6;cursor:wait}@media(max-width:640px){.grid{grid-template-columns:1fr}}
</style>

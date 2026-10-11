
<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { FichePassagerDetail } from '../api/fiche.api';

interface NouveauPassager {
  nom: string;
  prenom: string;
  numeroCni: string;
  telephone: string;
  numeroPlace: string;
  tarif: string;
  observations: string;
}

const props = withDefaults(
  defineProps<{
    passagers: FichePassagerDetail[];
    chargement?: boolean;
  }>(),
  {
    chargement: false,
  },
);

const emit = defineEmits<{
  ajouter: [passager: NouveauPassager];
}>();

const formulaire = reactive<NouveauPassager>({
  nom: '',
  prenom: '',
  numeroCni: '',
  telephone: '',
  numeroPlace: '',
  tarif: '',
  observations: '',
});

const erreur = reactive({
  formulaire: '',
});

const totalTarifs = computed(() =>
  props.passagers.reduce(
    (total, ligne) => total + Number(ligne.tarif ?? 0),
    0,
  ),
);

function formaterTarif(tarif: number | string | null): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
  }).format(Number(tarif ?? 0));
}



function ajouterPassager() {
  erreur.formulaire = '';

  if (
    !formulaire.nom.trim() ||
    !formulaire.prenom.trim() ||
    !formulaire.numeroCni.trim()
  ) {
    erreur.formulaire =
      'Le nom, le prénom et le numéro CNI sont obligatoires.';
    return;
  }

  if (
    formulaire.telephone.length > 30 ||
    formulaire.observations.length > 1000
  ) {
    erreur.formulaire =
      'Le téléphone ou les observations dépassent la longueur autorisée.';
    return;
  }

  if (
    formulaire.tarif.trim() !== '' &&
    (!Number.isFinite(Number(formulaire.tarif)) ||
      Number(formulaire.tarif) < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(formulaire.tarif.trim()))
  ) {
    erreur.formulaire =
      'Le tarif doit être un montant positif avec au maximum deux décimales.';
    return;
  }

  if (
    formulaire.numeroPlace.trim() !== '' &&
    (!Number.isInteger(Number(formulaire.numeroPlace)) ||
      Number(formulaire.numeroPlace) < 1)
  ) {
    erreur.formulaire =
      'Le numéro de place doit être un entier positif.';
    return;
  }

  emit('ajouter', { ...formulaire });
}


</script>

<template>
  <section class="passagers-section">
    <div class="section-heading">
      <h2>Liste des passagers</h2>
      <span>{{ passagers.length }} passager(s)</span>
    </div>

    <form class="passager-form" @submit.prevent="ajouterPassager">
      <h3>Ajouter un passager</h3>

      <div class="form-grid">
        <label>
          Nom *
          <input v-model.trim="formulaire.nom" required maxlength="100" />
        </label>

        <label>
          Prénom *
          <input
            v-model.trim="formulaire.prenom"
            required
            maxlength="100"
          />
        </label>

        <label>
          Numéro CNI *
          <input
            v-model.trim="formulaire.numeroCni"
            required
            maxlength="50"
          />
        </label>

        <label>
          Téléphone
          <input
            v-model.trim="formulaire.telephone"
            type="tel"
            maxlength="30"
          />
        </label>

        <label>
          Numéro de place
          <input
            v-model="formulaire.numeroPlace"
            type="number"
            min="1"
            step="1"
          />
        </label>

        <label>
          Tarif (FCFA)
          <input
            v-model.trim="formulaire.tarif"
            type="number"
            min="0"
            step="0.01"
          />
        </label>

        <label class="observations-field">
          Observations
          <textarea
            v-model.trim="formulaire.observations"
            maxlength="1000"
            rows="2"
          />
        </label>
      </div>

      <p v-if="erreur.formulaire" class="error-message" role="alert">
        {{ erreur.formulaire }}
      </p>

      <button type="submit" :disabled="chargement">
        {{ chargement ? 'Enregistrement…' : 'Ajouter le passager' }}
      </button>
    </form>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>N° CNI</th>
            <th>Téléphone</th>
            <th>Place</th>
            <th>Tarif (FCFA)</th>
            <th>Observations</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="passagers.length === 0">
            <td colspan="8" class="empty-state">
              Aucun passager enregistré.
            </td>
          </tr>

          <tr
            v-for="(ligne, index) in passagers"
            :key="`${ligne.ficheId}-${ligne.passagerId}`"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ ligne.passager.nom }}</td>
            <td>{{ ligne.passager.prenom }}</td>
            <td>{{ ligne.passager.numeroCni }}</td>
            <td>{{ ligne.passager.telephone || '—' }}</td>
            <td>{{ ligne.numeroPlace ?? '—' }}</td>
            <td>{{ formaterTarif(ligne.tarif) }}</td>
            <td class="observations-cell">
              {{ ligne.observations || '—' }}
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <th colspan="6">Total des tarifs</th>
            <th>{{ formaterTarif(totalTarifs) }}</th>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>

<style scoped>
.passagers-section {
  margin-top: 24px;
  color: #172033;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-heading h2 {
  font-size: 19px;
}

.passager-form {
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.passager-form h3 {
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
}

input,
textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font: inherit;
  font-weight: 400;
}

.observations-field {
  grid-column: 1 / -1;
}

button {
  margin-top: 14px;
  padding: 10px 16px;
  border: 0;
  border-radius: 5px;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #b91c1c;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th,
td {
  padding: 9px;
  border: 1px solid #d1d5db;
  text-align: left;
  vertical-align: top;
}

thead,
tfoot {
  background: #f3f4f6;
}

.observations-cell {
  white-space: pre-wrap;
  min-width: 120px;
}

.empty-state {
  padding: 20px;
  text-align: center;
}

@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media print {
  .passager-form {
    display: none;
  }

  .table-wrapper {
    overflow: visible;
  }

  table {
    font-size: 10px;
  }

  th,
  td {
    padding: 5px;
  }
}
</style>

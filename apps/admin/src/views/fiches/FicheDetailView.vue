<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getApiErrorMessage } from '../../api/api-error';
import { getFiche } from '../../api/fiche.api';
import { createPassager } from '../../api/passagers.api';
import {
  getPassagersFiche,
  associerPassagerAFiche,
} from '../../api/fiche-passager.api';
import type { Fiche } from '../../types/fiche.types';
import type { FichePassagerDetail } from '../../api/fiche-passager.api';
import type { Passager } from '../../api/passagers.api';

const route = useRoute();
const router = useRouter();
const fiche = ref<Fiche | null>(null);
const passagers = ref<FichePassagerDetail[]>([]);
const loading = ref(true);
const saving = ref(false);
const addingPassenger = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const associationWarning = ref('');
const ficheId = computed(() => String(route.params.id ?? ''));

const nouveauPassager = reactive({
  nom: '',
  prenom: '',
  numeroCni: '',
  telephone: '',
  numeroPlace: '',
  tarif: '',
  observations: '',
});

/**
 * Si la création du passager réussit mais que son association échoue,
 * on conserve le passager pour éviter de le créer deux fois.
 */
const passagerEnAttenteAssociation = ref<Passager | null>(null);

const dateCreation = computed(() => {
  if (!fiche.value?.dateCreation) return '—';
  const date = new Date(fiche.value.dateCreation);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('fr-CA');
});

const totalTarifs = computed(() =>
  passagers.value?.reduce(
    (total, item) => total + Number(item.tarif ?? 0),
    0,
  ),
);

function formaterTarif(tarif: string | number | null | undefined): string {
  if (tarif === null || tarif === undefined || tarif === '') {
    return '—';
  }
  const valeur = Number(tarif);
  if (!Number.isFinite(valeur)) return '—';
  return valeur.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

async function chargerFiche() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const id = ficheId.value;
    if (!id) {
      throw new Error('Identifiant de fiche manquant.');
    }
    const [ficheChargee, passagersCharges] = await Promise.all([
      getFiche(id),
      getPassagersFiche(id),
    ]);
    fiche.value = ficheChargee;
    passagers.value = passagersCharges;
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function ouvrirSaisiePassager() {
  errorMessage.value = '';
  successMessage.value = '';
  associationWarning.value = '';
  addingPassenger.value = true;
}

function reinitialiserFormulaire() {
  nouveauPassager.nom = '';
  nouveauPassager.prenom = '';
  nouveauPassager.numeroCni = '';
  nouveauPassager.telephone = '';
  nouveauPassager.numeroPlace = '';
  nouveauPassager.tarif = '';
  nouveauPassager.observations = '';
}

function annulerSaisiePassager() {
  if (saving.value) return;
  if (passagerEnAttenteAssociation.value) {
    associationWarning.value =
      'Le passager a déjà été créé, mais son association à cette fiche reste à effectuer. ' +
      'Réessayez l’enregistrement pour terminer l’association.';
    return;
  }
  reinitialiserFormulaire();
  addingPassenger.value = false;
  errorMessage.value = '';
  associationWarning.value = '';
}

async function enregistrerPassager(): Promise<void> {
  
  if (saving.value) return;
  errorMessage.value = '';
  successMessage.value = '';
  associationWarning.value = '';

  const nom = nouveauPassager.nom.trim();
  const prenom = nouveauPassager.prenom.trim();
  const numeroCni = nouveauPassager.numeroCni.trim();
  const telephone = nouveauPassager.telephone.trim();
  const placeSaisie = String(nouveauPassager.numeroPlace ?? '').trim();
  const tarifSaisi = String(nouveauPassager.tarif ?? '').trim();
  const observations = nouveauPassager.observations.trim();

  // 1. Vérifier les champs obligatoires.
  if (!nom || !prenom || !numeroCni) {
    errorMessage.value =
      'Le nom, le prénom et le numéro de CNI sont obligatoires.';
   
    return;
  }
  if (telephone.length > 30) {
    errorMessage.value =
      'Le numéro de téléphone ne doit pas dépasser 30 caractères.';
    return;
  }
  if (observations.length > 1000) {
    errorMessage.value =
      'Les observations ne doivent pas dépasser 1 000 caractères.';
    return;
  }

  // 2. Valider le numéro de place.
  let numeroPlace: number | undefined;
  if (placeSaisie !== '') {
    numeroPlace = Number(placeSaisie);
    if (!Number.isInteger(numeroPlace) || numeroPlace < 1) {
      errorMessage.value =
        'Le numéro de place doit être un entier supérieur ou égal à 1.';
      return;
    }
  }

  // 3. Valider le tarif.
  let tarif: number | undefined;
  if (tarifSaisi !== '') {
    tarif = Number(tarifSaisi);
    if (!Number.isFinite(tarif) || tarif < 0) {
      errorMessage.value =
        'Le tarif doit être un nombre positif ou égal à zéro.';
      return;
    }
    if (Math.round(tarif * 100) !== tarif * 100) {
      errorMessage.value =
        'Le tarif ne peut pas comporter plus de deux décimales.';
      return;
    }
  }

  // 4. Vérifier l'identifiant de la fiche.
  if (!ficheId.value || ficheId.value === 'undefined') {
    errorMessage.value =
      'Identifiant de fiche manquant. Vérifie l’URL de la fiche.';
    return;
  }


  saving.value = true;

  try {
    let passager = passagerEnAttenteAssociation.value;
    if (!passager) {
      const payloadPassager = {
        nom,
        prenom,
        numeroCni,
        ...(telephone ? { telephone } : {}),
      };


      passager = await createPassager(payloadPassager);
      
    }

    const payloadAssociation = {
      ficheId: ficheId.value,
      passagerId: passager.id,
      ...(numeroPlace !== undefined ? { numeroPlace } : {}),
      ...(tarif !== undefined ? { tarif } : {}),
      ...(observations ? { observations } : {}),
    };

    
    await associerPassagerAFiche(payloadAssociation);
    
    passagerEnAttenteAssociation.value = null;
    reinitialiserFormulaire();
    addingPassenger.value = false;
    successMessage.value =
      'Le passager et les informations de son trajet ont été enregistrés.';

    try {
      passagers.value = await getPassagersFiche(ficheId.value);
    } catch {
      errorMessage.value =
        'Le passager a été enregistré, mais la liste n’a pas pu être actualisée. ' +
        'Recharge la fiche pour vérifier les données.';
    }
  } catch (error: unknown) {
    console.error('>>> [DEBUG ERREUR API] :', error);
    if (passagerEnAttenteAssociation.value) {
      associationWarning.value =
        'Le passager a été créé, mais son association à la fiche a échoué. ' +
        'Réessaie pour terminer l’association sans recréer le passager.';
    }
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    saving.value = false;
  }
}

function imprimerPdf() {
  window.print();
}

onMounted(chargerFiche);
</script>

<template>
  <main class="detail-page">
    <div class="actions no-print">
      <button
        class="btn-secondary"
        type="button"
        @click="router.push({ name: 'fiches' })"
      >
        ← Retour aux fiches
      </button>
      <button
        v-if="fiche"
        class="btn-primary"
        type="button"
        @click="imprimerPdf"
      >
        Imprimer / Enregistrer en PDF
      </button>
    </div>

    <div v-if="loading" class="message">
      Chargement de la fiche…
    </div>
    <div v-else-if="errorMessage && !fiche" class="error-message no-print">
      <p>{{ errorMessage }}</p>
      <button
        class="btn-secondary"
        type="button"
        @click="chargerFiche"
      >
        Réessayer
      </button>
    </div>

    <article v-else-if="fiche" class="fiche-document">
      <header class="administrative-header">
        <div class="logo-placeholder" aria-label="Emplacement du logo">
          LOGO
          <small>À insérer</small>
        </div>
        <div class="administration-title">
          <p class="administration-name">ADMINISTRATION COMPÉTENTE</p>
          <p>SERVICE / DÉLÉGATION : À COMPLÉTER</p>
          <p class="document-subtitle">DOCUMENT ADMINISTRATIF</p>
        </div>
        <div class="document-reference">
          <span>Référence</span>
          <strong>{{ fiche.reference }}</strong>
          <span>Statut : {{ fiche.statut }}</span>
        </div>
      </header>

      <div class="document-title">
        <h1>FICHE DE CHARGEMENT</h1>
        <p>Identification du véhicule, du chauffeur et des passagers</p>
      </div>

      <div v-if="successMessage" class="success-message no-print">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage && fiche" class="error-message no-print">
        {{ errorMessage }}
      </div>
      <div v-if="associationWarning" class="warning-message no-print">
        {{ associationWarning }}
      </div>

      <section class="section">
        <h2>1. Informations générales</h2>
        <div class="info-grid">
          <div>
            <span class="field-label">Gare</span>
            <strong>
              {{ fiche.gare?.nomGare ?? fiche.gare?.nom ?? '—' }}
            </strong>
          </div>
          <div>
            <span class="field-label">Date de création</span>
            <strong>{{ dateCreation }}</strong>
          </div>
          <div>
            <span class="field-label">Statut</span>
            <strong>{{ fiche.statut }}</strong>
          </div>
          <div>
            <span class="field-label">Destination</span>
            <strong>{{ fiche.destination?.nom ?? '—' }}</strong>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>2. Véhicule et chauffeur</h2>
        <div class="info-grid">
          <div>
            <span class="field-label">Immatriculation</span>
            <strong>
              {{ fiche.vehicule?.immatriculation ?? '—' }}
            </strong>
          </div>
          <div>
            <span class="field-label">Chauffeur</span>
            <strong>
              {{
                [fiche.chauffeur?.prenom, fiche.chauffeur?.nom]
                  .filter(Boolean)
                  .join(' ') || '—'
              }}
            </strong>
          </div>
          <div>
            <span class="field-label">Itinéraire</span>
            <strong>
              {{ fiche.itineraire?.libelle ?? '—' }}
            </strong>
          </div>
        </div>
      </section>

      <section class="section passengers-section">
        <div class="section-heading">
          <h2>3. Liste des passagers</h2>
          <button
            v-if="!addingPassenger"
            class="btn-primary no-print"
            type="button"
            @click="ouvrirSaisiePassager"
          >
            + Ajouter un passager
          </button>
        </div>

        <div v-if="addingPassenger" class="passenger-form no-print">
          <h3>Ajouter un passager</h3>
          <p
            v-if="passagerEnAttenteAssociation"
            class="warning-message"
          >
            Le passager existe déjà. Réessayez son association à la fiche.
          </p>
          <div class="form-grid">
            <label>
              Nom *
              <input
                v-model="nouveauPassager.nom"
                type="text"
                maxlength="100"
                autocomplete="family-name"
                :disabled="saving || !!passagerEnAttenteAssociation"
                required
              />
            </label>
            <label>
              Prénom *
              <input
                v-model="nouveauPassager.prenom"
                type="text"
                maxlength="100"
                autocomplete="given-name"
                :disabled="saving || !!passagerEnAttenteAssociation"
                required
              />
            </label>
            <label>
              Numéro de CNI *
              <input
                v-model="nouveauPassager.numeroCni"
                type="text"
                maxlength="100"
                :disabled="saving || !!passagerEnAttenteAssociation"
                required
              />
            </label>
            <label>
              Téléphone
              <input
                v-model="nouveauPassager.telephone"
                type="tel"
                maxlength="30"
                autocomplete="tel"
                placeholder="Numéro de téléphone"
                :disabled="saving || !!passagerEnAttenteAssociation"
              />
            </label>
            <label>
              Numéro de place
              <input
                v-model="nouveauPassager.numeroPlace"
                type="number"
                min="1"
                step="1"
                placeholder="Facultatif"
                :disabled="saving"
              />
            </label>
            <label>
              Tarif (FCFA)
              <input
                v-model="nouveauPassager.tarif"
                type="number"
                min="0"
                step="0.01"
                placeholder="Prix du trajet"
                :disabled="saving"
              />
            </label>
            <label class="observations-field">
              Observations
              <textarea
                v-model="nouveauPassager.observations"
                maxlength="1000"
                rows="3"
                placeholder="Remarques éventuelles"
                :disabled="saving"
              ></textarea>
            </label>
          </div>
          <div class="form-actions">
            <button
              class="btn-primary"
              type="button"
              :disabled="saving"
              @click="enregistrerPassager"
            >
              {{ saving ? 'Enregistrement…' : 'Enregistrer le passager' }}
            </button>
            <button
              class="btn-secondary"
              type="button"
              :disabled="saving"
              @click="annulerSaisiePassager"
            >
              Annuler
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>N° de place</th>
                <th>N° CNI</th>
                <th>Téléphone</th>
                <th>Tarif (FCFA)</th>
                <th>Observations</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in passagers"
                :key="item.passagerId"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ item.passager?.nom ?? '—' }}</td>
                <td>{{ item.passager?.prenom ?? '—' }}</td>
                <td>{{ item.numeroPlace ?? '—' }}</td>
                <td>{{ item.passager?.numeroCni ?? '—' }}</td>
                <td>{{ item.passager?.telephone || '—' }}</td>
                <td>{{ formaterTarif(item.tarif) }}</td>
                <td class="observations-cell">
                  {{ item.observations || '—' }}
                </td>
              </tr>
              <tr v-if="passagers.length === 0">
                <td colspan="8" class="empty-row">
                  Aucun passager associé à cette fiche.
                </td>
              </tr>
            </tbody>
            <tfoot v-if="passagers.length > 0">
              <tr>
                <td colspan="6" class="total-label">
                  TOTAL DES TARIFS
                </td>
                <td class="total-value">
                  {{ formaterTarif(totalTarifs) }}
                </td>
                <td>FCFA</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p class="passager-count">
          Nombre total de passagers :
          <strong>{{ passagers.length }}</strong>
        </p>
        <p class="passager-count">
          Total des tarifs :
          <strong>{{ formaterTarif(totalTarifs) }} FCFA</strong>
        </p>
      </section>

      <footer class="document-footer">
        <div>
          <p>Signature du responsable</p>
          <div class="signature-line"></div>
          <p class="signature-name">Nom et qualité :</p>
        </div>
        <div>
          <p>Signature du chauffeur</p>
          <div class="signature-line"></div>
          <p class="signature-name">Nom :</p>
        </div>
      </footer>

      <p class="document-bottom-note">
        Document généré à partir des données enregistrées dans le système.
      </p>
    </article>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #1f2937;
}

.actions,
.section-heading,
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.actions {
  margin-bottom: 24px;
}

button {
  border: 0;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  color: white;
  background: #166534;
}

.btn-secondary {
  color: #1f2937;
  background: #e5e7eb;
}

.message,
.error-message,
.success-message,
.warning-message {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 12px 0;
}

.message {
  background: #f3f4f6;
}

.error-message {
  color: #991b1b;
  background: #fee2e2;
}

.success-message {
  color: #166534;
  background: #dcfce7;
}

.warning-message {
  color: #92400e;
  background: #fef3c7;
}

.fiche-document {
  padding: 32px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.administrative-header {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr) 180px;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 2px solid #1f2937;
}

.logo-placeholder {
  display: flex;
  min-height: 76px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #9ca3af;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
}

.logo-placeholder small {
  margin-top: 4px;
  font-size: 10px;
  font-weight: 400;
}

.administration-title {
  text-align: center;
  font-size: 11px;
  line-height: 1.6;
}

.administration-title p {
  margin: 2px 0;
}

.administration-name {
  font-size: 13px;
  font-weight: 800;
}

.document-subtitle {
  margin-top: 8px !important;
  font-weight: 700;
}

.document-reference {
  display: grid;
  gap: 5px;
  text-align: right;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.document-title {
  margin-top: 22px;
  text-align: center;
}

.document-title h1 {
  margin: 0 0 7px;
  font-size: 23px;
}

.document-title p {
  margin: 0;
  color: #4b5563;
  font-size: 12px;
}

.section {
  margin-top: 28px;
}

.section h2 {
  margin: 0 0 16px;
  padding-bottom: 8px;
  font-size: 17px;
  border-bottom: 1px solid #d1d5db;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.info-grid > div {
  display: grid;
  gap: 5px;
  overflow-wrap: anywhere;
}

.field-label {
  color: #6b7280;
  font-size: 13px;
}

.section-heading {
  align-items: flex-start;
  margin-bottom: 16px;
}

.section-heading h2 {
  flex: 1;
}

.passenger-form {
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}

.passenger-form h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.form-grid input,
.form-grid textarea {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #9ca3af;
  border-radius: 5px;
  background: white;
  color: #1f2937;
  font: inherit;
  font-weight: 400;
}

.form-grid textarea {
  resize: vertical;
}

.observations-field {
  grid-column: 1 / -1;
}

.form-actions {
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th,
td {
  padding: 9px 8px;
  border: 1px solid #d1d5db;
  text-align: left;
  overflow-wrap: anywhere;
  vertical-align: top;
}

th {
  background: #f3f4f6;
}

.observations-cell {
  min-width: 120px;
  white-space: pre-wrap;
}

tfoot {
  font-weight: 700;
  background: #f3f4f6;
}

.total-label {
  text-align: right;
}

.total-value {
  white-space: nowrap;
}

.empty-row {
  text-align: center;
  color: #6b7280;
}

.passager-count {
  text-align: right;
  margin-top: 12px;
}

.document-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 55px;
}

.document-footer > div {
  break-inside: avoid;
}

.signature-line {
  height: 55px;
  border-bottom: 1px solid #4b5563;
}

.signature-name {
  font-size: 11px;
}

.document-bottom-note {
  margin-top: 30px;
  padding-top: 8px;
  border-top: 1px solid #d1d5db;
  color: #6b7280;
  font-size: 10px;
  text-align: center;
}

@media (max-width: 700px) {
  .detail-page {
    padding: 12px;
  }
  .fiche-document {
    padding: 16px;
  }
  .administrative-header {
    grid-template-columns: 70px minmax(0, 1fr);
  }
  .document-reference {
    grid-column: 1 / -1;
    text-align: left;
  }
  .administration-title {
    text-align: left;
  }
  .info-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
  .observations-field {
    grid-column: auto;
  }
  .section-heading,
  .actions {
    flex-wrap: wrap;
  }
  .document-footer {
    gap: 20px;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }
  .no-print {
    display: none !important;
  }
  .detail-page {
    max-width: none;
    padding: 0;
    margin: 0;
  }
  .fiche-document {
    padding: 0;
    border: 0;
    border-radius: 0;
  }
  .administrative-header {
    grid-template-columns: 80px minmax(0, 1fr) 145px;
    gap: 10px;
  }
  .logo-placeholder {
    min-height: 65px;
  }
  .document-title h1 {
    font-size: 20px;
  }
  .section {
    margin-top: 20px;
  }
  .section h2 {
    break-after: avoid;
  }
  table {
    font-size: 10px;
  }
  thead {
    display: table-header-group;
  }
  tr {
    break-inside: avoid;
  }
  .document-footer {
    break-inside: avoid;
  }
  .document-bottom-note {
    color: #4b5563;
  }
}
</style>

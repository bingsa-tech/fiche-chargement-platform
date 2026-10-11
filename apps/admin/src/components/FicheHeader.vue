
<script setup lang="ts">
withDefaults(
  defineProps<{
    numeroBordereau: string;
    gareNom: string;
    destinationNom: string;
    dateDepart?: string | null;
    heureDepart?: string | null;
    statut?: string | null;
    logoUrl?: string | null;
  }>(),
  {
    dateDepart: null,
    heureDepart: null,
    statut: null,
    logoUrl: null,
  },
);

function formaterDate(date: string | null): string {
  if (!date) return 'Non renseignée';

  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) return date;

  return new Intl.DateTimeFormat('fr-FR').format(valeur);
}
</script>

<template>
  <header class="fiche-header">
    <div class="institution">
      <img
        v-if="logoUrl"
        :src="logoUrl"
        alt="Logo de l'organisme"
        class="institution-logo"
      />

      <div class="institution-text">
        <p class="institution-name">
          ORGANISME / AUTORITÉ COMPÉTENTE
        </p>
        <p class="institution-subtitle">
          Transport routier de voyageurs
        </p>
      </div>
    </div>

    <div class="document-title">
      <h1>BORDEREAU DE ROUTE</h1>
      <p>
        N° <strong>{{ numeroBordereau || 'Non attribué' }}</strong>
      </p>
    </div>

    <div class="fiche-informations">
      <div>
        <span>Gare de départ</span>
        <strong>{{ gareNom || 'Non renseignée' }}</strong>
      </div>

      <div>
        <span>Destination</span>
        <strong>{{ destinationNom || 'Non renseignée' }}</strong>
      </div>

      <div>
        <span>Date de départ</span>
        <strong>{{ formaterDate(dateDepart ?? null) }}</strong>
      </div>

      <div>
        <span>Heure de départ</span>
        <strong>{{ heureDepart || 'Non renseignée' }}</strong>
      </div>
    </div>

    <p v-if="statut" class="fiche-statut">
      Statut : {{ statut }}
    </p>
  </header>
</template>

<style scoped>
.fiche-header {
  color: #172033;
  border-bottom: 2px solid #172033;
  padding-bottom: 18px;
  margin-bottom: 20px;
}

.institution {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.institution-logo {
  width: 68px;
  height: 68px;
  object-fit: contain;
}

.institution-name {
  font-weight: 800;
  margin: 0;
}

.institution-subtitle {
  margin: 5px 0 0;
  font-size: 13px;
}

.document-title {
  text-align: center;
  margin-bottom: 22px;
}

.document-title h1 {
  font-size: 22px;
  margin: 0 0 8px;
}

.document-title p {
  margin: 0;
}

.fiche-informations {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.fiche-informations > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fiche-informations span {
  font-size: 12px;
  color: #4b5563;
}

.fiche-statut {
  margin-bottom: 0;
  font-size: 12px;
}

@media print {
  .fiche-header {
    break-inside: avoid;
  }
}
</style>

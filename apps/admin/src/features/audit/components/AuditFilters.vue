
<script setup lang="ts">
import { reactive } from 'vue';
import type { AuditFilters } from '../types/audit.types';

const emit = defineEmits<{
  (event: 'filter', filters: AuditFilters): void;
  (event: 'reset'): void;
}>();

const filters = reactive<AuditFilters>({
  search: '',
  utilisateurId: undefined,
  action: '',
  entite: '',
  dateDebut: '',
  dateFin: '',
});

function applyFilters() {
  const result: AuditFilters = {};

  if (filters.search?.trim()) {
    result.search = filters.search.trim();
  }

  if (filters.utilisateurId) {
    result.utilisateurId = filters.utilisateurId;
  }

  if (filters.action) {
    result.action = filters.action;
  }

  if (filters.entite) {
    result.entite = filters.entite;
  }

  if (filters.dateDebut) {
    result.dateDebut = new Date(
      filters.dateDebut,
    ).toISOString();
  }

  if (filters.dateFin) {
    const end = new Date(filters.dateFin);
    end.setHours(23, 59, 59, 999);
    result.dateFin = end.toISOString();
  }

  emit('filter', result);
}

function resetFilters() {
  filters.search = '';
  filters.utilisateurId = undefined;
  filters.action = '';
  filters.entite = '';
  filters.dateDebut = '';
  filters.dateFin = '';

  emit('reset');
}
</script>

<template>
  <section class="audit-filters">
    <div class="filters-heading">
      <div>
        <h2>Recherche et filtres</h2>
        <p>Affinez les événements du journal d'audit.</p>
      </div>
    </div>

    <form @submit.prevent="applyFilters">
      <div class="filters-grid">
        <div class="field search-field">
          <label for="audit-search">Recherche</label>
          <input
            id="audit-search"
            v-model="filters.search"
            type="search"
            placeholder="Rechercher une action ou une entité..."
          />
        </div>

        <div class="field">
          <label for="audit-user">ID utilisateur</label>
          <input
            id="audit-user"
            v-model.number="filters.utilisateurId"
            type="number"
            min="1"
            placeholder="Ex. 3"
          />
        </div>

        <div class="field">
          <label for="audit-action">Action</label>
          <select id="audit-action" v-model="filters.action">
            <option value="">Toutes les actions</option>
            <option value="CREATE">Création</option>
            <option value="UPDATE">Modification</option>
            <option value="DELETE">Suppression</option>
          </select>
        </div>

        <div class="field">
          <label for="audit-entity">Entité</label>
          <input
            id="audit-entity"
            v-model="filters.entite"
            type="text"
            placeholder="Ex. VEHICULE"
          />
        </div>

        <div class="field">
          <label for="audit-start">Date de début</label>
          <input
            id="audit-start"
            v-model="filters.dateDebut"
            type="date"
          />
        </div>

        <div class="field">
          <label for="audit-end">Date de fin</label>
          <input
            id="audit-end"
            v-model="filters.dateFin"
            type="date"
          />
        </div>
      </div>

      <div class="filter-actions">
        <button type="submit" class="apply-button">
          Rechercher
        </button>

        <button
          type="button"
          class="reset-button"
          @click="resetFilters"
        >
          Réinitialiser
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.audit-filters {
  padding: 22px;
  margin-bottom: 22px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.filters-heading {
  margin-bottom: 20px;
}

.filters-heading h2 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #111827;
}

.filters-heading p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.field input,
.field select {
  width: 100%;
  min-height: 40px;
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  background: white;
  color: #111827;
  font: inherit;
  font-size: 13px;
  box-sizing: border-box;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.filter-actions button {
  min-height: 39px;
  padding: 0 16px;
  border-radius: 7px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.apply-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
}

.reset-button {
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}

@media (max-width: 760px) {
  .filters-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }
}
</style>

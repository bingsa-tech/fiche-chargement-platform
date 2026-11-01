
<script setup lang="ts">
import type { AuditLog } from '../types/audit.types';

defineProps<{
  log: AuditLog | null;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

function formatJson(
  value: Record<string, unknown> | null,
): string {
  if (!value) return 'Aucune donnée disponible';

  return JSON.stringify(value, null, 2);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(new Date(value));
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="log"
      class="modal-overlay"
      @click.self="emit('close')"
    >
      <section
        class="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-details-title"
      >
        <header class="modal-header">
          <div>
            <h2 id="audit-details-title">
              Détails de l'événement
            </h2>
            <p>Consultation du journal d'audit</p>
          </div>

          <button
            type="button"
            class="close-button"
            aria-label="Fermer"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <section class="metadata">
            <div>
              <span>ID événement</span>
              <strong>{{ log.id }}</strong>
            </div>

            <div>
              <span>Date et heure</span>
              <strong>{{ formatDate(log.dateHeure) }}</strong>
            </div>

            <div>
              <span>Utilisateur</span>
              <strong>{{ log.utilisateurId ?? 'Inconnu' }}</strong>
            </div>

            <div>
              <span>Action</span>
              <strong>{{ log.action }}</strong>
            </div>

            <div>
              <span>Entité</span>
              <strong>{{ log.entite }}</strong>
            </div>

            <div>
              <span>ID de l'entité</span>
              <strong>{{ log.entiteId }}</strong>
            </div>

            <div>
              <span>Appareil</span>
              <strong>{{ log.appareilId ?? 'Non renseigné' }}</strong>
            </div>
          </section>

          <section class="json-section">
            <h3>Ancienne valeur</h3>
            <pre>{{ formatJson(log.ancienneValeur) }}</pre>
          </section>

          <section class="json-section">
            <h3>Nouvelle valeur</h3>
            <pre>{{ formatJson(log.nouvelleValeur) }}</pre>
          </section>
        </div>

        <footer class="modal-footer">
          <button
            type="button"
            @click="emit('close')"
          >
            Fermer
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.6);
}

.details-modal {
  width: 100%;
  max-width: 850px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0 0 5px;
  font-size: 18px;
}

.modal-header p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

.close-button {
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 28px;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.metadata {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}

.metadata > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metadata span {
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
}

.metadata strong {
  overflow-wrap: anywhere;
  color: #111827;
  font-size: 13px;
}

.json-section {
  margin-top: 20px;
}

.json-section h3 {
  font-size: 14px;
}

.json-section pre {
  max-height: 300px;
  overflow: auto;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal-footer button {
  padding: 9px 18px;
  border: none;
  border-radius: 7px;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 560px) {
  .metadata {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 8px;
  }
}
</style>

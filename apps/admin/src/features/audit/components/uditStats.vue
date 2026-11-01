
<script setup lang="ts">
import { computed } from 'vue';
import type { AuditLog } from '../types/audit.types';

const props = defineProps<{
  logs: AuditLog[];
  total: number;
}>();

const stats = computed(() => {
  const normalize = (action: string) =>
    action.trim().toUpperCase();

  return {
    total: props.total,
    creations: props.logs.filter(
      log => normalize(log.action) === 'CREATE',
    ).length,
    modifications: props.logs.filter(
      log => normalize(log.action) === 'UPDATE',
    ).length,
    suppressions: props.logs.filter(
      log => normalize(log.action) === 'DELETE',
    ).length,
  };
});
</script>

<template>
  <section class="audit-stats">
    <article class="stat-card">
      <div class="stat-icon total">Σ</div>
      <div>
        <span class="stat-label">Total des événements</span>
        <strong>{{ stats.total }}</strong>
      </div>
    </article>

    <article class="stat-card">
      <div class="stat-icon create">+</div>
      <div>
        <span class="stat-label">Créations</span>
        <strong>{{ stats.creations }}</strong>
      </div>
    </article>

    <article class="stat-card">
      <div class="stat-icon update">↻</div>
      <div>
        <span class="stat-label">Modifications</span>
        <strong>{{ stats.modifications }}</strong>
      </div>
    </article>

    <article class="stat-card">
      <div class="stat-icon delete">×</div>
      <div>
        <span class="stat-label">Suppressions</span>
        <strong>{{ stats.suppressions }}</strong>
      </div>
    </article>
  </section>
</template>

<style scoped>
.audit-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 23px;
  font-weight: 700;
}

.stat-icon.total {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-icon.create {
  background: #dcfce7;
  color: #15803d;
}

.stat-icon.update {
  background: #fef3c7;
  color: #b45309;
}

.stat-icon.delete {
  background: #fee2e2;
  color: #b91c1c;
}

.stat-card > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  color: #6b7280;
  font-size: 12px;
}

.stat-card strong {
  color: #111827;
  font-size: 24px;
}

@media (max-width: 900px) {
  .audit-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .audit-stats {
    grid-template-columns: 1fr;
  }
}
</style>

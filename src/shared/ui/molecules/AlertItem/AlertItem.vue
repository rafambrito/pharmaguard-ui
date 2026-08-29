<script setup lang="ts">
import { statusLabel, type DashboardStatus } from '@/entities/dashboard'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'

interface Props {
  title: string
  description: string
  unit: string
  status: DashboardStatus
}

defineProps<Props>()
</script>

<template>
  <li class="pg-alert-item">
    <div class="pg-alert-item__head">
      <span class="pg-alert-item__title-group">
        <span class="pg-alert-item__dot" :class="`pg-alert-item__dot--${status}`" aria-hidden="true"></span>
        <h3>{{ title }}</h3>
      </span>
      <StatusBadge :tone="status" :label="statusLabel(status)" />
    </div>
    <p class="pg-alert-item__description">{{ description }}</p>
    <p class="pg-alert-item__unit">{{ unit }}</p>
  </li>
</template>

<style scoped>
.pg-alert-item {
  padding: 10px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
}

.pg-alert-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pg-alert-item__title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pg-alert-item__dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--pg-color-text-muted);
}

.pg-alert-item__dot--critical {
  background: var(--pg-color-critical);
}

.pg-alert-item__dot--warning {
  background: var(--pg-color-warning);
}

.pg-alert-item__dot--monitoring {
  background: var(--pg-color-monitoring);
}

.pg-alert-item__dot--normal {
  background: var(--pg-color-normal);
}

h3 {
  margin: 0;
  color: var(--pg-color-text-primary);
  font-size: clamp(0.82rem, 0.95vw, 0.9rem);
  line-height: 1.2;
}

.pg-alert-item__description {
  margin: 5px 0 0;
  color: var(--pg-color-text-secondary);
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
  line-height: 1.35;
}

.pg-alert-item__unit {
  margin: 4px 0 0;
  color: var(--pg-color-text-muted);
  font-size: 0.72rem;
}
</style>

<script setup lang="ts">
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

interface Props {
  icon: string
  title: string
  value: string
  description: string
  tone?: StatusTone
  statusLabel?: string
}

withDefaults(defineProps<Props>(), {
  tone: undefined,
  statusLabel: '',
})
</script>

<template>
  <article class="pg-metric-card" :class="tone ? `pg-metric-card--${tone}` : ''">
    <div class="pg-metric-card__head">
      <span class="pg-metric-card__icon" aria-hidden="true">{{ icon }}</span>
      <StatusBadge v-if="tone && statusLabel" :tone="tone" :label="statusLabel" />
    </div>
    <p class="pg-metric-card__title">{{ title }}</p>
    <p class="pg-metric-card__value">{{ value }}</p>
    <p class="pg-metric-card__description">{{ description }}</p>
  </article>
</template>

<style scoped>
.pg-metric-card {
  display: grid;
  gap: 4px;
  align-content: start;
  padding: clamp(12px, 1.5vw, 16px);
  border: 1px solid #dfe7eb;
  border-left: 4px solid #c9d7de;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(22, 54, 70, 0.06);
}

.pg-metric-card--critical {
  border-left-color: #d5372a;
}

.pg-metric-card--warning {
  border-left-color: #e07406;
}

.pg-metric-card--monitoring {
  border-left-color: #e0ab00;
}

.pg-metric-card--normal {
  border-left-color: #1f9257;
}

.pg-metric-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.pg-metric-card__icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 8px;
  background: #e7f4f6;
  color: #005a87;
  font-size: 1.1rem;
}

.pg-metric-card__title {
  margin: 0;
  color: #667780;
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
  line-height: 1.3;
}

.pg-metric-card__value {
  margin: 0;
  color: #24323a;
  font-size: clamp(1.5rem, 2.2vw, 1.9rem);
  font-weight: 700;
  line-height: 1.1;
}

.pg-metric-card__description {
  margin: 0;
  color: #667780;
  font-size: clamp(0.72rem, 0.85vw, 0.78rem);
  line-height: 1.3;
}
</style>

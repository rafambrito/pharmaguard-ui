<script setup lang="ts">
import Card from '@/shared/ui/atoms/Card/Card.vue'
import type { DashboardMetricTrend } from '@/entities/dashboard'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

interface Props {
  icon: string
  title: string
  value: string
  description: string
  tone?: StatusTone
  trend?: DashboardMetricTrend
}

withDefaults(defineProps<Props>(), {
  tone: undefined,
  trend: undefined,
})
</script>

<template>
  <Card as="article" class="pg-metric-card" :class="tone ? `pg-metric-card--${tone}` : ''">
    <div class="pg-metric-card__head">
      <span class="pg-metric-card__icon" aria-hidden="true">{{ icon }}</span>
    </div>
    <p class="pg-metric-card__title">{{ title }}</p>
    <p class="pg-metric-card__value">{{ value }}</p>
    <div class="pg-metric-card__footer">
      <p class="pg-metric-card__description">{{ description }}</p>
      <p
        v-if="trend"
        class="pg-metric-card__trend"
        :class="`pg-metric-card__trend--${trend.direction}`"
      >
        <span class="pg-metric-card__trend-arrow" aria-hidden="true">{{ trend.direction === 'up' ? '▲' : '▼' }}</span>
        {{ trend.label }}
      </p>
    </div>
  </Card>
</template>

<style scoped>
.pg-metric-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 4px;
  border-left: 4px solid var(--pg-color-border);
}

.pg-metric-card--critical {
  border-left-color: var(--pg-color-critical);
}

.pg-metric-card--warning {
  border-left-color: var(--pg-color-warning);
}

.pg-metric-card--monitoring {
  border-left-color: var(--pg-color-monitoring);
}

.pg-metric-card--normal {
  border-left-color: var(--pg-color-normal);
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
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-100);
  color: var(--pg-color-blue-700);
  font-size: 1.15rem;
}

.pg-metric-card__title {
  margin: 0;
  color: var(--pg-color-text-secondary);
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
  line-height: 1.3;
}

.pg-metric-card__value {
  margin: 0;
  color: var(--pg-color-text-primary);
  font-size: clamp(1.6rem, 2.3vw, 2rem);
  font-weight: 700;
  line-height: 1.1;
}

.pg-metric-card__description {
  margin: 0;
  color: var(--pg-color-text-secondary);
  font-size: clamp(0.72rem, 0.85vw, 0.78rem);
  line-height: 1.3;
}

.pg-metric-card__footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* anchors description/trend to the card bottom regardless of title/value length above */
  margin-top: auto;
  padding-top: 8px;
}

.pg-metric-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
}

.pg-metric-card__trend--up {
  color: var(--pg-color-normal);
}

.pg-metric-card__trend--down {
  color: var(--pg-color-critical);
}

.pg-metric-card__trend-arrow {
  font-size: 0.62rem;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { ConsumptionTrend } from '@/entities/dashboard'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'

interface Props {
  trend: ConsumptionTrend
}

const props = defineProps<Props>()

const maxValue = computed(() => Math.max(...props.trend.points.map((point) => point.value), 1))

function barHeight(value: number): string {
  return `${Math.round((value / maxValue.value) * 100)}%`
}
</script>

<template>
  <SectionPanel
    title="Tendência de consumo"
    :description="`${trend.periodLabel} · ${trend.unitOfMeasure}`"
  >
    <div class="consumption-chart" role="img" :aria-label="`Tendência de consumo — ${trend.periodLabel}`">
      <div v-for="point in trend.points" :key="point.label" class="consumption-chart__column">
        <span class="consumption-chart__value">{{ point.value.toLocaleString('pt-BR') }}</span>
        <div class="consumption-chart__bar" :style="{ height: barHeight(point.value) }" />
        <span class="consumption-chart__label">{{ point.label }}</span>
      </div>
    </div>
  </SectionPanel>
</template>

<style scoped>
.consumption-chart {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: clamp(6px, 1vw, 12px);
  align-items: end;
  min-height: 160px;
  padding-top: 6px;
}

.consumption-chart__column {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 4px;
  height: 100%;
  align-items: end;
  justify-items: center;
}

.consumption-chart__bar {
  width: 100%;
  max-width: 42px;
  min-height: 4px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, var(--pg-color-blue-500) 0%, var(--pg-color-blue-700) 100%);
}

.consumption-chart__value {
  color: var(--pg-color-text-secondary);
  font-size: 0.68rem;
}

.consumption-chart__label {
  color: var(--pg-color-text-muted);
  font-size: 0.72rem;
  font-weight: 600;
}
</style>

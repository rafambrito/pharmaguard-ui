<script setup lang="ts">
import { statusLabel, type DashboardMetric } from '@/entities/dashboard'
import MetricCard from '@/shared/ui/molecules/MetricCard/MetricCard.vue'

interface Props {
  metrics: DashboardMetric[]
}

defineProps<Props>()
</script>

<template>
  <section class="dashboard-metrics" aria-label="Indicadores do estoque">
    <MetricCard
      v-for="metric in metrics"
      :key="metric.id"
      :icon="metric.icon"
      :title="metric.title"
      :value="metric.value"
      :description="metric.description"
      :tone="metric.status"
      :status-label="metric.status ? statusLabel(metric.status) : ''"
    />
  </section>
</template>

<style scoped>
.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 14px);
}

@media (max-width: 980px) {
  .dashboard-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }
}
</style>

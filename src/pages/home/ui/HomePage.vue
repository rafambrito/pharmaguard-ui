<script setup lang="ts">
import { t } from '@/shared/config/messages'
import { useDashboardOverview } from '@/features/dashboard-overview'
import Header from '@/shared/ui/organisms/Header/Header.vue'
import { DashboardMetrics } from '@/widgets/dashboard-metrics'
import { DashboardAlerts } from '@/widgets/dashboard-alerts'
import { DashboardUnitStock } from '@/widgets/dashboard-unit-stock'
import { DashboardTransfers } from '@/widgets/dashboard-transfers'
import { DashboardConsumption } from '@/widgets/dashboard-consumption'

const { overview, isLoading, hasError } = useDashboardOverview()
</script>

<template>
  <main class="home-page">
    <Header :title="t('dashboard.header.title')" :subtitle="t('dashboard.header.subtitle')" />

    <p v-if="isLoading" class="dashboard-state">{{ t('dashboard.state.loading') }}</p>
    <p v-else-if="hasError || !overview" class="dashboard-state dashboard-state--error">
      {{ t('dashboard.state.error') }}
    </p>

    <template v-else>
      <DashboardMetrics :metrics="overview.metrics" />

      <div class="dashboard-columns">
        <DashboardAlerts :alerts="overview.alerts" />
        <DashboardUnitStock :units="overview.units" />
      </div>

      <div class="dashboard-columns">
        <DashboardTransfers :opportunities="overview.transferOpportunities" />
        <DashboardConsumption :trend="overview.consumptionTrend" />
      </div>
    </template>
  </main>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: clamp(14px, 2vw, 20px);
  align-content: start;
  max-width: 1120px;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 14px);
  align-items: start;
}

.dashboard-state {
  margin: 0;
  padding: 14px 16px;
  border: 1px solid #dfe7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #667780;
  font-size: 0.85rem;
}

.dashboard-state--error {
  border-color: #f0c8c3;
  background: #fef7f6;
  color: #a3231a;
}

@media (max-width: 980px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}
</style>

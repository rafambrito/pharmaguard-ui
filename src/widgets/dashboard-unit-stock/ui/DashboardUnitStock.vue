<script setup lang="ts">
import { statusLabel, type UnitStockSummary } from '@/entities/dashboard'
import DashboardInsight from '@/features/dashboard-insight/ui/DashboardInsight.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'

interface Props {
  units: UnitStockSummary[]
}

defineProps<Props>()
</script>

<template>
  <SectionPanel
    title="Estoque por unidade"
    description="Situação resumida das unidades de saúde atendidas."
  >
    <template #actions>
      <DashboardInsight painel="ESTOQUE_POR_UNIDADE" />
    </template>
    <div class="unit-table-wrapper">
      <table class="unit-table">
        <thead>
          <tr>
            <th scope="col">Unidade</th>
            <th scope="col">Itens críticos</th>
            <th scope="col">Lotes a vencer</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in units" :key="unit.id">
            <td>{{ unit.name }}</td>
            <td>{{ unit.criticalItems }}</td>
            <td>{{ unit.expiringBatches }}</td>
            <td>
              <StatusBadge :tone="unit.status" :label="statusLabel(unit.status)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </SectionPanel>
</template>

<style scoped>
.unit-table-wrapper {
  overflow-x: auto;
}

.unit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.75rem, 0.9vw, 0.85rem);
}

th,
td {
  padding: 9px 10px;
  border-bottom: 1px solid var(--pg-color-border);
  text-align: left;
  white-space: nowrap;
}

th {
  color: var(--pg-color-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

td {
  color: var(--pg-color-text-primary);
}

tbody tr:last-child td {
  border-bottom: none;
}
</style>

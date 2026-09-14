<script setup lang="ts">
import type { DashboardAlert } from '@/entities/dashboard'
import DashboardInsight from '@/features/dashboard-insight/ui/DashboardInsight.vue'
import AlertItem from '@/shared/ui/molecules/AlertItem/AlertItem.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'

interface Props {
  alerts: DashboardAlert[]
}

const props = defineProps<Props>()
</script>

<template>
  <SectionPanel
    title="Alertas prioritários"
    description="Ocorrências que exigem ação imediata da equipe de farmácia."
  >
    <template #actions>
      <DashboardInsight v-if="props.alerts.length > 0" painel="ALERTAS" />
    </template>
    <ul class="alert-list">
      <AlertItem
        v-for="alert in alerts"
        :key="alert.id"
        :title="alert.title"
        :description="alert.description"
        :unit="alert.unit"
        :status="alert.status"
      />
    </ul>
  </SectionPanel>
</template>

<style scoped>
.alert-list {
  display: grid;
  gap: var(--pg-gutter);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>

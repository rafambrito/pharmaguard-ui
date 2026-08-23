<script setup lang="ts">
import { statusLabel, type DashboardAlert } from '@/entities/dashboard'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'

interface Props {
  alerts: DashboardAlert[]
}

defineProps<Props>()
</script>

<template>
  <SectionPanel
    title="Alertas prioritários"
    description="Ocorrências que exigem ação imediata da equipe de farmácia."
  >
    <ul class="alert-list">
      <li
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-item"
        :class="`alert-item--${alert.status}`"
      >
        <div class="alert-item__head">
          <h3>{{ alert.title }}</h3>
          <StatusBadge :tone="alert.status" :label="statusLabel(alert.status)" />
        </div>
        <p class="alert-item__description">{{ alert.description }}</p>
        <p class="alert-item__unit">{{ alert.unit }}</p>
      </li>
    </ul>
  </SectionPanel>
</template>

<style scoped>
.alert-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.alert-item {
  padding: 10px 12px;
  border: 1px solid #e6edf1;
  border-left: 4px solid #c9d7de;
  border-radius: 6px;
  background: #fbfdfe;
}

.alert-item--critical {
  border-left-color: #d5372a;
  background: #fef7f6;
}

.alert-item--warning {
  border-left-color: #e07406;
}

.alert-item--monitoring {
  border-left-color: #e0ab00;
}

.alert-item--normal {
  border-left-color: #1f9257;
}

.alert-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

h3 {
  margin: 0;
  color: #24323a;
  font-size: clamp(0.82rem, 0.95vw, 0.9rem);
  line-height: 1.2;
}

.alert-item__description {
  margin: 5px 0 0;
  color: #4d5f68;
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
  line-height: 1.35;
}

.alert-item__unit {
  margin: 4px 0 0;
  color: #7b8b93;
  font-size: 0.72rem;
}
</style>

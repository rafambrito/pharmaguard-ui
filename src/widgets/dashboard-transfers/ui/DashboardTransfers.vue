<script setup lang="ts">
import type { TransferOpportunity } from '@/entities/dashboard'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'

interface Props {
  opportunities: TransferOpportunity[]
}

defineProps<Props>()
</script>

<template>
  <SectionPanel
    title="Oportunidades de transferência"
    description="Sugestões de remanejamento para equilibrar o estoque entre unidades."
  >
    <ul class="transfer-list">
      <li v-for="opportunity in opportunities" :key="opportunity.id" class="transfer-item">
        <p class="transfer-item__route">
          <span class="transfer-item__unit">{{ opportunity.originUnit }}</span>
          <span class="transfer-item__arrow" aria-hidden="true">→</span>
          <span class="transfer-item__unit transfer-item__unit--destination">{{ opportunity.destinationUnit }}</span>
        </p>
        <dl class="transfer-item__details">
          <div>
            <dt>Medicamento</dt>
            <dd>{{ opportunity.medication }}</dd>
          </div>
          <div>
            <dt>Quantidade sugerida</dt>
            <dd>{{ opportunity.suggestedQuantity }} unidades</dd>
          </div>
        </dl>
        <p class="transfer-item__reason">{{ opportunity.reason }}</p>
      </li>
    </ul>
  </SectionPanel>
</template>

<style scoped>
.transfer-list {
  display: grid;
  gap: var(--pg-gutter);
  margin: 0;
  padding: 0;
  list-style: none;
}

.transfer-item {
  padding: 10px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-50);
}

.transfer-item__route {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: clamp(0.8rem, 0.95vw, 0.88rem);
  font-weight: 700;
}

.transfer-item__unit {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--pg-color-blue-100);
  color: var(--pg-color-blue-700);
}

.transfer-item__unit--destination {
  background: var(--pg-color-blue-700);
  color: #ffffff;
}

.transfer-item__arrow {
  color: var(--pg-color-text-muted);
}

.transfer-item__details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin: 8px 0 0;
}

dt {
  color: var(--pg-color-text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
}

dd {
  margin: 2px 0 0;
  color: var(--pg-color-text-primary);
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
}

.transfer-item__reason {
  margin: 6px 0 0;
  color: var(--pg-color-text-secondary);
  font-size: clamp(0.72rem, 0.85vw, 0.78rem);
  line-height: 1.35;
}
</style>

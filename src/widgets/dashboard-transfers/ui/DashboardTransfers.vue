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
          {{ opportunity.originUnit }}
          <span aria-hidden="true">→</span>
          {{ opportunity.destinationUnit }}
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
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.transfer-item {
  padding: 10px 12px;
  border: 1px solid #e6edf1;
  border-radius: 6px;
  background: #fbfdfe;
}

.transfer-item__route {
  margin: 0;
  color: #005a87;
  font-size: clamp(0.8rem, 0.95vw, 0.88rem);
  font-weight: 700;
}

.transfer-item__details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin: 6px 0 0;
}

dt {
  color: #7b8b93;
  font-size: 0.7rem;
  text-transform: uppercase;
}

dd {
  margin: 2px 0 0;
  color: #24323a;
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
}

.transfer-item__reason {
  margin: 6px 0 0;
  color: #4d5f68;
  font-size: clamp(0.72rem, 0.85vw, 0.78rem);
  line-height: 1.35;
}
</style>

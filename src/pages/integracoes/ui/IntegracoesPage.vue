<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { INTEGRACOES_MOCK, integracaoStatusLabel, integracaoStatusTone } from '@/entities/integracao'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

function abrir(integracaoId: string): void {
  if (integracaoId === 'bnafar') {
    router.push('/integracoes/bnafar')
  } else if (integracaoId === 'catmat') {
    router.push('/integracoes/catmat')
  } else if (integracaoId === 'rnds') {
    router.push('/integracoes/rnds')
  } else if (integracaoId === 'anvisa') {
    router.push('/integracoes/anvisa')
  }
}

const INTEGRACOES_DISPONIVEIS = ['bnafar', 'catmat', 'rnds', 'anvisa']
</script>

<template>
  <main class="integracoes-page">
    <DashboardHeader :title="t('integracoes.header.title')" :subtitle="t('integracoes.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('integracoes.mockBanner') }}
    </p>

    <SectionPanel :title="t('integracoes.list.title')" :description="t('integracoes.list.description')">
      <div class="cards">
        <article v-for="integracao in INTEGRACOES_MOCK" :key="integracao.id" class="card">
          <div class="card__header">
            <span class="card__icon" aria-hidden="true">
              <Icon :name="integracao.icon" :size="20" />
            </span>
            <StatusBadge :tone="integracaoStatusTone(integracao.status)" :label="integracaoStatusLabel(integracao.status)" />
          </div>
          <h3 class="card__title">{{ integracao.nome }}</h3>
          <p class="card__orgao">{{ t('integracoes.card.orgao') }}: {{ integracao.orgao }}</p>
          <p class="card__descricao">{{ integracao.descricao }}</p>
          <Button
            type="button"
            variant="secondary"
            :disabled="!INTEGRACOES_DISPONIVEIS.includes(integracao.id)"
            @click="abrir(integracao.id)"
          >
            {{ INTEGRACOES_DISPONIVEIS.includes(integracao.id) ? t('integracoes.card.action') : t('integracoes.card.actionDisabled') }}
          </Button>
        </article>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.integracoes-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
}

.mock-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-50);
  color: var(--pg-color-text-secondary);
  font-size: 0.8rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 16px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-50);
  color: var(--pg-color-blue-700);
}

.card__title {
  margin: 0;
  color: var(--pg-color-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.card__orgao {
  margin: 0;
  color: var(--pg-color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
}

.card__descricao {
  flex: 1 1 auto;
  margin: 0;
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
}
</style>

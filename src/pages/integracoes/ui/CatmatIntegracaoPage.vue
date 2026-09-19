<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t, type MessageKey } from '@/shared/config/messages'
import { useIntegracaoCatmatMock } from '@/features/integracao-catmat-mock'
import type { CatmatItemSituacao } from '@/features/integracao-catmat-mock'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import MetricCard from '@/shared/ui/molecules/MetricCard/MetricCard.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

const {
  configuracao,
  isConnecting,
  isSyncing,
  isBusy,
  isConnected,
  ultimaSincronizacao,
  log,
  ultimosItens,
  conectar,
  desconectar,
  sincronizarCatalogo,
} = useIntegracaoCatmatMock()

const SITUACAO_TONE: Record<CatmatItemSituacao, 'normal' | 'warning' | 'monitoring'> = {
  NOVO: 'normal',
  ATUALIZADO: 'monitoring',
  DUPLICIDADE_EVITADA: 'warning',
}

function situacaoLabel(situacao: CatmatItemSituacao): string {
  return t(`catmat.items.situacao.${situacao}` as MessageKey)
}
</script>

<template>
  <main class="catmat-page">
    <DashboardHeader :title="t('catmat.header.title')" :subtitle="t('catmat.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('catmat.mockBanner') }}
    </p>

    <SectionPanel :title="t('catmat.connection.title')" :description="t('catmat.connection.description')">
      <div class="connection__status">
        <StatusBadge
          :tone="isConnected ? 'normal' : 'warning'"
          :label="isConnected ? t('catmat.status.connected') : t('catmat.status.disconnected')"
        />
      </div>

      <div class="form__grid">
        <div class="field field--wide">
          <Label for-id="catmat-endpoint">{{ t('catmat.field.endpoint') }}</Label>
          <Input id="catmat-endpoint" v-model="configuracao.endpoint" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="catmat-client-id">{{ t('catmat.field.clientId') }}</Label>
          <Input id="catmat-client-id" v-model="configuracao.clientId" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="catmat-client-secret">{{ t('catmat.field.clientSecret') }}</Label>
          <Input
            id="catmat-client-secret"
            v-model="configuracao.clientSecret"
            type="password"
            :disabled="isConnected || isBusy"
          />
        </div>
      </div>

      <div class="form__actions">
        <Button v-if="!isConnected" type="button" :disabled="isBusy" :loading="isConnecting" @click="conectar">
          <Icon name="plug" :size="16" />
          {{ t('catmat.action.connect') }}
        </Button>
        <Button v-else type="button" variant="secondary" :disabled="isBusy" @click="desconectar">
          {{ t('catmat.action.disconnect') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('catmat.sync.title')" :description="t('catmat.sync.description')">
      <p class="sync__info">
        {{ t('catmat.sync.lastSync') }}
        {{ ultimaSincronizacao ?? t('catmat.sync.never') }}
      </p>

      <p v-if="!isConnected" class="state">{{ t('catmat.sync.connectFirst') }}</p>

      <div v-if="log.length > 0" class="summary">
        <MetricCard
          icon="📦"
          :title="t('catmat.sync.summary.novos')"
          :value="String(log[0].novos)"
          :description="t('catmat.sync.summary.novos')"
        />
        <MetricCard
          icon="🔄"
          :title="t('catmat.sync.summary.atualizados')"
          :value="String(log[0].atualizados)"
          :description="t('catmat.sync.summary.atualizados')"
        />
        <MetricCard
          icon="🛡"
          :title="t('catmat.sync.summary.duplicidades')"
          :value="String(log[0].duplicidadesEvitadas)"
          :description="t('catmat.sync.summary.duplicidades')"
        />
      </div>

      <div class="form__actions">
        <Button type="button" :disabled="!isConnected || isBusy" :loading="isSyncing" @click="sincronizarCatalogo">
          <Icon name="catalog" :size="16" />
          {{ t('catmat.sync.action') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('catmat.items.title')" :description="t('catmat.items.description')">
      <p v-if="ultimosItens.length === 0" class="state">{{ t('catmat.items.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('catmat.items.field.medicamento') }}</th>
              <th scope="col">{{ t('catmat.items.field.codigoCatmat') }}</th>
              <th scope="col">{{ t('catmat.items.field.codigoTuss') }}</th>
              <th scope="col">{{ t('catmat.items.field.situacao') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ultimosItens" :key="item.id">
              <td :data-label="t('catmat.items.field.medicamento')" class="table__cell--strong">
                {{ item.medicamentoNome }}
              </td>
              <td :data-label="t('catmat.items.field.codigoCatmat')">{{ item.codigoCatmat }}</td>
              <td :data-label="t('catmat.items.field.codigoTuss')">{{ item.codigoTuss }}</td>
              <td :data-label="t('catmat.items.field.situacao')">
                <StatusBadge :tone="SITUACAO_TONE[item.situacao]" :label="situacaoLabel(item.situacao)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <div class="page-actions">
      <Button type="button" variant="ghost" :disabled="isBusy" @click="router.push('/integracoes')">
        {{ t('catmat.backToIntegracoes') }}
      </Button>
    </div>
  </main>
</template>

<style scoped>
.catmat-page {
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

.connection__status {
  display: flex;
  margin-bottom: 12px;
}

.form__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px 14px;
}

.field {
  display: grid;
  gap: 5px;
  align-content: start;
  grid-column: span 2;
  min-width: 0;
}

.field--wide {
  grid-column: span 4;
}

.form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 14px;
}

.sync__info {
  margin: 0 0 4px;
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding-top: 8px;
}

.state {
  margin: 0;
  padding: 16px 8px;
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
  text-align: center;
}

.table-scroll {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.table th {
  padding: 8px 12px;
  border-bottom: 1px solid var(--pg-color-border);
  color: var(--pg-color-text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--pg-color-border);
  color: var(--pg-color-text-secondary);
  vertical-align: middle;
}

.table__cell--strong {
  color: var(--pg-color-text-primary);
  font-weight: 600;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.page-actions {
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 760px) {
  .form__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field--wide {
    grid-column: span 2;
  }
}
</style>

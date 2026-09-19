<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { useIntegracaoBnafarMock } from '@/features/integracao-bnafar-mock'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
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
  conectar,
  desconectar,
  sincronizarAgora,
} = useIntegracaoBnafarMock()
</script>

<template>
  <main class="bnafar-page">
    <DashboardHeader :title="t('bnafar.header.title')" :subtitle="t('bnafar.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('bnafar.mockBanner') }}
    </p>

    <SectionPanel :title="t('bnafar.connection.title')" :description="t('bnafar.connection.description')">
      <div class="connection__status">
        <StatusBadge
          :tone="isConnected ? 'normal' : 'warning'"
          :label="isConnected ? t('bnafar.status.connected') : t('bnafar.status.disconnected')"
        />
      </div>

      <div class="form__grid">
        <div class="field field--wide">
          <Label for-id="bnafar-endpoint">{{ t('bnafar.field.endpoint') }}</Label>
          <Input id="bnafar-endpoint" v-model="configuracao.endpoint" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="bnafar-client-id">{{ t('bnafar.field.clientId') }}</Label>
          <Input id="bnafar-client-id" v-model="configuracao.clientId" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="bnafar-client-secret">{{ t('bnafar.field.clientSecret') }}</Label>
          <Input
            id="bnafar-client-secret"
            v-model="configuracao.clientSecret"
            type="password"
            :disabled="isConnected || isBusy"
          />
        </div>
      </div>

      <div class="form__actions">
        <Button v-if="!isConnected" type="button" :disabled="isBusy" :loading="isConnecting" @click="conectar">
          <Icon name="plug" :size="16" />
          {{ t('bnafar.action.connect') }}
        </Button>
        <Button v-else type="button" variant="secondary" :disabled="isBusy" @click="desconectar">
          {{ t('bnafar.action.disconnect') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('bnafar.sync.title')" :description="t('bnafar.sync.description')">
      <p class="sync__info">
        {{ t('bnafar.sync.lastSync') }}
        {{ ultimaSincronizacao ?? t('bnafar.sync.never') }}
      </p>

      <p v-if="!isConnected" class="state">{{ t('bnafar.sync.connectFirst') }}</p>

      <div class="form__actions">
        <Button type="button" :disabled="!isConnected || isBusy" :loading="isSyncing" @click="sincronizarAgora">
          <Icon name="satellite" :size="16" />
          {{ t('bnafar.sync.action') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('bnafar.log.title')" :description="t('bnafar.log.description')">
      <p v-if="log.length === 0" class="state">{{ t('bnafar.log.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('bnafar.log.field.dataHora') }}</th>
              <th scope="col">{{ t('bnafar.log.field.posicaoEstoque') }}</th>
              <th scope="col">{{ t('bnafar.log.field.entradas') }}</th>
              <th scope="col">{{ t('bnafar.log.field.saidas') }}</th>
              <th scope="col">{{ t('bnafar.log.field.perdas') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in log" :key="entry.id">
              <td :data-label="t('bnafar.log.field.dataHora')" class="table__cell--strong">{{ entry.dataHora }}</td>
              <td :data-label="t('bnafar.log.field.posicaoEstoque')">{{ entry.posicaoEstoque }}</td>
              <td :data-label="t('bnafar.log.field.entradas')">{{ entry.entradas }}</td>
              <td :data-label="t('bnafar.log.field.saidas')">{{ entry.saidas }}</td>
              <td :data-label="t('bnafar.log.field.perdas')">{{ entry.perdas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <div class="page-actions">
      <Button type="button" variant="ghost" :disabled="isBusy" @click="router.push('/integracoes')">
        {{ t('bnafar.backToIntegracoes') }}
      </Button>
    </div>
  </main>
</template>

<style scoped>
.bnafar-page {
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

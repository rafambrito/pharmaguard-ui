<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { NOTA_FISCAL_MEDICAMENTOS_MOCK } from '@/entities/nota-fiscal-entrada'
import { useIntegracaoRndsMock } from '@/features/integracao-rnds-mock'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

const {
  configuracao,
  dispensacao,
  isConnecting,
  isSending,
  isBusy,
  isConnected,
  feedback,
  log,
  conectar,
  desconectar,
  selecionarMedicamento,
  registrarDispensacao,
} = useIntegracaoRndsMock()

const medicamentoOptions = NOTA_FISCAL_MEDICAMENTOS_MOCK.map((medicamento) => ({
  value: String(medicamento.id),
  label: medicamento.nome,
}))

function onMedicamentoChange(value: string): void {
  const medicamentoId = value ? Number(value) : null
  const medicamento = NOTA_FISCAL_MEDICAMENTOS_MOCK.find((current) => current.id === medicamentoId)
  selecionarMedicamento(medicamentoId, medicamento?.nome ?? '')
}
</script>

<template>
  <main class="rnds-page">
    <DashboardHeader :title="t('rnds.header.title')" :subtitle="t('rnds.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('rnds.mockBanner') }}
    </p>

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('rnds.connection.title')" :description="t('rnds.connection.description')">
      <div class="connection__status">
        <StatusBadge
          :tone="isConnected ? 'normal' : 'warning'"
          :label="isConnected ? t('rnds.status.connected') : t('rnds.status.disconnected')"
        />
      </div>

      <div class="form__grid">
        <div class="field field--wide">
          <Label for-id="rnds-endpoint">{{ t('rnds.field.endpoint') }}</Label>
          <Input id="rnds-endpoint" v-model="configuracao.endpoint" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="rnds-client-id">{{ t('rnds.field.clientId') }}</Label>
          <Input id="rnds-client-id" v-model="configuracao.clientId" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="rnds-client-secret">{{ t('rnds.field.clientSecret') }}</Label>
          <Input
            id="rnds-client-secret"
            v-model="configuracao.clientSecret"
            type="password"
            :disabled="isConnected || isBusy"
          />
        </div>
      </div>

      <div class="form__actions">
        <Button v-if="!isConnected" type="button" :disabled="isBusy" :loading="isConnecting" @click="conectar">
          <Icon name="plug" :size="16" />
          {{ t('rnds.action.connect') }}
        </Button>
        <Button v-else type="button" variant="secondary" :disabled="isBusy" @click="desconectar">
          {{ t('rnds.action.disconnect') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('rnds.dispensacao.title')" :description="t('rnds.dispensacao.description')">
      <p v-if="!isConnected" class="state">{{ t('rnds.sync.connectFirst') }}</p>

      <form class="form" @submit.prevent="registrarDispensacao">
        <div class="form__grid">
          <div class="field">
            <Label for-id="rnds-cpf-cns">{{ t('rnds.field.cpfCns') }}</Label>
            <Input id="rnds-cpf-cns" v-model="dispensacao.cpfCns" :disabled="!isConnected || isBusy" />
          </div>

          <div class="field">
            <Label for-id="rnds-medicamento">{{ t('rnds.field.medicamento') }}</Label>
            <Select
              id="rnds-medicamento"
              :model-value="dispensacao.medicamentoId ? String(dispensacao.medicamentoId) : ''"
              :options="medicamentoOptions"
              :placeholder="t('rnds.option.select')"
              :disabled="!isConnected || isBusy"
              @update:model-value="onMedicamentoChange"
            />
          </div>

          <div class="field">
            <Label for-id="rnds-quantidade">{{ t('rnds.field.quantidade') }}</Label>
            <Input id="rnds-quantidade" v-model="dispensacao.quantidade" type="number" :disabled="!isConnected || isBusy" />
          </div>
        </div>

        <div class="form__actions">
          <Button type="submit" :disabled="!isConnected || isBusy" :loading="isSending">
            <Icon name="transfer" :size="16" />
            {{ t('rnds.action.register') }}
          </Button>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel :title="t('rnds.log.title')" :description="t('rnds.log.description')">
      <p v-if="log.length === 0" class="state">{{ t('rnds.log.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('rnds.log.field.dataHora') }}</th>
              <th scope="col">{{ t('rnds.log.field.cpfCns') }}</th>
              <th scope="col">{{ t('rnds.log.field.medicamento') }}</th>
              <th scope="col">{{ t('rnds.log.field.quantidade') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in log" :key="entry.id">
              <td :data-label="t('rnds.log.field.dataHora')" class="table__cell--strong">{{ entry.dataHora }}</td>
              <td :data-label="t('rnds.log.field.cpfCns')">{{ entry.cpfCns }}</td>
              <td :data-label="t('rnds.log.field.medicamento')">{{ entry.medicamentoNome }}</td>
              <td :data-label="t('rnds.log.field.quantidade')">{{ entry.quantidade }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <div class="page-actions">
      <Button type="button" variant="ghost" :disabled="isBusy" @click="router.push('/integracoes')">
        {{ t('rnds.backToIntegracoes') }}
      </Button>
    </div>
  </main>
</template>

<style scoped>
.rnds-page {
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

.feedback {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  box-shadow: var(--pg-shadow-sm);
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
}

.feedback__dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pg-color-text-muted);
}

.feedback--success .feedback__dot {
  background: var(--pg-color-normal);
}

.feedback--error {
  color: var(--pg-color-critical);
}

.feedback--error .feedback__dot {
  background: var(--pg-color-critical);
}

.connection__status {
  display: flex;
  margin-bottom: 12px;
}

.form {
  display: grid;
  gap: 14px;
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

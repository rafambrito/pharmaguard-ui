<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t, type MessageKey } from '@/shared/config/messages'
import { NOTA_FISCAL_MEDICAMENTOS_MOCK } from '@/entities/nota-fiscal-entrada'
import { useIntegracaoAnvisaMock } from '@/features/integracao-anvisa-mock'
import type { AnvisaSituacaoRegistro } from '@/features/integracao-anvisa-mock'
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
  consulta,
  isConnecting,
  isConsulting,
  isBusy,
  isConnected,
  feedback,
  log,
  ultimaConsulta,
  conectar,
  desconectar,
  selecionarMedicamento,
  consultarRegistro,
} = useIntegracaoAnvisaMock()

const medicamentoOptions = NOTA_FISCAL_MEDICAMENTOS_MOCK.map((medicamento) => ({
  value: String(medicamento.id),
  label: medicamento.nome,
}))

const SITUACAO_TONE: Record<AnvisaSituacaoRegistro, 'normal' | 'warning' | 'critical'> = {
  VALIDO: 'normal',
  VENCIDO: 'warning',
  CANCELADO: 'critical',
}

function situacaoLabel(situacao: AnvisaSituacaoRegistro): string {
  return t(`anvisa.result.situacao.${situacao}` as MessageKey)
}

function onMedicamentoChange(value: string): void {
  const medicamentoId = value ? Number(value) : null
  const medicamento = NOTA_FISCAL_MEDICAMENTOS_MOCK.find((current) => current.id === medicamentoId)
  selecionarMedicamento(medicamentoId, medicamento?.nome ?? '')
}
</script>

<template>
  <main class="anvisa-page">
    <DashboardHeader :title="t('anvisa.header.title')" :subtitle="t('anvisa.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('anvisa.mockBanner') }}
    </p>

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('anvisa.connection.title')" :description="t('anvisa.connection.description')">
      <div class="connection__status">
        <StatusBadge
          :tone="isConnected ? 'normal' : 'warning'"
          :label="isConnected ? t('anvisa.status.connected') : t('anvisa.status.disconnected')"
        />
      </div>

      <div class="form__grid">
        <div class="field field--wide">
          <Label for-id="anvisa-endpoint">{{ t('anvisa.field.endpoint') }}</Label>
          <Input id="anvisa-endpoint" v-model="configuracao.endpoint" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="anvisa-client-id">{{ t('anvisa.field.clientId') }}</Label>
          <Input id="anvisa-client-id" v-model="configuracao.clientId" :disabled="isConnected || isBusy" />
        </div>

        <div class="field">
          <Label for-id="anvisa-client-secret">{{ t('anvisa.field.clientSecret') }}</Label>
          <Input
            id="anvisa-client-secret"
            v-model="configuracao.clientSecret"
            type="password"
            :disabled="isConnected || isBusy"
          />
        </div>
      </div>

      <div class="form__actions">
        <Button v-if="!isConnected" type="button" :disabled="isBusy" :loading="isConnecting" @click="conectar">
          <Icon name="plug" :size="16" />
          {{ t('anvisa.action.connect') }}
        </Button>
        <Button v-else type="button" variant="secondary" :disabled="isBusy" @click="desconectar">
          {{ t('anvisa.action.disconnect') }}
        </Button>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('anvisa.consulta.title')" :description="t('anvisa.consulta.description')">
      <p v-if="!isConnected" class="state">{{ t('anvisa.sync.connectFirst') }}</p>

      <form class="form" @submit.prevent="consultarRegistro">
        <div class="form__grid">
          <div class="field">
            <Label for-id="anvisa-medicamento">{{ t('anvisa.field.medicamento') }}</Label>
            <Select
              id="anvisa-medicamento"
              :model-value="consulta.medicamentoId ? String(consulta.medicamentoId) : ''"
              :options="medicamentoOptions"
              :placeholder="t('anvisa.option.select')"
              :disabled="!isConnected || isBusy"
              @update:model-value="onMedicamentoChange"
            />
          </div>

          <div class="field">
            <Label for-id="anvisa-registro">{{ t('anvisa.field.codigoRegistro') }}</Label>
            <Input id="anvisa-registro" v-model="consulta.codigoRegistro" disabled />
          </div>

          <div class="field">
            <Label for-id="anvisa-lote">{{ t('anvisa.field.lote') }}</Label>
            <Input id="anvisa-lote" v-model="consulta.lote" :disabled="!isConnected || isBusy" />
          </div>
        </div>

        <div class="form__actions">
          <Button type="submit" :disabled="!isConnected || isBusy" :loading="isConsulting">
            <Icon name="search" :size="16" />
            {{ t('anvisa.action.consult') }}
          </Button>
        </div>
      </form>

      <div v-if="ultimaConsulta" class="result">
        <StatusBadge :tone="SITUACAO_TONE[ultimaConsulta.situacaoRegistro]" :label="situacaoLabel(ultimaConsulta.situacaoRegistro)" />
        <span class="result__validade">
          {{ t('anvisa.result.validadeRegulatoria') }}: {{ ultimaConsulta.validadeRegulatoria }}
        </span>
        <p v-if="ultimaConsulta.recall" class="result__recall">{{ ultimaConsulta.mensagemRecall }}</p>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('anvisa.log.title')" :description="t('anvisa.log.description')">
      <p v-if="log.length === 0" class="state">{{ t('anvisa.log.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('anvisa.log.field.dataHora') }}</th>
              <th scope="col">{{ t('anvisa.log.field.medicamento') }}</th>
              <th scope="col">{{ t('anvisa.log.field.codigoRegistro') }}</th>
              <th scope="col">{{ t('anvisa.log.field.lote') }}</th>
              <th scope="col">{{ t('anvisa.log.field.situacao') }}</th>
              <th scope="col">{{ t('anvisa.log.field.recall') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in log" :key="entry.id">
              <td :data-label="t('anvisa.log.field.dataHora')" class="table__cell--strong">{{ entry.dataHora }}</td>
              <td :data-label="t('anvisa.log.field.medicamento')">{{ entry.medicamentoNome }}</td>
              <td :data-label="t('anvisa.log.field.codigoRegistro')">{{ entry.codigoRegistro }}</td>
              <td :data-label="t('anvisa.log.field.lote')">{{ entry.lote }}</td>
              <td :data-label="t('anvisa.log.field.situacao')">
                <StatusBadge :tone="SITUACAO_TONE[entry.situacaoRegistro]" :label="situacaoLabel(entry.situacaoRegistro)" />
              </td>
              <td :data-label="t('anvisa.log.field.recall')">
                {{ entry.recall ? t('anvisa.log.recall.yes') : t('anvisa.log.recall.no') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <div class="page-actions">
      <Button type="button" variant="ghost" :disabled="isBusy" @click="router.push('/integracoes')">
        {{ t('anvisa.backToIntegracoes') }}
      </Button>
    </div>
  </main>
</template>

<style scoped>
.anvisa-page {
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

.result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--pg-color-border);
}

.result__validade {
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
}

.result__recall {
  flex: 1 1 100%;
  margin: 0;
  color: var(--pg-color-critical);
  font-size: 0.82rem;
  font-weight: 600;
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

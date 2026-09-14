<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import {
  ALERTA_SEVERIDADES,
  ALERTA_TIPOS,
  alertaSeveridadeLabel,
  alertaSeveridadeTone,
  alertaTipoLabel,
  alertaTipoTone,
} from '@/entities/alerta'
import { useAlertaConsulta } from '@/features/alerta-consulta'
import { formatDate } from '@/shared/utils'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  filtro,
  medicamentos,
  unidadesSaude,
  alertas,
  resumo,
  totalAlertas,
  periodo,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isBusy,
  feedback,
  carregarApoio,
  pesquisar,
  limpar,
} = useAlertaConsulta()

const tipoOptions = ALERTA_TIPOS.map((tipo) => ({
  value: tipo,
  label: alertaTipoLabel(tipo),
}))

const severidadeOptions = ALERTA_SEVERIDADES.map((severidade) => ({
  value: severidade,
  label: alertaSeveridadeLabel(severidade),
}))

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="alertas-page">
    <DashboardHeader :title="t('alertas.header.title')" :subtitle="t('alertas.header.subtitle')" />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('alertas.form.title')" :description="t('alertas.form.description')">
      <form class="form" @submit.prevent="pesquisar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="alertas-periodo-inicio">{{ t('alertas.field.periodoInicio') }}</Label>
            <Input id="alertas-periodo-inicio" v-model="filtro.periodoInicio" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="alertas-periodo-fim">{{ t('alertas.field.periodoFim') }}</Label>
            <Input id="alertas-periodo-fim" v-model="filtro.periodoFim" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="alertas-medicamento">{{ t('alertas.field.medicamento') }}</Label>
            <Select
              id="alertas-medicamento"
              v-model="filtro.medicamentoId"
              :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))"
              :placeholder="t('alertas.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="alertas-unidade">{{ t('alertas.field.unidade') }}</Label>
            <Select
              id="alertas-unidade"
              v-model="filtro.unidadeSaudeId"
              :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))"
              :placeholder="t('alertas.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="alertas-tipo">{{ t('alertas.field.tipo') }}</Label>
            <Select
              id="alertas-tipo"
              v-model="filtro.tipo"
              :options="tipoOptions"
              :placeholder="t('alertas.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="alertas-severidade">{{ t('alertas.field.severidade') }}</Label>
            <Select
              id="alertas-severidade"
              v-model="filtro.severidade"
              :options="severidadeOptions"
              :placeholder="t('alertas.option.all')"
              :disabled="isBusy"
            />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('alertas.state.loadingSupport') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isLoading">
              {{ t('alertas.action.search') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="limpar">
              {{ t('alertas.action.clear') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>

    <section class="summary-grid" aria-label="Resumo dos alertas">
      <div class="summary-card">
        <span>{{ t('alertas.summary.total') }}</span>
        <strong>{{ hasSearched ? totalAlertas : '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('alertas.summary.ruptura') }}</span>
        <strong>{{ hasSearched ? resumo.totalRuptura : '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('alertas.summary.vencimento') }}</span>
        <strong>{{ hasSearched ? resumo.totalVencimento : '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('alertas.summary.criticos') }}</span>
        <strong>{{ hasSearched ? resumo.totalItensCriticos : '-' }}</strong>
      </div>
    </section>

    <SectionPanel :title="t('alertas.results.title')" :description="t('alertas.results.description')">
      <p v-if="isLoading" class="state">{{ t('alertas.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('alertas.state.initial') }}</p>
      <p v-else-if="alertas.length === 0" class="state">{{ t('alertas.state.empty') }}</p>

      <div v-else class="table-scroll">
        <p class="results-period">
          {{ t('alertas.results.period') }} {{ formatDate(periodo.inicio) }} - {{ formatDate(periodo.fim) }}
        </p>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('alertas.field.medicamento') }}</th>
              <th scope="col">{{ t('alertas.field.tipo') }}</th>
              <th scope="col">{{ t('alertas.field.severidade') }}</th>
              <th scope="col">{{ t('alertas.field.quantidadeImpactada') }}</th>
              <th scope="col">{{ t('alertas.field.descricao') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="alerta in alertas"
              :key="`${alerta.medicamentoId}-${alerta.tipo}-${alerta.descricao}`"
              class="table__row table__row--static"
            >
              <td :data-label="t('alertas.field.medicamento')" class="table__cell--strong">
                {{ alerta.nomeMedicamento }}
              </td>
              <td :data-label="t('alertas.field.tipo')">
                <StatusBadge :tone="alertaTipoTone(alerta.tipo)" :label="alertaTipoLabel(alerta.tipo)" />
              </td>
              <td :data-label="t('alertas.field.severidade')">
                <StatusBadge
                  :tone="alertaSeveridadeTone(alerta.severidade)"
                  :label="alertaSeveridadeLabel(alerta.severidade)"
                />
              </td>
              <td :data-label="t('alertas.field.quantidadeImpactada')">
                {{ alerta.quantidadeImpactada }}
              </td>
              <td :data-label="t('alertas.field.descricao')">{{ alerta.descricao }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.alertas-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
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

.form {
  display: grid;
  gap: 14px;
}

.form__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px 14px;
}

.field {
  display: grid;
  gap: 5px;
  align-content: start;
  grid-column: span 2;
  min-width: 0;
}

.form__hint {
  margin: 0;
  color: var(--pg-color-text-muted);
  font-size: 0.75rem;
}

.form__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--pg-color-border);
}

.form__actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  box-shadow: var(--pg-shadow-sm);
}

.summary-card span {
  color: var(--pg-color-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.summary-card strong {
  color: var(--pg-color-text-primary);
  font-size: 1.35rem;
}

.state {
  margin: 0;
  padding: 24px 8px;
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
  text-align: center;
}

.results-period {
  margin: 0 0 10px;
  color: var(--pg-color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
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

.table__row--static:hover td {
  background: var(--pg-color-blue-50);
}

@media (max-width: 1180px) {
  .form__grid,
  .summary-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .form__grid,
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .form__actions-group {
    flex: 1 1 100%;
  }
}

@media (max-width: 640px) {
  .form__grid,
  .summary-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .table thead {
    display: none;
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table__row {
    margin-bottom: 10px;
    border: 1px solid var(--pg-color-border);
    border-radius: var(--pg-radius-sm);
    background: var(--pg-color-surface);
  }

  .table__row--static:hover td {
    background: transparent;
  }

  .table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    text-align: right;
  }

  .table td::before {
    content: attr(data-label);
    color: var(--pg-color-text-muted);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .table tbody tr td:last-child {
    border-bottom: none;
  }
}
</style>
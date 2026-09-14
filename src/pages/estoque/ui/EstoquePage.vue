<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import {
  MOVIMENTACAO_ESTOQUE_TIPOS,
  movimentacaoEstoqueTipoLabel,
  movimentacaoEstoqueTipoTone,
  statusValidadeLabel,
  statusValidadeTone,
} from '@/entities/estoque'
import { useEstoqueConsulta } from '@/features/estoque-consulta'
import EstoqueInsight from '@/features/estoque-consulta/ui/EstoqueInsight.vue'
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
  saldo,
  saldosLote,
  movimentacoes,
  vencimentos,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isBusy,
  feedback,
  carregarApoio,
  consultar,
  limpar,
} = useEstoqueConsulta()

const tipoOptions = MOVIMENTACAO_ESTOQUE_TIPOS.map((tipo) => ({
  value: tipo,
  label: movimentacaoEstoqueTipoLabel(tipo),
}))

function medicamentoLabel(id: number): string {
  const medicamento = medicamentos.value.find((item) => item.id === id)
  return medicamento ? `${medicamento.nome} - ${medicamento.apresentacao}` : String(id)
}

function unidadeSaudeLabel(id: number): string {
  const unidade = unidadesSaude.value.find((item) => item.id === id)
  return unidade ? unidade.nome : String(id)
}

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="estoque-page">
    <DashboardHeader :title="t('estoque.header.title')" :subtitle="t('estoque.header.subtitle')" />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('estoque.filters.title')" :description="t('estoque.filters.description')">
      <form class="form" @submit.prevent="consultar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="estoque-unidade">{{ t('estoque.field.unidade') }}</Label>
            <Select
              id="estoque-unidade"
              v-model="filtro.unidadeId"
              :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))"
              :placeholder="t('estoque.option.select')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="estoque-medicamento">{{ t('estoque.field.medicamento') }}</Label>
            <Select
              id="estoque-medicamento"
              v-model="filtro.medicamentoId"
              :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))"
              :placeholder="t('estoque.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="estoque-lote">{{ t('estoque.field.loteId') }}</Label>
            <Input id="estoque-lote" v-model="filtro.loteId" type="number" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="estoque-tipo">{{ t('estoque.field.tipo') }}</Label>
            <Select
              id="estoque-tipo"
              v-model="filtro.tipo"
              :options="tipoOptions"
              :placeholder="t('estoque.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="estoque-data-inicial">{{ t('estoque.field.dataInicial') }}</Label>
            <Input id="estoque-data-inicial" v-model="filtro.dataInicial" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="estoque-data-final">{{ t('estoque.field.dataFinal') }}</Label>
            <Input id="estoque-data-final" v-model="filtro.dataFinal" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="estoque-vencimento">{{ t('estoque.field.diasParaVencer') }}</Label>
            <Input id="estoque-vencimento" v-model="filtro.diasParaVencer" type="number" :disabled="isBusy" />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('estoque.state.loadingSupport') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isLoading">
              {{ t('estoque.action.search') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="limpar">
              {{ t('estoque.action.clear') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>

    <section class="summary-grid" aria-label="Resumo do estoque">
      <div class="summary-card">
        <span>{{ t('estoque.summary.disponivel') }}</span>
        <strong>{{ saldo?.quantidadeDisponivel ?? '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('estoque.summary.reservada') }}</span>
        <strong>{{ saldo?.quantidadeReservada ?? '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('estoque.summary.validade') }}</span>
        <strong>{{ formatDate(saldo?.validadeMaisProxima) }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('estoque.summary.movimentacoes') }}</span>
        <strong>{{ hasSearched ? movimentacoes.length : '-' }}</strong>
      </div>
    </section>

    <SectionPanel :title="t('estoque.lotes.title')" :description="t('estoque.lotes.description')" centered-header>
      <template #actions>
        <EstoqueInsight v-if="saldosLote.length > 0" painel="ESTOQUE_POR_UNIDADE" :filtro="filtro" />
      </template>
      <p v-if="isLoading" class="state">{{ t('estoque.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('estoque.state.initial') }}</p>
      <p v-else-if="!filtro.medicamentoId" class="state">{{ t('estoque.state.medicamentoRequired') }}</p>
      <p v-else-if="saldosLote.length === 0" class="state">{{ t('estoque.state.emptyLotes') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('estoque.field.lote') }}</th>
              <th scope="col">{{ t('estoque.field.dataValidade') }}</th>
              <th scope="col">{{ t('estoque.field.quantidadeDisponivel') }}</th>
              <th scope="col">{{ t('estoque.field.statusValidade') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lote in saldosLote" :key="lote.loteId" class="table__row table__row--static">
              <td :data-label="t('estoque.field.lote')" class="table__cell--strong">
                {{ lote.numeroLote }}
              </td>
              <td :data-label="t('estoque.field.dataValidade')">{{ formatDate(lote.dataValidade) }}</td>
              <td :data-label="t('estoque.field.quantidadeDisponivel')">
                {{ lote.quantidadeDisponivel }}
              </td>
              <td :data-label="t('estoque.field.statusValidade')">
                <StatusBadge
                  :tone="statusValidadeTone(lote.statusValidade)"
                  :label="statusValidadeLabel(lote.statusValidade)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('estoque.movimentacoes.title')" :description="t('estoque.movimentacoes.description')" centered-header>
      <template #actions>
        <EstoqueInsight v-if="movimentacoes.length > 0" painel="CONSUMO" :filtro="filtro" />
      </template>
      <p v-if="isLoading" class="state">{{ t('estoque.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('estoque.state.initial') }}</p>
      <p v-else-if="movimentacoes.length === 0" class="state">{{ t('estoque.state.emptyMovimentacoes') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('estoque.field.tipo') }}</th>
              <th scope="col">{{ t('estoque.field.unidade') }}</th>
              <th scope="col">{{ t('estoque.field.medicamento') }}</th>
              <th scope="col">{{ t('estoque.field.lote') }}</th>
              <th scope="col">{{ t('estoque.field.quantidade') }}</th>
              <th scope="col">{{ t('estoque.field.saldoApos') }}</th>
              <th scope="col">{{ t('estoque.field.motivo') }}</th>
              <th scope="col">{{ t('estoque.field.dataMovimentacao') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movimentacao in movimentacoes" :key="movimentacao.id" class="table__row table__row--static">
              <td :data-label="t('estoque.field.tipo')">
                <StatusBadge
                  :tone="movimentacaoEstoqueTipoTone(movimentacao.tipo)"
                  :label="movimentacaoEstoqueTipoLabel(movimentacao.tipo)"
                />
              </td>
              <td :data-label="t('estoque.field.unidade')" class="table__cell--strong">
                {{ unidadeSaudeLabel(movimentacao.unidadeId) }}
              </td>
              <td :data-label="t('estoque.field.medicamento')">
                {{ medicamentoLabel(movimentacao.medicamentoId) }}
              </td>
              <td :data-label="t('estoque.field.lote')">{{ movimentacao.numeroLote ?? '-' }}</td>
              <td :data-label="t('estoque.field.quantidade')">{{ movimentacao.quantidade }}</td>
              <td :data-label="t('estoque.field.saldoApos')">
                {{ movimentacao.saldoAposMovimentacao }}
              </td>
              <td :data-label="t('estoque.field.motivo')">{{ movimentacao.motivo }}</td>
              <td :data-label="t('estoque.field.dataMovimentacao')">
                {{ formatDate(movimentacao.dataMovimentacao) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('estoque.vencimentos.title')" :description="t('estoque.vencimentos.description')" centered-header>
      <template #actions>
        <EstoqueInsight v-if="vencimentos.length > 0" painel="ALERTAS" :filtro="filtro" />
      </template>
      <p v-if="isLoading" class="state">{{ t('estoque.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('estoque.state.initial') }}</p>
      <p v-else-if="vencimentos.length === 0" class="state">{{ t('estoque.state.emptyVencimentos') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('estoque.field.medicamento') }}</th>
              <th scope="col">{{ t('estoque.field.lote') }}</th>
              <th scope="col">{{ t('estoque.field.dataValidade') }}</th>
              <th scope="col">{{ t('estoque.field.diasParaVencer') }}</th>
              <th scope="col">{{ t('estoque.field.quantidadeDisponivel') }}</th>
              <th scope="col">{{ t('estoque.field.statusValidade') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lote in vencimentos" :key="`${lote.medicamentoId}-${lote.loteId}`" class="table__row table__row--static">
              <td :data-label="t('estoque.field.medicamento')" class="table__cell--strong">
                {{ medicamentoLabel(lote.medicamentoId) }}
              </td>
              <td :data-label="t('estoque.field.lote')">{{ lote.numeroLote }}</td>
              <td :data-label="t('estoque.field.dataValidade')">{{ formatDate(lote.dataValidade) }}</td>
              <td :data-label="t('estoque.field.diasParaVencer')">{{ lote.diasParaVencer }}</td>
              <td :data-label="t('estoque.field.quantidadeDisponivel')">
                {{ lote.quantidadeDisponivel }}
              </td>
              <td :data-label="t('estoque.field.statusValidade')">
                <StatusBadge
                  :tone="statusValidadeTone(lote.statusValidade)"
                  :label="statusValidadeLabel(lote.statusValidade)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.estoque-page {
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
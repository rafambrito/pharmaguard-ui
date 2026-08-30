<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import {
  RELATORIO_TIPOS,
  prioridadeRelatorioLabel,
  prioridadeRelatorioTone,
  relatorioTipoLabel,
  riscoRelatorioLabel,
  riscoRelatorioTone,
  statusEstoqueRelatorioLabel,
  statusEstoqueRelatorioTone,
  statusValidadeRelatorioLabel,
  statusValidadeRelatorioTone,
  tendenciaConsumoLabel,
  tendenciaConsumoTone,
  urgenciaRelatorioLabel,
  urgenciaRelatorioTone,
} from '@/entities/relatorio'
import { useRelatorioConsulta } from '@/features/relatorio-consulta'
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
  categorias,
  unidadesMedida,
  unidadesSaude,
  fornecedores,
  relatorio,
  periodo,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isBusy,
  feedback,
  carregarApoio,
  pesquisar,
  limpar,
} = useRelatorioConsulta()

const tipoOptions = RELATORIO_TIPOS.map((tipo) => ({
  value: tipo,
  label: relatorioTipoLabel(tipo),
}))

const relatorioConsumo = computed(() =>
  relatorio.value?.tipo === 'CONSUMO' ? relatorio.value.data : null,
)
const relatorioProdutosCriticos = computed(() =>
  relatorio.value?.tipo === 'PRODUTOS_CRITICOS' ? relatorio.value.data : null,
)
const relatorioEstoqueMinimo = computed(() =>
  relatorio.value?.tipo === 'ESTOQUE_MINIMO' ? relatorio.value.data : null,
)
const relatorioVencimentos = computed(() =>
  relatorio.value?.tipo === 'VENCIMENTOS' ? relatorio.value.data : null,
)
const relatorioReposicao = computed(() =>
  relatorio.value?.tipo === 'REPOSICAO' ? relatorio.value.data : null,
)

const totalPrincipal = computed(() => {
  if (relatorioConsumo.value) return formatNumber(relatorioConsumo.value.totalConsumido)
  if (relatorioProdutosCriticos.value) return String(relatorioProdutosCriticos.value.totalProdutosCriticos)
  if (relatorioEstoqueMinimo.value) return String(relatorioEstoqueMinimo.value.totalItensAbaixoMinimo)
  if (relatorioVencimentos.value) return String(relatorioVencimentos.value.totalItensVencendo)
  if (relatorioReposicao.value) return String(relatorioReposicao.value.totalItensParaReposicao)
  return '-'
})

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)
}

function fornecedorLabel(id: number | null): string {
  if (id === null) return '-'
  return fornecedores.value.find((fornecedor) => fornecedor.id === id)?.nome ?? String(id)
}

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="relatorios-page">
    <DashboardHeader :title="t('relatorios.header.title')" :subtitle="t('relatorios.header.subtitle')" />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('relatorios.form.title')" :description="t('relatorios.form.description')">
      <form class="form" @submit.prevent="pesquisar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="relatorios-tipo">{{ t('relatorios.field.tipoRelatorio') }}</Label>
            <Select id="relatorios-tipo" v-model="filtro.tipo" :options="tipoOptions" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="relatorios-periodo-inicio">{{ t('relatorios.field.periodoInicio') }}</Label>
            <Input id="relatorios-periodo-inicio" v-model="filtro.periodoInicio" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="relatorios-periodo-fim">{{ t('relatorios.field.periodoFim') }}</Label>
            <Input id="relatorios-periodo-fim" v-model="filtro.periodoFim" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="relatorios-medicamento">{{ t('relatorios.field.medicamento') }}</Label>
            <Select
              id="relatorios-medicamento"
              v-model="filtro.medicamentoId"
              :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))"
              :placeholder="t('relatorios.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="relatorios-categoria">{{ t('relatorios.field.categoria') }}</Label>
            <Select
              id="relatorios-categoria"
              v-model="filtro.categoriaId"
              :options="categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nome }))"
              :placeholder="t('relatorios.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="relatorios-unidade-medida">{{ t('relatorios.field.unidadeMedida') }}</Label>
            <Select
              id="relatorios-unidade-medida"
              v-model="filtro.unidadeMedidaId"
              :options="unidadesMedida.map((unidade) => ({ value: String(unidade.id), label: `${unidade.nome} (${unidade.sigla})` }))"
              :placeholder="t('relatorios.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="relatorios-unidade-saude">{{ t('relatorios.field.unidadeSaude') }}</Label>
            <Select
              id="relatorios-unidade-saude"
              v-model="filtro.unidadeSaudeId"
              :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))"
              :placeholder="t('relatorios.option.all')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="relatorios-fornecedor">{{ t('relatorios.field.fornecedor') }}</Label>
            <Select
              id="relatorios-fornecedor"
              v-model="filtro.fornecedorId"
              :options="fornecedores.map((fornecedor) => ({ value: String(fornecedor.id), label: fornecedor.nome }))"
              :placeholder="t('relatorios.option.all')"
              :disabled="isBusy"
            />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('relatorios.state.loadingSupport') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isLoading">
              {{ t('relatorios.action.search') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="limpar">
              {{ t('relatorios.action.clear') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>

    <section class="summary-grid" aria-label="Resumo do relatório">
      <div class="summary-card">
        <span>{{ t('relatorios.summary.report') }}</span>
        <strong>{{ relatorioTipoLabel(filtro.tipo) }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('relatorios.summary.total') }}</span>
        <strong>{{ hasSearched ? totalPrincipal : '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('relatorios.summary.period') }}</span>
        <strong>{{ hasSearched ? `${periodo.inicio} - ${periodo.fim}` : '-' }}</strong>
      </div>
      <div class="summary-card">
        <span>{{ t('relatorios.summary.indicator') }}</span>
        <strong v-if="relatorioConsumo">
          {{ formatNumber(relatorioConsumo.mediaDiaria) }} / dia
        </strong>
        <strong v-else-if="relatorioProdutosCriticos">
          {{ relatorioProdutosCriticos.itens.filter((item) => item.risco === 'CRITICO').length }} críticos
        </strong>
        <strong v-else-if="relatorioEstoqueMinimo">
          {{ relatorioEstoqueMinimo.itens.filter((item) => item.status === 'RUPTURA').length }} rupturas
        </strong>
        <strong v-else-if="relatorioVencimentos">
          {{ relatorioVencimentos.itens.filter((item) => item.statusValidade === 'VENCIDO').length }} vencidos
        </strong>
        <strong v-else-if="relatorioReposicao">
          {{ relatorioReposicao.itens.filter((item) => item.prioridade === 'ALTA').length }} prioritários
        </strong>
        <strong v-else>-</strong>
      </div>
    </section>

    <SectionPanel :title="t('relatorios.results.title')" :description="t('relatorios.results.description')">
      <p v-if="isLoading" class="state">{{ t('relatorios.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('relatorios.state.initial') }}</p>

      <div v-else-if="relatorioConsumo" class="table-scroll">
        <p class="results-period">{{ t('relatorios.results.period') }} {{ periodo.inicio }} - {{ periodo.fim }}</p>
        <p v-if="relatorioConsumo.itens.length === 0" class="state">{{ t('relatorios.state.empty') }}</p>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('relatorios.field.medicamento') }}</th>
              <th scope="col">{{ t('relatorios.field.categoria') }}</th>
              <th scope="col">{{ t('relatorios.field.unidadeMedida') }}</th>
              <th scope="col">{{ t('relatorios.field.quantidadeConsumida') }}</th>
              <th scope="col">{{ t('relatorios.field.mediaDiaria') }}</th>
              <th scope="col">{{ t('relatorios.field.tendencia') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relatorioConsumo.itens" :key="item.medicamentoId" class="table__row table__row--static">
              <td :data-label="t('relatorios.field.medicamento')" class="table__cell--strong">{{ item.nomeMedicamento }}</td>
              <td :data-label="t('relatorios.field.categoria')">{{ item.categoriaNome }}</td>
              <td :data-label="t('relatorios.field.unidadeMedida')">{{ item.unidadeMedidaSigla }}</td>
              <td :data-label="t('relatorios.field.quantidadeConsumida')">{{ formatNumber(item.quantidadeConsumida) }}</td>
              <td :data-label="t('relatorios.field.mediaDiaria')">{{ formatNumber(item.mediaDiaria) }}</td>
              <td :data-label="t('relatorios.field.tendencia')">
                <StatusBadge :tone="tendenciaConsumoTone(relatorioConsumo.tendencia)" :label="tendenciaConsumoLabel(relatorioConsumo.tendencia)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="relatorioProdutosCriticos" class="table-scroll">
        <p class="results-period">{{ t('relatorios.results.period') }} {{ periodo.inicio }} - {{ periodo.fim }}</p>
        <p v-if="relatorioProdutosCriticos.itens.length === 0" class="state">{{ t('relatorios.state.empty') }}</p>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('relatorios.field.medicamento') }}</th>
              <th scope="col">{{ t('relatorios.field.categoria') }}</th>
              <th scope="col">{{ t('relatorios.field.saldoAtual') }}</th>
              <th scope="col">{{ t('relatorios.field.consumoMedio') }}</th>
              <th scope="col">{{ t('relatorios.field.risco') }}</th>
              <th scope="col">{{ t('relatorios.field.urgencia') }}</th>
              <th scope="col">{{ t('relatorios.field.descricao') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relatorioProdutosCriticos.itens" :key="item.medicamentoId" class="table__row table__row--static">
              <td :data-label="t('relatorios.field.medicamento')" class="table__cell--strong">{{ item.nomeMedicamento }}</td>
              <td :data-label="t('relatorios.field.categoria')">{{ item.categoriaNome }}</td>
              <td :data-label="t('relatorios.field.saldoAtual')">{{ item.saldoAtual }}</td>
              <td :data-label="t('relatorios.field.consumoMedio')">{{ formatNumber(item.consumoMedioDiario) }}</td>
              <td :data-label="t('relatorios.field.risco')">
                <StatusBadge :tone="riscoRelatorioTone(item.risco)" :label="riscoRelatorioLabel(item.risco)" />
              </td>
              <td :data-label="t('relatorios.field.urgencia')">
                <StatusBadge :tone="urgenciaRelatorioTone(item.urgencia)" :label="urgenciaRelatorioLabel(item.urgencia)" />
              </td>
              <td :data-label="t('relatorios.field.descricao')">{{ item.descricaoRisco }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="relatorioEstoqueMinimo" class="table-scroll">
        <p class="results-period">{{ t('relatorios.results.period') }} {{ periodo.inicio }} - {{ periodo.fim }}</p>
        <p v-if="relatorioEstoqueMinimo.itens.length === 0" class="state">{{ t('relatorios.state.empty') }}</p>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('relatorios.field.medicamento') }}</th>
              <th scope="col">{{ t('relatorios.field.categoria') }}</th>
              <th scope="col">{{ t('relatorios.field.saldoAtual') }}</th>
              <th scope="col">{{ t('relatorios.field.estoqueMinimo') }}</th>
              <th scope="col">{{ t('relatorios.field.necessidadeReposicao') }}</th>
              <th scope="col">{{ t('relatorios.field.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relatorioEstoqueMinimo.itens" :key="item.medicamentoId" class="table__row table__row--static">
              <td :data-label="t('relatorios.field.medicamento')" class="table__cell--strong">{{ item.nomeMedicamento }}</td>
              <td :data-label="t('relatorios.field.categoria')">{{ item.categoriaNome }}</td>
              <td :data-label="t('relatorios.field.saldoAtual')">{{ item.saldoAtual }}</td>
              <td :data-label="t('relatorios.field.estoqueMinimo')">{{ item.estoqueMinimo }}</td>
              <td :data-label="t('relatorios.field.necessidadeReposicao')">{{ item.necessidadeReposicao }}</td>
              <td :data-label="t('relatorios.field.status')">
                <StatusBadge :tone="statusEstoqueRelatorioTone(item.status)" :label="statusEstoqueRelatorioLabel(item.status)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="relatorioVencimentos" class="table-scroll">
        <p class="results-period">{{ t('relatorios.results.period') }} {{ periodo.inicio }} - {{ periodo.fim }}</p>
        <p v-if="relatorioVencimentos.itens.length === 0" class="state">{{ t('relatorios.state.empty') }}</p>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('relatorios.field.medicamento') }}</th>
              <th scope="col">{{ t('relatorios.field.lote') }}</th>
              <th scope="col">{{ t('relatorios.field.dataValidade') }}</th>
              <th scope="col">{{ t('relatorios.field.quantidade') }}</th>
              <th scope="col">{{ t('relatorios.field.statusValidade') }}</th>
              <th scope="col">{{ t('relatorios.field.severidade') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relatorioVencimentos.itens" :key="`${item.medicamentoId}-${item.numeroLote}`" class="table__row table__row--static">
              <td :data-label="t('relatorios.field.medicamento')" class="table__cell--strong">{{ item.nomeMedicamento }}</td>
              <td :data-label="t('relatorios.field.lote')">{{ item.numeroLote }}</td>
              <td :data-label="t('relatorios.field.dataValidade')">{{ item.dataValidade }}</td>
              <td :data-label="t('relatorios.field.quantidade')">{{ item.quantidade }}</td>
              <td :data-label="t('relatorios.field.statusValidade')">
                <StatusBadge :tone="statusValidadeRelatorioTone(item.statusValidade)" :label="statusValidadeRelatorioLabel(item.statusValidade)" />
              </td>
              <td :data-label="t('relatorios.field.severidade')">
                <StatusBadge :tone="urgenciaRelatorioTone(item.severidade)" :label="urgenciaRelatorioLabel(item.severidade)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="relatorioReposicao" class="table-scroll">
        <p class="results-period">{{ t('relatorios.results.period') }} {{ periodo.inicio }} - {{ periodo.fim }}</p>
        <p v-if="relatorioReposicao.itens.length === 0" class="state">{{ t('relatorios.state.empty') }}</p>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('relatorios.field.medicamento') }}</th>
              <th scope="col">{{ t('relatorios.field.quantidadeSugerida') }}</th>
              <th scope="col">{{ t('relatorios.field.urgencia') }}</th>
              <th scope="col">{{ t('relatorios.field.prioridade') }}</th>
              <th scope="col">{{ t('relatorios.field.fornecedor') }}</th>
              <th scope="col">{{ t('relatorios.field.leadTime') }}</th>
              <th scope="col">{{ t('relatorios.field.justificativa') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in relatorioReposicao.itens" :key="item.medicamentoId" class="table__row table__row--static">
              <td :data-label="t('relatorios.field.medicamento')" class="table__cell--strong">{{ item.nomeMedicamento }}</td>
              <td :data-label="t('relatorios.field.quantidadeSugerida')">{{ item.quantidadeSugerida }}</td>
              <td :data-label="t('relatorios.field.urgencia')">
                <StatusBadge :tone="urgenciaRelatorioTone(item.urgencia)" :label="urgenciaRelatorioLabel(item.urgencia)" />
              </td>
              <td :data-label="t('relatorios.field.prioridade')">
                <StatusBadge :tone="prioridadeRelatorioTone(item.prioridade)" :label="prioridadeRelatorioLabel(item.prioridade)" />
              </td>
              <td :data-label="t('relatorios.field.fornecedor')">{{ fornecedorLabel(item.fornecedorId) }}</td>
              <td :data-label="t('relatorios.field.leadTime')">{{ item.leadTimeDias ?? '-' }}</td>
              <td :data-label="t('relatorios.field.justificativa')">{{ item.justificativa }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.relatorios-page {
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
  font-size: 1.05rem;
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
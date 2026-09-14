<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { useInteligenciaConsulta } from '@/features/inteligencia-consulta'
import type { TipoPainelInsight } from '@/shared/api/intelligenceApi'
import {
  alertaSeveridadeLabel,
  alertaSeveridadeTone,
  alertaTipoLabel,
  alertaTipoTone,
} from '@/entities/alerta'
import {
  prioridadeRelatorioLabel,
  prioridadeRelatorioTone,
  tendenciaConsumoLabel,
  tendenciaConsumoTone,
  urgenciaRelatorioLabel,
  urgenciaRelatorioTone,
} from '@/entities/relatorio'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import MetricCard from '@/shared/ui/molecules/MetricCard/MetricCard.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

const {
  filtro,
  medicamentos,
  unidadesSaude,
  overview,
  hasSearched,
  isLoading,
  isLoadingAi,
  isBusy,
  feedback,
  activeFocus,
  explicacaoAtual,
  aiError,
  carregarApoio,
  pesquisar,
  limpar,
  selecionarFoco,
  gerarExplicacao,
} = useInteligenciaConsulta()

const focusOptions: { value: TipoPainelInsight; label: string; icon: string }[] = [
  { value: 'DIAGNOSTICO_GERAL', label: 'Diagnóstico Geral', icon: '🧠' },
  { value: 'METRICAS', label: 'Métricas Analíticas', icon: '📊' },
  { value: 'ALERTAS', label: 'Riscos & Rupturas', icon: '🚨' },
  { value: 'TRANSFERENCIAS', label: 'Transferências & Reposições', icon: '🔄' },
  { value: 'CONSUMO', label: 'Tendência de Consumo', icon: '📈' },
]

const unidadesSaudeOptions = computed(() => [
  { value: '', label: t('inteligencia.option.allUnits') },
  ...unidadesSaude.value.map((unidade) => ({
    value: String(unidade.id),
    label: unidade.nome,
  })),
])

const medicamentosOptions = computed(() => [
  { value: '', label: t('inteligencia.option.allMeds') },
  ...medicamentos.value.map((medicamento) => ({
    value: String(medicamento.id),
    label: `${medicamento.nome} - ${medicamento.apresentacao}`,
  })),
])

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return isoString
  }
}

function irParaTransferencias(): void {
  void router.push('/transferencias')
}

onMounted(async () => {
  await carregarApoio()
  await pesquisar()
})
</script>

<template>
  <main class="inteligencia-page">
    <DashboardHeader
      :title="t('inteligencia.header.title')"
      :subtitle="t('inteligencia.header.subtitle')"
    />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <!-- Filters Section -->
    <SectionPanel
      :title="t('inteligencia.form.title')"
      :description="t('inteligencia.form.description')"
    >
      <form class="form" @submit.prevent="pesquisar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="inteligencia-periodo-inicio">{{ t('inteligencia.field.periodoInicio') }}</Label>
            <Input
              id="inteligencia-periodo-inicio"
              v-model="filtro.periodoInicio"
              type="date"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="inteligencia-periodo-fim">{{ t('inteligencia.field.periodoFim') }}</Label>
            <Input
              id="inteligencia-periodo-fim"
              v-model="filtro.periodoFim"
              type="date"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="inteligencia-unidade">{{ t('inteligencia.field.unidadeSaude') }}</Label>
            <Select
              id="inteligencia-unidade"
              v-model="filtro.unidadeSaudeId"
              :options="unidadesSaudeOptions"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="inteligencia-medicamento">{{ t('inteligencia.field.medicamento') }}</Label>
            <Select
              id="inteligencia-medicamento"
              v-model="filtro.medicamentoId"
              :options="medicamentosOptions"
              :disabled="isBusy"
            />
          </div>
        </div>

        <div class="form__actions">
          <Button type="submit" :loading="isLoading" :disabled="isBusy">
            {{ t('inteligencia.action.analyze') }}
          </Button>
          <Button type="button" variant="secondary" :disabled="isBusy" @click="limpar">
            {{ t('inteligencia.action.clear') }}
          </Button>
        </div>
      </form>
    </SectionPanel>

    <!-- Loading / Initial / Empty state -->
    <p v-if="isLoading" class="state">{{ t('inteligencia.state.loading') }}</p>
    <p v-else-if="!hasSearched" class="state">{{ t('inteligencia.state.initial') }}</p>
    <p v-else-if="!overview" class="state state--empty">{{ t('inteligencia.state.empty') }}</p>

    <template v-else>
      <!-- Section 1: AI Assistant & Diagnosis -->
      <SectionPanel
        :title="t('inteligencia.ai.title')"
        :description="t('inteligencia.ai.description')"
      >
        <div class="ai-hub">
          <!-- Focus tabs -->
          <div class="ai-hub__tabs" role="tablist" aria-label="Foco do diagnóstico">
            <button
              v-for="focus in focusOptions"
              :key="focus.value"
              type="button"
              role="tab"
              class="ai-hub__tab"
              :class="{ 'ai-hub__tab--active': activeFocus === focus.value }"
              :aria-selected="activeFocus === focus.value"
              :disabled="isLoadingAi"
              @click="selecionarFoco(focus.value)"
            >
              <span class="ai-hub__tab-icon" aria-hidden="true">{{ focus.icon }}</span>
              {{ focus.label }}
            </button>
          </div>

          <!-- AI Explanation Content Card -->
          <div class="ai-card">
            <div class="ai-card__header">
              <div class="ai-card__origin">
                <span class="ai-card__badge" :class="`ai-card__badge--${explicacaoAtual?.origem === 'OLLAMA' ? 'ollama' : 'fallback'}`">
                  {{ explicacaoAtual?.origem === 'OLLAMA' ? '🤖 Inteligência Artificial (Ollama)' : '⚙️ Diagnóstico Determinístico' }}
                </span>
                <span v-if="explicacaoAtual?.geradoEm" class="ai-card__time">
                  Atualizado às {{ formatTime(explicacaoAtual.geradoEm) }}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                :loading="isLoadingAi"
                :disabled="isLoadingAi"
                @click="gerarExplicacao(activeFocus)"
              >
                {{ t('inteligencia.ai.action') }}
              </Button>
            </div>

            <div class="ai-card__body">
              <p v-if="isLoadingAi" class="ai-card__loading">
                {{ t('inteligencia.ai.generating') }}
              </p>
              <p v-else-if="aiError" class="ai-card__error" role="alert">
                {{ aiError }}
              </p>
              <div v-else-if="explicacaoAtual" class="ai-card__content">
                <p class="ai-card__text">{{ explicacaoAtual.explicacao }}</p>
                <p v-if="explicacaoAtual.origem === 'FALLBACK'" class="ai-card__fallback-hint">
                  <span aria-hidden="true">ℹ️</span> {{ t('inteligencia.ai.fallback') }}
                </p>
              </div>
              <p v-else class="ai-card__idle">
                Clique no botão para gerar a explicação com IA deste painel.
              </p>
            </div>
          </div>
        </div>
      </SectionPanel>

      <!-- Section 2: Metrics Cards -->
      <SectionPanel
        :title="t('inteligencia.metrics.title')"
        :description="t('inteligencia.metrics.description')"
      >
        <div class="metrics-grid">
          <MetricCard
            icon="💊"
            title="Medicamentos Analisados"
            :value="String(overview.metricas.totalMedicamentosAnalisados)"
            description="Total de itens monitorados no período"
            tone="normal"
          />
          <MetricCard
            icon="🔄"
            title="Reposições Sugeridas"
            :value="String(overview.metricas.totalItensComReposicaoSugerida)"
            description="Itens abaixo do estoque mínimo calculado"
            :tone="overview.metricas.totalItensComReposicaoSugerida > 0 ? 'warning' : 'normal'"
          />
          <MetricCard
            icon="🚨"
            title="Risco de Ruptura"
            :value="String(overview.metricas.totalItensComRiscoRuptura)"
            description="Itens com risco iminente de desabastecimento"
            :tone="overview.metricas.totalItensComRiscoRuptura > 0 ? 'critical' : 'normal'"
          />
          <MetricCard
            icon="⏳"
            title="Risco de Validade"
            :value="String(overview.metricas.totalItensComRiscoValidade)"
            description="Lotes com vencimento próximo sem consumo previsto"
            :tone="overview.metricas.totalItensComRiscoValidade > 0 ? 'warning' : 'normal'"
          />
          <MetricCard
            icon="📈"
            title="Consumo Total"
            :value="formatNumber(overview.metricas.totalConsumoPeriodo)"
            description="Unidades consumidas no período filtrado"
            tone="monitoring"
          />
          <MetricCard
            icon="🛡️"
            title="Cobertura Média"
            :value="`${formatNumber(overview.metricas.coberturaMediaDias)} dias`"
            description="Autonomia média do estoque em dias"
            tone="normal"
          />
        </div>
      </SectionPanel>

      <!-- Section 3: Transfer & Redistribution Opportunities -->
      <SectionPanel
        :title="t('inteligencia.transfers.title')"
        :description="t('inteligencia.transfers.description')"
      >
        <div v-if="overview.reposicoes.length === 0" class="state state--empty">
          {{ t('inteligencia.transfers.empty') }}
        </div>
        <div v-else class="transfers-container">
          <div class="table-scroll">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Medicamento</th>
                  <th scope="col">Quantidade Sugerida</th>
                  <th scope="col">Urgência</th>
                  <th scope="col">Prioridade</th>
                  <th scope="col">Lead Time</th>
                  <th scope="col">Justificativa do Motor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in overview.reposicoes" :key="item.medicamentoId" class="table__row">
                  <td data-label="Medicamento" class="table__cell--strong">
                    {{ item.nomeMedicamento }}
                  </td>
                  <td data-label="Quantidade Sugerida">
                    {{ item.quantidadeSugerida }} un.
                  </td>
                  <td data-label="Urgência">
                    <StatusBadge :tone="urgenciaRelatorioTone(item.urgencia)" :label="urgenciaRelatorioLabel(item.urgencia)" />
                  </td>
                  <td data-label="Prioridade">
                    <StatusBadge :tone="prioridadeRelatorioTone(item.prioridade)" :label="prioridadeRelatorioLabel(item.prioridade)" />
                  </td>
                  <td data-label="Lead Time">
                    {{ item.leadTimeDias !== null ? `${item.leadTimeDias} dias` : '-' }}
                  </td>
                  <td data-label="Justificativa">
                    {{ item.justificativa }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="transfers-action">
            <Button variant="secondary" @click="irParaTransferencias">
              Ir para tela de transferências
            </Button>
          </div>
        </div>
      </SectionPanel>

      <!-- Section 4: Risk Matrix & Alerts -->
      <SectionPanel
        :title="t('inteligencia.alerts.title')"
        :description="t('inteligencia.alerts.description')"
      >
        <div class="alerts-summary">
          <div class="summary-chip summary-chip--critical">
            <span class="summary-chip__value">{{ overview.resumoAlertas.totalRuptura }}</span>
            <span class="summary-chip__label">Rupturas</span>
          </div>
          <div class="summary-chip summary-chip--warning">
            <span class="summary-chip__value">{{ overview.resumoAlertas.totalVencimento }}</span>
            <span class="summary-chip__label">Vencimentos</span>
          </div>
          <div class="summary-chip summary-chip--monitoring">
            <span class="summary-chip__value">{{ overview.resumoAlertas.totalExcessoEstoque }}</span>
            <span class="summary-chip__label">Excesso de Estoque</span>
          </div>
          <div class="summary-chip">
            <span class="summary-chip__value">{{ overview.resumoAlertas.totalItensCriticos }}</span>
            <span class="summary-chip__label">Total Itens Críticos</span>
          </div>
        </div>

        <div v-if="overview.alertas.length === 0" class="state state--empty">
          {{ t('inteligencia.alerts.empty') }}
        </div>
        <div v-else class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Medicamento</th>
                <th scope="col">Tipo de Alerta</th>
                <th scope="col">Severidade</th>
                <th scope="col">Saldo / Em Risco</th>
                <th scope="col">Diagnóstico Operacional</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alerta in overview.alertas" :key="`${alerta.medicamentoId}-${alerta.tipo}-${alerta.severidade}`" class="table__row">
                <td data-label="Medicamento" class="table__cell--strong">
                  {{ alerta.nomeMedicamento }}
                </td>
                <td data-label="Tipo">
                  <StatusBadge :tone="alertaTipoTone(alerta.tipo)" :label="alertaTipoLabel(alerta.tipo)" />
                </td>
                <td data-label="Severidade">
                  <StatusBadge :tone="alertaSeveridadeTone(alerta.severidade)" :label="alertaSeveridadeLabel(alerta.severidade)" />
                </td>
                <td data-label="Saldo / Em Risco">
                  {{ alerta.saldoAtual }} un.
                </td>
                <td data-label="Diagnóstico">
                  {{ alerta.mensagem }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionPanel>

      <!-- Section 5: Consumption Trend -->
      <SectionPanel
        title="Tendência de Consumo & Média Diária"
        description="Padrão histórico de consumo consolidado e distribuição temporal."
      >
        <div class="consumption-overview">
          <div class="consumption-overview__header">
            <div class="consumption-metric">
              <span class="consumption-metric__label">Média Diária</span>
              <span class="consumption-metric__value">{{ formatNumber(overview.consumo.mediaDiaria) }} un/dia</span>
            </div>
            <div class="consumption-metric">
              <span class="consumption-metric__label">Total Consumido</span>
              <span class="consumption-metric__value">{{ formatNumber(overview.consumo.totalConsumido) }} un</span>
            </div>
            <div class="consumption-metric">
              <span class="consumption-metric__label">Tendência</span>
              <StatusBadge
                :tone="tendenciaConsumoTone(overview.consumo.tendencia)"
                :label="tendenciaConsumoLabel(overview.consumo.tendencia)"
              />
            </div>
          </div>

          <div v-if="overview.consumo.pontos.length > 0" class="points-grid">
            <div
              v-for="ponto in overview.consumo.pontos"
              :key="ponto.label"
              class="point-card"
            >
              <span class="point-card__label">{{ ponto.label }}</span>
              <span class="point-card__value">{{ formatNumber(ponto.totalConsumido) }} un</span>
            </div>
          </div>
        </div>
      </SectionPanel>
    </template>
  </main>
</template>

<style scoped>
.inteligencia-page {
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

.feedback--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.feedback--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

.feedback__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

.form {
  display: grid;
  gap: 16px;
}

.form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.state {
  margin: 0;
  padding: 14px 16px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  color: var(--pg-color-text-secondary);
  font-size: 0.85rem;
}

.state--empty {
  color: var(--pg-color-text-muted);
}

/* AI Hub styles */
.ai-hub {
  display: grid;
  gap: 16px;
}

.ai-hub__tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ai-hub__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.ai-hub__tab:hover {
  background: var(--pg-color-blue-50);
  border-color: var(--pg-color-brand-primary);
  color: var(--pg-color-brand-primary);
}

.ai-hub__tab--active {
  background: var(--pg-color-brand-primary);
  border-color: var(--pg-color-brand-primary);
  color: #fff;
}

.ai-hub__tab--active:hover {
  background: var(--pg-color-brand-primary);
  color: #fff;
}

.ai-hub__tab-icon {
  font-size: 0.95rem;
}

.ai-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
}

.ai-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.ai-card__origin {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ai-card__badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.ai-card__badge--ollama {
  background: #ede9fe;
  color: #6d28d9;
}

.ai-card__badge--fallback {
  background: #f1f5f9;
  color: #475569;
}

.ai-card__time {
  font-size: 0.75rem;
  color: var(--pg-color-text-muted);
}

.ai-card__body {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--pg-color-text-primary);
}

.ai-card__text {
  margin: 0;
  font-size: 0.9rem;
}

.ai-card__loading {
  margin: 0;
  color: var(--pg-color-brand-primary);
  font-style: italic;
}

.ai-card__error {
  margin: 0;
  color: var(--pg-color-critical);
}

.ai-card__fallback-hint {
  margin-top: 8px;
  margin-bottom: 0;
  font-size: 0.76rem;
  color: var(--pg-color-text-muted);
}

.ai-card__idle {
  margin: 0;
  color: var(--pg-color-text-muted);
}

/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--pg-gutter);
}

/* Transfers */
.transfers-container {
  display: grid;
  gap: 12px;
}

.transfers-action {
  display: flex;
  justify-content: flex-end;
}

/* Alerts summary */
.alerts-summary {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.summary-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
}

.summary-chip__value {
  font-size: 1rem;
  font-weight: 700;
}

.summary-chip__label {
  font-size: 0.78rem;
  color: var(--pg-color-text-secondary);
}

.summary-chip--critical {
  border-color: var(--pg-color-critical-bg);
  background: var(--pg-color-critical-bg);
  color: var(--pg-color-critical);
}

.summary-chip--warning {
  border-color: var(--pg-color-warning-bg);
  background: var(--pg-color-warning-bg);
  color: var(--pg-color-warning);
}

.summary-chip--monitoring {
  border-color: var(--pg-color-monitoring-bg);
  background: var(--pg-color-monitoring-bg);
  color: var(--pg-color-monitoring);
}

/* Consumption overview */
.consumption-overview {
  display: grid;
  gap: 16px;
}

.consumption-overview__header {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px 16px;
  background: var(--pg-color-blue-50);
  border-radius: var(--pg-radius-sm);
}

.consumption-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.consumption-metric__label {
  font-size: 0.72rem;
  color: var(--pg-color-text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.consumption-metric__value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--pg-color-text-primary);
}

.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

.point-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
}

.point-card__label {
  font-size: 0.75rem;
  color: var(--pg-color-text-muted);
}

.point-card__value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pg-color-text-primary);
}

/* Tables */
.table-scroll {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.table th,
.table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--pg-color-border);
}

.table th {
  font-weight: 600;
  color: var(--pg-color-text-secondary);
  background: var(--pg-color-blue-50);
}

.table__cell--strong {
  font-weight: 600;
  color: var(--pg-color-text-primary);
}

.table__row:hover {
  background: var(--pg-color-blue-50);
}
</style>

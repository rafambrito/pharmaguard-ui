import { alertaSeveridadeTone, alertaTipoLabel } from '@/entities/alerta'
import type { RelatorioAlertas } from '@/entities/alerta'
import type {
  DashboardAlert,
  DashboardOverview,
  DashboardStatus,
  UnitStockSummary,
} from '@/entities/dashboard'
import type { ItemReposicao, RelatorioFiltro } from '@/entities/relatorio'
import { getDashboardOverview } from '@/shared/api/dashboardApi'
import type { DashboardOverviewApiResponse, DashboardOverviewConsumo } from '@/shared/api/dashboardApi'

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function defaultFiltro(): RelatorioFiltro {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)

  return {
    tipo: 'CONSUMO',
    periodoInicio: toDateInput(inicio),
    periodoFim: toDateInput(fim),
    medicamentoId: '',
    categoriaId: '',
    unidadeMedidaId: '',
    fornecedorId: '',
    unidadeSaudeId: '',
  }
}

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}

function formatDecimal(value: number): string {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

function statusByCount(count: number, activeStatus: DashboardStatus): DashboardStatus {
  return count > 0 ? activeStatus : 'normal'
}

const prioridadeLabels: Record<ItemReposicao['prioridade'], string> = {
  ALTA: 'alta',
  MEDIA: 'média',
  BAIXA: 'baixa',
}

const urgenciaMessages: Record<ItemReposicao['urgencia'], string> = {
  CRITICA: 'Há risco crítico de falta ou perda do item.',
  ALTA: 'O estoque precisa de atenção nos próximos dias.',
  MEDIA: 'A reposição ajuda a manter o estoque em nível seguro.',
  BAIXA: 'A reposição é preventiva para manter a cobertura do estoque.',
}

function formatReposicaoReason(item: ItemReposicao): string {
  const leadTime = item.leadTimeDias
    ? ` O prazo médio de abastecimento é de ${item.leadTimeDias} dias.`
    : ''

  return `${urgenciaMessages[item.urgencia]} Prioridade ${prioridadeLabels[item.prioridade]} para compra ou remanejamento.${leadTime}`
}

function mapAlerts(relatorio: RelatorioAlertas): DashboardAlert[] {
  return relatorio.alertas.slice(0, 4).map((alerta) => ({
    id: `${alerta.tipo}-${alerta.medicamentoId}`,
    title: alertaTipoLabel(alerta.tipo),
    description: alerta.descricao,
    unit: 'Todas as unidades',
    status: alertaSeveridadeTone(alerta.severidade),
  }))
}

function mapUnits(response: DashboardOverviewApiResponse): UnitStockSummary[] {
  return response.unidades.map((unidade, index) => {
    const criticalItems = unidade.itensCriticos
    const expiringBatches = unidade.lotesAVencer
    const status = criticalItems > 0 ? 'critical' : statusByCount(expiringBatches, 'warning')

    return {
      id: unidade.unidadeSaudeId?.toString() ?? `geral-${index}`,
      name: unidade.nomeUnidadeSaude ?? 'Todas as unidades',
      criticalItems,
      expiringBatches,
      status,
    }
  })
}

function mapConsumptionTrend(response: DashboardOverviewApiResponse, consumo: DashboardOverviewConsumo) {
  const points = consumo.pontos.length
    ? consumo.pontos.map((ponto) => ({
        label: ponto.label,
        value: Math.round(ponto.totalConsumido),
      }))
    : [
        {
          label: 'Período',
          value: Math.round(consumo.totalConsumido),
        },
      ]

  return {
    periodLabel: `${response.periodoInicio} a ${response.periodoFim}`,
    unitOfMeasure: 'unidades dispensadas',
    points,
  }
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const filtro = defaultFiltro()
  const response = await getDashboardOverview(filtro)
  const { metricas } = response

  return {
    metrics: [
      {
        id: 'medicamentos-analisados',
        icon: '💊',
        title: 'Medicamentos analisados',
        value: formatNumber(metricas.totalMedicamentosAnalisados),
        description: `Cobertura média de ${formatDecimal(metricas.coberturaMediaDias)} dias.`,
        status: 'normal',
      },
      {
        id: 'risco-ruptura',
        icon: '⚠️',
        title: 'Risco de ruptura',
        value: formatNumber(metricas.totalItensComRiscoRuptura),
        description: 'Itens com risco alto ou crítico de ruptura.',
        status: statusByCount(metricas.totalItensComRiscoRuptura, 'critical'),
      },
      {
        id: 'risco-validade',
        icon: '⏳',
        title: 'Risco de validade',
        value: formatNumber(metricas.totalItensComRiscoValidade),
        description: 'Itens com vencimento em atenção no período.',
        status: statusByCount(metricas.totalItensComRiscoValidade, 'warning'),
      },
      {
        id: 'reposicao-sugerida',
        icon: '🔄',
        title: 'Reposições sugeridas',
        value: formatNumber(metricas.totalItensComReposicaoSugerida),
        description: 'Itens com necessidade de reposição calculada.',
        status: statusByCount(metricas.totalItensComReposicaoSugerida, 'monitoring'),
      },
    ],
    alerts: mapAlerts({
      periodoInicio: response.periodoInicio,
      periodoFim: response.periodoFim,
      totalAlertas: response.alertas.length,
      resumo: response.resumoAlertas,
      alertas: response.alertas,
    }),
    units: mapUnits(response),
    transferOpportunities: response.reposicoes.slice(0, 3).map((item) => ({
      id: `reposicao-${item.medicamentoId}`,
      originUnit: 'Reposição',
      destinationUnit: 'Estoque',
      medication: item.nomeMedicamento,
      suggestedQuantity: item.quantidadeSugerida,
      reason: formatReposicaoReason(item),
    })),
    consumptionTrend: mapConsumptionTrend(response, response.consumo),
  }
}
import type { ItemAlerta, ResumoAlertas } from '@/entities/alerta'
import type {
  ItemReposicao,
  MetricasMotorEstatistico,
  RelatorioFiltro,
  TendenciaConsumo,
} from '@/entities/relatorio'
import { httpClient } from '@/shared/api/http/httpClient'

const RESOURCE = '/api/v1/dashboard/overview'

export type DashboardOverviewFiltro = Omit<RelatorioFiltro, 'tipo'>

export interface DashboardOverviewApiResponse {
  periodoInicio: string
  periodoFim: string
  metricas: MetricasMotorEstatistico
  resumoAlertas: ResumoAlertas
  alertas: ItemAlerta[]
  unidades: DashboardOverviewUnidade[]
  reposicoes: ItemReposicao[]
  consumo: DashboardOverviewConsumo
}

export interface DashboardOverviewUnidade {
  unidadeSaudeId: number | null
  nomeUnidadeSaude: string | null
  itensCriticos: number
  lotesAVencer: number
}

export interface DashboardOverviewConsumo {
  totalConsumido: number
  mediaDiaria: number
  tendencia: TendenciaConsumo
  pontos: DashboardOverviewConsumoPonto[]
}

export interface DashboardOverviewConsumoPonto {
  periodoInicio: string
  periodoFim: string
  label: string
  totalConsumido: number
}

function toParams(filtro: DashboardOverviewFiltro): Record<string, string> {
  return Object.fromEntries(Object.entries(filtro).filter(([, value]) => value))
}

export async function getDashboardOverview(
  filtro: DashboardOverviewFiltro,
): Promise<DashboardOverviewApiResponse> {
  const response = await httpClient.get<DashboardOverviewApiResponse>(RESOURCE, {
    params: toParams(filtro),
  })
  return response.data
}
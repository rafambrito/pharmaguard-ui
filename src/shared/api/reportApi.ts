import { httpClient } from '@/shared/api/http/httpClient'
import type {
  MetricasMotorEstatistico,
  RelatorioConsumo,
  RelatorioEstoqueMinimo,
  RelatorioFiltro,
  RelatorioProdutosCriticos,
  RelatorioReposicao,
  RelatorioVencimentos,
} from '@/entities/relatorio'

const RESOURCE = '/api/v1/relatorios'

function toParams(filtro: RelatorioFiltro): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      periodoInicio: filtro.periodoInicio,
      periodoFim: filtro.periodoFim,
      medicamentoId: filtro.medicamentoId,
      categoriaId: filtro.categoriaId,
      unidadeMedidaId: filtro.unidadeMedidaId,
      fornecedorId: filtro.fornecedorId,
      unidadeSaudeId: filtro.unidadeSaudeId,
    }).filter(([, value]) => value),
  )
}

export async function getRelatorioConsumo(filtro: RelatorioFiltro): Promise<RelatorioConsumo> {
  const response = await httpClient.get<RelatorioConsumo>(`${RESOURCE}/consumo`, {
    params: toParams(filtro),
  })
  return response.data
}

export async function getRelatorioProdutosCriticos(
  filtro: RelatorioFiltro,
): Promise<RelatorioProdutosCriticos> {
  const response = await httpClient.get<RelatorioProdutosCriticos>(`${RESOURCE}/produtos-criticos`, {
    params: toParams(filtro),
  })
  return response.data
}

export async function getRelatorioEstoqueMinimo(
  filtro: RelatorioFiltro,
): Promise<RelatorioEstoqueMinimo> {
  const response = await httpClient.get<RelatorioEstoqueMinimo>(`${RESOURCE}/estoque-minimo`, {
    params: toParams(filtro),
  })
  return response.data
}

export async function getRelatorioVencimentos(
  filtro: RelatorioFiltro,
): Promise<RelatorioVencimentos> {
  const response = await httpClient.get<RelatorioVencimentos>(`${RESOURCE}/vencimentos`, {
    params: toParams(filtro),
  })
  return response.data
}

export async function getRelatorioReposicao(filtro: RelatorioFiltro): Promise<RelatorioReposicao> {
  const response = await httpClient.get<RelatorioReposicao>(`${RESOURCE}/reposicao`, {
    params: toParams(filtro),
  })
  return response.data
}

export async function getMetricasMotorEstatistico(
  filtro: RelatorioFiltro,
): Promise<MetricasMotorEstatistico> {
  const response = await httpClient.get<MetricasMotorEstatistico>(`${RESOURCE}/metricas-motor`, {
    params: toParams(filtro),
  })
  return response.data
}
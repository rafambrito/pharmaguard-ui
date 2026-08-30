import { httpClient } from '@/shared/api/http/httpClient'
import type { AlertaFiltro, RelatorioAlertas } from '@/entities/alerta'

const RESOURCE = '/api/v1/relatorios/alertas'

function toParams(filtro: AlertaFiltro): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      periodoInicio: filtro.periodoInicio,
      periodoFim: filtro.periodoFim,
      medicamentoId: filtro.medicamentoId,
      unidadeSaudeId: filtro.unidadeSaudeId,
    }).filter(([, value]) => value),
  )
}

export async function getRelatorioAlertas(filtro: AlertaFiltro): Promise<RelatorioAlertas> {
  const response = await httpClient.get<RelatorioAlertas>(RESOURCE, { params: toParams(filtro) })
  return response.data
}
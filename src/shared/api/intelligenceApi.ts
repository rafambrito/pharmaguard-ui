import { httpClient } from '@/shared/api/http/httpClient'

const RESOURCE = '/api/v1/intelligence/explicar'

export type TipoPainelInsight =
  | 'ALERTAS'
  | 'CONSUMO'
  | 'METRICAS'
  | 'TRANSFERENCIAS'
  | 'ESTOQUE_POR_UNIDADE'
  | 'DIAGNOSTICO_GERAL'

export interface ExplicarPainelRequest {
  tipoPainel: TipoPainelInsight
  periodoInicio: string
  periodoFim: string
  medicamentoId?: number
  categoriaId?: number
  unidadeMedidaId?: number
  fornecedorId?: number
  unidadeSaudeId?: number
}

export interface ExplicacaoPainelResponse {
  tipoPainel: TipoPainelInsight
  explicacao: string
  origem: 'OLLAMA' | 'FALLBACK'
  geradoEm: string
}

export async function explicarPainel(
  request: ExplicarPainelRequest,
): Promise<ExplicacaoPainelResponse> {
  const response = await httpClient.post<ExplicacaoPainelResponse>(RESOURCE, request)
  return response.data
}
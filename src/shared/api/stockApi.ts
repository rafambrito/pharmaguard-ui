import { httpClient } from '@/shared/api/http/httpClient'
import type {
  LoteVencimentoEstoque,
  MovimentacaoEstoque,
  MovimentacaoEstoqueTipo,
  SaldoEstoque,
  SaldoLoteEstoque,
} from '@/entities/estoque'

const RESOURCE = '/api/v1/estoque'

export interface MovimentacaoEstoqueQuery {
  unidadeId: number
  medicamentoId?: number
  loteId?: number
  tipo?: MovimentacaoEstoqueTipo
  dataInicial?: string
  dataFinal?: string
}

export async function getSaldoEstoque(
  medicamentoId: number,
  unidadeId: number,
): Promise<SaldoEstoque> {
  const response = await httpClient.get<SaldoEstoque>(`${RESOURCE}/saldos/${medicamentoId}`, {
    params: { unidadeId },
  })
  return response.data
}

export async function listSaldosLoteEstoque(
  medicamentoId: number,
  unidadeId: number,
): Promise<SaldoLoteEstoque[]> {
  const response = await httpClient.get<SaldoLoteEstoque[]>(
    `${RESOURCE}/saldos/${medicamentoId}/lotes`,
    { params: { unidadeId } },
  )
  return response.data
}

export async function listMovimentacoesEstoque(
  query: MovimentacaoEstoqueQuery,
): Promise<MovimentacaoEstoque[]> {
  const response = await httpClient.get<MovimentacaoEstoque[]>(`${RESOURCE}/movimentacoes`, {
    params: query,
  })
  return response.data
}

export async function listVencimentosEstoque(
  diasParaVencer: number,
): Promise<LoteVencimentoEstoque[]> {
  const response = await httpClient.get<LoteVencimentoEstoque[]>(`${RESOURCE}/vencimentos`, {
    params: { diasParaVencer },
  })
  return response.data
}
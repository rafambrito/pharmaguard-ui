import { httpClient } from '@/shared/api/http/httpClient'
import type { EntradaEstoque, LoteMedicamento, NovaEntradaEstoque } from '@/entities/entrada-estoque'

const ENTRADAS_RESOURCE = '/api/v1/estoque/entradas'
const MEDICAMENTOS_RESOURCE = '/api/v1/medicamentos'

export interface EntradaEstoqueQuery {
  unidadeId: number
  medicamentoId?: number
  loteId?: number
}

export async function createEntradaEstoque(payload: NovaEntradaEstoque): Promise<EntradaEstoque> {
  const response = await httpClient.post<EntradaEstoque>(ENTRADAS_RESOURCE, payload)
  return response.data
}

export async function listEntradasEstoque(query: EntradaEstoqueQuery): Promise<EntradaEstoque[]> {
  const response = await httpClient.get<EntradaEstoque[]>(ENTRADAS_RESOURCE, { params: query })
  return response.data
}

export async function getEntradaEstoque(id: number): Promise<EntradaEstoque> {
  const response = await httpClient.get<EntradaEstoque>(`${ENTRADAS_RESOURCE}/${id}`)
  return response.data
}

export async function listLotesMedicamento(medicamentoId: number): Promise<LoteMedicamento[]> {
  const response = await httpClient.get<LoteMedicamento[]>(`${MEDICAMENTOS_RESOURCE}/${medicamentoId}/lotes`)
  return response.data
}
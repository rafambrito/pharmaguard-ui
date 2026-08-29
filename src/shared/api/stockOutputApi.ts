import { httpClient } from '@/shared/api/http/httpClient'
import type { NovaSaidaEstoque, SaidaEstoque } from '@/entities/saida-estoque'

const RESOURCE = '/api/v1/estoque/saidas'

export interface SaidaEstoqueQuery {
  unidadeId: number
  medicamentoId?: number
}

export async function createSaidaEstoque(payload: NovaSaidaEstoque): Promise<SaidaEstoque> {
  const response = await httpClient.post<SaidaEstoque>(RESOURCE, payload)
  return response.data
}

export async function listSaidasEstoque(query: SaidaEstoqueQuery): Promise<SaidaEstoque[]> {
  const response = await httpClient.get<SaidaEstoque[]>(RESOURCE, { params: query })
  return response.data
}

export async function getSaidaEstoque(id: number): Promise<SaidaEstoque> {
  const response = await httpClient.get<SaidaEstoque>(`${RESOURCE}/${id}`)
  return response.data
}
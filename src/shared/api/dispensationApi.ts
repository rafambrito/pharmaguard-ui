import type { Dispensacao, NovaDispensacao } from '@/entities/dispensacao'
import { httpClient } from '@/shared/api/http/httpClient'

const RESOURCE = '/api/v1/dispensacoes'

export interface DispensacaoQuery {
  unidadeId?: number
  pacienteId?: number
  medicamentoId?: number
  dataInicial?: string
  dataFinal?: string
}

export async function createDispensacao(payload: NovaDispensacao): Promise<Dispensacao> {
  const response = await httpClient.post<Dispensacao>(RESOURCE, payload)
  return response.data
}

export async function listDispensacoes(query: DispensacaoQuery = {}): Promise<Dispensacao[]> {
  const response = await httpClient.get<Dispensacao[]>(RESOURCE, { params: query })
  return response.data
}

export async function getDispensacao(id: number): Promise<Dispensacao> {
  const response = await httpClient.get<Dispensacao>(`${RESOURCE}/${id}`)
  return response.data
}
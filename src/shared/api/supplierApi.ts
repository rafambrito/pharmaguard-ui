import { httpClient } from '@/shared/api/http/httpClient'
import type { AtualizacaoFornecedor, Fornecedor, NovoFornecedor } from '@/entities/fornecedor'

const RESOURCE = '/api/v1/fornecedores'

export async function listFornecedores(): Promise<Fornecedor[]> {
  const response = await httpClient.get<Fornecedor[]>(RESOURCE)
  return response.data
}

export async function getFornecedor(id: number): Promise<Fornecedor> {
  const response = await httpClient.get<Fornecedor>(`${RESOURCE}/${id}`)
  return response.data
}

export async function createFornecedor(payload: NovoFornecedor): Promise<Fornecedor> {
  const response = await httpClient.post<Fornecedor>(RESOURCE, payload)
  return response.data
}

export async function updateFornecedor(
  id: number,
  payload: AtualizacaoFornecedor,
): Promise<Fornecedor> {
  const response = await httpClient.put<Fornecedor>(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function deleteFornecedor(id: number): Promise<void> {
  await httpClient.delete(`${RESOURCE}/${id}`)
}
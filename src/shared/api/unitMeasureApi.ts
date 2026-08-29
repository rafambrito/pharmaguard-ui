import { httpClient } from '@/shared/api/http/httpClient'
import type {
  AtualizacaoUnidadeMedida,
  NovaUnidadeMedida,
  UnidadeMedida,
} from '@/entities/unidade-medida'

const RESOURCE = '/api/v1/unidades-medida'

export async function listUnidadesMedida(): Promise<UnidadeMedida[]> {
  const response = await httpClient.get<UnidadeMedida[]>(RESOURCE)
  return response.data
}

export async function getUnidadeMedida(id: number): Promise<UnidadeMedida> {
  const response = await httpClient.get<UnidadeMedida>(`${RESOURCE}/${id}`)
  return response.data
}

export async function createUnidadeMedida(payload: NovaUnidadeMedida): Promise<UnidadeMedida> {
  const response = await httpClient.post<UnidadeMedida>(RESOURCE, payload)
  return response.data
}

export async function updateUnidadeMedida(
  id: number,
  payload: AtualizacaoUnidadeMedida,
): Promise<UnidadeMedida> {
  const response = await httpClient.put<UnidadeMedida>(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function deleteUnidadeMedida(id: number): Promise<void> {
  await httpClient.delete(`${RESOURCE}/${id}`)
}
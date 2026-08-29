import { httpClient } from '@/shared/api/http/httpClient'
import type {
  AtualizacaoUnidadeSaude,
  NovaUnidadeSaude,
  UnidadeSaude,
} from '@/entities/unidade-saude'

const RESOURCE = '/api/v1/unidades-saude'

export async function listUnidadesSaude(): Promise<UnidadeSaude[]> {
  const response = await httpClient.get<UnidadeSaude[]>(RESOURCE)
  return response.data
}

export async function getUnidadeSaude(id: number): Promise<UnidadeSaude> {
  const response = await httpClient.get<UnidadeSaude>(`${RESOURCE}/${id}`)
  return response.data
}

export async function createUnidadeSaude(payload: NovaUnidadeSaude): Promise<UnidadeSaude> {
  const response = await httpClient.post<UnidadeSaude>(RESOURCE, payload)
  return response.data
}

export async function updateUnidadeSaude(
  id: number,
  payload: AtualizacaoUnidadeSaude,
): Promise<UnidadeSaude> {
  const response = await httpClient.put<UnidadeSaude>(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function inactivateUnidadeSaude(id: number): Promise<void> {
  await httpClient.delete(`${RESOURCE}/${id}`)
}
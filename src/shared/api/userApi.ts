import { httpClient } from '@/shared/api/http/httpClient'
import type { AtualizacaoUsuario, NovoUsuario, Usuario } from '@/entities/usuario'

const RESOURCE = '/api/v1/usuarios'

export async function listUsuarios(): Promise<Usuario[]> {
  const response = await httpClient.get<Usuario[]>(RESOURCE)
  return response.data
}

export async function getUsuario(id: number): Promise<Usuario> {
  const response = await httpClient.get<Usuario>(`${RESOURCE}/${id}`)
  return response.data
}

export async function createUsuario(payload: NovoUsuario): Promise<Usuario> {
  const response = await httpClient.post<Usuario>(RESOURCE, payload)
  return response.data
}

export async function updateUsuario(id: number, payload: AtualizacaoUsuario): Promise<Usuario> {
  const response = await httpClient.put<Usuario>(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function deleteUsuario(id: number): Promise<void> {
  await httpClient.delete(`${RESOURCE}/${id}`)
}

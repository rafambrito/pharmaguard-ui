import { httpClient } from '@/shared/api/http/httpClient'

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  login: string
  tipo: string
  status: string
}

export async function listUsuarios(): Promise<UsuarioResponse[]> {
  const response = await httpClient.get<UsuarioResponse[]>('/api/v1/usuarios')
  return response.data
}

import { httpClient } from '@/shared/api/http/httpClient'

export interface LoginRequest {
  usuario: string
  senha: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface RefreshSessionRequest {
  refreshToken: string
}

export async function login(request: LoginRequest): Promise<TokenResponse> {
  const response = await httpClient.post<TokenResponse>('/api/v1/auth/login', request)
  return response.data
}

export async function refreshSession(request: RefreshSessionRequest): Promise<TokenResponse> {
  const response = await httpClient.post<TokenResponse>('/api/v1/auth/refresh-token', request)
  return response.data
}

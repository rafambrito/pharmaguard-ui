export interface SessionPrincipal {
  username: string
  roles: string[]
}

export interface SessionTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface SessionState {
  principal: SessionPrincipal | null
  tokens: SessionTokens | null
}

export interface LoginPayload {
  usuario: string
  senha: string
}

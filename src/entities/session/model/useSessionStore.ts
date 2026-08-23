import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearSession, loadSession, saveSession } from '@/entities/session/model/storage'
import type { LoginPayload, SessionPrincipal, SessionState, SessionTokens } from '@/entities/session/model/types'
import { login, refreshSession } from '@/shared/api/authApi'
import { setHttpAccessToken } from '@/shared/api/http/httpClient'
import { parseJwtPayload } from '@/shared/lib/auth/jwt'

function buildPrincipalFromToken(token: string, fallbackUsername: string): SessionPrincipal {
  const payload = parseJwtPayload(token)
  const username = payload?.preferred_username ?? payload?.sub ?? fallbackUsername
  const roleList = payload?.roles ?? payload?.authorities ?? []

  return {
    username,
    roles: roleList,
  }
}

export const useSessionStore = defineStore('session', () => {
  const principal = ref<SessionPrincipal | null>(null)
  const tokens = ref<SessionTokens | null>(null)

  const isAuthenticated = computed(() => Boolean(tokens.value?.accessToken))
  const accessToken = computed(() => tokens.value?.accessToken ?? null)
  const currentRoles = computed(() => principal.value?.roles ?? [])

  function syncHttpToken(): void {
    setHttpAccessToken(tokens.value?.accessToken ?? null)
  }

  function setSession(nextPrincipal: SessionPrincipal, nextTokens: SessionTokens): void {
    principal.value = nextPrincipal
    tokens.value = nextTokens
    syncHttpToken()

    const state: SessionState = {
      principal: nextPrincipal,
      tokens: nextTokens,
    }
    saveSession(state)
  }

  function hydrateFromStorage(): void {
    const saved = loadSession()
    if (!saved?.tokens || !saved.principal) {
      return
    }

    principal.value = saved.principal
    tokens.value = saved.tokens
    syncHttpToken()
  }

  async function signIn(payload: LoginPayload): Promise<void> {
    const tokenResponse = await login(payload)
    const nextTokens: SessionTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      tokenType: tokenResponse.tokenType,
    }

    const nextPrincipal = buildPrincipalFromToken(nextTokens.accessToken, payload.usuario)
    setSession(nextPrincipal, nextTokens)
  }

  async function renewSession(): Promise<boolean> {
    if (!tokens.value?.refreshToken) {
      return false
    }

    try {
      const tokenResponse = await refreshSession({ refreshToken: tokens.value.refreshToken })
      const nextTokens: SessionTokens = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        tokenType: tokenResponse.tokenType,
      }

      const username = principal.value?.username ?? 'usuario'
      const nextPrincipal = buildPrincipalFromToken(nextTokens.accessToken, username)
      setSession(nextPrincipal, nextTokens)
      return true
    } catch {
      signOut()
      return false
    }
  }

  function signOut(): void {
    principal.value = null
    tokens.value = null
    syncHttpToken()
    clearSession()
  }

  return {
    principal,
    tokens,
    isAuthenticated,
    accessToken,
    currentRoles,
    hydrateFromStorage,
    signIn,
    renewSession,
    signOut,
  }
})

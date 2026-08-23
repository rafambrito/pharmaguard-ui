import type { SessionState } from '@/entities/session/model/types'

const SESSION_STORAGE_KEY = 'pharmaguard:session'

export function saveSession(session: SessionState): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function loadSession(): SessionState | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SessionState
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

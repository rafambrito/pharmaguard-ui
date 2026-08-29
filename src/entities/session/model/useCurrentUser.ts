import { computed } from 'vue'
import { useSessionStore } from '@/entities/session/model/useSessionStore'

const FALLBACK_DISPLAY_NAME = 'visitante'

export function useCurrentUser() {
  const sessionStore = useSessionStore()

  const displayName = computed(() => {
    const username = sessionStore.principal?.username?.trim()
    return username && username.length > 0 ? username : FALLBACK_DISPLAY_NAME
  })

  const primaryRole = computed(() => sessionStore.principal?.roles?.[0] ?? '')

  return { displayName, primaryRole }
}

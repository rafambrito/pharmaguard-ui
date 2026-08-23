import type { App } from 'vue'
import { router } from '@/app/router'
import { createPiniaStore } from '@/app/providers/pinia'
import { useSessionStore } from '@/entities/session'

export function installProviders(app: App<Element>): void {
  const pinia = createPiniaStore()

  app.use(pinia)

  const sessionStore = useSessionStore(pinia)
  sessionStore.hydrateFromStorage()

  app.use(router)
}

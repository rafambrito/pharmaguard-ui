import { createPinia, type Pinia } from 'pinia'

export const pinia = createPinia()

export function createPiniaStore(): Pinia {
  return pinia
}

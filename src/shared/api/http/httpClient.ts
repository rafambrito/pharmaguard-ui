import axios from 'axios'
import { appConfig } from '@/shared/config'

let accessToken: string | null = null

export function setHttpAccessToken(token: string | null): void {
  accessToken = token
}

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  if (!accessToken) {
    return config
  }

  if (config.headers?.set) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  } else {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return config
})

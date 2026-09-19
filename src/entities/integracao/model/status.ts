import type { IntegracaoStatus } from './types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const STATUS_LABELS: Record<IntegracaoStatus, string> = {
  DISPONIVEL: 'Disponível (mock)',
  EM_BREVE: 'Em breve',
  CONECTADA: 'Conectada',
}

const STATUS_TONES: Record<IntegracaoStatus, StatusTone> = {
  DISPONIVEL: 'monitoring',
  EM_BREVE: 'warning',
  CONECTADA: 'normal',
}

export function integracaoStatusLabel(status: IntegracaoStatus): string {
  return STATUS_LABELS[status]
}

export function integracaoStatusTone(status: IntegracaoStatus): StatusTone {
  return STATUS_TONES[status]
}

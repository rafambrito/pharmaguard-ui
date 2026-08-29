import type { UnidadeMedidaStatus } from '@/entities/unidade-medida/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const labels: Record<UnidadeMedidaStatus, string> = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
}

const tones: Record<UnidadeMedidaStatus, StatusTone> = {
  ATIVA: 'normal',
  INATIVA: 'warning',
}

export function unidadeMedidaStatusLabel(status: UnidadeMedidaStatus): string {
  return labels[status]
}

export function unidadeMedidaStatusTone(status: UnidadeMedidaStatus): StatusTone {
  return tones[status]
}
import type { UnidadeSaudeStatus } from '@/entities/unidade-saude/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const labels: Record<UnidadeSaudeStatus, string> = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
}

const tones: Record<UnidadeSaudeStatus, StatusTone> = {
  ATIVA: 'normal',
  INATIVA: 'warning',
}

export function unidadeSaudeStatusLabel(status: UnidadeSaudeStatus): string {
  return labels[status]
}

export function unidadeSaudeStatusTone(status: UnidadeSaudeStatus): StatusTone {
  return tones[status]
}
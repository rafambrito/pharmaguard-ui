import type { UsuarioStatus } from '@/entities/usuario/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const tones: Record<UsuarioStatus, StatusTone> = {
  ATIVO: 'normal',
  INATIVO: 'monitoring',
  BLOQUEADO: 'critical',
}

const labels: Record<UsuarioStatus, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  BLOQUEADO: 'Bloqueado',
}

export function usuarioStatusTone(status: UsuarioStatus): StatusTone {
  return tones[status] ?? 'monitoring'
}

export function usuarioStatusLabel(status: UsuarioStatus): string {
  return labels[status] ?? status
}

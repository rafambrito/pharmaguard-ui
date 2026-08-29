import type { MedicamentoStatus } from '@/entities/medicamento/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const labels: Record<MedicamentoStatus, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
}

const tones: Record<MedicamentoStatus, StatusTone> = {
  ATIVO: 'normal',
  INATIVO: 'warning',
}

export function medicamentoStatusLabel(status: MedicamentoStatus): string {
  return labels[status]
}

export function medicamentoStatusTone(status: MedicamentoStatus): StatusTone {
  return tones[status]
}
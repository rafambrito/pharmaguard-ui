import type { MedicamentoCriticidade } from '@/entities/medicamento/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const labels: Record<MedicamentoCriticidade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
}

const tones: Record<MedicamentoCriticidade, StatusTone> = {
  BAIXA: 'normal',
  MEDIA: 'monitoring',
  ALTA: 'warning',
  CRITICA: 'critical',
}

export function medicamentoCriticidadeLabel(criticidade: MedicamentoCriticidade): string {
  return labels[criticidade]
}

export function medicamentoCriticidadeTone(criticidade: MedicamentoCriticidade): StatusTone {
  return tones[criticidade]
}
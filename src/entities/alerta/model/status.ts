import type { AlertaSeveridade, AlertaTipo } from '@/entities/alerta/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const tipoLabels: Record<AlertaTipo, string> = {
  RUPTURA: 'Ruptura',
  VENCIMENTO: 'Vencimento',
  EXCESSO_ESTOQUE: 'Excesso de estoque',
}

const severidadeLabels: Record<AlertaSeveridade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
}

const severidadeTones: Record<AlertaSeveridade, StatusTone> = {
  BAIXA: 'normal',
  MEDIA: 'monitoring',
  ALTA: 'warning',
  CRITICA: 'critical',
}

const tipoTones: Record<AlertaTipo, StatusTone> = {
  RUPTURA: 'critical',
  VENCIMENTO: 'warning',
  EXCESSO_ESTOQUE: 'monitoring',
}

export function alertaTipoLabel(tipo: AlertaTipo): string {
  return tipoLabels[tipo] ?? tipo
}

export function alertaTipoTone(tipo: AlertaTipo): StatusTone {
  return tipoTones[tipo] ?? 'monitoring'
}

export function alertaSeveridadeLabel(severidade: AlertaSeveridade): string {
  return severidadeLabels[severidade] ?? severidade
}

export function alertaSeveridadeTone(severidade: AlertaSeveridade): StatusTone {
  return severidadeTones[severidade] ?? 'monitoring'
}
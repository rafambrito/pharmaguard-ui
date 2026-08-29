import type { MovimentacaoEstoqueTipo, StatusValidade } from '@/entities/estoque/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const movimentacaoLabels: Record<MovimentacaoEstoqueTipo, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE: 'Ajuste',
}

const movimentacaoTones: Record<MovimentacaoEstoqueTipo, StatusTone> = {
  ENTRADA: 'normal',
  SAIDA: 'monitoring',
  AJUSTE: 'warning',
}

const validadeLabels: Record<StatusValidade, string> = {
  VALIDO: 'Válido',
  PROXIMO_VENCIMENTO: 'Próximo do vencimento',
  VENCIDO: 'Vencido',
}

const validadeTones: Record<StatusValidade, StatusTone> = {
  VALIDO: 'normal',
  PROXIMO_VENCIMENTO: 'warning',
  VENCIDO: 'critical',
}

export function movimentacaoEstoqueTipoLabel(tipo: MovimentacaoEstoqueTipo): string {
  return movimentacaoLabels[tipo]
}

export function movimentacaoEstoqueTipoTone(tipo: MovimentacaoEstoqueTipo): StatusTone {
  return movimentacaoTones[tipo]
}

export function statusValidadeLabel(status: StatusValidade): string {
  return validadeLabels[status]
}

export function statusValidadeTone(status: StatusValidade): StatusTone {
  return validadeTones[status]
}
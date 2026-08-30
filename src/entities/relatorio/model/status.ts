import type {
  PrioridadeRelatorio,
  RelatorioTipo,
  RiscoRelatorio,
  SeveridadeVencimento,
  StatusEstoqueRelatorio,
  StatusValidadeRelatorio,
  TendenciaConsumo,
  UrgenciaRelatorio,
} from '@/entities/relatorio/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const relatorioTipoLabels: Record<RelatorioTipo, string> = {
  CONSUMO: 'Consumo histórico',
  PRODUTOS_CRITICOS: 'Produtos críticos',
  ESTOQUE_MINIMO: 'Estoque mínimo',
  VENCIMENTOS: 'Vencimentos',
  REPOSICAO: 'Reposição',
}

const tendenciaLabels: Record<TendenciaConsumo, string> = {
  CRESCENTE: 'Crescente',
  ESTAVEL: 'Estável',
  DECRESCENTE: 'Decrescente',
}

const riscoLabels: Record<RiscoRelatorio, string> = {
  BAIXO: 'Baixo',
  MEDIO: 'Médio',
  ALTO: 'Alto',
  CRITICO: 'Crítico',
}

const urgenciaLabels: Record<UrgenciaRelatorio, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
}

const prioridadeLabels: Record<PrioridadeRelatorio, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
}

const statusEstoqueLabels: Record<StatusEstoqueRelatorio, string> = {
  NORMAL: 'Normal',
  BAIXO: 'Baixo',
  RUPTURA: 'Ruptura',
}

const statusValidadeLabels: Record<StatusValidadeRelatorio, string> = {
  VALIDO: 'Válido',
  PROXIMO_VENCIMENTO: 'Próximo do vencimento',
  VENCIDO: 'Vencido',
}

const severityTones: Record<RiscoRelatorio | SeveridadeVencimento | UrgenciaRelatorio, StatusTone> = {
  BAIXO: 'normal',
  BAIXA: 'normal',
  MEDIO: 'monitoring',
  MEDIA: 'monitoring',
  ALTO: 'warning',
  ALTA: 'warning',
  CRITICO: 'critical',
  CRITICA: 'critical',
}

const tendenciaTones: Record<TendenciaConsumo, StatusTone> = {
  CRESCENTE: 'warning',
  ESTAVEL: 'normal',
  DECRESCENTE: 'monitoring',
}

const prioridadeTones: Record<PrioridadeRelatorio, StatusTone> = {
  BAIXA: 'normal',
  MEDIA: 'monitoring',
  ALTA: 'warning',
}

const statusEstoqueTones: Record<StatusEstoqueRelatorio, StatusTone> = {
  NORMAL: 'normal',
  BAIXO: 'warning',
  RUPTURA: 'critical',
}

const statusValidadeTones: Record<StatusValidadeRelatorio, StatusTone> = {
  VALIDO: 'normal',
  PROXIMO_VENCIMENTO: 'warning',
  VENCIDO: 'critical',
}

export function relatorioTipoLabel(tipo: RelatorioTipo): string {
  return relatorioTipoLabels[tipo] ?? tipo
}

export function tendenciaConsumoLabel(tendencia: TendenciaConsumo): string {
  return tendenciaLabels[tendencia] ?? tendencia
}

export function tendenciaConsumoTone(tendencia: TendenciaConsumo): StatusTone {
  return tendenciaTones[tendencia] ?? 'monitoring'
}

export function riscoRelatorioLabel(risco: RiscoRelatorio): string {
  return riscoLabels[risco] ?? risco
}

export function riscoRelatorioTone(risco: RiscoRelatorio): StatusTone {
  return severityTones[risco] ?? 'monitoring'
}

export function urgenciaRelatorioLabel(urgencia: UrgenciaRelatorio): string {
  return urgenciaLabels[urgencia] ?? urgencia
}

export function urgenciaRelatorioTone(urgencia: UrgenciaRelatorio): StatusTone {
  return severityTones[urgencia] ?? 'monitoring'
}

export function prioridadeRelatorioLabel(prioridade: PrioridadeRelatorio): string {
  return prioridadeLabels[prioridade] ?? prioridade
}

export function prioridadeRelatorioTone(prioridade: PrioridadeRelatorio): StatusTone {
  return prioridadeTones[prioridade] ?? 'monitoring'
}

export function statusEstoqueRelatorioLabel(status: StatusEstoqueRelatorio): string {
  return statusEstoqueLabels[status] ?? status
}

export function statusEstoqueRelatorioTone(status: StatusEstoqueRelatorio): StatusTone {
  return statusEstoqueTones[status] ?? 'monitoring'
}

export function statusValidadeRelatorioLabel(status: StatusValidadeRelatorio): string {
  return statusValidadeLabels[status] ?? status
}

export function statusValidadeRelatorioTone(status: StatusValidadeRelatorio): StatusTone {
  return statusValidadeTones[status] ?? 'monitoring'
}
import type { FornecedorStatus, LeadTimeStatus } from '@/entities/fornecedor/model/types'

type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

const fornecedorStatusLabels: Record<FornecedorStatus, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
}

const fornecedorStatusTones: Record<FornecedorStatus, StatusTone> = {
  ATIVO: 'normal',
  INATIVO: 'warning',
}

const leadTimeStatusLabels: Record<LeadTimeStatus, string> = {
  USUAL: 'Usual',
  ELEVADO: 'Elevado',
}

const leadTimeStatusTones: Record<LeadTimeStatus, StatusTone> = {
  USUAL: 'normal',
  ELEVADO: 'warning',
}

export function fornecedorStatusLabel(status: FornecedorStatus): string {
  return fornecedorStatusLabels[status]
}

export function fornecedorStatusTone(status: FornecedorStatus): StatusTone {
  return fornecedorStatusTones[status]
}

export function leadTimeStatusLabel(status: LeadTimeStatus): string {
  return leadTimeStatusLabels[status]
}

export function leadTimeStatusTone(status: LeadTimeStatus): StatusTone {
  return leadTimeStatusTones[status]
}
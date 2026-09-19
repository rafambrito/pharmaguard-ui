import type { PacienteStatus } from '@/entities/paciente/model/types'

export function pacienteStatusLabel(status: PacienteStatus): string {
  return status === 'ATIVO' ? 'Ativo' : 'Inativo'
}

export function pacienteStatusTone(status: PacienteStatus): 'normal' | 'monitoring' {
  return status === 'ATIVO' ? 'normal' : 'monitoring'
}
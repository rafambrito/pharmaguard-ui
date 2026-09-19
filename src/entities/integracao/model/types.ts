import type { IconName } from '@/shared/ui/atoms/Icon/iconNames'

export const INTEGRACAO_STATUS = ['DISPONIVEL', 'EM_BREVE', 'CONECTADA'] as const

export type IntegracaoStatus = (typeof INTEGRACAO_STATUS)[number]

export interface Integracao {
  id: string
  nome: string
  descricao: string
  orgao: string
  status: IntegracaoStatus
  icon: IconName
}

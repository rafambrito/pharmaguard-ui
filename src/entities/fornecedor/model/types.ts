export const FORNECEDOR_STATUS = ['ATIVO', 'INATIVO'] as const

export type FornecedorStatus = (typeof FORNECEDOR_STATUS)[number]

export type LeadTimeStatus = 'USUAL' | 'ELEVADO'

export interface Fornecedor {
  id: number
  nome: string
  codigo: string
  documento: string | null
  observacao: string | null
  leadTimeDias: number | null
  statusLeadTime: LeadTimeStatus | null
  ativo: boolean
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface NovoFornecedor {
  nome: string
  codigo: string
  documento?: string
  observacao?: string
  leadTimeDias: number
}

export interface AtualizacaoFornecedor extends NovoFornecedor {
  ativo?: boolean
}

export interface FornecedorFiltro {
  nome: string
  codigo: string
  documento: string
  observacao: string
  leadTimeDias: string
  status: FornecedorStatus | ''
}
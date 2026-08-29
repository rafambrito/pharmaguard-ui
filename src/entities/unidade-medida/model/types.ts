export const UNIDADE_MEDIDA_STATUS = ['ATIVA', 'INATIVA'] as const

export type UnidadeMedidaStatus = (typeof UNIDADE_MEDIDA_STATUS)[number]

export interface UnidadeMedida {
  id: number
  nome: string
  sigla: string
  ativo: boolean
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface NovaUnidadeMedida {
  nome: string
  sigla: string
}

export interface AtualizacaoUnidadeMedida extends NovaUnidadeMedida {
  ativo?: boolean
}

export interface UnidadeMedidaFiltro {
  nome: string
  sigla: string
  status: UnidadeMedidaStatus | ''
}
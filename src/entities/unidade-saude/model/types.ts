export const UNIDADE_SAUDE_STATUS = ['ATIVA', 'INATIVA'] as const

export type UnidadeSaudeStatus = (typeof UNIDADE_SAUDE_STATUS)[number]

export interface UnidadeSaude {
  id: number
  identificacao: string
  nome: string
  tipo: string
  endereco: string
  status: UnidadeSaudeStatus
  dataCadastro: string | null
  dataAtualizacao: string | null
}

export interface NovaUnidadeSaude {
  identificacao: string
  nome: string
  tipo: string
  endereco: string
}

export type AtualizacaoUnidadeSaude = NovaUnidadeSaude

export interface UnidadeSaudeFiltro {
  identificacao: string
  nome: string
  tipo: string
  endereco: string
  status: UnidadeSaudeStatus | ''
}
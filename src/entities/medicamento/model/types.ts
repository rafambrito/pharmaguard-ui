export const MEDICAMENTO_CRITICIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const

export type MedicamentoCriticidade = (typeof MEDICAMENTO_CRITICIDADES)[number]

export const MEDICAMENTO_STATUS = ['ATIVO', 'INATIVO'] as const

export type MedicamentoStatus = (typeof MEDICAMENTO_STATUS)[number]

export type MedicamentoCategoria =
  | 'ANTIBIOTICO'
  | 'ANALGESICO'
  | 'ANTIINFLAMATORIO'
  | 'ANTITERMICO'
  | 'CONTROLADO'
  | 'INSUMO'
  | 'OUTROS'

export interface CategoriaMedicamentoOpcao {
  codigo: MedicamentoCategoria
  nome: string
  descricao: string
}

export interface CategoriaMedicamento {
  id: number
  nome: string
  descricao: string | null
  ativo: boolean
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface UnidadeMedidaMedicamento {
  id: number
  nome: string
  sigla: string
  ativo: boolean
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface Medicamento {
  id: number
  nome: string
  apresentacao: string
  descricao: string | null
  categoria: CategoriaMedicamento
  unidadeMedida: UnidadeMedidaMedicamento
  criticidade: MedicamentoCriticidade
  ativo: boolean
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface NovoMedicamento {
  nome: string
  apresentacao: string
  descricao?: string
  categoria: MedicamentoCategoria
  unidadeMedidaId: number
  criticidade: MedicamentoCriticidade
}

export interface AtualizacaoMedicamento extends NovoMedicamento {
  ativo?: boolean
}

export interface MedicamentoFiltro {
  nome: string
  apresentacao: string
  descricao: string
  categoria: MedicamentoCategoria | ''
  unidadeMedidaId: string
  criticidade: MedicamentoCriticidade | ''
  status: MedicamentoStatus | ''
}
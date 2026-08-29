export const SAIDA_ESTOQUE_MOTIVOS = [
  'DISPENSACAO',
  'PERDA',
  'AJUSTE_INVENTARIO',
  'TRANSFERENCIA_SAIDA',
] as const

export type SaidaEstoqueMotivo = (typeof SAIDA_ESTOQUE_MOTIVOS)[number]

export interface LoteConsumido {
  loteId: number
  numeroLote: string
  dataValidade: string
  quantidadeConsumida: number
}

export interface SaidaEstoque {
  id: number
  unidadeId: number
  medicamentoId: number
  quantidadeTotal: number
  motivo: SaidaEstoqueMotivo
  observacao: string | null
  lotesConsumidos: LoteConsumido[]
  dataSaida: string | null
  usuarioResponsavelId: number | null
}

export interface NovaSaidaEstoque {
  unidadeId: number
  medicamentoId: number
  quantidade: number
  motivo: SaidaEstoqueMotivo
  observacao?: string
}

export interface SaidaEstoqueFiltro {
  unidadeId: string
  medicamentoId: string
  quantidade: string
  motivo: SaidaEstoqueMotivo | ''
  observacao: string
}
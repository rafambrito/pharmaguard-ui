export const ENTRADA_ESTOQUE_ORIGENS = [
  'FORNECEDOR',
  'AJUSTE_INVENTARIO',
  'DEVOLUCAO',
  'TRANSFERENCIA_ENTRADA',
] as const

export type EntradaEstoqueOrigem = (typeof ENTRADA_ESTOQUE_ORIGENS)[number]

export interface LoteMedicamento {
  id: number
  numeroLote: string
  dataValidade: string
  quantidadeInicial: number
  statusValidade: string
  medicamentoId: number
  dataCriacao: string | null
}

export interface EntradaEstoque {
  id: number
  unidadeId: number
  medicamentoId: number
  loteId: number
  quantidade: number
  origem: EntradaEstoqueOrigem
  documento: string | null
  observacao: string | null
  dataEntrada: string | null
  usuarioResponsavelId: number | null
}

export interface NovaEntradaEstoque {
  unidadeId: number
  medicamentoId: number
  loteId: number
  quantidade: number
  origem: EntradaEstoqueOrigem
  documento?: string
  observacao?: string
}

export interface EntradaEstoqueFiltro {
  unidadeId: string
  medicamentoId: string
  loteId: string
  quantidade: string
  origem: EntradaEstoqueOrigem | ''
  documento: string
  observacao: string
}
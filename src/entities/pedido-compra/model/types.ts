export interface PedidoCompraCabecalho {
  fornecedorId: number | null
  fornecedorNome: string
  cnpjFornecedor: string
  dataPedido: string
  dataPrevistaEntrega: string
  condicaoPagamento: string
  prioridade: PedidoCompraPrioridade | ''
  observacao: string
}

export interface PedidoCompraItem {
  id: string
  medicamentoId: number | null
  medicamentoNome: string
  unidadeMedida: string
  quantidade: string
  valorUnitarioEstimado: string
  observacao: string
}

export const PEDIDO_COMPRA_PRIORIDADES = ['BAIXA', 'NORMAL', 'ALTA', 'URGENTE'] as const

export type PedidoCompraPrioridade = (typeof PEDIDO_COMPRA_PRIORIDADES)[number]

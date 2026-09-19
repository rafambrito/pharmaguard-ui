export interface FornecedorPedidoCompraMock {
  id: number
  nome: string
  cnpj: string
  leadTimeDias: number
}

export const PEDIDO_COMPRA_FORNECEDORES_MOCK: FornecedorPedidoCompraMock[] = [
  { id: 1, nome: 'Distribuidora Farma Brasil Ltda', cnpj: '12.345.678/0001-90', leadTimeDias: 7 },
  { id: 2, nome: 'MedSupply Comércio de Medicamentos S.A.', cnpj: '98.765.432/0001-10', leadTimeDias: 12 },
  { id: 3, nome: 'Prime Hospitalar Distribuição Ltda', cnpj: '45.123.987/0001-55', leadTimeDias: 5 },
]

export const PEDIDO_COMPRA_CONDICOES_PAGAMENTO_MOCK = [
  { value: 'AVISTA', label: 'À vista' },
  { value: '30DD', label: '30 dias' },
  { value: '30_60DD', label: '30/60 dias' },
  { value: '30_60_90DD', label: '30/60/90 dias' },
]

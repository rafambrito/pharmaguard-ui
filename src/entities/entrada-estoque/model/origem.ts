import type { EntradaEstoqueOrigem } from '@/entities/entrada-estoque/model/types'

const labels: Record<EntradaEstoqueOrigem, string> = {
  FORNECEDOR: 'Fornecedor',
  AJUSTE_INVENTARIO: 'Ajuste de inventário',
  DEVOLUCAO: 'Devolução',
  TRANSFERENCIA_ENTRADA: 'Transferência de entrada',
}

export function entradaEstoqueOrigemLabel(origem: EntradaEstoqueOrigem): string {
  return labels[origem]
}
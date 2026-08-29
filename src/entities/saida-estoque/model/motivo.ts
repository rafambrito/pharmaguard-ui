import type { SaidaEstoqueMotivo } from '@/entities/saida-estoque/model/types'

const labels: Record<SaidaEstoqueMotivo, string> = {
  DISPENSACAO: 'Dispensação',
  PERDA: 'Perda',
  AJUSTE_INVENTARIO: 'Ajuste de inventário',
  TRANSFERENCIA_SAIDA: 'Transferência de saída',
}

export function saidaEstoqueMotivoLabel(motivo: SaidaEstoqueMotivo): string {
  return labels[motivo]
}
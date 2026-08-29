import type { EntradaEstoque } from '@/entities/entrada-estoque'
import type { SaidaEstoque } from '@/entities/saida-estoque'

export interface NovaTransferenciaEstoque {
  unidadeOrigemId: number
  unidadeDestinoId: number
  medicamentoId: number
  quantidade: number
  documento?: string
  observacao?: string
}

export interface TransferenciaEstoque {
  id: string
  unidadeOrigemId: number
  unidadeDestinoId: number | null
  medicamentoId: number
  quantidade: number
  documento: string | null
  observacao: string | null
  dataTransferencia: string | null
  saida: SaidaEstoque
  entradas: EntradaEstoque[]
}

export interface TransferenciaEstoqueFiltro {
  unidadeOrigemId: string
  unidadeDestinoId: string
  medicamentoId: string
  quantidade: string
  documento: string
  observacao: string
}
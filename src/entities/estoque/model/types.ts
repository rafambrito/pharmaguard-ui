export const MOVIMENTACAO_ESTOQUE_TIPOS = ['ENTRADA', 'SAIDA', 'AJUSTE'] as const

export type MovimentacaoEstoqueTipo = (typeof MOVIMENTACAO_ESTOQUE_TIPOS)[number]

export type StatusValidade = 'VALIDO' | 'PROXIMO_VENCIMENTO' | 'VENCIDO'

export interface SaldoLoteEstoque {
  medicamentoId: number
  loteId: number
  numeroLote: string
  dataValidade: string
  quantidadeDisponivel: number
  statusValidade: StatusValidade
}

export interface SaldoEstoque {
  medicamentoId: number
  quantidadeDisponivel: number
  quantidadeReservada: number
  validadeMaisProxima: string | null
  lotesAtivos: SaldoLoteEstoque[]
}

export interface MovimentacaoEstoque {
  id: number
  tipo: MovimentacaoEstoqueTipo
  unidadeId: number
  medicamentoId: number
  loteId: number | null
  quantidade: number
  saldoAposMovimentacao: number
  motivo: string
  dataMovimentacao: string | null
  usuarioResponsavelId: number | null
}

export interface LoteVencimentoEstoque {
  medicamentoId: number
  loteId: number
  numeroLote: string
  dataValidade: string
  diasParaVencer: number
  statusValidade: StatusValidade
  quantidadeDisponivel: number
}

export interface EstoqueFiltro {
  unidadeId: string
  medicamentoId: string
  loteId: string
  tipo: MovimentacaoEstoqueTipo | ''
  dataInicial: string
  dataFinal: string
  diasParaVencer: string
}
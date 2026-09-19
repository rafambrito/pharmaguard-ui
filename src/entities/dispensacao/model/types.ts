export interface LoteDispensado {
  loteId: number
  numeroLote: string
  quantidade: number
}

export interface Dispensacao {
  id: number
  pacienteId: number
  saidaEstoqueId: number
  unidadeId: number
  medicamentoId: number
  quantidade: number
  numeroReceita: string | null
  crmPrescritor: string | null
  observacao: string | null
  dataDispensacao: string
  lotes: LoteDispensado[]
}

export interface NovaDispensacao {
  unidadeId: number
  pacienteId: number
  medicamentoId: number
  quantidade: number
  numeroReceita?: string
  crmPrescritor?: string
  observacao?: string
}

export interface DispensacaoFiltro {
  unidadeId: string
  pacienteId: string
  medicamentoId: string
  dataInicial: string
  dataFinal: string
}
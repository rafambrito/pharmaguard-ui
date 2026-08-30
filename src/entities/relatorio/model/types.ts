export const RELATORIO_TIPOS = [
  'CONSUMO',
  'PRODUTOS_CRITICOS',
  'ESTOQUE_MINIMO',
  'VENCIMENTOS',
  'REPOSICAO',
] as const

export type RelatorioTipo = (typeof RELATORIO_TIPOS)[number]

export type TendenciaConsumo = 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE'
export type RiscoRelatorio = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'
export type UrgenciaRelatorio = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'
export type PrioridadeRelatorio = 'BAIXA' | 'MEDIA' | 'ALTA'
export type StatusEstoqueRelatorio = 'NORMAL' | 'BAIXO' | 'RUPTURA'
export type StatusValidadeRelatorio = 'VALIDO' | 'PROXIMO_VENCIMENTO' | 'VENCIDO'
export type SeveridadeVencimento = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'

export interface RelatorioFiltro {
  tipo: RelatorioTipo
  periodoInicio: string
  periodoFim: string
  medicamentoId: string
  categoriaId: string
  unidadeMedidaId: string
  fornecedorId: string
  unidadeSaudeId: string
}

export interface ItemConsumo {
  medicamentoId: number
  nomeMedicamento: string
  categoriaNome: string
  unidadeMedidaSigla: string
  quantidadeConsumida: number
  mediaDiaria: number
}

export interface RelatorioConsumo {
  periodoInicio: string
  periodoFim: string
  totalConsumido: number
  mediaDiaria: number
  tendencia: TendenciaConsumo
  itens: ItemConsumo[]
}

export interface ItemProdutoCritico {
  medicamentoId: number
  nomeMedicamento: string
  categoriaNome: string
  saldoAtual: number
  consumoMedioDiario: number
  risco: RiscoRelatorio
  urgencia: Exclude<UrgenciaRelatorio, 'CRITICA'>
  descricaoRisco: string
}

export interface RelatorioProdutosCriticos {
  periodoInicio: string
  periodoFim: string
  totalProdutosCriticos: number
  itens: ItemProdutoCritico[]
}

export interface ItemEstoqueMinimo {
  medicamentoId: number
  nomeMedicamento: string
  categoriaNome: string
  saldoAtual: number
  estoqueMinimo: number
  status: StatusEstoqueRelatorio
  necessidadeReposicao: number
}

export interface RelatorioEstoqueMinimo {
  periodoInicio: string
  periodoFim: string
  totalItensAbaixoMinimo: number
  itens: ItemEstoqueMinimo[]
}

export interface ItemVencimento {
  medicamentoId: number
  nomeMedicamento: string
  numeroLote: string
  dataValidade: string
  quantidade: number
  statusValidade: StatusValidadeRelatorio
  severidade: SeveridadeVencimento
}

export interface RelatorioVencimentos {
  periodoInicio: string
  periodoFim: string
  totalItensVencendo: number
  itens: ItemVencimento[]
}

export interface ItemReposicao {
  medicamentoId: number
  nomeMedicamento: string
  quantidadeSugerida: number
  urgencia: UrgenciaRelatorio
  prioridade: PrioridadeRelatorio
  fornecedorId: number | null
  leadTimeDias: number | null
  justificativa: string
}

export interface RelatorioReposicao {
  periodoInicio: string
  periodoFim: string
  totalItensParaReposicao: number
  itens: ItemReposicao[]
}

export type RelatorioResultado =
  | { tipo: 'CONSUMO'; data: RelatorioConsumo }
  | { tipo: 'PRODUTOS_CRITICOS'; data: RelatorioProdutosCriticos }
  | { tipo: 'ESTOQUE_MINIMO'; data: RelatorioEstoqueMinimo }
  | { tipo: 'VENCIMENTOS'; data: RelatorioVencimentos }
  | { tipo: 'REPOSICAO'; data: RelatorioReposicao }
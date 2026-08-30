export const ALERTA_TIPOS = ['RUPTURA', 'VENCIMENTO', 'EXCESSO_ESTOQUE'] as const

export type AlertaTipo = (typeof ALERTA_TIPOS)[number]

export const ALERTA_SEVERIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const

export type AlertaSeveridade = (typeof ALERTA_SEVERIDADES)[number]

export interface ResumoAlertas {
  totalRuptura: number
  totalVencimento: number
  totalExcessoEstoque: number
  totalConsumoPeriodo: number
  totalItensCriticos: number
}

export interface ItemAlerta {
  medicamentoId: number
  nomeMedicamento: string
  tipo: AlertaTipo
  severidade: AlertaSeveridade
  quantidadeImpactada: number
  descricao: string
}

export interface RelatorioAlertas {
  periodoInicio: string
  periodoFim: string
  totalAlertas: number
  resumo: ResumoAlertas
  alertas: ItemAlerta[]
}

export interface AlertaFiltro {
  periodoInicio: string
  periodoFim: string
  medicamentoId: string
  unidadeSaudeId: string
  tipo: AlertaTipo | ''
  severidade: AlertaSeveridade | ''
}
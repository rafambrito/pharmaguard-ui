export interface NotaFiscalEntradaCabecalho {
  chaveAcesso: string
  numero: string
  serie: string
  cnpjFornecedor: string
  razaoSocialFornecedor: string
  dataEmissao: string
  valorTotal: string
}

export interface NotaFiscalEntradaItem {
  id: string
  medicamentoId: number | null
  medicamentoNome: string
  ncm: string
  unidadeMedida: string
  quantidade: string
  valorUnitario: string
  lote: string
  dataValidade: string
}

export type NotaFiscalEntradaOrigem = 'MANUAL' | 'CODIGO_BARRAS' | 'ARQUIVO_XML' | 'ARQUIVO_PDF'

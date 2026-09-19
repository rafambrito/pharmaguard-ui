import type { NotaFiscalEntradaCabecalho, NotaFiscalEntradaItem } from './types'

export interface MedicamentoNotaFiscalMock {
  id: number
  nome: string
  ncm: string
  unidadeMedida: string
}

export const NOTA_FISCAL_MEDICAMENTOS_MOCK: MedicamentoNotaFiscalMock[] = [
  { id: 1, nome: 'Dipirona Sódica 500mg', ncm: '3004.90.69', unidadeMedida: 'CX' },
  { id: 2, nome: 'Amoxicilina 500mg', ncm: '3004.10.19', unidadeMedida: 'CX' },
  { id: 3, nome: 'Paracetamol 750mg', ncm: '3004.90.69', unidadeMedida: 'CX' },
  { id: 4, nome: 'Soro Fisiológico 0,9% 500ml', ncm: '3004.90.99', unidadeMedida: 'UN' },
  { id: 5, nome: 'Insulina NPH 100UI/ml', ncm: '3004.31.00', unidadeMedida: 'FR' },
  { id: 6, nome: 'Losartana Potássica 50mg', ncm: '3004.90.69', unidadeMedida: 'CX' },
]

export const NOTA_FISCAL_UNIDADES_MEDIDA_MOCK = [
  { value: 'CX', label: 'CX - Caixa' },
  { value: 'UN', label: 'UN - Unidade' },
  { value: 'FR', label: 'FR - Frasco' },
  { value: 'AMP', label: 'AMP - Ampola' },
  { value: 'COMP', label: 'COMP - Comprimido' },
  { value: 'ML', label: 'ML - Mililitro' },
]

export interface FornecedorNotaFiscalMock {
  cnpj: string
  razaoSocial: string
}

export const NOTA_FISCAL_FORNECEDORES_MOCK: FornecedorNotaFiscalMock[] = [
  { cnpj: '12.345.678/0001-90', razaoSocial: 'Distribuidora Farma Brasil Ltda' },
  { cnpj: '98.765.432/0001-10', razaoSocial: 'MedSupply Comércio de Medicamentos S.A.' },
]

function gerarChaveAcessoMock(): string {
  let chave = ''
  for (let i = 0; i < 44; i += 1) {
    chave += Math.floor(Math.random() * 10).toString()
  }
  return chave
}

function gerarNumeroMock(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function hojeIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function criarCabecalhoMockAleatorio(): NotaFiscalEntradaCabecalho {
  const fornecedor =
    NOTA_FISCAL_FORNECEDORES_MOCK[Math.floor(Math.random() * NOTA_FISCAL_FORNECEDORES_MOCK.length)]

  return {
    chaveAcesso: gerarChaveAcessoMock(),
    numero: gerarNumeroMock(),
    serie: '1',
    cnpjFornecedor: fornecedor.cnpj,
    razaoSocialFornecedor: fornecedor.razaoSocial,
    dataEmissao: hojeIso(),
    valorTotal: '',
  }
}

export function criarItensMockAleatorios(): NotaFiscalEntradaItem[] {
  const quantidadeItens = 1 + Math.floor(Math.random() * 2)
  const disponiveis = [...NOTA_FISCAL_MEDICAMENTOS_MOCK]
  const itens: NotaFiscalEntradaItem[] = []

  for (let i = 0; i < quantidadeItens && disponiveis.length > 0; i += 1) {
    const index = Math.floor(Math.random() * disponiveis.length)
    const medicamento = disponiveis.splice(index, 1)[0]
    const quantidade = 5 + Math.floor(Math.random() * 20)
    const valorUnitario = (5 + Math.random() * 40).toFixed(2)

    itens.push({
      id: crypto.randomUUID(),
      medicamentoId: medicamento.id,
      medicamentoNome: medicamento.nome,
      ncm: medicamento.ncm,
      unidadeMedida: medicamento.unidadeMedida,
      quantidade: String(quantidade),
      valorUnitario,
      lote: `L${gerarNumeroMock().slice(0, 4)}`,
      dataValidade: '',
    })
  }

  return itens
}

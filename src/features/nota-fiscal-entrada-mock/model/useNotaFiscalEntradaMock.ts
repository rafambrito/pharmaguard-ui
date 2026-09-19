import { computed, reactive, ref } from 'vue'
import {
  NOTA_FISCAL_MEDICAMENTOS_MOCK,
  criarCabecalhoMockAleatorio,
  criarItensMockAleatorios,
  type NotaFiscalEntradaCabecalho,
  type NotaFiscalEntradaItem,
  type NotaFiscalEntradaOrigem,
} from '@/entities/nota-fiscal-entrada'
import { t } from '@/shared/config/messages'

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyCabecalho(): NotaFiscalEntradaCabecalho {
  return {
    chaveAcesso: '',
    numero: '',
    serie: '',
    cnpjFornecedor: '',
    razaoSocialFornecedor: '',
    dataEmissao: '',
    valorTotal: '',
  }
}

function emptyItem(): NotaFiscalEntradaItem {
  return {
    id: crypto.randomUUID(),
    medicamentoId: null,
    medicamentoNome: '',
    ncm: '',
    unidadeMedida: '',
    quantidade: '',
    valorUnitario: '',
    lote: '',
    dataValidade: '',
  }
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useNotaFiscalEntradaMock() {
  const cabecalho = reactive<NotaFiscalEntradaCabecalho>(emptyCabecalho())
  const itens = ref<NotaFiscalEntradaItem[]>([])
  const origem = ref<NotaFiscalEntradaOrigem>('MANUAL')
  const arquivoNome = ref<string | null>(null)
  const isProcessing = ref(false)
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isBusy = computed(() => isProcessing.value || isSaving.value)
  const valorTotalItens = computed(() =>
    itens.value.reduce((total, item) => {
      const quantidade = Number(item.quantidade) || 0
      const valorUnitario = Number(item.valorUnitario) || 0
      return total + quantidade * valorUnitario
    }, 0),
  )

  async function simularLeituraCodigoBarras(): Promise<void> {
    isProcessing.value = true
    feedback.value = null

    await aguardar(600)

    Object.assign(cabecalho, criarCabecalhoMockAleatorio())
    itens.value = criarItensMockAleatorios()
    origem.value = 'CODIGO_BARRAS'
    arquivoNome.value = null
    isProcessing.value = false
    feedback.value = { tone: 'success', message: t('notaFiscalEntrada.feedback.barcodeRead') }
  }

  async function importarArquivo(file: File): Promise<void> {
    const extensao = file.name.split('.').pop()?.toLowerCase()

    if (extensao !== 'xml' && extensao !== 'pdf') {
      feedback.value = { tone: 'error', message: t('notaFiscalEntrada.feedback.invalidFile') }
      return
    }

    isProcessing.value = true
    feedback.value = null

    await aguardar(800)

    Object.assign(cabecalho, criarCabecalhoMockAleatorio())
    itens.value = criarItensMockAleatorios()
    origem.value = extensao === 'xml' ? 'ARQUIVO_XML' : 'ARQUIVO_PDF'
    arquivoNome.value = file.name
    isProcessing.value = false
    feedback.value = { tone: 'success', message: t('notaFiscalEntrada.feedback.fileImported') }
  }

  function adicionarItem(): void {
    itens.value.push(emptyItem())
  }

  function removerItem(id: string): void {
    itens.value = itens.value.filter((item) => item.id !== id)
  }

  function selecionarMedicamentoItem(id: string, medicamentoId: number | null): void {
    const item = itens.value.find((current) => current.id === id)
    if (!item) {
      return
    }

    item.medicamentoId = medicamentoId
    const medicamento = NOTA_FISCAL_MEDICAMENTOS_MOCK.find((current) => current.id === medicamentoId)

    if (medicamento) {
      item.medicamentoNome = medicamento.nome
      item.ncm = medicamento.ncm
      item.unidadeMedida = medicamento.unidadeMedida
    }
  }

  function novaNota(): void {
    Object.assign(cabecalho, emptyCabecalho())
    itens.value = []
    origem.value = 'MANUAL'
    arquivoNome.value = null
    feedback.value = null
  }

  async function registrarEntrada(): Promise<void> {
    if (itens.value.length === 0) {
      feedback.value = { tone: 'error', message: t('notaFiscalEntrada.feedback.itemsRequired') }
      return
    }

    isSaving.value = true
    feedback.value = null

    await aguardar(500)

    isSaving.value = false
    feedback.value = { tone: 'success', message: t('notaFiscalEntrada.feedback.registered') }
  }

  return {
    cabecalho,
    itens,
    origem,
    arquivoNome,
    isProcessing,
    isSaving,
    isBusy,
    feedback,
    valorTotalItens,
    simularLeituraCodigoBarras,
    importarArquivo,
    adicionarItem,
    removerItem,
    selecionarMedicamentoItem,
    novaNota,
    registrarEntrada,
  }
}

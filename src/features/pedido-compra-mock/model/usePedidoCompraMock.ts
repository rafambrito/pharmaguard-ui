import { computed, reactive, ref } from 'vue'
import { NOTA_FISCAL_MEDICAMENTOS_MOCK } from '@/entities/nota-fiscal-entrada'
import {
  PEDIDO_COMPRA_FORNECEDORES_MOCK,
  type PedidoCompraCabecalho,
  type PedidoCompraItem,
} from '@/entities/pedido-compra'
import { t } from '@/shared/config/messages'

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function hojeIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyCabecalho(): PedidoCompraCabecalho {
  return {
    fornecedorId: null,
    fornecedorNome: '',
    cnpjFornecedor: '',
    dataPedido: hojeIso(),
    dataPrevistaEntrega: '',
    condicaoPagamento: '',
    prioridade: '',
    observacao: '',
  }
}

function emptyItem(): PedidoCompraItem {
  return {
    id: crypto.randomUUID(),
    medicamentoId: null,
    medicamentoNome: '',
    unidadeMedida: '',
    quantidade: '',
    valorUnitarioEstimado: '',
    observacao: '',
  }
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function usePedidoCompraMock() {
  const cabecalho = reactive<PedidoCompraCabecalho>(emptyCabecalho())
  const itens = ref<PedidoCompraItem[]>([])
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const valorTotalEstimado = computed(() =>
    itens.value.reduce((total, item) => {
      const quantidade = Number(item.quantidade) || 0
      const valorUnitario = Number(item.valorUnitarioEstimado) || 0
      return total + quantidade * valorUnitario
    }, 0),
  )

  function selecionarFornecedor(fornecedorId: number | null): void {
    cabecalho.fornecedorId = fornecedorId
    const fornecedor = PEDIDO_COMPRA_FORNECEDORES_MOCK.find((current) => current.id === fornecedorId)

    if (fornecedor) {
      cabecalho.fornecedorNome = fornecedor.nome
      cabecalho.cnpjFornecedor = fornecedor.cnpj

      const previsao = new Date()
      previsao.setDate(previsao.getDate() + fornecedor.leadTimeDias)
      cabecalho.dataPrevistaEntrega = previsao.toISOString().slice(0, 10)
    } else {
      cabecalho.fornecedorNome = ''
      cabecalho.cnpjFornecedor = ''
    }
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
      item.unidadeMedida = medicamento.unidadeMedida
    }
  }

  function novoPedido(): void {
    Object.assign(cabecalho, emptyCabecalho())
    itens.value = []
    feedback.value = null
  }

  async function registrarPedido(): Promise<void> {
    if (!cabecalho.fornecedorId) {
      feedback.value = { tone: 'error', message: t('pedidoCompra.feedback.fornecedorRequired') }
      return
    }

    if (itens.value.length === 0) {
      feedback.value = { tone: 'error', message: t('pedidoCompra.feedback.itemsRequired') }
      return
    }

    isSaving.value = true
    feedback.value = null

    await aguardar(500)

    isSaving.value = false
    feedback.value = { tone: 'success', message: t('pedidoCompra.feedback.registered') }
  }

  return {
    cabecalho,
    itens,
    isSaving,
    feedback,
    valorTotalEstimado,
    selecionarFornecedor,
    adicionarItem,
    removerItem,
    selecionarMedicamentoItem,
    novoPedido,
    registrarPedido,
  }
}

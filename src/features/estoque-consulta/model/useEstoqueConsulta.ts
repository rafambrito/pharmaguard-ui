import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import type {
  EstoqueFiltro,
  LoteVencimentoEstoque,
  MovimentacaoEstoque,
  SaldoEstoque,
  SaldoLoteEstoque,
} from '@/entities/estoque'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import {
  getSaldoEstoque,
  listMovimentacoesEstoque,
  listSaldosLoteEstoque,
  listVencimentosEstoque,
} from '@/shared/api/stockApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyFiltro(): EstoqueFiltro {
  return {
    unidadeId: '',
    medicamentoId: '',
    loteId: '',
    tipo: '',
    dataInicial: '',
    dataFinal: '',
    diasParaVencer: '30',
  }
}

function toNumber(value: string): number {
  return Number(value)
}

export function useEstoqueConsulta() {
  const filtro = reactive<EstoqueFiltro>(emptyFiltro())
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const saldo = ref<SaldoEstoque | null>(null)
  const saldosLote = ref<SaldoLoteEstoque[]>([])
  const movimentacoes = ref<MovimentacaoEstoque[]>([])
  const vencimentos = ref<LoteVencimentoEstoque[]>([])
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isBusy = computed(() => isLoading.value || isLoadingSupport.value)
  const medicamentosAtivos = computed(() => medicamentos.value.filter((medicamento) => medicamento.ativo))
  const unidadesSaudeAtivas = computed(() =>
    unidadesSaude.value.filter((unidadeSaude) => unidadeSaude.status === 'ATIVA'),
  )

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  async function carregarApoio(): Promise<void> {
    isLoadingSupport.value = true
    feedback.value = null

    try {
      const [medicamentosResponse, unidadesSaudeResponse] = await Promise.all([
        listMedicamentos(),
        listUnidadesSaude(),
      ])
      medicamentos.value = medicamentosResponse
      unidadesSaude.value = unidadesSaudeResponse
    } catch (error) {
      fail(error, 'estoque.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function consultar(): Promise<void> {
    if (!filtro.unidadeId) {
      hasSearched.value = true
      feedback.value = { tone: 'error', message: t('estoque.feedback.unidadeRequired') }
      return
    }

    isLoading.value = true
    feedback.value = null
    saldo.value = null
    saldosLote.value = []
    movimentacoes.value = []

    try {
      const unidadeId = toNumber(filtro.unidadeId)
      const medicamentoId = filtro.medicamentoId ? toNumber(filtro.medicamentoId) : undefined
      const loteId = filtro.loteId ? toNumber(filtro.loteId) : undefined

      const [movimentacoesResponse, vencimentosResponse] = await Promise.all([
        listMovimentacoesEstoque({
          unidadeId,
          medicamentoId,
          loteId,
          tipo: filtro.tipo || undefined,
          dataInicial: filtro.dataInicial || undefined,
          dataFinal: filtro.dataFinal || undefined,
        }),
        listVencimentosEstoque(toNumber(filtro.diasParaVencer || '30')),
      ])

      movimentacoes.value = movimentacoesResponse
      vencimentos.value = vencimentosResponse

      if (medicamentoId) {
        const [saldoResponse, saldosLoteResponse] = await Promise.all([
          getSaldoEstoque(medicamentoId, unidadeId),
          listSaldosLoteEstoque(medicamentoId, unidadeId),
        ])
        saldo.value = saldoResponse
        saldosLote.value = saldosLoteResponse
      }

      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('estoque.feedback.loaded') }
    } catch (error) {
      fail(error, 'estoque.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function limpar(): void {
    Object.assign(filtro, emptyFiltro())
    saldo.value = null
    saldosLote.value = []
    movimentacoes.value = []
    vencimentos.value = []
    hasSearched.value = false
    feedback.value = null
  }

  return {
    filtro,
    medicamentos: medicamentosAtivos,
    unidadesSaude: unidadesSaudeAtivas,
    saldo,
    saldosLote,
    movimentacoes,
    vencimentos,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isBusy,
    feedback,
    carregarApoio,
    consultar,
    limpar,
  }
}
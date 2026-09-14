import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import {
  getDashboardOverview,
  type DashboardOverviewApiResponse,
  type DashboardOverviewFiltro,
} from '@/shared/api/dashboardApi'
import {
  explicarPainel,
  type ExplicacaoPainelResponse,
  type TipoPainelInsight,
} from '@/shared/api/intelligenceApi'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

export interface InteligenciaFiltro {
  periodoInicio: string
  periodoFim: string
  unidadeSaudeId: string
  medicamentoId: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function defaultFiltro(): InteligenciaFiltro {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)

  return {
    periodoInicio: toDateInput(inicio),
    periodoFim: toDateInput(fim),
    unidadeSaudeId: '',
    medicamentoId: '',
  }
}

export function useInteligenciaConsulta() {
  const filtro = reactive<InteligenciaFiltro>(defaultFiltro())
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const overview = ref<DashboardOverviewApiResponse | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const feedback = ref<Feedback | null>(null)

  // AI Diagnostic state
  const activeFocus = ref<TipoPainelInsight>('DIAGNOSTICO_GERAL')
  const explicacoes = ref<Partial<Record<TipoPainelInsight, ExplicacaoPainelResponse>>>({})
  const isLoadingAi = ref(false)
  const aiError = ref('')

  const isBusy = computed(() => isLoading.value || isLoadingSupport.value || isLoadingAi.value)

  const explicacaoAtual = computed(() => explicacoes.value[activeFocus.value] ?? null)

  function applyFiltro(source: InteligenciaFiltro): void {
    Object.assign(filtro, source)
  }

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
      fail(error, 'inteligencia.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function gerarExplicacao(tipo: TipoPainelInsight): Promise<void> {
    isLoadingAi.value = true
    aiError.value = ''

    try {
      const response = await explicarPainel({
        tipoPainel: tipo,
        periodoInicio: filtro.periodoInicio,
        periodoFim: filtro.periodoFim,
        medicamentoId: filtro.medicamentoId ? Number(filtro.medicamentoId) : undefined,
        unidadeSaudeId: filtro.unidadeSaudeId ? Number(filtro.unidadeSaudeId) : undefined,
      })
      explicacoes.value[tipo] = response
    } catch (error) {
      aiError.value = extractHttpErrorMessage(error, t('inteligencia.ai.error'))
    } finally {
      isLoadingAi.value = false
    }
  }

  async function selecionarFoco(tipo: TipoPainelInsight): Promise<void> {
    activeFocus.value = tipo
    if (!explicacoes.value[tipo]) {
      await gerarExplicacao(tipo)
    }
  }

  async function pesquisar(): Promise<void> {
    isLoading.value = true
    feedback.value = null
    explicacoes.value = {}
    aiError.value = ''

    const apiFilter: DashboardOverviewFiltro = {
      periodoInicio: filtro.periodoInicio,
      periodoFim: filtro.periodoFim,
      medicamentoId: filtro.medicamentoId ? Number(filtro.medicamentoId) : undefined,
      unidadeSaudeId: filtro.unidadeSaudeId ? Number(filtro.unidadeSaudeId) : undefined,
    }

    try {
      overview.value = await getDashboardOverview(apiFilter)
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('inteligencia.feedback.loaded') }
      // Auto-trigger general AI diagnostic once overview data is ready
      void gerarExplicacao(activeFocus.value)
    } catch (error) {
      overview.value = null
      fail(error, 'inteligencia.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function limpar(): void {
    applyFiltro(defaultFiltro())
    overview.value = null
    explicacoes.value = {}
    aiError.value = ''
    hasSearched.value = false
    feedback.value = null
  }

  return {
    filtro,
    medicamentos,
    unidadesSaude,
    overview,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isLoadingAi,
    isBusy,
    feedback,
    activeFocus,
    explicacaoAtual,
    aiError,
    carregarApoio,
    pesquisar,
    limpar,
    selecionarFoco,
    gerarExplicacao,
  }
}

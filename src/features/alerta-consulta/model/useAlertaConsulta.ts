import { computed, reactive, ref } from 'vue'
import {
  filtrarAlertas,
  type AlertaFiltro,
  type ItemAlerta,
  type RelatorioAlertas,
  type ResumoAlertas,
} from '@/entities/alerta'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import { getRelatorioAlertas } from '@/shared/api/alertApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { t } from '@/shared/config/messages'

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

const emptyResumo: ResumoAlertas = {
  totalRuptura: 0,
  totalVencimento: 0,
  totalExcessoEstoque: 0,
  totalConsumoPeriodo: 0,
  totalItensCriticos: 0,
}

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function defaultFiltro(): AlertaFiltro {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)

  return {
    periodoInicio: toDateInput(inicio),
    periodoFim: toDateInput(fim),
    medicamentoId: '',
    unidadeSaudeId: '',
    tipo: '',
    severidade: '',
  }
}

export function useAlertaConsulta() {
  const filtro = reactive<AlertaFiltro>(defaultFiltro())
  const criterios = ref<AlertaFiltro>(defaultFiltro())
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const relatorio = ref<RelatorioAlertas | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const feedback = ref<Feedback | null>(null)

  const alertas = computed<ItemAlerta[]>(() =>
    filtrarAlertas(relatorio.value?.alertas ?? [], criterios.value),
  )
  const resumo = computed<ResumoAlertas>(() => relatorio.value?.resumo ?? emptyResumo)
  const totalAlertas = computed(() => relatorio.value?.totalAlertas ?? 0)
  const periodo = computed(() => ({
    inicio: relatorio.value?.periodoInicio ?? filtro.periodoInicio,
    fim: relatorio.value?.periodoFim ?? filtro.periodoFim,
  }))
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value)

  function applyFiltro(source: AlertaFiltro): void {
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
      fail(error, 'alertas.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...filtro }
    isLoading.value = true
    feedback.value = null

    try {
      relatorio.value = await getRelatorioAlertas(filtro)
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('alertas.feedback.loaded') }
    } catch (error) {
      relatorio.value = null
      fail(error, 'alertas.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function limpar(): void {
    applyFiltro(defaultFiltro())
    criterios.value = defaultFiltro()
    relatorio.value = null
    hasSearched.value = false
    feedback.value = null
  }

  return {
    filtro,
    medicamentos,
    unidadesSaude,
    alertas,
    resumo,
    totalAlertas,
    periodo,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isBusy,
    feedback,
    carregarApoio,
    pesquisar,
    limpar,
  }
}
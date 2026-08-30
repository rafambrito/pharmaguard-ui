import { computed, reactive, ref } from 'vue'
import type { Fornecedor } from '@/entities/fornecedor'
import type { CategoriaMedicamento, Medicamento, UnidadeMedidaMedicamento } from '@/entities/medicamento'
import type { RelatorioFiltro, RelatorioResultado } from '@/entities/relatorio'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { listFornecedores } from '@/shared/api/supplierApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import { listMedicamentos } from '@/shared/api/medicationApi'
import {
  getRelatorioConsumo,
  getRelatorioEstoqueMinimo,
  getRelatorioProdutosCriticos,
  getRelatorioReposicao,
  getRelatorioVencimentos,
} from '@/shared/api/reportApi'
import { t } from '@/shared/config/messages'

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function defaultFiltro(): RelatorioFiltro {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)

  return {
    tipo: 'CONSUMO',
    periodoInicio: toDateInput(inicio),
    periodoFim: toDateInput(fim),
    medicamentoId: '',
    categoriaId: '',
    unidadeMedidaId: '',
    fornecedorId: '',
    unidadeSaudeId: '',
  }
}

function uniqueById<T extends { id: number }>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()]
}

export function useRelatorioConsulta() {
  const filtro = reactive<RelatorioFiltro>(defaultFiltro())
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const fornecedores = ref<Fornecedor[]>([])
  const relatorio = ref<RelatorioResultado | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const feedback = ref<Feedback | null>(null)

  const categorias = computed<CategoriaMedicamento[]>(() =>
    uniqueById(medicamentos.value.map((medicamento) => medicamento.categoria)),
  )
  const unidadesMedida = computed<UnidadeMedidaMedicamento[]>(() =>
    uniqueById(medicamentos.value.map((medicamento) => medicamento.unidadeMedida)),
  )
  const periodo = computed(() => ({
    inicio: relatorio.value?.data.periodoInicio ?? filtro.periodoInicio,
    fim: relatorio.value?.data.periodoFim ?? filtro.periodoFim,
  }))
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value)

  function applyFiltro(source: RelatorioFiltro): void {
    Object.assign(filtro, source)
  }

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  async function carregarApoio(): Promise<void> {
    isLoadingSupport.value = true
    feedback.value = null

    try {
      const [medicamentosResponse, unidadesSaudeResponse, fornecedoresResponse] = await Promise.all([
        listMedicamentos(),
        listUnidadesSaude(),
        listFornecedores(),
      ])
      medicamentos.value = medicamentosResponse
      unidadesSaude.value = unidadesSaudeResponse
      fornecedores.value = fornecedoresResponse
    } catch (error) {
      fail(error, 'relatorios.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    isLoading.value = true
    feedback.value = null

    try {
      switch (filtro.tipo) {
        case 'CONSUMO':
          relatorio.value = { tipo: filtro.tipo, data: await getRelatorioConsumo(filtro) }
          break
        case 'PRODUTOS_CRITICOS':
          relatorio.value = { tipo: filtro.tipo, data: await getRelatorioProdutosCriticos(filtro) }
          break
        case 'ESTOQUE_MINIMO':
          relatorio.value = { tipo: filtro.tipo, data: await getRelatorioEstoqueMinimo(filtro) }
          break
        case 'VENCIMENTOS':
          relatorio.value = { tipo: filtro.tipo, data: await getRelatorioVencimentos(filtro) }
          break
        case 'REPOSICAO':
          relatorio.value = { tipo: filtro.tipo, data: await getRelatorioReposicao(filtro) }
          break
      }

      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('relatorios.feedback.loaded') }
    } catch (error) {
      relatorio.value = null
      fail(error, 'relatorios.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function limpar(): void {
    applyFiltro(defaultFiltro())
    relatorio.value = null
    hasSearched.value = false
    feedback.value = null
  }

  return {
    filtro,
    medicamentos,
    categorias,
    unidadesMedida,
    unidadesSaude,
    fornecedores,
    relatorio,
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
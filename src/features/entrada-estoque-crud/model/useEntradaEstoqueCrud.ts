import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import {
  filtrarEntradasEstoque,
  type EntradaEstoque,
  type EntradaEstoqueFiltro,
  type EntradaEstoqueOrigem,
  type LoteMedicamento,
  type NovaEntradaEstoque,
} from '@/entities/entrada-estoque'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import {
  createEntradaEstoque,
  getEntradaEstoque,
  listEntradasEstoque,
  listLotesMedicamento,
} from '@/shared/api/stockEntryApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface EntradaEstoqueForm {
  unidadeId: string
  medicamentoId: string
  loteId: string
  quantidade: string
  origem: EntradaEstoqueOrigem | ''
  documento: string
  observacao: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): EntradaEstoqueForm {
  return {
    unidadeId: '',
    medicamentoId: '',
    loteId: '',
    quantidade: '',
    origem: '',
    documento: '',
    observacao: '',
  }
}

function emptyFiltro(): EntradaEstoqueFiltro {
  return { ...emptyForm() }
}

function toNumber(value: string): number {
  return Number(value)
}

export function useEntradaEstoqueCrud() {
  const entradas = ref<EntradaEstoque[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const lotes = ref<LoteMedicamento[]>([])
  const form = reactive<EntradaEstoqueForm>(emptyForm())
  const criterios = ref<EntradaEstoqueFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const isLoadingLotes = ref(false)
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isViewing = computed(() => selectedId.value !== null)
  const entradasFiltradas = computed(() => filtrarEntradasEstoque(entradas.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value || isLoadingLotes.value || isSaving.value)
  const medicamentosAtivos = computed(() => medicamentos.value.filter((medicamento) => medicamento.ativo))
  const unidadesSaudeAtivas = computed(() => unidadesSaude.value.filter((unidadeSaude) => unidadeSaude.status === 'ATIVA'))

  function applyForm(source: EntradaEstoqueForm): void {
    Object.assign(form, source)
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
      fail(error, 'entradasEstoque.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function carregarLotesDoMedicamento(preserveSelected = false): Promise<void> {
    if (!preserveSelected) {
      form.loteId = ''
    }

    if (!form.medicamentoId) {
      lotes.value = []
      return
    }

    isLoadingLotes.value = true
    feedback.value = null

    try {
      lotes.value = await listLotesMedicamento(toNumber(form.medicamentoId))
    } catch (error) {
      lotes.value = []
      fail(error, 'entradasEstoque.feedback.lotesLoadError')
    } finally {
      isLoadingLotes.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...form }

    if (!form.unidadeId) {
      entradas.value = []
      hasSearched.value = true
      feedback.value = { tone: 'error', message: t('entradasEstoque.feedback.unidadeRequired') }
      return
    }

    isLoading.value = true
    feedback.value = null

    try {
      entradas.value = await listEntradasEstoque({
        unidadeId: toNumber(form.unidadeId),
        medicamentoId: form.medicamentoId ? toNumber(form.medicamentoId) : undefined,
        loteId: form.loteId ? toNumber(form.loteId) : undefined,
      })
      hasSearched.value = true
    } catch (error) {
      entradas.value = []
      fail(error, 'entradasEstoque.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    entradas.value = []
    lotes.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(entrada: EntradaEstoque): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getEntradaEstoque(entrada.id)
      selectedId.value = detalhe.id
      applyForm({
        unidadeId: String(detalhe.unidadeId),
        medicamentoId: String(detalhe.medicamentoId),
        loteId: String(detalhe.loteId),
        quantidade: String(detalhe.quantidade),
        origem: detalhe.origem,
        documento: detalhe.documento ?? '',
        observacao: detalhe.observacao ?? '',
      })
      await carregarLotesDoMedicamento(true)
    } catch (error) {
      fail(error, 'entradasEstoque.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    if (selectedId.value !== null) {
      feedback.value = { tone: 'error', message: t('entradasEstoque.feedback.readOnly') }
      return
    }

    isSaving.value = true
    feedback.value = null

    try {
      const payload: NovaEntradaEstoque = {
        unidadeId: toNumber(form.unidadeId),
        medicamentoId: toNumber(form.medicamentoId),
        loteId: toNumber(form.loteId),
        quantidade: toNumber(form.quantidade),
        origem: form.origem as EntradaEstoqueOrigem,
        documento: form.documento || undefined,
        observacao: form.observacao || undefined,
      }
      const salvo = await createEntradaEstoque(payload)
      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      entradas.value = [salvo]
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('entradasEstoque.feedback.created') }
    } catch (error) {
      fail(error, 'entradasEstoque.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  return {
    entradas: entradasFiltradas,
    medicamentos: medicamentosAtivos,
    unidadesSaude: unidadesSaudeAtivas,
    lotes,
    form,
    selectedId,
    isViewing,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isLoadingLotes,
    isSaving,
    isBusy,
    feedback,
    carregarApoio,
    carregarLotesDoMedicamento,
    pesquisar,
    selecionar,
    salvar,
    novo,
  }
}
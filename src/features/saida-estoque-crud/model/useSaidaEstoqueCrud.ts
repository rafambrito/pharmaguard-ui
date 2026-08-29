import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import {
  filtrarSaidasEstoque,
  type NovaSaidaEstoque,
  type SaidaEstoque,
  type SaidaEstoqueFiltro,
  type SaidaEstoqueMotivo,
} from '@/entities/saida-estoque'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import {
  createSaidaEstoque,
  getSaidaEstoque,
  listSaidasEstoque,
} from '@/shared/api/stockOutputApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface SaidaEstoqueForm {
  unidadeId: string
  medicamentoId: string
  quantidade: string
  motivo: SaidaEstoqueMotivo | ''
  observacao: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): SaidaEstoqueForm {
  return { unidadeId: '', medicamentoId: '', quantidade: '', motivo: '', observacao: '' }
}

function emptyFiltro(): SaidaEstoqueFiltro {
  return { ...emptyForm() }
}

function toNumber(value: string): number {
  return Number(value)
}

export function useSaidaEstoqueCrud() {
  const saidas = ref<SaidaEstoque[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const form = reactive<SaidaEstoqueForm>(emptyForm())
  const criterios = ref<SaidaEstoqueFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isViewing = computed(() => selectedId.value !== null)
  const saidasFiltradas = computed(() => filtrarSaidasEstoque(saidas.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value || isSaving.value)
  const medicamentosAtivos = computed(() => medicamentos.value.filter((medicamento) => medicamento.ativo))
  const unidadesSaudeAtivas = computed(() =>
    unidadesSaude.value.filter((unidadeSaude) => unidadeSaude.status === 'ATIVA'),
  )

  function applyForm(source: SaidaEstoqueForm): void {
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
      fail(error, 'saidasEstoque.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...form }

    if (!form.unidadeId) {
      saidas.value = []
      hasSearched.value = true
      feedback.value = { tone: 'error', message: t('saidasEstoque.feedback.unidadeRequired') }
      return
    }

    isLoading.value = true
    feedback.value = null

    try {
      saidas.value = await listSaidasEstoque({
        unidadeId: toNumber(form.unidadeId),
        medicamentoId: form.medicamentoId ? toNumber(form.medicamentoId) : undefined,
      })
      hasSearched.value = true
    } catch (error) {
      saidas.value = []
      fail(error, 'saidasEstoque.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    saidas.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(saida: SaidaEstoque): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getSaidaEstoque(saida.id)
      selectedId.value = detalhe.id
      applyForm({
        unidadeId: String(detalhe.unidadeId),
        medicamentoId: String(detalhe.medicamentoId),
        quantidade: String(detalhe.quantidadeTotal),
        motivo: detalhe.motivo,
        observacao: detalhe.observacao ?? '',
      })
    } catch (error) {
      fail(error, 'saidasEstoque.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    if (selectedId.value !== null) {
      feedback.value = { tone: 'error', message: t('saidasEstoque.feedback.readOnly') }
      return
    }

    isSaving.value = true
    feedback.value = null

    try {
      const payload: NovaSaidaEstoque = {
        unidadeId: toNumber(form.unidadeId),
        medicamentoId: toNumber(form.medicamentoId),
        quantidade: toNumber(form.quantidade),
        motivo: form.motivo as SaidaEstoqueMotivo,
        observacao: form.observacao || undefined,
      }
      const salvo = await createSaidaEstoque(payload)
      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      saidas.value = [salvo]
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('saidasEstoque.feedback.created') }
    } catch (error) {
      fail(error, 'saidasEstoque.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  return {
    saidas: saidasFiltradas,
    medicamentos: medicamentosAtivos,
    unidadesSaude: unidadesSaudeAtivas,
    form,
    selectedId,
    isViewing,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isSaving,
    isBusy,
    feedback,
    carregarApoio,
    pesquisar,
    selecionar,
    salvar,
    novo,
  }
}
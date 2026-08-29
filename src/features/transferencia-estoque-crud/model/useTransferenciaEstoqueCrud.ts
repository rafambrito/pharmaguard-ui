import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import {
  filtrarTransferenciasEstoque,
  type NovaTransferenciaEstoque,
  type TransferenciaEstoque,
  type TransferenciaEstoqueFiltro,
} from '@/entities/transferencia-estoque'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import {
  createTransferenciaEstoque,
  listTransferenciasEstoque,
} from '@/shared/api/stockTransferApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface TransferenciaEstoqueForm {
  unidadeOrigemId: string
  unidadeDestinoId: string
  medicamentoId: string
  quantidade: string
  documento: string
  observacao: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): TransferenciaEstoqueForm {
  return {
    unidadeOrigemId: '',
    unidadeDestinoId: '',
    medicamentoId: '',
    quantidade: '',
    documento: '',
    observacao: '',
  }
}

function emptyFiltro(): TransferenciaEstoqueFiltro {
  return { ...emptyForm() }
}

function toNumber(value: string): number {
  return Number(value)
}

export function useTransferenciaEstoqueCrud() {
  const transferencias = ref<TransferenciaEstoque[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const form = reactive<TransferenciaEstoqueForm>(emptyForm())
  const criterios = ref<TransferenciaEstoqueFiltro>(emptyFiltro())
  const selectedId = ref<string | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isViewing = computed(() => selectedId.value !== null)
  const transferenciasFiltradas = computed(() =>
    filtrarTransferenciasEstoque(transferencias.value, criterios.value),
  )
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value || isSaving.value)
  const medicamentosAtivos = computed(() => medicamentos.value.filter((medicamento) => medicamento.ativo))
  const unidadesSaudeAtivas = computed(() =>
    unidadesSaude.value.filter((unidadeSaude) => unidadeSaude.status === 'ATIVA'),
  )

  function applyForm(source: TransferenciaEstoqueForm): void {
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
      fail(error, 'transferenciasEstoque.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...form }

    if (!form.unidadeOrigemId) {
      transferencias.value = []
      hasSearched.value = true
      feedback.value = { tone: 'error', message: t('transferenciasEstoque.feedback.unidadeOrigemRequired') }
      return
    }

    isLoading.value = true
    feedback.value = null

    try {
      transferencias.value = await listTransferenciasEstoque({
        unidadeOrigemId: toNumber(form.unidadeOrigemId),
        medicamentoId: form.medicamentoId ? toNumber(form.medicamentoId) : undefined,
      })
      hasSearched.value = true
    } catch (error) {
      transferencias.value = []
      fail(error, 'transferenciasEstoque.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    transferencias.value = []
    hasSearched.value = false
    feedback.value = null
  }

  function selecionar(transferencia: TransferenciaEstoque): void {
    selectedId.value = transferencia.id
    applyForm({
      unidadeOrigemId: String(transferencia.unidadeOrigemId),
      unidadeDestinoId: transferencia.unidadeDestinoId === null ? '' : String(transferencia.unidadeDestinoId),
      medicamentoId: String(transferencia.medicamentoId),
      quantidade: String(transferencia.quantidade),
      documento: transferencia.documento ?? '',
      observacao: transferencia.observacao ?? '',
    })
    feedback.value = null
  }

  async function salvar(): Promise<void> {
    if (selectedId.value !== null) {
      feedback.value = { tone: 'error', message: t('transferenciasEstoque.feedback.readOnly') }
      return
    }

    if (form.unidadeOrigemId && form.unidadeOrigemId === form.unidadeDestinoId) {
      feedback.value = { tone: 'error', message: t('transferenciasEstoque.feedback.sameUnit') }
      return
    }

    isSaving.value = true
    feedback.value = null

    try {
      const payload: NovaTransferenciaEstoque = {
        unidadeOrigemId: toNumber(form.unidadeOrigemId),
        unidadeDestinoId: toNumber(form.unidadeDestinoId),
        medicamentoId: toNumber(form.medicamentoId),
        quantidade: toNumber(form.quantidade),
        documento: form.documento || undefined,
        observacao: form.observacao || undefined,
      }
      const salvo = await createTransferenciaEstoque(payload)
      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      transferencias.value = [salvo]
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('transferenciasEstoque.feedback.created') }
    } catch (error) {
      fail(error, 'transferenciasEstoque.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  return {
    transferencias: transferenciasFiltradas,
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
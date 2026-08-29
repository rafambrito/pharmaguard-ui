import { computed, reactive, ref } from 'vue'
import {
  filtrarUnidadesMedida,
  type AtualizacaoUnidadeMedida,
  type NovaUnidadeMedida,
  type UnidadeMedida,
  type UnidadeMedidaFiltro,
  type UnidadeMedidaStatus,
} from '@/entities/unidade-medida'
import {
  createUnidadeMedida,
  deleteUnidadeMedida,
  getUnidadeMedida,
  listUnidadesMedida,
  updateUnidadeMedida,
} from '@/shared/api/unitMeasureApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface UnidadeMedidaForm {
  nome: string
  sigla: string
  status: UnidadeMedidaStatus | ''
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): UnidadeMedidaForm {
  return { nome: '', sigla: '', status: '' }
}

function emptyFiltro(): UnidadeMedidaFiltro {
  return { ...emptyForm() }
}

function toStatus(ativo: boolean): UnidadeMedidaStatus {
  return ativo ? 'ATIVA' : 'INATIVA'
}

export function useUnidadeMedidaCrud() {
  const unidadesMedida = ref<UnidadeMedida[]>([])
  const form = reactive<UnidadeMedidaForm>(emptyForm())
  const criterios = ref<UnidadeMedidaFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const unidadesMedidaFiltradas = computed(() =>
    filtrarUnidadesMedida(unidadesMedida.value, criterios.value),
  )
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value)

  function applyForm(source: UnidadeMedidaForm): void {
    Object.assign(form, source)
  }

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...form }
    isLoading.value = true
    feedback.value = null

    try {
      unidadesMedida.value = await listUnidadesMedida()
      hasSearched.value = true
    } catch (error) {
      unidadesMedida.value = []
      fail(error, 'unidadesMedida.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    unidadesMedida.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(unidadeMedida: UnidadeMedida): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getUnidadeMedida(unidadeMedida.id)
      selectedId.value = detalhe.id
      applyForm({
        nome: detalhe.nome,
        sigla: detalhe.sigla,
        status: toStatus(detalhe.ativo),
      })
    } catch (error) {
      fail(error, 'unidadesMedida.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      let salvo: UnidadeMedida

      if (selectedId.value === null) {
        const payload: NovaUnidadeMedida = {
          nome: form.nome,
          sigla: form.sigla,
        }
        salvo = await createUnidadeMedida(payload)
        feedback.value = { tone: 'success', message: t('unidadesMedida.feedback.created') }
      } else {
        const payload: AtualizacaoUnidadeMedida = {
          nome: form.nome,
          sigla: form.sigla,
          ativo: form.status ? form.status === 'ATIVA' : undefined,
        }
        salvo = await updateUnidadeMedida(selectedId.value, payload)
        feedback.value = { tone: 'success', message: t('unidadesMedida.feedback.updated') }
      }

      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      unidadesMedida.value = [salvo]
      hasSearched.value = true
    } catch (error) {
      fail(error, 'unidadesMedida.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  async function remover(): Promise<void> {
    if (selectedId.value === null) {
      return
    }

    isDeleting.value = true
    feedback.value = null

    try {
      const removidoId = selectedId.value
      await deleteUnidadeMedida(removidoId)
      selectedId.value = null
      applyForm(emptyForm())
      unidadesMedida.value = unidadesMedida.value.filter(
        (unidadeMedida) => unidadeMedida.id !== removidoId,
      )
      feedback.value = { tone: 'success', message: t('unidadesMedida.feedback.deleted') }
    } catch (error) {
      fail(error, 'unidadesMedida.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    unidadesMedida: unidadesMedidaFiltradas,
    form,
    selectedId,
    isEditing,
    hasSearched,
    isLoading,
    isSaving,
    isDeleting,
    isBusy,
    feedback,
    pesquisar,
    selecionar,
    salvar,
    remover,
    novo,
  }
}
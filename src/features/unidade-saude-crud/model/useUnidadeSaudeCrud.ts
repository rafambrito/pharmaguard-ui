import { computed, reactive, ref } from 'vue'
import {
  filtrarUnidadesSaude,
  type AtualizacaoUnidadeSaude,
  type NovaUnidadeSaude,
  type UnidadeSaude,
  type UnidadeSaudeFiltro,
  type UnidadeSaudeStatus,
} from '@/entities/unidade-saude'
import {
  createUnidadeSaude,
  getUnidadeSaude,
  inactivateUnidadeSaude,
  listUnidadesSaude,
  updateUnidadeSaude,
} from '@/shared/api/healthUnitApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface UnidadeSaudeForm {
  identificacao: string
  nome: string
  tipo: string
  endereco: string
  status: UnidadeSaudeStatus | ''
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): UnidadeSaudeForm {
  return { identificacao: '', nome: '', tipo: '', endereco: '', status: '' }
}

function emptyFiltro(): UnidadeSaudeFiltro {
  return { ...emptyForm() }
}

export function useUnidadeSaudeCrud() {
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const form = reactive<UnidadeSaudeForm>(emptyForm())
  const criterios = ref<UnidadeSaudeFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const unidadesSaudeFiltradas = computed(() =>
    filtrarUnidadesSaude(unidadesSaude.value, criterios.value),
  )
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value)

  function applyForm(source: UnidadeSaudeForm): void {
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
      unidadesSaude.value = await listUnidadesSaude()
      hasSearched.value = true
    } catch (error) {
      unidadesSaude.value = []
      fail(error, 'unidadesSaude.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    unidadesSaude.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(unidadeSaude: UnidadeSaude): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getUnidadeSaude(unidadeSaude.id)
      selectedId.value = detalhe.id
      applyForm({
        identificacao: detalhe.identificacao,
        nome: detalhe.nome,
        tipo: detalhe.tipo,
        endereco: detalhe.endereco,
        status: detalhe.status,
      })
    } catch (error) {
      fail(error, 'unidadesSaude.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      let salvo: UnidadeSaude
      const payload: NovaUnidadeSaude | AtualizacaoUnidadeSaude = {
        identificacao: form.identificacao,
        nome: form.nome,
        tipo: form.tipo,
        endereco: form.endereco,
      }

      if (selectedId.value === null) {
        salvo = await createUnidadeSaude(payload)
        feedback.value = { tone: 'success', message: t('unidadesSaude.feedback.created') }
      } else {
        salvo = await updateUnidadeSaude(selectedId.value, payload)
        feedback.value = { tone: 'success', message: t('unidadesSaude.feedback.updated') }
      }

      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      unidadesSaude.value = [salvo]
      hasSearched.value = true
    } catch (error) {
      fail(error, 'unidadesSaude.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  async function inativar(): Promise<void> {
    if (selectedId.value === null) {
      return
    }

    isDeleting.value = true
    feedback.value = null

    try {
      const inativadaId = selectedId.value
      await inactivateUnidadeSaude(inativadaId)
      selectedId.value = null
      applyForm(emptyForm())
      unidadesSaude.value = unidadesSaude.value.map((unidadeSaude) =>
        unidadeSaude.id === inativadaId ? { ...unidadeSaude, status: 'INATIVA' } : unidadeSaude,
      )
      feedback.value = { tone: 'success', message: t('unidadesSaude.feedback.inactivated') }
    } catch (error) {
      fail(error, 'unidadesSaude.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    unidadesSaude: unidadesSaudeFiltradas,
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
    inativar,
    novo,
  }
}
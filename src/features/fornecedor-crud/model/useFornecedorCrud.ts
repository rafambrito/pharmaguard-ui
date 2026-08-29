import { computed, reactive, ref } from 'vue'
import {
  filtrarFornecedores,
  type AtualizacaoFornecedor,
  type Fornecedor,
  type FornecedorFiltro,
  type FornecedorStatus,
  type NovoFornecedor,
} from '@/entities/fornecedor'
import {
  createFornecedor,
  deleteFornecedor,
  getFornecedor,
  listFornecedores,
  updateFornecedor,
} from '@/shared/api/supplierApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface FornecedorForm {
  nome: string
  codigo: string
  documento: string
  observacao: string
  leadTimeDias: string
  status: FornecedorStatus | ''
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): FornecedorForm {
  return { nome: '', codigo: '', documento: '', observacao: '', leadTimeDias: '', status: '' }
}

function emptyFiltro(): FornecedorFiltro {
  return { ...emptyForm() }
}

function toStatus(ativo: boolean): FornecedorStatus {
  return ativo ? 'ATIVO' : 'INATIVO'
}

function toLeadTimeDias(value: string): number {
  return Number(value || '0')
}

export function useFornecedorCrud() {
  const fornecedores = ref<Fornecedor[]>([])
  const form = reactive<FornecedorForm>(emptyForm())
  const criterios = ref<FornecedorFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const fornecedoresFiltrados = computed(() => filtrarFornecedores(fornecedores.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value)

  function applyForm(source: FornecedorForm): void {
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
      fornecedores.value = await listFornecedores()
      hasSearched.value = true
    } catch (error) {
      fornecedores.value = []
      fail(error, 'fornecedores.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    fornecedores.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(fornecedor: Fornecedor): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getFornecedor(fornecedor.id)
      selectedId.value = detalhe.id
      applyForm({
        nome: detalhe.nome,
        codigo: detalhe.codigo,
        documento: detalhe.documento ?? '',
        observacao: detalhe.observacao ?? '',
        leadTimeDias: detalhe.leadTimeDias === null ? '' : String(detalhe.leadTimeDias),
        status: toStatus(detalhe.ativo),
      })
    } catch (error) {
      fail(error, 'fornecedores.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      let salvo: Fornecedor

      if (selectedId.value === null) {
        const payload: NovoFornecedor = {
          nome: form.nome,
          codigo: form.codigo,
          documento: form.documento || undefined,
          observacao: form.observacao || undefined,
          leadTimeDias: toLeadTimeDias(form.leadTimeDias),
        }
        salvo = await createFornecedor(payload)
        feedback.value = { tone: 'success', message: t('fornecedores.feedback.created') }
      } else {
        const payload: AtualizacaoFornecedor = {
          nome: form.nome,
          codigo: form.codigo,
          documento: form.documento || undefined,
          observacao: form.observacao || undefined,
          leadTimeDias: toLeadTimeDias(form.leadTimeDias),
          ativo: form.status ? form.status === 'ATIVO' : undefined,
        }
        salvo = await updateFornecedor(selectedId.value, payload)
        feedback.value = { tone: 'success', message: t('fornecedores.feedback.updated') }
      }

      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      fornecedores.value = [salvo]
      hasSearched.value = true
    } catch (error) {
      fail(error, 'fornecedores.feedback.saveError')
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
      await deleteFornecedor(removidoId)
      selectedId.value = null
      applyForm(emptyForm())
      fornecedores.value = fornecedores.value.filter((fornecedor) => fornecedor.id !== removidoId)
      feedback.value = { tone: 'success', message: t('fornecedores.feedback.deleted') }
    } catch (error) {
      fail(error, 'fornecedores.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    fornecedores: fornecedoresFiltrados,
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
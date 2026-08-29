import { computed, reactive, ref } from 'vue'
import {
  filtrarMedicamentos,
  type AtualizacaoMedicamento,
  type CategoriaMedicamentoOpcao,
  type Medicamento,
  type MedicamentoCategoria,
  type MedicamentoCriticidade,
  type MedicamentoFiltro,
  type MedicamentoStatus,
  type NovoMedicamento,
  type UnidadeMedidaMedicamento,
} from '@/entities/medicamento'
import {
  createMedicamento,
  deleteMedicamento,
  getMedicamento,
  listCategoriasMedicamento,
  listMedicamentos,
  listUnidadesMedidaMedicamento,
  updateMedicamento,
} from '@/shared/api/medicationApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface MedicamentoForm {
  nome: string
  apresentacao: string
  descricao: string
  categoria: MedicamentoCategoria | ''
  unidadeMedidaId: string
  criticidade: MedicamentoCriticidade | ''
  status: MedicamentoStatus | ''
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): MedicamentoForm {
  return {
    nome: '',
    apresentacao: '',
    descricao: '',
    categoria: '',
    unidadeMedidaId: '',
    criticidade: '',
    status: '',
  }
}

function emptyFiltro(): MedicamentoFiltro {
  return { ...emptyForm() }
}

function requireNumber(value: string): number {
  return Number(value)
}

function toStatus(ativo: boolean): MedicamentoStatus {
  return ativo ? 'ATIVO' : 'INATIVO'
}

export function useMedicamentoCrud() {
  const medicamentos = ref<Medicamento[]>([])
  const categorias = ref<CategoriaMedicamentoOpcao[]>([])
  const unidadesMedida = ref<UnidadeMedidaMedicamento[]>([])
  const form = reactive<MedicamentoForm>(emptyForm())
  const criterios = ref<MedicamentoFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const medicamentosFiltrados = computed(() => filtrarMedicamentos(medicamentos.value, criterios.value))
  const isBusy = computed(
    () => isLoading.value || isLoadingSupport.value || isSaving.value || isDeleting.value,
  )
  const unidadesMedidaAtivas = computed(() =>
    unidadesMedida.value.filter((unidadeMedida) => unidadeMedida.ativo),
  )

  function applyForm(source: MedicamentoForm): void {
    Object.assign(form, source)
  }

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  function findCategoriaCodigo(nome: string): MedicamentoCategoria | '' {
    return categorias.value.find((categoria) => categoria.nome === nome)?.codigo ?? ''
  }

  async function carregarApoio(): Promise<void> {
    isLoadingSupport.value = true
    feedback.value = null

    try {
      const [categoriasResponse, unidadesMedidaResponse] = await Promise.all([
        listCategoriasMedicamento(),
        listUnidadesMedidaMedicamento(),
      ])
      categorias.value = categoriasResponse
      unidadesMedida.value = unidadesMedidaResponse
    } catch (error) {
      fail(error, 'medicamentos.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { ...form }
    isLoading.value = true
    feedback.value = null

    try {
      medicamentos.value = await listMedicamentos()
      hasSearched.value = true
    } catch (error) {
      medicamentos.value = []
      fail(error, 'medicamentos.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    medicamentos.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(medicamento: Medicamento): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getMedicamento(medicamento.id)
      selectedId.value = detalhe.id
      applyForm({
        nome: detalhe.nome,
        apresentacao: detalhe.apresentacao,
        descricao: detalhe.descricao ?? '',
        categoria: findCategoriaCodigo(detalhe.categoria.nome),
        unidadeMedidaId: String(detalhe.unidadeMedida.id),
        criticidade: detalhe.criticidade,
        status: toStatus(detalhe.ativo),
      })
    } catch (error) {
      fail(error, 'medicamentos.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      let salvo: Medicamento

      if (selectedId.value === null) {
        const payload: NovoMedicamento = {
          nome: form.nome,
          apresentacao: form.apresentacao,
          descricao: form.descricao || undefined,
          categoria: form.categoria as MedicamentoCategoria,
          unidadeMedidaId: requireNumber(form.unidadeMedidaId),
          criticidade: form.criticidade as MedicamentoCriticidade,
        }
        salvo = await createMedicamento(payload)
        feedback.value = { tone: 'success', message: t('medicamentos.feedback.created') }
      } else {
        const payload: AtualizacaoMedicamento = {
          nome: form.nome,
          apresentacao: form.apresentacao,
          descricao: form.descricao || undefined,
          categoria: form.categoria as MedicamentoCategoria,
          unidadeMedidaId: requireNumber(form.unidadeMedidaId),
          criticidade: form.criticidade as MedicamentoCriticidade,
          ativo: form.status ? form.status === 'ATIVO' : undefined,
        }
        salvo = await updateMedicamento(selectedId.value, payload)
        feedback.value = { tone: 'success', message: t('medicamentos.feedback.updated') }
      }

      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      medicamentos.value = [salvo]
      hasSearched.value = true
    } catch (error) {
      fail(error, 'medicamentos.feedback.saveError')
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
      await deleteMedicamento(removidoId)
      selectedId.value = null
      applyForm(emptyForm())
      medicamentos.value = medicamentos.value.filter((medicamento) => medicamento.id !== removidoId)
      feedback.value = { tone: 'success', message: t('medicamentos.feedback.deleted') }
    } catch (error) {
      fail(error, 'medicamentos.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    medicamentos: medicamentosFiltrados,
    categorias,
    unidadesMedida: unidadesMedidaAtivas,
    form,
    selectedId,
    isEditing,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isSaving,
    isDeleting,
    isBusy,
    feedback,
    carregarApoio,
    pesquisar,
    selecionar,
    salvar,
    remover,
    novo,
  }
}
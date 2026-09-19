import { computed, reactive, ref } from 'vue'
import type { Dispensacao } from '@/entities/dispensacao'
import {
  filtrarPacientes,
  type AtualizacaoPaciente,
  type NovoPaciente,
  type Paciente,
  type PacienteFiltro,
  type PacienteStatus,
} from '@/entities/paciente'
import {
  createPaciente,
  getPaciente,
  inactivatePaciente,
  listDispensacoesPaciente,
  listPacientes,
  updatePaciente,
} from '@/shared/api/patientApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface PacienteForm {
  nome: string
  cpf: string
  dataNascimento: string
  cartaoSus: string
  telefone: string
  email: string
  cidade: string
  uf: string
  status: PacienteStatus | ''
}

interface Feedback {
  tone: 'success' | 'error'
  message: string
}

function emptyForm(): PacienteForm {
  return { nome: '', cpf: '', dataNascimento: '', cartaoSus: '', telefone: '', email: '', cidade: '', uf: '', status: '' }
}

function emptyFiltro(): PacienteFiltro {
  return { cpf: '', nome: '', status: '' }
}

function toPayload(form: PacienteForm): NovoPaciente {
  return {
    nome: form.nome,
    cpf: form.cpf,
    dataNascimento: form.dataNascimento,
    cartaoSus: form.cartaoSus || undefined,
    telefone: form.telefone || undefined,
    email: form.email || undefined,
    cidade: form.cidade || undefined,
    uf: form.uf || undefined,
  }
}

export function usePacienteCrud() {
  const pacientes = ref<Paciente[]>([])
  const historico = ref<Dispensacao[]>([])
  const form = reactive<PacienteForm>(emptyForm())
  const criterios = ref<PacienteFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const isLoadingHistory = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const pacientesFiltrados = computed(() => filtrarPacientes(pacientes.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value || isLoadingHistory.value)

  function applyForm(source: PacienteForm): void {
    Object.assign(form, source)
  }

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { cpf: form.cpf, nome: form.nome, status: form.status }
    isLoading.value = true
    feedback.value = null

    try {
      pacientes.value = await listPacientes({
        cpf: form.cpf || undefined,
        nome: form.nome || undefined,
      })
      hasSearched.value = true
    } catch (error) {
      pacientes.value = []
      fail(error, 'pacientes.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    pacientes.value = []
    historico.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(paciente: Paciente): Promise<void> {
    isLoadingHistory.value = true
    feedback.value = null

    try {
      const [detalhe, dispensacoes] = await Promise.all([
        getPaciente(paciente.id),
        listDispensacoesPaciente(paciente.id),
      ])
      selectedId.value = detalhe.id
      historico.value = dispensacoes
      applyForm({
        nome: detalhe.nome,
        cpf: detalhe.cpf,
        dataNascimento: detalhe.dataNascimento,
        cartaoSus: detalhe.cartaoSus ?? '',
        telefone: detalhe.telefone ?? '',
        email: detalhe.email ?? '',
        cidade: detalhe.cidade ?? '',
        uf: detalhe.uf ?? '',
        status: detalhe.status,
      })
    } catch (error) {
      historico.value = []
      fail(error, 'pacientes.feedback.loadOneError')
    } finally {
      isLoadingHistory.value = false
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      const payload = toPayload(form)
      const isCreating = selectedId.value === null
      const salvo = isCreating
        ? await createPaciente(payload)
        : await updatePaciente(selectedId.value, payload as AtualizacaoPaciente)
      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      pacientes.value = [salvo]
      hasSearched.value = true
      feedback.value = {
        tone: 'success',
        message: t(isCreating ? 'pacientes.feedback.created' : 'pacientes.feedback.updated'),
      }
    } catch (error) {
      fail(error, 'pacientes.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  async function inativar(): Promise<void> {
    if (selectedId.value === null) return

    isDeleting.value = true
    feedback.value = null
    try {
      const pacienteId = selectedId.value
      await inactivatePaciente(pacienteId)
      pacientes.value = pacientes.value.map((paciente) =>
        paciente.id === pacienteId ? { ...paciente, status: 'INATIVO' } : paciente,
      )
      form.status = 'INATIVO'
      feedback.value = { tone: 'success', message: t('pacientes.feedback.inactivated') }
    } catch (error) {
      fail(error, 'pacientes.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    pacientes: pacientesFiltrados,
    historico,
    form,
    selectedId,
    isEditing,
    hasSearched,
    isLoading,
    isSaving,
    isDeleting,
    isLoadingHistory,
    isBusy,
    feedback,
    pesquisar,
    selecionar,
    salvar,
    inativar,
    novo,
  }
}
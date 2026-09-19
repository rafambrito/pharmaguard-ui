import { computed, reactive, ref } from 'vue'
import type { Medicamento } from '@/entities/medicamento'
import type { UnidadeSaude } from '@/entities/unidade-saude'
import {
  filtrarDispensacoes,
  type Dispensacao,
  type DispensacaoFiltro,
  type NovaDispensacao,
} from '@/entities/dispensacao'
import type { Paciente } from '@/entities/paciente'
import { listMedicamentos } from '@/shared/api/medicationApi'
import { createDispensacao, getDispensacao, listDispensacoes } from '@/shared/api/dispensationApi'
import { listUnidadesSaude } from '@/shared/api/healthUnitApi'
import { listPacientes } from '@/shared/api/patientApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface DispensacaoForm {
  unidadeId: string
  pacienteId: string
  medicamentoId: string
  quantidade: string
  numeroReceita: string
  crmPrescritor: string
  observacao: string
  dataInicial: string
  dataFinal: string
}

interface Feedback {
  tone: 'success' | 'error'
  message: string
}

function emptyForm(): DispensacaoForm {
  return { unidadeId: '', pacienteId: '', medicamentoId: '', quantidade: '', numeroReceita: '', crmPrescritor: '', observacao: '', dataInicial: '', dataFinal: '' }
}

function emptyFiltro(): DispensacaoFiltro {
  return { unidadeId: '', pacienteId: '', medicamentoId: '', dataInicial: '', dataFinal: '' }
}

function toNumber(value: string): number {
  return Number(value)
}

export function useDispensacaoCrud() {
  const dispensacoes = ref<Dispensacao[]>([])
  const pacientes = ref<Paciente[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const unidadesSaude = ref<UnidadeSaude[]>([])
  const form = reactive<DispensacaoForm>(emptyForm())
  const criterios = ref<DispensacaoFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isLoadingSupport = ref(false)
  const isSearchingPatients = ref(false)
  const isSaving = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isViewing = computed(() => selectedId.value !== null)
  const dispensacoesFiltradas = computed(() => filtrarDispensacoes(dispensacoes.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isLoadingSupport.value || isSearchingPatients.value || isSaving.value)
  const medicamentosAtivos = computed(() => medicamentos.value.filter((medicamento) => medicamento.ativo))
  const unidadesSaudeAtivas = computed(() => unidadesSaude.value.filter((unidade) => unidade.status === 'ATIVA'))
  const pacientesAtivos = computed(() => pacientes.value.filter((paciente) => paciente.status === 'ATIVO'))

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  async function carregarApoio(): Promise<void> {
    isLoadingSupport.value = true
    feedback.value = null
    try {
      const [medicamentosResponse, unidadesResponse] = await Promise.all([listMedicamentos(), listUnidadesSaude()])
      medicamentos.value = medicamentosResponse
      unidadesSaude.value = unidadesResponse
    } catch (error) {
      fail(error, 'dispensacoes.feedback.supportLoadError')
    } finally {
      isLoadingSupport.value = false
    }
  }

  async function buscarPacientes(termo: string): Promise<void> {
    if (!termo.trim()) {
      pacientes.value = []
      return
    }
    isSearchingPatients.value = true
    try {
      const cpf = termo.replace(/\D/g, '')
      pacientes.value = await listPacientes(cpf.length === 11 ? { cpf } : { nome: termo })
    } catch (error) {
      pacientes.value = []
      fail(error, 'dispensacoes.feedback.patientSearchError')
    } finally {
      isSearchingPatients.value = false
    }
  }

  async function pesquisar(): Promise<void> {
    criterios.value = { unidadeId: form.unidadeId, pacienteId: form.pacienteId, medicamentoId: form.medicamentoId, dataInicial: form.dataInicial, dataFinal: form.dataFinal }
    isLoading.value = true
    feedback.value = null
    try {
      dispensacoes.value = await listDispensacoes({
        unidadeId: form.unidadeId ? toNumber(form.unidadeId) : undefined,
        pacienteId: form.pacienteId ? toNumber(form.pacienteId) : undefined,
        medicamentoId: form.medicamentoId ? toNumber(form.medicamentoId) : undefined,
        dataInicial: form.dataInicial || undefined,
        dataFinal: form.dataFinal || undefined,
      })
      hasSearched.value = true
    } catch (error) {
      dispensacoes.value = []
      fail(error, 'dispensacoes.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    Object.assign(form, emptyForm())
    criterios.value = emptyFiltro()
    dispensacoes.value = []
    pacientes.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(dispensacao: Dispensacao): Promise<void> {
    isLoading.value = true
    feedback.value = null
    try {
      const detalhe = await getDispensacao(dispensacao.id)
      selectedId.value = detalhe.id
      if (!pacientes.value.some((paciente) => paciente.id === detalhe.pacienteId)) {
        pacientes.value = await listPacientes()
      }
      Object.assign(form, {
        unidadeId: String(detalhe.unidadeId), pacienteId: String(detalhe.pacienteId), medicamentoId: String(detalhe.medicamentoId), quantidade: String(detalhe.quantidade), numeroReceita: detalhe.numeroReceita ?? '', crmPrescritor: detalhe.crmPrescritor ?? '', observacao: detalhe.observacao ?? '', dataInicial: '', dataFinal: '',
      })
    } catch (error) {
      fail(error, 'dispensacoes.feedback.loadOneError')
    } finally {
      isLoading.value = false
    }
  }

  async function salvar(): Promise<void> {
    if (selectedId.value !== null) return
    isSaving.value = true
    feedback.value = null
    try {
      const payload: NovaDispensacao = {
        unidadeId: toNumber(form.unidadeId), pacienteId: toNumber(form.pacienteId), medicamentoId: toNumber(form.medicamentoId), quantidade: toNumber(form.quantidade), numeroReceita: form.numeroReceita || undefined, crmPrescritor: form.crmPrescritor || undefined, observacao: form.observacao || undefined,
      }
      const salva = await createDispensacao(payload)
      selectedId.value = salva.id
      dispensacoes.value = [salva]
      hasSearched.value = true
      feedback.value = { tone: 'success', message: t('dispensacoes.feedback.created') }
    } catch (error) {
      fail(error, 'dispensacoes.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  return {
    dispensacoes: dispensacoesFiltradas,
    pacientes: pacientesAtivos,
    medicamentos: medicamentosAtivos,
    unidadesSaude: unidadesSaudeAtivas,
    form,
    selectedId,
    isViewing,
    hasSearched,
    isLoading,
    isLoadingSupport,
    isSearchingPatients,
    isSaving,
    isBusy,
    feedback,
    carregarApoio,
    buscarPacientes,
    pesquisar,
    selecionar,
    salvar,
    novo,
  }
}
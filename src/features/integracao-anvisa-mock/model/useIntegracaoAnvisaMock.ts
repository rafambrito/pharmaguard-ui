import { computed, reactive, ref } from 'vue'
import { t } from '@/shared/config/messages'

export type AnvisaConexaoStatus = 'DESCONECTADO' | 'CONECTADO'

export interface AnvisaConfiguracao {
  endpoint: string
  clientId: string
  clientSecret: string
}

export interface AnvisaConsultaForm {
  medicamentoId: number | null
  medicamentoNome: string
  codigoRegistro: string
  lote: string
}

export const ANVISA_SITUACOES_REGISTRO = ['VALIDO', 'VENCIDO', 'CANCELADO'] as const

export type AnvisaSituacaoRegistro = (typeof ANVISA_SITUACOES_REGISTRO)[number]

export interface AnvisaConsultaResultado {
  id: string
  dataHora: string
  medicamentoNome: string
  codigoRegistro: string
  lote: string
  situacaoRegistro: AnvisaSituacaoRegistro
  recall: boolean
  mensagemRecall: string | null
  validadeRegulatoria: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyConfiguracao(): AnvisaConfiguracao {
  return {
    endpoint: 'https://consultas.anvisa.gov.br/api/consulta/medicamentos',
    clientId: '',
    clientSecret: '',
  }
}

function emptyConsultaForm(): AnvisaConsultaForm {
  return {
    medicamentoId: null,
    medicamentoNome: '',
    codigoRegistro: '',
    lote: '',
  }
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function agoraFormatado(): string {
  return new Date().toLocaleString('pt-BR')
}

function sortearSituacao(): AnvisaSituacaoRegistro {
  const sorteio = Math.random()

  if (sorteio < 0.7) {
    return 'VALIDO'
  }

  return sorteio < 0.85 ? 'VENCIDO' : 'CANCELADO'
}

function gerarCodigoRegistro(medicamentoId: number): string {
  return `1.${String(1000 + medicamentoId).padStart(4, '0')}.0001.001-${medicamentoId}`
}

function gerarValidadeRegulatoria(): string {
  const data = new Date()
  data.setMonth(data.getMonth() + 6 + Math.floor(Math.random() * 24))
  return data.toISOString().slice(0, 10)
}

export function useIntegracaoAnvisaMock() {
  const configuracao = reactive<AnvisaConfiguracao>(emptyConfiguracao())
  const consulta = reactive<AnvisaConsultaForm>(emptyConsultaForm())
  const conexaoStatus = ref<AnvisaConexaoStatus>('DESCONECTADO')
  const isConnecting = ref(false)
  const isConsulting = ref(false)
  const feedback = ref<Feedback | null>(null)
  const log = ref<AnvisaConsultaResultado[]>([])

  const isBusy = computed(() => isConnecting.value || isConsulting.value)
  const isConnected = computed(() => conexaoStatus.value === 'CONECTADO')
  const ultimaConsulta = computed(() => log.value[0] ?? null)

  async function conectar(): Promise<void> {
    isConnecting.value = true

    await aguardar(600)

    conexaoStatus.value = 'CONECTADO'
    isConnecting.value = false
  }

  function desconectar(): void {
    conexaoStatus.value = 'DESCONECTADO'
    log.value = []
    feedback.value = null
  }

  function selecionarMedicamento(medicamentoId: number | null, medicamentoNome: string): void {
    consulta.medicamentoId = medicamentoId
    consulta.medicamentoNome = medicamentoId ? medicamentoNome : ''
    consulta.codigoRegistro = medicamentoId ? gerarCodigoRegistro(medicamentoId) : ''
  }

  async function consultarRegistro(): Promise<void> {
    if (!consulta.medicamentoId || !consulta.codigoRegistro) {
      feedback.value = { tone: 'error', message: t('anvisa.feedback.medicamentoRequired') }
      return
    }

    if (!consulta.lote) {
      feedback.value = { tone: 'error', message: t('anvisa.feedback.loteRequired') }
      return
    }

    isConsulting.value = true
    feedback.value = null

    await aguardar(800)

    const situacaoRegistro = sortearSituacao()
    const recall = Math.random() < 0.2

    log.value.unshift({
      id: crypto.randomUUID(),
      dataHora: agoraFormatado(),
      medicamentoNome: consulta.medicamentoNome,
      codigoRegistro: consulta.codigoRegistro,
      lote: consulta.lote,
      situacaoRegistro,
      recall,
      mensagemRecall: recall ? t('anvisa.result.recallMessage') : null,
      validadeRegulatoria: gerarValidadeRegulatoria(),
    })

    isConsulting.value = false
    feedback.value = { tone: 'success', message: t('anvisa.feedback.consulted') }
  }

  return {
    configuracao,
    consulta,
    conexaoStatus,
    isConnecting,
    isConsulting,
    isBusy,
    isConnected,
    feedback,
    log,
    ultimaConsulta,
    conectar,
    desconectar,
    selecionarMedicamento,
    consultarRegistro,
  }
}

import { computed, reactive, ref } from 'vue'
import { t } from '@/shared/config/messages'

export type RndsConexaoStatus = 'DESCONECTADO' | 'CONECTADO'

export interface RndsConfiguracao {
  endpoint: string
  clientId: string
  clientSecret: string
}

export interface RndsDispensacaoForm {
  cpfCns: string
  medicamentoId: number | null
  medicamentoNome: string
  quantidade: string
}

export interface RndsDispensacaoLog {
  id: string
  dataHora: string
  cpfCns: string
  medicamentoNome: string
  quantidade: string
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyConfiguracao(): RndsConfiguracao {
  return {
    endpoint: 'https://rnds.saude.gov.br/api/v1',
    clientId: '',
    clientSecret: '',
  }
}

function emptyDispensacaoForm(): RndsDispensacaoForm {
  return {
    cpfCns: '',
    medicamentoId: null,
    medicamentoNome: '',
    quantidade: '',
  }
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function agoraFormatado(): string {
  return new Date().toLocaleString('pt-BR')
}

function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

export function useIntegracaoRndsMock() {
  const configuracao = reactive<RndsConfiguracao>(emptyConfiguracao())
  const dispensacao = reactive<RndsDispensacaoForm>(emptyDispensacaoForm())
  const conexaoStatus = ref<RndsConexaoStatus>('DESCONECTADO')
  const isConnecting = ref(false)
  const isSending = ref(false)
  const feedback = ref<Feedback | null>(null)
  const log = ref<RndsDispensacaoLog[]>([])

  const isBusy = computed(() => isConnecting.value || isSending.value)
  const isConnected = computed(() => conexaoStatus.value === 'CONECTADO')

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
    dispensacao.medicamentoId = medicamentoId
    dispensacao.medicamentoNome = medicamentoId ? medicamentoNome : ''
  }

  async function registrarDispensacao(): Promise<void> {
    const cpfCnsDigitos = somenteDigitos(dispensacao.cpfCns)

    if (cpfCnsDigitos.length !== 11 && cpfCnsDigitos.length !== 15) {
      feedback.value = { tone: 'error', message: t('rnds.feedback.cpfCnsInvalid') }
      return
    }

    if (!dispensacao.medicamentoId) {
      feedback.value = { tone: 'error', message: t('rnds.feedback.medicamentoRequired') }
      return
    }

    if (!dispensacao.quantidade || Number(dispensacao.quantidade) <= 0) {
      feedback.value = { tone: 'error', message: t('rnds.feedback.quantidadeRequired') }
      return
    }

    isSending.value = true
    feedback.value = null

    await aguardar(700)

    log.value.unshift({
      id: crypto.randomUUID(),
      dataHora: agoraFormatado(),
      cpfCns: cpfCnsDigitos,
      medicamentoNome: dispensacao.medicamentoNome,
      quantidade: dispensacao.quantidade,
    })

    dispensacao.cpfCns = ''
    dispensacao.medicamentoId = null
    dispensacao.medicamentoNome = ''
    dispensacao.quantidade = ''
    isSending.value = false
    feedback.value = {
      tone: 'success',
      message: t('rnds.feedback.registered'),
    }
  }

  return {
    configuracao,
    dispensacao,
    conexaoStatus,
    isConnecting,
    isSending,
    isBusy,
    isConnected,
    feedback,
    log,
    conectar,
    desconectar,
    selecionarMedicamento,
    registrarDispensacao,
  }
}

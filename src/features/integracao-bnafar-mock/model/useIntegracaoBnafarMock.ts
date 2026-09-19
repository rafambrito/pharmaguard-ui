import { computed, reactive, ref } from 'vue'

export type BnafarConexaoStatus = 'DESCONECTADO' | 'CONECTADO'

export interface BnafarConfiguracao {
  endpoint: string
  clientId: string
  clientSecret: string
}

export interface BnafarLogEntry {
  id: string
  dataHora: string
  posicaoEstoque: number
  entradas: number
  saidas: number
  perdas: number
}

function emptyConfiguracao(): BnafarConfiguracao {
  return {
    endpoint: 'https://esus.saude.gov.br/bnafar/api/v1',
    clientId: '',
    clientSecret: '',
  }
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function agoraFormatado(): string {
  return new Date().toLocaleString('pt-BR')
}

export function useIntegracaoBnafarMock() {
  const configuracao = reactive<BnafarConfiguracao>(emptyConfiguracao())
  const conexaoStatus = ref<BnafarConexaoStatus>('DESCONECTADO')
  const isConnecting = ref(false)
  const isSyncing = ref(false)
  const ultimaSincronizacao = ref<string | null>(null)
  const log = ref<BnafarLogEntry[]>([])

  const isBusy = computed(() => isConnecting.value || isSyncing.value)
  const isConnected = computed(() => conexaoStatus.value === 'CONECTADO')

  async function conectar(): Promise<void> {
    isConnecting.value = true

    await aguardar(600)

    conexaoStatus.value = 'CONECTADO'
    isConnecting.value = false
  }

  function desconectar(): void {
    conexaoStatus.value = 'DESCONECTADO'
    ultimaSincronizacao.value = null
    log.value = []
  }

  async function sincronizarAgora(): Promise<void> {
    isSyncing.value = true

    await aguardar(900)

    log.value.unshift({
      id: crypto.randomUUID(),
      dataHora: agoraFormatado(),
      posicaoEstoque: 50 + Math.floor(Math.random() * 400),
      entradas: Math.floor(Math.random() * 20),
      saidas: Math.floor(Math.random() * 20),
      perdas: Math.floor(Math.random() * 4),
    })

    ultimaSincronizacao.value = agoraFormatado()
    isSyncing.value = false
  }

  return {
    configuracao,
    conexaoStatus,
    isConnecting,
    isSyncing,
    isBusy,
    isConnected,
    ultimaSincronizacao,
    log,
    conectar,
    desconectar,
    sincronizarAgora,
  }
}

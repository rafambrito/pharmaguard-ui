import { computed, reactive, ref } from 'vue'

export type CatmatConexaoStatus = 'DESCONECTADO' | 'CONECTADO'

export interface CatmatConfiguracao {
  endpoint: string
  clientId: string
  clientSecret: string
}

export type CatmatItemSituacao = 'NOVO' | 'ATUALIZADO' | 'DUPLICIDADE_EVITADA'

export interface CatmatItemSincronizado {
  id: string
  codigoCatmat: string
  codigoTuss: string
  medicamentoNome: string
  situacao: CatmatItemSituacao
}

export interface CatmatSincronizacaoLog {
  id: string
  dataHora: string
  novos: number
  atualizados: number
  duplicidadesEvitadas: number
  itens: CatmatItemSincronizado[]
}

const CATALOGO_MOCK: Array<Omit<CatmatItemSincronizado, 'id' | 'situacao'>> = [
  { codigoCatmat: '123456', codigoTuss: '10101012', medicamentoNome: 'Dipirona Sódica 500mg' },
  { codigoCatmat: '234567', codigoTuss: '10101013', medicamentoNome: 'Amoxicilina 500mg' },
  { codigoCatmat: '345678', codigoTuss: '10101014', medicamentoNome: 'Paracetamol 750mg' },
  { codigoCatmat: '456789', codigoTuss: '10101015', medicamentoNome: 'Soro Fisiológico 0,9% 500ml' },
  { codigoCatmat: '567890', codigoTuss: '10101016', medicamentoNome: 'Insulina NPH 100UI/ml' },
  { codigoCatmat: '678901', codigoTuss: '10101017', medicamentoNome: 'Losartana Potássica 50mg' },
]

const SITUACOES: CatmatItemSituacao[] = ['NOVO', 'ATUALIZADO', 'DUPLICIDADE_EVITADA']

function emptyConfiguracao(): CatmatConfiguracao {
  return {
    endpoint: 'https://compras.gov.br/catmat/api/v1',
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

export function useIntegracaoCatmatMock() {
  const configuracao = reactive<CatmatConfiguracao>(emptyConfiguracao())
  const conexaoStatus = ref<CatmatConexaoStatus>('DESCONECTADO')
  const isConnecting = ref(false)
  const isSyncing = ref(false)
  const ultimaSincronizacao = ref<string | null>(null)
  const log = ref<CatmatSincronizacaoLog[]>([])

  const isBusy = computed(() => isConnecting.value || isSyncing.value)
  const isConnected = computed(() => conexaoStatus.value === 'CONECTADO')
  const ultimosItens = computed(() => log.value[0]?.itens ?? [])

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

  async function sincronizarCatalogo(): Promise<void> {
    isSyncing.value = true

    await aguardar(900)

    const itens: CatmatItemSincronizado[] = CATALOGO_MOCK.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      situacao: SITUACOES[Math.floor(Math.random() * SITUACOES.length)],
    }))

    log.value.unshift({
      id: crypto.randomUUID(),
      dataHora: agoraFormatado(),
      novos: itens.filter((item) => item.situacao === 'NOVO').length,
      atualizados: itens.filter((item) => item.situacao === 'ATUALIZADO').length,
      duplicidadesEvitadas: itens.filter((item) => item.situacao === 'DUPLICIDADE_EVITADA').length,
      itens,
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
    ultimosItens,
    conectar,
    desconectar,
    sincronizarCatalogo,
  }
}

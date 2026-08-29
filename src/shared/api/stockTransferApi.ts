import type { EntradaEstoque } from '@/entities/entrada-estoque'
import type { SaidaEstoque } from '@/entities/saida-estoque'
import type {
  NovaTransferenciaEstoque,
  TransferenciaEstoque,
} from '@/entities/transferencia-estoque'
import { createEntradaEstoque } from '@/shared/api/stockEntryApi'
import { createSaidaEstoque, listSaidasEstoque } from '@/shared/api/stockOutputApi'

export interface TransferenciaEstoqueQuery {
  unidadeOrigemId: number
  medicamentoId?: number
}

function toTransferenciaFromSaida(saida: SaidaEstoque): TransferenciaEstoque {
  return {
    id: `saida-${saida.id}`,
    unidadeOrigemId: saida.unidadeId,
    unidadeDestinoId: null,
    medicamentoId: saida.medicamentoId,
    quantidade: saida.quantidadeTotal,
    documento: null,
    observacao: saida.observacao,
    dataTransferencia: saida.dataSaida,
    saida,
    entradas: [],
  }
}

function toTransferencia(saida: SaidaEstoque, entradas: EntradaEstoque[], payload: NovaTransferenciaEstoque): TransferenciaEstoque {
  return {
    id: `saida-${saida.id}`,
    unidadeOrigemId: payload.unidadeOrigemId,
    unidadeDestinoId: payload.unidadeDestinoId,
    medicamentoId: payload.medicamentoId,
    quantidade: payload.quantidade,
    documento: payload.documento ?? null,
    observacao: payload.observacao ?? null,
    dataTransferencia: saida.dataSaida,
    saida,
    entradas,
  }
}

export async function createTransferenciaEstoque(
  payload: NovaTransferenciaEstoque,
): Promise<TransferenciaEstoque> {
  const saida = await createSaidaEstoque({
    unidadeId: payload.unidadeOrigemId,
    medicamentoId: payload.medicamentoId,
    quantidade: payload.quantidade,
    motivo: 'TRANSFERENCIA_SAIDA',
    observacao: payload.observacao,
  })

  const entradas = await Promise.all(
    saida.lotesConsumidos.map((lote) =>
      createEntradaEstoque({
        unidadeId: payload.unidadeDestinoId,
        medicamentoId: payload.medicamentoId,
        loteId: lote.loteId,
        quantidade: lote.quantidadeConsumida,
        origem: 'TRANSFERENCIA_ENTRADA',
        documento: payload.documento,
        observacao: payload.observacao,
      }),
    ),
  )

  return toTransferencia(saida, entradas, payload)
}

export async function listTransferenciasEstoque(
  query: TransferenciaEstoqueQuery,
): Promise<TransferenciaEstoque[]> {
  const saidas = await listSaidasEstoque({
    unidadeId: query.unidadeOrigemId,
    medicamentoId: query.medicamentoId,
  })

  return saidas.filter((saida) => saida.motivo === 'TRANSFERENCIA_SAIDA').map(toTransferenciaFromSaida)
}
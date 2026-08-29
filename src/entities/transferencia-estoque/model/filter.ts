import type {
  TransferenciaEstoque,
  TransferenciaEstoqueFiltro,
} from '@/entities/transferencia-estoque/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

export function filtrarTransferenciasEstoque(
  transferencias: TransferenciaEstoque[],
  filtro: TransferenciaEstoqueFiltro,
): TransferenciaEstoque[] {
  return transferencias.filter(
    (transferencia) =>
      (!filtro.unidadeDestinoId || transferencia.unidadeDestinoId === Number(filtro.unidadeDestinoId)) &&
      (!filtro.quantidade || transferencia.quantidade === Number(filtro.quantidade)) &&
      (!filtro.documento || includesText(transferencia.documento, filtro.documento)) &&
      (!filtro.observacao || includesText(transferencia.observacao, filtro.observacao)),
  )
}
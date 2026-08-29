import type { EntradaEstoque, EntradaEstoqueFiltro } from '@/entities/entrada-estoque/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

export function filtrarEntradasEstoque(
  entradas: EntradaEstoque[],
  filtro: EntradaEstoqueFiltro,
): EntradaEstoque[] {
  return entradas.filter(
    (entrada) =>
      (!filtro.quantidade || entrada.quantidade === Number(filtro.quantidade)) &&
      (!filtro.origem || entrada.origem === filtro.origem) &&
      (!filtro.documento || includesText(entrada.documento, filtro.documento)) &&
      (!filtro.observacao || includesText(entrada.observacao, filtro.observacao)),
  )
}
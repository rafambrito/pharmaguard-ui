import type { SaidaEstoque, SaidaEstoqueFiltro } from '@/entities/saida-estoque/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

export function filtrarSaidasEstoque(
  saidas: SaidaEstoque[],
  filtro: SaidaEstoqueFiltro,
): SaidaEstoque[] {
  return saidas.filter(
    (saida) =>
      (!filtro.quantidade || saida.quantidadeTotal === Number(filtro.quantidade)) &&
      (!filtro.motivo || saida.motivo === filtro.motivo) &&
      (!filtro.observacao || includesText(saida.observacao, filtro.observacao)),
  )
}
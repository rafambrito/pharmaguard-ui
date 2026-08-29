import type { UnidadeMedida, UnidadeMedidaFiltro } from '@/entities/unidade-medida/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

// A API de unidades de medida nao expoe parametros de consulta; os filtros sao aplicados sobre a listagem.
export function filtrarUnidadesMedida(
  unidadesMedida: UnidadeMedida[],
  filtro: UnidadeMedidaFiltro,
): UnidadeMedida[] {
  return unidadesMedida.filter((unidadeMedida) => {
    const status = unidadeMedida.ativo ? 'ATIVA' : 'INATIVA'

    return (
      (!filtro.nome || includesText(unidadeMedida.nome, filtro.nome)) &&
      (!filtro.sigla || includesText(unidadeMedida.sigla, filtro.sigla)) &&
      (!filtro.status || status === filtro.status)
    )
  })
}
import type { UnidadeSaude, UnidadeSaudeFiltro } from '@/entities/unidade-saude/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

// A API de unidades de saude nao expoe parametros de consulta; os filtros sao aplicados sobre a listagem.
export function filtrarUnidadesSaude(
  unidadesSaude: UnidadeSaude[],
  filtro: UnidadeSaudeFiltro,
): UnidadeSaude[] {
  return unidadesSaude.filter(
    (unidadeSaude) =>
      (!filtro.identificacao || includesText(unidadeSaude.identificacao, filtro.identificacao)) &&
      (!filtro.nome || includesText(unidadeSaude.nome, filtro.nome)) &&
      (!filtro.tipo || includesText(unidadeSaude.tipo, filtro.tipo)) &&
      (!filtro.endereco || includesText(unidadeSaude.endereco, filtro.endereco)) &&
      (!filtro.status || unidadeSaude.status === filtro.status),
  )
}
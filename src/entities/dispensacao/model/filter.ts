import type { Dispensacao, DispensacaoFiltro } from '@/entities/dispensacao/model/types'

export function filtrarDispensacoes(
  dispensacoes: Dispensacao[],
  filtro: DispensacaoFiltro,
): Dispensacao[] {
  return dispensacoes.filter(
    (dispensacao) =>
      (!filtro.unidadeId || dispensacao.unidadeId === Number(filtro.unidadeId)) &&
      (!filtro.pacienteId || dispensacao.pacienteId === Number(filtro.pacienteId)) &&
      (!filtro.medicamentoId || dispensacao.medicamentoId === Number(filtro.medicamentoId)),
  )
}
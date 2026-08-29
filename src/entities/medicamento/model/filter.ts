import type {
  Medicamento,
  MedicamentoCategoria,
  MedicamentoFiltro,
} from '@/entities/medicamento/model/types'

const categoriaNomePorCodigo: Record<MedicamentoCategoria, string> = {
  ANTIBIOTICO: 'Antibiótico',
  ANALGESICO: 'Analgésico',
  ANTIINFLAMATORIO: 'Anti-inflamatório',
  ANTITERMICO: 'Antitérmico',
  CONTROLADO: 'Controlado',
  INSUMO: 'Insumo',
  OUTROS: 'Outros',
}

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

// A API de medicamentos nao expoe parametros de consulta; os filtros sao aplicados sobre a listagem.
export function filtrarMedicamentos(
  medicamentos: Medicamento[],
  filtro: MedicamentoFiltro,
): Medicamento[] {
  return medicamentos.filter((medicamento) => {
    const status = medicamento.ativo ? 'ATIVO' : 'INATIVO'

    return (
      (!filtro.nome || includesText(medicamento.nome, filtro.nome)) &&
      (!filtro.apresentacao || includesText(medicamento.apresentacao, filtro.apresentacao)) &&
      (!filtro.descricao || includesText(medicamento.descricao, filtro.descricao)) &&
      (!filtro.categoria || medicamento.categoria.nome === categoriaNomePorCodigo[filtro.categoria]) &&
      (!filtro.unidadeMedidaId || medicamento.unidadeMedida.id === Number(filtro.unidadeMedidaId)) &&
      (!filtro.criticidade || medicamento.criticidade === filtro.criticidade) &&
      (!filtro.status || status === filtro.status)
    )
  })
}
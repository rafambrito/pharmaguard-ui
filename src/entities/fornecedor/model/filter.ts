import type { Fornecedor, FornecedorFiltro } from '@/entities/fornecedor/model/types'

function includesText(value: string | null | undefined, query: string): boolean {
  return value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) ?? false
}

// A API de fornecedores nao expoe parametros de consulta; os filtros sao aplicados sobre a listagem.
export function filtrarFornecedores(
  fornecedores: Fornecedor[],
  filtro: FornecedorFiltro,
): Fornecedor[] {
  return fornecedores.filter((fornecedor) => {
    const status = fornecedor.ativo ? 'ATIVO' : 'INATIVO'

    return (
      (!filtro.nome || includesText(fornecedor.nome, filtro.nome)) &&
      (!filtro.codigo || includesText(fornecedor.codigo, filtro.codigo)) &&
      (!filtro.documento || includesText(fornecedor.documento, filtro.documento)) &&
      (!filtro.observacao || includesText(fornecedor.observacao, filtro.observacao)) &&
      (!filtro.leadTimeDias || fornecedor.leadTimeDias === Number(filtro.leadTimeDias)) &&
      (!filtro.status || status === filtro.status)
    )
  })
}
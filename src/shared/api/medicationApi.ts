import { httpClient } from '@/shared/api/http/httpClient'
import type {
  AtualizacaoMedicamento,
  CategoriaMedicamentoOpcao,
  Medicamento,
  NovoMedicamento,
  UnidadeMedidaMedicamento,
} from '@/entities/medicamento'

const MEDICAMENTOS_RESOURCE = '/api/v1/medicamentos'
const UNIDADES_MEDIDA_RESOURCE = '/api/v1/unidades-medida'

export async function listMedicamentos(): Promise<Medicamento[]> {
  const response = await httpClient.get<Medicamento[]>(MEDICAMENTOS_RESOURCE)
  return response.data
}

export async function getMedicamento(id: number): Promise<Medicamento> {
  const response = await httpClient.get<Medicamento>(`${MEDICAMENTOS_RESOURCE}/${id}`)
  return response.data
}

export async function createMedicamento(payload: NovoMedicamento): Promise<Medicamento> {
  const response = await httpClient.post<Medicamento>(MEDICAMENTOS_RESOURCE, payload)
  return response.data
}

export async function updateMedicamento(
  id: number,
  payload: AtualizacaoMedicamento,
): Promise<Medicamento> {
  const response = await httpClient.put<Medicamento>(`${MEDICAMENTOS_RESOURCE}/${id}`, payload)
  return response.data
}

export async function deleteMedicamento(id: number): Promise<void> {
  await httpClient.delete(`${MEDICAMENTOS_RESOURCE}/${id}`)
}

export async function listCategoriasMedicamento(): Promise<CategoriaMedicamentoOpcao[]> {
  const response = await httpClient.get<CategoriaMedicamentoOpcao[]>(
    `${MEDICAMENTOS_RESOURCE}/categorias`,
  )
  return response.data
}

export async function listUnidadesMedidaMedicamento(): Promise<UnidadeMedidaMedicamento[]> {
  const response = await httpClient.get<UnidadeMedidaMedicamento[]>(UNIDADES_MEDIDA_RESOURCE)
  return response.data
}
import type {
  AtualizacaoPaciente,
  NovoPaciente,
  Paciente,
} from '@/entities/paciente'
import type { Dispensacao } from '@/entities/dispensacao'
import { httpClient } from '@/shared/api/http/httpClient'

const RESOURCE = '/api/v1/pacientes'

export interface PacienteQuery {
  cpf?: string
  nome?: string
}

export async function createPaciente(payload: NovoPaciente): Promise<Paciente> {
  const response = await httpClient.post<Paciente>(RESOURCE, payload)
  return response.data
}

export async function listPacientes(query: PacienteQuery = {}): Promise<Paciente[]> {
  const response = await httpClient.get<Paciente[]>(RESOURCE, { params: query })
  return response.data
}

export async function getPaciente(id: number): Promise<Paciente> {
  const response = await httpClient.get<Paciente>(`${RESOURCE}/${id}`)
  return response.data
}

export async function updatePaciente(id: number, payload: AtualizacaoPaciente): Promise<Paciente> {
  const response = await httpClient.put<Paciente>(`${RESOURCE}/${id}`, payload)
  return response.data
}

export async function inactivatePaciente(id: number): Promise<void> {
  await httpClient.delete(`${RESOURCE}/${id}`)
}

export async function listDispensacoesPaciente(id: number): Promise<Dispensacao[]> {
  const response = await httpClient.get<Dispensacao[]>(`${RESOURCE}/${id}/dispensacoes`)
  return response.data
}
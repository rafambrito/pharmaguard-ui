export const PACIENTE_STATUS = ['ATIVO', 'INATIVO'] as const

export type PacienteStatus = (typeof PACIENTE_STATUS)[number]

export interface Paciente {
  id: number
  nome: string
  cpf: string
  dataNascimento: string
  cartaoSus: string | null
  telefone: string | null
  email: string | null
  cidade: string | null
  uf: string | null
  status: PacienteStatus
  dataCriacao: string
  dataUltimaAlteracao: string | null
}

export interface NovoPaciente {
  nome: string
  cpf: string
  dataNascimento: string
  cartaoSus?: string
  telefone?: string
  email?: string
  cidade?: string
  uf?: string
}

export type AtualizacaoPaciente = NovoPaciente

export interface PacienteFiltro {
  cpf: string
  nome: string
  status: PacienteStatus | ''
}
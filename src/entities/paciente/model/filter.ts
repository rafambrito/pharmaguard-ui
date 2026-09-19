import type { Paciente, PacienteFiltro } from '@/entities/paciente/model/types'

export function filtrarPacientes(pacientes: Paciente[], filtro: PacienteFiltro): Paciente[] {
  const cpf = filtro.cpf.replace(/\D/g, '')
  const nome = filtro.nome.trim().toLocaleLowerCase()

  return pacientes.filter(
    (paciente) =>
      (!cpf || paciente.cpf.includes(cpf)) &&
      (!nome || paciente.nome.toLocaleLowerCase().includes(nome)) &&
      (!filtro.status || paciente.status === filtro.status),
  )
}
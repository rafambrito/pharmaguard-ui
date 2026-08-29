import type { UsuarioTipo } from '@/entities/usuario/model/types'

const labels: Record<UsuarioTipo, string> = {
  ADMIN: 'Administrador',
  FARMACEUTICO: 'Farmacêutico',
  PROFISSIONAL_SAUDE: 'Profissional de Saúde',
  GESTOR: 'Gestor',
}

export function usuarioTipoLabel(tipo: string): string {
  return labels[tipo as UsuarioTipo] ?? tipo
}

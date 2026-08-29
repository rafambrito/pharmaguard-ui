import type { Usuario, UsuarioFiltro } from '@/entities/usuario/model/types'

function matches(value: string, term: string): boolean {
  if (!term.trim()) {
    return true
  }

  return value.toLocaleLowerCase('pt-BR').includes(term.trim().toLocaleLowerCase('pt-BR'))
}

// A API de usuarios nao expoe parametros de consulta, entao os filtros sao aplicados sobre a listagem.
export function filtrarUsuarios(usuarios: Usuario[], filtro: UsuarioFiltro): Usuario[] {
  return usuarios.filter(
    (usuario) =>
      matches(usuario.nome, filtro.nome) &&
      matches(usuario.email, filtro.email) &&
      matches(usuario.login, filtro.login) &&
      matches(usuario.tipo, filtro.tipo) &&
      (filtro.status === '' || usuario.status === filtro.status),
  )
}

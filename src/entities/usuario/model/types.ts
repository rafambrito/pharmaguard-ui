export const USUARIO_STATUS = ['ATIVO', 'INATIVO', 'BLOQUEADO'] as const

export type UsuarioStatus = (typeof USUARIO_STATUS)[number]

// espelha o enum Perfil.Papel do pharmaguard-api
export const USUARIO_TIPOS = ['ADMIN', 'FARMACEUTICO', 'PROFISSIONAL_SAUDE', 'GESTOR'] as const

export type UsuarioTipo = (typeof USUARIO_TIPOS)[number]

export interface Perfil {
  id: number | null
  nome: string
  descricao: string
  ativo: boolean
}

export interface Usuario {
  id: number
  nome: string
  email: string
  login: string
  tipo: string
  status: UsuarioStatus
  perfis: Perfil[]
  dataCriacao: string | null
  dataUltimaAlteracao: string | null
}

export interface NovoUsuario {
  nome: string
  email: string
  login: string
  tipo: string
  senha: string
  status?: UsuarioStatus
}

export interface AtualizacaoUsuario {
  nome: string
  email: string
  login: string
  status?: UsuarioStatus
}

export interface UsuarioFiltro {
  nome: string
  email: string
  login: string
  tipo: string
  status: UsuarioStatus | ''
}

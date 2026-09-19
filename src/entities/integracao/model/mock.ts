import type { Integracao } from './types'

export const INTEGRACOES_MOCK: Integracao[] = [
  {
    id: 'bnafar',
    nome: 'BNAFAR',
    descricao:
      'Transmissão automatizada de posição de estoque, entradas, saídas e perdas de medicamentos para a Base Nacional de Dados da Assistência Farmacêutica, via web services (REST/SOAP) ou barramento do e-SUS.',
    orgao: 'Ministério da Saúde / e-SUS',
    status: 'DISPONIVEL',
    icon: 'satellite',
  },
  {
    id: 'sngpc',
    nome: 'SNGPC/ANVISA',
    descricao: 'Escrituração de medicamentos controlados junto ao Sistema Nacional de Gerenciamento de Produtos Controlados.',
    orgao: 'ANVISA',
    status: 'EM_BREVE',
    icon: 'shield',
  },
  {
    id: 'catmat',
    nome: 'CATMAT / TUSS',
    descricao:
      'Sincronização automatizada de itens com o Catálogo de Materiais do Governo Federal (CATMAT) e a Terminologia Unificada da Saúde Suplementar (TUSS), padronizando a codificação de medicamentos e insumos conforme a RENAME e evitando duplicidades no cadastro.',
    orgao: 'Ministério da Gestão / ANS',
    status: 'DISPONIVEL',
    icon: 'catalog',
  },
  {
    id: 'rnds',
    nome: 'RNDS',
    descricao:
      'Conectividade com a Rede Nacional de Dados em Saúde do Ministério da Saúde para troca de informações e interoperabilidade de prontuários, vinculando a dispensação efetuada no PharmaGuard ao histórico de saúde do cidadão via CPF ou Cartão Nacional de Saúde (CNS).',
    orgao: 'Ministério da Saúde',
    status: 'DISPONIVEL',
    icon: 'transfer',
  },
  {
    id: 'anvisa',
    nome: 'ANVISA — Registros e Lotes',
    descricao:
      'Consulta automatizada ao banco de dados da ANVISA para validação de registros de medicamentos, alertas de recolhimento preventivo (recall) e verificação de prazos de validade regulatórios na entrada das notas fiscais.',
    orgao: 'ANVISA',
    status: 'DISPONIVEL',
    icon: 'search',
  },
]

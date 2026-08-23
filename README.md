# 💊 PharmaGuard UI

Frontend do **PharmaGuard**, uma plataforma para gestão inteligente de medicamentos, insumos e estoques em unidades de saúde.

O `pharmaguard-ui` foi projetado para oferecer uma interface moderna, modular e escalável, seguindo **Feature-Sliced Design (FSD)**, **Clean Architecture** e **Atomic Design**.

---

## 🎯 Objetivo

O PharmaGuard tem como objetivo auxiliar unidades de saúde no controle de:

- 💊 Medicamentos e insumos
- 📦 Estoque
- 🏷️ Lotes e validade
- 🚚 Entradas e saídas
- 🏥 Unidades de saúde
- 🔄 Transferências entre unidades
- 📊 Indicadores e relatórios
- ⚠️ Alertas de estoque e validade
- 🤖 Análises inteligentes baseadas nos dados do estoque

O `pharmaguard-ui` é responsável pela camada de apresentação e interação com o usuário.

---

## 🏗️ Arquitetura

O projeto combina três abordagens complementares:

### Feature-Sliced Design

O **FSD** é utilizado como principal estratégia de organização do frontend.

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

| Camada | Responsabilidade |
|---|---|
| `app` | Inicialização, providers, router e configurações globais |
| `pages` | Composição das páginas da aplicação |
| `widgets` | Blocos complexos e reutilizáveis de interface |
| `features` | Funcionalidades e ações do usuário |
| `entities` | Conceitos de negócio |
| `shared` | Código reutilizável e independente do domínio |

### Clean Architecture

A lógica de negócio deve permanecer independente dos componentes Vue e da infraestrutura.

Conceitualmente:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↑
Infrastructure
```

A camada de apresentação não deve conter regras de negócio.

### Atomic Design

O Atomic Design será utilizado principalmente dentro de `shared/ui`:

```text
shared/
└── ui/
    ├── atoms/
    ├── molecules/
    └── organisms/
```

Exemplo:

```text
atoms/
├── Button
├── Input
└── Label

molecules/
└── FormField

organisms/
├── Header
├── Sidebar
└── DataTable
```

O Atomic Design organiza componentes visuais, enquanto o FSD organiza a aplicação como um todo.

---

## 📁 Estrutura

```text
pharmaguard-ui/
├── public/
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   └── App.vue
│   │
│   ├── pages/
│   ├── widgets/
│   ├── features/
│   ├── entities/
│   │
│   └── shared/
│       ├── api/
│       ├── config/
│       ├── lib/
│       ├── types/
│       ├── utils/
│       └── ui/
│           ├── atoms/
│           ├── molecules/
│           └── organisms/
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Stack

| Tecnologia | Utilização |
|---|---|
| Vue 3 | Framework frontend |
| TypeScript | Tipagem estática |
| Vite | Build e desenvolvimento |
| Vue Router | Roteamento |
| Pinia | Gerenciamento de estado |
| ESLint | Qualidade e padronização |
| Prettier | Formatação de código |

---

## 🚀 Executando localmente

### Pré-requisitos

- Node.js
- npm

Versões recomendadas para este projeto:

- Node.js `v24.19.0`
- npm `11.17.0` ou superior

Verifique as versões:

```bash
node --version
npm --version
```

### Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd pharmaguard-ui
npm install
```

Execute em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível na URL exibida pelo Vite, normalmente:

```text
http://localhost:5173
```

---

## 🔍 Qualidade

Execute o lint:

```bash
npm run lint
```

Execute o build:

```bash
npm run build
```

Antes de realizar um commit, recomenda-se validar:

```bash
npm run lint
npm run build
```

---

## 🔌 Integração com o Backend

O frontend será integrado ao backend:

```text
pharmaguard-ui
       │
       │ HTTP/REST
       ▼
pharmaguard-api
```

A comunicação será realizada por meio de uma camada de API localizada em:

```text
src/shared/api/
```

Essa separação evita que componentes Vue dependam diretamente de detalhes de infraestrutura.

A URL da API deverá ser configurada por variável de ambiente:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🧩 Domínios planejados

A aplicação deverá evoluir inicialmente com os seguintes domínios:

```text
entities/
├── usuario/
├── perfil/
├── medicamento/
├── lote/
├── estoque/
├── unidade-saude/
└── fornecedor/
```

E funcionalidades como:

```text
features/
├── autenticar-usuario/
├── cadastrar-medicamento/
├── movimentar-estoque/
├── cadastrar-unidade/
├── transferir-medicamento/
├── consultar-riscos-estoque/
└── analisar-estoque/
```

---

## 🤖 Inteligência Artificial

Uma futura evolução do PharmaGuard prevê um módulo de inteligência artificial integrado ao backend.

A proposta é utilizar IA para **interpretar dados produzidos pelo sistema**, e não substituir as regras de negócio ou o motor estatístico.

Fluxo planejado:

```text
Estoque
   │
   ▼
Motor Estatístico
   │
   ▼
Indicadores e riscos
   │
   ▼
Módulo de IA
   │
   ▼
Análise e explicação
   │
   ▼
PharmaGuard UI
```

Possíveis funcionalidades:

- Análise inteligente de estoque
- Identificação de riscos de ruptura
- Identificação de riscos de vencimento
- Análise de oportunidades de transferência entre unidades
- Resumo inteligente de relatórios
- Assistente para consulta dos indicadores do sistema

A implementação de IA deverá permanecer desacoplada da camada de apresentação.

---

## 🧪 Testes

A estratégia de testes será definida conforme a evolução do projeto.

A expectativa é utilizar:

- Testes unitários
- Testes de componentes
- Testes de integração
- Testes end-to-end

O objetivo é manter as regras de negócio testáveis independentemente da interface.

---

## 📐 Princípios

O desenvolvimento do `pharmaguard-ui` segue alguns princípios:

- **Single Responsibility**
- **Separation of Concerns**
- **Dependency Inversion**
- **Componentização**
- **Reutilização**
- **Tipagem forte**
- **Baixo acoplamento**
- **Alta coesão**
- **Código orientado ao domínio**
- **Componentes simples e previsíveis**

### Regra principal

> Componentes Vue devem cuidar da apresentação. Regras de negócio devem permanecer fora da camada de UI.

---

## 📌 Status

🚧 **Em desenvolvimento**

O `pharmaguard-ui` está sendo desenvolvido em paralelo ao `pharmaguard-api`, priorizando inicialmente a fundação arquitetural e posteriormente a implementação incremental das funcionalidades do PharmaGuard.

### Fundação inicial implementada

Nesta etapa inicial, já foram configurados:

- Vue 3 + TypeScript + Vite
- Vue Router com rota inicial (`/`)
- Pinia com provider global
- ESLint + Prettier
- Estrutura FSD (`app`, `pages`, `widgets`, `features`, `entities`, `shared`)
- Estrutura de Atomic Design em `shared/ui` (atoms, molecules e organisms)
- Página inicial simples para validar composição de layout e componentes

Ainda **não** foram implementados autenticação, integrações reais com API, CRUDs e regras de negócio.

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos como parte do projeto **PharmaGuard**.

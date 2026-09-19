# 💊 PharmaGuard UI

> **Interface web do PharmaGuard — gestão inteligente de estoque farmacêutico para reduzir desperdícios, prevenir rupturas e apoiar decisões na saúde pública.**

![Status](https://img.shields.io/badge/Status-MVP%20Entregue-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-A_Definir-lightgrey?style=for-the-badge)

---

## 🎯 Visão geral

O `pharmaguard-ui` é a camada de apresentação do **PharmaGuard**, consumindo a API REST do [`pharmaguard-api`](../pharmaguard-api) para oferecer aos times de farmácia e gestão de unidades de saúde uma interface completa de:

- 💊 Cadastro de medicamentos, insumos e unidades de medida
- 🏭 Cadastro de fornecedores e pedidos de compra
- 📦 Controle de estoque por lote e validade
- 🚚 Registro de entradas, saídas e transferências entre unidades
- 🏥 Cadastro e administração de unidades de saúde e usuários
- 🧑‍⚕️ Cadastro de pacientes e registro de dispensações vinculadas ao paciente
- ⚠️ Consulta de alertas de ruptura e vencimento
- 🔔 Central de notificações no topo com alertas recentes e acesso à consulta completa
- 📊 Relatórios analíticos de consumo, criticidade e reposição
- 🤖 Painel de inteligência de estoque com diagnóstico assistido por IA
- 🔌 Módulo de integrações com sistemas externos (evolução futura da API)

O projeto foi construído seguindo **Feature-Sliced Design (FSD)**, **Clean Architecture** e **Atomic Design**, priorizando baixo acoplamento entre apresentação, regras de aplicação e infraestrutura.

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
| `widgets` | Blocos complexos e reutilizáveis de interface (ex.: cards do dashboard) |
| `features` | Funcionalidades e ações do usuário (CRUDs, consultas, integrações mockadas) |
| `entities` | Conceitos de negócio (tipos, filtros, catálogos) |
| `shared` | Código reutilizável e independente do domínio (API, UI kit, config) |

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

A camada de apresentação (componentes `.vue`) não contém regras de negócio: consultas, validações e transformações de dados vivem em composables (`features/*/model`) e nas entidades (`entities/*/model`).

### Atomic Design

O Atomic Design será utilizado principalmente dentro de `shared/ui`:

```text
shared/
└── ui/
    ├── atoms/       Button, Input, Label, Icon, Select, StatusBadge, Card, Typography
    ├── molecules/   FormField, MetricCard, SectionPanel, SearchField, AlertItem, UserInfo
    └── organisms/   Sidebar, Header, DashboardHeader, DataTable
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
│   │   ├── login/ home/ medicamentos/ unidades-medida/ estoque/
│   │   ├── fornecedores/ pedidos-compra/ unidades-saude/
│   │   ├── entradas/ saidas/ transferencias/
│   │   ├── pacientes/ dispensacoes/ alertas/ relatorios/ inteligencia/
│   │   ├── usuarios/ integracoes/ module-placeholder/
│   │
│   ├── widgets/
│   │   └── dashboard-alerts/ dashboard-consumption/ dashboard-metrics/
│   │       dashboard-transfers/ dashboard-unit-stock/
│   │
│   ├── features/
│   │   ├── auth/ usuario-crud/ medicamento-crud/ unidade-medida-crud/
│   │   ├── fornecedor-crud/ unidade-saude-crud/ paciente-crud/ dispensacao-crud/
│   │   ├── entrada-estoque-crud/ saida-estoque-crud/ transferencia-estoque-crud/
│   │   ├── estoque-consulta/ alerta-consulta/ relatorio-consulta/
│   │   ├── dashboard-overview/ dashboard-insight/ inteligencia-consulta/
│   │   ├── nota-fiscal-entrada-mock/ pedido-compra-mock/
│   │   └── integracao-bnafar-mock/ integracao-catmat-mock/
│   │       integracao-rnds-mock/ integracao-anvisa-mock/
│   │
│   ├── entities/
│   │   ├── session/ usuario/ medicamento/ unidade-medida/ fornecedor/
│   │   ├── unidade-saude/ estoque/ entrada-estoque/ saida-estoque/
│   │   ├── transferencia-estoque/ alerta/ relatorio/ dashboard/
│   │   └── nota-fiscal-entrada/ pedido-compra/ integracao/
│   │
│   └── shared/
│       ├── api/         # authApi, medicationApi, supplierApi, stockApi, stock(Entry/Output/Transfer)Api,
│       │                # healthUnitApi, unitMeasureApi, userApi, alertApi, reportApi, dashboardApi, intelligenceApi
│       ├── config/      # messages.ts (i18n de textos da aplicação)
│       ├── utils/
│       └── ui/
│           ├── atoms/
│           ├── molecules/
│           └── organisms/
│
├── .env.example
├── Dockerfile
├── nginx.conf
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Stack

<p>
<img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue 3" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Pinia-State-FFD859?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia" />
<img src="https://img.shields.io/badge/Vue_Router-4-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue Router" />
</p>

<p>
<img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
<img src="https://img.shields.io/badge/ESLint-Lint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
<img src="https://img.shields.io/badge/Prettier-Format-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
<img src="https://img.shields.io/badge/Docker-Nginx-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

| Tecnologia | Utilização |
|---|---|
| Vue 3 (`<script setup>`) | Framework frontend |
| TypeScript | Tipagem estática |
| Vite | Build e desenvolvimento |
| Vue Router | Roteamento e guarda de rotas autenticadas/por papel |
| Pinia | Gerenciamento de estado (sessão do usuário) |
| Axios | Cliente HTTP para a `pharmaguard-api` |
| ESLint + Prettier | Qualidade e padronização de código |
| Docker + Nginx | Build e serving da aplicação em produção |

---

## 🚀 Executando localmente

### Pré-requisitos

- Node.js `v24.19.0` (ver `.nvmrc`)
- npm `11.17.0` ou superior
- `pharmaguard-api` em execução (para integração real; ver seção de módulos mockados para uso sem backend)

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

### Variáveis de ambiente

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Modo de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível na URL exibida pelo Vite, normalmente:

```text
http://localhost:5173
```

### Build de produção

```bash
npm run build
npm run preview
```

### Docker

```bash
docker build -t rafambrito/pharmaguard-ui:latest --build-arg VITE_API_BASE_URL=http://localhost:8080 .
docker run -p 8081:80 rafambrito/pharmaguard-ui:latest
```

Para publicar no Docker Hub:

```bash
docker login
docker push rafambrito/pharmaguard-ui:latest
```

---

## 🔍 Qualidade

```bash
npm run lint        # eslint --max-warnings=0
npm run lint:fix
npm run type-check  # vue-tsc --noEmit
npm run build       # type-check + vite build
```

Antes de realizar um commit, recomenda-se validar:

```bash
npm run lint && npm run build
```

---

## 🔌 Integração com o Backend

O frontend é integrado ao backend:

```text
pharmaguard-ui
       │
       │ HTTP/REST (JWT)
       ▼
pharmaguard-api
```

Toda a comunicação HTTP fica isolada em `src/shared/api/` (um arquivo por domínio: `authApi`, `medicationApi`, `supplierApi`, `stockApi`, `stockEntryApi`, `stockOutputApi`, `stockTransferApi`, `healthUnitApi`, `unitMeasureApi`, `userApi`, `alertApi`, `reportApi`, `dashboardApi`, `intelligenceApi`), evitando que componentes Vue dependam diretamente de detalhes de infraestrutura.

Erros HTTP seguem o padrão RFC 7807 (`ProblemDetail`) retornado pela API e são tratados de forma centralizada em `shared/api/http/httpError.ts`.

O token JWT emitido no login é mantido na store de sessão (`entities/session`, Pinia) e reidratado do `localStorage` a cada carregamento da aplicação; o guard do Vue Router bloqueia rotas autenticadas sem sessão válida e rotas restritas por papel (ex.: `ROLE_ADMIN`).

A URL da API é configurada por variável de ambiente:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📋 Módulos entregues no MVP

### 👤 Autenticação e usuários
- Login com autenticação JWT e persistência de sessão
- Controle de acesso por rota e por papel (perfis do backend)
- CRUD de usuários e perfis

### 💊 Cadastros
- Medicamentos e insumos (categoria, criticidade, unidade de medida)
- Unidades de medida
- Fornecedores (lead time, documento, observações)
- Unidades de saúde

### 📦 Estoque e movimentações
- Consulta de estoque por unidade, saldo por lote e vencimentos
- Registro de entradas de estoque (fornecedor, lote, validade, quantidade)
- Registro de saídas de estoque com consumo por lote (FEFO)
- Transferências entre unidades de saúde

### ⚠️ Alertas, notificações e 📊 relatórios
- Consulta de alertas de ruptura e vencimento por período/unidade
- Central de notificações na topbar, alimentada pelos alertas recentes da API
- Acesso direto da central à página completa de alertas
- Relatórios analíticos: consumo, estoque mínimo, vencimentos, criticidade e reposição

### 🧑‍⚕️ Pacientes e dispensações
- Cadastro, pesquisa, edição e exclusão de pacientes
- Registro e consulta de dispensações por unidade, paciente e medicamento
- Seleção de lotes conforme a estratégia FEFO

### 🤖 Inteligência de estoque
- Indicadores estatísticos de consumo, risco de ruptura e de vencimento
- Sugestões de transferência entre unidades
- Diagnóstico assistido por IA (com fallback determinístico quando a IA está indisponível)

### 🧪 Demonstrações mockadas (evolução futura da API)

Funcionalidades implementadas **somente no frontend**, sem persistência real, para demonstrar próximos passos de evolução do produto:

- **Entrada por Nota Fiscal** (`/entradas/nota-fiscal`): leitura simulada de código de barras da DANFE, importação simulada de XML/PDF e lançamento manual de itens com NCM e unidade de medida.
- **Pedido de Compra** (`/pedidos-compra`): montagem de pedido com fornecedor, condição de pagamento, prioridade e itens estimados.
- **Módulo de Integrações** (`/integracoes`): catálogo de integrações com sistemas federais, com 4 integrações simuladas de ponta a ponta (conexão + ação + histórico):
  - **BNAFAR** — transmissão de posição de estoque, entradas, saídas e perdas via e-SUS.
  - **CATMAT / TUSS** — sincronização de itens com o catálogo nacional (RENAME).
  - **RNDS** — vínculo da dispensação ao histórico de saúde do cidadão via CPF/CNS.
  - **ANVISA — Registros e Lotes** — validação de registro, alerta de recall e validade regulatória.

  Novas integrações (ex.: SNGPC/ANVISA) já estão catalogadas como "Em breve" e seguem o mesmo padrão de implementação.

---

## 🤖 Inteligência Artificial

O painel de Inteligência (`/inteligencia`) integra um módulo de IA no backend para **interpretar dados produzidos pelo sistema**, sem substituir as regras de negócio ou o motor estatístico.

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

Quando a IA está indisponível, a interface exibe um resumo determinístico como fallback, mantendo a experiência funcional.

---

## 🧪 Testes

A estratégia de testes automatizados de UI (componentes e end-to-end) está prevista para as próximas iterações. No MVP, a qualidade é garantida por:

- Tipagem estática (`vue-tsc --noEmit`)
- Lint (`eslint --max-warnings=0`)
- Validação manual de fluxos por módulo antes de cada entrega

O objetivo é manter as regras de negócio testáveis independentemente da interface. Os fluxos de pacientes, dispensações, alertas e relatórios usam a API real; as telas listadas como mock não fazem chamadas ao backend.

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

> Componentes Vue devem cuidar da apresentação. Regras de negócio e chamadas HTTP permanecem fora da camada de UI (em `features/*/model` e `shared/api`).

---

## 📌 Status

✅ **MVP entregue**

Autenticação, cadastros, estoque, movimentações, pacientes, dispensações, alertas, notificações, relatórios e inteligência de estoque estão implementados e integrados à `pharmaguard-api`. O módulo de Integrações e as telas de Nota Fiscal por Entrada/Pedido de Compra são demonstrações mockadas que sinalizam a evolução futura da plataforma.

### Evolução futura

- Implementação real das integrações do módulo Integrações (BNAFAR, CATMAT/TUSS, RNDS, ANVISA, SNGPC)
- Persistência real de Pedido de Compra e Entrada por Nota Fiscal (leitura de DANFE/XML de fato)
- Testes de componentes e end-to-end
- Notificações em tempo real e atualização automática da central de alertas

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos como parte do projeto **PharmaGuard**.

---

## 👨‍💻 Autor

**Rafael Mendonça Brito**

Projeto desenvolvido como parte da formação de Pós-Graduação / Tech Challenge.

---

<p align="center">
  💊 <strong>PharmaGuard</strong><br>
  <em>Protegendo estoques. Evitando desperdícios. Garantindo disponibilidade.</em>
</p>


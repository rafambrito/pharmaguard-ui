<script setup lang="ts">
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const pilares = [
  {
    emoji: '📦',
    title: 'Disponibilidade',
    description: 'Antecipar riscos de ruptura com consumo, estoque de segurança e recomendações de reposição.',
  },
  {
    emoji: '♻️',
    title: 'Redução de desperdício',
    description: 'Priorizar lotes por validade com FEFO e destacar itens próximos do vencimento.',
  },
  {
    emoji: '📊',
    title: 'Decisões orientadas por dados',
    description: 'Transformar movimentações de estoque em alertas, relatórios e indicadores acionáveis.',
  },
]

const capacidades = [
  { emoji: '💊', label: 'Estoque por lote, validade e unidade de saúde' },
  { emoji: '🔄', label: 'Entradas, saídas, transferências e dispensações' },
  { emoji: '⚠️', label: 'Alertas de ruptura, vencimento e criticidade' },
  { emoji: '📋', label: 'Relatórios de consumo, perdas e reposição' },
  { emoji: '🤖', label: 'Diagnóstico assistido por IA local com fallback determinístico' },
]
</script>

<template>
  <main class="sobre-page">
    <DashboardHeader
      title="Sobre o PharmaGuard"
      subtitle="Gestão inteligente de estoques farmacêuticos para fortalecer a assistência à saúde."
    />

    <SectionPanel title="Resumo executivo" description="A plataforma conecta controle operacional e inteligência de estoque.">
      <template #header-prefix>
        <span class="panel-icon" aria-hidden="true">💊</span>
      </template>
      <p class="intro">
        O PharmaGuard apoia farmácias e unidades de saúde na redução de desperdícios e na prevenção de faltas de
        medicamentos. A solução combina controle por lote e validade, estratégia FEFO e análise estatística do consumo
        para transformar dados de estoque em decisões mais seguras.
      </p>
    </SectionPanel>

    <section class="pilares" aria-label="Pilares do PharmaGuard">
      <article v-for="pilar in pilares" :key="pilar.title" class="pilar">
        <div class="pilar__header">
          <span class="pilar__icon" aria-hidden="true">{{ pilar.emoji }}</span>
          <h2>{{ pilar.title }}</h2>
        </div>
        <p>{{ pilar.description }}</p>
      </article>
    </section>

    <div class="content-grid">
      <SectionPanel title="Capacidades do MVP" description="Recursos integrados para a rotina farmacêutica e gerencial.">
        <template #header-prefix>
          <span class="panel-icon" aria-hidden="true">📋</span>
        </template>
        <ul class="capabilities-list">
          <li v-for="capacidade in capacidades" :key="capacidade.label">
            <span class="capability-emoji" aria-hidden="true">{{ capacidade.emoji }}</span>
            <span>{{ capacidade.label }}</span>
          </li>
        </ul>
      </SectionPanel>

      <SectionPanel title="Arquitetura e confiança" description="Uma base modular para evoluir com segurança.">
        <template #header-prefix>
          <span class="panel-icon" aria-hidden="true">🛡️</span>
        </template>
        <p class="architecture-copy">
          A aplicação reúne uma interface Vue 3 e uma API Spring Boot organizadas como monólito modular, com princípios
          de Clean Architecture e ports and adapters. Autenticação JWT, PostgreSQL, migrações Flyway e documentação
          OpenAPI sustentam a operação e a evolução do produto.
        </p>
      </SectionPanel>
    </div>
  </main>
</template>

<style scoped>
.sobre-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
}

.intro,
.architecture-copy {
  max-width: 76ch;
  margin: 0;
  color: var(--pg-color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

:deep(.pg-panel__head) {
  justify-content: flex-start;
}

.panel-icon,
.pilar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-50);
}

.panel-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  font-size: 20px;
}

.pilares {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--pg-gutter);
}

.pilar {
  display: grid;
  gap: 8px;
  min-height: 156px;
  padding: 18px;
  border: 1px solid var(--pg-color-border);
  border-top: 3px solid var(--pg-color-blue-600);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  box-shadow: var(--pg-shadow-sm);
}

.pilar__icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  font-size: 21px;
}

.pilar__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pilar h2 {
  margin: 0;
  color: var(--pg-color-text-primary);
  font-size: 1rem;
}

.pilar p {
  margin: 0;
  color: var(--pg-color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.6;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--pg-gutter);
}

.capabilities-list {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--pg-color-text-secondary);
  font-size: 0.85rem;
}

.capabilities-list li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
}

.capability-emoji {
  width: 17px;
  flex: 0 0 17px;
  margin-top: 1px;
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
}

@media (max-width: 820px) {
  .pilares,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
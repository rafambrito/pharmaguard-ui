<script setup lang="ts">
import { ref } from 'vue'
import type { EstoqueFiltro } from '@/entities/estoque'
import { explicarPainel, type TipoPainelInsight } from '@/shared/api/intelligenceApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'

interface Props {
  painel: TipoPainelInsight
  filtro: EstoqueFiltro
}

const props = defineProps<Props>()
const explicacao = ref('')
const erro = ref('')
const carregando = ref(false)

function periodoPadrao(): { periodoInicio: string; periodoFim: string } {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)
  return {
    periodoInicio: props.filtro.dataInicial || inicio.toISOString().slice(0, 10),
    periodoFim: props.filtro.dataFinal || fim.toISOString().slice(0, 10),
  }
}

async function carregarExplicacao(): Promise<void> {
  if (explicacao.value || carregando.value) return

  carregando.value = true
  erro.value = ''
  try {
    const resposta = await explicarPainel({
      tipoPainel: props.painel,
      ...periodoPadrao(),
      medicamentoId: props.filtro.medicamentoId ? Number(props.filtro.medicamentoId) : undefined,
      unidadeSaudeId: props.filtro.unidadeId ? Number(props.filtro.unidadeId) : undefined,
    })
    explicacao.value = resposta.explicacao
  } catch (error) {
    erro.value = extractHttpErrorMessage(error, t('dashboard.insight.error'))
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="estoque-insight">
    <button
      type="button"
      class="estoque-insight__button"
      :aria-label="t('dashboard.insight.action')"
      :aria-describedby="'estoque-insight-tooltip'"
      @mouseenter="carregarExplicacao"
      @focus="carregarExplicacao"
    >
      <Icon name="ai" :size="16" />
    </button>
    <div id="estoque-insight-tooltip" class="estoque-insight__tooltip" role="tooltip">
      {{ carregando ? 'Gerando explicacao...' : erro || explicacao || t('dashboard.insight.action') }}
    </div>
  </div>
</template>

<style scoped>
.estoque-insight {
  position: relative;
  flex: 0 0 auto;
}

.estoque-insight__button {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  color: var(--pg-color-blue-700);
  cursor: pointer;
}

.estoque-insight__button:hover,
.estoque-insight__button:focus-visible {
  border-color: var(--pg-color-blue-600);
  background: var(--pg-color-blue-50);
  outline: none;
}

.estoque-insight__tooltip {
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  left: 0;
  display: none;
  width: min(300px, calc(100vw - 48px));
  padding: 10px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-text-primary);
  box-shadow: var(--pg-shadow-sm);
  color: var(--pg-color-surface);
  font-size: 0.78rem;
  line-height: 1.4;
}

.estoque-insight:hover .estoque-insight__tooltip,
.estoque-insight:focus-within .estoque-insight__tooltip {
  display: block;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { explicarPainel, type ExplicacaoPainelResponse, type TipoPainelInsight } from '@/shared/api/intelligenceApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'

interface Props {
  painel: TipoPainelInsight
}

const props = defineProps<Props>()
const resposta = ref<ExplicacaoPainelResponse | null>(null)
const erro = ref('')
const carregando = ref(false)

function periodoPadrao(): { periodoInicio: string; periodoFim: string } {
  const fim = new Date()
  const inicio = new Date(fim)
  inicio.setDate(fim.getDate() - 30)

  return {
    periodoInicio: inicio.toISOString().slice(0, 10),
    periodoFim: fim.toISOString().slice(0, 10),
  }
}

async function explicar(): Promise<void> {
  if (resposta.value || carregando.value) return

  carregando.value = true
  erro.value = ''

  try {
    resposta.value = await explicarPainel({ tipoPainel: props.painel, ...periodoPadrao() })
  } catch (error) {
    erro.value = extractHttpErrorMessage(error, t('dashboard.insight.error'))
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="dashboard-insight">
    <button
      type="button"
      class="dashboard-insight__button"
      :aria-label="t('dashboard.insight.action')"
      @click="explicar"
      @mouseenter="explicar"
      @focus="explicar"
    >
      <Icon name="ai" :size="16" />
    </button>
    <div class="dashboard-insight__tooltip" role="tooltip">
      {{ carregando ? 'Gerando explicacao...' : erro || resposta?.explicacao || t('dashboard.insight.action') }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-insight {
  position: relative;
  flex: 0 0 auto;
}

.dashboard-insight__button {
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

.dashboard-insight__button:hover,
.dashboard-insight__button:focus-visible {
  border-color: var(--pg-color-blue-600);
  background: var(--pg-color-blue-50);
  outline: none;
}

.dashboard-insight__tooltip {
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  right: 0;
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

.dashboard-insight:hover .dashboard-insight__tooltip,
.dashboard-insight:focus-within .dashboard-insight__tooltip {
  display: block;
}
</style>
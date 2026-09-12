<script setup lang="ts">
import { ref } from 'vue'
import { explicarPainel, type ExplicacaoPainelResponse, type TipoPainelInsight } from '@/shared/api/intelligenceApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'
import Button from '@/shared/ui/atoms/Button/Button.vue'

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
    <Button variant="secondary" :loading="carregando" @click="explicar">
      {{ t('dashboard.insight.action') }}
    </Button>
    <p v-if="erro" class="dashboard-insight__error" role="alert">{{ erro }}</p>
    <p v-else-if="resposta" class="dashboard-insight__text" aria-live="polite">
      {{ resposta.explicacao }}
      <span v-if="resposta.origem === 'FALLBACK'" class="dashboard-insight__fallback">
        {{ t('dashboard.insight.fallback') }}
      </span>
    </p>
  </div>
</template>

<style scoped>
.dashboard-insight {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.dashboard-insight__text,
.dashboard-insight__error {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
}

.dashboard-insight__text {
  color: var(--pg-color-text-secondary);
}

.dashboard-insight__error {
  color: var(--pg-color-critical);
}

.dashboard-insight__fallback {
  display: block;
  margin-top: 4px;
  color: var(--pg-color-text-muted);
  font-size: 0.74rem;
}
</style>
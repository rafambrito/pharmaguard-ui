<script setup lang="ts">
type StatusTone = 'critical' | 'warning' | 'monitoring' | 'normal'

interface Props {
  tone: StatusTone
  label: string
}

defineProps<Props>()
</script>

<template>
  <span class="pg-status-badge" :class="`pg-status-badge--${tone}`">{{ label }}</span>
</template>

<style scoped>
.pg-status-badge {
  display: inline-block;
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.4;
  text-transform: uppercase;
  white-space: nowrap;
}

.pg-status-badge--critical {
  background: var(--pg-color-critical-bg);
  color: var(--pg-color-critical);
}

.pg-status-badge--warning {
  background: var(--pg-color-warning-bg);
  color: var(--pg-color-warning);
}

.pg-status-badge--monitoring {
  background: var(--pg-color-monitoring-bg);
  color: var(--pg-color-monitoring);
}

.pg-status-badge--normal {
  background: var(--pg-color-normal-bg);
  color: var(--pg-color-normal);
}
</style>

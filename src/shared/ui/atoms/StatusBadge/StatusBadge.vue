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
  background: #fde3e0;
  color: #a3231a;
}

.pg-status-badge--warning {
  background: #ffe6d1;
  color: #9a4b06;
}

.pg-status-badge--monitoring {
  background: #fff2d7;
  color: #8b5c00;
}

.pg-status-badge--normal {
  background: #dff3e5;
  color: #1f6b40;
}
</style>

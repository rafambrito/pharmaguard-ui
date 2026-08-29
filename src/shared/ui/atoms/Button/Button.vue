<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
  block: false,
})
</script>

<template>
  <button
    class="pg-button"
    :class="[`pg-button--${props.variant}`, { 'pg-button--block': props.block }]"
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
  >
    <span v-if="props.loading" class="pg-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.pg-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 9px 16px;
  border: 1px solid transparent;
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-700);
  color: #fff;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.pg-button--block {
  width: 100%;
}

.pg-button:hover:not(:disabled) {
  background: var(--pg-color-blue-800);
}

.pg-button:focus-visible {
  outline: 2px solid var(--pg-color-blue-600);
  outline-offset: 2px;
}

.pg-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pg-button--secondary {
  background: var(--pg-color-surface);
  border-color: var(--pg-color-border);
  color: var(--pg-color-blue-700);
}

.pg-button--secondary:hover:not(:disabled) {
  background: var(--pg-color-blue-50);
  border-color: var(--pg-color-blue-500);
}

.pg-button--ghost {
  background: transparent;
  color: var(--pg-color-text-secondary);
}

.pg-button--ghost:hover:not(:disabled) {
  background: var(--pg-color-blue-50);
  color: var(--pg-color-blue-700);
}

.pg-button--danger {
  background: var(--pg-color-surface);
  border-color: #ecc6c1;
  color: var(--pg-color-critical);
}

.pg-button--danger:hover:not(:disabled) {
  background: var(--pg-color-critical-bg);
  border-color: var(--pg-color-critical);
}

.pg-button--danger:focus-visible {
  outline-color: var(--pg-color-critical);
}

.pg-button__spinner {
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: pg-button-spin 700ms linear infinite;
}

@keyframes pg-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pg-button__spinner {
    animation-duration: 2s;
  }
}
</style>

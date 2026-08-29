<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  id?: string
  modelValue?: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
  size?: 'md' | 'sm'
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  placeholder: '',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <select
    :id="props.id"
    class="pg-select"
    :class="`pg-select--${props.size}`"
    :value="props.modelValue"
    :disabled="props.disabled"
    @change="onChange"
  >
    <option v-if="props.placeholder" value="">{{ props.placeholder }}</option>
    <option v-for="option in props.options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.pg-select {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  padding: 9px 34px 9px 12px;
  font: inherit;
  font-size: 0.85rem;
  color: var(--pg-color-text-primary);
  background-color: var(--pg-color-surface);
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - 17px) calc(50% + 1px),
    calc(100% - 12px) calc(50% + 1px);
  background-size:
    5px 5px,
    5px 5px;
  background-repeat: no-repeat;
  appearance: none;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.pg-select--sm {
  min-height: 34px;
  padding: 7px 32px 7px 10px;
  font-size: 0.8rem;
}

.pg-select:hover:not(:disabled) {
  border-color: var(--pg-color-blue-500);
}

.pg-select:focus {
  outline: none;
  border-color: var(--pg-color-blue-600);
  box-shadow: 0 0 0 3px rgba(36, 112, 196, 0.15);
}

.pg-select:disabled {
  background-color: var(--pg-color-blue-50);
  color: var(--pg-color-text-muted);
  cursor: not-allowed;
}
</style>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="pg-search-field">
    <span class="pg-search-field__icon" aria-hidden="true"></span>
    <input
      class="pg-search-field__input"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
  </label>
</template>

<style scoped>
.pg-search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: 999px;
  background: var(--pg-color-blue-50);
}

.pg-search-field__icon {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  border: 1.5px solid var(--pg-color-text-muted);
  border-radius: 50%;
  position: relative;
}

.pg-search-field__icon::after {
  content: '';
  position: absolute;
  right: -6px;
  bottom: -5px;
  width: 6px;
  height: 1.5px;
  background: var(--pg-color-text-muted);
  transform: rotate(45deg);
}

.pg-search-field__input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 0.82rem;
  color: var(--pg-color-text-primary);
}

.pg-search-field__input::placeholder {
  color: var(--pg-color-text-muted);
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  id?: string
  modelValue?: string
  placeholder?: string
  type?: string
  autocomplete?: string
  disabled?: boolean
  showPasswordToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  modelValue: '',
  placeholder: '',
  type: 'text',
  autocomplete: 'off',
  disabled: false,
  showPasswordToggle: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isPasswordVisible = ref(false)
const inputType = computed(() => {
  if (props.showPasswordToggle && props.type === 'password' && isPasswordVisible.value) {
    return 'text'
  }

  return props.type
})

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function togglePasswordVisibility(): void {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div class="input-wrapper">
    <input
      :id="props.id"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :type="inputType"
      :autocomplete="props.autocomplete"
      :disabled="props.disabled"
      class="pg-input"
      :class="{ 'has-password-toggle': props.showPasswordToggle && props.type === 'password' }"
      @input="onInput"
    />
    <button
      v-if="props.showPasswordToggle && props.type === 'password'"
      type="button"
      class="password-toggle"
      :aria-label="isPasswordVisible ? 'Ocultar senha' : 'Exibir senha'"
      :aria-pressed="isPasswordVisible"
      :title="isPasswordVisible ? 'Ocultar senha' : 'Exibir senha'"
      @click="togglePasswordVisibility"
    >
      <span class="eye-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.input-wrapper {
  position: relative;
}

.pg-input {
  width: 100%;
  border: 1px solid #bfd0e3;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #11223a;
  background: #fff;
}

.pg-input.has-password-toggle {
  padding-right: 42px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #365679;
  cursor: pointer;
  transform: translateY(-50%);
}

.password-toggle:focus-visible {
  outline: 2px solid #165a9e;
  outline-offset: 2px;
  border-radius: 4px;
}

.eye-icon {
  width: 17px;
  height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 75% 15%;
  transform: rotate(45deg);
}

.eye-icon::after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  margin: 1.5px auto;
  border-radius: 50%;
  background: currentColor;
}
</style>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button class="pg-button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.pg-button {
  border: 0;
  border-radius: 10px;
  background: #165a9e;
  color: #fff;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.pg-button:hover {
  background: #114a82;
}

.pg-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

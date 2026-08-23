<script setup lang="ts">
interface Props {
  forId: string
}

defineProps<Props>()
</script>

<template>
  <label class="pg-label" :for="forId">
    <slot />
  </label>
</template>

<style scoped>
.pg-label {
  font-size: 13px;
  font-weight: 600;
  color: #253c5a;
}
</style>

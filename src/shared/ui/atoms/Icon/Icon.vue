<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()
</script>

<template>
  <span class="pg-icon" aria-hidden="true">{{ name }}</span>
</template>

<style scoped>
.pg-icon {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid #bfd0e3;
  color: #365679;
}
</style>

<script setup lang="ts">
import Typography from '@/shared/ui/atoms/Typography/Typography.vue'

interface Props {
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
})
</script>

<template>
  <header class="pg-dashboard-header">
    <Typography variant="display" as="h1">{{ title }}</Typography>
    <Typography v-if="subtitle" variant="body">{{ subtitle }}</Typography>
  </header>
</template>

<style scoped>
.pg-dashboard-header {
  display: grid;
  gap: 4px;
  margin-bottom: 4px;
}
</style>

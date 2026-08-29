<script setup lang="ts">
import Card from '@/shared/ui/atoms/Card/Card.vue'
import Typography from '@/shared/ui/atoms/Typography/Typography.vue'

interface Props {
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  description: '',
})
</script>

<template>
  <Card as="section" padding="lg" class="pg-panel">
    <div class="pg-panel__head">
      <div>
        <Typography variant="title" as="h2">{{ title }}</Typography>
        <Typography v-if="description" variant="body">{{ description }}</Typography>
      </div>
      <slot name="actions" />
    </div>
    <slot />
  </Card>
</template>

<style scoped>
.pg-panel {
  display: grid;
  gap: 12px;
  align-content: start;
  height: 100%;
}

.pg-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
</style>

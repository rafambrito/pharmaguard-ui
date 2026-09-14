<script setup lang="ts">
import Card from '@/shared/ui/atoms/Card/Card.vue'
import Typography from '@/shared/ui/atoms/Typography/Typography.vue'

interface Props {
  title: string
  description?: string
  centeredHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  description: '',
  centeredHeader: false,
})
</script>

<template>
  <Card as="section" padding="lg" class="pg-panel">
    <div class="pg-panel__head" :class="{ 'pg-panel__head--centered': centeredHeader }">
      <slot name="header-prefix" />
      <div class="pg-panel__heading">
        <Typography variant="title" as="h2">{{ title }}</Typography>
        <Typography v-if="description" variant="body">{{ description }}</Typography>
      </div>
      <div class="pg-panel__actions">
        <slot name="actions" />
      </div>
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

.pg-panel__head--centered {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

.pg-panel__head--centered .pg-panel__heading {
  grid-column: 2;
  text-align: center;
}

.pg-panel__head--centered .pg-panel__actions {
  grid-column: 3;
  justify-self: end;
}
</style>

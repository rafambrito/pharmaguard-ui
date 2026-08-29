<script setup lang="ts">
interface Props {
  as?: string
  padding?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  as: 'div',
  padding: 'md',
})
</script>

<template>
  <component :is="as" class="pg-card" :class="`pg-card--padding-${padding}`">
    <slot />
  </component>
</template>

<style scoped>
.pg-card {
  background: var(--pg-color-surface);
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-md);
  box-shadow: var(--pg-shadow-sm);
}

.pg-card--padding-sm {
  padding: 12px;
}

.pg-card--padding-md {
  padding: clamp(14px, 1.8vw, 18px);
}

.pg-card--padding-lg {
  padding: clamp(18px, 2.2vw, 24px);
}
</style>

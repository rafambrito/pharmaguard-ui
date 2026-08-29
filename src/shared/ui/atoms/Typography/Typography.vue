<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'eyebrow'

interface Props {
  as?: string
  variant?: Variant
}

const props = withDefaults(defineProps<Props>(), {
  as: '',
  variant: 'body',
})

const defaultTagByVariant: Record<Variant, string> = {
  display: 'h1',
  title: 'h2',
  subtitle: 'h3',
  body: 'p',
  caption: 'span',
  eyebrow: 'span',
}

const tag = computed(() => props.as || defaultTagByVariant[props.variant])
</script>

<template>
  <component :is="tag" class="pg-typography" :class="`pg-typography--${variant}`">
    <slot />
  </component>
</template>

<style scoped>
.pg-typography {
  margin: 0;
  color: var(--pg-color-text-primary);
}

.pg-typography--display {
  font-size: clamp(1.5rem, 2.4vw, 1.9rem);
  font-weight: 700;
  line-height: 1.2;
}

.pg-typography--title {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  font-weight: 700;
  line-height: 1.25;
}

.pg-typography--subtitle {
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  font-weight: 600;
  color: var(--pg-color-text-primary);
}

.pg-typography--body {
  font-size: 0.9rem;
  color: var(--pg-color-text-secondary);
  line-height: 1.4;
}

.pg-typography--caption {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--pg-color-text-muted);
}

.pg-typography--eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pg-color-blue-600);
}
</style>

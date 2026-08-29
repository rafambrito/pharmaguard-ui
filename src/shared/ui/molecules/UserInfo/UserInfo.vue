<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  role?: string
}

const props = withDefaults(defineProps<Props>(), {
  role: '',
})

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).filter(Boolean)
  const chars = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return chars.join('') || '?'
})
</script>

<template>
  <div class="pg-user-info">
    <span class="pg-user-info__avatar" aria-hidden="true">{{ initials }}</span>
    <div class="pg-user-info__text">
      <span class="pg-user-info__name">{{ name }}</span>
      <span v-if="role" class="pg-user-info__role">{{ role }}</span>
    </div>
  </div>
</template>

<style scoped>
.pg-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pg-user-info__avatar {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--pg-color-blue-100);
  color: var(--pg-color-blue-700);
  font-size: 0.78rem;
  font-weight: 700;
}

.pg-user-info__text {
  display: grid;
  line-height: 1.25;
}

.pg-user-info__name {
  color: var(--pg-color-text-primary);
  font-size: 0.86rem;
  font-weight: 600;
}

.pg-user-info__role {
  color: var(--pg-color-text-muted);
  font-size: 0.72rem;
}
</style>

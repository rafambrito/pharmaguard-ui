<script setup lang="ts">
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'

interface Props {
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
})
</script>

<template>
  <header class="pg-header">
    <div class="pg-header__title-row">
      <h1>{{ title }}</h1>
      <Icon name="UI" />
    </div>
    <p v-if="subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.pg-header {
  margin-bottom: 18px;
}

.pg-header__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

h1 {
  margin: 0;
  font-size: 28px;
}

p {
  margin: 6px 0 0;
  color: #3f5876;
}
</style>

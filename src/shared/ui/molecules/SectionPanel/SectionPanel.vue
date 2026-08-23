<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  description: '',
})
</script>

<template>
  <section class="pg-panel">
    <div class="pg-panel__head">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <slot name="actions" />
    </div>
    <slot />
  </section>
</template>

<style scoped>
.pg-panel {
  display: grid;
  gap: 12px;
  padding: clamp(14px, 1.8vw, 18px);
  border: 1px solid #dfe7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(22, 54, 70, 0.06);
}

.pg-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

h2 {
  margin: 0;
  color: #24323a;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.2;
}

p {
  margin: 4px 0 0;
  color: #667780;
  font-size: clamp(0.75rem, 0.9vw, 0.82rem);
  line-height: 1.3;
}
</style>

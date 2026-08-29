<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? 'Módulo'))
</script>

<template>
  <main class="module-placeholder">
    <Header :title="title" subtitle="Este módulo será disponibilizado em uma próxima etapa." />
  </main>
</template>

<style scoped>
.module-placeholder {
  max-width: 1120px;
}
</style>
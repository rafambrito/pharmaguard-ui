<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/shared/ui/atoms/Button/Button.vue'

const router = useRouter()

async function backToHome(): Promise<void> {
  await router.push('/')
}
</script>

<template>
  <main class="access-page">
    <section class="access-card">
      <h1>Acesso negado</h1>
      <p>Seu usuário está autenticado, mas não possui permissão para acessar esta rota.</p>
      <Button type="button" @click="backToHome">Voltar ao início</Button>
    </section>
  </main>
</template>

<style scoped>
.access-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.access-card {
  width: min(100%, 460px);
  background: #ffffff;
  border: 1px solid #dbe6f2;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(17, 34, 58, 0.08);
}

h1 {
  margin: 0 0 12px;
  font-size: 24px;
}

p {
  margin: 0 0 16px;
  color: #3f5876;
}
</style>

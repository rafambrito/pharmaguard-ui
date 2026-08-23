<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import { useSessionStore } from '@/entities/session'
import { t } from '@/shared/config/messages'

const router = useRouter()
const route = useRoute()
const sessionStore = useSessionStore()

const usuario = ref('')
const senha = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function submitLogin(): Promise<void> {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await sessionStore.signIn({ usuario: usuario.value, senha: senha.value })
    const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirectTo)
  } catch {
    errorMessage.value = t('auth.login.error.invalidCredentials')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>{{ t('auth.login.title') }}</h1>

      <form class="login-form" @submit.prevent="submitLogin">
        <div class="field">
          <Label for-id="usuario">{{ t('label.usuario') }}</Label>
          <Input
            id="usuario"
            v-model="usuario"
            :placeholder="t('placeholder.usuario')"
            autocomplete="username"
          />
        </div>

        <div class="field">
          <Label for-id="senha">{{ t('label.senha') }}</Label>
          <Input
            id="senha"
            v-model="senha"
            type="password"
            show-password-toggle
            :placeholder="t('placeholder.senha')"
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <Button type="submit">{{ isLoading ? t('auth.login.submit.loading') : t('auth.login.submit') }}</Button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(100%, 420px);
  background: #ffffff;
  border: 1px solid #dbe6f2;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(17, 34, 58, 0.08);
}

h1 {
  margin: 0;
  font-size: 24px;
}

p {
  color: #3f5876;
}

.login-form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
}

.error-message {
  margin: 0;
  color: #b22424;
  font-size: 14px;
}
</style>

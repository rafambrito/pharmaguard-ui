<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useCurrentUser, useSessionStore } from '@/entities/session'
import { t } from '@/shared/config/messages'
import Sidebar from '@/shared/ui/organisms/Sidebar/Sidebar.vue'
import Button from '@/shared/ui/atoms/Button/Button.vue'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const { displayName } = useCurrentUser()

const navGroups = computed(() => [
  {
    label: 'Início',
    items: [{ label: 'Dashboard', to: '/' }],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Medicamentos', to: '/medicamentos' },
      { label: 'Estoque', to: '/estoque' },
      { label: 'Fornecedores', to: '/fornecedores' },
      { label: 'Unidades de Saúde', to: '/unidades-saude' },
    ],
  },
  {
    label: 'Movimentação',
    items: [
      { label: 'Entradas', to: '/entradas' },
      { label: 'Saídas', to: '/saidas' },
      { label: 'Transferências', to: '/transferencias' },
    ],
  },
  {
    label: 'Análises',
    items: [
      { label: 'Alertas', to: '/alertas' },
      { label: 'Relatórios', to: '/relatorios' },
      { label: 'Inteligência', to: '/inteligencia' },
    ],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Usuários', to: '/usuarios' },
      { label: 'Perfis', to: '/perfis' },
    ],
  },
])

const shouldUseShell = computed(() => route.name !== 'login')

async function logout(): Promise<void> {
  sessionStore.signOut()
  await router.replace('/login')
}
</script>

<template>
  <RouterView v-if="!shouldUseShell" />
  <div v-else class="app-layout">
    <Sidebar :groups="navGroups" />
    <div class="app-main">
      <header class="app-topbar">
        <div class="app-user">{{ t('shell.greeting.prefix') }} {{ displayName }}</div>
        <Button type="button" @click="logout">{{ t('shell.logout') }}</Button>
      </header>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.app-user {
  font-weight: 600;
  color: #28486d;
}
</style>

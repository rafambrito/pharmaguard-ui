<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useCurrentUser, useSessionStore } from '@/entities/session'
import { t } from '@/shared/config/messages'
import Sidebar from '@/shared/ui/organisms/Sidebar/Sidebar.vue'
import Header from '@/shared/ui/organisms/Header/Header.vue'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const { displayName, primaryRole } = useCurrentUser()

const navGroups = computed(() => [
  {
    label: 'Início',
    items: [{ label: 'Dashboard', to: '/', icon: 'home' }],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Medicamentos', to: '/medicamentos', icon: 'pill' },
      { label: 'Unidades de Medida', to: '/unidades-medida', icon: 'box' },
      { label: 'Estoque', to: '/estoque', icon: 'box' },
      { label: 'Fornecedores', to: '/fornecedores', icon: 'truck' },
      { label: 'Unidades de Saúde', to: '/unidades-saude', icon: 'hospital' },
    ],
  },
  {
    label: 'Movimentação',
    items: [
      { label: 'Entradas', to: '/entradas', icon: 'arrow-in' },
      { label: 'Saídas', to: '/saidas', icon: 'arrow-out' },
      { label: 'Transferências', to: '/transferencias', icon: 'transfer' },
    ],
  },
  {
    label: 'Análises',
    items: [
      { label: 'Alertas', to: '/alertas', icon: 'alert' },
      { label: 'Relatórios', to: '/relatorios', icon: 'report' },
      { label: 'Inteligência', to: '/inteligencia', icon: 'ai' },
    ],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Usuários', to: '/usuarios', icon: 'users' },
      { label: 'Perfis', to: '/perfis', icon: 'shield' },
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
      <Header :user-name="displayName" :user-role="primaryRole" :logout-label="t('shell.logout')" @logout="logout" />
      <RouterView />
    </div>
  </div>
</template>

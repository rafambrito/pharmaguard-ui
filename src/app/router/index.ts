import { createRouter, createWebHistory } from 'vue-router'
import { pinia } from '@/app/providers/pinia'
import { useSessionStore } from '@/entities/session'
import { canAccessRoute } from '@/features/auth/lib/accessControl'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { ModulePlaceholderPage } from '@/pages/module-placeholder'
import { UsuariosPage } from '@/pages/usuarios'

interface AppRouteMeta {
  requiresAuth?: boolean
  guestOnly?: boolean
  roles?: string[]
  title?: string
}

const placeholderRoutes = [
  ['medicamentos', 'Medicamentos'],
  ['estoque', 'Estoque'],
  ['fornecedores', 'Fornecedores'],
  ['unidades-saude', 'Unidades de Saúde'],
  ['entradas', 'Entradas'],
  ['saidas', 'Saídas'],
  ['transferencias', 'Transferências'],
  ['alertas', 'Alertas'],
  ['relatorios', 'Relatórios'],
  ['inteligencia', 'Inteligência'],
  ['perfis', 'Perfis'],
] as const

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        guestOnly: true,
      } satisfies AppRouteMeta,
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        requiresAuth: true,
      } satisfies AppRouteMeta,
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosPage,
      meta: {
        requiresAuth: true,
        roles: ['ROLE_ADMIN'],
        title: 'Usuários',
      } satisfies AppRouteMeta,
    },
    {
      path: '/acesso-negado',
      name: 'access-denied',
      component: () => import('@/pages/login/ui/AccessDeniedPage.vue'),
      meta: {
        requiresAuth: true,
      } satisfies AppRouteMeta,
    },
  ],
    ...placeholderRoutes.map(([path, title]) => ({
      path: `/${path}`,
      name: path,
      component: ModulePlaceholderPage,
      meta: {
        requiresAuth: true,
        title,
      } satisfies AppRouteMeta,
    })),
})

router.beforeEach(async (to) => {
  const sessionStore = useSessionStore(pinia)

  if (!sessionStore.tokens && !sessionStore.isAuthenticated) {
    sessionStore.hydrateFromStorage()
  }

  const meta = to.meta as AppRouteMeta

  if (meta.guestOnly && sessionStore.isAuthenticated) {
    return { name: 'home' }
  }

  if (!meta.requiresAuth) {
    return true
  }

  if (!sessionStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  const requiredRoles = meta.roles ?? []
  const allowed = canAccessRoute({
    isAuthenticated: sessionStore.isAuthenticated,
    requiredRoles,
    currentRoles: sessionStore.currentRoles,
  })

  if (!allowed) {
    return { name: 'access-denied' }
  }

  return true
})

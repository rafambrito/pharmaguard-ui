import { createRouter, createWebHistory } from 'vue-router'
import { pinia } from '@/app/providers/pinia'
import { useSessionStore } from '@/entities/session'
import { canAccessRoute } from '@/features/auth/lib/accessControl'
import { AlertasPage } from '@/pages/alertas'
import { EntradasPage } from '@/pages/entradas'
import { EstoquePage } from '@/pages/estoque'
import { FornecedoresPage } from '@/pages/fornecedores'
import { HomePage } from '@/pages/home'
import { InteligenciaPage } from '@/pages/inteligencia'
import { LoginPage } from '@/pages/login'
import { MedicamentosPage } from '@/pages/medicamentos'
import { ModulePlaceholderPage } from '@/pages/module-placeholder'
import { RelatoriosPage } from '@/pages/relatorios'
import { SaidasPage } from '@/pages/saidas'
import { TransferenciasPage } from '@/pages/transferencias'
import { UnidadesMedidaPage } from '@/pages/unidades-medida'
import { UnidadesSaudePage } from '@/pages/unidades-saude'
import { UsuariosPage } from '@/pages/usuarios'

interface AppRouteMeta {
  requiresAuth?: boolean
  guestOnly?: boolean
  roles?: string[]
  title?: string
}

const placeholderRoutes = [
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
      path: '/medicamentos',
      name: 'medicamentos',
      component: MedicamentosPage,
      meta: {
        requiresAuth: true,
        title: 'Medicamentos',
      } satisfies AppRouteMeta,
    },
    {
      path: '/unidades-medida',
      name: 'unidades-medida',
      component: UnidadesMedidaPage,
      meta: {
        requiresAuth: true,
        title: 'Unidades de Medida',
      } satisfies AppRouteMeta,
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: FornecedoresPage,
      meta: {
        requiresAuth: true,
        title: 'Fornecedores',
      } satisfies AppRouteMeta,
    },
    {
      path: '/unidades-saude',
      name: 'unidades-saude',
      component: UnidadesSaudePage,
      meta: {
        requiresAuth: true,
        title: 'Unidades de Saúde',
      } satisfies AppRouteMeta,
    },
    {
      path: '/estoque',
      name: 'estoque',
      component: EstoquePage,
      meta: {
        requiresAuth: true,
        title: 'Estoque',
      } satisfies AppRouteMeta,
    },
    {
      path: '/entradas',
      name: 'entradas',
      component: EntradasPage,
      meta: {
        requiresAuth: true,
        title: 'Entradas',
      } satisfies AppRouteMeta,
    },
    {
      path: '/saidas',
      name: 'saidas',
      component: SaidasPage,
      meta: {
        requiresAuth: true,
        title: 'Saídas',
      } satisfies AppRouteMeta,
    },
    {
      path: '/transferencias',
      name: 'transferencias',
      component: TransferenciasPage,
      meta: {
        requiresAuth: true,
        title: 'Transferências',
      } satisfies AppRouteMeta,
    },
    {
      path: '/alertas',
      name: 'alertas',
      component: AlertasPage,
      meta: {
        requiresAuth: true,
        title: 'Alertas',
      } satisfies AppRouteMeta,
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: RelatoriosPage,
      meta: {
        requiresAuth: true,
        title: 'Relatórios',
      } satisfies AppRouteMeta,
    },
    {
      path: '/inteligencia',
      name: 'inteligencia',
      component: InteligenciaPage,
      meta: {
        requiresAuth: true,
        title: 'Inteligência',
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
    ...placeholderRoutes.map(([path, title]) => ({
      path: `/${path}`,
      name: path,
      component: ModulePlaceholderPage,
      meta: {
        requiresAuth: true,
        title,
      } satisfies AppRouteMeta,
    })),
  ],
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

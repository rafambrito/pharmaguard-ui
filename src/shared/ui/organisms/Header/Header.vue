<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  alertaSeveridadeLabel,
  alertaSeveridadeTone,
  alertaTipoLabel,
  type ItemAlerta,
} from '@/entities/alerta'
import { getRelatorioAlertas } from '@/shared/api/alertApi'
import { t } from '@/shared/config/messages'
import UserInfo from '@/shared/ui/molecules/UserInfo/UserInfo.vue'
import SearchField from '@/shared/ui/molecules/SearchField/SearchField.vue'
import Button from '@/shared/ui/atoms/Button/Button.vue'

interface Props {
  userName: string
  userRole?: string
  logoutLabel: string
}

withDefaults(defineProps<Props>(), {
  userRole: '',
})

const emit = defineEmits<{
  logout: []
}>()

const router = useRouter()
const isNotificationsOpen = ref(false)
const isLoadingNotifications = ref(false)
const notifications = ref<ItemAlerta[]>([])
const notificationsError = ref(false)

function dateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function toggleNotifications(): Promise<void> {
  isNotificationsOpen.value = !isNotificationsOpen.value

  if (!isNotificationsOpen.value || notifications.value.length || notificationsError.value) {
    return
  }

  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - 30)
  isLoadingNotifications.value = true

  try {
    const report = await getRelatorioAlertas({
      periodoInicio: dateInput(start),
      periodoFim: dateInput(end),
      medicamentoId: '',
      unidadeSaudeId: '',
      tipo: '',
      severidade: '',
    })
    notifications.value = report.alertas.slice(0, 4)
  } catch {
    notificationsError.value = true
  } finally {
    isLoadingNotifications.value = false
  }
}

function openAlerts(): void {
  isNotificationsOpen.value = false
  void router.push('/alertas')
}
</script>

<template>
  <header class="pg-topbar">
    <SearchField class="pg-topbar__search" placeholder="Buscar medicamentos, unidades..." />

    <div class="pg-topbar__actions">
      <div class="pg-topbar__notifications-wrap">
        <button
          type="button"
          class="pg-topbar__notifications"
          :aria-label="t('shell.notifications')"
          :aria-expanded="isNotificationsOpen"
          aria-controls="pg-notifications-panel"
          @click="toggleNotifications"
        >
          <span v-if="notifications.length" class="pg-topbar__notifications-dot" aria-hidden="true"></span>
        </button>

        <aside v-if="isNotificationsOpen" id="pg-notifications-panel" class="pg-notifications-panel">
          <div class="pg-notifications-panel__header">
            <div>
              <h2>{{ t('shell.notifications.title') }}</h2>
              <p>{{ t('shell.notifications.subtitle') }}</p>
            </div>
            <span v-if="notifications.length" class="pg-notifications-panel__count">{{ notifications.length }}</span>
          </div>

          <p v-if="isLoadingNotifications" class="pg-notifications-panel__state">
            {{ t('shell.notifications.loading') }}
          </p>
          <p v-else-if="notificationsError" class="pg-notifications-panel__state">
            {{ t('shell.notifications.error') }}
          </p>
          <p v-else-if="!notifications.length" class="pg-notifications-panel__state">
            {{ t('shell.notifications.empty') }}
          </p>
          <ul v-else class="pg-notifications-list">
            <li v-for="notification in notifications" :key="`${notification.medicamentoId}-${notification.tipo}`">
              <button type="button" class="pg-notification" @click="openAlerts">
                <span
                  class="pg-notification__dot"
                  :class="`pg-notification__dot--${alertaSeveridadeTone(notification.severidade)}`"
                  aria-hidden="true"
                ></span>
                <span class="pg-notification__content">
                  <strong>{{ alertaTipoLabel(notification.tipo) }}</strong>
                  <span>{{ notification.nomeMedicamento }}</span>
                  <small>{{ alertaSeveridadeLabel(notification.severidade) }} · {{ notification.descricao }}</small>
                </span>
              </button>
            </li>
          </ul>

          <button type="button" class="pg-notifications-panel__link" @click="openAlerts">
            {{ t('shell.notifications.viewAll') }}
          </button>
        </aside>
      </div>
      <UserInfo :name="userName" :role="userRole" />
      <Button type="button" @click="emit('logout')">{{ logoutLabel }}</Button>
    </div>
  </header>
</template>

<style scoped>
.pg-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.pg-topbar__search {
  flex: 0 1 320px;
}

.pg-topbar__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pg-topbar__notifications-wrap {
  position: relative;
}

.pg-topbar__notifications {
  position: relative;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--pg-color-border);
  border-radius: 50%;
  background: var(--pg-color-surface);
  cursor: pointer;
}

.pg-topbar__notifications::before {
  content: '';
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--pg-color-text-secondary);
  border-radius: 50% 50% 4px 4px;
}

.pg-topbar__notifications-dot {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--pg-color-critical);
}

.pg-notifications-panel {
  position: absolute;
  z-index: 10;
  top: calc(100% + 10px);
  right: 0;
  width: min(360px, calc(100vw - 32px));
  padding: 16px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-md);
  background: var(--pg-color-surface);
  box-shadow: var(--pg-shadow-md);
}

.pg-notifications-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--pg-color-border);
}

.pg-notifications-panel h2,
.pg-notifications-panel p {
  margin: 0;
}

.pg-notifications-panel h2 {
  color: var(--pg-color-text-primary);
  font-size: 0.95rem;
}

.pg-notifications-panel__header p,
.pg-notifications-panel__state {
  margin-top: 4px;
  color: var(--pg-color-text-secondary);
  font-size: 0.78rem;
  line-height: 1.4;
}

.pg-notifications-panel__count {
  display: grid;
  min-width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: var(--pg-color-critical);
  color: var(--pg-color-surface);
  font-size: 0.75rem;
  font-weight: 700;
}

.pg-notifications-panel__state {
  padding: 16px 0 4px;
}

.pg-notifications-list {
  display: grid;
  gap: 2px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.pg-notification {
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 10px 4px;
  border: 0;
  border-radius: var(--pg-radius-sm);
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.pg-notification:hover {
  background: var(--pg-color-blue-50);
}

.pg-notification__dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--pg-color-text-muted);
}

.pg-notification__dot--critical {
  background: var(--pg-color-critical);
}

.pg-notification__dot--warning {
  background: var(--pg-color-warning);
}

.pg-notification__dot--monitoring {
  background: var(--pg-color-monitoring);
}

.pg-notification__content {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.pg-notification__content strong,
.pg-notification__content span,
.pg-notification__content small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg-notification__content strong {
  color: var(--pg-color-text-primary);
  font-size: 0.8rem;
}

.pg-notification__content span {
  color: var(--pg-color-text-secondary);
  font-size: 0.78rem;
}

.pg-notification__content small {
  color: var(--pg-color-text-muted);
  font-size: 0.7rem;
}

.pg-notifications-panel__link {
  width: 100%;
  margin-top: 10px;
  padding: 9px 0 0;
  border: 0;
  border-top: 1px solid var(--pg-color-border);
  background: transparent;
  color: var(--pg-color-blue-700);
  font-size: 0.78rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

@media (max-width: 720px) {
  .pg-topbar__search {
    display: none;
  }
}
</style>

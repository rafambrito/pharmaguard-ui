<script setup lang="ts">
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
</script>

<template>
  <header class="pg-topbar">
    <SearchField class="pg-topbar__search" placeholder="Buscar medicamentos, unidades..." />

    <div class="pg-topbar__actions">
      <button type="button" class="pg-topbar__notifications" aria-label="Notificações">
        <span class="pg-topbar__notifications-dot" aria-hidden="true"></span>
      </button>
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

@media (max-width: 720px) {
  .pg-topbar__search {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import type { IconName } from '@/shared/ui/atoms/Icon/iconNames'

interface SidebarItem {
  label: string
  to: string
  icon: IconName
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

interface Props {
  groups: SidebarGroup[]
}

defineProps<Props>()

const expandedGroups = ref<Record<string, boolean>>({})
const isCollapsed = ref(false)

function isGroupExpanded(label: string): boolean {
  return expandedGroups.value[label] ?? false
}

function toggleGroup(label: string): void {
  expandedGroups.value[label] = !isGroupExpanded(label)
}

function toggleCollapsed(): void {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside class="pg-sidebar" :class="{ 'pg-sidebar--collapsed': isCollapsed }">
    <div class="pg-sidebar__brand">
      <span class="pg-sidebar__brand-mark" aria-hidden="true">PG</span>
      <div v-if="!isCollapsed" class="pg-sidebar__brand-text">
        <strong>PharmaGuard</strong>
        <span>Gestão de saúde</span>
      </div>
      <button
        type="button"
        class="pg-sidebar__collapse-toggle"
        :aria-expanded="!isCollapsed"
        aria-label="Recolher menu"
        @click="toggleCollapsed"
      >
        <span aria-hidden="true"></span>
      </button>
    </div>
    <nav class="pg-sidebar__nav" aria-label="Navegação principal">
      <section v-for="group in groups" :key="group.label" class="pg-sidebar__group">
        <button
          v-if="!isCollapsed"
          type="button"
          class="pg-sidebar__group-toggle"
          :aria-expanded="isGroupExpanded(group.label)"
          :aria-controls="`sidebar-group-${group.label}`"
          @click="toggleGroup(group.label)"
        >
          <span class="pg-sidebar__group-title">{{ group.label }}</span>
          <span class="pg-sidebar__group-chevron" aria-hidden="true"></span>
        </button>
        <div
          v-if="isCollapsed || isGroupExpanded(group.label)"
          :id="`sidebar-group-${group.label}`"
          class="pg-sidebar__group-items"
        >
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="pg-sidebar__link"
            active-class="pg-sidebar__link--active"
            :title="item.label"
          >
            <span class="pg-sidebar__link-icon">
              <Icon :name="item.icon" :size="18" />
            </span>
            <span v-if="!isCollapsed" class="pg-sidebar__link-label">{{ item.label }}</span>
          </RouterLink>
        </div>
      </section>
    </nav>
  </aside>
</template>

<style scoped>
.pg-sidebar {
  display: flex;
  min-height: 100vh;
  width: 240px;
  flex-direction: column;
  border-right: 1px solid var(--pg-color-border);
  background: var(--pg-color-surface);
  padding: 20px 14px;
  transition: width 180ms ease;
}

.pg-sidebar--collapsed {
  width: 76px;
  padding: 20px 10px;
}

.pg-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px 20px;
  border-bottom: 1px solid var(--pg-color-border);
}

.pg-sidebar__brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border-radius: 10px;
  background: var(--pg-color-blue-700);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.pg-sidebar__brand-text {
  flex: 1;
  min-width: 0;
}

.pg-sidebar__brand-text strong,
.pg-sidebar__brand-text span {
  display: block;
}

.pg-sidebar__brand-text strong {
  color: var(--pg-color-text-primary);
  font-size: 15px;
  line-height: 1.2;
}

.pg-sidebar__brand-text span {
  margin-top: 3px;
  color: var(--pg-color-text-muted);
  font-size: 11px;
}

.pg-sidebar__collapse-toggle {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  border: 1px solid var(--pg-color-border);
  border-radius: 50%;
  background: var(--pg-color-surface);
  cursor: pointer;
}

.pg-sidebar__collapse-toggle span {
  width: 6px;
  height: 6px;
  border-left: 1.5px solid var(--pg-color-text-secondary);
  border-bottom: 1.5px solid var(--pg-color-text-secondary);
  transform: rotate(45deg);
}

.pg-sidebar--collapsed .pg-sidebar__collapse-toggle span {
  transform: rotate(-135deg);
}

.pg-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding-top: 8px;
}

.pg-sidebar__group {
  margin-top: 20px;
}

.pg-sidebar__group:first-child {
  margin-top: 0;
}

.pg-sidebar__group-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 10px 10px 6px;
  text-align: left;
}

.pg-sidebar__group-toggle:hover .pg-sidebar__group-title,
.pg-sidebar__group-toggle:focus-visible .pg-sidebar__group-title {
  color: var(--pg-color-blue-700);
}

.pg-sidebar__group-title {
  margin: 0;
  color: var(--pg-color-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pg-sidebar__group-chevron {
  position: relative;
  width: 7px;
  height: 7px;
  color: var(--pg-color-text-muted);
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
  transition: transform 160ms ease;
}

.pg-sidebar__group-toggle[aria-expanded='false'] .pg-sidebar__group-chevron {
  transform: rotate(-45deg) translate(-1px, 1px);
}

.pg-sidebar__group-items {
  display: grid;
  gap: 3px;
  padding: 2px 0 4px;
}

.pg-sidebar__link {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--pg-color-text-secondary);
  padding: 8px 12px;
  border-radius: var(--pg-radius-sm);
  font-size: 13px;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.pg-sidebar--collapsed .pg-sidebar__link {
  justify-content: center;
  padding: 8px;
}

.pg-sidebar__link:hover {
  background: var(--pg-color-blue-50);
  color: var(--pg-color-blue-800);
  transform: translateX(2px);
}

.pg-sidebar__link:hover .pg-sidebar__link-icon {
  color: var(--pg-color-blue-800);
}

.pg-sidebar__link--active {
  background: var(--pg-color-blue-100);
  color: var(--pg-color-blue-700);
  font-weight: 700;
}

.pg-sidebar__link-icon {
  display: grid;
  flex: 0 0 18px;
  place-items: center;
  color: var(--pg-color-text-muted);
  transition: color 160ms ease;
}

.pg-sidebar__link-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg-sidebar__link--active .pg-sidebar__link-icon {
  color: var(--pg-color-blue-700);
}

.pg-sidebar__group-toggle:focus-visible,
.pg-sidebar__link:focus-visible {
  outline: 2px solid var(--pg-color-blue-700);
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .pg-sidebar {
    min-height: auto;
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid var(--pg-color-border);
  }

  .pg-sidebar__nav {
    max-height: 52vh;
  }
}
</style>


<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface SidebarItem {
  label: string
  to: string
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

function isGroupExpanded(label: string): boolean {
  return expandedGroups.value[label] ?? true
}

function toggleGroup(label: string): void {
  expandedGroups.value[label] = !isGroupExpanded(label)
}
</script>

<template>
  <aside class="pg-sidebar">
    <div class="pg-sidebar__brand">
      <span class="pg-sidebar__brand-mark" aria-hidden="true">PG</span>
      <div>
        <strong>PharmaGuard</strong>
        <span>Gestão de saúde</span>
      </div>
    </div>
    <nav class="pg-sidebar__nav" aria-label="Navegação principal">
      <section v-for="group in groups" :key="group.label" class="pg-sidebar__group">
        <button
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
          v-if="isGroupExpanded(group.label)"
          :id="`sidebar-group-${group.label}`"
          class="pg-sidebar__group-items"
        >
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="pg-sidebar__link"
            active-class="pg-sidebar__link--active"
          >
            <span class="pg-sidebar__link-indicator" aria-hidden="true"></span>
            <span>{{ item.label }}</span>
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
  flex-direction: column;
  border-right: 1px solid #dbe6f2;
  background: #f8fbfd;
  padding: 22px 14px;
}

.pg-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 22px;
  border-bottom: 1px solid #e2ebf1;
}

.pg-sidebar__brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: #167c80;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.pg-sidebar__brand strong,
.pg-sidebar__brand span {
  display: block;
}

.pg-sidebar__brand strong {
  color: #15324a;
  font-size: 15px;
  line-height: 1.2;
}

.pg-sidebar__brand div span {
  margin-top: 3px;
  color: #7b8d9c;
  font-size: 11px;
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
  color: #214266;
}

.pg-sidebar__group-title {
  margin: 0;
  color: #71839a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pg-sidebar__group-chevron {
  position: relative;
  width: 7px;
  height: 7px;
  color: #71839a;
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
  color: #486276;
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 13px;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.pg-sidebar__link:hover {
  background: #edf4f6;
  color: #153f52;
  transform: translateX(2px);
}

.pg-sidebar__link--active {
  background: #e1f1f0;
  color: #0d686b;
  font-weight: 700;
}

.pg-sidebar__link-indicator {
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: #b8c9d2;
  transition: background-color 160ms ease, transform 160ms ease;
}

.pg-sidebar__link--active .pg-sidebar__link-indicator {
  background: #167c80;
  transform: scale(1.35);
}

.pg-sidebar__group-toggle:focus-visible,
.pg-sidebar__link:focus-visible {
  outline: 2px solid #167c80;
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .pg-sidebar {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid #dbe6f2;
  }

  .pg-sidebar__nav {
    max-height: 52vh;
  }
}
</style>

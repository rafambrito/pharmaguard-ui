<script setup lang="ts">
import { computed } from 'vue'
import type { IconName } from '@/shared/ui/atoms/Icon/iconNames'

interface Props {
  name: IconName | string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
})

const paths: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20a1 1 0 0 0 1 1H10v-5.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2V21h3.5a1 1 0 0 0 1-1V9.5',
  pill: 'M8.5 15.5 15.5 8.5a3.9 3.9 0 1 1 5.5 5.5l-7 7a3.9 3.9 0 1 1-5.5-5.5Zm3-3 5.5 5.5',
  box: 'M3.5 8 12 4l8.5 4M3.5 8v8L12 20l8.5-4V8M3.5 8 12 12M12 12l8.5-4M12 12v8',
  truck: 'M3 7h11v9H3zm11 3h4l3 3v3h-2M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  hospital: 'M5 21V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16M9 21v-4h6v4M12 6v5M9.5 8.5h5M3 21h18',
  'arrow-in': 'M12 4v11m0 0 4-4m-4 4-4-4M5 20h14',
  'arrow-out': 'M12 15V4m0 0 4 4m-4-4-4 4M5 20h14',
  transfer: 'M4 8h13m0 0-3.5-3.5M17 8l-3.5 3.5M20 16H7m0 0 3.5-3.5M7 16l3.5 3.5',
  chart: 'M4 20V10m6 10V4m6 16v-7',
  report: 'M6 3h9l4 4v14H6zM14.5 3v4.5H19M9 12h6M9 15.5h6M9 8.5h2',
  alert: 'M12 3 2 20h20L12 3Zm0 7.5v4M12 17.5h.01',
  ai: 'M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-7 7-2 2m0-11 2 2m7 7 2 2M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1m2-9a4.5 4.5 0 0 1 4 4.5V20h-3',
  shield: 'M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Zm-2.5 9.5 1.8 1.8L14.5 10',
  barcode: 'M4 4v16M8 4v16M11 4v16M14 4v16M16.5 4v16M19 4v16M21 4v16',
  upload: 'M12 16V4m0 0 4 4m-4-4-4 4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3',
  cart: 'M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6M9.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  plug: 'M9 3v5m6-5v5M7 8h10v3a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5V8Zm5 8v4M9 21h6',
  satellite: 'M6 12 3 9l3-3 3 3M4.5 10.5 9 15m6.5-9.5 3-3 3 3-3 3M13.5 8.5 18 13m-9.5 2.5L15 22l3.5-3.5-6.5-6.5-3.5 3.5Z',
  catalog: 'M5 4h11l3 3v13H5Zm11 0v3h3M9 11h6M9 14.5h6M9 17.5h4',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm7.5 15.5-4-4',
}

const iconPath = computed(() => paths[props.name as IconName] ?? paths.box)
</script>

<template>
  <svg
    class="pg-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="iconPath" />
  </svg>
</template>

<style scoped>
.pg-icon {
  display: block;
  color: currentColor;
}
</style>


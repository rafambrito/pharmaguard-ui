import { onMounted, ref } from 'vue'
import type { DashboardOverview } from '@/entities/dashboard'
import { fetchDashboardOverview } from '@/features/dashboard-overview/api/dashboardOverviewMock'

export function useDashboardOverview() {
  const overview = ref<DashboardOverview | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      overview.value = await fetchDashboardOverview()
    } catch {
      hasError.value = true
      overview.value = null
    } finally {
      isLoading.value = false
    }
  }

  onMounted(load)

  return { overview, isLoading, hasError, load }
}

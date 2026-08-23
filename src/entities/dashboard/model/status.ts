import type { DashboardStatus } from '@/entities/dashboard/model/types'

const statusLabels: Record<DashboardStatus, string> = {
  critical: 'Crítico',
  warning: 'Atenção',
  monitoring: 'Monitoramento',
  normal: 'Normal',
}

export function statusLabel(status: DashboardStatus): string {
  return statusLabels[status]
}

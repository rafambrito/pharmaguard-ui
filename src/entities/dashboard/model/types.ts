export type DashboardStatus = 'critical' | 'warning' | 'monitoring' | 'normal'

export interface DashboardMetricTrend {
  direction: 'up' | 'down'
  label: string
}

export interface DashboardMetric {
  id: string
  icon: string
  title: string
  value: string
  description: string
  status?: DashboardStatus
  trend?: DashboardMetricTrend
}

export interface DashboardAlert {
  id: string
  title: string
  description: string
  unit: string
  status: DashboardStatus
}

export interface UnitStockSummary {
  id: string
  name: string
  criticalItems: number
  expiringBatches: number
  status: DashboardStatus
}

export interface TransferOpportunity {
  id: string
  originUnit: string
  destinationUnit: string
  medication: string
  suggestedQuantity: number
  reason: string
}

export interface ConsumptionPoint {
  label: string
  value: number
}

export interface ConsumptionTrend {
  periodLabel: string
  unitOfMeasure: string
  points: ConsumptionPoint[]
}

export interface DashboardOverview {
  metrics: DashboardMetric[]
  alerts: DashboardAlert[]
  units: UnitStockSummary[]
  transferOpportunities: TransferOpportunity[]
  consumptionTrend: ConsumptionTrend
}

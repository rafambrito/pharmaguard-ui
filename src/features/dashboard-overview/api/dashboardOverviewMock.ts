import type { DashboardOverview } from '@/entities/dashboard'

const dashboardOverviewMock: DashboardOverview = {
  metrics: [
    {
      id: 'medicamentos-cadastrados',
      icon: '💊',
      title: 'Medicamentos cadastrados',
      value: '1.284',
      description: '32 itens adicionados nos últimos 30 dias.',
      status: 'normal',
      trend: { direction: 'up', label: '+8% no último período' },
    },
    {
      id: 'estoque-critico',
      icon: '⚠️',
      title: 'Itens em estoque crítico',
      value: '37',
      description: 'Saldo abaixo do estoque mínimo definido.',
      status: 'critical',
      trend: { direction: 'up', label: '+5% no último período' },
    },
    {
      id: 'lotes-vencimento',
      icon: '⏳',
      title: 'Lotes próximos do vencimento',
      value: '18',
      description: 'Vencimento previsto nos próximos 60 dias.',
      status: 'warning',
      trend: { direction: 'down', label: '-3% no último período' },
    },
    {
      id: 'transferencias-pendentes',
      icon: '🔄',
      title: 'Transferências pendentes',
      value: '6',
      description: 'Aguardando aprovação ou envio entre unidades.',
      status: 'monitoring',
      trend: { direction: 'down', label: '-2 no último período' },
    },
  ],
  alerts: [
    {
      id: 'risco-ruptura',
      title: 'Risco de ruptura',
      description: 'Dipirona 500mg deve zerar em aproximadamente 4 dias no ritmo atual de consumo.',
      unit: 'Unidade Norte',
      status: 'critical',
    },
    {
      id: 'estoque-abaixo-minimo',
      title: 'Estoque abaixo do mínimo',
      description: 'Amoxicilina 500mg está com 120 unidades para um mínimo de 300.',
      unit: 'Unidade Leste',
      status: 'warning',
    },
    {
      id: 'lote-proximo-vencimento',
      title: 'Lote próximo do vencimento',
      description: 'Lote AB-2291 de Losartana 50mg vence em 21 dias com 480 unidades em estoque.',
      unit: 'Unidade Central',
      status: 'monitoring',
    },
    {
      id: 'consumo-anormal',
      title: 'Consumo anormal',
      description: 'Consumo de Omeprazol 20mg 42% acima da média histórica na última semana.',
      unit: 'Unidade Sul',
      status: 'warning',
    },
  ],
  units: [
    {
      id: 'central',
      name: 'Unidade Central',
      criticalItems: 6,
      expiringBatches: 4,
      status: 'monitoring',
    },
    {
      id: 'norte',
      name: 'Unidade Norte',
      criticalItems: 14,
      expiringBatches: 3,
      status: 'critical',
    },
    {
      id: 'sul',
      name: 'Unidade Sul',
      criticalItems: 5,
      expiringBatches: 7,
      status: 'warning',
    },
    {
      id: 'leste',
      name: 'Unidade Leste',
      criticalItems: 9,
      expiringBatches: 2,
      status: 'warning',
    },
    {
      id: 'oeste',
      name: 'Unidade Oeste',
      criticalItems: 3,
      expiringBatches: 2,
      status: 'normal',
    },
  ],
  transferOpportunities: [
    {
      id: 'central-norte-amoxicilina',
      originUnit: 'Unidade Central',
      destinationUnit: 'Unidade Norte',
      medication: 'Amoxicilina 500mg',
      suggestedQuantity: 200,
      reason: 'Estoque excedente na origem e risco de ruptura no destino.',
    },
    {
      id: 'oeste-leste-dipirona',
      originUnit: 'Unidade Oeste',
      destinationUnit: 'Unidade Leste',
      medication: 'Dipirona 500mg',
      suggestedQuantity: 350,
      reason: 'Consumo baixo na origem e saldo abaixo do mínimo no destino.',
    },
    {
      id: 'sul-norte-losartana',
      originUnit: 'Unidade Sul',
      destinationUnit: 'Unidade Norte',
      medication: 'Losartana 50mg',
      suggestedQuantity: 120,
      reason: 'Lote próximo do vencimento na origem e demanda crescente no destino.',
    },
  ],
  consumptionTrend: {
    periodLabel: 'Últimos 6 meses',
    unitOfMeasure: 'unidades dispensadas',
    points: [
      { label: 'Mar', value: 8200 },
      { label: 'Abr', value: 9100 },
      { label: 'Mai', value: 8750 },
      { label: 'Jun', value: 10400 },
      { label: 'Jul', value: 11250 },
      { label: 'Ago', value: 12080 },
    ],
  },
}

// Substituir por chamada HTTP real quando o endpoint de dashboard estiver disponível.
export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  return Promise.resolve(dashboardOverviewMock)
}

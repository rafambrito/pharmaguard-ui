import type { AlertaFiltro, ItemAlerta } from '@/entities/alerta/model/types'

export function filtrarAlertas(alertas: ItemAlerta[], filtro: AlertaFiltro): ItemAlerta[] {
  return alertas.filter((alerta) => {
    const matchesMedicamento =
      !filtro.medicamentoId || alerta.medicamentoId === Number(filtro.medicamentoId)
    const matchesTipo = !filtro.tipo || alerta.tipo === filtro.tipo
    const matchesSeveridade = !filtro.severidade || alerta.severidade === filtro.severidade

    return matchesMedicamento && matchesTipo && matchesSeveridade
  })
}
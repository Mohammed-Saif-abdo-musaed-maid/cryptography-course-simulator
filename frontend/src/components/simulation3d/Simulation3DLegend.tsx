import type { LegendEntry } from './types/simulation3d'

interface Simulation3DLegendProps {
  entries: LegendEntry[]
  t: (key: string) => string
}

export function Simulation3DLegend({ entries, t }: Simulation3DLegendProps) {
  if (entries.length === 0) return null
  return (
    <div className="sim3d-legend" aria-label={t('simulation3d.common.legend')}>
      {entries.map((e) => (
        <span key={e.id} className="sim3d-legend-item">
          <span className={`sim3d-swatch sim3d-swatch-${e.tone}`} aria-hidden="true" />
          <span>{t(e.labelKey)}</span>
        </span>
      ))}
    </div>
  )
}
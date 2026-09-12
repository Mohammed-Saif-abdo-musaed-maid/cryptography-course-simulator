import { interpolate } from '../simulation/simulationTypes'
import type { Simulation3DStep } from './types/simulation3d'

interface Simulation3DTimelineProps {
  steps: Simulation3DStep[]
  active: number
  dir: 'ltr' | 'rtl'
  t: (key: string) => string
  onSelect: (i: number) => void
}

export function Simulation3DTimeline({
  steps,
  active,
  dir,
  t,
  onSelect,
}: Simulation3DTimelineProps) {
  const last = steps.length - 1
  return (
    <div
      className="sim3d-timeline"
      dir={dir}
      role="tablist"
      aria-label={t('simulation3d.common.timeline') ?? 'Timeline'}
    >
      <span
        className="sim3d-timeline-progress"
        aria-hidden="true"
        style={{ width: last > 0 ? `${(active / last) * 100}%` : '0%' }}
      />
      {steps.map((s, i) => {
        const title = interpolate(t(s.titleKey), s.titleArgs)
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`sim3d-chip${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
            onClick={() => onSelect(i)}
            title={title}
            aria-label={title}
          >
            <span className={`sim3d-chip-dot phase-${s.phase ?? 'transform'}`} />
            <span className="sim3d-chip-num">{i + 1}</span>
          </button>
        )
      })}
    </div>
  )
}
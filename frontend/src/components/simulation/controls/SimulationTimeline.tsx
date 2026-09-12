import { useI18n } from '../../../i18n'
import { interpolate, type SimStage } from '../simulationTypes'

export function SimulationTimeline({
  stages,
  active,
  onSelect,
}: {
  stages: SimStage[]
  active: number
  onSelect: (i: number) => void
}) {
  const { t } = useI18n()
  const last = stages.length - 1
  return (
    <div className="lab-timeline" role="tablist" aria-label={t('simulation.controls.timeline')}>
      <span
        className="lab-timeline-progress"
        aria-hidden="true"
        style={{ width: last > 0 ? `${(active / last) * 100}%` : '0%' }}
      />
      {stages.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={`lab-chip${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
          onClick={() => onSelect(i)}
          title={interpolate(t(s.titleKey), s.titleArgs)}
          aria-label={interpolate(t(s.titleKey), s.titleArgs)}
        >
          <span className={`lab-chip-dot phase-${s.phase ?? 'transform'}`} />
          <span className="lab-chip-num">{i + 1}</span>
        </button>
      ))}
    </div>
  )
}
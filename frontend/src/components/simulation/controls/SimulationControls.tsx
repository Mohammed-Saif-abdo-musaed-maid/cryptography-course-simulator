import { useI18n } from '../../../i18n'

export interface SimulationControlProps {
  playing: boolean
  atStart: boolean
  atEnd: boolean
  speed: 1 | 2 | 3
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
  onRestart: () => void
  onSpeed: (s: 1 | 2 | 3) => void
}

export function SimulationControls({
  playing,
  atStart,
  atEnd,
  speed,
  onPlayPause,
  onPrev,
  onNext,
  onRestart,
  onSpeed,
}: SimulationControlProps) {
  const { t } = useI18n()
  const label = (k: string) => t(`simulation.controls.${k}`)
  return (
    <div className="lab-controls" dir="ltr">
      <div className="lab-controls-primary">
        <button
          type="button"
          className="lab-btn lab-btn-icon"
          onClick={onRestart}
          title={label('restart')}
          aria-label={label('restart')}
        >
          ↺
        </button>
        <button
          type="button"
          className="lab-btn lab-btn-icon"
          onClick={onPrev}
          disabled={atStart}
          title={label('prev')}
          aria-label={label('prev')}
        >
          ‹
        </button>
        <button
          type="button"
          className="lab-btn lab-btn-play"
          onClick={onPlayPause}
          aria-label={playing ? label('pause') : label('play')}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button
          type="button"
          className="lab-btn lab-btn-icon"
          onClick={onNext}
          disabled={atEnd}
          title={label('next')}
          aria-label={label('next')}
        >
          ›
        </button>
      </div>
      <div className="lab-controls-speed" role="group" aria-label={label('speed')}>
        {([1, 2, 3] as const).map((v) => (
          <button
            key={v}
            type="button"
            className={`lab-btn lab-btn-seg${speed === v ? ' is-active' : ''}`}
            onClick={() => onSpeed(v)}
          >
            {label(v === 1 ? 'slow' : v === 2 ? 'normal' : 'fast')}
          </button>
        ))}
      </div>
    </div>
  )
}
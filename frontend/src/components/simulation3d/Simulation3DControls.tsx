import { PLAYBACK_SPEEDS, type PlaybackSpeed } from './hooks/useAnimationPlayback'

interface Simulation3DControlsProps {
  playing: boolean
  atStart: boolean
  atEnd: boolean
  speed: PlaybackSpeed
  t: (key: string) => string
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
  onRestart: () => void
  onSpeed: (s: PlaybackSpeed) => void
  onResetCamera: () => void
  onFullscreen: () => void
}

export function Simulation3DControls({
  playing,
  atStart,
  atEnd,
  speed,
  t,
  onPlayPause,
  onPrev,
  onNext,
  onRestart,
  onSpeed,
  onResetCamera,
  onFullscreen,
}: Simulation3DControlsProps) {
  return (
    <div className="sim3d-controls">
      <div className="lab-controls">
        <div className="lab-controls-primary">
          <button
            type="button"
            className="lab-btn lab-btn-icon"
            onClick={onRestart}
            disabled={atStart && !playing}
            title={t('simulation3d.common.restart')}
            aria-label={t('simulation3d.common.restart')}
          >
            ↺
          </button>
          <button
            type="button"
            className="lab-btn lab-btn-icon"
            onClick={onPrev}
            disabled={atStart}
            title={t('simulation3d.common.prev')}
            aria-label={t('simulation3d.common.prev')}
          >
            ‹
          </button>
          <button
            type="button"
            className="lab-btn lab-btn-play"
            onClick={onPlayPause}
            title={playing ? t('simulation3d.common.pause') : t('simulation3d.common.play')}
            aria-label={playing ? t('simulation3d.common.pause') : t('simulation3d.common.play')}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            className="lab-btn lab-btn-icon"
            onClick={onNext}
            disabled={atEnd}
            title={t('simulation3d.common.next')}
            aria-label={t('simulation3d.common.next')}
          >
            ›
          </button>
        </div>

        <div className="lab-controls-speed" role="group" aria-label={t('simulation3d.common.speed')}>
          {PLAYBACK_SPEEDS.map((v) => (
            <button
              key={v}
              type="button"
              className={`lab-btn lab-btn-seg${speed === v ? ' is-active' : ''}`}
              onClick={() => onSpeed(v)}
              title={`${v}×`}
            >
              {v}×
            </button>
          ))}
        </div>

        <button
          type="button"
          className="lab-btn sim3d-camera-btn"
          onClick={onResetCamera}
          title={t('simulation3d.common.cameraReset')}
        >
          {t('simulation3d.common.cameraReset')}
        </button>

        <button
          type="button"
          className="lab-btn sim3d-camera-btn"
          onClick={onFullscreen}
          title={t('simulation3d.common.fullscreen')}
          aria-label={t('simulation3d.common.fullscreen')}
        >
          ⛶
        </button>
      </div>
    </div>
  )
}
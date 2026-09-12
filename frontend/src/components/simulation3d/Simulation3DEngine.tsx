import { useCallback, useEffect, useMemo, useRef } from 'react'
import type {
  Simulation3DAdapter,
  Simulation3DCanvasHandle,
  Simulation3DContext,
} from './types/simulation3d'
import { Simulation3DCanvas } from './Simulation3DCanvas'
import { Simulation3DControls } from './Simulation3DControls'
import { Simulation3DTimeline } from './Simulation3DTimeline'
import { Simulation3DStepPanel } from './Simulation3DStepPanel'
import { Simulation3DLegend } from './Simulation3DLegend'
import { Simulation3DStatus } from './Simulation3DStatus'
import { useAnimationPlayback } from './hooks/useAnimationPlayback'
import type { PlaybackSpeed } from './hooks/useAnimationPlayback'

export function Simulation3DEngine({
  adapter,
  ctx,
}: {
  adapter: Simulation3DAdapter
  ctx: Simulation3DContext
}) {
  const { t } = ctx
  const steps = useMemo(() => adapter.buildSteps(ctx), [adapter, ctx])
  const canvasRef = useRef<Simulation3DCanvasHandle | null>(null)

  const playback = useAnimationPlayback(steps, canvasRef)
  const {
    step,
    playing,
    speed,
    failed,
    atStart,
    atEnd,
    setReady,
    setFailed,
    togglePlay,
    prev,
    next,
    restart,
    goto,
  } = playback

  const current = steps[Math.min(step, Math.max(0, steps.length - 1))]
  const phaseLabel = t(`simulation.phase.${current?.phase ?? 'transform'}`)

  const onResetCamera = useCallback(() => playback.resetCamera(), [playback])
  const onSpeed = useCallback((s: PlaybackSpeed) => playback.setSpeed(s), [playback])
  const onFullscreen = useCallback(() => canvasRef.current?.toggleFullscreen(), [])

  // Keyboard shortcuts for the 3D player.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'R' && e.shiftKey) {
        restart()
      } else if (e.key === 'f' || e.key === 'F') {
        canvasRef.current?.toggleFullscreen()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [togglePlay, prev, next, restart])

  const legend = useMemo(() => adapter.getLegend?.(ctx) ?? [], [adapter, ctx])

  if (failed || steps.length === 0) {
    return (
      <div className="lab-root sim3d-root">
        <div className="sim3d-fallback">
          <p className="lab-note">{t('simulation3d.common.webglUnsupported')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lab-root sim3d-root">
      <header className="lab-header">
        <div className="lab-header-main">
          <h3 className="lab-name">{t(adapter.nameKey)}</h3>
          <div className="lab-tags">
            <span className={`lab-badge lab-phase-badge phase-${current?.phase ?? 'transform'}`}>
              {phaseLabel}
            </span>
            {adapter.educationalKey && (
              <span className="lab-badge lab-edu-badge">{t('simulation3d.common.educational')}</span>
            )}
            {ctx.demo && <span className="lab-badge lab-demo-badge">{t('simulation3d.common.demo')}</span>}
          </div>
        </div>
        <div className="lab-counter mono" dir="ltr">
          {step + 1} / {steps.length}
        </div>
      </header>

      <Simulation3DTimeline steps={steps} active={step} dir={ctx.dir} t={t} onSelect={goto} />

      <Simulation3DControls
        playing={playing}
        atStart={atStart}
        atEnd={atEnd}
        speed={speed}
        t={t}
        onPlayPause={togglePlay}
        onPrev={prev}
        onNext={next}
        onRestart={restart}
        onSpeed={onSpeed}
        onResetCamera={onResetCamera}
        onFullscreen={onFullscreen}
      />

      <div className="lab-body sim3d-body">
        <main className="lab-main sim3d-main">
          <Simulation3DCanvas
            ref={canvasRef}
            defaultCamera={adapter.defaultCamera}
            theme={ctx.theme}
            onReady={setReady}
            onFail={setFailed}
          />
          <Simulation3DLegend entries={legend} t={t} />
          <Simulation3DStatus t={t} />
        </main>
        <Simulation3DStepPanel steps={steps} step={step} ctx={ctx} />
      </div>
    </div>
  )
}
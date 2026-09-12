import { useEffect, useMemo, useRef, useState } from 'react'
import type { SimulationContext, SimulationEngine, SimStage } from './simulationTypes'
import { interpolate } from './simulationTypes'
import { SimulationControls } from './controls/SimulationControls'
import { SimulationTimeline } from './controls/SimulationTimeline'
import { DataBlock } from './common/DataBlock'

const SPEED_MS: Record<1 | 2 | 3, number> = { 1: 1000, 2: 450, 3: 160 }

export function SimulationEngine({
  engine,
  ctx,
}: {
  engine: SimulationEngine
  ctx: SimulationContext
}) {
  const stages = useMemo(() => engine.build(ctx), [engine, ctx])
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<1 | 2 | 3>(2)
  const lastId = useRef<string | null>(null)

  useEffect(() => {
    if (lastId.current !== engine.id) {
      lastId.current = engine.id
      setStep(0)
      setPlaying(false)
    } else if (step >= stages.length) {
      setStep(stages.length - 1)
    }
  }, [engine.id, stages.length, step])

  const atEnd = step >= stages.length - 1

  useEffect(() => {
    if (!playing || atEnd) {
      if (playing && atEnd) setPlaying(false)
      return
    }
    const t = window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, stages.length - 1))
    }, SPEED_MS[speed])
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, stages.length, speed])

  const goto = (i: number) => {
    setStep(Math.max(0, Math.min(i, stages.length - 1)))
    setPlaying(false)
  }
  const togglePlay = () => {
    if (playing) {
      setPlaying(false)
      return
    }
    if (atEnd) setStep(0)
    setPlaying(true)
  }

  const current: SimStage = stages[Math.min(step, stages.length - 1)] ?? stages[0]
  const t = ctx.t
  const phaseLabel = t(`simulation.phase.${current.phase ?? 'transform'}`)

  return (
    <div className="lab-root">
      <header className="lab-header">
        <div className="lab-header-main">
          <h3 className="lab-name">{t(engine.nameKey)}</h3>
          <div className="lab-tags">
            <span className={`lab-badge lab-phase-badge phase-${current.phase ?? 'transform'}`}>
              {phaseLabel}
            </span>
            {engine.educationalKey && <span className="lab-badge lab-edu-badge">{t('simulation.common.educational')}</span>}
            {ctx.demo && <span className="lab-badge lab-demo-badge">{t('simulation.common.demo')}</span>}
          </div>
        </div>
        <div className="lab-counter mono" dir="ltr">
          {step + 1} / {stages.length}
        </div>
      </header>

      <SimulationTimeline stages={stages} active={step} onSelect={goto} />

      <SimulationControls
        playing={playing}
        atStart={step === 0}
        atEnd={atEnd}
        speed={speed}
        onPlayPause={togglePlay}
        onPrev={() => goto(step - 1)}
        onNext={() => goto(step + 1)}
        onRestart={() => {
          setStep(0)
          setPlaying(false)
        }}
        onSpeed={setSpeed}
      />

      <div className="lab-body">
        <main className="lab-main">
          <engine.View view={current.view} ctx={ctx} />
        </main>
        <aside className="lab-side">
          <h4 className="lab-stage-title">{interpolate(t(current.titleKey), current.titleArgs)}</h4>
          <p className="lab-stage-desc">{interpolate(t(current.descKey), current.descArgs)}</p>

          {engine.educationalKey && <p className="lab-note">{t(engine.educationalKey)}</p>}

          <div className="lab-side-blocks">
            {ctx.demo && (
              <DataBlock
                label={t('simulation.common.demoInput')}
                value={String(ctx.inputs._demo ?? '')}
                tone="input"
              />
            )}
            {ctx.result && ctx.resultMatches && (
              <DataBlock
                label={t('simulation.common.executedResult')}
                value={
                  typeof ctx.result.result === 'string' || typeof ctx.result.result === 'number'
                    ? String(ctx.result.result)
                    : ''
                }
                tone="output"
              />
            )}
            {ctx.result && !ctx.resultMatches && (
              <p className="lab-note lab-warn">{t('simulation.common.staleResult')}</p>
            )}
            {!ctx.result && <p className="lab-note">{t('simulation.common.runHint')}</p>}
          </div>
        </aside>
      </div>
    </div>
  )
}
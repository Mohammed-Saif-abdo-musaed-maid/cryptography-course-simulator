import { interpolate } from '../simulation/simulationTypes'
import type { Simulation3DStep, Simulation3DStepMeta } from './types/simulation3d'
import { DataBlock } from '../simulation/common/DataBlock'
import type { Simulation3DContext } from './types/simulation3d'

interface Simulation3DStepPanelProps {
  steps: Simulation3DStep[]
  step: number
  ctx: Simulation3DContext
}

/**
 * HTML panel outside the WebGL canvas. Holds the localised educational text —
 * nothing but short glyph labels is ever rendered inside the 3D scene, so
 * Arabic shaping and RTL stay clean in the DOM.
 *
 * When a step carries `meta` (semantic event model) the Inspector renders it
 * with progressive disclosure: value changes are always visible, the full
 * before/after state is collapsed.
 */
export function Simulation3DStepPanel({ steps, step, ctx }: Simulation3DStepPanelProps) {
  const current = steps[Math.min(step, steps.length - 1)]
  if (!current) return null
  const { t } = ctx
  const title = interpolate(t(current.titleKey), current.titleArgs)
  const desc = interpolate(t(current.descKey), current.descArgs)
  const meta = current.meta

  return (
    <aside className="sim3d-panel">
      <div className="sim3d-panel-kicker">
        <span>{t('simulation3d.common.currentStep')}</span>
        <span className="sim3d-panel-count mono" dir="ltr">
          {step + 1} / {steps.length}
        </span>
      </div>
      <h4 className="sim3d-panel-title">{title}</h4>
      <p className="sim3d-panel-label">{t('simulation3d.common.happeningNow')}</p>
      <p className="sim3d-panel-desc">{desc}</p>

      {meta && <StepMeta meta={meta} t={t} />}

      {ctx.result && ctx.resultMatches && (
        <DataBlock
          label={t('simulation3d.common.executedResult')}
          value={
            typeof ctx.result.result === 'string' || typeof ctx.result.result === 'number'
              ? String(ctx.result.result)
              : ''
          }
          tone="output"
        />
      )}
      {ctx.demo && (
        <DataBlock
          label={t('simulation3d.common.demoInput')}
          value={String(ctx.inputs._demo ?? '')}
          tone="input"
        />
      )}
      {ctx.result && !ctx.resultMatches && (
        <p className="lab-note lab-warn">{t('simulation3d.common.staleResult')}</p>
      )}
      {!ctx.result && <p className="lab-note">{t('simulation3d.common.runHint')}</p>}
    </aside>
  )
}

function StepMeta({ meta, t }: { meta: Simulation3DStepMeta; t: (key: string) => string }) {
  return (
    <div className="sim3d-inspector">
      {(meta.event || meta.operation) && (
        <div className="sim3d-inspector-row">
          {meta.event && (
            <span className={`sim3d-event sim3d-event-${String(meta.event).toLowerCase()}`}>
              {meta.event.replace(/_/g, ' ')}
            </span>
          )}
          {meta.operation && (
            <span className="sim3d-op">{t('simulation3d.inspector.operation')}: {meta.operation}</span>
          )}
          {meta.level && (
            <span className="sim3d-level">· {t(`simulation3d.level.${meta.level}`)}</span>
          )}
        </div>
      )}

      {meta.formula && (
        <div className="sim3d-inspector-formula mono" dir="ltr">
          {meta.formula}
        </div>
      )}

      {meta.changedValues && meta.changedValues.length > 0 && (
        <div className="sim3d-changes">
          <div className="sim3d-inspector-label">{t('simulation3d.inspector.changes')}</div>
          <table className="sim3d-changes-table">
            <tbody>
              {meta.changedValues.map((c, i) => (
                <tr key={`${c.entity}-${i}`}>
                  <td className="sim3d-entity mono" dir="ltr">{c.entity}</td>
                  <td className="sim3d-before mono" dir="ltr">{c.before}</td>
                  <td className="sim3d-arrow" aria-hidden="true">→</td>
                  <td className="sim3d-after mono" dir="ltr">{c.after}</td>
                  {c.reason && (
                    <td className="sim3d-reason mono" dir="ltr">{c.reason}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.inputs && Object.keys(meta.inputs).length > 0 && (
        <div className="sim3d-inspector-section">
          <div className="sim3d-inspector-label">{t('simulation3d.inspector.inputs')}</div>
          <KvGrid data={meta.inputs} />
        </div>
      )}

      {meta.outputs && Object.keys(meta.outputs).length > 0 && (
        <div className="sim3d-inspector-section">
          <div className="sim3d-inspector-label">{t('simulation3d.inspector.outputs')}</div>
          <KvGrid data={meta.outputs} />
        </div>
      )}

      {(meta.stateBefore || meta.stateAfter) && (
        <details className="sim3d-inspector-state">
          <summary className="sim3d-inspector-label">
            {t('simulation3d.inspector.stateToggle')}
          </summary>
          <div className="sim3d-inspector-state-grid">
            {meta.stateBefore && (
              <div className="sim3d-state-col">
                <div className="sim3d-state-cap">{t('simulation3d.inspector.stateBefore')}</div>
                <KvGrid data={meta.stateBefore} />
              </div>
            )}
            {meta.stateAfter && (
              <div className="sim3d-state-col">
                <div className="sim3d-state-cap">{t('simulation3d.inspector.stateAfter')}</div>
                <KvGrid data={meta.stateAfter} />
              </div>
            )}
          </div>
        </details>
      )}

      {meta.why && <p className="sim3d-inspector-why">{meta.why}</p>}
    </div>
  )
}

function KvGrid({ data }: { data: Record<string, string> }) {
  return (
    <div className="sim3d-kv">
      {Object.entries(data).map(([k, v]) => (
        <div className="sim3d-kv-item" key={k}>
          <span className="sim3d-kv-key mono" dir="ltr">{k}</span>
          <span className="sim3d-kv-val mono" dir="ltr">{v}</span>
        </div>
      ))}
    </div>
  )
}
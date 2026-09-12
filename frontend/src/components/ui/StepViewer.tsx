import type { ReactNode } from 'react'
import type { StepDetail } from '../../types'
import { CipherGrid, MatrixViewer } from './MatrixViewer'

function renderDetailValue(value: unknown, depth = 0): ReactNode {
  if (Array.isArray(value)) {
    if (value.every((v) => Array.isArray(v))) {
      return (
        <div style={{ marginTop: 8 }}>
          <MatrixViewer matrix={value as (string | number)[][]} />
        </div>
      )
    }
    if (value.every((v) => typeof v === 'string')) {
      return <CipherGrid text={(value as string[]).join('')} />
    }
    return <code className="mono" style={{ fontSize: 'var(--fs-sm)' }}>{JSON.stringify(value)}</code>
  }
  if (value && typeof value === 'object') {
    if (depth > 2) return <code className="mono">{JSON.stringify(value)}</code>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} style={{ fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--text-faint)', marginInlineEnd: 8 }}>{k}:</span>
            <span className="mono" style={{ color: 'var(--text-strong)' }}>
              {typeof v === 'string' || typeof v === 'number' ? (
                <span dir="ltr">{v}</span>
              ) : (
                renderDetailValue(v, depth + 1)
              )}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return <code className="mono" style={{ fontSize: 'var(--fs-sm)' }}>{String(value)}</code>
}

export function StepViewer({ steps }: { steps: StepDetail[] }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="step-list">
      {steps.map((step) => (
        <div key={step.step} className="step-item">
          <div className="step-rail" aria-hidden="true" />
          <div className="step-head">
            <span className="step-badge">{step.step}</span>
            <div>
              <p className="step-title">{step.title}</p>
              {step.description && <p className="step-desc">{step.description}</p>}
            </div>
          </div>
          {(step.input !== undefined || step.output !== undefined) && (
            <div className="step-io">
              {step.input !== undefined && (
                <div className="io-box">
                  <p className="io-label">Input</p>
                  <div className="io-value">{step.input}</div>
                </div>
              )}
              {step.output !== undefined && (
                <div className="io-box">
                  <p className="io-label">Output</p>
                  <div className="io-value">{step.output}</div>
                </div>
              )}
            </div>
          )}
          {step.detail ? (
            <div style={{ marginTop: 12 }}>{renderDetailValue(step.detail)}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
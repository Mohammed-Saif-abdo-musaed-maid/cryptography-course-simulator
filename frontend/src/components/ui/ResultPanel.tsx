import type { AlgorithmResult } from '../../types'
import { useI18n } from '../../i18n'
import { Alert } from './Alert'
import { CopyButton } from './CodeBlock'
import { StepViewer } from './StepViewer'
import { MatrixViewer } from './MatrixViewer'

function ResultValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span style={{ color: 'var(--text-faint)' }}>—</span>
  if (typeof value === 'object') {
    if (Array.isArray(value) && value.every((v) => Array.isArray(v))) {
      return <MatrixViewer matrix={value as (string | number)[][]} />
    }
    if (Array.isArray(value)) {
      return <code className="mono">{value.join(' ')}</code>
    }
    return (
      <div className="ltr-content" dir="ltr">
        <CodeValue value={value as Record<string, unknown>} />
      </div>
    )
  }
  return <strong className="mono" dir="ltr">{String(value)}</strong>
}

function CodeValue({ value }: { value: Record<string, unknown> }) {
  const entries = Object.entries(value)
  if (entries.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {entries.map(([k, v]) => (
        <div key={k}>
          <span style={{ color: 'var(--text-faint)', marginInlineEnd: 6 }}>{k}:</span>
          <span className="mono" dir="ltr">{String(v)}</span>
        </div>
      ))}
    </div>
  )
}

export function ResultPanel({ data, error }: { data?: AlgorithmResult | null; error?: string | null }) {
  const { t } = useI18n()

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }
  if (!data) {
    return (
      <div className="empty-state" style={{ marginTop: 8 }}>
        {t('simulator.noResultYet')}
      </div>
    )
  }

  const operationKey =
    data.operation === 'encrypt'
      ? 'simulator.encrypted'
      : data.operation === 'decrypt'
        ? 'simulator.decrypted'
        : data.operation === 'hash'
          ? 'simulator.hashed'
          : data.operation

  const extraEntries =
    data.extra && typeof data.extra === 'object'
      ? Object.entries(data.extra).filter(
          ([k, v]) =>
            v !== null &&
            v !== undefined &&
            k !== 'security_notes' &&
            typeof v !== 'object',
        )
      : []

  return (
    <div>
      <Alert variant="success">
        <strong>{typeof operationKey === 'string' ? operationKey : t('common.result')}</strong>
        {!data.extra?.not_reversible && (
          <span style={{ marginInlineStart: 10, opacity: 0.9 }}> · {t('simulator.validation')}</span>
        )}
      </Alert>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h4 className="card-title">{t('common.result')}</h4>
          <CopyButton text={typeof data.result === 'string' ? data.result : JSON.stringify(data.result)} />
        </div>
        <p className="io-value" style={{ margin: 0, fontSize: 'var(--fs-lg)' }}>
          <ResultValue value={data.result} />
        </p>

        {extraEntries.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {extraEntries.map(([k, v]) => (
                <div key={k}>
                  <p className="io-label" style={{ marginBottom: 3 }}>{k}</p>
                  <p className="io-value" style={{ margin: 0 }}>{String(v)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.steps && data.steps.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="card-title">{t('common.steps')}</h3>
          <div style={{ marginTop: 12 }}>
            <StepViewer steps={data.steps} />
          </div>
        </div>
      )}
    </div>
  )
}
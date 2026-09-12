import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { api } from '../services/api'
import { ResultPanel } from '../components/ui/ResultPanel'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import type { AlgorithmResult } from '../types'
import { ApiClientError } from '../services/api'

interface ToolDef {
  id: string
  label: string
  fields: { name: string; label: string; default: string }[]
  icon: string
}

const TOOLS: ToolDef[] = [
  {
    id: 'modular',
    label: 'a + b, a − b, a × b  (mod m)',
    fields: [
      { name: 'a', label: 'a', default: '17' },
      { name: 'b', label: 'b', default: '9' },
      { name: 'modulus', label: 'modulus m', default: '5' },
    ],
    icon: '%',
  },
  {
    id: 'gcd',
    label: 'gcd(a, b)',
    fields: [
      { name: 'a', label: 'a', default: '270' },
      { name: 'b', label: 'b', default: '192' },
    ],
    icon: '≡',
  },
  {
    id: 'extended_euclid',
    label: 'Extended Euclidean (Bézout)',
    fields: [
      { name: 'a', label: 'a', default: '240' },
      { name: 'b', label: 'b', default: '46' },
    ],
    icon: '↔',
  },
  {
    id: 'mod_inverse',
    label: 'Modular inverse a⁻¹ mod m',
    fields: [
      { name: 'a', label: 'a', default: '3' },
      { name: 'modulus', label: 'modulus m', default: '11' },
    ],
    icon: '⁻¹',
  },
  {
    id: 'prime_check',
    label: 'Prime / composite test',
    fields: [{ name: 'n', label: 'n', default: '97' }],
    icon: '√',
  },
  {
    id: 'totient',
    label: "Euler's totient φ(n)",
    fields: [{ name: 'n', label: 'n', default: '36' }],
    icon: 'φ',
  },
  {
    id: 'mod_pow',
    label: 'Modular exponentiation bᵉ mod m',
    fields: [
      { name: 'base', label: 'base b', default: '4' },
      { name: 'exponent', label: 'exponent e', default: '13' },
      { name: 'modulus', label: 'modulus m', default: '497' },
    ],
    icon: '^',
  },
]

function getIdName(toolId: string): string {
  const map: Record<string, string> = {
    modular: 'modular',
    gcd: 'gcd',
    extended_euclid: 'extended-euclid',
    mod_inverse: 'modular-inverse',
    prime_check: 'prime-check',
    totient: 'totient',
    mod_pow: 'mod-pow',
  }
  return map[toolId] ?? toolId
}

export function Mathematics() {
  const { t } = useI18n()
  const [active, setActive] = useState<string>('modular')
  const [values, setValues] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AlgorithmResult | null>(null)

  const tool = useMemo(() => TOOLS.find((x) => x.id === active) ?? TOOLS[0], [active])

  const select = (id: string) => {
    setActive(id)
    setValues({})
    setResult(null)
    setError(null)
  }

  const run = async () => {
    const body: Record<string, unknown> = {}
    for (const f of tool.fields) {
      body[f.name] = Number(values[f.name] ?? f.default)
    }
    setRunning(true)
    setError(null)
    try {
      setResult(await api.math(getIdName(tool.id), body))
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : String(e))
      setResult(null)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.mathematics')} subtitle={t('math.subtitle')} />

      <div className="grid-3">
        {TOOLS.map((toolDef) => (
          <button
            key={toolDef.id}
            type="button"
            className={`card card-hover ${active === toolDef.id ? 'tool-active-card' : ''}`}
            style={{
              textAlign: 'start',
              cursor: 'pointer',
              border: active === toolDef.id ? '1px solid var(--primary)' : undefined,
              boxShadow: active === toolDef.id ? 'var(--glow-primary)' : undefined,
            }}
            onClick={() => select(toolDef.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--r-md)',
                  background: 'var(--info-soft)',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-fixed)',
                  fontSize: 'var(--fs-lg)',
                }}
              >
                {toolDef.icon}
              </span>
              <strong style={{ color: 'var(--text-strong)', fontSize: 'var(--fs-sm)' }}>
                {toolDef.label}
              </strong>
            </div>
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ marginBlockStart: 'var(--sp-6)' }}>
        <Card title={tool.label}>
          {tool.fields.map((f) => (
            <div className="field" key={f.name}>
              <label className="field-label">{f.label} *</label>
              <input
                className="input"
                type="number"
                value={values[f.name] ?? f.default}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                dir="ltr"
              />
            </div>
          ))}
          <Button variant="primary" block size="lg" disabled={running} onClick={run}>
            {running ? <Spinner label={t('common.loading')} /> : `▶ ${t('simulator.run')}`}
          </Button>
        </Card>
        <div className="card">
          <ResultPanel data={result} error={error} />
        </div>
      </div>
    </div>
  )
}
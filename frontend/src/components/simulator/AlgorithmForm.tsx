import { useEffect, useState } from 'react'
import type { AlgorithmField } from '../../types'
import { Field } from '../ui/Field'

interface Props {
  fields: AlgorithmField[]
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
  invalid?: (name: string) => boolean
}

function MatrixEditor({
  initial,
  onChange,
}: {
  initial: number[][]
  onChange: (m: number[][]) => void
}) {
  const [matrix, setMatrix] = useState<number[][]>(JSON.parse(JSON.stringify(initial)))

  useEffect(() => {
    setMatrix(JSON.parse(JSON.stringify(initial)))
  }, [initial])

  const update = (r: number, c: number, raw: string) => {
    const next = matrix.map((row, ri) =>
      ri === r ? row.map((cell, ci) => (ci === c ? Number(raw) || 0 : cell)) : row,
    )
    setMatrix(next)
    onChange(next)
  }

  return (
    <div>
      <div className="matrix-wrap" style={{ padding: 10 }}>
        {matrix.map((row, r) => (
          <div className="matrix-row" key={r}>
            {row.map((cell, c) => (
              <input
                key={c}
                type="number"
                value={cell}
                onChange={(e) => update(r, c, e.target.value)}
                aria-label={`matrix[${r}][${c}]`}
                style={{
                  width: 52,
                  height: 38,
                  textAlign: 'center',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text-strong)',
                  fontFamily: 'var(--font-fixed)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {[2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className="btn btn-sm"
            onClick={() => {
              const m = Array.from({ length: n }, (_, r) =>
                Array.from({ length: n }, (_, c) => (r === c ? 1 : 0)),
              )
              setMatrix(m)
              onChange(m)
            }}
          >
            {n}×{n}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AlgorithmForm({ fields, values, onChange, invalid }: Props) {
  const [initialBuilt, setInitialBuilt] = useState(false)

  useEffect(() => {
    if (initialBuilt) return
    const defaults: Record<string, unknown> = {}
    for (const f of fields) {
      if (f.default !== undefined && values[f.name] === undefined) {
        defaults[f.name] = f.default
      }
    }
    if (Object.keys(defaults).length > 0) {
      onChange({ ...values, ...defaults })
    }
    setInitialBuilt(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (name: string, v: unknown) => onChange({ ...values, [name]: v })

  return (
    <div>
      {fields.map((f) => {
        const value = values[f.name] ?? f.default ?? (f.type === 'number' ? '' : '')
        const isInvalid = invalid ? invalid(f.name) : false

        if (f.type === 'matrix' && Array.isArray(value)) {
          return (
            <Field key={f.name} label={f.label} required={f.required} invalid={isInvalid}>
              <MatrixEditor initial={value as number[][]} onChange={(m) => set(f.name, m)} />
            </Field>
          )
        }

        if (f.type === 'textarea') {
          return (
            <Field key={f.name} label={f.label} required={f.required} invalid={isInvalid}>
              <textarea
                className={`textarea ${isInvalid ? 'invalid' : ''}`}
                value={String(value ?? '')}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
              />
            </Field>
          )
        }

        if (f.type === 'number') {
          return (
            <Field key={f.name} label={f.label} required={f.required} invalid={isInvalid}>
              <input
                className={`input ${isInvalid ? 'invalid' : ''}`}
                type="number"
                value={typeof value === 'number' ? value : ''}
                min={f.min}
                max={f.max}
                onChange={(e) => set(f.name, Number(e.target.value))}
              />
            </Field>
          )
        }

        if (f.type === 'select') {
          return (
            <Field key={f.name} label={f.label} required={f.required} invalid={isInvalid}>
              <select
                className="select"
                value={String(value ?? f.default ?? '')}
                onChange={(e) => set(f.name, e.target.value)}
              >
                {(f.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
          )
        }

        return (
          <Field key={f.name} label={f.label} required={f.required} invalid={isInvalid}>
            <input
              className={`input ${isInvalid ? 'invalid' : ''}`}
              type="text"
              value={String(value ?? '')}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, e.target.value)}
              dir="ltr"
            />
          </Field>
        )
      })}
    </div>
  )
}
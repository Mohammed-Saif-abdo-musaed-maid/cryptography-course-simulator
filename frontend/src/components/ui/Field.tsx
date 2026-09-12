import { useId } from 'react'
import type { ReactNode } from 'react'

export function Field({
  label,
  hint,
  required,
  invalid,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  required?: boolean
  invalid?: boolean
  children: ReactNode
}) {
  const id = useId()
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <div className={invalid ? 'field-invalid' : undefined}>{children}</div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  )
}
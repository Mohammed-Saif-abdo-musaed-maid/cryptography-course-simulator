import type { ReactNode } from 'react'

export function Alert({
  variant,
  children,
}: {
  variant: 'error' | 'info' | 'warning' | 'success'
  children: ReactNode
}) {
  return <div className={`alert alert-${variant}`}>{children}</div>
}
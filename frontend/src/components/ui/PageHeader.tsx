import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header style={{ marginBottom: 'var(--sp-6)' }} className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="section-sub" style={{ maxWidth: 720 }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
      </div>
    </header>
  )
}

export function StatCard({
  label,
  value,
  icon,
}: {
  label: ReactNode
  value: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="card" style={{ padding: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && (
          <span
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-md)',
              background: 'var(--info-soft)',
              color: 'var(--primary)',
              fontSize: 'var(--fs-xl)',
            }}
          >
            {icon}
          </span>
        )}
        <div>
          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </div>
  )
}
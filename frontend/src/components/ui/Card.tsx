import type { ReactNode } from 'react'

interface CardProps {
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  actions?: ReactNode
  hoverable?: boolean
  className?: string
}

export function Card({ title, subtitle, children, actions, hoverable, className = '' }: CardProps) {
  const classes = ['card', hoverable ? 'card-hover' : '', className].filter(Boolean).join(' ')
  return (
    <section className={classes}>
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-sub">{subtitle}</p>}
      {actions}
      {children}
    </section>
  )
}
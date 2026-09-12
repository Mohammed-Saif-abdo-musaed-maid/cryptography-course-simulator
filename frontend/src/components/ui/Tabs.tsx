import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: ReactNode
  badge?: string
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <nav className="tabs" role="tablist" aria-label="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`tab ${active === tab.id ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.badge ? (
            <span className="badge badge-secure" style={{ marginInlineStart: 6 }}>
              {tab.badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  )
}
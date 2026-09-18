export function DataBlock({
  label,
  value,
  tone,
  big,
}: {
  label?: string
  value: string
  tone?: 'input' | 'key' | 'internal' | 'output' | 'transform' | 'muted' | 'error'
  big?: boolean
}) {
  return (
    <div className={`lab-data-block${tone ? ` tone-${tone}` : ''}`}>
      {label && <span className="lab-data-label">{label}</span>}
      <span className={`lab-data-value mono${big ? ' lab-data-big' : ''}`} dir="ltr">
        {value}
      </span>
    </div>
  )
}
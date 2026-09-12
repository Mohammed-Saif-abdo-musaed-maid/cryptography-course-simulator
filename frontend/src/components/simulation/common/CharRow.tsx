import type { CellTone, CharCell } from '../simulationTypes'

export type CellSize = 'sm' | 'md' | 'lg'

export function Cell({ cell, size }: { cell: CharCell; size?: CellSize }) {
  const tone = cell.tone === 'active' ? `tone-active` : `tone-${cell.tone}`
  return (
    <span className={`lab-cell ${tone}${size ? ` lab-cell-${size}` : ''}`} title={cell.note}>
      {cell.ch}
    </span>
  )
}

export function CharRow({
  cells,
  size,
  label,
}: {
  cells: CharCell[]
  size?: CellSize
  label?: string
}) {
  return (
    <div className="lab-crow">
      {label && <span className="lab-crow-label mono">{label}</span>}
      <div className="lab-crow-cells" dir="ltr">
        {cells.map((c, i) => (
          <Cell key={i} cell={c} size={size} />
        ))}
      </div>
    </div>
  )
}

export function toneClass(tone: CellTone): string {
  return tone === 'active' ? 'tone-active' : `tone-${tone}`
}

export function toneToCell(value: string, tone: CellTone): CharCell {
  return { ch: value, tone }
}

export function CharRows({
  rows,
  size,
}: {
  rows: Array<{ label?: string; cells: CharCell[] }>
  size?: CellSize
}) {
  return (
    <div className="lab-rows">
      {rows.map((r, i) => (
        <CharRow key={i} label={r.label} cells={r.cells} size={size} />
      ))}
    </div>
  )
}
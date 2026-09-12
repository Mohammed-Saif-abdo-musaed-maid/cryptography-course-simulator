import type { CellTone } from '../simulationTypes'

export function FlowArrow({ op }: { op?: string }) {
  return (
    <div className="lab-arrow-wrap">
      <div className="lab-flow-arrow" aria-hidden="true">
        <span className="lab-flow-line" />
        <span className="lab-flow-head" />
      </div>
      {op && (
        <div className="lab-flow-op mono" dir="ltr">
          {op}
        </div>
      )}
    </div>
  )
}

export function MatrixGrid({
  matrix,
  highlight,
  tone = 'internal',
}: {
  matrix: (string | number)[][]
  highlight?: Array<[number, number]>
  tone?: CellTone
}) {
  const hs = new Set((highlight ?? []).map(([r, c]) => `${r},${c}`))
  return (
    <div className="lab-matrix" dir="ltr">
      {matrix.map((row, r) => (
        <div className="lab-matrix-row" key={r}>
          {row.map((cell, c) => (
            <span
              key={c}
              className={`lab-matrix-cell ${hs.has(`${r},${c}`) ? 'tone-active' : `tone-${tone}`}`}
              dir="ltr"
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
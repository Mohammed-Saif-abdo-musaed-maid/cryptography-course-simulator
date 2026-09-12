interface MatrixViewerProps {
  matrix: (string | number)[][] | undefined | null
  title?: string
  highlight?: { row: number; col: number } | null
}

export function MatrixViewer({ matrix, title, highlight }: MatrixViewerProps) {
  if (!matrix || matrix.length === 0) return null

  return (
    <div>
      {title && <div className="io-label" style={{ marginBottom: 6 }}>{title}</div>}
      <div className="matrix-wrap">
        {matrix.map((row, r) => (
          <div className="matrix-row" key={r}>
            {row.map((cell, c) => {
              const isHit = highlight && highlight.row === r && highlight.col === c
              return (
                <span key={c} className={`matrix-cell ${isHit ? 'highlight' : ''}`}>
                  {cell}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CipherGrid({ text, title }: { text: string; title?: string }) {
  if (!text) return null
  return (
    <div>
      {title && <div className="io-label" style={{ marginBottom: 6 }}>{title}</div>}
      <div className="matrix-wrap">
        <div className="matrix-row">
          {text.split('').map((ch, i) => (
            <span key={i} className="matrix-cell">
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
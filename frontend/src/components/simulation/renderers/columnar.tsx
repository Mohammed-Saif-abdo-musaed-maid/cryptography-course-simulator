import type { SimulationContext, SimulationEngine, SimView } from '../simulationTypes'
import { columnarEncrypt, columnarDecrypt, columnOrder } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'columnar'

export const columnarEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.columnar.name',
  demoInputs: { text: 'HELLOWORLD', key: 'ZEBRA' },
  build(ctx) {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const key = String(ctx.inputs.key ?? 'ZEBRA')
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '')
    const order = columnOrder(keyUpper)

    if (decrypt) {
      const { plaintext } = columnarDecrypt(text, keyUpper)

      const cols = keyUpper.length
      const rowsCount = Math.ceil(text.length / cols)
      const padded = rowsCount * cols - text.length
      const colLengths = Array(cols).fill(rowsCount)
      let pad = padded
      for (let i = order.length - 1; i >= 0 && pad > 0; i--) {
        colLengths[order[i]] -= 1
        pad -= 1
      }
      const colTexts: string[] = []
      let pos = 0
      for (let c = 0; c < cols; c++) {
        colTexts.push(text.slice(pos, pos + colLengths[c]))
        pos += colLengths[c]
      }
      const grid: string[][] = []
      for (let r = 0; r < rowsCount; r++) {
        const row: string[] = []
        for (let c = 0; c < cols; c++) row.push(r < colTexts[c].length ? colTexts[c][r] : '.')
        grid.push(row)
      }

      return [
        {
          id: `${id}-key`,
          titleKey: 'simulation.columnar.key.title',
          descKey: 'simulation.columnar.key.desc',
          phase: 'key',
          view: { kind: 'col-key', key: keyUpper, order },
        },
        {
          id: `${id}-split`,
          titleKey: 'simulation.columnar.split.title',
          descKey: 'simulation.columnar.split.desc',
          phase: 'input',
          view: { kind: 'col-split', key: keyUpper, order, colTexts, colLengths },
        },
        {
          id: `${id}-rebuild`,
          titleKey: 'simulation.columnar.rebuild.title',
          descKey: 'simulation.columnar.rebuild.desc',
          phase: 'transform',
          view: { kind: 'col-rebuild', key: keyUpper, order, grid },
        },
        {
          id: `${id}-result`,
          titleKey: 'simulation.columnar.result.dTitle',
          descKey: 'simulation.columnar.result.dDesc',
          phase: 'output',
          view: { kind: 'result', text: plaintext },
        },
      ]
    }

    const { rows, cols, order: encOrder, columnTexts, ciphertext } = columnarEncrypt(text, keyUpper)

    const gridDisplay = rows.map((row) => row.map((c) => c || '.'))

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.columnar.key.title',
        descKey: 'simulation.columnar.key.desc',
        phase: 'key',
        view: { kind: 'col-key', key: keyUpper, order: encOrder },
      },
      {
        id: `${id}-grid`,
        titleKey: 'simulation.columnar.grid.title',
        descKey: 'simulation.columnar.grid.desc',
        descArgs: { cols: String(cols), rows: String(rows.length) },
        phase: 'input',
        view: { kind: 'col-grid', grid: gridDisplay, key: keyUpper },
      },
      {
        id: `${id}-read`,
        titleKey: 'simulation.columnar.read.title',
        descKey: 'simulation.columnar.read.desc',
        phase: 'transform',
        view: { kind: 'col-read', columnTexts, order: encOrder, key: keyUpper },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.columnar.result.title',
        descKey: 'simulation.columnar.result.desc',
        phase: 'output',
        view: { kind: 'result', text: ciphertext },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'col-key': {
        const key = String(view.key)
        const order = view.order as number[]
        return (
          <div className="lab-stage-view">
            <DataBlock label="key" value={key} tone="key" big />
            <DataBlock label="order" value={order.join(', ')} tone="internal" />
          </div>
        )
      }
      case 'col-grid': {
        const grid = view.grid as string[][]
        const key = String(view.key)
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} tone="internal" />
            <div className="lab-rail" dir="ltr">
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">K</span>
                {key.split('').map((ch, i) => (
                  <span key={i} className="lab-cell lab-cell-sm tone-key">{ch}</span>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case 'col-read': {
        const columnTexts = view.columnTexts as string[]
        const order = view.order as number[]
        const key = String(view.key)
        return (
          <div className="lab-stage-view">
            <CharRows rows={order.map((c) => ({
              label: `${key[c]}(${c})`,
              cells: columnTexts[c].split('').map((ch) => ({
                ch,
                tone: 'transform' as const,
              })),
            }))} />
          </div>
        )
      }
      case 'col-split': {
        const key = String(view.key)
        const order = view.order as number[]
        const colTexts = view.colTexts as string[]
        const colLengths = view.colLengths as number[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={order.map((c) => ({
              label: `${key[c]}(${c}) len ${colLengths[c]}`,
              cells: colTexts[c].split('').map((ch) => ({
                ch,
                tone: 'transform' as const,
              })),
            }))} />
          </div>
        )
      }
      case 'col-rebuild': {
        const key = String(view.key)
        const grid = view.grid as string[][]
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} tone="internal" />
            <div className="lab-rail" dir="ltr">
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">K</span>
                {key.split('').map((ch, i) => (
                  <span key={i} className="lab-cell lab-cell-sm tone-key">{ch}</span>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case 'result': {
        return (
          <div className="lab-stage-view">
            <FlowArrow />
            <DataBlock label="result" value={String(view.text)} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}
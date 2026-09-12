import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { railFenceEncrypt, railFenceDecrypt } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'rail_fence'

export const railFenceEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.rail_fence.name',
  demoInputs: { text: 'HELLOWORLD', rails: 3 },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const rails = Number(ctx.inputs.rails ?? 3)

    if (decrypt) {
      const { plaintext, positions, counts } = railFenceDecrypt(text, rails)

      const grid: string[][] = Array.from({ length: rails }, () =>
        Array<string>(text.length).fill('.'),
      )
      const cursor = counts.map(() => 0)
      const reconstructed: string[] = positions.map((r) => {
        const ch = text[cursor[r]] ?? ''
        cursor[r]++
        return ch
      })
      reconstructed.forEach((ch, col) => {
        grid[positions[col]][col] = ch
      })

      return [
        {
          id: `${id}-config`,
          titleKey: 'simulation.rail_fence.config.title',
          descKey: 'simulation.rail_fence.config.desc',
          descArgs: { rails: String(rails) },
          phase: 'key',
          view: { kind: 'rf-config', rails, cycle: 2 * (rails - 1) },
        },
        {
          id: `${id}-positions`,
          titleKey: 'simulation.rail_fence.positions.title',
          descKey: 'simulation.rail_fence.positions.desc',
          descArgs: { rails: String(rails), counts: counts.join(', ') },
          phase: 'input',
          view: { kind: 'rf-positions', rails, counts, text },
        },
        {
          id: `${id}-rebuild`,
          titleKey: 'simulation.rail_fence.rebuild.title',
          descKey: 'simulation.rail_fence.rebuild.desc',
          phase: 'transform',
          view: { kind: 'rf-rebuild', grid, rails },
        },
        {
          id: `${id}-result`,
          titleKey: 'simulation.rail_fence.result.dTitle',
          descKey: 'simulation.rail_fence.result.dDesc',
          phase: 'output',
          view: { kind: 'result', text: plaintext },
        },
      ]
    }

    const { positions, ciphertext, rows, cycle } = railFenceEncrypt(text, rails)
    const grid: (string | null)[][] = Array.from({ length: rails }, () =>
      Array<string | null>(text.length).fill(null),
    )
    text.split('').forEach((ch, col) => {
      grid[positions[col]][col] = ch
    })
    const displayGrid = grid.map((row) => row.map((c) => c ?? '.'))

    return [
      {
        id: `${id}-config`,
        titleKey: 'simulation.rail_fence.config.title',
        descKey: 'simulation.rail_fence.config.desc',
        descArgs: { rails: String(rails) },
        phase: 'key',
        view: { kind: 'rf-config', rails, cycle },
      },
      {
        id: `${id}-pattern`,
        titleKey: 'simulation.rail_fence.pattern.title',
        descKey: 'simulation.rail_fence.pattern.desc',
        phase: 'input',
        view: { kind: 'rf-pattern', displayGrid, rails, text },
      },
      {
        id: `${id}-read`,
        titleKey: 'simulation.rail_fence.read.title',
        descKey: 'simulation.rail_fence.read.desc',
        phase: 'transform',
        view: { kind: 'rf-read', rows },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.rail_fence.result.title',
        descKey: 'simulation.rail_fence.result.desc',
        phase: 'output',
        view: { kind: 'result', text: ciphertext },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'rf-config': {
        const rails = Number(view.rails)
        const cycle = Number(view.cycle)
        return (
          <div className="lab-stage-view">
            <DataBlock label="rails" value={String(rails)} tone="key" big />
            <DataBlock label="cycle" value={String(cycle)} tone="internal" />
          </div>
        )
      }
      case 'rf-pattern': {
        const displayGrid = view.displayGrid as string[][]
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={displayGrid} tone="internal" />
          </div>
        )
      }
      case 'rf-read': {
        const rows = view.rows as string[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={rows.map((r, i) => ({
              label: `rail ${i + 1}`,
              cells: r.split('').map((ch) => ({ ch, tone: 'transform' as const })),
            }))} />
          </div>
        )
      }
      case 'rf-positions': {
        const counts = view.counts as number[]
        return (
          <div className="lab-stage-view">
            {counts.map((c, i) => (
              <DataBlock key={i} label={`rail ${i + 1}`} value={`${c} chars`} tone="internal" />
            ))}
          </div>
        )
      }
      case 'rf-rebuild': {
        const grid = view.grid as string[][]
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} tone="internal" />
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

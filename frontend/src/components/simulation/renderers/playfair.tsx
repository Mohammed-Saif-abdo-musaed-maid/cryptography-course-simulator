import type { CharCell, SimulationContext, SimulationEngine, SimView } from '../simulationTypes'
import { playfairPairs } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'playfair'

export const playfairEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.playfair.name',
  demoInputs: { text: 'HELLOWORLD', keyword: 'MONARCHY' },
  build(ctx) {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const keyword = String(ctx.inputs.keyword ?? 'MONARCHY')
    const { square, pairs, notes, steps, result } = playfairPairs(text, keyword, decrypt)

    return [
      {
        id: `${id}-square`,
        titleKey: 'simulation.playfair.square.title',
        descKey: 'simulation.playfair.square.desc',
        phase: 'key',
        view: { kind: 'pf-square', square, keyword },
      },
      {
        id: `${id}-digraphs`,
        titleKey: 'simulation.playfair.digraphs.title',
        descKey: 'simulation.playfair.digraphs.desc',
        phase: 'input',
        view: { kind: 'pf-digraphs', pairs, notes },
      },
      {
        id: `${id}-encrypt`,
        titleKey: decrypt ? 'simulation.playfair.encrypt.dTitle' : 'simulation.playfair.encrypt.title',
        descKey: decrypt ? 'simulation.playfair.encrypt.dDesc' : 'simulation.playfair.encrypt.desc',
        phase: 'transform',
        view: { kind: 'pf-encrypt', square, steps },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.playfair.result.dTitle' : 'simulation.playfair.result.title',
        descKey: 'simulation.playfair.result.desc',
        phase: 'output',
        view: { kind: 'result', text: result },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'pf-square': {
        const square = view.square as string[][]
        const keyword = String(view.keyword)
        return (
          <div className="lab-stage-view">
            <DataBlock label="keyword" value={keyword} tone="key" big />
            <MatrixGrid matrix={square} tone="internal" />
          </div>
        )
      }
      case 'pf-digraphs': {
        const pairs = view.pairs as string[]
        const notes = view.notes as string[]
        const cells: CharCell[] = pairs.map((p, i) => ({
          ch: p,
          tone: 'input' as const,
          note: notes[i],
        }))
        return (
          <div className="lab-stage-view">
            <CharRows rows={[{ label: 'Digraphs', cells }]} size="lg" />
          </div>
        )
      }
      case 'pf-encrypt': {
        const square = view.square as string[][]
        const steps = view.steps as Array<{
          a: string
          b: string
          ra: number
          ca: number
          rb: number
          cb: number
          rule: string
          out: string
        }>
        const highlight: Array<[number, number]> = []
        if (steps.length > 0) {
          const s = steps[0]
          highlight.push([s.ra, s.ca], [s.rb, s.cb])
        }
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={square} highlight={highlight} tone="internal" />
            {steps.length > 0 && (
              <>
                <DataBlock label="rule" value={steps[0].rule} tone="transform" />
                <CharRows rows={[{
                  label: 'out',
                  cells: [{ ch: steps[0].out, tone: 'output' }],
                }]} size="lg" />
              </>
            )}
          </div>
        )
      }
      case 'result': {
        return (
          <div className="lab-stage-view">
            <DataBlock label="result" value={String(view.text)} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}

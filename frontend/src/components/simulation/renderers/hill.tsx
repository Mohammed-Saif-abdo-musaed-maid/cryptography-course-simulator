import type { SimulationContext, SimulationEngine, SimView } from '../simulationTypes'
import { hillBlocks } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'hill'

export const hillEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.hill.name',
  educationalKey: 'simulation.hill.educational',
  demoInputs: { text: 'HELP', matrix: [[3, 3], [2, 5]] },
  build(ctx) {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const matrix = ctx.inputs.matrix as number[][]
    const { blocks, padded, determin, detInv, inverse, valid } = hillBlocks(matrix, text, decrypt)

    const workingMatrix = decrypt ? (valid ? inverse : matrix) : matrix
    const finalText = blocks.map((b) => b.map((c) => c.mapped).join('')).join('')

    const blockDisplays = blocks.map((b) => {
      const inputVec = b.map((c) => c.v)
      const outputVec = b.map((c) => c.out)
      return {
        chars: b.map((c) => c.ch),
        inputVec,
        midProducts: b.map((c) => c.out),
        outputVec,
        outputChars: b.map((c) => c.mapped),
      }
    })

    return [
      {
        id: `${id}-matrix`,
        titleKey: decrypt ? 'simulation.hill.matrix.dTitle' : 'simulation.hill.matrix.title',
        descKey: decrypt ? 'simulation.hill.matrix.dDesc' : 'simulation.hill.matrix.desc',
        descArgs: { n: String(matrix.length) },
        phase: 'key',
        view: {
          kind: 'hill-matrix',
          matrix: workingMatrix,
          decrypt,
          valid,
          determin,
          detInv,
          originalMatrix: matrix,
        },
      },
      {
        id: `${id}-prepare`,
        titleKey: 'simulation.hill.prepare.title',
        descKey: 'simulation.hill.prepare.desc',
        descArgs: { n: String(matrix.length) },
        phase: 'input',
        view: {
          kind: 'hill-prepare',
          blocks: blockDisplays,
          padded,
          n: matrix.length,
        },
      },
      {
        id: `${id}-compute`,
        titleKey: decrypt ? 'simulation.hill.compute.dTitle' : 'simulation.hill.compute.title',
        descKey: decrypt ? 'simulation.hill.compute.dDesc' : 'simulation.hill.compute.desc',
        phase: 'transform',
        view: {
          kind: 'hill-compute',
          matrix: workingMatrix,
          blocks: blockDisplays,
        },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.hill.result.dTitle' : 'simulation.hill.result.title',
        descKey: 'simulation.hill.result.desc',
        phase: 'output',
        view: { kind: 'result', text: finalText },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'hill-matrix': {
        const matrix = view.matrix as number[][]
        const decrypt = Boolean(view.decrypt)
        const valid = Boolean(view.valid)
        const determin = Number(view.determin)
        const detInv = view.detInv as number | null
        const originalMatrix = view.originalMatrix as number[][]
        return (
          <div className="lab-stage-view">
            {decrypt && (
              <>
                <DataBlock label="K (key)" value={JSON.stringify(originalMatrix)} tone="key" />
                <FlowArrow />
                <DataBlock
                  label="det"
                  value={detInv !== null ? `${determin}, det^-1 = ${detInv}` : `${determin} (not invertible)`}
                  tone={valid ? 'internal' : 'muted'}
                />
                <FlowArrow />
              </>
            )}
            <MatrixGrid matrix={matrix} tone={decrypt ? 'transform' : 'key'} />
            {!decrypt && (
              <DataBlock label="C = K * P mod 26" value="" tone="internal" />
            )}
          </div>
        )
      }
      case 'hill-prepare': {
        const blocks = view.blocks as Array<{
          chars: string[]
          inputVec: number[]
          outputChars: string[]
        }>
        const padded = Number(view.padded)
        return (
          <div className="lab-stage-view">
            {blocks.map((b, i) => (
              <CharRows key={i} rows={[{
                label: `block ${i + 1}`,
                cells: b.chars.map((ch) => ({ ch, tone: 'input' as const })),
              }]} />
            ))}
            {padded > 0 && (
              <DataBlock label="padding" value={`${padded} X(s) added`} tone="muted" />
            )}
          </div>
        )
      }
      case 'hill-compute': {
        const blocks = view.blocks as Array<{
          chars: string[]
          inputVec: number[]
          outputVec: number[]
          outputChars: string[]
        }>
        return (
          <div className="lab-stage-view">
            {blocks.map((b, bi) => (
              <div key={bi} className="lab-stage-view">
                <CharRows rows={[
                  { label: 'P', cells: b.inputVec.map((v) => ({ ch: String(v), tone: 'input' as const })) },
                  { label: 'C', cells: b.outputVec.map((v) => ({ ch: String(v), tone: 'output' as const })) },
                  { label: 'out', cells: b.outputChars.map((ch) => ({ ch, tone: 'output' as const })) },
                ]} />
                {bi < blocks.length - 1 && <FlowArrow />}
              </div>
            ))}
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

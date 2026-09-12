import { hillEngine } from '../../simulation/renderers/hill'
import { camToObjects, manualGrid, valuePlate } from './scene'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'
import { arrow, rows3D } from './scene'

interface HillBlock {
  chars: string[]
  inputVec: number[]
  midProducts?: number[]
  outputVec: number[]
  outputChars: string[]
}

function matrixCells(matrix: number[][], tone: 'key' | 'transform' | 'internal'): CellProps[][] {
  return matrix.map((row) => row.map((val) => ({ label: String(val), tone })))
}

export const hill3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  hillEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'hill-matrix': {
        const matrix = (v.matrix ?? []) as number[][]
        const decrypt = Boolean(v.decrypt)
        const valid = Boolean(v.valid)
        const determin = Number(v.determin)
        const detInv = v.detInv as number | null
        const originalMatrix = (v.originalMatrix ?? []) as number[][]
        const objs: ResolvedObject3D[] = []
        if (decrypt) {
          const { objects: orig } = manualGrid('K', matrixCells(originalMatrix, 'key'), [-6.5, 0, 0], { cellSize: 1.0, gap: 0.1 })
          const { objects: inv } = manualGrid('Kinv', matrixCells(matrix, 'transform'), [3.5, 0, 0], { cellSize: 1.0, gap: 0.1 })
          objs.push(
            ...orig,
            ...inv,
            arrow('kinv', [-4.4, 1, 0], [1.9, 1, 0], 'path'),
            ...valuePlate(
              'det',
              [8.2, 0.4, 2.4],
              'det',
              detInv !== null ? `${determin} (inv ${detInv})` : `${determin} · not invertible`,
              valid ? 'internal' : 'error',
              { emphasize: !valid },
            ),
          )
        } else {
          const { objects } = manualGrid('K', matrixCells(matrix, 'key'), [0, 0, -1.5], { cellSize: 1.0, gap: 0.1 })
          objs.push(...objects)
          objs.push(...valuePlate('formula', [4.5, 0.8, -1.5], 'C = K · P mod 26', '', 'transform'))
        }
        return objs
      }
      case 'hill-prepare': {
        const blocks = (v.blocks ?? []) as HillBlock[]
        const padded = Number(v.padded)
        const objs: ResolvedObject3D[] = []
        blocks.slice(0, 4).forEach((b, bi) => {
          const z = bi * 3
          const x0 = -3.5
          objs.push(
            ...valuePlate(
              `b${bi}-chars`,
              [x0, 0.3, z],
              `block ${bi + 1}`,
              b.chars.join(''),
              'input',
            ),
            ...valuePlate(
              `b${bi}-vec`,
              [x0 + 5.2, 0.3, z],
              'P vector',
              b.inputVec.join(', '),
              'internal',
            ),
          )
        })
        if (padded > 0) {
          objs.push(...valuePlate('pad', [4.5, 1.2, blocks.length * 3], 'padding', `${padded} × X`, 'muted'))
        }
        if (blocks.length > 4) {
          objs.push(
            ...valuePlate('hill-prep-note', [0, 3.6, -2.2], 'note', `first 4 of ${blocks.length} blocks shown`, 'muted'),
          )
        }
        return objs
      }
      case 'hill-compute': {
        const matrix = (v.matrix ?? []) as number[][]
        const blocks = (v.blocks ?? []) as HillBlock[]
        const { objects } = manualGrid('K', matrixCells(matrix, 'key'), [0.5, 0, -2.4], { cellSize: 1.0, gap: 0.1 })
        const objs: ResolvedObject3D[] = [...objects]
        blocks.slice(0, 4).forEach((b, bi) => {
          const z = bi * 3
          objs.push(
            ...rows3D(
              [
                { label: 'P', cells: b.chars.map((ch, i) => ({ label: ch, tone: 'input' as const, emphasize: i === 0 })) },
                { label: 'in', cells: b.inputVec.map((x) => ({ label: String(x), tone: 'internal' as const })) },
                { label: 'out', cells: (b.outputVec ?? []).map((x) => ({ label: String(x), tone: 'transform' as const })) },
                { label: 'C', cells: b.outputChars.map((ch) => ({ label: ch, tone: 'output' as const, emphasize: true })) },
              ],
              [-4.2, 0.2, z],
              { rowStep: 1.9, cellSize: 0.7, gap: 0.06 },
            ).objects,
          )
          objs.push(arrow(`in-${bi}`, [3.3, 0.8, z], [1.7, 0.7, -2.4], 'transform'))
          objs.push(arrow(`out-${bi}`, [10.6, 0.8, z], [1.7, 0.9, -2.4], 'transform'))
        })
        if (blocks.length > 4) {
          objs.push(
            ...valuePlate('hill-compute-note', [0, 4.2, -2.2], 'note', `first 4 of ${blocks.length} blocks shown`, 'muted'),
          )
        }
        return objs
      }
      case 'result':
        return resultViewScene(v)
      default:
        return []
    }
  },
  {
    defaultCamera: camToObjects(
      manualGrid('K', matrixCells([[3, 3], [2, 5]], 'key'), [0, 0, -1.5], { cellSize: 1.0, gap: 0.1 }).objects,
      { dir: [0.8, 0.9, 1.15] },
    ),
  },
)
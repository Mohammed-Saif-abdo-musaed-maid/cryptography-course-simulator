import { playfairEngine } from '../../simulation/renderers/playfair'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter, Vec3 } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'
import { arrow, camToObjects, manualGrid, merge, rows3D, valuePlate } from './scene'

interface PfStep {
  a: string
  b: string
  ra: number
  ca: number
  rb: number
  cb: number
  rule: string
  out: string
}

function squareCells(square: string[][], keyword: string, active: PfStep | null): CellProps[][] {
  const kwSet = new Set(keyword.toUpperCase().split(''))
  return square.map((row, r) =>
    row.map((ch, c) => ({
      label: ch,
      tone: kwSet.has(ch) ? ('key' as const) : ('internal' as const),
      emphasize:
        active !== null &&
        ((r === active.ra && c === active.ca) || (r === active.rb && c === active.cb)),
    })),
  )
}

export const playfair3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  playfairEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'pf-square': {
        const square = (v.square ?? []) as string[][]
        const keyword = String(v.keyword)
        const { objects } = manualGrid('sq', squareCells(square, keyword, null), [0, 0, 0], {
          cellSize: 1.15,
          gap: 0.18,
        })
        return merge(
          ...objects,
          ...valuePlate('kw', [-2.8, 1.3, 3.6], 'keyword', keyword, 'key', { emphasize: true }),
        )
      }
      case 'pf-digraphs': {
        const pairs = (v.pairs ?? []) as string[]
        return merge(
          ...rows3D(
            [
              {
                label: 'digraphs',
                cells: pairs.map((p, i) => ({ label: p, tone: 'input' as const, emphasize: i === 0 })),
              },
            ],
            [0, 0, 0],
            { rowStep: 2.4, cellSize: 1.3, gap: 0.08 },
          ).objects,
        )
      }
      case 'pf-encrypt': {
        const square = (v.square ?? []) as string[][]
        const steps = (v.steps ?? []) as PfStep[]
        const first = steps[0]
        const { objects, cells } = manualGrid('sq', squareCells(square, '', first), [0, 0, 0], {
          cellSize: 1.15,
          gap: 0.18,
        })
        const objs: ResolvedObject3D[] = [...objects]
        const center: Vec3 = [0, 0.3, 0]
        steps.forEach((s, si) => {
          const a = cells[s.ra]?.[s.ca]
          const b = cells[s.rb]?.[s.cb]
          if (!a || !b) return
          // The rectangle rule: with a pair in different rows/cols the outputs
          // occupy the opposite rectangle corners; arrows trace that swap.
          if (s.ra === s.rb) {
            objs.push(arrow(`m-${si}`, [a[0], 0.5, a[2]], [b[0], 0.5, b[2]], 'transform'))
          } else if (s.ca === s.cb) {
            objs.push(arrow(`m-${si}`, [a[0], 0.5, a[2]], [b[0], 0.5, b[2]], 'transform'))
          } else {
            // rectangle of the two letters → arrow across it
            objs.push(arrow(`m-${si}`, a, b, 'path'))
            void center
          }
        })
        objs.push(...valuePlate('rule', [6.6, 0.3, 0], 'rule', first?.rule ?? '', 'transform'))
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
      manualGrid(
        'sq',
        Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ label: 'A', tone: 'internal' as const }))),
        [0, 0, 0],
        { cellSize: 1.15, gap: 0.18 },
      ).objects,
      { dir: [0.75, 0.85, 1.3] },
    ),
  },
)
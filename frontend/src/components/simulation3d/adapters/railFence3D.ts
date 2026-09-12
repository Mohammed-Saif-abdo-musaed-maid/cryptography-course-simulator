import { railFenceEngine } from '../../simulation/renderers/railFence'
import { railPositions } from '../../simulation/simulationShared'
import { arrow, camToObjects, manualGrid, merge, rows3D, valuePlate } from './scene'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter, Vec3 } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'

function zigzagArc(text: string, rails: number, label = 'zigzag'): ResolvedObject3D {
  const n = Math.min(text.length, 14)
  const positions = railPositions(text.length, rails)
  const pts: Vec3[] = []
  for (let i = 0; i < (n || 1); i++) {
    const rail = positions[i] ?? 0
    pts.push([i * 1.1 - (n * 1.1) / 2, rail * 1.7 + 0.3, 0])
  }
  return { id: label, kind: 'arc', position: [0, 0, 0], points: pts, ringTube: 0.18, tone: 'path' }
}

function gridFromStrings(grid: string[][]): CellProps[][] {
  return grid.map((row) =>
    row.map((ch) =>
      ch === '.'
        ? { label: '', tone: 'muted' as const, opacity: 0.25 }
        : { label: ch, tone: 'active' as const, emphasize: true },
    ),
  )
}

export const railFence3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  railFenceEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'rf-config': {
        const rails = Number(v.rails)
        const cycle = Number(v.cycle)
        const pts: Vec3[] = []
        for (let i = 0; i < cycle; i++) {
          const rail = i < rails ? i : cycle - i
          pts.push([i * 1.4 - (cycle * 1.4) / 2, rail * 1.8 + 0.3, 0])
        }
        return merge(
          {
            id: 'cycle-arc',
            kind: 'arc',
            position: [0, 0, 0],
            points: pts,
            ringTube: 0.2,
            tone: 'path',
          },
          {
            id: 'cycle-ring',
            kind: 'ring',
            position: [5.5, 0, 0],
            ringRadius: 2,
            ringTube: 0.14,
            tone: 'transform',
          },
          ...valuePlate('rails', [9.2, 0.6, 1.6], 'rails', String(rails), 'key'),
          ...valuePlate('cycle', [6.8, 0.6, 3.4], 'cycle', `${cycle}`, 'internal'),
        )
      }
      case 'rf-pattern':
      case 'rf-rebuild': {
        const grid = (v.grid ?? v.displayGrid ?? []) as string[][]
        const { objects } = manualGrid('g', gridFromStrings(grid ?? []), [0, 0, 0], { cellSize: 0.5, gap: 0.02 })
        return objects
      }
      case 'rf-read': {
        const rows = (v.rows ?? []) as string[]
        return merge(
          ...rows3D(
            rows.map((r, i) => ({
              label: `rail ${i + 1}`,
              cells: r.split('').map((ch) => ({ label: ch, tone: 'transform' as const })),
            })),
            [0, 0, 0],
            { rowStep: 2.5, cellSize: 0.8, gap: 0.06 },
          ).objects,
        )
      }
      case 'rf-positions': {
        const counts = (v.counts ?? []) as number[]
        const text = String(v.text ?? '')
        return merge(
          ...rows3D(
            [{
              label: 'rail',
              cells: counts.map((c, i) => ({
                label: String(c),
                tone: i % 2 === 0 ? ('internal' as const) : ('transform' as const),
              })),
            }],
            [0, 0, 0],
          ).objects,
          zigzagArc(text, counts.length, 'rf-zig'),
          arrow('zig-goto', [text.length * 0.3, counts.length * 1.7, 0], [6, 0.4, 3.5], 'path'),
        )
      }
      case 'result':
        return resultViewScene(v)
      default:
        return []
    }
  },
  {
    defaultCamera: camToObjects(
      [zigzagArc('HELLOWORLD1234', 3, 'demo')],
      { dir: [0.85, 0.6, 0.9] },
    ),
  },
)
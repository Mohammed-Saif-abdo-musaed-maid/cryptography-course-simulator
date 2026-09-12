import { columnarEngine } from '../../simulation/renderers/columnar'
import { camToObjects, manualGrid, valuePlate } from './scene'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter, Vec3 } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'

function gridCells(grid: string[][]): CellProps[][] {
  return grid.map((row) =>
    row.map((ch) =>
      ch === '.'
        ? { label: '', tone: 'muted' as const, opacity: 0.22 }
        : { label: ch, tone: 'internal' as const },
    ),
  )
}

/** Vertical stack of letters (a ciphertext column). */
function columnCells(text: string, tone: 'transform' | 'internal' | 'input'): CellProps[][] {
  return text.split('').map((ch) => [{ label: ch, tone }])
}

export const columnar3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  columnarEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'col-key': {
        const key = String(v.key)
        const order = (v.order ?? []) as number[]
        const objs: ResolvedObject3D[] = []
        const STEP = 1.1
        key.split('').forEach((ch, ci) => {
          const x = ci * STEP - ((key.length - 1) * STEP) / 2
          objs.push(
            {
              id: `kc-${ci}`,
              kind: 'box',
              position: [x, 0.4, 0],
              size: [0.85, 0.24, 0.85],
              tone: 'key',
              emphasize: true,
            },
            {
              id: `kcg-${ci}`,
              kind: 'glyph',
              position: [x, 1, 0],
              label: ch,
              glyphScale: 0.95,
              tone: 'key',
            },
            {
              id: `ko-${ci}`,
              kind: 'glyph',
              position: [x, 0, 0],
              label: String(order.indexOf(ci)),
              glyphScale: 0.5,
              tone: 'internal',
            },
          )
        })
        return objs
      }
      case 'col-grid': {
        const grid = (v.grid ?? []) as string[][]
        const key = String(v.key)
        const { objects, cells } = manualGrid('cg', gridCells(grid), [0, 0, 0], { cellSize: 0.8, gap: 0.1 })
        const objs: ResolvedObject3D[] = [...objects]
        key.split('').forEach((ch, ci) => {
          const x = cells[0][ci]?.[0] ?? 0
          objs.push(
            {
              id: `hdr-${ci}`,
              kind: 'box',
              position: [x, -0.16 - 0.14, cells[0][ci]?.[2] ?? 0],
              size: [0.8, 0.28, 0.8],
              tone: 'key',
              emphasize: true,
            },
            {
              id: `hdrg-${ci}`,
              kind: 'glyph',
              position: [x, -0.16 + 0.28, (cells[0][ci]?.[2] ?? 0) - 0.7],
              label: ch,
              glyphScale: 0.7,
              tone: 'key',
            },
          )
        })
        return objs
      }
      case 'col-read':
      case 'col-split': {
        const key = String(v.key)
        const order = (v.order ?? []) as number[]
        const columnTexts = (v.columnTexts ?? v.colTexts ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        const STEP = 2.6
        const pts: Vec3[] = []
        order.forEach((colIdx, oi) => {
          const x = oi * STEP - ((order.length - 1) * STEP) / 2
          const col = columnCells(columnTexts[colIdx] ?? '', 'transform')
          const { objects } = manualGrid(`col${oi}`, col, [x, 0, 0], { cellSize: 0.85, gap: 0.06 })
          objs.push(
            ...objects,
            {
              id: `lbl-${oi}`,
              kind: 'glyph',
              position: [x, -0.55, 0],
              label: `${key[colIdx]}(read ${order.indexOf(colIdx)})`,
              glyphScale: 0.55,
              tone: 'key',
            },
          )
          if (col.length > 0) pts.push([x, 0, col.length * 0.91])
        })
        if (pts.length > 1) {
          objs.push({ id: 'readpath', kind: 'arc', position: [0, 0, 0], points: pts.map((p) => [p[0], 0.55, p[2]] as Vec3), ringTube: 0.12, tone: 'path' })
        }
        return objs
      }
      case 'col-rebuild': {
        const grid = (v.grid ?? []) as string[][]
        const { objects } = manualGrid('rb', gridCells(grid), [0, 0, 0], { cellSize: 0.85, gap: 0.1 })
        const objs: ResolvedObject3D[] = [...objects]
        grid.forEach((row, r) => {
          row.forEach((ch, ci) => {
            if (ch === '.') return
            objs.push(
              {
                kind: 'sphere',
                id: `rb-dot-${r}-${ci}`,
                position: [-((grid[0]?.length ?? 1) * 0.95) / 2 + ci * 0.95, 1.15, 0],
                size: [0.22, 0.22, 0.22],
                tone: 'active',
                emphasize: true,
              } as ResolvedObject3D,
            )
          })
        })
        objs.push(...valuePlate('plain-hint', [(grid[0]?.length ?? 2) / 2, 1.6, (grid.length / 2) * 0.95], 'rows read', 'left → right', 'path'))
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
        'cg',
        gridCells([['A', 'B', '.', 'C'], ['D', 'E', '.', 'F']]),
        [0, 0, 0],
        { cellSize: 0.8, gap: 0.1 },
      ).objects,
      { dir: [0.8, 0.9, 1.1] },
    ),
  },
)
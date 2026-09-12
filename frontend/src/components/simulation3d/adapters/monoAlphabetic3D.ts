import type { CharCell } from '../../simulation/simulationTypes'
import { monoAlphabeticEngine } from '../../simulation/renderers/monoAlphabetic'
import { ALPHABET } from '../../simulation/simulationShared'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'
import { arrow, camToObjects, merge, rows3D } from './scene'

const CELL = 0.6
const GAP = 0.05
const STEP = CELL + GAP
const OFF = ((26 - 1) * STEP) / 2

function row26(idPrefix: string, letters: string, tone: 'input' | 'key' | 'transform', z: number): ResolvedObject3D[] {
  const objs: ResolvedObject3D[] = []
  letters.split('').forEach((ch, i) => {
    const x = -OFF + i * STEP
    objs.push(
      {
        id: `${idPrefix}-${i}`,
        kind: 'box',
        position: [x, 0.3, z],
        size: [CELL, 0.26, CELL],
        tone,
      },
      {
        id: `${idPrefix}g-${i}`,
        kind: 'glyph',
        position: [x, 0.85, z],
        label: ch,
        glyphScale: 0.7,
        tone,
      },
    )
  })
  return objs
}

export const monoAlphabetic3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  monoAlphabeticEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'mono-key': {
        const sub = String(v.sub)
        const objs: ResolvedObject3D[] = merge(
          row26('a', ALPHABET, 'input', 0),
          row26('s', sub, 'key', 2.3),
        )
        const shown = [0, 4, 11, 17, 25]
        for (const i of shown) {
          const x = -OFF + i * STEP
          objs.push(arrow(`map-${i}`, [x, 0.65, 2.3], [x, 0.45, 0], 'transform'))
        }
        return objs
      }
      case 'mono-input': {
        const chars = (v.chars ?? []) as CharCell[]
        return merge(
          ...rows3D(
            [{ cells: chars.map((c) => ({ label: c.ch, tone: c.tone })) }],
            [0, 0, 0],
            { rowStep: 2.4 },
          ).objects,
        )
      }
      case 'mono-sub-grid': {
        const rows = (v.gridRows ?? []) as Array<{ label?: string; cells: CharCell[] }>
        return merge(
          ...rows3D(
            rows.map((r) => ({
              label: r.label,
              cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone })),
            })),
            [0, 0, 0],
            { rowStep: 2.4, cellSize: 0.72, gap: 0.05 },
          ).objects,
        )
      }
      case 'mono-chars': {
        const pR = (v.pRow ?? []) as CharCell[]
        const mR = (v.mRow ?? []) as CharCell[]
        return merge(
          ...rows3D(
            [
              { label: 'P', cells: pR.map((c) => ({ label: c.ch, tone: c.tone })) },
              { label: 'C', cells: mR.map((c) => ({ label: c.ch, tone: c.tone })) },
            ],
            [0, 0, 0],
            { rowStep: 2.4 },
          ).objects,
        )
      }
      case 'result':
        return resultViewScene(v)
      default:
        return []
    }
  },
  {
    defaultCamera: camToObjects(merge(row26('a', ALPHABET, 'input', 0), row26('s', ALPHABET, 'key', 2.3)), {
      dir: [0.85, 0.9, 1.1],
    }),
  },
)
import type { CharCell } from '../../simulation/simulationTypes'
import { vigenereEngine } from '../../simulation/renderers/vigenere'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene, rowsViewScene } from './from2d'
import { arrow, camToObjects, merge, valuePlate } from './scene'

const MAX_LETTERS = 14
const STEP = 0.92 + 0.12

interface RailRow {
  label: string
  parts: { label: string; tone: 'input' | 'key' | 'transform' | 'output' | 'internal' | 'active' | 'muted' }[]
}

function railRows(rows: RailRow[]): ResolvedObject3D[] {
  const n = Math.max(0, ...rows.map((r) => r.parts.length))
  const off = ((n - 1) * STEP) / 2
  const objs: ResolvedObject3D[] = []
  rows.forEach((row, ri) => {
    const z = ri * 2.3
    objs.push({
      id: `rlabel-${ri}`,
      kind: 'glyph',
      position: [-off - 1.7, 1, z],
      label: row.label,
      glyphScale: 0.95,
      tone: 'muted',
    })
    row.parts.forEach((c, ci) => {
      const x = -off + ci * STEP
      objs.push(
        {
          id: `R${ri}C${ci}`,
          kind: 'box',
          position: [x, 0.5, z],
          size: [0.92, 0.92, 0.92],
          tone: c.tone,
        },
        {
          id: `R${ri}C${ci}g`,
          kind: 'glyph',
          position: [x, 1.24, z],
          label: c.label,
          glyphScale: 0.95,
          tone: c.tone,
        },
      )
    })
  })
  return objs
}

export const vigenere3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  vigenereEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'vig-key': {
        const key = String(v.key)
        const cells = key
          .split('')
          .map((ch, i) => ({ label: ch, tone: 'key' as const, emphasize: i < 2 }))
        return merge(
          railRows([{ label: 'K', parts: cells }]),
          valuePlate('key-len', [7, 0.4, 0], 'key length', String(key.length), 'internal'),
          valuePlate('mod', [9, 0.4, 2.4], 'mod 26', '26', 'transform'),
          arrow('cycle', [7, 1.4, 0], [9, 1.4, 2.4], 'path'),
        )
      }
      case 'vig-input': {
        const chars = (v.chars ?? []) as CharCell[]
        return rowsViewScene({ rows: [{ label: 'P', cells: chars }] }, [0, 0, 0])
      }
      case 'vig-rail': {
        const key = String(v.key)
        const full = String(v.text)
        const letters = full.slice(0, MAX_LETTERS)
        const repeated = (key + key.repeat(Math.ceil(letters.length / key.length))).slice(0, letters.length)
        const parts = letters.split('').map((ch) => ({ label: ch, tone: 'input' as const }))
        const objs = railRows([
          { label: 'P', parts },
          { label: 'K', parts: repeated.split('').map((ch) => ({ label: ch, tone: 'key' as const })) },
        ])
        const off = ((Math.max(letters.length, repeated.length) - 1) * STEP) / 2
        letters.split('').forEach((_, ci) => {
          const x = -off + ci * STEP
          objs.push(arrow(`ar-${ci}`, [x, 0.5, 2.3], [x, 0.5, 0], 'path'))
        })
        if (full.length > MAX_LETTERS) {
          objs.push(
            ...valuePlate('vig-rail-note', [0, 3.6, -2.6], 'note', `first ${MAX_LETTERS} letters shown · ${full.length} total`, 'muted'),
          )
        }
        return objs
      }
      case 'rows':
        return rowsViewScene(v)
      case 'result':
        return resultViewScene(v)
      default:
        return []
    }
  },
  {
    defaultCamera: camToObjects(
      merge(
        ...railRows([
          { label: 'P', parts: Array.from({ length: 12 }, () => ({ label: 'A', tone: 'input' as const })) },
          { label: 'K', parts: Array.from({ length: 12 }, () => ({ label: 'A', tone: 'key' as const })) },
        ]),
      ),
      { dir: [0.8, 0.85, 1.2] },
    ),
  },
)
import { poly1305Engine } from '../../simulation/renderers/poly1305'
import type { CellTone } from '../../simulation/simulationTypes'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { arrow, hexStrip, rows3D, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

function hexCells(hex: string, tone: CellTone) {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ label: h.toUpperCase(), tone }))
}

export const poly13053DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  poly1305Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'poly1305-key':
        return [
          ...rows3D(
            [
              { label: 'r (16B)', cells: hexCells(String(v.r), 'key') },
              { label: 's (16B)', cells: hexCells(String(v.s), 'key') },
            ],
            [0, 0, 0],
            { cellSize: 0.6, gap: 0.07 },
          ).objects,
          arrow('clamp', [0, 0.4, 3.8], [0, 0.4, 5], 'path'),
          ...valuePlate('clampnote', [0, 0.8, 6.4], 'clamping', 'r is clamped before use', 'transform'),
        ]
      case 'poly1305-blocks': {
        const rows = ((v.rows as Array<{ label: string; cells: Array<{ ch: string; tone: string }> }>) ?? []).map((r) => ({
          label: r.label,
          cells: (r.cells ?? []).map((c) => ({ label: c.ch.toUpperCase(), tone: (c.tone as CellTone) ?? 'internal' })),
        }))
        if (rows.length === 0) {
          return [...valuePlate('blocks', [0, 0.5, 0], 'blocks', 'message split into 16-byte little-endian blocks + 2¹²⁸', 'muted')]
        }
        const objs = rows3D(rows, [0, 0, 0], { cellSize: 0.6, gap: 0.07 }).objects
        objs.push(...valuePlate('blocknote', [0, 2.8, 3.4], 'blocks', 'little-endian + 2¹²⁸ bit per block', 'transform'))
        return objs
      }
      case 'poly1305-poly':
        return [
          arrow('p1', [0, 0.4, -3], [0, 0.4, -1.2], 'path'),
          ...valuePlate('acc', [0, -0.4, 0.8], 'accumulator', 'acc = (acc + block)·r mod 2¹³⁰−5', 'internal', { emphasize: true }),
          arrow('p2', [0, 0.4, 3.2], [0, 0.4, 4.4], 'path'),
          ...valuePlate('tfin', [0, 0.8, 6], 'finish', 'tag = (acc + s) mod 2¹²⁸', 'transform'),
        ]
      case 'poly1305-tag':
        if (!B(v.hasResult)) {
          return [...valuePlate('tag', [0, 0.6, 0], 'Poly1305 tag', '—', 'muted', { emphasize: true })]
        }
        return [
          ...valuePlate('tag', [0, 1.6, -2.6], 'Poly1305 tag', '16 bytes', 'output', { emphasize: true }),
          ...hexStrip('tagv', String(v.mac), 'output', [0, -1.2, 2.4], { piece: 2, cellSize: 0.55, gap: 0.06 }),
          ...valuePlate('warn', [0, 3, 4.2], 'one-time key', 'never reuse (r, s)', 'error'),
        ]
      default:
        return []
    }
  },
)
import { cmacEngine } from '../../simulation/renderers/cmac'
import type { CellTone } from '../../simulation/simulationTypes'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { arrow, hexStrip, rows3D, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

function hexCells(hex: string, tone: CellTone) {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ label: h.toUpperCase(), tone }))
}

export const cmac3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  cmacEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'cmac-key':
        return [
          ...rows3D([{ label: 'key', cells: hexCells(String(v.key), 'key') }], [0, 0, 0], { cellSize: 0.55, gap: 0.06 }).objects,
          arrow('kf', [0, 0.4, 3.4], [0, 0.4, 4.6], 'path'),
          ...valuePlate('subkeys', [0, 0.8, 6.4], 'subkeys', 'K1 = dbl(E_K(0¹²⁸)) · K2 = dbl(K1)', 'internal'),
        ]
      case 'cmac-chain': {
        const rows = ((v.rows as Array<{ label: string; cells: Array<{ ch: string; tone: string }> }>) ?? []).map((r) => ({
          label: r.label,
          cells: (r.cells ?? []).map((c) => ({ label: c.ch.toUpperCase(), tone: (c.tone as CellTone) ?? 'internal' })),
        }))
        if (rows.length === 0 || !B(v.hasResult)) {
          return [...valuePlate('chain', [0, 0.5, 0], 'CBC-MAC chain', 'Xᵢ = E_K(Xᵢ₋₁ ⊕ Mᵢ) — run to bind blocks', 'muted')]
        }
        const objs = rows3D(rows, [0, 0, 0], { cellSize: 0.5, gap: 0.05 }).objects
        objs.push(...valuePlate('chainnote', [0, 2.8, 3.4], 'mode', 'CBC-MAC over 16-byte blocks', 'transform'))
        return objs
      }
      case 'cmac-mask':
        return [
          arrow('mf', [0, 0.4, -2.4], [0, 0.4, -0.8], 'path'),
          ...valuePlate('mask', [0, -0.4, 1.4], 'final masking', B(v.finalFull) ? 'complete → XOR K1' : 'partial → pad + XOR K2', 'transform', { emphasize: true }),
        ]
      case 'cmac-tag':
        if (!B(v.hasResult)) {
          return [...valuePlate('tag', [0, 0.6, 0], 'CMAC tag', '—', 'muted', { emphasize: true })]
        }
        return [
          ...valuePlate('tag', [0, 1.6, -2.6], 'CMAC tag', '16 bytes', 'output', { emphasize: true }),
          ...hexStrip('tagv', String(v.mac), 'output', [0, -1.2, 2.4], { piece: 2, cellSize: 0.55, gap: 0.06 }),
        ]
      default:
        return []
    }
  },
)
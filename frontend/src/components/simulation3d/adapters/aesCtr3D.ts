import { aesCtrEngine } from '../../simulation/renderers/aesModes'
import type { CellTone } from '../../simulation/simulationTypes'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { rows3D, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

function hexCells(hex: string, tone: CellTone) {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ label: h.toUpperCase(), tone }))
}

export const aesCtr3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  aesCtrEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'aes_ctr-input':
        return [
          ...valuePlate('data', [0, 0.9, -2.8], B(v.decrypt) ? 'ciphertext' : 'plaintext', String(B(v.decrypt) ? v.ciphertext : v.plaintext), 'input'),
          ...valuePlate('key', [0, -0.9, 0.5], 'key (AES)', String(v.key), 'key'),
          ...valuePlate('counter', [0, -2, 2.8], 'counter block a0', String(v.counter), 'key'),
        ]
      case 'aes_ctr-counter': {
        const counters = (v.counters as string[]) ?? []
        if (counters.length === 0 || !B(v.hasResult)) {
          return [...valuePlate('keystream', [0, 0.5, 0], 'keystream', 'E_K(counter+i) — run to bind counter blocks', 'muted')]
        }
        const objs = rows3D(
          counters.map((c, i) => ({ label: `counter+${i}`, cells: hexCells(c, 'key') })),
          [0, 0, 0],
          { cellSize: 0.5, gap: 0.05 },
        ).objects
        objs.push(...valuePlate('ksnote', [0, 2.8, 3.4], 'keystream', 'E_K(counter+i)', 'internal'))
        return objs
      }
      case 'aes_ctr-xor': {
        if (!B(v.hasResult)) {
          return [...valuePlate('xor', [0, 0.5, 0], 'XOR', 'P ⊕ keystream = C — run to bind the real values', 'muted')]
        }
        const pt = String(v.pt)
        const ct = String(v.ct)
        const ks = String(v.keystream)
        const first = B(v.decrypt) ? ct || pt : pt || ct
        const second = B(v.decrypt) ? pt || ct : ct || pt
        return [
          ...rows3D(
            [
              { label: B(v.decrypt) ? 'C' : 'P', cells: hexCells(first || '00', B(v.decrypt) ? 'input' : 'input') },
              {
                label: 'keystream',
                cells: ks
                  ? hexCells(ks || second.slice(0, 32), 'transform')
                  : [{ label: 'E_K(counter)', tone: 'transform' as CellTone }],
              },
              { label: B(v.decrypt) ? 'P' : 'C', cells: hexCells(second || '00', 'output') },
            ],
            [0, 0, 0],
            { cellSize: 0.5, gap: 0.05 },
          ).objects,
          ...valuePlate('xornote', [0, 2.8, 3.6], 'XOR', 'stream mode · encrypt ≡ decrypt', 'transform'),
        ]
      }
      case 'aes_ctr-result':
        return [
          ...valuePlate(
            'out',
            [0, 0.6, 0],
            B(v.decrypt) ? 'plaintext' : 'ciphertext (hex)',
            B(v.hasResult) ? String(B(v.decrypt) ? v.out : v.ct) : '—',
            B(v.hasResult) ? 'output' : 'muted',
            { emphasize: true },
          ),
        ]
      default:
        return []
    }
  },
)
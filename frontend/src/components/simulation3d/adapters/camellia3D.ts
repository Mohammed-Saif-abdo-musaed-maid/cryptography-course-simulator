import { camelliaEngine } from '../../simulation/renderers/camellia'
import type { CellTone } from '../../simulation/simulationTypes'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { arrow, rows3D, valuePlate } from './scene'
import { wordLaneScene } from './hash3d'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

function hexCells(hex: string, tone: CellTone) {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ label: h.toUpperCase(), tone }))
}

export const camellia3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  camelliaEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'camellia-key':
        return [
          ...rows3D(
            [
              { label: 'block', cells: hexCells(String(v.block), 'input') },
              { label: 'key', cells: hexCells(String(v.key), 'key') },
            ],
            [0, 0, 0],
            { cellSize: 0.55, gap: 0.06 },
          ).objects,
          ...valuePlate('struct', [0, 2.6, 3.6], 'structure', 'Feistel network · 128-bit blocks', 'internal'),
        ]
      case 'camellia-schedule':
        return [
          arrow('kf', [0, 0.4, -2.4], [0, 0.4, 0], 'path'),
          ...valuePlate('klka', [0, -0.4, 2], 'subkeys', 'KL ‖ KA → round subkeys + FL/FL⁻¹', 'internal'),
          ...valuePlate('kv', [0, -2.1, 4], 'key schedule', 'round subkeys not exposed byte-wise by the library (educational representation)', 'muted'),
        ]
      case 'camellia-rounds': {
        if (!B(v.hasResult)) {
          return [...valuePlate('rounds', [0, 0.5, 0], 'rounds', `${String(v.rounds)} Feistel rounds (F = S1..S4 then P)`, 'muted')]
        }
        return [
          ...wordLaneScene('cam-in', hexWordCells(String(v.input)), 'input' as const, [0, -2, -4.2]),
          arrow('rf', [0, 0.2, -3.8], [0, 0.2, -2], 'path'),
          ...wordLaneScene('cam-out', hexWordCells(String(v.output)), 'output' as const, [0, 2, 0.6]),
          ...valuePlate('rounds-note', [0, 3.8, 3.4], 'rounds', `SP-function F · ${String(v.rounds)} rounds`, 'transform'),
        ]
      }
      case 'camellia-result':
        return [
          ...valuePlate(
            'out',
            [0, 0.6, 0],
            B(v.decrypt) ? 'plaintext (hex)' : 'ciphertext (hex)',
            B(v.hasResult) ? String(v.out) : '—',
            B(v.hasResult) ? 'output' : 'muted',
            { emphasize: true },
          ),
        ]
      default:
        return []
    }
  },
)

function hexWordCells(hex: string): string[] {
  const words: string[] = []
  for (let i = 0; i < hex.length; i += 8) words.push(hex.slice(i, i + 8))
  return words
}
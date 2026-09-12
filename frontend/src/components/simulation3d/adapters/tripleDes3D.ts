import { tripleDesEngine } from '../../simulation/renderers/tripleDes'
import { arrow, hexStrip, merge, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

interface TdesStageView {
  stage?: string
  operation?: string
  key?: string
  input?: string
  output?: string
}

const stagesByIndex = ((v: Record<string, unknown>) => v.stage as TdesStageView | undefined)

const of2 = (s: TdesStageView | undefined, k: 'stage' | 'key' | 'input' | 'output'): string =>
  String(s?.[k] ?? '').toUpperCase()

export const tripleDes3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  tripleDesEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'tdes-key': {
        const block = String(v.block ?? '').toUpperCase()
        const k1 = String(v.k1 ?? '').toUpperCase()
        const k2 = String(v.k2 ?? '').toUpperCase()
        const k3 = String(v.k3 ?? '').toUpperCase()
        return [
          ...hexStrip('blk', block, 'input', [0, 0.9, -1.4], { piece: 1, cellSize: 0.6, gap: 0.035 }).objects,
          ...valuePlate('k1', [-3.6, 0.3, 1.2], 'K1', k1, 'key'),
          ...valuePlate('k2', [0, 0.3, 1.2], 'K2', k2, 'key'),
          ...valuePlate('k3', [3.6, 0.3, 1.2], 'K3', k3, 'key'),
          ...valuePlate('split', [0, 2.6, 1.2], '3DES key', '24 bytes split into K1 · K2 · K3', 'transform'),
        ]
      }
      case 'tdes-pass': {
        const s = stagesByIndex(v)
        const idx = Number(v.index ?? 1)
        if (!s) return []
        const key = of2(s, 'key')
        const input = of2(s, 'input')
        const output = of2(s, 'output')
        const op = String(s.stage ?? '').toUpperCase()
        const posX = -7.2 + (idx - 1) * 3.6
        return [
          ...valuePlate('both', [posX, 1.2, -1.6], s.operation === 'decrypt' ? 'decrypt' : 'encrypt', op, 'transform', { emphasize: true }),
          ...valuePlate('opkey', [posX, -0.4, 2], op, key, 'key'),
          ...hexStrip('in', input, 'input', [posX, 0.6, 0.6], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          arrow('pass', [posX, 0.6, 2.8], [posX, 0.6, 3.8], 'path'),
          ...hexStrip('out', output, 'output', [posX, 0.6, 4.4], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...valuePlate('stagecap', [posX, 2.9, 1.4], `pass ${idx}`, op, 'transform'),
        ]
      }
      case 'tdes-formula': {
        const formula = String(v.formula ?? '')
        return [
          ...valuePlate('form', [0, 0.4, 0], v.decrypt ? 'decrypt' : 'encrypt', formula, 'transform', { emphasize: true }),
          ...valuePlate('chain', [0, -1.7, 2.6], 'EDE chain', 'encrypt · decrypt · encrypt', 'internal'),
        ]
      }
      case 'tdes-result': {
        const hex = String(v.hex ?? '').toUpperCase()
        return merge(
          ...hexStrip('out', hex, 'output', [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate('cap', [0, 2.1, 0], v.decrypt ? 'plaintext' : 'ciphertext', hex, 'output', { emphasize: true }),
        )
      }
      default:
        return []
    }
  },
)
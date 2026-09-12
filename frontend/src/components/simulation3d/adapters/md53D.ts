import { md5Engine } from '../../simulation/renderers/md5'
import { valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene, msgInputScene, padRowsScene, roundRingScene, wordLaneScene } from './hash3d'

export const md5Adapter: Simulation3DAdapter = createAdapterFromEngine(
  md5Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'md5-input':
        return msgInputScene(String(v.text ?? ''), String(v.hex ?? ''))
      case 'md5-padding':
        return [
          ...padRowsScene((v.blocksHex as string[]) ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate('padcap', [0, 1.6, -4.4], 'padding', `${Number(v.blockCount)} block(s) · ${Number(v.padBytes)} pad bytes`, 'key'),
        ]
      case 'md5-rounds': {
        const groups: ResolvedObject3D[] = []
        ;['F', 'G', 'H', 'I'].forEach((fn, gi) => {
          const ring = roundRingScene(`md5-${fn}`, 16, {
            radius: 3.2,
            note: `R${gi + 1} · ${fn}`,
            tone: 'transform',
          })
          const shift: [number, number, number] = [(gi - 1.5) * 7.6, 0, 0]
          ring.forEach((o) => {
            const p = o.position
            groups.push({ ...o, position: [p[0] + shift[0], p[1], p[2]] })
          })
        })
        groups.push(...valuePlate('rounds-cap', [0, 4.4, 0], '1st pass', '4 × 16 steps = 64', 'internal'))
        return groups
      }
      case 'md5-state':
        return [
          ...wordLaneScene('h0', (v.hInit as string[]) ?? [], 'input', [0, 0.4, -2.4]),
          ...valuePlate('hstate', [0, 2.5, 2.8], 'state', 'A B C D · 32-bit words', 'internal'),
        ]
      case 'md5-digest':
        return digestScene(String(v.digest ?? ''), 'MD5')
      default:
        return []
    }
  },
)
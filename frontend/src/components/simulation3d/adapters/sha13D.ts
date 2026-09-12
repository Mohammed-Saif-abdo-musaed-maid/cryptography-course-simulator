import { sha1Engine } from '../../simulation/renderers/sha1'
import { arrow, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene, msgInputScene, padRowsScene, roundRingScene, wordLaneScene } from './hash3d'

export const sha1Adapter: Simulation3DAdapter = createAdapterFromEngine(
  sha1Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'sha1-input':
        return msgInputScene(String(v.text ?? ''), String(v.hex ?? ''))
      case 'sha1-padding':
        return [
          ...padRowsScene((v.blocksHex as string[]) ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate('padcap', [0, 1.6, -4.4], 'padding', `${Number(v.blockCount)} block(s) · ${Number(v.padBytes)} pad bytes`, 'key'),
        ]
      case 'sha1-rounds':
        return roundRingScene('sha1-rt', 80, { radius: 7.4, note: 'f₀..f₇₉' })
      case 'sha1-state': {
        const hInit = (v.hInit as string[]) ?? []
        const hFinal = (v.hFinal as string[]) ?? []
        return [
          ...wordLaneScene('h0', hInit, 'input', [0, 0.4, -3.4]),
          arrow('s1', [0, 0.5, -2.2], [0, 0.5, -1.1], 'path'),
          ...wordLaneScene('h1', hFinal, 'transform', [0, 0.4, 0.6]),
          ...valuePlate('hstate', [0, 2.4, 3.4], 'state', 'h0..h4 (160-bit)', 'internal'),
        ]
      }
      case 'sha1-digest':
        return digestScene(String(v.digest ?? ''), 'SHA-1')
      default:
        return []
    }
  },
)
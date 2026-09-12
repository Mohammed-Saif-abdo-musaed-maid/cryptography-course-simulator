import { blake2Engine } from '../../simulation/renderers/blake2'
import { gridObject, hexStrip, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene, msgInputScene, roundRingScene, wordLaneScene } from './hash3d'

export const blake2Adapter: Simulation3DAdapter = createAdapterFromEngine(
  blake2Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'blake2-input':
        return [
          ...msgInputScene(String(v.text ?? ''), String(v.hex ?? '')),
          ...valuePlate('variant', [0, 2.6, 4.2], 'variant', `blake2${String(v.variant)} · ${Number(v.rounds)} rounds`, 'key'),
        ]
      case 'blake2-param': {
        const hInit = (v.hInit as string[]) ?? []
        return [
          ...hexStrip('param-word', String(v.param ?? ''), 'key', [0, 0.6, -2.6], { piece: 8, cellSize: 0.85 }).objects,
          ...valuePlate('param-cap', [0, 2.7, -2.4], 'parameter word', `h[0] ⊕ 0x${String(v.param ?? '')}`, 'key'),
          ...wordLaneScene('h0', hInit, 'internal', [0, 0.4, 2.4]),
          ...valuePlate('ivistate', [0, 2.5, 2.6], 'initial h', 'IV with parameter word folded in', 'internal'),
        ]
      }
      case 'blake2-state': {
        const list = (v.v as string[]) ?? []
        const full = list.length === 16
        const rows = full ? [list.slice(0, 8), list.slice(8, 16)] : []
        return [
          gridObject(
            'v-state',
            rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: 'internal' }))),
            { cellSize: 1.15, gap: 0.1, labelScale: 0.75, height: 1.3 },
          ),
          ...valuePlate('velse', [0, 2.6, -3.8], 'v[0..15]', 'h ⊕ IV · IV[12..15] counter bytes', 'internal'),
        ]
      }
      case 'blake2-rounds': {
        const rounds = Number(v.rounds ?? 12)
        const sigma = (v.sigma as number[][]) ?? []
        return [
          ...roundRingScene('blake2-rt', rounds, { radius: 6.2, tone: 'transform' }),
          gridObject(
            'sigma',
            sigma.map((r) => r.slice(0, 8).map((n) => ({ label: String(n), tone: 'key' }))),
            { cellSize: 0.62, gap: 0.08, labelScale: 0.8, height: 0.9 },
          ),
          ...valuePlate('sigma-cap', [0, 2.5, -5.4], 'σ message schedule', 'G mixers use σ[r] rows', 'key'),
        ]
      }
      case 'blake2-digest':
        return digestScene(String(v.digest ?? ''), `blake2${String(v.variant ?? '')}`)
      default:
        return []
    }
  },
)
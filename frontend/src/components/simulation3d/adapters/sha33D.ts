import { sha3Engine } from '../../simulation/renderers/sha3'
import { hexStrip, rows3D, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene, lanesScene, msgInputScene } from './hash3d'

export const sha3Adapter: Simulation3DAdapter = createAdapterFromEngine(
  sha3Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'sha3-input':
        return [
          ...msgInputScene(String(v.text ?? ''), String(v.hex ?? '')),
          ...valuePlate('rate-cap', [0, 2.6, 4.2], 'sponge', `rate ${Number(v.rate)} · capacity ${200 - Number(v.rate)}`, 'key'),
        ]
      case 'sha3-sponge':
        return [
          ...lanesScene('sponge', { rateLanes: Number(v.rate) / 8 }),
          ...valuePlate('sponge-cap', [0, 3.2, 0], 'rate region', `${Number(v.rate)} bytes · rest capacity (${Number(v.capacity)})`, 'transform'),
          ...valuePlate('sponge-note', [0, -2.6, 4.6], 'note', 'structural 5×5 lane grid · real words appear in absorb / squeeze', 'muted'),
        ]
      case 'sha3-absorb': {
        const absorb = (v.absorb ?? []) as Array<{ block_index: number; lanes_xor: string[] }>
        const hasResult = Boolean(v.hasResult)
        const rateLanes = Number(v.rateLanes ?? v.rate) % 25 || 17
        if (!hasResult || absorb.length === 0) {
          const rows = Array.from({ length: Math.max(1, Number(v.blocks)) }, (_, i) => ({
            label: `block ${i}`,
            cells: Array.from({ length: Math.min(25, Math.max(rateLanes, 1)) }, () => ({ label: '·', tone: 'muted' as const })),
          }))
          return [
            ...rows3D(rows, [0, 0, 0], { rowStep: 2.4, cellSize: 0.7, gap: 0.12 }).objects,
            ...valuePlate('absorb-cap', [0, 2.2, -4], 'absorb', `${Number(v.blocks)} block(s) · rate ${Number(v.rate)}`, 'key'),
            ...valuePlate('absorb-note', [0, -2, 4.4], 'note', 'placeholder · run the algorithm to see the real absorbed blocks', 'muted'),
          ]
        }
        const objs: ResolvedObject3D[] = []
        absorb.forEach((b, i) => {
          const z = (i - (absorb.length - 1) / 2) * 2.6
          const lanes = (b.lanes_xor ?? []).map((w) => w.toUpperCase())
          if (lanes.length) {
            objs.push(
              ...hexStrip(`ab-${i}`, lanes.join(''), 'transform', [0, 0.3, z], {
                piece: 8,
                cellSize: 0.72,
                gap: 0.06,
              }).objects,
            )
          }
          objs.push(...valuePlate(`abc-${i}`, [0, 2, z], `block ${b.block_index}`, '⊕ into rate region', 'internal'))
        })
        return objs
      }
      case 'sha3-squeeze': {
        const state = (v.state as string[]) ?? []
        return [
          ...lanesScene('squeeze', { values: state.length === 25 ? state : undefined, tone: 'internal' }),
          ...valuePlate('squeeze-cap', [0, 3.4, 0], 'Keccak-f', 'permute ×24, then squeeze', 'internal'),
          ...valuePlate('out-len', [0, -1.4, 5], 'digest bytes', String(v.digestBytes ?? ''), 'output'),
          ...(state.length !== 25
            ? valuePlate('squeeze-note', [0, -3, 4.6], 'note', 'placeholder lanes · run the algorithm to see the real permuted state', 'muted')
            : []),
        ]
      }
      case 'sha3-digest':
        return digestScene(String(v.digest ?? ''), 'SHA-3')
      default:
        return []
    }
  },
)
import { hkdfEngine } from '../../simulation/renderers/hkdf'
import { arrow, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

export const hkdfAdapter: Simulation3DAdapter = createAdapterFromEngine(
  hkdfEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'hkdf-input':
        return [
          ...hexStrip('salt', String(v.saltHex ?? '').toUpperCase(), 'input', [0, 0.4, -1.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('ikmcap', [0, 2.6, -3], 'ikm', `${Number(v.ikmLen)} bytes`, 'key'),
          ...valuePlate('info', [0, -1.3, 2.8], 'info · output', `${Number(v.infoLen)} bytes · ${Number(v.length)} out`, 'transform'),
        ]
      case 'hkdf-extract': {
        const prk = String(v.prk ?? '')
        return [
          ...hexStrip('salt', String(v.saltHex ?? '').toUpperCase(), 'key', [0, 0.4, -2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('xop', [0, 1.6, -0.2], 'PRK', 'HMAC-SHA-256(salt, ikm)', 'key'),
          arrow('xa', [0, 0.5, 0.4], [0, 0.5, 1.4], 'path'),
          ...hexStrip('prk', prk.toUpperCase(), 'internal', [0, 0.4, 2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('prkcap', [0, 2.5, 2.6], 'PRK', '32 bytes', 'internal', { emphasize: true }),
        ]
      }
      case 'hkdf-expand': {
        const blocks = (v.blocks as string[]) ?? []
        const shown = blocks.slice(0, 6)
        const objs: ResolvedObject3D[] = []
        shown.forEach((b, i) => {
          objs.push(
            ...hexStrip(`t${i}`, b.toUpperCase(), 'transform', [0, 0.4, i * 2.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            ...valuePlate(`tc${i}`, [0, 2.4, i * 2.4], `T${i + 1}`, 'HMAC(PRK, T·info·counter)', 'muted'),
          )
        })
        objs.push(
          ...valuePlate('expand-cap', [0, 4, shown.length * 2.2], 'expand', `${Number(blocks.length)} block(s)`, 'internal'),
          ...(blocks.length > shown.length
            ? valuePlate('more', [0, -1.4, shown.length * 2.2], 'not drawn', `+${blocks.length - shown.length} more block(s)`, 'muted')
            : []),
        )
        return objs
      }
      case 'hkdf-concat': {
        const blocks = (v.blocks as string[]) ?? []
        const outHex = String(v.outHex ?? '')
        const objs: ResolvedObject3D[] = []
        blocks.forEach((b, i) => {
          objs.push(...hexStrip(`tb${i}`, b.toUpperCase(), 'internal', [-3.6, 0.4, i * 2.2], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects)
        })
        const zMid = Math.max(1, blocks.length) * 2.2
        objs.push(
          arrow('ca', [0, 0.4, zMid - 1], [2.6, 0.4, zMid - 0.2], 'path'),
          ...hexStrip('okm', outHex.toUpperCase(), 'output', [3.6, 0.4, zMid - 0.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('okmcap', [3.6, 2.5, zMid - 0.2], 'OKM', `first ${Number(v.length)} bytes`, 'output', { emphasize: true }),
        )
        return objs
      }
      case 'hkdf-result':
        return digestScene(String(v.outHex ?? ''), 'HKDF')
      default:
        return []
    }
  },
)
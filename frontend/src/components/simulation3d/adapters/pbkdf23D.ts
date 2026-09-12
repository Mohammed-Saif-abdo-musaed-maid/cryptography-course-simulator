import { pbkdf2Engine } from '../../simulation/renderers/pbkdf2'
import { arrow, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

export const pbkdf2Adapter: Simulation3DAdapter = createAdapterFromEngine(
  pbkdf2Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'pbkdf2-input':
        return [
          ...hexStrip('salt', String(v.saltHex ?? '').toUpperCase(), 'input', [0, 0.4, -1.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('pwcap', [0, 2.5, -2.6], 'password', `${Number(v.pwBytes)} bytes`, 'input'),
          ...valuePlate('saltcap', [0, -1.1, 2.6], 'salt', `${Number(v.saltLen)} bytes`, 'input'),
        ]
      case 'pbkdf2-params':
        return [
          ...valuePlate('p1', [-5.4, 0.6, 0], 'PRF', 'HMAC-SHA-256', 'key'),
          ...valuePlate('p2', [-1.8, 0.6, 0], 'iterations', String(v.iterations ?? ''), 'key', { emphasize: true }),
          ...valuePlate('p3', [2.4, 0.6, 0], 'hash size', '32 bytes', 'internal'),
          ...valuePlate('p4', [6, 0.6, 0], 'output', `${Number(v.blocks)} × 32 → ${Number(v.keyLength)} bytes`, 'transform'),
        ]
      case 'pbkdf2-u1':
        return [
          ...hexStrip('u1', String(v.u1 ?? '').toUpperCase(), 'transform', [0, 0.4, -1.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('u1cap', [0, 2.3, 2], 'U1', 'HMAC(password, salt ∥ 0x00000001)', 'internal'),
        ]
      case 'pbkdf2-loop': {
        const rows = (v.rows ?? []) as Array<{ n: number; u: string; xor: string }>
        const finalBlock = String(v.finalBlock ?? '')
        const more = Number(v.more ?? 0)
        const objs: ResolvedObject3D[] = []
        rows.forEach((r, i) => {
          const z = i * 3.8
          objs.push(
            ...hexStrip(`u${r.n}`, r.u.toUpperCase(), 'transform', [-3.2, 0.4, z], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            ...hexStrip(`t${r.n}`, r.xor.toUpperCase(), 'internal', [3.4, 0.4, z], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
            arrow(`ua${r.n}`, [0, 0.4, z], [2.2, 0.4, z], 'path'),
            ...valuePlate(`rc${r.n}`, [0, 2.4, z], `U${r.n}`, `T = ⊕ U1..U${r.n}`, 'muted'),
          )
        })
        objs.push(
          arrow('fa', [0, 0.4, rows.length * 3.8 + 0.4], [0, 0.4, rows.length * 3.8 + 2.6], 'path'),
          ...hexStrip('final', finalBlock.toUpperCase(), 'output', [0, 0.4, rows.length * 3.8 + 3.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('loopcap', [0, 2.6, rows.length * 3.4], 'DK block', `${Number(v.iterations)} iterations · ⊕ of all U`, 'output'),
          ...(more > 0 ? valuePlate('morecap', [0, -1.6, rows.length * 3.4], 'not drawn', `+${more} more iterations`, 'muted') : []),
        )
        return objs
      }
      case 'pbkdf2-assemble': {
        const blockDigests = (v.blockDigests as string[]) ?? []
        const dkHex = String(v.dkHex ?? '')
        const objs: ResolvedObject3D[] = []
        blockDigests.forEach((b, i) => {
          objs.push(
            ...hexStrip(`blk${i}`, b.toUpperCase(), 'internal', [-2.4, 0.4, i * 2.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
            ...valuePlate(`blklab${i}`, [-2.4, 2.4, i * 2.6], `block ${i + 1}`, `${b.length / 2} bytes`, 'internal'),
          )
        })
        const zEnd = Math.max(1, blockDigests.length) * 2.6
        objs.push(
          arrow('ca', [0.4, 0.4, zEnd - 1.3], [2.8, 0.4, zEnd + 0.5], 'path'),
          ...hexStrip('dk', dkHex.toUpperCase(), 'output', [3.4, 0.4, zEnd + 0.7], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('dkcap', [3.8, 2.4, zEnd + 1.2], 'derived key', `${Number(v.keyLength)} bytes`, 'output', { emphasize: true }),
        )
        return objs
      }
      case 'pbkdf2-result':
        return digestScene(String(v.dkHex ?? ''), 'PBKDF2')
      default:
        return []
    }
  },
)
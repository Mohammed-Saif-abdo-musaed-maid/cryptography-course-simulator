import { argon2Engine } from '../../simulation/renderers/argon2'
import { arrow, gridObject, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

export const argon2Adapter: Simulation3DAdapter = createAdapterFromEngine(
  argon2Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'argon2-input':
        return [
          ...valuePlate('pw', [0, 0.6, -2], 'password', `${Number(v.passwordBytes)} bytes`, 'input', { emphasize: true }),
          ...valuePlate('variant', [-4.2, 0.6, 1.6], 'variant', String(v.variant ?? ''), 'key'),
          ...valuePlate('t', [0.4, 0.6, 1.6], 't · m · p', `${Number(v.t)} · ${Number(v.m)} KiB · ${Number(v.p)}`, 'key'),
        ]
      case 'argon2-params':
        return [
          ...valuePlate('mem', [-2, 0.6, 0], 'memory', `${Number(v.m)} KiB ≈ ${Number(v.memoryMiB)} MiB`, 'key', { emphasize: true }),
          ...valuePlate('blocks', [3, 0.6, -0.6], 'blocks', `${Number(v.blocks)} × 1 KiB`, 'internal'),
          ...valuePlate('cells', [3, -0.7, 1.2], 'grid cells', `${Number(v.cells)} (≈4 KiB each)`, 'internal'),
        ]
      case 'argon2-core': {
        const grid = (v.grid as (string | number)[][]) ?? []
        return [
          gridObject(
            'matrix',
            grid.map((r) => r.map(() => ({ label: 'G', tone: 'transform' }))),
            { cellSize: 0.85, gap: 0.14, labelScale: 0.8, height: 1.1 },
          ),
          ...valuePlate('matrix-cap', [0, 2.9, -4], 'matrix', `${Number(v.p)} lanes × ${Number(v.t)} passes`, 'transform'),
          ...valuePlate('per-block', [0, -1.3, 4.8], 'per pass', `${Number(v.m)} blocks · BLAKE2b compression`, 'internal'),
        ]
      }
      case 'argon2-tag':
        return [
          ...valuePlate('fc', [-3.8, 0.6, 0], 'final column', 'XOR of last blocks per lane', 'internal'),
          arrow('ta', [-1.6, 0.6, 0], [-0.6, 0.6, 0], 'path'),
          ...valuePlate('tag', [1.6, 0.6, 0], 'tag', `${Number(v.hashLength)} bytes · BLAKE2b`, 'transform', { emphasize: true }),
        ]
      case 'argon2-result': {
        const tag = String(v.tag ?? '')
        if (tag) return digestScene(tag, `${String(v.variant ?? 'argon2id')}`)
        return valuePlate('phc', [0, 0.6, 0], 'PHC hash', 'run the operation to bind real tag', 'output')
      }
      default:
        return []
    }
  },
)
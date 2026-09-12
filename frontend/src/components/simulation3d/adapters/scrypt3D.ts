import { scryptEngine } from '../../simulation/renderers/scrypt'
import { arrow, gridObject, hexStrip, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

function sampleGridObject(id: string, matrix: (string | number)[][], active: [number, number]) {
  return gridObject(
    id,
    matrix.map((row, r) =>
      row.map((cell, c) => ({
        label: String(cell),
        tone: (r === active[0] && c === active[1] ? 'active' : 'muted') as 'active' | 'muted',
      })),
    ),
    { cellSize: 0.36, gap: 0.035, labelScale: 0.65, height: 0.8 },
  )
}

export const scryptAdapter: Simulation3DAdapter = createAdapterFromEngine(
  scryptEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'scrypt-input':
        return [
          ...hexStrip('salt', String(v.saltHex ?? '').toUpperCase(), 'input', [0, 0.4, -1.6], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('pwcap', [0, 2.5, -2.8], 'password', `${Number(v.pwBytes)} bytes`, 'input'),
          ...valuePlate('saltcap', [0, -1.2, 2.8], 'salt', `${Number(v.saltLen)} bytes`, 'input'),
        ]
      case 'scrypt-params':
        return [
          ...valuePlate('n1', [-5, 0.6, 0], 'N', String(v.n ?? ''), 'key', { emphasize: true }),
          ...valuePlate('n2', [0, 0.6, 0], 'memory', `${Number(v.memoryKiB)} KiB ≈ ${Number(v.memoryMiB)} MiB`, 'transform'),
          ...valuePlate('n3', [5, 0.6, 0], 'block', `${Number(v.blockSize)} bytes (128·r)`, 'internal'),
          sampleGridObject('mem-map', (v.grid as (string | number)[][]) ?? [], [4, 6]),
        ]
      case 'scrypt-pre':
        return [
          ...valuePlate('p1', [-2.5, 0.6, 0], 'PBKDF2', 'HMAC-SHA-256 · 1 iteration', 'transform'),
          arrow('pa', [-0.4, 0.6, 0], [0.6, 0.6, 0], 'path'),
          ...valuePlate('p2', [2.4, 0.6, 0], 'initial blocks', `${Number(v.p)} lane(s) × ${Number(v.blockSize)} bytes`, 'internal'),
        ]
      case 'scrypt-romix': {
        return [
          sampleGridObject('romix-map', (v.grid as (string | number)[][]) ?? [], [2, 3]),
          ...valuePlate('romix', [0, 2.8, -3], 'ROMix', `${Number(v.n)} blocks · Salsa20/8 · memory-hard`, 'internal'),
          ...valuePlate('mem', [0, -1.2, 4.6], 'working set', `${Number(v.memoryKiB)} KiB ≈ ${Number(v.memoryMiB)} MiB`, 'transform'),
        ]
      }
      case 'scrypt-post':
        return [
          ...valuePlate('p1', [-3.6, 0.6, 0], 'PBKDF2', 'final pass', 'transform'),
          arrow('pa', [-1.9, 0.6, 0], [-1, 0.6, 0], 'path'),
          ...valuePlate('p2', [1, 0.6, 0], 'mix lanes', `${Number(v.p)} lane(s)`, 'internal'),
          arrow('pb', [2.2, 0.6, 0], [3, 0.6, 0], 'path'),
          ...valuePlate('p3', [4, 0.6, 0], 'truncate', `first ${Number(v.keyLength)} bytes`, 'transform'),
        ]
      case 'scrypt-result': {
        const keyHex = String(v.keyHex ?? '')
        if (keyHex) return digestScene(keyHex, 'scrypt')
        return valuePlate('sc', [0, 0.6, 0], 'derived key', 'run the operation to bind the real key', 'output')
      }
      default:
        return []
    }
  },
)
import { elgamalEngine } from '../../simulation/renderers/elgamal'
import { arrow, charRow, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const elgamalAdapter: Simulation3DAdapter = createAdapterFromEngine(
  elgamalEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'elgamal-keygen':
        return [
          ...valuePlate('p', [-5, 0.8, 0], 'p', String(v.p ?? ''), 'internal'),
          ...valuePlate('g', [-1.6, 0.8, 0], 'g', String(v.g ?? ''), 'internal'),
          ...valuePlate('x', [1.8, 0.8, 0], 'x (private)', String(v.x ?? ''), 'key'),
          arrow('kg1', [-0.2, 0.8, 0], [1, 0.8, 0], 'path'),
          arrow('kg2', [3.4, 0.8, 0], [4.4, 0.8, 0], 'path'),
          ...valuePlate('y', [6.2, 0.8, 0], 'y (public)', `g^x mod p = ${String(v.y ?? '')}`, 'output', { emphasize: true }),
        ]
      case 'elgamal-encode': {
        const message = String(v.message ?? '').toUpperCase()
        return [
          ...charRow('msg', message.split('').map((ch) => ({ label: ch, tone: 'input' })), [0, 0.7, -2], { cellSize: 0.74, gap: 0.09 }).objects,
          arrow('e1', [0, 0.7, -0.4], [0, 0.7, 0.9], 'path'),
          ...valuePlate('m', [0, 0.7, 2.6], 'M (integer)', String(v.m ?? ''), 'output', { emphasize: true }),
          ...valuePlate('enc-cap', [0, 3, -2.6], 'encoding', 'letters → base-27 integer', 'input'),
        ]
      }
      case 'elgamal-ephemeral':
        return [
          ...valuePlate('k', [0, 1.2, -2], 'k (ephemeral)', String(v.k ?? ''), 'key', { emphasize: true }),
          ...valuePlate('g', [-4, -0.5, 2], 'g', String(v.g ?? ''), 'internal'),
          ...valuePlate('k2', [0, -0.5, 2], 'k', String(v.k ?? ''), 'key'),
          ...valuePlate('p', [4, -0.5, 2], 'p', String(v.p ?? ''), 'internal'),
        ]
      case 'elgamal-encrypt':
        return [
          ...valuePlate('c1', [-4.6, 1.1, -1.4], 'c1 = g^k mod p', String(v.c1 ?? ''), 'transform', { emphasize: true }),
          arrow('c1b', [-2, 1.1, -1.4], [-0.8, 1.1, -1.4], 'path'),
          ...valuePlate('c2', [2.6, 1.1, -1.4], 'c2 = m·y^k mod p', String(v.c2 ?? ''), 'output', { emphasize: true }),
          ...valuePlate('y', [-4, -1.2, 2.4], 'y', String(v.y ?? ''), 'key'),
          ...valuePlate('k', [0, -1.2, 2.4], 'k', String(v.k ?? ''), 'key'),
          ...valuePlate('m', [4, -1.2, 2.4], 'm', String(v.m ?? ''), 'input'),
          ...(Boolean(v.bound) ? valuePlate('src', [0, 3, -3], 'source', 'backend cipher (bound)', 'muted') : []),
        ]
      case 'elgamal-decrypt':
        return [
          ...valuePlate('c1', [-5.2, 1, -1.2], 'c1', String(v.c1 ?? ''), 'transform'),
          ...valuePlate('c2', [-0.6, 1, -1.2], 'c2', String(v.c2 ?? ''), 'transform'),
          arrow('d1', [1.4, 0.4, 0.4], [3, 0.4, 0.4], 'path'),
          ...valuePlate('m', [5, 1.4, 1.4], "M' (integer)", v.m != null ? String(v.m) : '-', 'output', { emphasize: true }),
          ...valuePlate('dop', [1.4, -1.3, 3.4], 'decrypt', 'm = c2 · c1^-x mod p', 'path'),
        ]
      case 'elgamal-formula':
        return [
          ...valuePlate('y', [-5, 1, -0.6], 'y', `g^x mod p = ${String(v.y ?? '')}`, 'output'),
          ...valuePlate('c1', [0, 1, 0.6], 'c1', 'g^k mod p', 'transform'),
          ...valuePlate('c2', [5, 1, -0.6], 'c2', 'm · y^k mod p', 'output'),
          ...valuePlate('edu', [0, -1.9, 4], 'educational', 'small teaching parameters only', 'muted'),
        ]
      default:
        return []
    }
  },
)
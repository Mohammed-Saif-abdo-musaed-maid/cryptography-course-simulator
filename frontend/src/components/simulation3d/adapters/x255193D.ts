import { x25519Engine } from '../../simulation/renderers/x25519'
import { arrow, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const x25519Adapter: Simulation3DAdapter = createAdapterFromEngine(
  x25519Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'x25519-curve':
        return [
          ...valuePlate('curve', [0, 0.8, -2.4], 'curve', 'Curve25519 (Montgomery)', 'internal', { emphasize: true }),
          ...valuePlate('form', [-4.4, 0, 1], 'form', 'y² = x³ + 486662·x² + x', 'internal'),
          ...valuePlate('base', [4.6, 0, 1], 'base point', 'u = 9 (x only)', 'key'),
          ...valuePlate('p', [0, -1.4, 3.6], 'field prime p', '2²⁵⁵ − 19', 'internal'),
        ]
      case 'x25519-keys': {
        const aPriv = String(v.aPriv ?? '')
        const bPriv = String(v.bPriv ?? '')
        const aPub = String(v.aPub ?? '')
        const bPub = String(v.bPub ?? '')
        return [
          ...card('alice', [-7, 0, 0], [
            ...valuePlate('ap', [-7, 2.1, -3.6], 'Alice', 'private → public', 'key'),
            ...hexStrip('aPriv', aPriv.toUpperCase(), 'key', [-7, 0.6, -3.8], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            arrow('a1', [-7, 0.6, -0.8], [-7, 0.6, 0.6], 'path'),
            ...valuePlate('aPub', [-7, 0.4, 2.6], 'public', aPub.includes('x25') ? aPub : `${aPub.slice(0, 32)}…`, 'output'),
          ]),
          ...card('bob', [7, 0, 0], [
            ...valuePlate('bp', [7, 2.1, -3.6], 'Bob', 'private → public', 'key'),
            ...hexStrip('bPriv', bPriv.toUpperCase(), 'key', [7, 0.6, -3.8], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
            arrow('b1', [7, 0.6, -0.8], [7, 0.6, 0.6], 'path'),
            ...valuePlate('bPub', [7, 0.4, 2.6], 'public', bPub.includes('x25') ? bPub : `${bPub.slice(0, 32)}…`, 'output'),
          ]),
          arrow('wire', [-2, 0.4, 0], [2, 0.4, 0], 'path'),
          ...valuePlate('op', [0, 2.6, 0], 'X25519', 'clamp → scalar mult → u-coordinate', 'transform'),
        ]
      }
      case 'x25519-ladder':
        return [
          ...valuePlate('ca', [-4, 0.9, -1.6], 'Alice clamp', String(v.clampA ?? ''), 'transform'),
          ...valuePlate('cb', [4, 0.9, -1.6], 'Bob clamp', String(v.clampB ?? ''), 'transform'),
          {
            id: 'ladder',
            kind: 'ring',
            position: [0, 0, 1.2],
            ringRadius: 2.4,
            ringTube: 0.1,
            tone: 'path',
          },
          {
            id: 'ladder-dot',
            kind: 'sphere',
            position: [2.2, 0.6, 0.7],
            size: [0.4, 0.4, 0.4],
            tone: 'active',
            emphasize: true,
          },
          ...valuePlate('ladder-op', [0, -1.2, 4], 'Montgomery ladder', '[1,u,1] → iterations → u', 'internal'),
        ]
      case 'x25519-shared': {
        const shared = v.shared ? String(v.shared) : null
        return [
          ...card('alice', [-7, 0, 0], valuePlate('Sa', [-7, 0.7, 0], 'S = X25519(a, B)', shared ? `${shared.slice(0, 16)}…` : 'X25519(a,B)', 'output')),
          ...card('bob', [7, 0, 0], valuePlate('Sb', [7, 0.7, 0], 'S = X25519(b, A)', shared ? `${shared.slice(0, 16)}…` : 'X25519(b,A)', 'output')),
          arrow('wa', [-4.4, 0.6, -0.6], [-2.6, 0.6, -0.6], 'path'),
          arrow('wb', [2.6, 0.6, 0.6], [4.4, 0.6, 0.6], 'path'),
          ...(shared
            ? [
                ...hexStrip('shared', shared.toUpperCase(), 'output', [0, 0.3, 3], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
                ...valuePlate('sharedcap', [0, 2.3, 3], 'shared secret', '32 bytes', 'output', { emphasize: true }),
              ]
            : valuePlate('sharedcap', [0, 1.2, 3], 'shared secret', 'binding unavailable in demo', 'muted')),
        ]
      }
      default:
        return []
    }
  },
)

function card(prefix: string, origin: [number, number, number], inner: ResolvedObject3D[]): ResolvedObject3D[] {
  return [
    {
      id: `${prefix}-bg`,
      kind: 'box',
      position: [origin[0], -0.2, -3.6],
      size: [4.4, 0.16, 9],
      tone: prefix === 'alice' ? 'input' : 'key',
      opacity: 0.12,
    },
    ...inner,
  ]
}
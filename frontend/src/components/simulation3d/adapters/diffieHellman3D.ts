import { diffieHellmanEngine } from '../../simulation/renderers/diffieHellman'
import { arrow, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const diffieHellmanAdapter: Simulation3DAdapter = createAdapterFromEngine(
  diffieHellmanEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'dh-error':
        return [...valuePlate('err', [0, 1.2, 0], 'invalid parameters', String(v.reason ?? ''), 'error', { emphasize: true })]
      case 'dh-params':
        return [
          ...valuePlate('p', [-4, 1.2, 0], 'p (prime)', String(v.p ?? ''), 'internal'),
          ...valuePlate('g', [4, 1.2, 0], 'g (generator)', String(v.g ?? ''), 'key'),
          ...valuePlate('pub', [0, -1.6, 3], 'public domain', 'shared by both parties', 'muted'),
        ]
      case 'dh-party': {
        const name = String(v.name ?? '')
        const priv = String(v.priv ?? '')
        const pub = String(v.pub ?? '')
        return [
          {
            id: `dhp-${name.toLowerCase()}-bg`,
            kind: 'box',
            position: [-4.6, -0.3, 0.6],
            size: [4.6, 0.16, 8.6],
            tone: 'internal',
            opacity: 0.14,
          },
          ...valuePlate(`dhp-${name.toLowerCase()}-name`, [-4.6, 2.4, -3], 'party', name, 'path'),
          ...valuePlate(`dhp-${name.toLowerCase()}-priv`, [-4.6, 1, -1], 'private', priv, 'key'),
          arrow(`dhp-${name.toLowerCase()}-ar`, [-5.6, 0.4, 0.5], [-3.6, 0.4, 0.5], 'path'),
          ...valuePlate(`dhp-${name.toLowerCase()}-op`, [-4.6, 0.4, 2.4], 'compute', 'g^priv mod p', 'transform'),
          ...valuePlate(`dhp-${name.toLowerCase()}-pub`, [-4.6, 0.4, 4.8], 'public', pub, 'output', { emphasize: true }),
        ]
      }
      case 'dh-exchange': {
        const A = String(v.A ?? '')
        const B = String(v.B ?? '')
        const card = (prefix: string, origin: [number, number, number]): ResolvedObject3D[] => [
          {
            id: `${prefix}-bg`,
            kind: 'box',
            position: [origin[0], -0.3, 0.6],
            size: [4.6, 0.16, 8.6],
            tone: prefix === 'alice' ? 'input' : 'key',
            opacity: 0.14,
          },
          ...valuePlate(`${prefix}-name`, [origin[0], 2.4, -3], 'party', prefix === 'alice' ? 'Alice' : 'Bob', 'path'),
          ...valuePlate(`${prefix}-pub`, [origin[0], 0.7, 1], 'public', prefix === 'alice' ? A : B, 'output'),
        ]
        return [
          ...card('alice', [-6.4, 0, 0]),
          ...card('bob', [6.4, 0, 0]),
          arrow('xa', [-2.4, 0.6, -0.6], [-0.8, 0.6, -0.6], 'path'),
          arrow('xb', [0.8, 0.6, 0.6], [2.4, 0.6, 0.6], 'path'),
          ...valuePlate('chan', [0, 2.2, -1.6], 'channel', 'public values only', 'muted'),
          ...valuePlate('note', [0, 1, 3.4], 'note', 'private exponents never leave their owners', 'muted'),
        ]
      }
      case 'dh-shared': {
        const s = String(v.s ?? '')
        const match = Boolean(v.match)
        return [
          ...valuePlate('sa', [-5, 1, -0.8], 's = B^a mod p', s, 'output'),
          ...valuePlate('sb', [5, 1, -0.8], 's = A^b mod p', s, 'output'),
          arrow('fa', [-1.6, 0.5, 0.2], [1.6, 0.5, 0.2], 'path'),
          ...valuePlate('sig', [0, -1.4, 3], 'shared secret', match ? `MATCH = ${s}` : s, 'output', { emphasize: true }),
        ]
      }
      default:
        return []
    }
  },
)
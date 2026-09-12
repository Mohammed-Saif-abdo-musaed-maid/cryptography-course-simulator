import { ed25519Engine } from '../../simulation/renderers/ed25519'
import { arrow, charRow, hexStrip, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const ed25519Adapter: Simulation3DAdapter = createAdapterFromEngine(
  ed25519Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'ed25519-keygen': {
        const privateHex = String(v.privateHex ?? '')
        const pubHex = typeof v.pubHex === 'string' ? String(v.pubHex) : null
        return [
          ...(privateHex
            ? [
                ...hexStrip('priv', privateHex.toUpperCase(), 'key', [0, 0.5, -3.8], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
                ...valuePlate('privcap', [0, 2.5, -3.8], 'private key', '32 bytes', 'key'),
              ]
            : [...valuePlate('privcap', [0, 1, -3.4], 'private key', '(blank = auto)', 'key')]),
          arrow('k1', [0, 0.7, -1.4], [0, 0.7, 0], 'path'),
          ...valuePlate('deriv', [0, 0.7, 1.8], 'SHA-512 → clamp → scalar a', '', 'transform'),
          arrow('k2', [0, 0.7, 3.6], [0, 0.7, 5], 'path'),
          ...valuePlate('A', [0, 0.7, 6.4], 'public A = a·B', pubHex ?? 'structural', 'output', { emphasize: true }),
        ]
      }
      case 'ed25519-hash': {
        const message = String(v.message ?? '')
        return [
          ...charRow('msg', message.split('').map((ch) => ({ label: ch, tone: 'input' })), [0, 0.7, -2.4], { cellSize: 0.72, gap: 0.09 }).objects,
          arrow('h1', [0, 0.7, -0.2], [0, 0.7, 1.2], 'path'),
          ...valuePlate('r', [0, 0.7, 2.6], 'nonce r', 'SHA-512(prefix ∥ message)', 'transform', { emphasize: true }),
        ]
      }
      case 'ed25519-derivation':
        return [
          ...valuePlate('R', [-5, 1, -0.6], 'R = r·B', 'curve point', 'internal'),
          ...valuePlate('h', [0, 1, -0.6], 'h = SHA-512(R ∥ A ∥ M)', 'structural', 'transform'),
          ...valuePlate('S', [5, 1, -0.6], 'S = (r + h·a) mod L', 'structural', 'output', { emphasize: true }),
        ]
      case 'ed25519-sign': {
        const rHex = v.rHex ? String(v.rHex) : null
        const sHex = v.sHex ? String(v.sHex) : null
        const sigHex = typeof v.sigHex === 'string' ? String(v.sigHex) : null
        return [
          ...valuePlate('R', [-3.4, 1, -1], 'R (32 bytes)', rHex ?? 'structural', 'output'),
          ...valuePlate('S', [3.4, 1, -1], 'S (32 bytes)', sHex ?? 'structural', 'output'),
          ...(sigHex
            ? [
                ...hexStrip('sig', sigHex.toUpperCase(), 'output', [0, 0.3, 2.4], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
                ...valuePlate('sigcap', [0, 2.5, 2.4], 'signature', '64 bytes', 'output', { emphasize: true }),
              ]
            : []),
        ]
      }
      case 'ed25519-result': {
        const sigHex = typeof v.sigHex === 'string' ? String(v.sigHex) : null
        return [
          ...valuePlate('scheme', [0, 1.4, -2], 'scheme', 'Ed25519 signs — NOT encryption', 'key', { emphasize: true }),
          ...(sigHex
            ? [
                ...hexStrip('sig', sigHex.toUpperCase(), 'output', [0, 0.2, 2.2], { piece: 2, cellSize: 0.4, gap: 0.022 }).objects,
                ...valuePlate('sigcap', [0, 2.4, 2.2], 'signature', '64 bytes', 'output', { emphasize: true }),
              ]
            : valuePlate('sigcap', [0, 0.6, 2.4], 'signature', 'run the operation to bind real signature', 'muted')),
        ]
      }
      default:
        return []
    }
  },
)
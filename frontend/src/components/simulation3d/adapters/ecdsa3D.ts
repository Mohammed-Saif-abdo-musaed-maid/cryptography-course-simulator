import { ecdsaEngine } from '../../simulation/renderers/ecdsa'
import { arrow, charRow, hexStrip, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const ecdsaAdapter: Simulation3DAdapter = createAdapterFromEngine(
  ecdsaEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'ecdsa-keygen':
        return [
          ...valuePlate('curve', [0, 1.2, -2.4], 'curve', String(v.curve ?? ''), 'internal'),
          ...valuePlate('d', [-4.4, 0, 0.4], 'private scalar d', v.priv != null ? String(v.priv) : 'random', 'key'),
          arrow('kg1', [-2.4, 0.5, 0.4], [-0.8, 0.5, 0.4], 'path'),
          ...valuePlate('Q', [2.6, 0.5, 0.4], 'public point Q', 'Q = d·G', 'output', { emphasize: true }),
          ...valuePlate('note', [0, -1.6, 3.6], 'authenticates', 'signs — does NOT encrypt', 'muted'),
        ]
      case 'ecdsa-hash': {
        const message = String(v.message ?? '')
        return [
          ...charRow('msg', message.split('').map((ch) => ({ label: ch, tone: 'input' })), [0, 0.7, -2.6], { cellSize: 0.72, gap: 0.09 }).objects,
          arrow('h1', [0, 0.7, -0.4], [0, 0.7, 1.2], 'path'),
          ...valuePlate('z', [0, 0.7, 2.8], 'z (int digest)', 'SHA-256(msg) mod n', 'transform', { emphasize: true }),
        ]
      }
      case 'ecdsa-sign': {
        const rHex = v.rHex ? String(v.rHex) : null
        const sHex = v.sHex ? String(v.sHex) : null
        const sigHex = typeof v.sigHex === 'string' ? String(v.sigHex) : null
        return [
          ...valuePlate('k', [-5.4, 1, -0.6], 'k', 'random per-message', 'key'),
          ...valuePlate('R', [-1.6, 1, -0.6], 'R = k·G', '(xR, yR)', 'internal'),
          ...valuePlate('r', [2.6, 1, -0.6], 'r = xR mod n', rHex ?? 'structural', 'output'),
          ...valuePlate('s', [6.4, 0.2, -0.6], 's', sHex ?? 'structural', 'output'),
          ...valuePlate('formula', [3, -1.4, 2.4], 's = k⁻¹(z + r·d) mod n', '', 'internal'),
          ...(sigHex
            ? [
                ...hexStrip('sig', sigHex.toUpperCase(), 'output', [0, 0.4, 4.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
                ...valuePlate('sigcap', [0, 2.5, 4.4], 'signature', 'DER hex', 'output', { emphasize: true }),
              ]
            : []),
        ]
      }
      case 'ecdsa-verify': {
        const pubHex = typeof v.pubHex === 'string' ? String(v.pubHex) : null
        return [
          ...valuePlate('verify', [0, 1.2, -2], 'verify', 'w = s⁻¹ · u1 = z·w · u2 = r·w', 'internal'),
          arrow('v1', [0, 1.2, -0.4], [0, 1.2, 1.2], 'path'),
          ...valuePlate('check', [0, 1.2, 2.6], 'P = u1·G + u2·Q', 'OK if P.x mod n == r', 'transform', { emphasize: true }),
          ...(pubHex
            ? [
                ...valuePlate('pubcap', [0, 2.6, 4.4], 'public point', `${pubHex.slice(0, 32)}…`, 'output'),
                ...hexStrip('pub', pubHex.toUpperCase(), 'output', [0, 0.4, 4.4], { piece: 2, cellSize: 0.3, gap: 0.018 }).objects,
              ]
            : []),
        ]
      }
      default:
        return []
    }
  },
)
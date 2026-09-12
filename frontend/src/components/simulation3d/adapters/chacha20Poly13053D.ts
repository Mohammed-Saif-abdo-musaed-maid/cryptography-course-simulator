import { chacha20Poly1305Engine } from '../../simulation/renderers/chacha20Poly1305'
import { hexStrip, merge, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const chacha20Poly13053DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  chacha20Poly1305Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'cp-input': {
        const data = v.decrypt ? String(v.ciphertext ?? '') : String(v.plaintext ?? '')
        const key = String(v.key ?? '')
        const nonce = String(v.nonce ?? '')
        const aad = String(v.aad ?? '')
        return [
          ...(data ? hexStrip('data', v.decrypt ? data.toUpperCase() : data, 'input', [0, 1, -2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : []),
          ...hexStrip('ky', key.toUpperCase(), 'key', [0, 1, -0.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...hexStrip('nc', nonce.toUpperCase(), 'key', [0, 1, 1], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...(aad ? hexStrip('aad', aad, 'internal', [0, 1, 2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : []),
          ...valuePlate('cap', [0, 3.4, 0], 'inputs', v.decrypt ? 'ciphertext ‖ tag' : 'plaintext · key · nonce · aad', 'internal'),
        ]
      }
      case 'cp-stream': {
        const hex = (v.decrypt ? String(v.pt ?? '') : String(v.ct ?? '')) || 'no result yet'
        return [
          ...hexStrip('out', hex.toUpperCase(), 'output', [0, 0.8, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate('op', [0, 3.1, 0], v.decrypt ? 'ChaCha20 decrypt' : 'ChaCha20 encrypt', 'ChaCha20(key, nonce, ctr=1) ⊕ data', 'transform'),
        ]
      }
      case 'cp-mackey': {
        const nonce = String(v.nonce ?? '').toUpperCase()
        return [
          ...hexStrip('nc', nonce, 'key', [0, 0.8, -0.8], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate('rs', [0, 0.6, 1.8], 'one-time key', 'r, s ← ChaCha20 block 0 first 32 bytes', 'key'),
          ...valuePlate('cap', [0, 2.9, 1.8], 'Poly1305 key', 'block 0 → r ‖ s', 'transform'),
        ]
      }
      case 'cp-poly': {
        const aadH = String(v.aadHex ?? '')
        const tagH = String(v.tagHex ?? '')
        return [
          ...(aadH ? hexStrip('aad', aadH.toUpperCase(), 'internal', [0, 0.9, -1.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.55 }).objects : []),
          ...valuePlate('gh', [0, 0.5, 1.4], 'Poly1305(r, s, ·)', 'AAD ‖ ciphertext ‖ len', 'transform'),
          ...valuePlate('tag', [0, -0.4, 3.4], 'tag', tagH.toUpperCase(), 'output', { emphasize: true }),
        ]
      }
      case 'cp-verify': {
        const auth = String(v.auth ?? '')
        const passed = auth === 'PASS'
        const tagH = String(v.tagHex ?? '').toUpperCase()
        return merge(
          ...valuePlate('auth', [0, 0.4, 0], 'authentication', passed ? 'PASS' : v.decrypt ? 'verify tag first' : 'tag ready', passed ? 'output' : v.decrypt ? 'error' : 'internal', { emphasize: true }),
          ...valuePlate('tag', [0, -2, 0], 'tag', tagH, 'output'),
          ...valuePlate('note', [0, 2.9, 0], 'timing-safe', 'constant-time compare', 'muted'),
        )
      }
      case 'cp-result': {
        const hex = String(v.out ?? '').toUpperCase()
        return merge(
          ...hexStrip('out', hex, 'output', [0, 0.6, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate('cap', [0, 2.7, 0], v.decrypt ? 'plaintext' : 'ciphertext ‖ tag', hex, 'output', { emphasize: true }),
        )
      }
      default:
        return []
    }
  },
)
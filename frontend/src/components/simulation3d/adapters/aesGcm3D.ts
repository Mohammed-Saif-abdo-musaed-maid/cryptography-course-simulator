import { aesGcmEngine } from '../../simulation/renderers/aesGcm'
import { hexStrip, merge, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const aesGcm3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  aesGcmEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'agcm-input': {
        const data = v.decrypt ? String(v.ciphertext ?? '') : String(v.plaintext ?? '')
        const key = String(v.key ?? '')
        const nonce = String(v.nonce ?? '')
        const aad = String(v.aad ?? '')
        return [
          ...(data ? hexStrip('data', v.decrypt ? data.toUpperCase() : data, 'input', [0, 1, -2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : [quote('nodata', 'no input')]),
          ...hexStrip('ky', key.toUpperCase(), 'key', [0, 1, -0.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...hexStrip('nc', nonce.toUpperCase(), 'key', [0, 1, 1], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.35 }),
          ...(aad ? hexStrip('aad', aad, 'internal', [0, 1, 2.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects : []),
          ...valuePlate('cap', [0, 3.4, 0], 'inputs', v.decrypt ? 'ciphertext ‖ tag' : 'plaintext · key · nonce · aad', 'internal'),
        ]
      }
      case 'agcm-stream': {
        const hex = (v.decrypt ? String(v.pt ?? '') : String(v.ct ?? '')) || 'no result yet'
        return [
          ...hexStrip('out', hex.toUpperCase(), 'output', [0, 0.8, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate('op', [0, 3.1, 0], v.decrypt ? 'AES-CTR decrypt' : 'AES-CTR encrypt', 'CTR keystream ⊕ block', 'transform'),
          ...valuePlate('formula', [0, -1.2, 2.8], 'CTR', 'E_K(counter ‖ nonce) XOR plaintext', 'muted'),
        ]
      }
      case 'agcm-mackey': {
        const nonce = String(v.nonce ?? '').toUpperCase()
        return [
          ...hexStrip('nc', nonce, 'key', [0, 0.8, -0.8], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.4 }),
          ...valuePlate('h', [-4, 0.5, 1.6], 'H subkey', 'AES-encrypt 0¹²⁸', 'internal'),
          ...valuePlate('j0', [4, 0.5, 1.6], 'J0', 'nonce ‖ 0x00000001', 'key'),
          ...valuePlate('cap', [0, 2.8, 1.6], 'GHASH setup', 'H = E_K(0¹²⁸) · J0 = nonce‖1', 'transform'),
        ]
      }
      case 'agcm-ghash': {
        const aadH = String(v.aadHex ?? '')
        const tagH = String(v.tagHex ?? '')
        return [
          ...(aadH ? hexStrip('aad', aadH.toUpperCase(), 'internal', [0, 0.9, -1.4], { piece: 1, cellSize: 0.44, gap: 0.024, glyphY: 1.55 }).objects : []),
          ...valuePlate('gh', [0, 0.5, 1.4], 'GHASH(H, ·)', 'AAD ‖ ciphertext ‖ len', 'transform'),
          ...valuePlate('tag', [0, -0.4, 3.4], 'tag', tagH.toUpperCase(), 'output', { emphasize: true }),
        ]
      }
      case 'agcm-verify': {
        const auth = String(v.auth ?? '')
        const passed = auth === 'PASS'
        const tagH = String(v.tagHex ?? '').toUpperCase()
        return merge(
          ...valuePlate('auth', [0, 0.4, 0], 'authentication', passed ? 'PASS' : v.decrypt ? 'verify tag first' : 'tag ready', passed ? 'output' : v.decrypt ? 'error' : 'internal', { emphasize: true }),
          ...valuePlate('tag', [0, -2, 0], 'tag', tagH, 'output'),
          ...valuePlate('note', [0, 2.9, 0], 'timing-safe', 'constant-time compare', 'muted'),
        )
      }
      case 'agcm-result': {
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

function quote(id: string, text: string) {
  return { id, kind: 'glyph' as const, position: [0, 1, -2.4] as [number, number, number], label: text, glyphScale: 0.9, tone: 'muted' as const }
}
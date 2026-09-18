import { aesCcmEngine } from '../../simulation/renderers/aesCcm'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { arrow, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

export const aesCcm3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  aesCcmEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'agcm-input':
        return [
          ...valuePlate('data', [0, 0.9, -3], B(v.decrypt) ? 'ciphertext (incl. tag)' : 'plaintext', String(B(v.decrypt) ? v.ciphertext : v.plaintext), 'input'),
          ...valuePlate('key', [0, -0.7, -0.4], 'key (AES)', String(v.key), 'key'),
          ...valuePlate('nonce', [0, -1.9, 1.4], 'nonce', String(v.nonce), 'key'),
          ...valuePlate('aad', [0, -3, 2.8], 'AAD', String(v.aad) || '—', 'internal'),
        ]
      case 'aes_ccm-auth':
        return [
          arrow('tagf', [0, 0.3, -3.2], [0, 0.3, -1], 'path'),
          ...valuePlate('aad', [0, -0.4, 1], 'AAD (hex)', B(v.hasResult) ? hexStrOrDash(String(v.aadHex)) : 'run to bind', 'internal'),
          ...valuePlate('tag', [0, -1.9, 3], 'tag τ', B(v.hasTag) ? String(v.tag) : '—', 'output', { emphasize: true }),
        ]
      case 'aes_ccm-stream':
        return [
          arrow('ctrf', [0, 0.3, -2.6], [0, 0.3, 0.2], 'path'),
          ...valuePlate('ct', [0, -0.5, 2], 'ciphertext', B(v.hasResult) ? hexStrOrDash(String(v.ct)) : '—', 'output', { emphasize: true }),
          ...valuePlate('nonce-note', [0, -2.1, 4.4], 'counter blocks', 'ctr0 ‖ ctr1 … start from the nonce', 'internal'),
        ]
      case 'aes_ccm-result':
        if (B(v.hasResult) && B(v.authFail)) {
          return [...valuePlate('auth', [0, 0.6, 0], 'authentication', 'FAILED — no plaintext returned', 'error', { emphasize: true })]
        }
        return [
          ...valuePlate(
            'out',
            [0, 0.6, 0],
            B(v.decrypt) ? 'plaintext' : 'ciphertext ‖ tag',
            B(v.hasResult) ? String(B(v.decrypt) ? v.out : v.combined) : '—',
            B(v.hasResult) ? 'output' : 'muted',
            { emphasize: true },
          ),
        ]
      default:
        return []
    }
  },
)

function hexStrOrDash(s: unknown): string {
  const str = String(s)
  return str.length ? str : '—'
}
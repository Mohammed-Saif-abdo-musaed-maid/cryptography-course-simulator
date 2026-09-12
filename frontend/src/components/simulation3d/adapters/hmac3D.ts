import { hmacEngine } from '../../simulation/renderers/hmac'
import { arrow, hexStrip, rows3D, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

function xorBytesHex(hex: string, constant: number): string {
  const out: string[] = []
  for (let i = 0; i + 1 < hex.length; i += 2) {
    out.push((parseInt(hex.slice(i, i + 2), 16) ^ constant).toString(16).padStart(2, '0'))
  }
  return out.join('')
}

export const hmacAdapter: Simulation3DAdapter = createAdapterFromEngine(
  hmacEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'hmac-key': {
        const structural = Boolean(v.structural)
        const keyPadded = String(v.keyPadded ?? '')
        const hashName = String(v.hashName ?? '')
        const block = Number(v.block ?? 64)
        if (structural) {
          return valuePlate('k0', [0, 0.6, 0], 'K0', `${hashName} · ${block}-byte block`, 'key', { emphasize: true })
        }
        return [
          ...hexStrip('k0', keyPadded.toUpperCase(), 'key', [0, 0.4, -1.8], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('k0cap', [0, 2.3, 2.2], 'K0', `key padded to ${block} bytes`, 'key'),
          ...(Boolean(v.keyTooLong) ? valuePlate('too-long', [0, -1.1, 3.4], 'key too long', 'hashed once to fit', 'warning') : []),
        ]
      }
      case 'hmac-xor': {
        const structural = Boolean(v.structural)
        const keyPadded = String(v.keyPadded ?? '')
        if (structural) {
          return [
            ...valuePlate('ax1', [-3.5, 0.6, 0], 'inner key', 'K0 ⊕ ipad 0x36', 'internal'),
            ...valuePlate('ax2', [3.5, 0.6, 0], 'outer key', 'K0 ⊕ opad 0x5c', 'internal'),
          ]
        }
        const rows = rows3D(
          [
            { label: 'K0', cells: hexCellsOf(keyPadded, 'key') },
            { label: 'ipad', cells: hexCellsOf(xorBytesHex(keyPadded, 0x36), 'muted') },
            { label: 'XOR ipad', cells: hexCellsOf(xorBytesHex(keyPadded, 0x36), 'internal') },
            { label: 'opad', cells: hexCellsOf(xorBytesHex(keyPadded, 0x5c), 'muted') },
            { label: 'XOR opad', cells: hexCellsOf(xorBytesHex(keyPadded, 0x5c), 'internal') },
          ],
          [0, 0, 0],
          { rowStep: 2, cellSize: 0.5, gap: 0.03 },
        )
        return [
          ...rows.objects,
          ...valuePlate('xorcap', [0, 3.4, -4], 'ipad/opad', 'constant XOR tails with the block key', 'internal'),
        ]
      }
      case 'hmac-inner': {
        const innerMsg = String(v.innerMsg ?? '')
        const innerDigest = String(v.innerDigest ?? '')
        if (Boolean(v.structural)) {
          return [
            ...valuePlate('in-msg', [0, 0.6, -3.4], 'input', '(K0 ⊕ ipad) ∥ message', 'input'),
            arrow('in-a', [0, 0.6, -1.6], [0, 0.6, 1.6], 'path'),
            ...valuePlate('in-dg', [0, 0.6, 3.2], 'inner digest', innerDigest || '—', 'internal'),
          ]
        }
        return [
          ...hexStrip('inner', innerMsg.toUpperCase(), 'input', [0, 0.4, -3], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
          arrow('in-a', [0, 0.5, -0.4], [0, 0.5, 1.4], 'path'),
          ...hexStrip('innerdg', innerDigest.toUpperCase(), 'internal', [0, 0.4, 3], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
        ]
      }
      case 'hmac-outer': {
        const opad = String(v.opad ?? '')
        const innerDigest = String(v.innerDigest ?? '')
        const digest = String(v.digest ?? '')
        if (Boolean(v.structural)) {
          return [
            ...valuePlate('out-msg', [0, 0.6, -3.4], 'input', '(K0 ⊕ opad) ∥ inner_digest', 'input'),
            arrow('out-a', [0, 0.6, -1.6], [0, 0.6, 1.6], 'path'),
            ...valuePlate('out-dg', [0, 0.6, 3.4], 'MAC', digest || '—', 'output', { emphasize: true }),
          ]
        }
        return [
          ...hexStrip('op', opad.toUpperCase(), 'key', [0, 0.4, -3.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...hexStrip('ind', innerDigest.toUpperCase(), 'internal', [0, 0.4, -1.4], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          arrow('out-a', [0, 0.5, 0.2], [0, 0.5, 1.6], 'path'),
          ...hexStrip('mac', digest.toUpperCase(), 'output', [0, 0.4, 3.2], { piece: 2, cellSize: 0.5, gap: 0.03 }).objects,
          ...valuePlate('outcap', [0, 2.5, 3.2], 'MAC', `${String(v.hashName ?? 'SHA-256')} (outer)`, 'output'),
        ]
      }
      case 'hmac-result':
        return digestScene(String(v.digest ?? ''), 'HMAC')
      default:
        return []
    }
  },
)

function hexCellsOf(hex: string, tone: 'key' | 'internal' | 'muted' | 'input' | 'output' | 'transform'): { label: string; tone: 'key' | 'internal' | 'muted' | 'input' | 'output' | 'transform' }[] {
  const out: { label: string; tone: 'key' | 'internal' | 'muted' | 'input' | 'output' | 'transform' }[] = []
  for (let i = 0; i + 1 < hex.length; i += 2) {
    out.push({ label: hex.slice(i, i + 2).toUpperCase(), tone })
  }
  return out
}
import { rsaEngine } from '../../simulation/renderers/rsa'
import { arrow, charRow, rows3D, valuePlate } from './scene'
import type { CharCell } from '../../simulation/simulationTypes'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const rsaAdapter: Simulation3DAdapter = createAdapterFromEngine(
  rsaEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'rsa-error':
        return valuePlate('err', [0, 0.6, 0], 'Error', ((v.reasons as string[]) ?? []).join(' · '), 'error', { emphasize: true })
      case 'rsa-keygen': {
        return [
          ...valuePlate('p', [-6, 0.8, 0], 'p', String(v.p ?? ''), 'key'),
          ...valuePlate('q', [-2.6, 0.8, 0], 'q', String(v.q ?? ''), 'key'),
          arrow('k1', [-0.9, 0.8, 0], [0.5, 0.8, 0], 'path'),
          ...valuePlate('n', [3.4, 0.8, 0], 'n = p·q', String(v.n ?? ''), 'internal'),
          ...valuePlate('phi', [-4.3, -0.9, 3], 'φ(n)', String(v.phi ?? ''), 'internal'),
          ...valuePlate('gcd', [0.6, -0.9, 3], 'gcd(e, φ)', String(v.gcdCheck ?? ''), 'internal'),
          ...valuePlate('e', [-3, -0.9, 6], 'e (public)', String(v.e ?? ''), 'key', { emphasize: true }),
          arrow('k2', [-1, -0.9, 6], [0.4, -0.9, 6], 'path'),
          ...valuePlate('d', [3, -0.9, 6], 'd (private)', String(v.d ?? ''), 'output', { emphasize: true }),
          ...(v.eNote ? valuePlate('enote', [0, 2.6, 2], 'note', String(v.eNote), 'muted') : []),
        ]
      }
      case 'rsa-encode': {
        const msgCells = (v.msgCells as CharCell[]) ?? []
        const m27Cells = (v.m27Cells as CharCell[]) ?? []
        return [
          ...charRow('msg', msgCells.map((c) => ({ label: c.ch, tone: c.tone })), [0, 0.7, -3], { cellSize: 0.7, gap: 0.08 }).objects,
          arrow('e1', [0, 0.7, -1.6], [0, 0.7, -0.4], 'path'),
          ...charRow('b27', m27Cells.map((c) => ({ label: c.ch, tone: c.tone })), [0, 0.7, 0.6], { cellSize: 0.7, gap: 0.08 }).objects,
          arrow('e2', [0, 0.7, 1.8], [0, 0.7, 3], 'path'),
          ...valuePlate('M', [0, 0.7, 4.4], 'M (integer)', String(v.M ?? ''), 'output', { emphasize: true }),
          ...valuePlate('enc-cap', [0, 3, -3], 'encoding', 'letters → integer (A=1..Z=26, base 27)', 'input'),
        ]
      }
      case 'rsa-encrypt': {
        const rows = (v.encryptRows as unknown as Array<{ label: string; cells: CharCell[] }>) ?? []
        const objs: ResolvedObject3D[] = []
        if (rows.length) {
          objs.push(
            ...rows3D(
              rows.map((r) => ({
                label: r.label,
                cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone === 'output' ? 'transform' : c.tone })),
              })),
              [3, 0, -3.4],
              { rowStep: 1.7, cellSize: 0.62, gap: 0.1 },
            ).objects,
          )
        }
        objs.push(
          ...valuePlate('M', [-6.2, 1.2, -1], 'M', String(v.M ?? ''), 'input'),
          ...valuePlate('e', [-6.2, 0, 1.2], 'e', String(v.e ?? ''), 'key'),
          ...valuePlate('n', [-6.2, -1, 3], 'n', String(v.n ?? ''), 'internal'),
          arrow('x1', [-3.8, 0.4, 1], [-1.4, 0.4, 1], 'path'),
          ...valuePlate('op', [1.4, 0.4, 1], 'modexp', 'M^e mod n · square-and-multiply', 'transform'),
          ...valuePlate('C', [6.4, 0.4, 3], 'C', String(v.C ?? ''), 'output', { emphasize: true }),
        )
        return objs
      }
      case 'rsa-decrypt':
        return [
          ...valuePlate('C', [-6, 1, -1], 'C', String(v.C ?? ''), 'input'),
          ...valuePlate('d', [-6, -0.1, 1.4], 'd', String(v.d ?? ''), 'key'),
          ...valuePlate('n', [-6, -1.2, 3.4], 'n', String(v.n ?? ''), 'internal'),
          arrow('d1', [-4, 0.4, 1.2], [-1.6, 0.4, 1.2], 'path'),
          ...valuePlate('dop', [1.6, 0.4, 1.2], 'modexp', 'C^d mod n', 'transform'),
          arrow('d2', [3.8, 0.4, 1.2], [5, 0.4, 1.2], 'path'),
          ...valuePlate('Mp', [6.4, 0.7, 1.2], "M'", String(v.M ?? ''), 'output'),
          ...valuePlate('plain', [0, -1.6, 5.4], 'Plaintext', String(v.result ?? ''), 'output', { emphasize: true }),
          ...valuePlate('textbook', [0, 3, -4], 'note', 'textbook RSA — no padding; OAEP needed in practice', 'muted'),
        ]
      case 'rsa-result': {
        const text = String(v.text ?? '')
        return [
          ...charRow('out', text.split('').map((ch) => ({ label: ch, tone: 'output' })), [0, 0.5, -1.2], { cellSize: 0.8, gap: 0.1 }).objects,
          ...valuePlate('r0', [0, 2.6, 2.6], 'Decrypted', text || '·', 'output', { emphasize: true }),
        ]
      }
      default:
        return []
    }
  },
)
import { x448Engine } from '../../simulation/renderers/x448'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { arrow, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'

const B = (v: unknown) => Boolean(v)

function trunc(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s
}

export const x4483DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  x448Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'x448-curve':
        return [
          ...valuePlate('curve', [0, 1.1, -3], 'curve', 'Curve448 (Goldilocks)', 'internal', { emphasize: true }),
          ...valuePlate('form', [0, -0.5, -0.6], 'form', 'twisted Edwards y² = x³ − 3x − 2', 'internal'),
          ...valuePlate('base', [0, -1.9, 1.6], 'base point', 'u = 5 (x-coordinate only)', 'key', { emphasize: true }),
          ...valuePlate('prime', [0, -3.2, 3.4], 'field prime p', '2⁴⁴⁸ − 2²²⁴ − 1', 'internal'),
        ]
      case 'x448-keys': {
        const pubWarn = B(v.hasResult)
        return [
          ...valuePlate('a-label', [-3, 2.6, -3.2], 'Alice', '', 'key'),
          ...valuePlate('a-priv', [-3, 0.4, -1.2], 'private', pubWarn ? trunc(String(v.aPriv), 24) : '—', 'key'),
          arrow('a-x', [-3, 0.4, 1.6], [-3, 0.4, 3], 'path'),
          ...valuePlate('a-pub', [-3, -1.6, 4.4], 'public', pubWarn ? trunc(String(v.aPub), 24) : '—', 'output'),
          ...valuePlate('b-label', [3, 2.6, -3.2], 'Bob', '', 'key'),
          ...valuePlate('b-priv', [3, 0.4, -1.2], 'private', pubWarn ? trunc(String(v.bPriv), 24) : '—', 'key'),
          arrow('b-x', [3, 0.4, 1.6], [3, 0.4, 3], 'path'),
          ...valuePlate('b-pub', [3, -1.6, 4.4], 'public', pubWarn ? trunc(String(v.bPub), 24) : '—', 'output'),
        ]
      }
      case 'x448-ladder':
        return [
          ...valuePlate('scalar', [0, 1, -2.6], 'secret scalar', '56 bytes · clamped', 'transform', { emphasize: true }),
          arrow('lad', [0, 0.4, -0.8], [0, 0.4, 0.8], 'path'),
          ...valuePlate('ladder', [0, -0.6, 2.6], 'operation', 'constant-time Montgomery ladder · u-coordinate only', 'internal'),
        ]
      case 'x448-shared': {
        const shown = B(v.hasResult) ? String(v.shared) : ''
        return [
          ...valuePlate('s-a', [-3, 1.2, -2.6], 'Alice', 'S = X448(a, B)', 'output'),
          ...valuePlate('s-b', [3, 1.2, -2.6], 'Bob', 'S = X448(b, A)', 'output'),
          arrow('s-join', [-3, 0.2, -0.4], [3, 0.2, -0.4], 'path'),
          ...valuePlate('shared', [0, -1.6, 2.8], 'shared secret (56 B)', shown ? trunc(shown, 32) : 'run to derive', 'output', { emphasize: true }),
        ]
      }
      default:
        return []
    }
  },
)
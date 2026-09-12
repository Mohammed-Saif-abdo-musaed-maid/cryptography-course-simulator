import { bcryptEngine } from '../../simulation/renderers/bcrypt'
import { gridObject, valuePlate } from './scene'
import type { Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { digestScene } from './hash3d'

export const bcryptAdapter: Simulation3DAdapter = createAdapterFromEngine(
  bcryptEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'bcrypt-input': {
        const tooLong = Boolean(v.tooLong)
        return [
          ...valuePlate('pw', [0, 0.6, 0], 'password', `${Number(v.pwBytes)} bytes`, 'input', { emphasize: true }),
          ...(tooLong ? valuePlate('tooolong', [0, -1.4, 2.4], 'rejected', 'max 72 bytes', 'error') : []),
        ]
      }
      case 'bcrypt-salt':
        return [
          ...valuePlate('saltbox', [0, 0.6, -1.6], 'salt', '16 bytes · 128-bit (CSPRNG)', 'key', { emphasize: true }),
          ...valuePlate('prefix', [0, 0.6, 2], 'embedded', `$2b$${Number(v.rounds)}$`, 'muted'),
        ]
      case 'bcrypt-cost':
        return [
          ...valuePlate('c1', [-3.6, 0.6, 0], 'cost', String(v.rounds ?? ''), 'key', { emphasize: true }),
          ...valuePlate('c2', [0, 0.6, 0], 'iterations', String(v.iterations ?? ''), 'transform'),
          ...valuePlate('c3', [3.6, 0.6, 0], 'work factor', `2^${Number(v.rounds)} EksBlowfish rounds`, 'internal'),
        ]
      case 'bcrypt-schedule': {
        const head = gridObject(
          'eks-head',
          [['P[18]', 'S0[256]', 'S1[256]', 'S2[256]', 'S3[256]']].map((r) => r.map((label) => ({ label, tone: 'internal' }))),
          { cellSize: 1.9, gap: 0.14, labelScale: 0.7, height: 1.2 },
        )
        return [
          head,
          ...valuePlate('eks', [0, 2.6, -4], 'EksBlowfish', `${Number(v.iterations)} key-schedule passes`, 'transform'),
          ...valuePlate('derive', [0, -0.6, 5], 'derive', "encrypt 'OrpheanBeholderScryDoubt' → 184-bit hash", 'output'),
        ]
      }
      case 'bcrypt-result': {
        const hash = String(v.hash ?? '')
        if (hash) return digestScene(hash, '$2b$')
        return valuePlate('ph', [0, 0.6, 0], '$2b$ hash', 'run the operation to bind real hash', 'output')
      }
      default:
        return []
    }
  },
)
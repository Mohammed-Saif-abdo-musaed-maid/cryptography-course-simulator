import { blowfishEngine } from '../../simulation/renderers/blowfish'
import { arrow, hexStrip, merge, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

const wordPlate = (id: string, label: string, value: string, tone: 'key' | 'internal' | 'transform' | 'output', x: number, z: number, emph = false): ResolvedObject3D[] =>
  valuePlate(id, [x, 0.4, z], label, value.toUpperCase(), tone, { emphasize: emph })

export const blowfish3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  blowfishEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'blowfish-input': {
        const block = String(v.block ?? '').toUpperCase()
        const key = String(v.key ?? '').toUpperCase()
        const L = String(v.L ?? '').toUpperCase()
        const R = String(v.R ?? '').toUpperCase()
        return [
          ...hexStrip('blk', block, 'input', [0, 1, -1.4], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects,
          ...hexStrip('ky', key, 'key', [0, 1, 0.8], { cellSize: 0.62, gap: 0.045, glyphY: 1.7 }).objects,
          ...wordPlate('L', 'L (left word)', L, 'internal', -2, 3, true),
          ...wordPlate('R', 'R (right word)', R, 'internal', 2, 3, true),
        ]
      }
      case 'blowfish-pi': {
        const p = (v.p ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        p.forEach((w, i) => {
          const a = i * ((Math.PI * 2) / Math.max(1, p.length))
          objs.push(...valuePlate(`p${i}`, [10.5 * Math.cos(a), 0.5, 10.5 * Math.sin(a)], `P[${i}]`, w.toUpperCase(), i % 2 === 0 ? 'key' : 'internal'))
        })
        objs.push(
          {
            id: 'pi-ring',
            kind: 'ring',
            position: [0, 0, 0],
            ringRadius: 10.5,
            ringTube: 0.12,
            tone: 'key',
          },
          ...valuePlate('pi', [0, 3.2, 0], 'P-array', 'first 148 hex digits of π', 'key'),
          ...valuePlate('sb', [0, -2.4, 10], 'S-boxes', 'S0..S3 · 4 × 256 entries', 'transform'),
        )
        return objs
      }
      case 'blowfish-ksched': {
        const pXor = (v.pXor ?? []) as string[]
        const finalP = (v.finalP ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        pXor.slice(0, 18).forEach((w, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          objs.push(...wordPlate(`px${i}`, `P'[${i}]`, w, 'transform', col * 3.8 - 9.5, row * 2.7 - 2.7))
        })
        if (finalP.length) {
          finalP.slice(0, 18).forEach((w, i) => {
            const col = i % 6
            const row = Math.floor(i / 6)
            objs.push(...wordPlate(`pf${i}`, `P • ${i}`, w, 'output', col * 3.8 - 9.5, row * 2.7 + 4.4))
          })
          objs.push(...valuePlate('capf', [0, 3, -3.4], 're-encrypt zero block', 'final P-array', 'output'))
        }
        objs.push(...valuePlate('cap', [0, 4.6, -6], 'key schedule', 'P[i] ⊕ key-word (key bytes cycled)', 'transform'))
        return objs
      }
      case 'blowfish-f': {
        const L = String(v.L ?? '').toUpperCase()
        const bytes = (v.bytes ?? ['', '', '', '']) as string[]
        const sHeads = (v.sHeads ?? []) as string[][]
        const objs: ResolvedObject3D[] = [
          ...valuePlate('L', [-4, 1.2, -3.2], 'F(R) over L', L, 'internal'),
          arrow('fa', [-1.8, 1.4, -3.2], [-1, 1.4, -3.2], 'path'),
        ]
        const step = 1.15
        bytes.forEach((b, i) => {
          objs.push(
            {
              id: `b${i}`,
              kind: 'box',
              position: [(i - 1.5) * step, 0.55, -3.2],
              size: [0.95, 0.95, 0.95],
              tone: 'internal',
            },
            {
              id: `b${i}g`,
              kind: 'glyph',
              position: [(i - 1.5) * step, 1.35, -3.2],
              label: b,
              glyphScale: 0.85,
              tone: 'internal',
            },
            ...valuePlate(`s${i}`, [(i - 1.5) * step, 0.4, -0.6], `S${i}`, (sHeads[i] ?? []).slice(0, 4).join(' '), 'key', { emphasize: false }),
          )
        })
        objs.push(
          ...valuePlate('formula', [0, 1.2, -6], 'F(x)', 'F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]', 'transform', { emphasize: true }),
          ...valuePlate('xy', [0, 0.3, 2.2], 'op', '⊕ / + (mod 2³²) · 16 rounds', 'path'),
        )
        return objs
      }
      case 'blowfish-rounds': {
        const states = (v.states ?? []) as Array<{ round: number; L: string; R: string }>
        const L = String(v.L ?? '').toUpperCase()
        const R = String(v.R ?? '').toUpperCase()
        if (!states.length) {
          return [
            ...wordPlate('L', 'L', L, 'internal', -2, 0),
            ...wordPlate('R', 'R', R, 'internal', 2, 0),
            ...valuePlate('form', [0, 2.4, 0], 'Feistel', '16 × (R ^= F(L) ⊕ P[i]; swap)', 'transform'),
          ]
        }
        const objs: ResolvedObject3D[] = []
        states.slice(0, 16).forEach((s, i) => {
          const a = i * ((Math.PI * 2) / 16)
          objs.push(...valuePlate(`r${i}`, [9 * Math.cos(a), 0.5, 9 * Math.sin(a)], `R${s.round}`, `L ${s.L.toUpperCase()} · R ${s.R.toUpperCase()}`, s.round % 2 === 0 ? 'internal' : 'transform'))
        })
        objs.push(
          {
            id: 'bf-ring',
            kind: 'ring',
            position: [0, 0, 0],
            ringRadius: 9,
            ringTube: 0.12,
            tone: 'path',
          },
          ...valuePlate('cap', [0, 3.2, 0], 'rounds', '16-round Feistel', 'transform'),
        )
        return objs
      }
      case 'blowfish-result': {
        const hex = String(v.hex ?? '').toUpperCase()
        return merge(
          ...hexStrip('out', hex, 'output', [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate('cap', [0, 2.1, 0], v.decrypt ? 'plaintext' : 'ciphertext', hex, 'output', { emphasize: true }),
        )
      }
      default:
        return []
    }
  },
)
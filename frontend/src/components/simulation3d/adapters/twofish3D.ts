import { twofishEngine } from '../../simulation/renderers/twofish'
import { arrow, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

export const twofish3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  twofishEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'twofish-input': {
        const block = String(v.block ?? '').toUpperCase()
        const key = String(v.key ?? '').toUpperCase()
        const words = ['m0', 'm1', 'm2', 'm3'].map((m) => String(v[m] ?? '').toUpperCase())
        const objs: ResolvedObject3D[] = [
          ...hexStrip('blk', block, 'input', [0, 1.2, -2], { cellSize: 0.58, gap: 0.03, glyphY: 2 }).objects,
          ...hexStrip('ky', key, 'key', [0, -0.4, -2], { cellSize: 0.58, gap: 0.03, glyphY: 0.4 }).objects,
        ]
        words.forEach((w, i) => {
          const x = (i - 1.5) * 3.1
          objs.push(...valuePlate(`m${i}`, [x, 0.4, 2.2], `m${i}`, w, 'internal'))
          if (i < 3) {
            const xn = (i - 0.5) * 3.1
            objs.push(arrow(`wa${i}`, [x + 1.1, 0.4, 2.2], [xn - 1.1, 0.4, 2.2], 'path'))
          }
        })
        objs.push(...valuePlate('cap', [0, 3.2, 2.2], 'little-endian words', 'block → m0..m3', 'internal'))
        return objs
      }
      case 'twofish-key': {
        const whitening = (v.whitening ?? []) as string[]
        const subkeys = (v.subkeys ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        whitening.slice(0, 8).forEach((w, i) => {
          const col = i % 4
          const row = Math.floor(i / 4)
          objs.push(...valuePlate(`w${i}`, [col * 3.4 - 5.1, 0.4, row * 2.6 - 1.3], `w[${i}]`, w.toUpperCase(), i % 2 === 0 ? 'key' : 'internal'))
        })
        for (let r = 0; r < 10; r++) {
          const four = subkeys.slice(4 * r, 4 * r + 4)
          const col = r % 5
          const row = Math.floor(r / 5)
          objs.push(
            ...valuePlate(
              `sk${r}`,
              [col * 4.2 - 8.4, 0.4, 3.2 + row * 2.6],
              `k · round ${r + 1}`,
              (four.length ? four : ['—', '—', '—', '—']).join(' '),
              r % 2 === 0 ? 'key' : 'internal',
            ),
          )
        }
        objs.push(...valuePlate('cap', [0, 4.4, -4.6], 'key schedule', 'RS (12,8) + h() via q0/q1', 'transform'))
        return objs
      }
      case 'twofish-sboxes': {
        const sboxes = (v.sboxes ?? []) as string[][]
        if (!sboxes.length) {
          return [
            ...valuePlate('cap', [0, 0.4, 0], 'S-boxes', 'S0..S3 · 4 × 256 MDS-combined entries', 'key'),
            ...valuePlate('note', [0, -2.2, 2.6], 'chain', 'q0/q1 → MDS (GF(2⁸), 0x169)', 'transform'),
          ]
        }
        const layersRows = sboxes.map((head) => ({
          cells: head.slice(0, 8).map((cell, c) => ({
            label: cell.toUpperCase(),
            tone: (c % 2 === 0 ? 'key' : 'internal') as 'key' | 'internal',
          })),
        }))
        return [
          {
            id: 'sbox-heads',
            kind: 'grid',
            position: [0, 0, 0],
            tone: 'key',
            grid: {
              height: 1.2,
              layers: [
                {
                  rows: Math.max(1, sboxes.length),
                  cols: 8,
                  cellSize: 1.5,
                  gap: 0.24,
                  labelScale: 0.72,
                  cells: layersRows.map((r) => r.cells),
                },
              ],
            },
          },
          ...valuePlate('cap', [0, 3.6, 0], 'S-vector heads', 'q0/q1 → MDS (GF(2⁸), 0x169)', 'transform'),
        ]
      }
      case 'twofish-whiten': {
        const words = ['m0', 'm1', 'm2', 'm3'].map((m) => String(v[m] ?? '').toUpperCase())
        const keys = (v.keys ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        words.forEach((w, i) => {
          const x = (i - 1.5) * 3.3
          objs.push(
            ...valuePlate(`m${i}`, [x, 1.1, -1.6], `m${i}`, w, 'internal'),
            ...valuePlate(`k${i}`, [x, -0.4, 0.4], `w${v.decrypt ? 4 + i : i}`, (keys[i] ?? '').toUpperCase(), 'key'),
            arrow(`x${i}`, [x, 0.4, 1.6], [x, 0.4, 2.8], 'path'),
          )
        })
        objs.push(...valuePlate('cap', [0, 3.6, 1.2], v.decrypt ? 'de-whitening' : 'whitening', 'a=m0⊕w0 · b=m1⊕w1 · c=m2⊕w2 · d=m3⊕w3', 'transform'))
        return objs
      }
      case 'twofish-rounds': {
        const states = (v.states ?? []) as Array<{ round: number; a: string; b: string; c: string; d: string }>
        if (!states.length) {
          return [
            ...valuePlate('cap', [0, 0.4, 0], 'rounds', '16 × (g() keyed S-boxes + MDS → PHT → 1-bit rotations)', 'transform'),
            ...valuePlate('g', [0, -2, 1.6], 'g(x)', 'g(x) = S0[x0] ⊕ S1[x1] ⊕ S2[x2] ⊕ S3[x3]', 'key'),
          ]
        }
        const objs: ResolvedObject3D[] = []
        states.slice(0, 16).forEach((s, i) => {
          const a = i * ((Math.PI * 2) / 16)
          objs.push(
            ...valuePlate(
              `r${i}`,
              [9.4 * Math.cos(a), 0.5, 9.4 * Math.sin(a)],
              `R${s.round}`,
              `a ${s.a.toUpperCase()} · b ${s.b.toUpperCase()} · c ${s.c.toUpperCase()} · d ${s.d.toUpperCase()}`,
              s.round % 2 === 0 ? 'internal' : 'transform',
            ),
          )
        })
        objs.push(
          {
            id: 'twf-ring',
            kind: 'ring',
            position: [0, 0, 0],
            ringRadius: 9.4,
            ringTube: 0.12,
            tone: 'path',
          },
          ...valuePlate('cap', [0, 3.2, 0], 'rounds', '16-round Feistel · 4 words', 'transform'),
        )
        return objs
      }
      case 'twofish-result': {
        const hex = String(v.hex ?? '').toUpperCase()
        return [
          ...hexStrip('out', hex, 'output', [0, 0.3, 0], { piece: 1, cellSize: 0.58, gap: 0.03 }).objects,
          ...valuePlate('cap', [0, 2.1, 0], v.decrypt ? 'plaintext' : 'ciphertext', hex, 'output', { emphasize: true }),
        ]
      }
      default:
        return []
    }
  },
)
import { desEngine } from '../../simulation/renderers/des'
import { arrow, hexStrip, merge, rows3D, valuePlate } from './scene'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter, Vec3 } from '../types/simulation3d'
import { createAdapterFromEngine, resultViewScene } from './from2d'

// P-Box used to derive the real f(R0,K1) = P-Table(S1..S8).
const P_TABLE = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25]

interface DesSboxView {
  sbox: number
  sixBits?: string
  six_bits?: string
  row?: number
  col?: number
  value?: number
  fourBits?: string
  four_bits?: string
}

interface DesFView {
  round?: number
  key?: string
  expanded?: string
  xor?: string
  sboxes?: DesSboxView[]
}

function bitsToHex32(bits: number[]): string {
  let v = 0n
  for (const b of bits) v = (v << 1n) | BigInt(b & 1)
  return v.toString(16).padStart(8, '0')
}

function xorHex(a: string, b: string): string {
  const n = Math.max(a.length, b.length)
  const av = BigInt('0x' + a.padStart(n, '0'))
  const bv = BigInt('0x' + b.padStart(n, '0'))
  return (av ^ bv).toString(16).padStart(n, '0')
}

export const des3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  desEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'des-input': {
        const block = String(v.block ?? '')
        const key = String(v.key ?? '')
        const l0 = String(v.l0 ?? '')
        const r0 = String(v.r0 ?? '')
        const blockS = hexStrip('blk', block.toUpperCase(), 'input', [0, 0.8, -1.6], { piece: 1, cellSize: 0.6, gap: 0.035 })
        const keyS = hexStrip('key', key.toUpperCase(), 'key', [0, 0.8, 0.4], { piece: 1, cellSize: 0.6, gap: 0.035 })
        return [
          ...blockS.objects,
          ...keyS.objects,
          ...valuePlate('ip', [0, 2.1, 1.6], 'initial permutation', 'IP', 'transform'),
          ...valuePlate('L0', [-1.7, 0.15, 4], 'L0', l0, 'internal'),
          ...valuePlate('R0', [1.7, 0.15, 4], 'R0', r0, 'internal'),
        ]
      }
      case 'des-key': {
        const keys = (v.roundKeys ?? []) as string[]
        const objs: ResolvedObject3D[] = []
        keys.slice(0, 16).forEach((k, i) => {
          const a = i * ((Math.PI * 2) / 16)
          const pos: Vec3 = [8 * Math.cos(a), 0.5, 8 * Math.sin(a)]
          objs.push(
            ...valuePlate(`k${i}`, pos, `K${i + 1}`, k.toUpperCase(), i === 0 ? 'key' : 'internal'),
          )
        })
        objs.push({
          id: 'key-ring',
          kind: 'ring',
          position: [0, 0, 0],
          ringRadius: 8,
          ringTube: 0.12,
          tone: 'key',
        })
        objs.push(...valuePlate('pc', [0, 3.4, 0], 'key schedule', 'PC-1 → rotate → PC-2', 'transform'))
        return objs
      }
      case 'des-f': {
        const f = (v.f ?? {}) as DesFView
        const l0 = String(v.l0 ?? '')
        const r0 = String(v.r0 ?? '')
        const sboxes = Array.isArray(f.sboxes) ? f.sboxes : []
        if (!sboxes.length) return []
        const expanded = String(f.expanded ?? '').toUpperCase()
        const xored = String(f.xor ?? '').toUpperCase()
        const bits = sboxes
          .map((s) => (s.fourBits ?? s.four_bits ?? '').split('').map((x) => Number(x)))
          .flat()
        const permuted = P_TABLE.map((i) => bits[i - 1] ?? 0)
        const fHex = bitsToHex32(permuted)
        const r1 = xorHex(l0, fHex)
        const objs: ResolvedObject3D[] = []
        const stages: Array<[string, string, 'internal' | 'transform' | 'output']> = [
          ['R0', r0, 'internal'],
          ['E(R0)', expanded, 'transform'],
          ['E(R0)⊕K1', xored, 'transform'],
          ['f(R0,K1)', fHex, 'output'],
          ['⊕L0 → R1', r1, 'output'],
        ]
        const STEP = 4.8
        stages.forEach((s, i) => {
          const x = (i - (stages.length - 1) / 2) * STEP
          objs.push(...valuePlate(`f${i}`, [x, 0.5, -1.8], s[0], s[1], s[2], { emphasize: i === 4 }))
          if (i < stages.length - 1) {
            objs.push(arrow(`fa${i}`, [x + STEP / 2 - 0.7, 1.15, -1.8], [x + STEP / 2 + 0.7, 1.15, -1.8], 'path'))
          }
        })
        const boxIds = sboxes.map((s) => `S${s.sbox}`)
        const outIds = sboxes.map((s) => s.fourBits ?? s.four_bits ?? '')
        objs.push(
          ...valuePlate('sboxtitle', [0, 0.3, 1.6], 'S-boxes', '8 × 6→4 bits', 'transform'),
          ...rows3D(
            [
              { label: 'S', cells: boxIds.map((l, i): CellProps => ({ label: l, tone: (i % 2 === 0 ? 'internal' : 'transform') as 'internal' | 'transform' })) },
              { cells: outIds.map((l, i): CellProps => ({ label: l, tone: (i % 2 === 0 ? 'transform' : 'output') as 'transform' | 'output' })) },
            ],
            [0, -0.2, 3],
            { rowStep: 1.8, cellSize: 0.85, gap: 0.08 },
          ).objects,
          ...valuePlate('ptitle', [0, -1.35, 7.2], 'P-box', 'spread 32 bits', 'transform'),
        )
        return objs
      }
      case 'des-rounds': {
        const states = (v.states ?? []) as Array<{ round: number; L: string; R: string }>
        const objs: ResolvedObject3D[] = []
        states.forEach((s, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          objs.push(
            ...valuePlate(
              `r${i}`,
              [col * 5.4 - 13.5, 0.45, row * 3.6 - 3.6],
              `R${s.round}`,
              `L ${s.L.toUpperCase()}  R ${s.R.toUpperCase()}`,
              s.round % 2 === 0 ? 'internal' : 'transform',
            ),
          )
        })
        objs.push(...valuePlate('chain', [0, 3.4, -8.2], 'Feistel ladder', '16 rounds · L=R, R=L⊕f(R,K)', 'transform'))
        return objs
      }
      case 'des-swap': {
        const pre = String(v.preOutput ?? '')
        const resultHex = String(v.resultHex ?? '')
        return merge(
          ...valuePlate('pre', [-3.4, 0.4, 0], 'R16L16', pre.toUpperCase(), 'internal'),
          ...valuePlate('fp', [0, 0.4, 0], 'final permutation', 'FP', 'transform'),
          ...valuePlate('out', [3.4, 0.4, 0], 'output', resultHex.toUpperCase(), 'output', { emphasize: true }),
          arrow('swap', [-1.6, 1.2, 0], [1.6, 1.2, 0], 'path'),
        )
      }
      case 'des-result': {
        const hex = String(v.hex ?? '')
        return merge(
          ...hexStrip('out', hex.toUpperCase(), 'output', [0, 0.3, 0], { piece: 1, cellSize: 0.62, gap: 0.04 }).objects,
          ...valuePlate('cap', [0, 2.1, 0], v.decrypt ? 'plaintext' : 'ciphertext', hex.toUpperCase(), 'output', { emphasize: true }),
        )
      }
      case 'result':
        return resultViewScene(v)
      default:
        return []
    }
  },
)
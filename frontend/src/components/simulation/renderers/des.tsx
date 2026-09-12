import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'des'

const IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7]
const FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25]
const E_TABLE = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1]
const P_TABLE = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25]
const PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4]
const PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32]
const SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1]
const SBOXES = [
  [[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
  [[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
  [[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
  [[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
  [[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
  [[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
  [[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
  [[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]],
]

type Bits = number[]

const hexToBits = (hex: string): Bits => {
  const v = BigInt('0x' + hex)
  const n = hex.length * 4
  const out: Bits = []
  for (let i = n - 1; i >= 0; i--) out.push(Number((v >> BigInt(i)) & 1n))
  return out
}

const bitsToHex = (bits: Bits): string => {
  let v = 0n
  for (const b of bits) v = (v << 1n) | BigInt(b)
  return v.toString(16).padStart(Math.ceil(bits.length / 4), '0')
}

const perm = (bits: Bits, table: number[]): Bits => table.map((i) => bits[i - 1])
const rotl = (bits: Bits, n: number): Bits => bits.slice(n).concat(bits.slice(0, n))
const xorBits = (a: Bits, b: Bits): Bits => a.map((x, i) => (x ^ (b[i] ?? 0)) as number)

const keySchedule = (keyHex: string): Bits[] => {
  const kb = hexToBits(keyHex)
  const permuted = perm(kb, PC1)
  let c = permuted.slice(0, 28)
  let d = permuted.slice(28)
  const rks: Bits[] = []
  for (const s of SHIFTS) {
    c = rotl(c, s)
    d = rotl(d, s)
    rks.push(perm(c.concat(d), PC2))
  }
  return rks
}

interface DesSboxDetail {
  sbox: number
  sixBits: string
  row: number
  col: number
  value: number
  fourBits: string
}

interface DesFDetail {
  round: number
  key: string
  expanded: string
  xor: string
  sboxes: DesSboxDetail[]
}

const desRoundF = (right: Bits, key: Bits): { fOut: Bits; detail: DesFDetail } => {
  const expanded = perm(right, E_TABLE)
  const xored = xorBits(expanded, key)
  const sboxOut: Bits = []
  const sboxes: DesSboxDetail[] = []
  for (let i = 0; i < 8; i++) {
    const chunk = xored.slice(i * 6, (i + 1) * 6)
    const row = (chunk[0] << 1) | (chunk[5] ?? 0)
    const col = ((chunk[1] ?? 0) << 3) | ((chunk[2] ?? 0) << 2) | ((chunk[3] ?? 0) << 1) | (chunk[4] ?? 0)
    const value = SBOXES[i][row]?.[col] ?? 0
    const fourBits: Bits = [
      (value >> 3) & 1,
      (value >> 2) & 1,
      (value >> 1) & 1,
      value & 1,
    ]
    sboxOut.push(...fourBits)
    sboxes.push({
      sbox: i + 1,
      sixBits: chunk.join(''),
      row,
      col,
      value,
      fourBits: fourBits.join(''),
    })
  }
  const fOut = perm(sboxOut, P_TABLE)
  return { fOut, detail: { round: 0, key: '', expanded: bitsToHex(expanded), xor: bitsToHex(xored), sboxes } }
}

interface DesLive {
  roundKeysSchedule: string[]
  roundKeysApplied: string[]
  roundStates: Array<{ round: number; L: string; R: string }>
  fDetails: DesFDetail[]
  l0: string
  r0: string
  preOutput: string
  resultHex: string
}

export function desLive(blockHex: string, keyHex: string, decrypt: boolean): DesLive {
  const schedule = keySchedule(keyHex)
  const applied = decrypt ? schedule.slice().reverse() : schedule
  const bb = hexToBits(blockHex)
  const pp = perm(bb, IP)
  let left = pp.slice(0, 32)
  let right = pp.slice(32)
  const roundStates = [{ round: 0, L: bitsToHex(left), R: bitsToHex(right) }]
  const fDetails: DesFDetail[] = []
  for (let r = 0; r < 16; r++) {
    const { fOut, detail } = desRoundF(right, applied[r] ?? [])
    const leftNew = xorBits(left, fOut)
    detail.round = r + 1
    detail.key = bitsToHex(applied[r] ?? [])
    fDetails.push(detail)
    left = right
    right = leftNew
    roundStates.push({ round: r + 1, L: bitsToHex(left), R: bitsToHex(right) })
  }
  const preOutput = bitsToHex(right.concat(left))
  const output = perm(right.concat(left), FP)
  return {
    roundKeysSchedule: schedule.map(bitsToHex),
    roundKeysApplied: applied.map(bitsToHex),
    roundStates,
    fDetails,
    l0: roundStates[0]?.L ?? '',
    r0: roundStates[0]?.R ?? '',
    preOutput,
    resultHex: bitsToHex(output),
  }
}

const hexStrOf2 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const isRoundStates = (v: unknown): v is Array<Record<string, unknown>> =>
  Array.isArray(v)

const roundStatesOf = (rows: Array<Record<string, unknown>>): Array<{ round: number; L: string; R: string }> =>
  rows
    .map((r) => ({
      round: typeof r.round === 'number' ? r.round : Number(r.round) || 0,
      L: hexStrOf2(r.L) ?? '',
      R: hexStrOf2(r.R) ?? '',
    }))
    .filter((r) => r.L && r.R)

const fDetailsOf = (rows: Array<Record<string, unknown>>): DesFDetail[] =>
  rows
    .map((d) => {
      const sboxes = Array.isArray(d.sboxes)
        ? (d.sboxes as Array<Record<string, unknown>>).map((s) => ({
            sbox: Number(s.sbox) || 0,
            sixBits: hexStrOf2(s.six_bits) ?? '',
            row: Number(s.row) || 0,
            col: Number(s.col) || 0,
            value: Number(s.value) || 0,
            fourBits: hexStrOf2(s.four_bits) ?? '',
          }))
        : []
      return {
        round: Number(d.round) || 0,
        key: hexStrOf2(d.key) ?? '',
        expanded: hexStrOf2(d.expanded) ?? '',
        xor: hexStrOf2(d.xor) ?? '',
        sboxes,
      }
    })
    .filter((d) => d.expanded)

export const desEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.des.name',
  educationalKey: 'simulation.des.educational',
  demoInputs: {
    block: '0123456789ABCDEF',
    key: '133457799BBCDFF1',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const blockHex = String(ctx.inputs.block ?? '0123456789ABCDEF').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key ?? '133457799BBCDFF1').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: DesLive | null = null
    try {
      live = desLive(blockHex, keyHex, decrypt)
    } catch {
      live = null
    }

    const boundStates = hasResult && isRoundStates(extra?.round_states) ? roundStatesOf(extra?.round_states as Array<Record<string, unknown>>) : undefined
    const boundKeys = hasResult && Array.isArray(extra?.round_keys)
      ? (extra?.round_keys as unknown[]).map((k) => hexStrOf2(k)).filter((k): k is string => !!k)
      : undefined
    const boundF = hasResult && Array.isArray(extra?.f_details) ? fDetailsOf(extra?.f_details as Array<Record<string, unknown>>) : undefined

    const roundStates = boundStates ?? live?.roundStates ?? []
    const l0 = roundStates[0]?.L ?? live?.l0 ?? ''
    const r0 = roundStates[0]?.R ?? live?.r0 ?? ''
    const fDetail0 = boundF && boundF.length > 0 ? boundF[0] : live?.fDetails[0]
    const resultHex = hasResult
      ? (hexStrOf2(ctx.result?.result)?.replace(/\s/g, '') ?? live?.resultHex ?? '')
      : (live?.resultHex ?? '')

    const rkDisplay = boundKeys ?? live?.roundKeysSchedule ?? []

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.des.input.title',
        descKey: 'simulation.des.input.desc',
        phase: 'input',
        view: { kind: 'des-input', block: blockHex, key: keyHex, l0, r0 },
      },
      {
        id: `${id}-key`,
        titleKey: 'simulation.des.key.title',
        descKey: 'simulation.des.key.desc',
        phase: 'key',
        view: { kind: 'des-key', roundKeys: rkDisplay },
      },
      {
        id: `${id}-f`,
        titleKey: 'simulation.des.f.title',
        descKey: 'simulation.des.f.desc',
        phase: 'transform',
        view: { kind: 'des-f', f: fDetail0, l0, r0 },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.des.rounds.title',
        descKey: 'simulation.des.rounds.desc',
        descArgs: { rounds: 16 },
        phase: 'internal',
        view: { kind: 'des-rounds', states: roundStates },
      },
      {
        id: `${id}-swap`,
        titleKey: 'simulation.des.swap.title',
        descKey: 'simulation.des.swap.desc',
        phase: 'transform',
        view: { kind: 'des-swap', preOutput: live?.preOutput ?? '', resultHex },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.des.result.dTitle' : 'simulation.des.result.title',
        descKey: 'simulation.des.result.desc',
        phase: 'output',
        view: { kind: 'des-result', hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'des-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="block" value={hexStrOf2(view.block) ?? ''} tone="input" big />
            <DataBlock label="key" value={hexStrOf2(view.key) ?? ''} tone="key" big />
            <FlowArrow op="IP" />
            <DataBlock label="L0" value={hexStrOf2(view.l0) ?? ''} tone="internal" />
            <DataBlock label="R0" value={hexStrOf2(view.r0) ?? ''} tone="internal" />
          </div>
        )
      case 'des-key': {
        const keys = view.roundKeys as string[]
        return (
          <div className="lab-stage-view">
            <FlowArrow op="PC-1 → rotate → PC-2" />
            {keys.map((k, i) => (
              <DataBlock key={i} label={`K${i + 1}`} value={k} tone={i % 2 === 0 ? 'key' : 'internal'} />
            ))}
          </div>
        )
      }
      case 'des-f': {
        const f = view.f as DesFDetail | undefined
        const l0 = hexStrOf2(view.l0) ?? ''
        const r0 = hexStrOf2(view.r0) ?? ''
        if (!f) return null
        const newRight = l0
          ? (() => {
              const a = BigInt('0x' + l0)
              const b = BigInt('0x' + f.xor.slice(0, 8))
              return (a ^ b).toString(16).padStart(8, '0')
            })()
          : ''
        return (
          <div className="lab-stage-view">
            <DataBlock label="R0" value={r0} tone="internal" />
            <FlowArrow op="E" />
            <DataBlock label="E(R0)" value={f.expanded} tone="transform" />
            <FlowArrow op="XOR K1" />
            <DataBlock label="E(R0) ⊕ K1" value={f.xor} tone="transform" />
            <FlowArrow op="S-boxes" />
            {f.sboxes.map((s) => (
              <DataBlock
                key={s.sbox}
                label={`S${s.sbox}`}
                value={`${s.sixBits} → row ${s.row}, col ${s.col} → ${s.value}`}
                tone="internal"
              />
            ))}
            <FlowArrow op="P" />
            <DataBlock label="f(R0, K1)" value={newRight} tone="output" />
            <FlowArrow op="XOR L0" />
            <DataBlock label="R1" value={newRight} tone="output" />
          </div>
        )
      }
      case 'des-rounds': {
        const states = view.states as Array<{ round: number; L: string; R: string }>
        return (
          <div className="lab-stage-view">
            {states.map((s) => (
              <DataBlock key={s.round} label={`R${s.round}`} value={`L ${s.L}   R ${s.R}`} tone={s.round % 2 === 0 ? 'internal' : 'transform'} />
            ))}
          </div>
        )
      }
      case 'des-swap':
        return (
          <div className="lab-stage-view">
            <DataBlock label="R16L16" value={hexStrOf2(view.preOutput) ?? ''} tone="internal" />
            <FlowArrow op="FP" />
            <DataBlock label="output" value={hexStrOf2(view.resultHex) ?? ''} tone="output" big />
          </div>
        )
      case 'des-result':
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'plaintext' : 'ciphertext'}
              value={hexStrOf2(view.hex) ?? ''}
              tone="output"
              big
            />
          </div>
        )
      default:
        return null
    }
  },
}
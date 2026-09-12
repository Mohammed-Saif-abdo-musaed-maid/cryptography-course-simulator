import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hexToBytes, bytesToHex } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'aes'

type HexMatrix = string[][]

const hx2 = (v: number): string => v.toString(16).padStart(2, '0')

// prettier-ignore
const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]

const INV_SBOX: number[] = (() => {
  const s = new Array<number>(256)
  for (let i = 0; i < 256; i++) s[SBOX[i]] = i
  return s
})()

const RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a]
const ROUNDS: Record<number, number> = { 16: 10, 24: 12, 32: 14 }

const xtime = (a: number): number => {
  let v = a << 1
  if (v & 0x100) v ^= 0x11b
  return v & 0xff
}

const gfMul = (a: number, b: number): number => {
  let r = 0
  let x = a
  let y = b
  for (let i = 0; i < 8; i++) {
    if (y & 1) r ^= x
    y >>= 1
    x = xtime(x)
  }
  return r & 0xff
}

const clone4 = (s: number[][]): number[][] => s.map((row) => row.slice())

const stateFromBlock = (block: Uint8Array): number[][] =>
  Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => block[r + 4 * c]))

const stateToBytes = (s: number[][]): Uint8Array => {
  const out = new Uint8Array(16)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) out[c * 4 + r] = s[r][c]
  return out
}

const addRoundKey = (s: number[][], rk: number[][]): number[][] => {
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) s[r][c] ^= rk[c][r]
  return s
}

const subBytes = (s: number[][]): number[][] => {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s[r][c] = SBOX[s[r][c]]
  return s
}

const invSubBytes = (s: number[][]): number[][] => {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s[r][c] = INV_SBOX[s[r][c]]
  return s
}

const shiftRows = (s: number[][]): number[][] => {
  for (let r = 1; r < 4; r++) s[r] = s[r].slice(r).concat(s[r].slice(0, r))
  return s
}

const invShiftRows = (s: number[][]): number[][] => {
  for (let r = 1; r < 4; r++) s[r] = s[r].slice(4 - r).concat(s[r].slice(0, 4 - r))
  return s
}

const mixColumns = (s: number[][]): number[][] => {
  for (let c = 0; c < 4; c++) {
    const a0 = s[0][c], a1 = s[1][c], a2 = s[2][c], a3 = s[3][c]
    s[0][c] = xtime(a0) ^ gfMul(a1, 3) ^ a2 ^ a3
    s[1][c] = xtime(a1) ^ gfMul(a2, 3) ^ a3 ^ a0
    s[2][c] = xtime(a2) ^ gfMul(a3, 3) ^ a0 ^ a1
    s[3][c] = xtime(a3) ^ gfMul(a0, 3) ^ a1 ^ a2
  }
  return s
}

const invMixColumns = (s: number[][]): number[][] => {
  for (let c = 0; c < 4; c++) {
    const a0 = s[0][c], a1 = s[1][c], a2 = s[2][c], a3 = s[3][c]
    s[0][c] = gfMul(a0, 14) ^ gfMul(a1, 11) ^ gfMul(a2, 13) ^ gfMul(a3, 9)
    s[1][c] = gfMul(a0, 9) ^ gfMul(a1, 14) ^ gfMul(a2, 11) ^ gfMul(a3, 13)
    s[2][c] = gfMul(a0, 13) ^ gfMul(a1, 9) ^ gfMul(a2, 14) ^ gfMul(a3, 11)
    s[3][c] = gfMul(a0, 11) ^ gfMul(a1, 13) ^ gfMul(a2, 9) ^ gfMul(a3, 14)
  }
  return s
}

const expandRoundKeys = (key: Uint8Array): { nr: number; nk: number; roundKeys: number[][][] } => {
  const nk = key.length / 4
  const nr = ROUNDS[key.length]
  const expanded: number[][] = []
  for (let i = 0; i < nk; i++) expanded.push([key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]])
  for (let i = nk; i < 4 * (nr + 1); i++) {
    const temp = expanded[i - 1].slice()
    if (i % nk === 0) {
      const rotated = [temp[1], temp[2], temp[3], temp[0]].map((b) => SBOX[b])
      rotated[0] ^= RCON[i / nk - 1]
      const prev = expanded[i - nk]
      expanded.push([rotated[0] ^ prev[0], rotated[1] ^ prev[1], rotated[2] ^ prev[2], rotated[3] ^ prev[3]])
    } else if (nk > 6 && i % nk === 4) {
      const sb = temp.map((b) => SBOX[b])
      const prev = expanded[i - nk]
      expanded.push([sb[0] ^ prev[0], sb[1] ^ prev[1], sb[2] ^ prev[2], sb[3] ^ prev[3]])
    } else {
      const prev = expanded[i - nk]
      expanded.push([temp[0] ^ prev[0], temp[1] ^ prev[1], temp[2] ^ prev[2], temp[3] ^ prev[3]])
    }
  }
  const roundKeys: number[][][] = []
  for (let i = 0; i < 4 * (nr + 1); i += 4) roundKeys.push(expanded.slice(i, i + 4))
  return { nr, nk, roundKeys }
}

const roundKeyHex = (rk: number[][]): string => bytesToHex(new Uint8Array(rk.flat()))

interface AesLive {
  nk: number
  nr: number
  roundKeysHex: string[]
  initial: HexMatrix
  rounds: HexMatrix[]
  final: HexMatrix
  resultHex: string
}

function aesLive(blockHex: string, keyHex: string, decrypt: boolean): AesLive {
  const block = hexToBytes(blockHex)
  const key = hexToBytes(keyHex)
  if (block.length !== 16) throw new Error('aes block must be 16 bytes')
  const { nr, nk, roundKeys } = expandRoundKeys(key)
  const state = stateFromBlock(block)
  const rkHex = roundKeys.map(roundKeyHex)

  if (!decrypt) {
    addRoundKey(state, roundKeys[0])
    const initial = state.map((row) => row.map(hx2))
    const rounds: HexMatrix[] = []
    for (let rnd = 1; rnd < nr; rnd++) {
      subBytes(state)
      shiftRows(state)
      mixColumns(state)
      addRoundKey(state, roundKeys[rnd])
      rounds.push(state.map((row) => row.map(hx2)))
    }
    subBytes(state)
    shiftRows(state)
    addRoundKey(state, roundKeys[nr])
    return {
      nk,
      nr,
      roundKeysHex: rkHex,
      initial,
      rounds,
      final: state.map((row) => row.map(hx2)),
      resultHex: bytesToHex(stateToBytes(state)),
    }
  }

  addRoundKey(state, roundKeys[nr])
  const initial = state.map((row) => row.map(hx2))
  const rounds: HexMatrix[] = []
  for (let rnd = nr - 1; rnd >= 1; rnd--) {
    invShiftRows(state)
    invSubBytes(state)
    addRoundKey(state, roundKeys[rnd])
    invMixColumns(state)
    rounds.push(state.map((row) => row.map(hx2)))
  }
  invShiftRows(state)
  invSubBytes(state)
  addRoundKey(state, roundKeys[0])
  return {
    nk,
    nr,
    roundKeysHex: rkHex,
    initial,
    rounds,
    final: state.map((row) => row.map(hx2)),
    resultHex: bytesToHex(stateToBytes(state)),
  }
}

interface Round1Detail {
  a: HexMatrix
  b: HexMatrix
  c: HexMatrix
  d: HexMatrix
}

function aesRound1Detail(startHex: HexMatrix, roundKeyHexStr: string, decrypt: boolean): Round1Detail {
  const s = startHex.map((row) => row.map((c) => parseInt(c, 16)))
  const rk = stateFromBlock(hexToBytes(roundKeyHexStr))
  if (!decrypt) {
    const m1 = subBytes(clone4(s))
    const m2 = shiftRows(clone4(m1))
    const m3 = mixColumns(clone4(m2))
    const m4 = addRoundKey(clone4(m3), rk)
    return {
      a: m1.map((r) => r.map(hx2)),
      b: m2.map((r) => r.map(hx2)),
      c: m3.map((r) => r.map(hx2)),
      d: m4.map((r) => r.map(hx2)),
    }
  }
  const m1 = invShiftRows(clone4(s))
  const m2 = invSubBytes(clone4(m1))
  const m3 = addRoundKey(clone4(m2), rk)
  const m4 = invMixColumns(clone4(m3))
  return {
    a: m1.map((r) => r.map(hx2)),
    b: m2.map((r) => r.map(hx2)),
    c: m3.map((r) => r.map(hx2)),
    d: m4.map((r) => r.map(hx2)),
  }
}

const isHexMatrix = (v: unknown): v is string[][] =>
  Array.isArray(v) && (v as string[][]).every((r) => Array.isArray(r) && r.every((c) => typeof c === 'string'))

const hexStrOf = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const changedCells = (before: HexMatrix, after: HexMatrix): Array<[number, number]> => {
  const out: Array<[number, number]> = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (before[r]?.[c] !== after[r]?.[c]) out.push([r, c])
  return out
}

const sboxGrid: HexMatrix = Array.from({ length: 16 }, (_, r) =>
  Array.from({ length: 16 }, (_, c) => hx2(SBOX[r * 16 + c])),
)

const flatKeysOf = (rows: Array<Record<string, unknown>>): string[] =>
  rows.map((k) => hexStrOf(k.hex) ?? '').filter(Boolean)

export const aesEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.aes.name',
  educationalKey: 'simulation.aes.educational',
  demoInputs: {
    block: '00112233445566778899AABBCCDDEEFF',
    key: '000102030405060708090A0B0C0D0E0F',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const block = String(ctx.inputs.block ?? '00112233445566778899AABBCCDDEEFF').replace(/\s/g, '')
    const key = String(ctx.inputs.key ?? '000102030405060708090A0B0C0D0E0F').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: AesLive | null = null
    try {
      live = aesLive(block, key, decrypt)
    } catch {
      live = null
    }

    const boundStates = hasResult && Array.isArray(extra?.round_states)
      ? (extra?.round_states as Array<Record<string, unknown>>)
      : undefined
    const boundKeys = hasResult && Array.isArray(extra?.round_keys)
      ? (extra?.round_keys as Array<Record<string, unknown>>)
      : undefined

    const matrixAt = (i: number): HexMatrix | undefined => {
      const box = boundStates && i < boundStates.length ? boundStates[i] : undefined
      const m = box && isHexMatrix(box.state_matrix) ? box.state_matrix : undefined
      if (m) return m
      if (!live) return undefined
      if (i === 0) return live.initial
      if (i === live.nr) return live.final
      return live.rounds[i - 1]
    }

    const nr = live ? live.nr : boundStates ? boundStates.length - 1 : 10
    const nk = live ? live.nk : Math.floor(key.length / 8)

    const initial = matrixAt(0)
    const finalState = matrixAt(nr)
    let blockMatrix = initial
    try {
      blockMatrix = stateFromBlock(hexToBytes(block)).map((row) => row.map(hx2))
    } catch {
      blockMatrix = initial
    }

    const roundKeysHex: string[] = boundKeys ? flatKeysOf(boundKeys) : (live?.roundKeysHex ?? [])

    const midStates: HexMatrix[] = []
    if (boundStates) {
      for (let i = 1; i <= nr - 1; i++) {
        const m = boundStates[i] && isHexMatrix(boundStates[i].state_matrix) ? (boundStates[i].state_matrix as HexMatrix) : undefined
        if (m) midStates.push(m)
      }
    } else if (live) {
      midStates.push(...live.rounds)
    }

    const firstRoundIdx = decrypt ? Math.max(0, nr - 1) : 1
    const firstKeyHex = roundKeysHex[firstRoundIdx] ?? ''
    const firstKeyMatrix = firstKeyHex.length === 32 ? stateFromBlock(hexToBytes(firstKeyHex)).map((r) => r.map(hx2)) : undefined
    const detail = initial && firstKeyHex.length === 32 ? aesRound1Detail(initial, firstKeyHex, decrypt) : undefined

    const resultHex = hasResult
      ? (hexStrOf(ctx.result?.result)?.replace(/\s/g, '') ?? live?.resultHex ?? '')
      : (live?.resultHex ?? '')

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.aes.input.title',
        descKey: 'simulation.aes.input.desc',
        descArgs: { nk, nr, bits: nk * 32 },
        phase: 'input',
        view: { kind: 'aes-input', block, key, state: blockMatrix, nk, nr },
      },
      {
        id: `${id}-key`,
        titleKey: 'simulation.aes.key.title',
        descKey: 'simulation.aes.key.desc',
        descArgs: { nk, nr },
        phase: 'key',
        view: { kind: 'aes-key', roundKeys: roundKeysHex, nk, nr },
      },
      {
        id: `${id}-addkey`,
        titleKey: 'simulation.aes.addkey.title',
        descKey: 'simulation.aes.addkey.desc',
        descArgs: { nr },
        phase: 'transform',
        view: {
          kind: 'aes-addkey',
          before: blockMatrix,
          after: initial,
          roundKey: firstKeyMatrix,
          highlight: blockMatrix && initial ? changedCells(blockMatrix, initial) : [],
        },
      },
      {
        id: `${id}-sbox`,
        titleKey: decrypt ? 'simulation.aes.sbox.dTitle' : 'simulation.aes.sbox.title',
        descKey: decrypt ? 'simulation.aes.sbox.dDesc' : 'simulation.aes.sbox.desc',
        phase: 'transform',
        view: { kind: 'aes-sbox', byteIn: initial, byteOut: detail?.a, decrypt },
      },
      {
        id: `${id}-round`,
        titleKey: decrypt ? 'simulation.aes.round.dTitle' : 'simulation.aes.round.title',
        descKey: decrypt ? 'simulation.aes.round.dDesc' : 'simulation.aes.round.desc',
        descArgs: { nr },
        phase: 'transform',
        view: { kind: 'aes-round', a: detail?.a, b: detail?.b, c: detail?.c, d: detail?.d, decrypt, roundKey: firstKeyHex },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.aes.rounds.title',
        descKey: 'simulation.aes.rounds.desc',
        descArgs: { count: midStates.length, nr },
        phase: 'internal',
        view: { kind: 'aes-rounds', rounds: midStates },
      },
      {
        id: `${id}-final`,
        titleKey: decrypt ? 'simulation.aes.final.dTitle' : 'simulation.aes.final.title',
        descKey: decrypt ? 'simulation.aes.final.dDesc' : 'simulation.aes.final.desc',
        descArgs: { nr },
        phase: 'output',
        view: { kind: 'aes-final', state: finalState, hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'aes-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="block" value={hexStrOf(view.block) ?? ''} tone="input" big />
            <DataBlock label="key" value={hexStrOf(view.key) ?? ''} tone="key" big />
            <FlowArrow />
            <MatrixGrid matrix={view.state as HexMatrix} tone="input" />
          </div>
        )
      case 'aes-key': {
        const keys = view.roundKeys as string[]
        return (
          <div className="lab-stage-view">
            <DataBlock label="schedule" value={`Nk = ${Number(view.nk)} words, ${Number(view.nr) + 1} round keys`} tone="key" />
            <FlowArrow />
            {keys.map((k, i) => (
              <DataBlock key={i} label={`K${i}`} value={k} tone={i % 2 === 0 ? 'key' : 'internal'} />
            ))}
          </div>
        )
      }
      case 'aes-addkey': {
        const before = view.before as HexMatrix | undefined
        const after = view.after as HexMatrix | undefined
        const rk = view.roundKey as HexMatrix | undefined
        if (!before || !after) return null
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={before} tone="input" />
            {rk && (
              <>
                <FlowArrow op="XOR" />
                <MatrixGrid matrix={rk} tone="key" />
              </>
            )}
            <FlowArrow op="AddRoundKey" />
            <MatrixGrid matrix={after} highlight={view.highlight as Array<[number, number]>} tone="transform" />
          </div>
        )
      }
      case 'aes-sbox': {
        const byteIn = view.byteIn as HexMatrix | undefined
        const byteOut = view.byteOut as HexMatrix | undefined
        if (!byteIn || !byteOut) return null
        const target = new Set(byteIn.flat())
        const hl: Array<[number, number]> = []
        sboxGrid.forEach((row, r) =>
          row.forEach((cell, c) => {
            if (target.has(cell)) hl.push([r, c])
          }),
        )
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={byteIn} tone="internal" />
            <FlowArrow op={view.decrypt ? 'InvSubBytes' : 'SubBytes'} />
            <MatrixGrid matrix={sboxGrid} highlight={hl.slice(0, 64)} tone="muted" />
            <FlowArrow />
            <MatrixGrid matrix={byteOut} tone="transform" />
          </div>
        )
      }
      case 'aes-round': {
        const a = view.a as HexMatrix | undefined
        const b = view.b as HexMatrix | undefined
        const c = view.c as HexMatrix | undefined
        const d = view.d as HexMatrix | undefined
        if (!a || !b || !c || !d) return null
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={a} tone="internal" />
            <FlowArrow op={view.decrypt ? 'InvShiftRows' : 'ShiftRows'} />
            <MatrixGrid matrix={b} tone="transform" />
            <FlowArrow op={view.decrypt ? 'InvMixColumns' : 'MixColumns'} />
            <MatrixGrid matrix={c} tone="transform" />
            <FlowArrow op="AddRoundKey" />
            <MatrixGrid matrix={d} tone="output" />
            <DataBlock label="round key" value={hexStrOf(view.roundKey) ?? ''} tone="key" />
          </div>
        )
      }
      case 'aes-rounds': {
        const rounds = view.rounds as HexMatrix[]
        if (!rounds.length) return null
        return (
          <div className="lab-stage-view">
            {rounds.map((m, i) => (
              <div key={i} className="lab-ec-plane">
                <DataBlock label={`round ${i + 1}`} value="" tone="muted" />
                <MatrixGrid matrix={m} tone="internal" />
              </div>
            ))}
          </div>
        )
      }
      case 'aes-final': {
        const state = view.state as HexMatrix | undefined
        return (
          <div className="lab-stage-view">
            {state && <MatrixGrid matrix={state} tone="output" />}
            <FlowArrow />
            <DataBlock label={view.decrypt ? 'plaintext' : 'ciphertext'} value={hexStrOf(view.hex) ?? ''} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}
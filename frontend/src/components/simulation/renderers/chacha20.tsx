import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hexToBytes, bytesToHex, strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'chacha20'

type Words = number[]

const w8 = (v: number): string => (v >>> 0).toString(16).padStart(8, '0')

const rotl = (v: number, s: number): number => ((v << s) | (v >>> (32 - s))) >>> 0

const addMod = (a: number, b: number): number => (a + b) >>> 0

const quarterRound = (s: Words, a: number, b: number, c: number, d: number): void => {
  s[a] = addMod(s[a], s[b])
  s[d] = rotl(s[d] ^ s[a], 16)
  s[c] = addMod(s[c], s[d])
  s[b] = rotl(s[b] ^ s[c], 12)
  s[a] = addMod(s[a], s[b])
  s[d] = rotl(s[d] ^ s[a], 8)
  s[c] = addMod(s[c], s[d])
  s[b] = rotl(s[b] ^ s[c], 7)
}

const COLUMNS: Array<[number, number, number, number]> = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
]

const DIAGONALS: Array<[number, number, number, number]> = [
  [0, 5, 10, 15],
  [1, 6, 11, 12],
  [2, 7, 8, 13],
  [3, 4, 9, 14],
]

const CONSTANT_WORDS: Words = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]

const leWords = (bytes: Uint8Array): Words => {
  const out: Words = []
  for (let i = 0; i < bytes.length; i += 4) {
    const b0 = bytes[i] ?? 0
    const b1 = bytes[i + 1] ?? 0
    const b2 = bytes[i + 2] ?? 0
    const b3 = bytes[i + 3] ?? 0
    out.push((b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0)
  }
  return out
}

const wordsToBytes = (ws: Words): Uint8Array => {
  const out = new Uint8Array(ws.length * 4)
  ws.forEach((w, i) => {
    out[4 * i] = w & 0xff
    out[4 * i + 1] = (w >>> 8) & 0xff
    out[4 * i + 2] = (w >>> 16) & 0xff
    out[4 * i + 3] = (w >>> 24) & 0xff
  })
  return out
}

const initialState = (keyHex: string, nonceHex: string, counter: number): Words => {
  const key = leWords(hexToBytes(keyHex))
  const nonce = leWords(hexToBytes(nonceHex))
  return CONSTANT_WORDS.concat(key).concat([counter >>> 0]).concat(nonce)
}

const chachaBlock = (keyHex: string, nonceHex: string, counter: number): { init: Words; working: Words; ks: Words; doubleStates: Words[] } => {
  const init = initialState(keyHex, nonceHex, counter)
  const working = init.slice()
  const doubleStates: Words[] = []
  for (let r = 0; r < 10; r++) {
    for (const q of COLUMNS) quarterRound(working, q[0], q[1], q[2], q[3])
    for (const q of DIAGONALS) quarterRound(working, q[0], q[1], q[2], q[3])
    doubleStates.push(working.slice())
  }
  const ks = init.map((w, i) => addMod(w, working[i]))
  return { init, working, ks, doubleStates }
}

const xorBytes = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const out = new Uint8Array(a.length)
  for (let i = 0; i < a.length; i++) out[i] = (a[i] ?? 0) ^ (b[i] ?? 0)
  return out
}

interface ChachaLive {
  dataHex: string
  keyHex: string
  nonceHex: string
  counter: number
  initWords: Words
  finalWorking: Words
  afterDouble1: Words
  ksWords: Words
  firstKsHex: string
  resultHex: string
  blocks: Array<{ block: number; counter: number; keystream: string }>
}

function chachaLive(message: string, keyHex: string, nonceHex: string, counter: number, decrypt: boolean): ChachaLive {
  const dataBytes = decrypt ? hexToBytes(message.toLowerCase()) : strToBytes(message)
  const { init, working, ks, doubleStates } = chachaBlock(keyHex.toLowerCase(), nonceHex.toLowerCase(), counter)
  const ksBytes = wordsToBytes(ks)
  const cipherBytes = xorBytes(dataBytes, ksBytes.slice(0, dataBytes.length))
  const blocks: Array<{ block: number; counter: number; keystream: string }> = []
  if (dataBytes.length > 0) {
    blocks.push({ block: 0, counter, keystream: bytesToHex(ksBytes) })
    for (let b = 1; b * 64 < dataBytes.length; b++) {
      const r = chachaBlock(keyHex.toLowerCase(), nonceHex.toLowerCase(), counter + b)
      blocks.push({ block: b, counter: counter + b, keystream: bytesToHex(wordsToBytes(r.ks)) })
    }
  }
  return {
    dataHex: bytesToHex(dataBytes),
    keyHex: keyHex.toLowerCase(),
    nonceHex: nonceHex.toLowerCase(),
    counter,
    initWords: init,
    finalWorking: working,
    afterDouble1: doubleStates[0] ?? working,
    ksWords: ks,
    firstKsHex: bytesToHex(ksBytes),
    resultHex: bytesToHex(cipherBytes),
    blocks,
  }
}

const hexStrOf4 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const wordList = (v: unknown): string[] | undefined =>
  Array.isArray(v) && (v as unknown[]).every((x) => typeof x === 'string') ? (v as string[]) : undefined

const wordMatrix = (words: string[]): string[][] =>
  Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => words[r * 4 + c] ?? '--------'))

export const chacha20Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.chacha20.name',
  educationalKey: 'simulation.chacha20.educational',
  demoInputs: {
    message: 'Hello, cryptography!',
    key: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    nonce: '000000000000004A00000000',
    counter: 1,
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const message = String(ctx.inputs.message ?? 'Hello, cryptography!')
    const keyHex = String(ctx.inputs.key ?? '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F').replace(/\s/g, '')
    const nonceHex = String(ctx.inputs.nonce ?? '000000000000004A00000000').replace(/\s/g, '')
    const counter = Number(ctx.inputs.counter ?? 1) || 0
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: ChachaLive | null = null
    try {
      live = chachaLive(message, keyHex, nonceHex, counter, decrypt)
    } catch {
      live = null
    }

    const initBound = hasResult && wordList(extra?.initial_state) ? (wordList(extra?.initial_state) as string[]) : undefined
    const initWords = initBound ?? (live ? live.initWords.map(w8) : [])
    const initMatrix = initWords.length >= 16 ? wordMatrix(initWords) : undefined

    const blocks = hasResult && Array.isArray(extra?.blocks)
      ? (extra?.blocks as Array<Record<string, unknown>>).map((b) => ({
          block: Number(b.block) || 0,
          counter: Number(b.counter) || 0,
          keystream: hexStrOf4(b.keystream) ?? '',
        }))
      : (live?.blocks ?? [])

    const firstKsHex = (blocks[0]?.keystream ?? '') !== '' ? (blocks[0]?.keystream ?? '') : (live?.firstKsHex ?? '')
    const ksGridBound = firstKsHex.length >= 128 ? wordMatrix((firstKsHex.match(/.{8}/g) ?? []).slice(0, 16)) : undefined

    let qrAfter = initMatrix
    if (initMatrix && !initBound && live) {
      const s = live.initWords.slice()
      quarterRound(s, 0, 4, 8, 12)
      qrAfter = wordMatrix(s.map(w8))
    }

    const doubleAfter = live ? wordMatrix(live.afterDouble1.map(w8)) : undefined
    const workingGrid = live ? wordMatrix(live.finalWorking.map(w8)) : undefined
    const ksGrid = live ? wordMatrix(live.ksWords.map(w8)) : ksGridBound

    const resultHex = hasResult ? (hexStrOf4(ctx.result?.result) ?? live?.resultHex ?? '') : (live?.resultHex ?? '')

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.chacha20.input.title',
        descKey: 'simulation.chacha20.input.desc',
        phase: 'input',
        view: { kind: 'chacha-input', message, key: keyHex.toLowerCase(), nonce: nonceHex.toLowerCase(), counter },
      },
      {
        id: `${id}-state`,
        titleKey: 'simulation.chacha20.state.title',
        descKey: 'simulation.chacha20.state.desc',
        phase: 'internal',
        view: { kind: 'chacha-state', grid: initMatrix },
      },
      {
        id: `${id}-quarter`,
        titleKey: 'simulation.chacha20.quarter.title',
        descKey: 'simulation.chacha20.quarter.desc',
        phase: 'transform',
        view: { kind: 'chacha-quarter', grid: initMatrix, after: qrAfter },
      },
      {
        id: `${id}-double`,
        titleKey: 'simulation.chacha20.double.title',
        descKey: 'simulation.chacha20.double.desc',
        phase: 'transform',
        view: { kind: 'chacha-double', grid: initMatrix, after: doubleAfter },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.chacha20.rounds.title',
        descKey: 'simulation.chacha20.rounds.desc',
        phase: 'internal',
        view: { kind: 'chacha-rounds', working: workingGrid },
      },
      {
        id: `${id}-keystream`,
        titleKey: 'simulation.chacha20.keystream.title',
        descKey: 'simulation.chacha20.keystream.desc',
        phase: 'transform',
        view: { kind: 'chacha-keystream', init: initMatrix, ks: ksGrid, ksHex: firstKsHex },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.chacha20.result.title',
        descKey: 'simulation.chacha20.result.desc',
        phase: 'output',
        view: { kind: 'chacha-result', hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'chacha-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label={view.decrypt ? 'ciphertext (hex)' : 'plaintext'} value={hexStrOf4(view.message) ?? ''} tone="input" />
            <DataBlock label="key" value={hexStrOf4(view.key) ?? ''} tone="key" big />
            <DataBlock label="nonce" value={hexStrOf4(view.nonce) ?? ''} tone="key" />
            <DataBlock label="counter" value={String(view.counter)} tone="key" />
          </div>
        )
      case 'chacha-state': {
        const grid = view.grid as string[][] | undefined
        if (!grid) return null
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} tone="internal" />
          </div>
        )
      }
      case 'chacha-quarter': {
        const grid = view.grid as string[][] | undefined
        const after = view.after as string[][] | undefined
        if (!grid || !after) return null
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} highlight={[[0, 0], [1, 0], [2, 0], [3, 0]]} tone="internal" />
            <FlowArrow op="quarter_round (0,4,8,12)" />
            <MatrixGrid matrix={after} highlight={[[0, 0], [1, 0], [2, 0], [3, 0]]} tone="active" />
          </div>
        )
      }
      case 'chacha-double': {
        const grid = view.grid as string[][] | undefined
        const after = view.after as string[][] | undefined
        if (!grid || !after) return null
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={grid} tone="internal" />
            <FlowArrow op="column round + diagonal round" />
            <MatrixGrid matrix={after} tone="transform" />
            <DataBlock label="column round" value="(0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15)" tone="muted" />
            <DataBlock label="diagonal round" value="(0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)" tone="muted" />
          </div>
        )
      }
      case 'chacha-rounds': {
        const working = view.working as string[][] | undefined
        if (!working) return null
        return (
          <div className="lab-stage-view">
            <FlowArrow op="10 double rounds (20 rounds)" />
            <MatrixGrid matrix={working} tone="internal" />
          </div>
        )
      }
      case 'chacha-keystream': {
        const init = view.init as string[][] | undefined
        const ks = view.ks as string[][] | undefined
        return (
          <div className="lab-stage-view">
            {init && <MatrixGrid matrix={init} tone="muted" />}
            <FlowArrow op="init + working (mod 2^32)" />
            {ks && <MatrixGrid matrix={ks} tone="transform" />}
            <DataBlock label="keystream (first 64 bytes)" value={hexStrOf4(view.ksHex) ?? ''} tone="output" big />
          </div>
        )
      }
      case 'chacha-result':
        return (
          <div className="lab-stage-view">
            <DataBlock label={view.decrypt ? 'plaintext' : 'ciphertext'} value={hexStrOf4(view.hex) ?? ''} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
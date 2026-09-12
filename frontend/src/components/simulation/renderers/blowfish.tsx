import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hexToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'blowfish'

const hexStrOf6 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const w8b = (v: number): string => (v >>> 0).toString(16).padStart(8, '0')

const INIT_P = [
  0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0,
  0x082efa98, 0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
  0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b,
]

const bigEndianWord = (bytes: Uint8Array, offset: number): number =>
  (((bytes[offset] ?? 0) << 24) | ((bytes[offset + 1] ?? 0) << 16) | ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0)) >>> 0

const pXorKey = (keyHex: string): number[] => {
  const key = hexToBytes(keyHex)
  const out: number[] = []
  let j = 0
  for (let i = 0; i < 18; i++) {
    let word = 0
    for (let k = 0; k < 4; k++) {
      word = ((word << 8) | (key[j] ?? 0)) >>> 0
      j = (j + 1) % Math.max(1, key.length)
    }
    out.push((INIT_P[i] ?? 0) ^ word)
  }
  return out
}

interface BlowfishLive {
  lHex: string
  rHex: string
  pXor: string[]
}

function blowfishLive(blockHex: string, keyHex: string): BlowfishLive {
  const block = hexToBytes(blockHex)
  const L = bigEndianWord(block, 0)
  const R = bigEndianWord(block, 4)
  return { lHex: w8b(L), rHex: w8b(R), pXor: pXorKey(keyHex).map(w8b) }
}

const wordArr = (v: unknown): string[] | undefined =>
  Array.isArray(v) && (v as unknown[]).every((x) => typeof x === 'string') ? (v as string[]) : undefined

interface BlowfishRound {
  round: number
  L: string
  R: string
}

const roundStatesOf6 = (rows: Array<Record<string, unknown>>): BlowfishRound[] =>
  rows
    .map((r) => ({ round: Number(r.round) || 0, L: hexStrOf6(r.L) ?? '', R: hexStrOf6(r.R) ?? '' }))
    .filter((r) => r.L)

export const blowfishEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.blowfish.name',
  educationalKey: 'simulation.blowfish.educational',
  demoInputs: {
    block: '0123456789ABCDEF',
    key: '0123456789ABCDEFFEDCBA9876543210',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const blockHex = String(ctx.inputs.block ?? '0123456789ABCDEF').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key ?? '0123456789ABCDEFFEDCBA9876543210').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: BlowfishLive | null = null
    try {
      live = blowfishLive(blockHex, keyHex)
    } catch {
      live = null
    }

    const pArray = hasResult && wordArr(extra?.p_array) ? wordArr(extra?.p_array) as string[] : undefined
    const sHeads = hasResult && Array.isArray(extra?.s_box_heads)
      ? ((extra?.s_box_heads as unknown[]).map(wordArr).filter((w): w is string[] => !!w))
      : undefined
    const boundStates = hasResult && Array.isArray(extra?.round_states)
      ? roundStatesOf6(extra?.round_states as Array<Record<string, unknown>>)
      : undefined
    const resultHex = hasResult ? (hexStrOf6(ctx.result?.result)?.replace(/\s/g, '') ?? '') : ''

    const pxor = live?.pXor ?? pArray ?? []

    const L = live?.lHex ?? ''
    const byteSplit = L ? [L.slice(0, 2), L.slice(2, 4), L.slice(4, 6), L.slice(6, 8)] : ['', '', '', '']

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.blowfish.input.title',
        descKey: 'simulation.blowfish.input.desc',
        phase: 'input',
        view: { kind: 'blowfish-input', block: blockHex, key: keyHex, L: live?.lHex ?? '', R: live?.rHex ?? '' },
      },
      {
        id: `${id}-pi`,
        titleKey: 'simulation.blowfish.pi.title',
        descKey: 'simulation.blowfish.pi.desc',
        phase: 'key',
        view: { kind: 'blowfish-pi', p: INIT_P.map(w8b) },
      },
      {
        id: `${id}-ksched`,
        titleKey: 'simulation.blowfish.ksched.title',
        descKey: 'simulation.blowfish.ksched.desc',
        phase: 'key',
        view: { kind: 'blowfish-ksched', pXor: pxor, finalP: pArray ?? [] },
      },
      {
        id: `${id}-f`,
        titleKey: 'simulation.blowfish.f.title',
        descKey: 'simulation.blowfish.f.desc',
        phase: 'transform',
        view: { kind: 'blowfish-f', L: live?.lHex ?? '', bytes: byteSplit, sHeads },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.blowfish.rounds.title',
        descKey: 'simulation.blowfish.rounds.desc',
        descArgs: { rounds: 16 },
        phase: 'internal',
        view: { kind: 'blowfish-rounds', states: boundStates ?? [], L: live?.lHex ?? '', R: live?.rHex ?? '' },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.blowfish.result.dTitle' : 'simulation.blowfish.result.title',
        descKey: 'simulation.blowfish.result.desc',
        phase: 'output',
        view: { kind: 'blowfish-result', hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'blowfish-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="block" value={hexStrOf6(view.block) ?? ''} tone="input" big />
            <DataBlock label="key" value={hexStrOf6(view.key) ?? ''} tone="key" big />
            <FlowArrow op="big-endian split" />
            <DataBlock label="L" value={hexStrOf6(view.L) ?? ''} tone="internal" />
            <DataBlock label="R" value={hexStrOf6(view.R) ?? ''} tone="internal" />
          </div>
        )
      case 'blowfish-pi': {
        const p = view.p as string[]
        return (
          <div className="lab-stage-view">
            <DataBlock label="P-array (from first 148 hex digits of π)" value={`18 words`} tone="key" />
            <FlowArrow />
            {p.map((w, i) => (
              <DataBlock key={i} label={`P[${i}]`} value={w} tone={i % 2 === 0 ? 'key' : 'internal'} />
            ))}
            <DataBlock label="S-boxes" value="S0..S3, 4 × 256 entries from π" tone="muted" />
          </div>
        )
      }
      case 'blowfish-ksched': {
        const pXor = view.pXor as string[]
        const finalP = view.finalP as string[]
        return (
          <div className="lab-stage-view">
            <FlowArrow op="P[i] ⊕ key-word (key bytes cycled)" />
            {pXor.map((w, i) => (
              <DataBlock key={i} label={`P'[${i}]`} value={w} tone="transform" />
            ))}
            {finalP.length > 0 && (
              <>
                <FlowArrow op="re-encrypt zero block" />
                {finalP.map((w, i) => (
                  <DataBlock key={i} label={`P final[${i}]`} value={w} tone="output" />
                ))}
              </>
            )}
          </div>
        )
      }
      case 'blowfish-f': {
        const bytes = view.bytes as string[]
        const sHeads = view.sHeads as string[][] | undefined
        return (
          <div className="lab-stage-view">
            <DataBlock label="F(R) over L" value={hexStrOf6(view.L) ?? ''} tone="internal" />
            <FlowArrow op="split byte a b c d" />
            {bytes.map((b, i) => (
              <DataBlock key={i} label={`byte ${i}`} value={b} tone="internal" />
            ))}
            <DataBlock label="F(x)" value="F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]" tone="transform" big />
            {sHeads && sHeads.map((head, i) => (
              <DataBlock key={i} label={`S${i} head`} value={head.join(' ')} tone="key" />
            ))}
          </div>
        )
      }
      case 'blowfish-rounds': {
        const states = view.states as BlowfishRound[]
        if (states.length > 0) {
          return (
            <div className="lab-stage-view">
              {states.map((s) => (
                <DataBlock key={s.round} label={`R${s.round}`} value={`L ${s.L}   R ${s.R}`} tone={s.round % 2 === 0 ? 'internal' : 'transform'} />
              ))}
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <DataBlock label="L" value={hexStrOf6(view.L) ?? ''} tone="internal" />
            <DataBlock label="R" value={hexStrOf6(view.R) ?? ''} tone="internal" />
            <FlowArrow op="16 × (R ^= F(L) ⊕ P[i]; swap)" />
          </div>
        )
      }
      case 'blowfish-result':
        return (
          <div className="lab-stage-view">
            <DataBlock label={view.decrypt ? 'plaintext' : 'ciphertext'} value={hexStrOf6(view.hex) ?? ''} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
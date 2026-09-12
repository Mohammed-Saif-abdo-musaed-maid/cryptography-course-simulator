import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hexToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'twofish'

const w8c = (v: number): string => (v >>> 0).toString(16).padStart(8, '0')

const hexStrOf7 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const leWord = (bytes: Uint8Array, offset: number): number =>
  (((bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8) | ((bytes[offset + 2] ?? 0) << 16) | ((bytes[offset + 3] ?? 0) << 24)) >>> 0)

interface TwofishLive {
  m0: string
  m1: string
  m2: string
  m3: string
}

function twofishLive(blockHex: string): TwofishLive {
  const block = hexToBytes(blockHex)
  return {
    m0: w8c(leWord(block, 0)),
    m1: w8c(leWord(block, 4)),
    m2: w8c(leWord(block, 8)),
    m3: w8c(leWord(block, 12)),
  }
}

const wordArr7 = (v: unknown): string[] | undefined =>
  Array.isArray(v) && (v as unknown[]).every((x) => typeof x === 'string') ? (v as string[]) : undefined

interface TwofishRound {
  round: number
  a: string
  b: string
  c: string
  d: string
  gA?: string
  gB?: string
  gC?: string
  gD?: string
}

const roundStatesOf7 = (rows: Array<Record<string, unknown>>): TwofishRound[] =>
  rows.map((r) => ({
    round: Number(r.round) || 0,
    a: hexStrOf7(r.a) ?? '',
    b: hexStrOf7(r.b) ?? '',
    c: hexStrOf7(r.c) ?? '',
    d: hexStrOf7(r.d) ?? '',
    gA: hexStrOf7(r.g_a),
    gB: hexStrOf7(r.g_b),
    gC: hexStrOf7(r.g_c),
    gD: hexStrOf7(r.g_d),
  }))

export const twofishEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.twofish.name',
  educationalKey: 'simulation.twofish.educational',
  demoInputs: {
    block: '00000000000000000000000000000000',
    key: '0123456789ABCDEFFEDCBA9876543210',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const blockHex = String(ctx.inputs.block ?? '00000000000000000000000000000000').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key ?? '0123456789ABCDEFFEDCBA9876543210').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: TwofishLive | null = null
    try {
      live = twofishLive(blockHex)
    } catch {
      live = null
    }

    const whitening = hasResult && wordArr7(extra?.whitening_keys) ? wordArr7(extra?.whitening_keys) as string[] : undefined
    const subkeys = hasResult && wordArr7(extra?.round_subkeys) ? wordArr7(extra?.round_subkeys) as string[] : undefined
    const boundStates = hasResult && Array.isArray(extra?.round_states) ? roundStatesOf7(extra?.round_states as Array<Record<string, unknown>>) : undefined
    const sboxes = hasResult && Array.isArray(extra?.sboxes)
      ? ((extra?.sboxes as unknown[]).map(wordArr7).filter((w): w is string[] => !!w))
      : undefined
    const resultHex = hasResult ? (hexStrOf7(ctx.result?.result)?.replace(/\s/g, '') ?? '') : ''
    const keySize = (hasResult && typeof extra?.key_size === 'number' ? extra.key_size : (keyHex.length / 2) * 8)

    const whitenKeys = decrypt
      ? (whitening ?? []).slice(4, 8)
      : (whitening ?? []).slice(0, 4)

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.twofish.input.title',
        descKey: 'simulation.twofish.input.desc',
        descArgs: { bits: keySize },
        phase: 'input',
        view: { kind: 'twofish-input', block: blockHex, key: keyHex, m0: live?.m0 ?? '', m1: live?.m1 ?? '', m2: live?.m2 ?? '', m3: live?.m3 ?? '' },
      },
      {
        id: `${id}-key`,
        titleKey: 'simulation.twofish.key.title',
        descKey: 'simulation.twofish.key.desc',
        descArgs: { bits: keySize },
        phase: 'key',
        view: { kind: 'twofish-key', whitening: whitening ?? [], subkeys: subkeys ?? [] },
      },
      {
        id: `${id}-sboxes`,
        titleKey: 'simulation.twofish.sboxes.title',
        descKey: 'simulation.twofish.sboxes.desc',
        phase: 'key',
        view: { kind: 'twofish-sboxes', sboxes: sboxes ?? [] },
      },
      {
        id: `${id}-whiten`,
        titleKey: 'simulation.twofish.whiten.title',
        descKey: 'simulation.twofish.whiten.desc',
        phase: 'transform',
        view: { kind: 'twofish-whiten', m0: live?.m0 ?? '', m1: live?.m1 ?? '', m2: live?.m2 ?? '', m3: live?.m3 ?? '', keys: whitenKeys, decrypt },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.twofish.rounds.title',
        descKey: 'simulation.twofish.rounds.desc',
        descArgs: { rounds: 16 },
        phase: 'internal',
        view: { kind: 'twofish-rounds', states: boundStates ?? [] },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.twofish.result.dTitle' : 'simulation.twofish.result.title',
        descKey: 'simulation.twofish.result.desc',
        phase: 'output',
        view: { kind: 'twofish-result', hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'twofish-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="block" value={hexStrOf7(view.block) ?? ''} tone="input" big />
            <DataBlock label="key" value={hexStrOf7(view.key) ?? ''} tone="key" big />
            <FlowArrow op="little-endian words" />
            <DataBlock label="m0" value={hexStrOf7(view.m0) ?? ''} tone="internal" />
            <DataBlock label="m1" value={hexStrOf7(view.m1) ?? ''} tone="internal" />
            <DataBlock label="m2" value={hexStrOf7(view.m2) ?? ''} tone="internal" />
            <DataBlock label="m3" value={hexStrOf7(view.m3) ?? ''} tone="internal" />
          </div>
        )
      case 'twofish-key': {
        const whitening = view.whitening as string[]
        const subkeys = view.subkeys as string[]
        return (
          <div className="lab-stage-view">
            <FlowArrow op="RS (12,8) code + h() via q0/q1" />
            {whitening.length > 0 ? (
              whitening.map((w, i) => (
                <DataBlock key={i} label={`w[${i}]`} value={w} tone={i % 2 === 0 ? 'key' : 'internal'} />
              ))
            ) : (
              <DataBlock label="whitening" value="w[0..7] — key schedule" tone="muted" />
            )}
            <FlowArrow />
            {Array.from({ length: 10 }, (_, r) => {
              const keys = subkeys.slice(4 * r, 4 * r + 4)
              return (
                <DataBlock
                  key={r}
                  label={`k round ${r + 1}`}
                  value={keys.length > 0 ? (r === 9 ? `${keys.join(' ')} …` : keys.join(' ')) : 'k[0..39]'}
                  tone={r % 2 === 0 ? 'key' : 'internal'}
                />
              )
            })}
          </div>
        )
      }
      case 'twofish-sboxes': {
        const sboxes = view.sboxes as string[][]
        return (
          <div className="lab-stage-view">
            <FlowArrow op="keyed S-vector → q0/q1 → MDS (GF(2^8), 0x169)" />
            {sboxes.length > 0 ? (
              sboxes.map((row, i) => (
                <DataBlock key={i} label={`S${i} heads`} value={row.slice(0, 8).join(' ')} tone="key" />
              ))
            ) : (
              <DataBlock label="S-boxes" value="S0..S3: 4 × 256 MDS-combined entries" tone="muted" />
            )}
          </div>
        )
      }
      case 'twofish-whiten': {
        const keys = view.keys as string[]
        const words = [hexStrOf7(view.m0) ?? '', hexStrOf7(view.m1) ?? '', hexStrOf7(view.m2) ?? '', hexStrOf7(view.m3) ?? '']
        return (
          <div className="lab-stage-view">
            {words.map((w, i) => (
              <DataBlock key={i} label={`m${i}`} value={w} tone="internal" />
            ))}
            <FlowArrow op={view.decrypt ? 'XOR w[4..7]' : 'XOR w[0..3]'} />
            {keys.length === 4 ? (
              keys.map((k, i) => <DataBlock key={i} label={`w${view.decrypt ? 4 + i : i}`} value={k} tone="key" />)
            ) : (
              <DataBlock label="whitening" value="a = m0 ⊕ w0, b = m1 ⊕ w1, c = m2 ⊕ w2, d = m3 ⊕ w3" tone="muted" />
            )}
          </div>
        )
      }
      case 'twofish-rounds': {
        const states = view.states as TwofishRound[]
        if (states.length > 0) {
          return (
            <div className="lab-stage-view">
              {states.map((s) => (
                <DataBlock
                  key={s.round}
                  label={`R${s.round}`}
                  value={`a ${s.a}  b ${s.b}  c ${s.c}  d ${s.d}${s.gA ? `  | g(a) ${s.gA} g(b) ${s.gB}` : ''}${s.gC ? `  | g(c) ${s.gC} g(d) ${s.gD}` : ''}`}
                  tone={s.round % 2 === 0 ? 'internal' : 'transform'}
                />
              ))}
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <FlowArrow op="16 × (g() keyed S-boxes + MDS → PHT → 1-bit rotations)" />
            <DataBlock label="g(x)" value="g0(x) = S0[x0] ⊕ S1[x1] ⊕ S2[x2] ⊕ S3[x3]" tone="muted" />
          </div>
        )
      }
      case 'twofish-result':
        return (
          <div className="lab-stage-view">
            <DataBlock label={view.decrypt ? 'plaintext' : 'ciphertext'} value={hexStrOf7(view.hex) ?? ''} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
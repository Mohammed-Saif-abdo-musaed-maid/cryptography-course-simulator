import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'sha3'

const RATES: Record<string, number> = { '224': 144, '256': 136, '384': 104, '512': 72 }
const DIGEST_BYTES: Record<string, number> = { '224': 28, '256': 32, '384': 48, '512': 64 }

interface Sha3AbsorbBound {
  block_index: number
  block_hex: string
  lanes_before: string[]
  lanes_xor: string[]
  permuted: boolean
}

export const sha3Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.sha3.name',
  educationalKey: 'simulation.sha3.educational',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const variant = String(ctx.inputs.variant ?? '256').trim()
    const rate = RATES[variant] ?? 136
    const digestBytes = DIGEST_BYTES[variant] ?? 32
    const capacity = 200 - rate
    const len = bytes.length

    const extra = ctx.result?.extra
    const boundDigest =
      typeof extra?.digest === 'string'
        ? extra.digest
        : typeof ctx.result?.result === 'string'
          ? ctx.result.result
          : ''
    const hasResult = boundDigest.length > 0
    const absorb = Array.isArray(extra?.absorb) ? (extra.absorb as unknown as Sha3AbsorbBound[]) : []
    const state = Array.isArray(extra?.state) ? (extra.state as unknown as string[]) : []
    const structuralBlocks = Math.ceil((len + 1) / rate)
    const blockCount = absorb.length > 0 ? absorb.length : structuralBlocks

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.sha3.input.title',
        descKey: 'simulation.sha3.input.desc',
        descArgs: { len, variant, rate },
        phase: 'input',
        view: { kind: 'sha3-input', text: message, hex: bytesToHex(bytes), len, variant, rate },
      },
      {
        id: `${id}-sponge`,
        titleKey: 'simulation.sha3.sponge.title',
        descKey: 'simulation.sha3.sponge.desc',
        descArgs: { rate, capacity },
        phase: 'internal',
        view: { kind: 'sha3-sponge', rate, capacity },
      },
      {
        id: `${id}-absorb`,
        titleKey: 'simulation.sha3.absorb.title',
        descKey: 'simulation.sha3.absorb.desc',
        descArgs: { blocks: blockCount },
        phase: 'transform',
        view: {
          kind: 'sha3-absorb',
          absorb,
          blocks: blockCount,
          rate,
          rateLanes: rate / 8,
          hasResult,
        },
      },
      {
        id: `${id}-squeeze`,
        titleKey: 'simulation.sha3.squeeze.title',
        descKey: 'simulation.sha3.squeeze.desc',
        descArgs: { digestBytes },
        phase: 'internal',
        view: { kind: 'sha3-squeeze', state, digestBytes, hasResult },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.sha3.digest.title',
        descKey: 'simulation.sha3.digest.desc',
        descArgs: { variant },
        phase: 'output',
        view: { kind: 'sha3-digest', digest: boundDigest, hasResult },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'sha3-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
            <DataBlock label="rate" value={String(view.rate)} tone="key" />
          </div>
        )
      case 'sha3-sponge': {
        const rate = Number(view.rate)
        const rateLanes = rate / 8
        const highlight: Array<[number, number]> = []
        for (let i = 0; i < rateLanes; i++) highlight.push([Math.floor(i / 5), i % 5])
        const lanes: (string | number)[][] = []
        for (let y = 0; y < 5; y++) {
          const row: (string | number)[] = []
          for (let x = 0; x < 5; x++) row.push(0)
          lanes.push(row)
        }
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={lanes} highlight={highlight} tone="muted" />
            <DataBlock label="rate region" value={String(rate)} tone="internal" />
            <DataBlock label="capacity" value={String(view.capacity)} tone="key" />
          </div>
        )
      }
      case 'sha3-absorb': {
        const absorb = view.absorb as Sha3AbsorbBound[]
        const rateLanes = Number(view.rateLanes)
        const blocks = Number(view.blocks)
        const hasResult = Boolean(view.hasResult)
        if (hasResult && absorb.length > 0) {
          return (
            <div className="lab-stage-view">
              {absorb.map((b) => (
                <div className="lab-round-sample" key={b.block_index}>
                  <div className="lab-round-sample-head mono" dir="ltr">
                    block {b.block_index}
                  </div>
                  <MatrixGrid matrix={[b.lanes_xor]} tone="transform" />
                </div>
              ))}
            </div>
          )
        }
        const rows: (string | number)[][] = []
        for (let i = 0; i < blocks; i++) {
          rows.push(Array.from({ length: rateLanes }, () => '·'))
        }
        return (
          <div className="lab-stage-view">
            {rows.map((row, i) => (
              <div className="lab-round-sample" key={i}>
                <div className="lab-round-sample-head mono" dir="ltr">block {i}</div>
                <MatrixGrid matrix={[row]} tone="muted" />
              </div>
            ))}
          </div>
        )
      }
      case 'sha3-squeeze': {
        const state = (view.state as string[] | undefined) ?? []
        const digestBytes = Number(view.digestBytes)
        const hasResult = Boolean(view.hasResult)
        const lanes: (string | number)[][] = []
        for (let y = 0; y < 5; y++) {
          const row: (string | number)[] = []
          for (let x = 0; x < 5; x++) row.push(hasResult ? (state[y * 5 + x] ?? 0) : 0)
          lanes.push(row)
        }
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={lanes} tone="internal" />
            <FlowArrow op={`Keccak-f x24 + squeeze`} />
            <DataBlock label="digest bytes" value={String(digestBytes)} tone="output" />
          </div>
        )
      }
      case 'sha3-digest': {
        const hasResult = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock
              label="digest"
              value={String(hasResult ? view.digest : '—')}
              tone={hasResult ? 'output' : 'muted'}
              big
            />
          </div>
        )
      }
      default:
        return null
    }
  },
}
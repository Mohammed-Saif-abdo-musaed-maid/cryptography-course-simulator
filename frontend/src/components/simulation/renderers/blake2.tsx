import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'blake2'

const IV_512 = [
  '6a09e667f3bcc908',
  'bb67ae8584caa73b',
  '3c6ef372fe94f82b',
  'a54ff53a5f1d36f1',
  '510e527fade682d1',
  '9b05688c2b3e6c1f',
  '1f83d9abfb41bd6b',
  '5be0cd19137e2179',
]

const IV_256 = [
  '6a09e667',
  'bb67ae85',
  '3c6ef372',
  'a54ff53a',
  '510e527f',
  '9b05688c',
  '1f83d9ab',
  '5be0cd19',
]

const SIGMA: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
]

export const blake2Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.blake2.name',
  educationalKey: 'simulation.blake2.educational',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx: SimulationContext): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const variant = String(ctx.inputs.variant ?? '512').trim()
    const is512 = variant === '512'
    const rounds = is512 ? 12 : 10
    const blockBytes = is512 ? 128 : 64
    const digestBytes = is512 ? 64 : 32
    const digestBits = digestBytes * 8
    const param = is512 ? '01010040' : '01010020'
    const iv = is512 ? IV_512 : IV_256
    const hInit = iv.map((w, i) => (i === 0 ? xorHex(w, param) : w))
    const len = bytes.length

    const extra = ctx.result?.extra
    const boundDigest =
      typeof extra?.digest === 'string'
        ? extra.digest
        : typeof ctx.result?.result === 'string'
          ? ctx.result.result
          : ''
    const hasResult = boundDigest.length > 0

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.blake2.input.title',
        descKey: 'simulation.blake2.input.desc',
        descArgs: { len, variant, rounds, digestBits },
        phase: 'input',
        view: {
          kind: 'blake2-input',
          text: message,
          hex: bytesToHex(bytes),
          len,
          variant,
          rounds,
          digestBits,
        },
      },
      {
        id: `${id}-param`,
        titleKey: 'simulation.blake2.param.title',
        descKey: 'simulation.blake2.param.desc',
        phase: 'key',
        view: { kind: 'blake2-param', param, hInit },
      },
      {
        id: `${id}-state`,
        titleKey: 'simulation.blake2.state.title',
        descKey: 'simulation.blake2.state.desc',
        phase: 'internal',
        view: { kind: 'blake2-state', v: hInit.concat(iv) },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.blake2.rounds.title',
        descKey: 'simulation.blake2.rounds.desc',
        descArgs: { rounds, blockBytes },
        phase: 'internal',
        view: { kind: 'blake2-rounds', rounds, blockBytes, sigma: SIGMA, is512, hasResult },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.blake2.digest.title',
        descKey: 'simulation.blake2.digest.desc',
        phase: 'output',
        view: { kind: 'blake2-digest', digest: boundDigest, hasResult },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'blake2-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
            <DataBlock label="variant" value={`blake2${String(view.variant)}`} tone="key" />
          </div>
        )
      case 'blake2-param':
        return (
          <div className="lab-stage-view">
            <DataBlock label="parameter word" value={String(view.param)} tone="key" big />
            <MatrixGrid matrix={[view.hInit as string[]]} tone="internal" />
          </div>
        )
      case 'blake2-state': {
        const v = view.v as string[]
        const highlight: Array<[number, number]> = []
        if (v.length === 16) {
          highlight.push([0, 12], [0, 13], [0, 14])
          if (v[15]) highlight.push([0, 15])
        }
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={v.length === 16 ? [v.slice(0, 8), v.slice(8, 16)] : []} highlight={highlight} tone="internal" />
          </div>
        )
      }
      case 'blake2-rounds': {
        const rounds = Number(view.rounds)
        const sigma = view.sigma as number[][]
        const step = Boolean(view.is512) ? 12 : 10
        return (
          <div className="lab-stage-view">
            <div className="lab-strip" dir="ltr">
              {Array.from({ length: rounds }, (_, r) => (
                <span key={r} title={`round ${r}, sigma row ${r % step}`} className="lab-strip-dot" />
              ))}
            </div>
            <MatrixGrid matrix={sigma.map((row) => row.slice(0, 8))} tone="internal" />
          </div>
        )
      }
      case 'blake2-digest': {
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

function xorHex(a: string, b: string): string {
  return (BigInt(`0x${a}`) ^ BigInt(`0x${b}`)).toString(16).padStart(a.length, '0')
}
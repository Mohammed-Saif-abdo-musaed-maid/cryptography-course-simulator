import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hashPaddingInfo, strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'sha512'

interface Sha512RoundBound {
  t: number
  W: string
  K: string
  T1: string
  T2: string
  state: string[]
}

interface Sha512BlockBound {
  block_index: number
  block_hex: string
  rounds: Sha512RoundBound[]
  state_before: string[]
  state_after: string[]
}

const SAMPLES = [0, 20, 63]

export const sha512Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.sha512.name',
  educationalKey: 'simulation.sha512.educational',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const pad = hashPaddingInfo(bytes, 128, 16, false)
    const len = bytes.length
    const bits = len * 8

    const extra = ctx.result?.extra
    const boundDigest =
      typeof extra?.digest === 'string'
        ? extra.digest
        : typeof ctx.result?.result === 'string'
          ? ctx.result.result
          : ''
    const boundBlocks = Array.isArray(extra?.blocks)
      ? (extra.blocks as unknown as Sha512BlockBound[])
      : []
    const hInit = Array.isArray(extra?.h_init) ? (extra.h_init as unknown as string[]) : []
    const state = Array.isArray(extra?.state) ? (extra.state as unknown as string[]) : []
    const firstRounds = (boundBlocks[0]?.rounds as Sha512RoundBound[] | undefined) ?? []
    const hasResult = boundDigest.length > 0

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.sha512.input.title',
        descKey: 'simulation.sha512.input.desc',
        descArgs: { len, bits },
        phase: 'input',
        view: { kind: 'sha512-input', text: message, hex: bytesToHex(bytes), len, bits },
      },
      {
        id: `${id}-padding`,
        titleKey: 'simulation.sha512.padding.title',
        descKey: 'simulation.sha512.padding.desc',
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: 'transform',
        view: {
          kind: 'sha512-padding',
          blocksHex: pad.blocks.map(bytesToHex),
          blockCount: pad.blockCount,
          padBytes: pad.padBytes,
        },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.sha512.rounds.title',
        descKey: 'simulation.sha512.rounds.desc',
        descArgs: { rounds: 80 },
        phase: 'internal',
        view: { kind: 'sha512-rounds', rounds: firstRounds, samples: SAMPLES, hasResult },
      },
      {
        id: `${id}-state`,
        titleKey: 'simulation.sha512.state.title',
        descKey: 'simulation.sha512.state.desc',
        phase: 'internal',
        view: { kind: 'sha512-state', hInit, state, hasResult },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.sha512.digest.title',
        descKey: 'simulation.sha512.digest.desc',
        phase: 'output',
        view: { kind: 'sha512-digest', digest: boundDigest, hasResult },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'sha512-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
          </div>
        )
      case 'sha512-padding': {
        const blocksHex = view.blocksHex as string[]
        return (
          <div className="lab-stage-view">
            {blocksHex.map((block, i) => (
              <MatrixGrid key={i} matrix={blockWordRows(block)} tone="internal" />
            ))}
            <DataBlock label="blocks" value={String(view.blockCount)} tone="transform" />
            <DataBlock label="padding bytes" value={String(view.padBytes)} tone="key" />
          </div>
        )
      }
      case 'sha512-rounds': {
        const rounds = view.rounds as Sha512RoundBound[]
        const samples = (view.samples as number[]) ?? SAMPLES
        const hasResult = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            {hasResult ? (
              <>
                <div className="lab-strip" dir="ltr">
                  {rounds.map((r) => (
                    <span
                      key={r.t}
                      title={`t = ${r.t}`}
                      className={`lab-strip-dot${samples.includes(r.t) ? ' lab-strip-dot-active' : ''}`}
                    />
                  ))}
                </div>
                {rounds
                  .filter((r) => samples.includes(r.t))
                  .map((r) => (
                    <div className="lab-round-sample" key={r.t}>
                      <div className="lab-round-sample-head mono" dir="ltr">t = {r.t}</div>
                      <MatrixGrid matrix={[r.state]} />
                      <div className="lab-round-sample-meta mono" dir="ltr">
                        W={r.W} T1={r.T1} T2={r.T2}
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <div className="lab-strip" dir="ltr">
                {Array.from({ length: 80 }, (_, t) => <span key={t} title={`t = ${t}`} className="lab-strip-dot" />)}
              </div>
            )}
          </div>
        )
      }
      case 'sha512-state': {
        const hInit = (view.hInit as string[] | undefined) ?? []
        const state = (view.state as string[] | undefined) ?? []
        const hasResult = Boolean(view.hasResult)
        if (!hasResult || hInit.length !== 8 || state.length !== 8) return <div className="lab-stage-view" />
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={[hInit]} tone="input" />
            <FlowArrow />
            <MatrixGrid matrix={[state]} tone="transform" />
          </div>
        )
      }
      case 'sha512-digest': {
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

function blockWordRows(blockHex: string): string[][] {
  const words: string[] = []
  for (let i = 0; i < blockHex.length; i += 16) words.push(blockHex.slice(i, i + 16))
  const rows: string[][] = []
  for (let i = 0; i < words.length; i += 8) rows.push(words.slice(i, i + 8))
  return rows
}
import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hashPaddingInfo, sha256Detail, strToBytes } from '../simulationShared'
import type { RoundCapture } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'sha256'

export const sha256Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.sha256.name',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const detail = sha256Detail(bytes)
    const pad = hashPaddingInfo(bytes, 64, 8, false)
    const samples = [0, 20, 63]
    const len = bytes.length
    const bits = len * 8
    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.sha256.input.title',
        descKey: 'simulation.sha256.input.desc',
        descArgs: { len, bits },
        phase: 'input',
        view: { kind: 'sha256-input', text: message, hex: bytesToHex(bytes), len, bits },
      },
      {
        id: `${id}-padding`,
        titleKey: 'simulation.sha256.padding.title',
        descKey: 'simulation.sha256.padding.desc',
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: 'transform',
        view: {
          kind: 'sha256-padding',
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes,
        },
      },
      {
        id: `${id}-schedule`,
        titleKey: 'simulation.sha256.schedule.title',
        descKey: 'simulation.sha256.schedule.desc',
        descArgs: { words: detail.schedule.length },
        phase: 'internal',
        view: { kind: 'sha256-schedule', schedule: detail.schedule },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.sha256.rounds.title',
        descKey: 'simulation.sha256.rounds.desc',
        descArgs: { rounds: detail.rounds.length, sample: samples.length },
        phase: 'internal',
        view: { kind: 'sha256-rounds', rounds: detail.rounds, samples },
      },
      {
        id: `${id}-final`,
        titleKey: 'simulation.sha256.final.title',
        descKey: 'simulation.sha256.final.desc',
        phase: 'output',
        view: { kind: 'sha256-final', hInit: detail.hInit, hFinal: detail.hFinal, digest: detail.digest },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'sha256-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
          </div>
        )
      case 'sha256-padding': {
        const blocksHex = view.blocksHex as string[]
        const msgLen = Number(view.msgLen)
        return (
          <div className="lab-stage-view">
            <div className="lab-rows">
              {blocksHex.map((block, i) => (
                <CharRow key={i} label={`block ${i}`} cells={blockCells(block, msgLen)} size="sm" />
              ))}
            </div>
            <DataBlock label="blocks" value={String(view.blockCount)} tone="transform" />
            <DataBlock label="padding bytes" value={String(view.padBytes)} tone="key" />
          </div>
        )
      }
      case 'sha256-schedule': {
        const schedule = view.schedule as string[]
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={chunkWords(schedule, 8)} tone="internal" />
          </div>
        )
      }
      case 'sha256-rounds': {
        const rounds = view.rounds as RoundCapture[]
        const samples = (view.samples as number[]) ?? [0, 20, 63]
        return (
          <div className="lab-stage-view">
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
                  <div className="lab-round-sample-head mono" dir="ltr">
                    t = {r.t}
                  </div>
                  <MatrixGrid matrix={[r.state]} />
                  <div className="lab-round-sample-meta mono" dir="ltr">
                    T1={r.t1 ?? ''} T2={r.t2 ?? ''} W={r.w}
                  </div>
                </div>
              ))}
          </div>
        )
      }
      case 'sha256-final':
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={[view.hInit as string[]]} tone="input" />
            <FlowArrow />
            <MatrixGrid matrix={[view.hFinal as string[]]} tone="transform" />
            <FlowArrow />
            <DataBlock label="digest" value={String(view.digest)} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}

function chunkWords<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function blockCells(blockHex: string, msgLen: number): CharCell[] {
  const hex = blockHex.match(/.{2}/g) ?? []
  return hex.map((h, i) => ({
    ch: h,
    tone: i < msgLen ? ('internal' as const) : ('key' as const),
  }))
}
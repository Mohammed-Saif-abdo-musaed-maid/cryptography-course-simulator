import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hashPaddingInfo, sha1Detail, strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

const id = 'sha1'

const ROUND_STAGES: string[][] = [
  ['0-19', 'Ch(b,c,d) = (b AND c) OR (NOT b AND d)'],
  ['20-39', 'Parity: b XOR c XOR d'],
  ['40-59', 'Maj(b,c,d) = (b AND c) OR (b AND d) OR (c AND d)'],
  ['60-79', 'Parity: b XOR c XOR d'],
]

export const sha1Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.sha1.name',
  educationalKey: 'simulation.sha1.educational',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const detail = sha1Detail(bytes)
    const pad = hashPaddingInfo(bytes, 64, 8, false)
    const len = bytes.length
    const bits = len * 8
    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.sha1.input.title',
        descKey: 'simulation.sha1.input.desc',
        descArgs: { len, bits },
        phase: 'input',
        view: { kind: 'sha1-input', text: message, hex: bytesToHex(bytes), len, bits },
      },
      {
        id: `${id}-padding`,
        titleKey: 'simulation.sha1.padding.title',
        descKey: 'simulation.sha1.padding.desc',
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: 'transform',
        view: {
          kind: 'sha1-padding',
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes,
        },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.sha1.rounds.title',
        descKey: 'simulation.sha1.rounds.desc',
        descArgs: { rounds: 80 },
        phase: 'internal',
        view: { kind: 'sha1-rounds', stages: ROUND_STAGES },
      },
      {
        id: `${id}-state`,
        titleKey: 'simulation.sha1.state.title',
        descKey: 'simulation.sha1.state.desc',
        phase: 'internal',
        view: { kind: 'sha1-state', hInit: detail.hInit, hFinal: detail.hFinal },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.sha1.digest.title',
        descKey: 'simulation.sha1.digest.desc',
        phase: 'output',
        view: { kind: 'sha1-digest', digest: detail.digest },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'sha1-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
          </div>
        )
      case 'sha1-padding': {
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
      case 'sha1-rounds': {
        const stages = view.stages as string[][]
        return (
          <div className="lab-stage-view">
            <div className="lab-strip" dir="ltr">
              {Array.from({ length: 80 }, (_, t) => <span key={t} title={`t = ${t}`} className="lab-strip-dot" />)}
            </div>
            <MatrixGrid matrix={stages} tone="internal" />
          </div>
        )
      }
      case 'sha1-state':
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={[view.hInit as string[]]} tone="input" />
            <FlowArrow />
            <MatrixGrid matrix={[view.hFinal as string[]]} tone="transform" />
          </div>
        )
      case 'sha1-digest':
        return (
          <div className="lab-stage-view">
            <DataBlock label="digest" value={String(view.digest)} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}

function blockCells(blockHex: string, msgLen: number): CharCell[] {
  const hex = blockHex.match(/.{2}/g) ?? []
  return hex.map((h, i) => ({
    ch: h,
    tone: i < msgLen ? ('internal' as const) : ('key' as const),
  }))
}
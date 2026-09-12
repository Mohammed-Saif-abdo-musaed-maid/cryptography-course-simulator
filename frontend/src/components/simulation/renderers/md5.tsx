import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hashPaddingInfo, md5Detail, strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'md5'

const ROUND_LABELS = ['F', 'G', 'H', 'I']

export const md5Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.md5.name',
  educationalKey: 'simulation.md5.educational',
  demoInputs: { message: 'Hello, cryptography!' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const bytes = strToBytes(message)
    const detail = md5Detail(bytes)
    const pad = hashPaddingInfo(bytes, 64, 8, true)
    const len = bytes.length
    const bits = len * 8
    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.md5.input.title',
        descKey: 'simulation.md5.input.desc',
        descArgs: { len, bits },
        phase: 'input',
        view: { kind: 'md5-input', text: message, hex: bytesToHex(bytes), len, bits },
      },
      {
        id: `${id}-padding`,
        titleKey: 'simulation.md5.padding.title',
        descKey: 'simulation.md5.padding.desc',
        descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
        phase: 'transform',
        view: {
          kind: 'md5-padding',
          blocksHex: detail.blocksHex,
          msgLen: len,
          blockCount: pad.blockCount,
          padBytes: pad.padBytes,
        },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.md5.rounds.title',
        descKey: 'simulation.md5.rounds.desc',
        descArgs: { rounds: 4 },
        phase: 'internal',
        view: { kind: 'md5-rounds' },
      },
      {
        id: `${id}-state`,
        titleKey: 'simulation.md5.state.title',
        descKey: 'simulation.md5.state.desc',
        phase: 'internal',
        view: { kind: 'md5-state', hInit: detail.hInit },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.md5.digest.title',
        descKey: 'simulation.md5.digest.desc',
        phase: 'output',
        view: { kind: 'md5-digest', digest: detail.digest },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'md5-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
          </div>
        )
      case 'md5-padding': {
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
      case 'md5-rounds': {
        return (
          <div className="lab-stage-view">
            {ROUND_LABELS.map((fn, ri) => (
              <div className="lab-round-group" key={fn}>
                <span className="lab-round-sample-head mono" dir="ltr">
                  R{ri + 1} ({fn})
                </span>
                <div className="lab-strip" dir="ltr">
                  {Array.from({ length: 16 }, (_, s) => <span key={s} title={`step ${ri * 16 + s + 1}`} className="lab-strip-dot" />)}
                </div>
              </div>
            ))}
          </div>
        )
      }
      case 'md5-state':
        return (
          <div className="lab-stage-view">
            <MatrixGrid matrix={[view.hInit as string[]]} tone="input" />
          </div>
        )
      case 'md5-digest':
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
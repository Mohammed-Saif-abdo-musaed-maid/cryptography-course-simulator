import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'blake3'

interface Blake3ChunkBound {
  chunk_index: number
  bytes: number
  cv: string[]
}

export const blake3Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.blake3.name',
  educationalKey: 'simulation.blake3.educational',
  demoInputs: { message: 'Hello, cryptography!', length: 32 },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const length = Math.max(1, Math.min(64, Number(ctx.inputs.length ?? 32)))
    const bytes = strToBytes(message)
    const len = bytes.length
    const bits = length * 8
    const chunkCount = Math.max(1, Math.ceil(len / 1024))
    const ranges = chunkRanges(len, chunkCount)

    const extra = ctx.result?.extra
    const boundDigest =
      typeof extra?.digest === 'string'
        ? extra.digest
        : typeof ctx.result?.result === 'string'
          ? ctx.result.result
          : ''
    const hasResult = boundDigest.length > 0
    const rootCv = Array.isArray(extra?.root_cv) ? (extra.root_cv as unknown as string[]) : []
    const boundChunks = Array.isArray(extra?.chunks)
      ? (extra.chunks as unknown as Blake3ChunkBound[])
      : []

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.blake3.input.title',
        descKey: 'simulation.blake3.input.desc',
        descArgs: { len, length, bits },
        phase: 'input',
        view: {
          kind: 'blake3-input',
          text: message,
          hex: bytesToHex(bytes),
          len,
          length,
          bits,
        },
      },
      {
        id: `${id}-chunks`,
        titleKey: 'simulation.blake3.chunks.title',
        descKey: 'simulation.blake3.chunks.desc',
        descArgs: { chunkCount },
        phase: 'transform',
        view: { kind: 'blake3-chunks', ranges, chunkCount, boundChunks, len, hasResult },
      },
      {
        id: `${id}-tree`,
        titleKey: 'simulation.blake3.tree.title',
        descKey: 'simulation.blake3.tree.desc',
        phase: 'internal',
        view: { kind: 'blake3-tree', levels: levelCounts(chunkCount), rootCv, treeSize: chunkCount },
      },
      {
        id: `${id}-xof`,
        titleKey: 'simulation.blake3.xof.title',
        descKey: 'simulation.blake3.xof.desc',
        descArgs: { length },
        phase: 'internal',
        view: { kind: 'blake3-xof', length },
      },
      {
        id: `${id}-digest`,
        titleKey: 'simulation.blake3.digest.title',
        descKey: 'simulation.blake3.digest.desc',
        descArgs: { length },
        phase: 'output',
        view: { kind: 'blake3-digest', digest: boundDigest, hasResult },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'blake3-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={String(view.text)} tone="input" big />
            <DataBlock label="bytes" value={String(view.hex)} tone="input" />
            <DataBlock label="output length (bytes)" value={String(view.length)} tone="key" />
          </div>
        )
      case 'blake3-chunks': {
        const ranges = view.ranges as string[]
        const boundChunks = (view.boundChunks as Blake3ChunkBound[] | undefined) ?? []
        const len = Number(view.len)
        const hasResult = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <div className="lab-tree" dir="ltr">
              {ranges.map((range, i) => (
                <div className="lab-tree-node" key={i}>
                  <div className="lab-tree-node-title mono" dir="ltr">
                    chunk {i} [{range}]
                  </div>
                  {hasResult && boundChunks.length > 0 && (
                    <div className="lab-tree-node-sub mono" dir="ltr">
                      counter {i} - {boundChunks[i]?.bytes ?? len} bytes
                    </div>
                  )}
                </div>
              ))}
            </div>
            <DataBlock label="chunks" value={String(view.chunkCount)} tone="transform" />
          </div>
        )
      }
      case 'blake3-tree': {
        const levels = view.levels as number[]
        const rootCv = (view.rootCv as string[] | undefined) ?? []
        return (
          <div className="lab-stage-view">
            <div className="lab-tree" dir="ltr">
              {levels.map((count, li) => (
                <div className="lab-tree-row" key={li}>
                  {Array.from({ length: count }, (_, ni) => (
                    <span key={ni} className="lab-tree-pill mono" dir="ltr">
                      {li === 0 ? `C${ni}` : 'P'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {rootCv.length > 0 && <DataBlock label="root chaining value" value={rootCv.join(' ')} tone="internal" />}
          </div>
        )
      }
      case 'blake3-xof': {
        const length = Number(view.length)
        return (
          <div className="lab-stage-view">
            <div className="lab-strip" dir="ltr">
              {Array.from({ length: 64 }, (_, i) => (
                <span
                  key={i}
                  title={`byte ${i}`}
                  className={`lab-strip-dot${i < length ? ' lab-strip-dot-active' : ''}`}
                />
              ))}
            </div>
            <FlowArrow op={`first ${length} bytes`} />
            <DataBlock label="XOF output length" value={String(length)} tone="output" />
          </div>
        )
      }
      case 'blake3-digest': {
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

function chunkRanges(len: number, count: number): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const lo = i * 1024
    const hi = Math.min(len, lo + 1024)
    out.push(`${lo}-${hi}`)
  }
  return out
}

function levelCounts(count: number): number[] {
  const out: number[] = []
  let n = count
  while (true) {
    out.push(n)
    if (n === 1) break
    n = Math.ceil(n / 2)
  }
  return out
}
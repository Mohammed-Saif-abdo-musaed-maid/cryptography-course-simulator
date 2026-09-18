import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hashPaddingInfo, strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow, MatrixGrid } from '../common/FlowArrow'

interface HashEngineCfg {
  id: string
  blockSize: number
  lengthWordBytes: number
  lengthLE: boolean
  rounds: number
  lines: number
  digestBits: number
  words: number
  outputWords: number
  iv: string[]
  deco: string
}

function boundDigest(ctx: SimulationContext): string {
  const extra = ctx.result?.extra
  return typeof extra?.digest === 'string'
    ? extra.digest
    : typeof ctx.result?.result === 'string'
      ? ctx.result.result
      : ''
}

function boundIv(ctx: SimulationContext, fallback: string[]): string[] {
  const extra = ctx.result?.extra
  return Array.isArray(extra?.initial_value) ? (extra.initial_value as string[]) : fallback
}

function blockCellRows(blocksHex: string[], msgLen: number, msgBytesPerBlock: number): Array<{ label: string; cells: Array<{ ch: string; tone: 'internal' | 'key' }> }> {
  return blocksHex.map((block, bi) => {
    const words: string[] = []
    for (let i = 0; i < block.length; i += 16) words.push(block.slice(i, i + 16))
    return {
      label: `block ${bi}`,
      cells: words.flatMap((w) =>
        (w.match(/.{2}/g) ?? []).map((h, i): { ch: string; tone: 'internal' | 'key' } => ({
          ch: h,
          tone: bi * msgBytesPerBlock + i < msgLen ? 'internal' : 'key',
        })),
      ),
    }
  })
}

function makeHashEngine(cfg: HashEngineCfg): SimulationEngine {
  const { id } = cfg
  const ns = id
  return {
    id,
    nameKey: `simulation.${ns}.name`,
    educationalKey: `simulation.${ns}.educational`,
    demoInputs: { message: 'Hello, cryptography!' },
    build(ctx): SimStage[] {
      const message = String(ctx.inputs.message ?? '')
      const bytes = strToBytes(message)
      const pad = hashPaddingInfo(bytes, cfg.blockSize, cfg.lengthWordBytes, cfg.lengthLE)
      const len = bytes.length
      const bits = len * 8
      const digest = boundDigest(ctx)
      const hasResult = digest.length > 0
      const iv = boundIv(ctx, cfg.iv)
      const extra = ctx.result?.extra as Record<string, unknown> | undefined
      const paddedBlocks =
        Array.isArray(extra?.padded_message_blocks) && (extra.padded_message_blocks as string[]).length > 0
          ? (extra.padded_message_blocks as string[]).map((b: string) => b.toLowerCase())
          : pad.blocks.map(bytesToHex)

      return [
        {
          id: `${id}-input`,
          titleKey: `simulation.${ns}.input.title`,
          descKey: `simulation.${ns}.input.desc`,
          descArgs: { len, bits },
          phase: 'input',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-input`, text: message, hex: bytesToHex(bytes), len, bits },
        },
        {
          id: `${id}-padding`,
          titleKey: `simulation.${ns}.padding.title`,
          descKey: `simulation.${ns}.padding.desc`,
          descArgs: { blocks: pad.blockCount, padBytes: pad.padBytes },
          phase: 'transform',
          traceIndex: hasResult ? 2 : undefined,
          view: {
            kind: `${id}-padding`,
            blocksHex: paddedBlocks,
            blockCount: pad.blockCount,
            padBytes: pad.padBytes,
            msgLen: len,
          },
        },
        {
          id: `${id}-rounds`,
          titleKey: `simulation.${ns}.rounds.title`,
          descKey: `simulation.${ns}.rounds.desc`,
          descArgs: { rounds: cfg.rounds, lines: cfg.lines },
          phase: 'internal',
          traceIndex: hasResult ? 4 : undefined,
          view: { kind: `${id}-rounds`, rounds: cfg.rounds, lines: cfg.lines, hasResult },
        },
        {
          id: `${id}-digest`,
          titleKey: `simulation.${ns}.digest.title`,
          descKey: `simulation.${ns}.digest.desc`,
          descArgs: { digestBits: cfg.digestBits },
          phase: 'output',
          traceIndex: hasResult ? 5 : undefined,
          view: { kind: `${id}-digest`, iv, digest, hasResult, words: cfg.words, deco: cfg.deco },
        },
      ]
    },
    View({ view }: { view: SimView; ctx: SimulationContext }) {
      switch (view.kind) {
        case `${id}-input`:
          return (
            <div className="lab-stage-view">
              <DataBlock label="message" value={String(view.text)} tone="input" big />
              <DataBlock label="bytes" value={String(view.hex)} tone="input" />
            </div>
          )
        case `${id}-padding`: {
          const blocksHex = (view.blocksHex as string[]) ?? []
          return (
            <div className="lab-stage-view">
              <div className="lab-rows">
                {blockCellRows(blocksHex, Number(view.msgLen), cfg.blockSize).map((row, i) => (
                  <CharRow key={i} label={row.label} cells={row.cells} size="sm" />
                ))}
              </div>
              <DataBlock label="blocks" value={String(view.blockCount)} tone="transform" />
              <DataBlock label="padding bytes" value={String(view.padBytes)} tone="key" />
            </div>
          )
        }
        case `${id}-rounds`: {
          const rounds = Number(view.rounds)
          const lines = Number(view.lines)
          const hasResult = Boolean(view.hasResult)
          const dots = (extraCls = '') => (
            <div className="lab-strip" dir="ltr">
              {Array.from({ length: rounds }, (_, t) => (
                <span
                  key={t}
                  title={`t = ${t}`}
                  className={`lab-strip-dot${hasResult && t === rounds - 1 ? ' lab-strip-dot-active' : ''}${extraCls}`}
                />
              ))}
            </div>
          )
          return (
            <div className="lab-stage-view">
              {lines === 2 ? (
                <>
                  <div className="lab-round-sample-head mono">left line · 40 rounds</div>
                  {dots()}
                  <div className="lab-round-sample-head mono">right line · 40 rounds</div>
                  {dots('')}
                </>
              ) : (
                dots()
              )}
            </div>
          )
        }
        case `${id}-digest`: {
          const ivWords = (view.iv as string[] | undefined) ?? []
          const digest = String(view.digest)
          const hasResult = Boolean(view.hasResult)
          return (
            <div className="lab-stage-view">
              {ivWords.length > 0 && (
                <>
                  <MatrixGrid matrix={[ivWords.slice(0, Number(view.words))]} tone="input" />
                  <FlowArrow />
                </>
              )}
              <DataBlock
                label={`${String(view.deco)} digest`}
                value={hasResult ? digest : '—'}
                tone={hasResult ? 'output' : 'muted'}
                big
              />
              <DataBlock
                label="truncation"
                value={`first ${cfg.outputWords} of ${cfg.words} words → ${String(view.digestBits)} bits`}
                tone="muted"
              />
            </div>
          )
        }
        default:
          return null
      }
    },
  }
}

const SHA224_IV = [
  'c1059ed8', '367cd507', '3070dd17', 'f70e5939',
  'ffc00b31', '68581511', '64f98fa7', 'befa4fa4',
]

const SHA384_IV = [
  'cbbb9d5dc1059ed8', '629a292a367cd507', '9159015a3070dd17', '152fecd8f70e5939',
  '67332667ffc00b31', '8eb44a8768581511', 'db0c2e0d64f98fa7', '47b5481dbefa4fa4',
]

const RIPEMD160_IV = ['67452301', 'efcdab89', '98badcfe', '10325476', 'c3d2e1f0']

export const sha224Engine = makeHashEngine({
  id: 'sha224',
  blockSize: 64,
  lengthWordBytes: 8,
  lengthLE: false,
  rounds: 64,
  lines: 1,
  digestBits: 224,
  words: 8,
  outputWords: 7,
  iv: SHA224_IV,
  deco: 'SHA-224',
})

export const sha384Engine = makeHashEngine({
  id: 'sha384',
  blockSize: 128,
  lengthWordBytes: 16,
  lengthLE: false,
  rounds: 80,
  lines: 1,
  digestBits: 384,
  words: 8,
  outputWords: 6,
  iv: SHA384_IV,
  deco: 'SHA-384',
})

export const ripemd160Engine = makeHashEngine({
  id: 'ripemd160',
  blockSize: 64,
  lengthWordBytes: 8,
  lengthLE: true,
  rounds: 40,
  lines: 2,
  digestBits: 160,
  words: 5,
  outputWords: 5,
  iv: RIPEMD160_IV,
  deco: 'RIPEMD-160',
})
import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { strToBytes, bytesToHex } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'scrypt'

const clampInt = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo))

function backendString(ctx: SimulationContext, field: string): string {
  const extra = ctx.result?.extra
  const v = extra && typeof extra[field] === 'string' ? extra[field] : ctx.result?.result
  return typeof v === 'string' ? v : ''
}

function sampledGrid(cols: number, rows: number, active: [number, number]): (string | number)[][] {
  const highlight: (string | number)[][] = []
  for (let r = 0; r < rows; r++) {
    const row: (string | number)[] = []
    for (let c = 0; c < cols; c++) row.push(r === active[0] && c === active[1] ? 'X' : '·')
    highlight.push(row)
  }
  return highlight
}

export const scryptEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.scrypt.name',
  demoInputs: { password: 'correct horse battery staple', salt: 'salty', n: 16384, r: 8, p: 1, key_length: 32 },
  educationalKey: 'simulation.scrypt.educational',
  build(ctx) {
    const password = String(ctx.inputs.password ?? '')
    const salt = String(ctx.inputs.salt ?? '')
    const n = clampInt(Number(ctx.inputs.n ?? 16384), 2, 1048576)
    const r = clampInt(Number(ctx.inputs.r ?? 8), 1, 64)
    const p = clampInt(Number(ctx.inputs.p ?? 1), 1, 16)
    const keyLength = clampInt(Number(ctx.inputs.key_length ?? 32), 1, 128)
    const boundKey = backendString(ctx, 'key_hex')

    const log2N = Math.log2(n)
    const blockSize = 128 * r
    const memoryBytes = n * r * 128
    const memoryKiB = memoryBytes / 1024
    const memoryMiB = memoryBytes / (1024 * 1024)
    const pwBytes = strToBytes(password).length
    const saltHex = bytesToHex(strToBytes(salt))
    const saltLen = saltHex.length / 2

    const stages: SimStage[] = [
      {
        id: `${id}-input`,
        titleKey: 'simulation.scrypt.input.title',
        descKey: 'simulation.scrypt.input.desc',
        descArgs: { pwBytes, saltLen },
        phase: 'input',
        view: { kind: 'scrypt-input', pwBytes, saltHex, saltLen },
      },
      {
        id: `${id}-params`,
        titleKey: 'simulation.scrypt.params.title',
        descKey: 'simulation.scrypt.params.desc',
        descArgs: { n, log2N, r, p, blockSize, memory: memoryKiB, memoryMiB },
        phase: 'key',
        view: {
          kind: 'scrypt-params',
          n,
          log2N,
          r,
          p,
          blockSize,
          memoryKiB,
          memoryMiB,
          grid: sampledGrid(24, 8, [4, 6]),
        },
      },
      {
        id: `${id}-pre`,
        titleKey: 'simulation.scrypt.pre.title',
        descKey: 'simulation.scrypt.pre.desc',
        descArgs: { p, blockSize },
        phase: 'transform',
        view: { kind: 'scrypt-pre', p, blockSize },
      },
      {
        id: `${id}-romix`,
        titleKey: 'simulation.scrypt.romix.title',
        descKey: 'simulation.scrypt.romix.desc',
        descArgs: { n, memory: memoryKiB, memoryMiB },
        phase: 'internal',
        view: {
          kind: 'scrypt-romix',
          n,
          memoryKiB,
          memoryMiB,
          grid: sampledGrid(24, 8, [2, 3]),
        },
      },
      {
        id: `${id}-post`,
        titleKey: 'simulation.scrypt.post.title',
        descKey: 'simulation.scrypt.post.desc',
        descArgs: { keyLength, p },
        phase: 'transform',
        view: { kind: 'scrypt-post', keyLength, p },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.scrypt.result.title',
        descKey: 'simulation.scrypt.result.desc',
        descArgs: { keyLength },
        phase: 'output',
        view: { kind: 'scrypt-result', keyHex: boundKey },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'scrypt-input': {
        const pwBytes = Number(view.pwBytes)
        const saltHex = String(view.saltHex)
        const saltLen = Number(view.saltLen)
        return (
          <div className="lab-stage-view">
            <DataBlock label="password (bytes)" value={String(pwBytes)} tone="input" />
            <DataBlock label="salt (bytes)" value={String(saltLen)} tone="input" />
            <DataBlock label="salt (hex)" value={saltHex} tone="muted" />
          </div>
        )
      }
      case 'scrypt-params': {
        const n = Number(view.n)
        const log2N = Number(view.log2N)
        const r = Number(view.r)
        const p = Number(view.p)
        const blockSize = Number(view.blockSize)
        const memoryKiB = Number(view.memoryKiB)
        const memoryMiB = Number(view.memoryMiB)
        return (
          <div className="lab-stage-view">
            <DataBlock label="N" value={String(n)} tone="key" big />
            <DataBlock label="N = 2^log2" value={`2^${log2N}`} tone="key" />
            <DataBlock label="r · p" value={`${r} · ${p}`} tone="key" />
            <DataBlock label="block size" value={`${blockSize} bytes (128·r)`} tone="transform" />
            <DataBlock label="memory" value={`${memoryKiB} KiB ≈ ${memoryMiB} MiB`} tone="transform" big />
            <DataBlock label="memory map (sampled)" value={`${n} blocks`} tone="internal" />
            <MatrixGrid matrix={view.grid as (string | number)[][]} highlight={[[4, 6]]} tone="internal" />
          </div>
        )
      }
      case 'scrypt-pre': {
        const p = Number(view.p)
        const blockSize = Number(view.blockSize)
        return (
          <div className="lab-stage-view">
            <DataBlock label="PBKDF2-HMAC-SHA-256" value="1 iteration" tone="transform" />
            <FlowArrow />
            <DataBlock label="initial blocks" value={`${p} lane(s) × ${blockSize} bytes`} tone="internal" />
          </div>
        )
      }
      case 'scrypt-romix': {
        const n = Number(view.n)
        const memoryKiB = Number(view.memoryKiB)
        const memoryMiB = Number(view.memoryMiB)
        return (
          <div className="lab-stage-view">
            <DataBlock label="ROMix (memory-hard)" value={`${n} blocks · Salsa20/8`} tone="internal" big />
            <DataBlock label="memory working set" value={`${memoryKiB} KiB ≈ ${memoryMiB} MiB`} tone="transform" />
            <MatrixGrid matrix={view.grid as (string | number)[][]} highlight={[[2, 3]]} tone="internal" />
            <p className="lab-note">grid is a sparse sample; the real map has {n} blocks</p>
          </div>
        )
      }
      case 'scrypt-post': {
        const keyLength = Number(view.keyLength)
        const p = Number(view.p)
        return (
          <div className="lab-stage-view">
            <DataBlock label="PBKDF2-HMAC-SHA-256" value="final pass" tone="transform" />
            <FlowArrow />
            <DataBlock label="mix lanes" value={`${p} lane(s)`} tone="internal" />
            <FlowArrow />
            <DataBlock label="truncate" value={`first ${keyLength} bytes`} tone="transform" />
          </div>
        )
      }
      case 'scrypt-result': {
        const keyHex = String(view.keyHex)
        return (
          <div className="lab-stage-view">
            {keyHex ? (
              <DataBlock label="derived key" value={keyHex} tone="output" big />
            ) : (
              <DataBlock label="derived key" value="run the operation to bind the real key" tone="output" big />
            )}
          </div>
        )
      }
      default:
        return null
    }
  },
}
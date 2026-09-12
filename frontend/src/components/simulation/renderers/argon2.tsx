import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'argon2'

const clampInt = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo))

function backendString(ctx: SimulationContext, field: string): string {
  const extra = ctx.result?.extra
  const v = extra && typeof extra[field] === 'string' ? extra[field] : ctx.result?.result
  return typeof v === 'string' ? v : ''
}

function laneGrid(passes: number, lanes: number): (string | number)[][] {
  const grid: (string | number)[][] = []
  for (let r = 0; r < passes; r++) {
    const row: (string | number)[] = []
    for (let c = 0; c < lanes; c++) row.push('G')
    grid.push(row)
  }
  return grid
}

export const argon2Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.argon2.name',
  demoInputs: {
    password: 'correct horse battery staple',
    time_cost: 3,
    memory_cost: 65536,
    parallelism: 2,
    hash_length: 32,
    variant: 'argon2id',
  },
  educationalKey: 'simulation.argon2.educational',
  build(ctx) {
    const password = String(ctx.inputs.password ?? '')
    const variant = String(ctx.inputs.variant ?? 'argon2id')
    const t = clampInt(Number(ctx.inputs.time_cost ?? 3), 1, 10)
    const m = clampInt(Number(ctx.inputs.memory_cost ?? 65536), 8, 1048576)
    const p = clampInt(Number(ctx.inputs.parallelism ?? 2), 1, 16)
    const hashLength = clampInt(Number(ctx.inputs.hash_length ?? 32), 1, 64)
    const boundTag = backendString(ctx, 'hash')

    const memoryMiB = m / 1024
    const blocks = m
    const cells = Math.floor(m / 4)
    const perLaneBlocks = Math.floor(m / (4 * p)) * 4

    const stages: SimStage[] = [
      {
        id: `${id}-input`,
        titleKey: 'simulation.argon2.input.title',
        descKey: 'simulation.argon2.input.desc',
        descArgs: { variant, t, m, p },
        phase: 'input',
        view: { kind: 'argon2-input', passwordBytes: password.length, variant, t, m, p },
      },
      {
        id: `${id}-params`,
        titleKey: 'simulation.argon2.params.title',
        descKey: 'simulation.argon2.params.desc',
        descArgs: { m, memoryMiB, blocks, cells },
        phase: 'key',
        view: { kind: 'argon2-params', m, memoryMiB, blocks, cells, variant },
      },
      {
        id: `${id}-core`,
        titleKey: 'simulation.argon2.core.title',
        descKey: 'simulation.argon2.core.desc',
        descArgs: { p, t, m, perLaneBlocks },
        phase: 'internal',
        view: { kind: 'argon2-core', p, t, m, perLaneBlocks, grid: laneGrid(t, p) },
      },
      {
        id: `${id}-tag`,
        titleKey: 'simulation.argon2.tag.title',
        descKey: 'simulation.argon2.tag.desc',
        descArgs: { hashLength },
        phase: 'transform',
        view: { kind: 'argon2-tag', hashLength, variant },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.argon2.result.title',
        descKey: 'simulation.argon2.result.desc',
        descArgs: { variant },
        phase: 'output',
        view: { kind: 'argon2-result', variant, m, t, p, tag: boundTag },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'argon2-input': {
        const passwordBytes = Number(view.passwordBytes)
        const variant = String(view.variant)
        const t = Number(view.t)
        const m = Number(view.m)
        const p = Number(view.p)
        return (
          <div className="lab-stage-view">
            <DataBlock label="password (bytes)" value={String(passwordBytes)} tone="input" />
            <DataBlock label="variant" value={variant} tone="key" />
            <DataBlock label="t · m · p" value={`${t} · ${m} KiB · ${p}`} tone="key" />
          </div>
        )
      }
      case 'argon2-params': {
        const m = Number(view.m)
        const memoryMiB = Number(view.memoryMiB)
        const blocks = Number(view.blocks)
        const cells = Number(view.cells)
        const variant = String(view.variant)
        return (
          <div className="lab-stage-view">
            <DataBlock label="variant" value={variant} tone="key" />
            <DataBlock label="memory" value={`${m} KiB ≈ ${memoryMiB} MiB`} tone="key" big />
            <DataBlock label="blocks (1 KiB each)" value={String(blocks)} tone="internal" />
            <DataBlock label="grid cells (≈ 4 KiB each)" value={String(cells)} tone="internal" />
          </div>
        )
      }
      case 'argon2-core': {
        const p = Number(view.p)
        const t = Number(view.t)
        const m = Number(view.m)
        const perLaneBlocks = Number(view.perLaneBlocks)
        return (
          <div className="lab-stage-view">
            <DataBlock label="matrix" value={`${p} lanes × ${t} passes`} tone="transform" big />
            <DataBlock label="per lane per pass" value={`${perLaneBlocks} blocks`} tone="internal" />
            <DataBlock label="per pass total" value={`${m} blocks`} tone="internal" />
            <MatrixGrid matrix={view.grid as (string | number)[][]} tone="transform" />
            <p className="lab-note">each cell: G — BLAKE2b compression (password, salt, lane, pass, index)</p>
          </div>
        )
      }
      case 'argon2-tag': {
        const hashLength = Number(view.hashLength)
        const variant = String(view.variant)
        return (
          <div className="lab-stage-view">
            <DataBlock label="final column" value="XOR of last blocks per lane" tone="internal" />
            <FlowArrow op="H" />
            <DataBlock label={`tag (${hashLength} bytes)`} value={`${variant} · BLAKE2b`} tone="transform" big />
          </div>
        )
      }
      case 'argon2-result': {
        const variant = String(view.variant)
        const m = Number(view.m)
        const t = Number(view.t)
        const p = Number(view.p)
        const tag = String(view.tag)
        return (
          <div className="lab-stage-view">
            {tag ? (
              <DataBlock label="PHC hash" value={tag} tone="output" big />
            ) : (
              <DataBlock label="PHC hash" value={`$${variant}$v=19$m=${m},t=${t},p=${p}$<salt>$<tag>`} tone="output" big />
            )}
            <DataBlock label="structure" value={`$${variant}$v=19$m=${m},t=${t},p=${p}$`} tone="muted" />
          </div>
        )
      }
      default:
        return null
    }
  },
}
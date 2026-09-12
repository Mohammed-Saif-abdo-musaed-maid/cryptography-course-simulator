import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { strToBytes } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { MatrixGrid } from '../common/FlowArrow'

const id = 'bcrypt'

const clampInt = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? Math.round(v) : lo))

function backendString(ctx: SimulationContext, field: string): string {
  const extra = ctx.result?.extra
  const v = extra && typeof extra[field] === 'string' ? extra[field] : ctx.result?.result
  return typeof v === 'string' ? v : ''
}

export const bcryptEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.bcrypt.name',
  demoInputs: { password: 'hunter2', rounds: 12 },
  educationalKey: 'simulation.bcrypt.educational',
  build(ctx) {
    const password = String(ctx.inputs.password ?? '')
    const rounds = clampInt(Number(ctx.inputs.rounds ?? 12), 4, 31)
    const iterations = Math.pow(2, rounds)
    const boundHash = backendString(ctx, 'hash')
    const pwBytes = strToBytes(password).length

    const stages: SimStage[] = [
      {
        id: `${id}-input`,
        titleKey: 'simulation.bcrypt.input.title',
        descKey: 'simulation.bcrypt.input.desc',
        descArgs: { pwBytes },
        phase: 'input',
        view: { kind: 'bcrypt-input', pwBytes, tooLong: pwBytes > 72 },
      },
      {
        id: `${id}-salt`,
        titleKey: 'simulation.bcrypt.salt.title',
        descKey: 'simulation.bcrypt.salt.desc',
        phase: 'key',
        view: { kind: 'bcrypt-salt', rounds },
      },
      {
        id: `${id}-cost`,
        titleKey: 'simulation.bcrypt.cost.title',
        descKey: 'simulation.bcrypt.cost.desc',
        descArgs: { rounds, iterations },
        phase: 'key',
        view: { kind: 'bcrypt-cost', rounds, iterations },
      },
      {
        id: `${id}-schedule`,
        titleKey: 'simulation.bcrypt.schedule.title',
        descKey: 'simulation.bcrypt.schedule.desc',
        descArgs: { iterations },
        phase: 'internal',
        view: { kind: 'bcrypt-schedule', iterations },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.bcrypt.result.title',
        descKey: 'simulation.bcrypt.result.desc',
        descArgs: { rounds },
        phase: 'output',
        view: { kind: 'bcrypt-result', rounds, hash: boundHash },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'bcrypt-input': {
        const pwBytes = Number(view.pwBytes)
        const tooLong = Boolean(view.tooLong)
        return (
          <div className="lab-stage-view">
            <DataBlock label="password (bytes)" value={String(pwBytes)} tone="input" big />
            {tooLong && <p className="lab-note">bcrypt supports at most 72 bytes; longer passwords are rejected</p>}
          </div>
        )
      }
      case 'bcrypt-salt': {
        const rounds = Number(view.rounds)
        return (
          <div className="lab-stage-view">
            <DataBlock label="salt" value="16 bytes · 128-bit (CSPRNG)" tone="key" big />
            <FlowArrow />
            <DataBlock label="embedded in" value={`$2b$${rounds}$`} tone="muted" />
          </div>
        )
      }
      case 'bcrypt-cost': {
        const rounds = Number(view.rounds)
        const iterations = Number(view.iterations)
        return (
          <div className="lab-stage-view">
            <DataBlock label="cost" value={String(rounds)} tone="key" />
            <FlowArrow op="2^" />
            <DataBlock label="iterations" value={String(iterations)} tone="transform" big />
            <FlowArrow />
            <DataBlock label="work factor" value={`2^${rounds} = ${iterations} EksBlowfish rounds`} tone="internal" />
          </div>
        )
      }
      case 'bcrypt-schedule': {
        const iterations = Number(view.iterations)
        return (
          <div className="lab-stage-view">
            <DataBlock label="EksBlowfish" value={`${iterations} key-schedule passes`} tone="transform" big />
            <FlowArrow />
            <MatrixGrid
              matrix={[
                ['P[0..17]', 'S0[0..255]', 'S1[0..255]', 'S2[0..255]', 'S3[0..255]'],
              ]}
              tone="internal"
            />
            <FlowArrow />
            <DataBlock label="derive" value="encrypt 'OrpheanBeholderScryDoubt' → 184-bit hash" tone="output" />
          </div>
        )
      }
      case 'bcrypt-result': {
        const rounds = Number(view.rounds)
        const hash = String(view.hash)
        return (
          <div className="lab-stage-view">
            {hash ? (
              <DataBlock label="$2b$ hash" value={hash} tone="output" big />
            ) : (
              <DataBlock label="$2b$ hash" value={`$2b$${rounds}$<22-char salt><31-char hash>`} tone="output" big />
            )}
            <DataBlock label="signature" value={`$2b$${rounds}$`} tone="key" />
            <DataBlock label="hash bits" value="184 bits · 24 bytes" tone="muted" />
          </div>
        )
      }
      default:
        return null
    }
  },
}
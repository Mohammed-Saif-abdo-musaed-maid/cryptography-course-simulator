import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { modPowBig, isPrime } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'diffie_hellman'

export const diffieHellmanEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.diffie_hellman.name',
  educationalKey: 'simulation.diffie_hellman.educational',
  demoInputs: { p: 23, g: 5, a_private: 6, b_private: 15 },
  build(ctx) {
    const p = Number(ctx.inputs.p ?? 23)
    const g = Number(ctx.inputs.g ?? 5)
    const a = Number(ctx.inputs.a_private ?? 6)
    const b = Number(ctx.inputs.b_private ?? 15)
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const pValid = isPrime(p)
    const paramsOk = pValid && g >= 2 && g <= p - 1

    if (!paramsOk) {
      const reason = pValid ? 'g out of range' : `p = ${p} not prime`
      return [
        {
          id: `${id}-error`,
          titleKey: 'simulation.diffie_hellman.error.title',
          descKey: 'simulation.diffie_hellman.error.desc',
          descArgs: { p },
          phase: 'input',
          view: { kind: 'dh-error', reason },
        },
      ] as SimStage[]
    }

    const aloud = Math.min(a % (p - 1), 30)
    const bloud = Math.min(b % (p - 1), 30)
    const A = Number(modPowBig(BigInt(g), BigInt(aloud), BigInt(p)))
    const B = Number(modPowBig(BigInt(g), BigInt(bloud), BigInt(p)))
    const sAlice = Number(modPowBig(BigInt(B), BigInt(aloud), BigInt(p)))
    const sBob = Number(modPowBig(BigInt(A), BigInt(bloud), BigInt(p)))

    const boundShared =
      extra && typeof extra.shared_secret === 'number' ? Number(extra.shared_secret) : null
    const boundAlicePub =
      extra && typeof (extra.alice as Record<string, unknown> | undefined)?.public_value === 'number'
        ? Number((extra.alice as Record<string, unknown>).public_value)
        : null
    const boundBobPub =
      extra && typeof (extra.bob as Record<string, unknown> | undefined)?.public_value === 'number'
        ? Number((extra.bob as Record<string, unknown>).public_value)
        : null

    const displayA = boundAlicePub ?? A
    const displayB = boundBobPub ?? B
    const displayShared = boundShared ?? sAlice

    return [
      {
        id: `${id}-params`,
        titleKey: 'simulation.diffie_hellman.params.title',
        descKey: 'simulation.diffie_hellman.params.desc',
        descArgs: { p, g },
        phase: 'input',
        view: { kind: 'dh-params', p, g, primeCheck: pValid },
      },
      {
        id: `${id}-alice-pub`,
        titleKey: 'simulation.diffie_hellman.alicePub.title',
        descKey: 'simulation.diffie_hellman.alicePub.desc',
        descArgs: { a: aloud, g, p },
        phase: 'transform',
        view: { kind: 'dh-party', name: 'Alice', priv: aloud, pub: displayA, p, g },
      },
      {
        id: `${id}-bob-pub`,
        titleKey: 'simulation.diffie_hellman.bobPub.title',
        descKey: 'simulation.diffie_hellman.bobPub.desc',
        descArgs: { b: bloud, g, p },
        phase: 'transform',
        view: { kind: 'dh-party', name: 'Bob', priv: bloud, pub: displayB, p, g },
      },
      {
        id: `${id}-exchange`,
        titleKey: 'simulation.diffie_hellman.exchange.title',
        descKey: 'simulation.diffie_hellman.exchange.desc',
        descArgs: { A: displayA, B: displayB },
        phase: 'key',
        view: { kind: 'dh-exchange', A: displayA, B: displayB },
      },
      {
        id: `${id}-shared`,
        titleKey: 'simulation.diffie_hellman.shared.title',
        descKey: 'simulation.diffie_hellman.shared.desc',
        descArgs: { s: displayShared },
        phase: 'output',
        view: { kind: 'dh-shared', aPriv: a, bPriv: b, s: displayShared, match: sAlice === sBob },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'dh-error':
        return (
          <div className="lab-stage-view">
            <DataBlock label="Error" value={String(view.reason)} tone="muted" big />
          </div>
        )
      case 'dh-params':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="p (prime)" value={String(view.p)} tone="internal" big />
              <DataBlock label="g (generator)" value={String(view.g)} tone="key" big />
            </div>
          </div>
        )
      case 'dh-party':
        return (
          <div className="lab-stage-view">
            <div className={`lab-card lab-card-${String(view.name).toLowerCase()}`}>
              <div className="lab-card-title">{String(view.name)}</div>
              <DataBlock label="private" value={String(view.priv)} tone="key" />
              <FlowArrow op="g^priv mod p" />
              <DataBlock label="public" value={String(view.pub)} tone="output" big />
            </div>
          </div>
        )
      case 'dh-exchange':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="public A" value={String(view.A)} tone="output" />
              </div>
              <div className="lab-dh-wire">
                <span className="lab-dh-arrow">A</span>
                <span className="lab-dh-arrow-rev">B</span>
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="public B" value={String(view.B)} tone="output" />
              </div>
            </div>
            <DataBlock
              label="channel"
              value="public only: A -> Bob, B -> Alice"
              tone="muted"
            />
          </div>
        )
      case 'dh-shared':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="s = B^a mod p" value={String(view.s)} tone="output" big />
              </div>
              <div className="lab-ec-plane">
                <FlowArrow />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="s = A^b mod p" value={String(view.s)} tone="output" big />
              </div>
            </div>
            <DataBlock
              label="shared secret"
              value={view.match ? `MATCH = ${String(view.s)}` : String(view.s)}
              tone="output"
              big
            />
          </div>
        )
      default:
        return null
    }
  },
}
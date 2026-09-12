import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'x25519'

const RFC7748_ALICE =
  '77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a'
const RFC7748_BOB =
  '5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb'

function clampNote(hex: string): string {
  const bytes = (hex.match(/.{2}/g) ?? [])
    .slice(0, 32)
    .map((byte) => parseInt(byte, 16))
  const b0 = (bytes[0] ?? 0) & 248
  const b31 = ((bytes[31] ?? 0) & 127) | 64
  return `clamped: b0=${b0.toString(16).padStart(2, '0')}, b31=${b31.toString(16).padStart(2, '0')}`
}

export const x25519Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.x25519.name',
  educationalKey: 'simulation.x25519.educational',
  demoInputs: { a_private: RFC7748_ALICE, b_private: RFC7748_BOB },
  build(ctx) {
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const aliceData = extra?.alice as Record<string, unknown> | undefined
    const bobData = extra?.bob as Record<string, unknown> | undefined

    const defaultAlicePriv = typeof aliceData?.private_hex === 'string' ? aliceData.private_hex : RFC7748_ALICE
    const defaultBobPriv = typeof bobData?.private_hex === 'string' ? bobData.private_hex : RFC7748_BOB

    const aPriv = ctx.inputs.a_private ? String(ctx.inputs.a_private) : defaultAlicePriv
    const bPriv = ctx.inputs.b_private ? String(ctx.inputs.b_private) : defaultBobPriv
    const aPub = typeof aliceData?.public_hex === 'string' ? aliceData.public_hex : 'x25(a)'
    const bPub = typeof bobData?.public_hex === 'string' ? bobData.public_hex : 'x25(b)'

    const sharedHex = typeof extra?.shared_secret_hex === 'string' ? extra.shared_secret_hex : null

    return [
      {
        id: `${id}-curve`,
        titleKey: 'simulation.x25519.curve.title',
        descKey: 'simulation.x25519.curve.desc',
        descArgs: {},
        phase: 'input',
        view: { kind: 'x25519-curve' },
      },
      {
        id: `${id}-keys`,
        titleKey: 'simulation.x25519.keys.title',
        descKey: 'simulation.x25519.keys.desc',
        descArgs: {},
        phase: 'key',
        view: { kind: 'x25519-keys', aPriv, bPriv, aPub, bPub },
      },
      {
        id: `${id}-ladder`,
        titleKey: 'simulation.x25519.ladder.title',
        descKey: 'simulation.x25519.ladder.desc',
        descArgs: {},
        phase: 'transform',
        view: {
          kind: 'x25519-ladder',
          aPriv,
          bPriv,
          clampA: clampNote(aPriv),
          clampB: clampNote(bPriv),
        },
      },
      {
        id: `${id}-shared`,
        titleKey: 'simulation.x25519.shared.title',
        descKey: 'simulation.x25519.shared.desc',
        descArgs: {},
        phase: 'output',
        view: { kind: 'x25519-shared', shared: sharedHex },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'x25519-curve':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="curve" value="Curve25519 (Montgomery)" tone="internal" big />
              <DataBlock label="form" value="y^2 = x^3 + 486662*x^2 + x" tone="internal" />
              <DataBlock label="base point" value="u = 9 (x-coordinate only)" tone="key" big />
              <DataBlock label="field prime p" value="2^255 - 19" tone="internal" />
            </div>
          </div>
        )
      case 'x25519-keys':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="private (hex)" value={String(view.aPriv)} tone="key" />
                <FlowArrow op="X25519" />
                <DataBlock label="public" value={String(view.aPub)} tone="output" />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="private (hex)" value={String(view.bPriv)} tone="key" />
                <FlowArrow op="X25519" />
                <DataBlock label="public" value={String(view.bPub)} tone="output" />
              </div>
            </div>
          </div>
        )
      case 'x25519-ladder':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="Alice clamp" value={String(view.clampA)} tone="transform" />
              <DataBlock label="Bob clamp" value={String(view.clampB)} tone="transform" />
            </div>
            <div className="lab-ec-plane">
              <FlowArrow op="Montgomery ladder" />
            </div>
            <DataBlock
              label="identity"
              value="[1, u, 1] -> ladder iterations -> u-coordinate result"
              tone="internal"
            />
          </div>
        )
      case 'x25519-shared':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock
                  label="S = X25519(a, B)"
                  value={view.shared && String(view.shared).length > 16 ? `${String(view.shared).slice(0, 16)}...` : 'X25519(a,B)'}
                  tone="output"
                  big
                />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock
                  label="S = X25519(b, A)"
                  value={view.shared && String(view.shared).length > 16 ? `${String(view.shared).slice(0, 16)}...` : 'X25519(b,A)'}
                  tone="output"
                  big
                />
              </div>
            </div>
            <DataBlock
              label="shared secret (32 bytes)"
              value={view.shared ? String(view.shared) : 'binding unavailable in demo'}
              tone="internal"
              big
            />
          </div>
        )
      default:
        return null
    }
  },
}
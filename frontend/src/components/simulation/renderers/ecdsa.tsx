import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { CharRow } from '../common/CharRow'

const id = 'ecdsa'

const CURVE_LABEL: Record<string, string> = {
  p256: 'P-256',
  p384: 'P-384',
  p521: 'P-521',
}

export const ecdsaEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.ecdsa.name',
  educationalKey: 'simulation.ecdsa.educational',
  demoInputs: { message: 'Message to sign', curve: 'p256' },
  build(ctx) {
    const message = String(ctx.inputs.message ?? 'Message to sign')
    const curve = String(ctx.inputs.curve ?? 'p256')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const rHex = extra && typeof extra.r === 'number' ? `0x${Number(extra.r).toString(16)}` : null
    const sHex = extra && typeof extra.s === 'number' ? `0x${Number(extra.s).toString(16)}` : null
    const sigHex = typeof extra?.signature_hex === 'string' ? extra.signature_hex : null
    const privScalar = typeof extra?.private_scalar === 'number' ? Number(extra.private_scalar) : null
    const pubHex = typeof extra?.public_hex === 'string' ? extra.public_hex : null

    return [
      {
        id: `${id}-keygen`,
        titleKey: 'simulation.ecdsa.keygen.title',
        descKey: 'simulation.ecdsa.keygen.desc',
        descArgs: { curve: CURVE_LABEL[curve] ?? curve },
        phase: 'key',
        view: { kind: 'ecdsa-keygen', priv: privScalar, curve: CURVE_LABEL[curve] ?? curve },
      },
      {
        id: `${id}-hash`,
        titleKey: 'simulation.ecdsa.hash.title',
        descKey: 'simulation.ecdsa.hash.desc',
        descArgs: { message },
        phase: 'transform',
        view: { kind: 'ecdsa-hash', message },
      },
      {
        id: `${id}-sign`,
        titleKey: 'simulation.ecdsa.sign.title',
        descKey: 'simulation.ecdsa.sign.desc',
        descArgs: {},
        phase: 'transform',
        view: { kind: 'ecdsa-sign', rHex, sHex, sigHex },
      },
      {
        id: `${id}-verify`,
        titleKey: 'simulation.ecdsa.verify.title',
        descKey: 'simulation.ecdsa.verify.desc',
        descArgs: {},
        phase: 'output',
        view: { kind: 'ecdsa-verify', pubHex },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'ecdsa-keygen':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="curve" value={String(view.curve)} tone="internal" big />
              <DataBlock label="private scalar d" value={view.priv != null ? String(view.priv) : 'random'} tone="key" />
              <FlowArrow op="Q = d*G" />
              <DataBlock label="public point Q" value="(xQ, yQ)" tone="output" />
            </div>
          </div>
        )
      case 'ecdsa-hash':
        return (
          <div className="lab-stage-view">
            <CharRow
              label="message"
              cells={String(view.message).split('').map((ch) => ({ ch, tone: 'input' as const }))}
            />
            <FlowArrow op="SHA-256 (truncated to curve order n)" />
            <DataBlock label="z (int digest)" value="SHA-256(message)" tone="transform" />
          </div>
        )
      case 'ecdsa-sign':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="k" value="random per-message" tone="key" />
              <DataBlock label="R = k*G" value="(xR, yR)" tone="internal" />
              <DataBlock label="r = xR mod n" value={view.rHex ? String(view.rHex) : 'structural'} tone="output" />
              <DataBlock label="s = k^-1(z + r*d) mod n" value={view.sHex ? String(view.sHex) : 'structural'} tone="output" />
            </div>
            {typeof view.sigHex === 'string' && (
              <div className="lab-ec-plane">
                <DataBlock label="signature (DER hex)" value={String(view.sigHex)} tone="output" big />
              </div>
            )}
          </div>
        )
      case 'ecdsa-verify':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock
                label="verify"
                value="w = s^-1 mod n; u1 = z*w; u2 = r*w; P = u1*G + u2*Q; OK if P.x mod n == r"
                tone="internal"
              />
              {typeof view.pubHex === 'string' && (
                <DataBlock label="public point" value={String(view.pubHex)} tone="output" />
              )}
            </div>
            <div className="lab-ec-plane">
              <DataBlock label="note" value="ECDSA signs (authenticates) - it does NOT encrypt the message" tone="muted" />
            </div>
          </div>
        )
      default:
        return null
    }
  },
}
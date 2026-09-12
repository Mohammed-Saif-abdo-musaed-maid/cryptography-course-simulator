import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'ed25519'

const DEMO_PUB = 'structural A = a*B'

export const ed25519Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.ed25519.name',
  educationalKey: 'simulation.ed25519.educational',
  demoInputs: { message: 'Message to sign', private_hex: '' },
  build(ctx) {
    const message = String(ctx.inputs.message ?? 'Message to sign')
    const privateHex = String(ctx.inputs.private_hex ?? '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const pubHex = typeof extra?.public_hex === 'string' ? extra.public_hex : null
    const sigHex = typeof extra?.signature_hex === 'string' ? extra.signature_hex : null
    const boundPrivHex = typeof extra?.private_hex === 'string' ? extra.private_hex : null

    const rHex = sigHex ? sigHex.slice(0, 64) : null
    const sHex = sigHex && sigHex.length > 64 ? sigHex.slice(64) : null
    const effectivePriv = privateHex.length > 0 ? privateHex : (boundPrivHex ?? '')

    return [
      {
        id: `${id}-keygen`,
        titleKey: 'simulation.ed25519.keygen.title',
        descKey: 'simulation.ed25519.keygen.desc',
        descArgs: {},
        phase: 'key',
        view: { kind: 'ed25519-keygen', privateHex: effectivePriv, pubHex },
      },
      {
        id: `${id}-hash`,
        titleKey: 'simulation.ed25519.hash.title',
        descKey: 'simulation.ed25519.hash.desc',
        descArgs: { message },
        phase: 'transform',
        view: { kind: 'ed25519-hash', message },
      },
      {
        id: `${id}-derivation`,
        titleKey: 'simulation.ed25519.derivation.title',
        descKey: 'simulation.ed25519.derivation.desc',
        descArgs: {},
        phase: 'transform',
        view: { kind: 'ed25519-derivation' },
      },
      {
        id: `${id}-sign`,
        titleKey: 'simulation.ed25519.sign.title',
        descKey: 'simulation.ed25519.sign.desc',
        descArgs: {},
        phase: 'transform',
        view: { kind: 'ed25519-sign', rHex, sHex, sigHex },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.ed25519.result.title',
        descKey: 'simulation.ed25519.result.desc',
        descArgs: {},
        phase: 'output',
        view: { kind: 'ed25519-result', sigHex },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'ed25519-keygen':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="private key (32 bytes)" value={String(view.privateHex) || '(blank = auto)'} tone="key" />
              <FlowArrow op="SHA-512 -> clamp -> scalar a" />
              <DataBlock label="public A = a*B" value={view.pubHex ? String(view.pubHex) : DEMO_PUB} tone="output" />
            </div>
          </div>
        )
      case 'ed25519-hash':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="message (M)" value={String(view.message)} tone="input" big />
            </div>
            <FlowArrow op="SHA-512(message)" />
            <div className="lab-ec-plane">
              <DataBlock label="nonce r" value="sha512(prefix || message)" tone="transform" />
            </div>
          </div>
        )
      case 'ed25519-derivation':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="R = r*B" value="structural (curve point)" tone="internal" />
              <DataBlock label="h = SHA-512(R || A || M)" value="structural" tone="transform" />
              <DataBlock label="S = (r + h*a) mod L" value="structural" tone="output" />
            </div>
          </div>
        )
      case 'ed25519-sign':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="R (32 bytes)" value={view.rHex ? String(view.rHex) : 'structural'} tone="output" />
              <DataBlock label="S (32 bytes)" value={view.sHex ? String(view.sHex) : 'structural'} tone="output" />
            </div>
            {typeof view.sigHex === 'string' && (
              <DataBlock label="signature (64 bytes)" value={String(view.sigHex)} tone="output" big />
            )}
          </div>
        )
      case 'ed25519-result':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="scheme" value="Ed25519 is a SIGNATURE scheme, NOT encryption" tone="key" big />
              {typeof view.sigHex === 'string' && (
                <DataBlock label="signature" value={String(view.sigHex)} tone="output" big />
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  },
}
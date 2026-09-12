import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'ecdh'

interface CurveField {
  name: string
  value: string
}

interface CurveParams {
  label: string
  security: string
  fields: CurveField[]
}

function toHex(v: bigint): string {
  return '0x' + v.toString(16)
}

const CURVES: Record<string, CurveParams> = {
  p256: {
    label: 'P-256',
    security: '128',
    fields: [
      { name: 'p (prime)', value: '0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff' },
      { name: 'a', value: toHex(0xffffffff00000001000000000000000000000000fffffffffffffffffffffffcn) },
      { name: 'b', value: toHex(0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn) },
      { name: 'G (x)', value: toHex(0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n) },
      { name: 'G (y)', value: toHex(0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n) },
      { name: 'n (order)', value: '0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551' },
    ],
  },
  p384: {
    label: 'P-384',
    security: '192',
    fields: [
      { name: 'p (prime)', value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff' },
      { name: 'a', value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc' },
      { name: 'b', value: '0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef' },
      { name: 'G (x)', value: '0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7' },
      { name: 'G (y)', value: '0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f' },
      { name: 'n (order)', value: '0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973' },
    ],
  },
  p521: {
    label: 'P-521',
    security: '256',
    fields: [
      { name: 'p (prime)', value: '0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
      { name: 'a', value: '0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc' },
      { name: 'b', value: '0x051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00' },
      { name: 'G (x)', value: '0xc6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66' },
      { name: 'G (y)', value: '0x11839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650' },
      { name: 'n (order)', value: '0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409' },
    ],
  },
}

export const ecdhEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.ecdh.name',
  educationalKey: 'simulation.ecdh.educational',
  demoInputs: { curve: 'p256', dA: 8, dB: 11 },
  build(ctx) {
    const curve = String(ctx.inputs.curve ?? 'p256')
    const curveParams = CURVES[curve] ?? CURVES.p256
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const aliceData = extra?.alice as Record<string, unknown> | undefined
    const bobData = extra?.bob as Record<string, unknown> | undefined

    // The backend always derives fresh random scalars and returns them in
    // extra.alice/bob.private_scalar — those are the values actually used, so
    // they take precedence over the demo/input scalars whenever a result is
    // bound (matching the diffieHellman binding convention).
    const dA =
      typeof aliceData?.private_scalar === 'number'
        ? Number(aliceData.private_scalar)
        : ctx.inputs.dA != null
          ? Number(ctx.inputs.dA)
          : 8
    const dB =
      typeof bobData?.private_scalar === 'number'
        ? Number(bobData.private_scalar)
        : ctx.inputs.dB != null
          ? Number(ctx.inputs.dB)
          : 11

    const aliceHex = typeof aliceData?.public_hex === 'string' ? aliceData.public_hex : null
    const bobHex = typeof bobData?.public_hex === 'string' ? bobData.public_hex : null
    const sharedHex = typeof extra?.shared_secret_hex === 'string' ? extra.shared_secret_hex : null

    return [
      {
        id: `${id}-curve`,
        titleKey: 'simulation.ecdh.curve.title',
        descKey: 'simulation.ecdh.curve.desc',
        descArgs: { curve: curveParams.label },
        phase: 'input',
        view: { kind: 'ecdh-curve', fields: curveParams.fields, security: curveParams.security },
      },
      {
        id: `${id}-keys`,
        titleKey: 'simulation.ecdh.keys.title',
        descKey: 'simulation.ecdh.keys.desc',
        descArgs: { dA, dB },
        phase: 'key',
        view: { kind: 'ecdh-keys', dA, dB, aliceHex, bobHex },
      },
      {
        id: `${id}-exchange`,
        titleKey: 'simulation.ecdh.exchange.title',
        descKey: 'simulation.ecdh.exchange.desc',
        descArgs: {},
        phase: 'key',
        view: { kind: 'ecdh-exchange', aliceHex, bobHex },
      },
      {
        id: `${id}-shared`,
        titleKey: 'simulation.ecdh.shared.title',
        descKey: 'simulation.ecdh.shared.desc',
        descArgs: { s: sharedHex ?? 'aB = bA' },
        phase: 'output',
        view: { kind: 'ecdh-shared', shared: sharedHex },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'ecdh-curve': {
        const fields = view.fields as CurveField[]
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <div className="lab-ec-curve" dir="ltr" aria-hidden="true">
                <span className="lab-ec-axis-y" />
                <span className="lab-ec-axis-x" />
                <span className="lab-ec-curve-line" />
                <span className="lab-ec-base-point" title="base point G" />
              </div>
              {fields.map((f) => (
                <DataBlock key={f.name} label={f.name} value={f.value} tone="internal" />
              ))}
            </div>
            <DataBlock label="security" value={`~${String(view.security)} bits`} tone="muted" />
          </div>
        )
      }
      case 'ecdh-keys':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="dA" value={String(view.dA)} tone="key" />
                <FlowArrow op="A = dA*G" />
                <DataBlock
                  label="public A"
                  value={view.aliceHex ? `${String(view.aliceHex).slice(0, 24)}...` : 'dA*G (structural)'}
                  tone="output"
                />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="dB" value={String(view.dB)} tone="key" />
                <FlowArrow op="B = dB*G" />
                <DataBlock
                  label="public B"
                  value={view.bobHex ? `${String(view.bobHex).slice(0, 24)}...` : 'dB*G (structural)'}
                  tone="output"
                />
              </div>
            </div>
          </div>
        )
      case 'ecdh-exchange':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock
                  label="public A (sent)"
                  value={view.aliceHex ? `${String(view.aliceHex).slice(0, 16)}...` : 'A'}
                  tone="output"
                />
              </div>
              <div className="lab-dh-wire">
                <span className="lab-dh-arrow">A</span>
                <span className="lab-dh-arrow-rev">B</span>
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock
                  label="public B (sent)"
                  value={view.bobHex ? `${String(view.bobHex).slice(0, 16)}...` : 'B'}
                  tone="output"
                />
              </div>
            </div>
            <DataBlock
              label="note"
              value="Only public points cross the wire; an eavesdropper cannot recover dA / dB"
              tone="muted"
            />
          </div>
        )
      case 'ecdh-shared':
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock
                  label="S = dA*B"
                  value={view.shared ? `${String(view.shared).slice(0, 32)}...` : 'a (dA*B)'}
                  tone="output"
                  big
                />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock
                  label="S = dB*A"
                  value={view.shared ? `${String(view.shared).slice(0, 32)}...` : 'a (dB*A)'}
                  tone="output"
                  big
                />
              </div>
            </div>
            <DataBlock
              label="shared secret"
              value={view.shared ? String(view.shared) : 'x-coordinate of aG*bG'}
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
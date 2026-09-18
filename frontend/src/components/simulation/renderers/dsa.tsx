import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'dsa'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function truncateShort(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}\n…` : s
}

export const dsaEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.dsa.name',
  educationalKey: 'simulation.dsa.educational',
  demoInputs: { message: 'Sign me, DSA', hash_algorithm: 'sha256', key_size: 2048, private_key_pem: '' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const hash = String(ctx.inputs.hash_algorithm ?? 'sha256')
    const keySize = Number(ctx.inputs.key_size ?? 2048)
    const pem = String(ctx.inputs.private_key_pem ?? '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const op = ctx.operation

    const pubPem = hasResult ? hexStr(extra?.public_key_pem) || pem : ''
    const sigHex = hasResult ? hexStr(extra?.signature_hex) : ''
    const digestHex = hasResult ? hexStr(extra?.digest_hex) : ''
    const rHex = hasResult ? hexStr(extra?.r_hex) : ''
    const sHex = hasResult ? hexStr(extra?.s_hex) : ''
    const rawResult = ctx.result?.result as unknown
    const verdict =
      hasResult && (op === 'verify' || op === 'verify_signature' || op === 'sign')
        ? rawResult === true
          ? 'VALID'
          : rawResult === false
            ? 'INVALID'
            : ''
        : ''

    const stages: SimStage[] = []

    if (op === 'generate_keys') {
      const keygenStages: SimStage[] = [
        {
          id: `${id}-keygen1`,
          titleKey: 'simulation.dsa.keygen1.title',
          descKey: 'simulation.dsa.keygen1.desc',
          descArgs: { size: keySize },
          phase: 'key',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-keygen`, kgStep: 1, keySize },
        },
        {
          id: `${id}-keygen2`,
          titleKey: 'simulation.dsa.keygen2.title',
          descKey: 'simulation.dsa.keygen2.desc',
          descArgs: {},
          phase: 'key',
          traceIndex: hasResult ? 2 : undefined,
          view: { kind: `${id}-keygen`, kgStep: 2, keySize },
        },
        {
          id: `${id}-keygen3`,
          titleKey: 'simulation.dsa.keygen3.title',
          descKey: 'simulation.dsa.keygen3.desc',
          descArgs: {},
          phase: 'key',
          traceIndex: hasResult ? 3 : undefined,
          view: { kind: `${id}-keygen`, kgStep: 3, pubPem, hasPub: hasResult && pubPem.length > 0, keySize },
        },
      ]
      stages.push(...keygenStages)
      return stages
    }

    if (op === 'sign') {
      stages.push(
        {
          id: `${id}-hash`,
          titleKey: 'simulation.dsa.hash.title',
          descKey: 'simulation.dsa.hash.desc',
          descArgs: { hash },
          phase: 'transform',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-hash`, message, hash, digestHex, hasResult },
        },
        {
          id: `${id}-params`,
          titleKey: 'simulation.dsa.params.title',
          descKey: 'simulation.dsa.params.desc',
          descArgs: {},
          phase: 'internal',
          traceIndex: hasResult ? 2 : undefined,
          view: { kind: `${id}-params`, rHex, sHex, hasResult },
        },
        {
          id: `${id}-sign`,
          titleKey: 'simulation.dsa.sign.title',
          descKey: 'simulation.dsa.sign.desc',
          descArgs: {},
          phase: 'transform',
          traceIndex: hasResult ? 3 : undefined,
          view: { kind: `${id}-sign`, sigHex, rHex, sHex, hasSig: hasResult && sigHex.length > 0 },
        },
      )
      return stages
    }

    if (op === 'verify' || op === 'verify_signature') {
      stages.push(
        {
          id: `${id}-vhash`,
          titleKey: 'simulation.dsa.verify1.title',
          descKey: 'simulation.dsa.verify1.desc',
          descArgs: { hash },
          phase: 'transform',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-vhash`, message, hash, digestHex, hasResult },
        },
        {
          id: `${id}-verify`,
          titleKey: 'simulation.dsa.verify2.title',
          descKey: 'simulation.dsa.verify2.desc',
          descArgs: {},
          phase: 'output',
          traceIndex: hasResult ? 2 : undefined,
          view: { kind: `${id}-verify`, verdict, rHex, sHex, hasResult, pubPem },
        },
      )
      return stages
    }

    return stages
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case `${id}-keygen`: {
        const kg = Number(view.kgStep ?? 1)
        if (kg === 1) {
          return (
            <div className="lab-stage-view">
              <div className="lab-ec-plane">
                <DataBlock label="domain parameters" value={`prime p, prime divisor q, generator g (${String(view.keySize)} bits)`} tone="internal" />
              </div>
            </div>
          )
        }
        if (kg === 2) {
          return (
            <div className="lab-stage-view">
              <div className="lab-ec-plane">
                <DataBlock label="private x" value="random secret in [1, q−1] (hidden)" tone="key" />
              </div>
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="public y = g^x mod p" value="—" tone="internal" />
              {view.hasPub ? (
                <DataBlock label="public key (PEM, truncated)" value={truncateShort(hexStr(view.pubPem), 60)} tone="output" />
              ) : (
                <DataBlock label="public key" value="run generate_keys to bind the PEM" tone="muted" />
              )}
            </div>
          </div>
        )
      }
      case `${id}-hash`:
        return (
          <div className="lab-stage-view">
            <DataBlock label="message" value={hexStr(view.message)} tone="input" big />
            <FlowArrow op={`${hexStr(view.hash)} digest`} />
            {Boolean(view.hasResult) && hexStr(view.digestHex) ? (
              <DataBlock label="real digest H(m)" value={hexStr(view.digestHex)} tone="transform" big />
            ) : (
              <DataBlock label="digest" value="H(m) signed, not the raw message" tone="transform" />
            )}
          </div>
        )
      case `${id}-params`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="nonce k" value="fresh random per message — reuse leaks the private key" tone="key" />
              {Boolean(view.hasResult) && hexStr(view.rHex) ? (
                <DataBlock label="real r = (g^k mod p) mod q" value={hexStr(view.rHex)} tone="internal" />
              ) : (
                <DataBlock label="r" value="r = (g^k mod p) mod q" tone="internal" />
              )}
              {Boolean(view.hasResult) && hexStr(view.sHex) ? (
                <DataBlock label="real s = k⁻¹(H(m) + x·r) mod q" value={hexStr(view.sHex)} tone="internal" />
              ) : (
                <DataBlock label="s" value="s = k⁻¹(H(m) + x·r) mod q" tone="internal" />
              )}
            </div>
          </div>
        )
      case `${id}-sign`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              {view.hasSig ? (
                <>
                  <DataBlock label="r (real)" value={hexStr(view.rHex)} tone="internal" />
                  <DataBlock label="s (real)" value={hexStr(view.sHex)} tone="internal" />
                  <DataBlock label="signature (DER hex)" value={hexStr(view.sigHex)} tone="output" big />
                </>
              ) : (
                <DataBlock label="signature (DER hex)" value="—" tone="muted" big />
              )}
            </div>
          </div>
        )
      case `${id}-vhash`:
        return (
          <div className="lab-stage-view">
            <DataBlock label="message (claimed)" value={hexStr(view.message)} tone="input" big />
            <FlowArrow op={`recompute ${hexStr(view.hash)} digest`} />
            {Boolean(view.hasResult) && hexStr(view.digestHex) ? (
              <DataBlock label="real digest H(m)" value={hexStr(view.digestHex)} tone="transform" big />
            ) : (
              <DataBlock label="digest" value="the verifier hashes the message, not the signature" tone="transform" />
            )}
          </div>
        )
      case `${id}-verify`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="w = s⁻¹ mod q; u₁ = H(m)·w; u₂ = r·w; v = ((g^u₁)·(y^u₂) mod p) mod q" value="OK if v ≡ r (mod q)" tone="internal" />
              <DataBlock
                label="verdict"
                value={view.hasResult ? hexStr(view.verdict) || '—' : 'run verify to check'}
                tone={hexStr(view.verdict) === 'VALID' ? 'output' : hexStr(view.verdict) === 'INVALID' ? 'error' : 'muted'}
                big
              />
            </div>
          </div>
        )
      default:
        return null
    }
  },
}
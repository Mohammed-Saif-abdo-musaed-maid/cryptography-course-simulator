import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'rsa_pss'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function truncateShort(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}\n…` : s
}

export const rsaPssEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.rsa_pss.name',
  educationalKey: 'simulation.rsa_pss.educational',
  demoInputs: { message: 'Sign me, RSA-PSS', hash_algorithm: 'sha256', key_size: 2048, private_key_pem: '' },
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
    const emHex = hasResult ? hexStr(extra?.em_hex) : ''
    const emTrailer = hasResult ? Boolean(extra?.em_trailer_checked) : false
    const saltBytes = extra && typeof extra.salt_length_bytes === 'number' ? extra.salt_length_bytes : 0
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
      const kgRows: Array<{ titleKey: string; descKey: string; view: SimView }> = [
        { titleKey: 'simulation.rsa_pss.keygen1.title', descKey: 'simulation.rsa_pss.keygen1.desc', view: { kind: `${id}-keygen`, kgStep: 1, keySize } },
        { titleKey: 'simulation.rsa_pss.keygen2.title', descKey: 'simulation.rsa_pss.keygen2.desc', view: { kind: `${id}-keygen`, kgStep: 2, keySize } },
        { titleKey: 'simulation.rsa_pss.keygen3.title', descKey: 'simulation.rsa_pss.keygen3.desc', view: { kind: `${id}-keygen`, kgStep: 3, keySize } },
        { titleKey: 'simulation.rsa_pss.keygen4.title', descKey: 'simulation.rsa_pss.keygen4.desc', view: { kind: `${id}-keygen`, kgStep: 4, pubPem, hasPub: hasResult && pubPem.length > 0, keySize } },
      ]
      kgRows.forEach((r, i) => {
        stages.push({
          id: `${id}-keygen${i + 1}`,
          titleKey: r.titleKey,
          descKey: r.descKey,
          descArgs: { size: keySize },
          phase: 'key',
          traceIndex: hasResult ? i + 1 : undefined,
          view: r.view,
        })
      })
      return stages
    }

    if (op === 'sign') {
      stages.push(
        {
          id: `${id}-hash`,
          titleKey: 'simulation.rsa_pss.hash.title',
          descKey: 'simulation.rsa_pss.hash.desc',
          descArgs: { hash },
          phase: 'transform',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-hash`, message, hash, digestHex, hasResult },
        },
        {
          id: `${id}-encode`,
          titleKey: 'simulation.rsa_pss.encode.title',
          descKey: 'simulation.rsa_pss.encode.desc',
          descArgs: {},
          phase: 'internal',
          traceIndex: hasResult ? 2 : undefined,
          view: { kind: `${id}-encode`, emHex, emTrailer, saltBytes, hasResult },
        },
        {
          id: `${id}-sign`,
          titleKey: 'simulation.rsa_pss.sign.title',
          descKey: 'simulation.rsa_pss.sign.desc',
          descArgs: {},
          phase: 'transform',
          traceIndex: hasResult ? 3 : undefined,
          view: { kind: `${id}-sign`, sigHex, hasSig: hasResult && sigHex.length > 0 },
        },
      )
      return stages
    }

    if (op === 'verify' || op === 'verify_signature') {
      stages.push(
        {
          id: `${id}-vhash`,
          titleKey: 'simulation.rsa_pss.verify1.title',
          descKey: 'simulation.rsa_pss.verify1.desc',
          descArgs: { hash },
          phase: 'transform',
          traceIndex: hasResult ? 1 : undefined,
          view: { kind: `${id}-vhash`, message, hash, digestHex, hasResult },
        },
        {
          id: `${id}-vrecover`,
          titleKey: 'simulation.rsa_pss.verify2.title',
          descKey: 'simulation.rsa_pss.verify2.desc',
          descArgs: {},
          phase: 'internal',
          traceIndex: hasResult ? 2 : undefined,
          view: { kind: `${id}-vrecover`, emHex, emTrailer, saltBytes, hasResult },
        },
        {
          id: `${id}-verify`,
          titleKey: 'simulation.rsa_pss.verify3.title',
          descKey: 'simulation.rsa_pss.verify3.desc',
          descArgs: {},
          phase: 'output',
          traceIndex: hasResult ? 3 : undefined,
          view: { kind: `${id}-verify`, verdict, hasResult, pubPem },
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
                <DataBlock label="primes p, q" value={`two random {size}-bit primes → n = p·q (${String(view.keySize)} bits)`} tone="internal" />
              </div>
            </div>
          )
        }
        if (kg === 2) {
          return (
            <div className="lab-stage-view">
              <div className="lab-ec-plane">
                <DataBlock label="public exponent" value="e = 65537 — the standard choice" tone="internal" />
              </div>
            </div>
          )
        }
        if (kg === 3) {
          return (
            <div className="lab-stage-view">
              <div className="lab-ec-plane">
                <DataBlock label="private exponent d" value="d = e⁻¹ mod λ(n) — the signing secret stays hidden" tone="key" />
              </div>
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              {Boolean(view.hasPub) ? (
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
              <DataBlock label="digest" value="PSS signs a digest of the message" tone="transform" />
            )}
          </div>
        )
      case `${id}-encode`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="EMSA-PSS" value="maskedDB ‖ H ‖ 0xBC trailer → EM; salt length = MAX_LENGTH" tone="internal" />
              {Boolean(view.hasResult) && hexStr(view.emHex) ? (
                <>
                  <DataBlock label={`real EM = sᵉ mod n (${Math.round(hexStr(view.emHex).length / 2)} bytes)`} value={truncateShort(hexStr(view.emHex), 90)} tone="internal" />
                  <DataBlock
                    label="trailer check"
                    value={view.emTrailer ? `0xBC confirmed at byte ${hexStr(view.emHex).length / 2 - 1}` : '—'}
                    tone="output"
                  />
                  <DataBlock label="real salt length" value={`${Number(view.saltBytes)} bytes (emLen − HLen − 2)`} tone="key" />
                </>
              ) : (
                <DataBlock label="randomness" value="the salt (random per signature) makes PSS non-deterministic" tone="key" />
              )}
            </div>
          </div>
        )
      case `${id}-sign`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="signature (DER hex)" value={view.hasSig ? hexStr(view.sigHex) : '—'} tone={view.hasSig ? 'output' : 'muted'} big />
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
      case `${id}-vrecover`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="RSA public operation" value="EM′ = sᵉ mod n — recovers the encoded message from the signature" tone="internal" />
              {Boolean(view.hasResult) && hexStr(view.emHex) ? (
                <>
                  <DataBlock label={`real EM′ (${Math.round(hexStr(view.emHex).length / 2)} bytes)`} value={truncateShort(hexStr(view.emHex), 90)} tone="internal" />
                  <DataBlock
                    label="trailer check"
                    value={view.emTrailer ? `0xBC confirmed at byte ${hexStr(view.emHex).length / 2 - 1}` : '—'}
                    tone="output"
                  />
                </>
              ) : (
                <DataBlock label="EM′" value="the digest column is masked inside EM — verified by the library, not shown byte-wise" tone="internal" />
              )}
            </div>
          </div>
        )
      case `${id}-verify`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="verification" value="EM' = sᵉ mod n; re-encode and compare; salt travels inside the signature" tone="internal" />
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
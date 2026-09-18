import { describe, expect, it } from 'vitest'
import { rsaPssEngine } from '../components/simulation/renderers/rsaPss'
import { dsaEngine } from '../components/simulation/renderers/dsa'
import { rsaPss3DAdapter } from '../components/simulation3d/adapters/rsaPss3D'
import { dsa3DAdapter } from '../components/simulation3d/adapters/dsa3D'
import type { SimulationContext } from '../components/simulation/simulationTypes'
import type { StepDetail, AlgorithmResult } from '../types'

const DIGEST = 'ab'.repeat(32)
const EM = 'd0'.repeat(32)
const SIG = 'cafe' + '11'.repeat(15)

function baseCtx(overrides: Partial<SimulationContext>): SimulationContext {
  return {
    id: 'x',
    operation: 'sign',
    inputs: {},
    demo: false,
    language: 'en',
    dir: 'ltr',
    theme: 'dark',
    result: null,
    resultMatches: false,
    trace: [],
    t: (k) => k,
    ...overrides,
  }
}

function rawResult(extra: Record<string, unknown>, result: unknown = '', steps: StepDetail[] = []): AlgorithmResult {
  return { algorithm: '', operation: '', input: '', result, extra, steps } as unknown as AlgorithmResult
}

const pssSignTrace: StepDetail[] = [
  { step: 1, title: 'Hash the message', description: 'PSS signs a digest of the message.', input: 'Sign me, RSA-PSS', output: DIGEST, detail: { digest_hex: DIGEST } },
  { step: 2, title: 'PSS encode (EMSA-PSS)', description: 'maskedDB + salt + 0xBC.', input: 'digest + random salt', output: 'EM', detail: { salt_length_bytes: 222, em_hex: EM, em_trailer_checked: true } },
  { step: 3, title: 'RSA private operation', description: 's = EM^d mod n.', input: 'EM', output: 'signature', detail: { signature_hex: SIG } },
]

const pssVerifyTrace: StepDetail[] = [
  { step: 1, title: 'Hash the message again', description: 'Recompute digest.', input: 'Sign me, RSA-PSS', output: DIGEST, detail: { digest_hex: DIGEST } },
  { step: 2, title: 'Recover the encoded message', description: "EM' = s^e mod n.", input: 'signature (hex)', output: 'EM′ = sᵉ mod n', detail: { em_hex: EM, em_trailer_checked: true } },
  { step: 3, title: 'Verify the encoding', description: 'decode + trailer.', input: 'EM′ + H(m)', output: 'VALID', detail: { valid: true } },
]

const pssKeygenTrace: StepDetail[] = [
  { step: 1, title: 'Generate two large primes', description: 'n = p·q', input: '2048-bit modulus', output: 'n = p·q', detail: { key_size: 2048 } },
  { step: 2, title: 'Choose the public exponent', description: 'e = 65537', input: '', output: 'e = 65537', detail: {} },
  { step: 3, title: 'Compute the private exponent', description: 'd = e⁻¹ mod λ(n)', input: '', output: 'd (hidden)', detail: {} },
  { step: 4, title: 'Export the key pair', description: 'public key as PEM', input: '', output: 'PEM', detail: { public_key_pem: 'PEM' } },
]

const dsaSignTrace: StepDetail[] = [
  { step: 1, title: 'Hash the message', description: 'Hashes the message.', input: 'Sign me, DSA', output: DIGEST, detail: { digest_hex: DIGEST } },
  { step: 2, title: 'Choose a per-message nonce k', description: 'fresh random k', input: '', output: 'k generated', detail: {} },
  { step: 3, title: 'Compute (r, s)', description: 'r, s from k and H.', input: 'x hidden', output: 'signature', detail: { r_hex: 'a1', s_hex: 'b2' } },
]

const dsaVerifyTrace: StepDetail[] = [
  { step: 1, title: 'Hash the message again', description: 'Recompute digest.', input: 'Sign me, DSA', output: DIGEST, detail: { digest_hex: DIGEST } },
  { step: 2, title: 'Recompute the verification value', description: 'v ≡ r (mod q)?', input: '(r, s)', output: 'VALID', detail: { valid: true, r: 1, s: 2, r_hex: 'a1', s_hex: 'b2' } },
]

describe('RSA-PSS step fidelity (the "1/1 key generation" fix)', () => {
  it('fresh sign page exposes all 3 real stages — not a single keygen step', () => {
    const stages = rsaPssEngine.build({ ...baseCtx({ id: 'rsa_pss', operation: 'sign' }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(stages.map((s) => s.id)).toEqual(['rsa_pss-hash', 'rsa_pss-encode', 'rsa_pss-sign'])
    const steps = rsaPss3DAdapter.buildSteps({ ...baseCtx({ id: 'rsa_pss', operation: 'sign' }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(steps.length).toBe(3)
  })

  it('generate_keys exposes all 4 real keygen trace states', () => {
    const result = rawResult({ public_key_pem: 'PEM' }, 'PEM', pssKeygenTrace)
    const stages = rsaPssEngine.build({ ...baseCtx({ id: 'rsa_pss', operation: 'generate_keys', result, resultMatches: true, trace: pssKeygenTrace }) })
    expect(stages.map((s) => s.id)).toEqual(['rsa_pss-keygen1', 'rsa_pss-keygen2', 'rsa_pss-keygen3', 'rsa_pss-keygen4'])
    expect(stages.map((s) => s.traceIndex)).toEqual([1, 2, 3, 4])
    const steps = rsaPss3DAdapter.buildSteps({ ...baseCtx({ id: 'rsa_pss', operation: 'generate_keys', result, resultMatches: true, trace: pssKeygenTrace }) })
    expect(steps.length).toBe(4)
    for (let i = 0; i < 4; i++) {
      expect(steps[i].meta?.changedValues?.[0].after).toBe(pssKeygenTrace[i].output)
    }
  })

  it('sign stages are bound 1:1 to the real backend trace steps', () => {
    const result = rawResult({ public_key_pem: 'PEM', signature_hex: SIG, digest_hex: DIGEST, em_hex: EM, em_trailer_checked: true, salt_length_bytes: 222 }, SIG, pssSignTrace)
    const stages = rsaPssEngine.build({ ...baseCtx({ id: 'rsa_pss', operation: 'sign', result, resultMatches: true, trace: pssSignTrace }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(stages.map((s) => s.traceIndex)).toEqual([1, 2, 3])
    const steps = rsaPss3DAdapter.buildSteps({ ...baseCtx({ id: 'rsa_pss', operation: 'sign', result, resultMatches: true, trace: pssSignTrace }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(steps[0].meta?.inputs?.input).toBe(pssSignTrace[0].input)
    expect(steps[1].meta?.changedValues?.[0].after).toBe(pssSignTrace[1].output)
    expect(steps[2].meta?.changedValues?.[0].after).toBe(pssSignTrace[2].output)
    // the 3D scene draws the REAL signature as a value plate
    const signObjs = steps[2].objects
    expect(signObjs.some((o) => o.id === 'pss-s-sig-val' && String(o.label).includes(SIG.slice(0, 12)))).toBe(true)
  })

  it('verify exposes 3 real trace states and a VALID verdict', () => {
    const result = rawResult({ public_key_pem: 'PEM', valid: true, digest_hex: DIGEST, em_hex: EM, em_trailer_checked: true, salt_length_bytes: 222 }, true, pssVerifyTrace)
    const stages = rsaPssEngine.build({ ...baseCtx({ id: 'rsa_pss', operation: 'verify', result, resultMatches: true, trace: pssVerifyTrace }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(stages.map((s) => s.id)).toEqual(['rsa_pss-vhash', 'rsa_pss-vrecover', 'rsa_pss-verify'])
    expect(stages.map((s) => s.traceIndex)).toEqual([1, 2, 3])
    expect(stages[2].view.verdict).toBe('VALID')
    const steps = rsaPss3DAdapter.buildSteps({ ...baseCtx({ id: 'rsa_pss', operation: 'verify', result, resultMatches: true, trace: pssVerifyTrace }), inputs: { message: 'Sign me, RSA-PSS' } })
    expect(steps.length).toBe(3)
    expect(steps[2].objects.some((o) => o.id === 'pss-v-vd-val' && String(o.label).includes('VALID'))).toBe(true)
    expect(steps[1].objects.some((o) => o.id === 'pss-v-em-val' && String(o.label).includes(EM.slice(0, 12)))).toBe(true)
  })

  it('unbound values read "Educational representation", never fake numbers', () => {
    const steps = rsaPss3DAdapter.buildSteps({ ...baseCtx({ id: 'rsa_pss', operation: 'sign' }), inputs: { message: 'Sign me, RSA-PSS' } })
    const encodeObjs = steps[1].objects
    expect(encodeObjs.some((o) => typeof o.label === 'string' && o.label.includes('Educational representation'))).toBe(true)
    // the private exponent slot must never be exposed
    const signObjs = steps[2].objects
    expect(signObjs.some((o) => typeof o.label === 'string' && o.label.includes('never displayed'))).toBe(true)
  })
})

describe('DSA step fidelity', () => {
  it('sign exposes 3 stages; verify exposes 2 with a REAL verdict from trace', () => {
    const signResult = rawResult({ public_key_pem: 'PEM', signature_hex: SIG, digest_hex: DIGEST, r_hex: 'a1', s_hex: 'b2' }, SIG, dsaSignTrace)
    const sign = dsaEngine.build({ ...baseCtx({ id: 'dsa', operation: 'sign', result: signResult, resultMatches: true, trace: dsaSignTrace }), inputs: { message: 'Sign me, DSA' } })
    expect(sign.map((s) => s.traceIndex)).toEqual([1, 2, 3])

    const verifyResult = rawResult({ public_key_pem: 'PEM', valid: true, digest_hex: DIGEST, r: 1, s: 2, r_hex: 'a1', s_hex: 'b2' }, true, dsaVerifyTrace)
    const verify = dsaEngine.build({ ...baseCtx({ id: 'dsa', operation: 'verify', result: verifyResult, resultMatches: true, trace: dsaVerifyTrace }), inputs: { message: 'Sign me, DSA' } })
    expect(verify.map((s) => s.id)).toEqual(['dsa-vhash', 'dsa-verify'])
    expect(verify.map((s) => s.traceIndex)).toEqual([1, 2])
    expect(verify[1].view.verdict).toBe('VALID')
    const steps = dsa3DAdapter.buildSteps({ ...baseCtx({ id: 'dsa', operation: 'verify', result: verifyResult, resultMatches: true, trace: dsaVerifyTrace }), inputs: { message: 'Sign me, DSA' } })
    expect(steps[1].objects.some((o) => o.id === 'dsa-v-vd-val' && String(o.label).includes('VALID'))).toBe(true)
  })

  it('fresh DSA page is 3 stages, keygen is 3 real trace states', () => {
    const steps = dsa3DAdapter.buildSteps({ ...baseCtx({ id: 'dsa', operation: 'sign' }), inputs: { message: 'Sign me, DSA' } })
    expect(steps.length).toBe(3)
    const result = rawResult({ public_key_pem: 'PEM' }, 'PEM', pssKeygenTrace.slice(0, 3).map((s) => ({ ...s })))
    const kg = dsaEngine.build({ ...baseCtx({ id: 'dsa', operation: 'generate_keys', result, resultMatches: true, trace: pssKeygenTrace }) })
    expect(kg.map((s) => s.id)).toEqual(['dsa-keygen1', 'dsa-keygen2', 'dsa-keygen3'])
    expect(kg.map((s) => s.traceIndex)).toEqual([1, 2, 3])
  })
})
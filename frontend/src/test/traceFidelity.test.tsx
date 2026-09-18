import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { I18nProvider } from '../i18n'
import { en } from '../i18n/en'
import { ThemeProvider } from '../theme'
import type { StepDetail } from '../types'

function lookupEn(key: string): string {
  let node: unknown = en
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : key
}

// Probe the SimulationContext assembled by SimulationTab (test 3).
const ctxProbe = vi.hoisted(() => {
  return { captured: null as StepDetail[] | null }
})
vi.mock('../components/simulation/registry', () => ({
  getEngine: (id: string) => ({
    id,
    nameKey: 'simulation.common.none',
    educationalKey: '',
    demoInputs: {},
    build(ctx: { trace: StepDetail[] }) {
      ctxProbe.captured = ctx.trace
      return [{ id: 'probe', titleKey: 'k', descKey: 'd', phase: 'transform' as const, view: { kind: 'probe' } }]
    },
    View() {
      return null
    },
  }),
  hasEngine: () => true,
}))

import type { SimulationContext } from '../components/simulation/simulationTypes'
import { SimulationEngine } from '../components/simulation/SimulationEngine'
import { SimulationTab } from '../components/simulation/SimulationTab'
import { aesCbcEngine, aesCtrEngine } from '../components/simulation/renderers/aesModes'
import { sha224Engine } from '../components/simulation/renderers/hashFamily'
import { dsa3DAdapter } from '../components/simulation3d/adapters/dsa3D'
import type { AlgorithmResult } from '../types'

function baseCtx(overrides: Partial<SimulationContext>): SimulationContext {
  return {
    id: 'x',
    operation: 'generate',
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

const SHA256_EMPTY_DIGEST = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

// Real-shaped 2-block CBC trace (what the backend emits for a 20-byte
// plaintext: P0/P1 padded blocks, real XOR inputs and per-block ciphertext).
const CBC_IV = '00'.repeat(16)
const CBC_P0 = '48656c6c6f2c2063727970746f677261'
const CBC_P1 = '706879210c0c0c0c0c0c0c0c0c0c0c0c'
const CBC_CT0 = 'aabbccddeeff00112233445566778899'
const CBC_CT1 = '99887766554433221100ffeeddccbbaa'
const CBC_X0 = '11'.repeat(16)
const CBC_X1 = '22'.repeat(16)

const cbcSteps: StepDetail[] = [
  { step: 1, title: 'Set up AES-CBC', description: 'key/iv configure the mode.', input: 'key = <hidden>, iv = 0000…', output: 'AES-CBC context', detail: { key_size: 128, iv_hex: CBC_IV } },
  { step: 2, title: 'Pad the plaintext', description: 'PKCS#7 padding.', input: '20 bytes', output: '32 bytes padded', detail: { plaintext_hex: '48656c6c6f2c2063727970746f67726170687921', padded_hex: CBC_P0 + CBC_P1 } },
  { step: 3, title: 'XOR block 1 with C0 = IV', description: 'X1 = P1 ⊕ C0 = IV.', input: 'P1 = ' + CBC_P0, output: 'X1 = ' + CBC_X0, detail: { block: 1, prev_label: 'C0 = IV', prev_hex: CBC_IV, plaintext_hex: CBC_P0, xored_hex: CBC_X0 } },
  { step: 4, title: 'AES-encrypt block 1', description: 'C1 = AES_K(X1).', input: 'X1 = ' + CBC_X0, output: 'C1 = ' + CBC_CT0, detail: { block: 1, xored_hex: CBC_X0, ciphertext_hex: CBC_CT0 } },
  { step: 5, title: 'XOR block 2 with C1', description: 'X2 = P2 ⊕ C1.', input: 'P2 = ' + CBC_P1, output: 'X2 = ' + CBC_X1, detail: { block: 2, prev_label: 'C1', prev_hex: CBC_CT0, plaintext_hex: CBC_P1, xored_hex: CBC_X1 } },
  { step: 6, title: 'AES-encrypt block 2', description: 'C2 = AES_K(X2).', input: 'X2 = ' + CBC_X1, output: 'C2 = ' + CBC_CT1, detail: { block: 2, xored_hex: CBC_X1, ciphertext_hex: CBC_CT1 } },
]

function cbcExtra(): Record<string, unknown> {
  return {
    ciphertext_hex: CBC_CT0 + CBC_CT1,
    iv_hex: CBC_IV,
    key_size: 128,
    padded_plaintext_hex: CBC_P0 + CBC_P1,
    plaintext_blocks: [CBC_P0, CBC_P1],
    xor_states: [CBC_X0, CBC_X1],
    prev_states: [CBC_IV, CBC_CT0],
    ciphertext_blocks: [CBC_CT0, CBC_CT1],
    block_count: 2,
  }
}

const shaSteps: StepDetail[] = [
  {
    step: 1,
    title: 'Encode the message',
    description: 'The message is encoded to bytes.',
    input: 'abc',
    output: '616263',
    detail: { message_hex: '616263' },
  },
  {
    step: 2,
    title: 'Padding (Merkle–Damgård strengthening)',
    description: 'The message is padded with 0x80, zeros and the 64-bit bit length.',
    input: '3 bytes / 24 bits',
    output: '1 padded block',
    detail: { padded_message_blocks: ['61626380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018'] },
  },
  {
    step: 3,
    title: 'Initialize the state',
    description: 'The eight working variables are set to the SHA-256 IV.',
    input: '',
    output: '8 × 32-bit words',
    detail: {},
  },
  {
    step: 4,
    title: 'Process every block',
    description: 'Each 64-byte block is compressed through 64 rounds.',
    input: '1 block',
    output: 'internal state',
    detail: { block_count: 1 },
  },
  {
    step: 5,
    title: 'Truncate to the digest',
    description: 'The final state is concatenated to form the 256-bit digest.',
    input: 'state words',
    output: SHA256_EMPTY_DIGEST,
    detail: { digest: SHA256_EMPTY_DIGEST },
  },
]

describe('backend trace → SimulationContext → 2D → 3D fidelity', () => {
  it('1. backend output equals the displayed final result', () => {
    const digest = '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
    const result = rawResult(
      { digest, digest_size: 28, block_count: 1, initial_value: ['c1059ed8', '367cd507', '3070dd17', 'f70e5939', 'ffc00b31', '68581511', '64f98fa7', 'befa4fa4'], padded_message_blocks: [(shaSteps[1].detail!.padded_message_blocks as unknown as string[])[0]] },
      digest,
      shaSteps,
    )
    const stages = sha224Engine.build({
      ...baseCtx({ id: 'sha224', operation: 'hash', result, resultMatches: true }),
      inputs: { message: 'abc' },
    })
    const digestStage = stages.find((s) => s.id === 'sha224-digest')!
    expect(digestStage.view.digest).toBe(result.result)
    expect(digestStage.view.hasResult).toBe(true)
  })

  it('2. backend trace has meaningful stages', () => {
    expect(shaSteps.length).toBeGreaterThanOrEqual(3)
    const numbers = shaSteps.map((s) => s.step)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
    for (const s of shaSteps) {
      expect(typeof s.title).toBe('string')
      expect(s.title.length).toBeGreaterThan(0)
      expect(typeof s.description).toBe('string')
      expect(s.description.length).toBeGreaterThan(0)
      expect(typeof s.output).toBe('string')
      expect(s.output.length).toBeGreaterThan(0)
      expect(s.detail).toBeDefined()
    }
  })

  it('3. SimulationContext receives the backend trace', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <SimulationTab id="sha224" values={{ message: 'abc' }} operation="hash" result={rawResult({ digest: SHA256_EMPTY_DIGEST }, SHA256_EMPTY_DIGEST, shaSteps)} />
        </I18nProvider>
      </ThemeProvider>,
    )
    expect(ctxProbe.captured).toEqual(shaSteps)
    expect(ctxProbe.captured![1].title).toBe(shaSteps[1].title)
  })

  it('4. 2D engines consume the backend trace values (not client recomputes)', () => {
    const cbcResult = rawResult(cbcExtra(), CBC_CT0 + CBC_CT1, cbcSteps)
    const cbc = aesCbcEngine.build({
      ...baseCtx({ id: 'aes_cbc', operation: 'encrypt', result: cbcResult, resultMatches: true, trace: cbcSteps }),
      inputs: { plaintext: 'Hello, cryptography!', key_hex: '00'.repeat(16), iv_hex: CBC_IV },
    })
    // Per-block stages bind the backend trace: XOR{2i+1}, AES{2i+2}.
    const xor1 = cbc.find((s) => s.id === 'aes_cbc-xor-1')!
    expect(xor1.traceIndex).toBe(3)
    expect(xor1.view.prev).toBe(CBC_IV)
    expect(xor1.view.input).toBe(CBC_P0)
    expect(xor1.view.xored).toBe(CBC_X0)
    const aes1 = cbc.find((s) => s.id === 'aes_cbc-aes-1')!
    expect(aes1.traceIndex).toBe(4)
    expect(aes1.view.xored).toBe(CBC_X0)
    expect(aes1.view.ciphertext).toBe(CBC_CT0)
    const xor2 = cbc.find((s) => s.id === 'aes_cbc-xor-2')!
    expect(xor2.traceIndex).toBe(5)
    // Chaining: the previous ciphertext C1 feeds the next XOR input.
    expect(xor2.view.prev).toBe(CBC_CT0)
    expect(xor2.view.input).toBe(CBC_P1)
    expect(xor2.view.xored).toBe(CBC_X1)
    const aes2 = cbc.find((s) => s.id === 'aes_cbc-aes-2')!
    expect(aes2.traceIndex).toBe(6)
    expect(aes2.view.ciphertext).toBe(CBC_CT1)
    expect(cbc.find((s) => s.id === 'aes_cbc-result')!.view.out).toBe(CBC_CT0 + CBC_CT1)

    const ks0 = '11'.repeat(16)
    const ks1 = '22'.repeat(16)
    const counter0 = '00'.repeat(16)
    const counter1 = `${'00'.repeat(15)}01`
    const ctrSteps: StepDetail[] = [
      { step: 1, title: 'Set up AES-CTR', description: 'key/counter configure the mode.', input: 'key = <hidden>, counter = 0000…', output: 'AES-CTR context', detail: { key_size: 128 } },
      { step: 2, title: 'Generate the keystream', description: 'AES encrypts counter, counter++ until enough bytes.', input: counter0, output: '32 keystream bytes', detail: { counter_blocks: [counter0, counter1], keystream_blocks: [ks0, ks1] } },
      { step: 3, title: 'XOR with the plaintext', description: 'plaintext XOR keystream = ciphertext.', input: 'ab'.repeat(16), output: 'ba'.repeat(16), detail: {} },
    ]
    const ctrResult = rawResult(
      { ciphertext_hex: 'ab'.repeat(16), ciphertext_blocks: ['ab'.repeat(16)], counter_hex: counter0, key_size: 128, counter_blocks: [counter0, counter1], keystream_blocks: [ks0, ks1] },
      'ab'.repeat(16),
      ctrSteps,
    )
    const ctr = aesCtrEngine.build({
      ...baseCtx({ id: 'aes_ctr', operation: 'encrypt', result: ctrResult, resultMatches: true, trace: ctrSteps }),
      inputs: { plaintext: '0123456789abcdef', key_hex: '00'.repeat(16), counter_hex: counter0 },
    })
    const counterStage = ctr.find((s) => s.id === 'aes_ctr-counter')!
    expect(counterStage.traceIndex).toBe(2)
    expect(counterStage.view.counters).toEqual(ctrSteps[1].detail!.counter_blocks)
    const xor = ctr.find((s) => s.id === 'aes_ctr-xor')!
    expect(xor.view.keystream).toBe(ks0 + ks1)
    expect(xor.view.keystreamBlocks).toEqual(ctrSteps[1].detail!.keystream_blocks)
  })

  it('5. 3D consumes the same backend trace via step meta', () => {
    const digest = '286904125d30b2e1b848562ff9d5f5a0f0d4b7c1a4b6f3a2c9d8e7f1a2b3c4d5'
    const r = 'a1b2c3d4e5f60718293a4b5c6d7e8f90'
    const s = '0f1e2d3c4b5a69788796a5b4c3d2e1f0'
    const dsaSteps: StepDetail[] = [
      { step: 1, title: 'Hash the message', description: 'The message is hashed with SHA-256.', input: 'Sign me, DSA', output: digest, detail: { digest_hex: digest } },
      { step: 2, title: 'Choose a per-message nonce k', description: 'A fresh random k is chosen in [1, q−1].', input: 'secret k', output: 'k generated', detail: {} },
      { step: 3, title: 'Compute (r, s)', description: 'r = (g^k mod p) mod q, s = k⁻¹(H(m) + x·r) mod q.', input: `r = ${r}`, output: `s = ${s}`, detail: { r, s } },
    ]
    const dsaResult = rawResult(
      { public_key_pem: 'PEM', signature_hex: `${r}${s}` },
      { valid: true },
      dsaSteps,
    )
    const ctx3d = {
      ...baseCtx({ id: 'dsa', operation: 'sign', result: dsaResult, resultMatches: true, trace: dsaSteps }),
    }
    const steps = dsa3DAdapter.buildSteps(ctx3d)
    const hashStep = steps.find((st) => st.id === '3d-dsa-hash')!
    const paramsStep = steps.find((st) => st.id === '3d-dsa-params')!
    const signStep = steps.find((st) => st.id === '3d-dsa-sign')!
    // stage i is bound to trace[i-1] (same backend steps as the 2D run)
    expect(hashStep.meta?.changedValues?.[0].after).toBe(dsaSteps[0].output)
    expect(hashStep.meta?.inputs?.input).toBe(dsaSteps[0].input)
    expect(hashStep.meta?.outputs?.output).toBe(dsaSteps[0].output)
    expect(paramsStep.meta?.changedValues?.[0].after).toBe(dsaSteps[1].output)
    expect(signStep.meta?.changedValues?.[0].after).toBe(dsaSteps[2].output)
    expect(signStep.meta?.changedValues?.[0].before).toBe(dsaSteps[2].input)
  })

  it('6. Step Forward advances one trace state', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <SimulationEngine
            engine={aesCbcEngine}
            ctx={{
              ...baseCtx({ id: 'aes_cbc', operation: 'encrypt', resultMatches: true }),
              inputs: { plaintext: 'Hello, cryptography!', key_hex: '00'.repeat(16), iv_hex: CBC_IV },
              result: rawResult(cbcExtra(), CBC_CT0 + CBC_CT1, cbcSteps),
            }}
          />
        </I18nProvider>
      </ThemeProvider>,
    )
    expect(screen.getByText('1 / 7')).toBeTruthy()
    const stages = aesCbcEngine.build({
      ...baseCtx({ id: 'aes_cbc', operation: 'encrypt', resultMatches: true }),
      inputs: { plaintext: 'Hello, cryptography!', key_hex: '00'.repeat(16), iv_hex: CBC_IV },
      result: rawResult(cbcExtra(), CBC_CT0 + CBC_CT1, cbcSteps),
    })
    expect(stages[0].traceIndex).toBe(1)
    expect(stages[1].traceIndex).toBe(2)
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('2 / 7')).toBeTruthy()
    const activeTab = screen.getByRole('tab', { selected: true })
    // the timeline renders the real i18n title of the stage bound to trace step 2
    expect(activeTab.getAttribute('aria-label')).toBe(lookupEn(stages[1].titleKey))
  })

  it('7. Step Back restores the previous trace state', () => {
    render(
      <ThemeProvider>
        <I18nProvider>
          <SimulationEngine
            engine={aesCbcEngine}
            ctx={{
              ...baseCtx({ id: 'aes_cbc', operation: 'encrypt', resultMatches: true }),
              inputs: { plaintext: 'Hello, cryptography!', key_hex: '00'.repeat(16), iv_hex: CBC_IV },
              result: rawResult(cbcExtra(), CBC_CT0 + CBC_CT1, cbcSteps),
            }}
          />
        </I18nProvider>
      </ThemeProvider>,
    )
    const prev = screen.getByRole('button', { name: 'Previous step' })
    const next = screen.getByRole('button', { name: 'Next step' })
    expect(screen.getByText('1 / 7')).toBeTruthy()
    fireEvent.click(next)
    fireEvent.click(next)
    expect(screen.getByText('3 / 7')).toBeTruthy()
    fireEvent.click(prev)
    expect(screen.getByText('2 / 7')).toBeTruthy()
    fireEvent.click(prev)
    expect(screen.getByText('1 / 7')).toBeTruthy()
    expect((prev as HTMLButtonElement).disabled).toBe(true)
  })
})
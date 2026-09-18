import { describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen, renderHook } from '@testing-library/react'
import { useRef, useMemo } from 'react'
import { aesCbcEngine } from '../components/simulation/renderers/aesModes'
import { aesCbc3DAdapter } from '../components/simulation3d/adapters/aesCbc3D'
import { Simulation3DStepPanel } from '../components/simulation3d/Simulation3DStepPanel'
import { useAnimationPlayback } from '../components/simulation3d/hooks/useAnimationPlayback'
import { en } from '../i18n/en'
import type { SimulationContext } from '../components/simulation/simulationTypes'
import type { Simulation3DCanvasHandle, Simulation3DStep } from '../components/simulation3d/types/simulation3d'
import type { StepDetail, AlgorithmResult } from '../types'

const IV = '00'.repeat(16)
const P0 = '48656c6c6f2c2063727970746f677261'
const P1 = '706879210c0c0c0c0c0c0c0c0c0c0c0c'
const CT0 = 'aabbccddeeff00112233445566778899'
const CT1 = '99887766554433221100ffeeddccbbaa'
const X0 = '11'.repeat(16)
const X1 = '22'.repeat(16)

// Alternative extra payloads (a different scenario, still consistent) used to
// prove nothing is hardcoded or randomly generated.
const CT0B = '0f'.repeat(16)
const CT1B = 'e0'.repeat(16)
const P1B = 'be'.repeat(16)
const X1B = 'cd'.repeat(16)

const encSteps: StepDetail[] = [
  { step: 1, title: 'Set up AES-CBC', description: 'key/iv configure the mode.', input: 'key = <hidden>, iv = 0000…', output: 'AES-CBC context', detail: { key_size: 128, iv_hex: IV } },
  { step: 2, title: 'Pad the plaintext', description: 'PKCS#7 padding.', input: '20 bytes', output: '32 bytes padded', detail: { plaintext_hex: '48656c6c6f2c2063727970746f67726170687921', padded_hex: P0 + P1 } },
  { step: 3, title: 'XOR block 1 with C0 = IV', description: 'X1 = P1 ⊕ C0 = IV.', input: 'P1 = ' + P0, output: 'X1 = ' + X0, detail: { block: 1, prev_label: 'C0 = IV', prev_hex: IV, plaintext_hex: P0, xored_hex: X0 } },
  { step: 4, title: 'AES-encrypt block 1', description: 'C1 = AES_K(X1).', input: 'X1 = ' + X0, output: 'C1 = ' + CT0, detail: { block: 1, xored_hex: X0, ciphertext_hex: CT0 } },
  { step: 5, title: 'XOR block 2 with C1', description: 'X2 = P2 ⊕ C1.', input: 'P2 = ' + P1, output: 'X2 = ' + X1, detail: { block: 2, prev_label: 'C1', prev_hex: CT0, plaintext_hex: P1, xored_hex: X1 } },
  { step: 6, title: 'AES-encrypt block 2', description: 'C2 = AES_K(X2).', input: 'X2 = ' + X1, output: 'C2 = ' + CT1, detail: { block: 2, xored_hex: X1, ciphertext_hex: CT1 } },
]

function encExtra(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ciphertext_hex: CT0 + CT1,
    iv_hex: IV,
    key_size: 128,
    padded_plaintext_hex: P0 + P1,
    plaintext_blocks: [P0, P1],
    xor_states: [X0, X1],
    prev_states: [IV, CT0],
    ciphertext_blocks: [CT0, CT1],
    block_count: 2,
    ...overrides,
  }
}

function baseCtx(overrides: Partial<SimulationContext>): SimulationContext {
  return {
    id: 'aes_cbc',
    operation: 'encrypt',
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

function curatedCtx(extra: Record<string, unknown> = encExtra(), op = 'encrypt'): SimulationContext {
  const steps = op === 'decrypt' ? [] : encSteps
  return {
    ...baseCtx({ id: 'aes_cbc', operation: op, result: rawResult(extra, extra.ciphertext_hex, steps), resultMatches: true, trace: steps }),
    inputs: { plaintext: 'Hello, cryptography!', key_hex: '00'.repeat(16), iv_hex: IV },
  }
}

function findStep(steps: Simulation3DStep[], id: string): Simulation3DStep {
  const st = steps.find((s) => s.id === `3d-${id}`)
  if (!st) throw new Error(`missing 3D step ${id}`)
  return st
}

function objectById(st: Simulation3DStep, id: string) {
  return st.objects.find((o) => o.id === id)
}

function hashObjects(st: Simulation3DStep): string {
  return JSON.stringify(st.objects)
}

function enLookup(key: string): string {
  let node: unknown = en
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : key
}

describe('AES-CBC 3D educational depth (backend-trace per-block fidelity)', () => {
  it('real trace reaches SimulationContext and binds C1/C2 via the 3D steps', () => {
    const ctx = curatedCtx()
    const steps = aesCbc3DAdapter.buildSteps(ctx)
    // The 3D adapter consumes the SAME SimulationContext (incl. its real
    // trace-derived extra) — never computes crypto itself.
    const aes1 = findStep(steps, 'aes_cbc-aes-1')
    // Backend trace step 4 is "AES-encrypt block 1" → its ciphertext is C1.
    expect(aes1.meta?.outputs?.C1).toBe((encSteps[3].detail as Record<string, unknown>).ciphertext_hex)
    const aes2 = findStep(steps, 'aes_cbc-aes-2')
    expect(aes2.meta?.outputs?.C2).toBe((encSteps[5].detail as Record<string, unknown>).ciphertext_hex)
    expect(aes1.meta?.source).toBe('backend')
  })

  it('P1, P2 and the IV (C0) map to the per-block XOR inputs', () => {
    const steps = aesCbc3DAdapter.buildSteps(curatedCtx())
    const xor1 = findStep(steps, 'aes_cbc-xor-1')
    expect(xor1.meta?.inputs?.P1).toBe(P0)
    expect(xor1.meta?.inputs?.['C0 = IV']).toBe(IV)
    const xor2 = findStep(steps, 'aes_cbc-xor-2')
    expect(xor2.meta?.inputs?.P2).toBe(P1)
    // Chaining: block 2 is XORed with the previous ciphertext C1.
    expect(xor2.meta?.inputs?.C1).toBe(CT0)
  })

  it('XOR input + XOR output + AES input are the real trace values', () => {
    const steps = aesCbc3DAdapter.buildSteps(curatedCtx())
    const xor1 = findStep(steps, 'aes_cbc-xor-1')
    // XOR output == AES input: X1 = P1 ⊕ C0 = IV (from trace step 3).
    expect(xor1.meta?.changedValues?.[0].after).toBe(X0)
    expect(xor1.meta?.outputs?.X1).toBe(X0)
    expect(findStep(steps, 'aes_cbc-xor-2').meta?.outputs?.X2).toBe(X1)
    const aes1 = findStep(steps, 'aes_cbc-aes-1')
    expect(aes1.meta?.inputs?.['X1']).toBe(X0)
    expect(aes1.meta?.changedValues?.[0].after).toBe(CT0)
    expect(findStep(steps, 'aes_cbc-aes-2').meta?.changedValues?.[0].after).toBe(CT1)
  })

  it('2D stages and 3D steps are one-to-one with the same state per block', () => {
    const ctx = curatedCtx()
    const stages = aesCbcEngine.build(ctx)
    const steps = aesCbc3DAdapter.buildSteps(ctx)
    expect(stages.map((s) => s.id)).toEqual([
      'aes_cbc-input',
      'aes_cbc-padding',
      'aes_cbc-xor-1',
      'aes_cbc-aes-1',
      'aes_cbc-xor-2',
      'aes_cbc-aes-2',
      'aes_cbc-result',
    ])
    expect(steps.length).toBe(stages.length)
    steps.forEach((st, i) => expect(st.id).toBe(`3d-${stages[i].id}`))
    const xor1 = findStep(steps, 'aes_cbc-xor-1')
    expect(xor1.meta?.inputs?.P1).toBe(stages.find((s) => s.id === 'aes_cbc-xor-1')!.view.input)
    const aes1 = findStep(steps, 'aes_cbc-aes-1')
    expect(aes1.meta?.outputs?.C1).toBe(stages.find((s) => s.id === 'aes_cbc-aes-1')!.view.ciphertext)
  })

  it('block index (i / n) is staged per block and the current block is tagged', () => {
    const steps = aesCbc3DAdapter.buildSteps(curatedCtx())
    for (const [stId, i, n, gate] of [
      ['aes_cbc-xor-1', 1, 2, 'blk-1-xor'],
      ['aes_cbc-aes-1', 1, 2, 'blk-1-aes'],
      ['aes_cbc-xor-2', 2, 2, 'blk-2-xor'],
      ['aes_cbc-aes-2', 2, 2, 'blk-2-aes'],
    ] as const) {
      const st = findStep(steps, stId)
      expect(st.meta?.inputs).toBeDefined()
      expect(st.meta?.highlightedEntities).toContain(gate)
      const cur = objectById(st, `blk-${i}-cur`)
      expect(cur).toBeTruthy()
      expect(cur!.kind).toBe('box')
      const glyph = objectById(st, `blk-${i}-cur-glyph`)
      expect(glyph?.label).toBe(`Block ${i} / ${n}`)
    }
  })

  it('the chain is visually wired: previous C plate has an arrow into the next XOR', () => {
    const steps = aesCbc3DAdapter.buildSteps(curatedCtx())
    const xor2 = findStep(steps, 'aes_cbc-xor-2')
    const chain = xor2.objects.find((o) => o.id === 'blk-2-chain')
    expect(chain?.kind).toBe('arrow')
    // The arrow must leave the previous column's C plate world position and
    // terminate on the LEFT side of block 2's XOR gate.
    const prevCx = xor2.objects.filter((o) => o.id === 'blk-1-cv' || o.id === 'blk-1-cv-val').map((o) => o.position[0])
    expect(prevCx.length).toBeGreaterThan(0)
    expect(chain!.from![0]).toBeLessThan(chain!.to![0])
    expect(chain!.from![1]).toBeCloseTo(-1.2, 0) // encrypt C row y
    expect(chain!.to![1]).toBeCloseTo(1.45, 0) // encrypt XOR row y
    // The XOR gate box id matches the highlighted entity in the meta.
    expect(xor2.meta?.highlightedEntities).toContain('blk-2-xor')
  })

  it('Step Forward / Step Back / Restart drive the 3D playback timeline', async () => {
    const ctx = curatedCtx()
    const steps = aesCbc3DAdapter.buildSteps(ctx)
    const ref = { current: null as Simulation3DCanvasHandle | null }
    const { result } = renderHook(() => {
      const sts = useMemo(() => aesCbc3DAdapter.buildSteps(curatedCtx()), [])
      const canvasRef = useRef<Simulation3DCanvasHandle>({
        apply: async () => {},
        resetCamera: () => {},
        focusAt: () => {},
        toggleFullscreen: () => {},
      } as Simulation3DCanvasHandle)
      ref.current = canvasRef.current
      return useAnimationPlayback(sts, canvasRef)
    })
    expect(result.current.step).toBe(0)
    expect(steps.length).toBeGreaterThan(0)
    await act(async () => result.current.next())
    expect(result.current.step).toBe(1)
    await act(async () => result.current.goto(5))
    expect(result.current.step).toBe(5)
    await act(async () => result.current.prev())
    expect(result.current.step).toBe(4)
    await act(async () => result.current.restart())
    expect(result.current.step).toBe(0)
    expect(result.current.atStart).toBe(true)
  })

  it('3D reads every value from the SimulationContext extra, never hardcoded', () => {
    const ctxA = curatedCtx()
    const ctxB = curatedCtx(
      encExtra({
        ciphertext_hex: CT0B + CT1B,
        plaintext_blocks: [P0, P1B],
        xor_states: [X0, X1B],
        prev_states: [IV, CT0B],
        ciphertext_blocks: [CT0B, CT1B],
      }),
    )
    const stepsA = aesCbc3DAdapter.buildSteps(ctxA)
    const stepsB = aesCbc3DAdapter.buildSteps(ctxB)
    expect(findStep(stepsA, 'aes_cbc-aes-1').meta?.outputs?.C1).toBe(CT0)
    expect(findStep(stepsB, 'aes_cbc-aes-1').meta?.outputs?.C1).toBe(CT0B)
    expect(findStep(stepsA, 'aes_cbc-aes-2').meta?.outputs?.C2).toBe(CT1)
    expect(findStep(stepsB, 'aes_cbc-aes-2').meta?.outputs?.C2).toBe(CT1B)
    expect(findStep(stepsB, 'aes_cbc-xor-1').meta?.inputs?.P1).toBe(P0)
    expect(findStep(stepsB, 'aes_cbc-xor-2').meta?.inputs?.P2).toBe(P1B)
    // Deterministic: identical contexts produce identical scenes.
    const again = aesCbc3DAdapter.buildSteps(curatedCtx())
    expect(again.map(hashObjects)).toEqual(stepsA.map(hashObjects))
  })

  it('decrypt mode binds Cᵢ → AES⁻¹ → Mᵢ → ⊕ prev → Pᵢ per block (2N+2 states)', () => {
    const M0 = 'ab' + 'cd'.repeat(15)
    const M1 = 'ef' + '12'.repeat(15)
    const decSteps: StepDetail[] = [
      { step: 1, title: 'Set up AES-CBC (decrypt)', description: 'reverse mode.', input: 'key = <hidden>', output: 'AES-CBC context', detail: { key_size: 128, iv_hex: IV } },
      { step: 2, title: 'AES-decrypt block 1', description: 'M1 = AES⁻¹_K(C1).', input: 'C1', output: 'M1', detail: { block: 1, ciphertext_hex: CT0, decrypted_hex: M0 } },
      { step: 3, title: 'XOR to recover block 1', description: 'P1 = M1 ⊕ C0 = IV.', input: 'M1', output: 'P1', detail: { block: 1, prev_label: 'C0 = IV', prev_hex: IV, decrypted_hex: M0, plaintext_hex: P0 } },
      { step: 4, title: 'AES-decrypt block 2', description: 'M2 = AES⁻¹_K(C2).', input: 'C2', output: 'M2', detail: { block: 2, ciphertext_hex: CT1, decrypted_hex: M1 } },
      { step: 5, title: 'XOR to recover block 2', description: 'P2 = M2 ⊕ C1.', input: 'M2', output: 'P2', detail: { block: 2, prev_label: 'C1', prev_hex: CT0, decrypted_hex: M1, plaintext_hex: P1 } },
      { step: 6, title: 'Remove PKCS#7 padding', description: 'strip padding.', input: '32 bytes padded', output: '20 bytes plaintext', detail: { block_count: 2, padded_hex: P0 + P1, plaintext_hex: 'Hello' } },
    ]
    const extra = {
      plaintext: 'Hello, cryptography!',
      plaintext_hex: P0 + P1,
      ciphertext_blocks: [CT0, CT1],
      padded_plaintext_blocks: [P0, P1],
      xor_states: [M0, M1],
      prev_states: [IV, CT0],
      block_count: 2,
    }
    const ctx = {
      ...baseCtx({ id: 'aes_cbc', operation: 'decrypt', result: rawResult(extra, '', decSteps), resultMatches: true, trace: decSteps }),
      inputs: { ciphertext_hex: CT0 + CT1, key_hex: '00'.repeat(16), iv_hex: IV },
    }
    const steps = aesCbc3DAdapter.buildSteps(ctx)
    const dec1 = findStep(steps, 'aes_cbc-dec-1')
    expect(dec1.meta?.inputs?.['C1']).toBe(CT0)
    expect(dec1.meta?.outputs?.M1).toBe(M0)
    const xorD1 = findStep(steps, 'aes_cbc-xorD-1')
    expect(xorD1.meta?.inputs?.['C0 = IV']).toBe(IV)
    expect(xorD1.meta?.outputs?.P1).toBe(P0)
    const xorD2 = findStep(steps, 'aes_cbc-xorD-2')
    expect(xorD2.meta?.inputs?.C1).toBe(CT0)
    expect(xorD2.meta?.outputs?.P2).toBe(P1)
    expect(findStep(steps, 'aes_cbc-unpad').meta?.event).toBe('PADDING_REMOVED')
  })

  it('missing trace is handled honestly: placeholders, source=educational, no invented ciphertext', () => {
    const ctx = baseCtx({ operation: 'encrypt' })
    ctx.inputs = { plaintext: 'Hello, cryptography!', key_hex: '73' + '00'.repeat(15), iv_hex: IV }
    const stages = aesCbcEngine.build(ctx)
    expect(stages.every((s) => !s.view.hasResult)).toBe(true)
    const steps = aesCbc3DAdapter.buildSteps(ctx)
    for (const st of steps) {
      expect(st.meta?.source).toBe('educational')
    }
    // Derived-value steps must not fabricate intermediate values. The input
    // step still shows what the USER typed (plaintext + IV) — that is real.
    for (const st of steps.filter((s) => !s.id.includes('aes_cbc-input'))) {
      for (const v of Object.values(st.meta?.inputs ?? {})) expect(v.length).toBeLessThan(2) // empty or '·'
      for (const v of Object.values(st.meta?.outputs ?? {})) expect(v.length).toBeLessThan(2)
    }
    // Placeholder plates are muted ('·' is the honest "not yet computed" byte).
    const xor1 = findStep(steps, 'aes_cbc-xor-1')
    const val = xor1.objects.find((o) => o.id === 'blk-1-p-val')
    expect(val?.label).toBe('·')
    expect(val?.tone).toBe('muted')
    // The 2D lab note explains the educational representation.
    const stage = stages.find((s) => s.id === 'aes_cbc-xor-1')!
    expect(String(stage.view.kind)).toBe('aes_cbc-xor')
  })

  it('the Step Inspector renders provenance + real values with expand/copy', () => {
    const ctx = curatedCtx()
    const steps = aesCbc3DAdapter.buildSteps(curatedCtx())
    const panelCtx: SimulationContext = { ...ctx, t: enLookup, language: 'en', dir: 'ltr' }
    render(<Simulation3DStepPanel steps={steps} step={steps.findIndex((s) => s.id === '3d-aes_cbc-aes-1')} ctx={panelCtx} />)
    // Badge: this is a REAL backend value, not an educational placeholder.
    expect(screen.getByText('Real backend value')).toBeTruthy()
    // Title tokens {i} are interpolated, formula surface is translated.
    expect(screen.getByText('AES-encrypt block 1')).toBeTruthy()
    expect(screen.getAllByText(CT0).length).toBeGreaterThan(0) // real C1 in outputs
    expect(screen.getAllByText(X0).length).toBeGreaterThan(0) // real X1 input
    // Expand toggles, copy never fabricates values (silent when clipboard is missing).
    const expand = screen.getAllByLabelText(`expand ${CT0}`)[0]
    expect(expand.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(expand)
    expect(expand.getAttribute('aria-expanded')).toBe('true')
    const copy = screen.getAllByLabelText(`Copy value: ${CT0}`)[0]
    expect(copy.textContent).toBe('⧉')
    fireEvent.click(copy)
  })
})
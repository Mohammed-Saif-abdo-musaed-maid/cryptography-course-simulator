import { describe, expect, it } from 'vitest'
import { sha224Engine, sha384Engine, ripemd160Engine } from '../components/simulation/renderers/hashFamily'
import { aesCbcEngine, aesCtrEngine } from '../components/simulation/renderers/aesModes'
import { aesCcmEngine } from '../components/simulation/renderers/aesCcm'
import { camelliaEngine } from '../components/simulation/renderers/camellia'
import { cmacEngine } from '../components/simulation/renderers/cmac'
import { poly1305Engine } from '../components/simulation/renderers/poly1305'
import { x448Engine } from '../components/simulation/renderers/x448'
import { dsaEngine } from '../components/simulation/renderers/dsa'
import { rsaPssEngine } from '../components/simulation/renderers/rsaPss'
import type { SimulationContext } from '../components/simulation/simulationTypes'
import type { AlgorithmResult } from '../types'

function ctx(overrides: Partial<SimulationContext>): SimulationContext {
  return {
    id: 'x',
    operation: 'generate',
    inputs: {},
    demo: true,
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

const rawResult = (extra: Record<string, unknown>, result: unknown = ''): AlgorithmResult =>
  ({ result, extra } as unknown as AlgorithmResult)

describe('phase5 simulation engines smoke', () => {
  it('hash family binds real digests from backend extras', () => {
    const base = ctx({ id: 'sha224', operation: 'hash', resultMatches: true })
    const sha224Stages = sha224Engine.build({
      ...base,
      inputs: { message: 'abc' },
      result: rawResult({ digest: '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7', digest_size: 28, block_count: 1, initial_value: ['c1059ed8', '367cd507', '3070dd17', 'f70e5939', 'ffc00b31', '68581511', '64f98fa7', 'befa4fa4'] }),
    })
    expect(sha224Stages.map((s) => s.id)).toEqual(['sha224-input', 'sha224-padding', 'sha224-rounds', 'sha224-digest'])
    const digestStage = sha224Stages[3]
    expect(digestStage.view.digest).toBe('23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7')

    const sha384 = sha384Engine.build({
      ...base,
      id: 'sha384',
      inputs: { message: 'abc' },
      result: rawResult({ digest: 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7', initial_value: [] }),
    })
    expect(sha384[3].view.digest).toContain('cb00753f45a35e8b')

    const rmd = ripemd160Engine.build({
      ...base,
      id: 'ripemd160',
      inputs: { message: 'abc' },
      result: rawResult({ digest: '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc', initial_value: ['67452301', 'efcdab89', '98badcfe', '10325476', 'c3d2e1f0'] }),
    })
    expect(rmd.map((s) => s.id)).toContain('ripemd160-rounds')
    expect(rmd[3].view.digest).toContain('8eb208f7')
  })

  it('aes_cbc and aes_ctr bind real outputs', () => {
    const base = ctx({ operation: 'encrypt', resultMatches: true })
    const ct0 = '55'.repeat(16)
    const ct1 = '66'.repeat(16)
    const p0 = '11'.repeat(16)
    const p1 = '22'.repeat(16)
    const x0 = '33'.repeat(16)
    const x1 = '44'.repeat(16)
    const cbc = aesCbcEngine.build({
      ...base,
      inputs: { plaintext: 'Hello, cryptography!', key_hex: '000102030405060708090a0b0c0d0e0f', iv_hex: '00'.repeat(16) },
      result: rawResult({
        ciphertext_hex: ct0 + ct1,
        ciphertext_blocks: [ct0, ct1],
        plaintext_blocks: [p0, p1],
        xor_states: [x0, x1],
        prev_states: ['00'.repeat(16), ct0],
        padded_plaintext_hex: p0 + p1,
        key_size: 128,
        iv_hex: '00'.repeat(16),
        block_count: 2,
      }),
    })
    expect(cbc.map((s) => s.id)).toEqual(['aes_cbc-input', 'aes_cbc-padding', 'aes_cbc-xor-1', 'aes_cbc-aes-1', 'aes_cbc-xor-2', 'aes_cbc-aes-2', 'aes_cbc-result'])
    expect(cbc[6].view.hasResult).toBe(true)
    const xor1 = cbc.find((s) => s.id === 'aes_cbc-xor-1')!
    expect(xor1.traceIndex).toBe(3)
    expect(xor1.view.prev).toBe('00'.repeat(16))
    expect(xor1.view.input).toBe(p0)
    expect(xor1.view.xored).toBe(x0)
    const aes1 = cbc.find((s) => s.id === 'aes_cbc-aes-1')!
    expect(aes1.traceIndex).toBe(4)
    expect(aes1.view.ciphertext).toBe(ct0)
    const xor2 = cbc.find((s) => s.id === 'aes_cbc-xor-2')!
    expect(xor2.traceIndex).toBe(5)
    expect(xor2.view.prev).toBe(ct0)
    expect(cbc.find((s) => s.id === 'aes_cbc-result')!.view.out).toBe(ct0 + ct1)

    const ctr = aesCtrEngine.build({
      ...base,
      inputs: { plaintext: 'abc', key_hex: '00'.repeat(16), counter_hex: '00'.repeat(16) },
      result: rawResult({ ciphertext_hex: '77'.repeat(16), key_size: 128 }),
    })
    const xor = ctr.find((s) => s.id === 'aes_ctr-xor')
    expect(xor).toBeDefined()
    expect(xor!.view.keystream).toContain('77')
  })

  it('aes_ccm passes tag and auth verdict', () => {
    const stages = aesCcmEngine.build({
      ...ctx({ operation: 'decrypt', resultMatches: true }),
      inputs: { ciphertext_hex: 'aabb'.repeat(8), key_hex: '00'.repeat(16), nonce_hex: '00'.repeat(12), aad: '' },
      result: rawResult({ ciphertext_hex: 'aabb'.repeat(8), tag_hex: 'ccdd'.repeat(8), aad_hex: '', key_size: 128, tag_length: 16, authentication: 'PASS' }, 'decrypted'),
    })
    expect(stages.map((s) => s.id)).toContain('aes_ccm-result')
    expect(stages[3].view.authFail).toBe(false)
    expect(stages[1].view.tag).toContain('ccdd')
  })

  it('camellia, cmac, poly1305 and x448 bind outputs', () => {
    const base = ctx({ resultMatches: true })
    const cam = camelliaEngine.build({
      ...base,
      operation: 'encrypt',
      inputs: { block_hex: '01'.repeat(16), key_hex: '00'.repeat(16) },
      result: rawResult({ ciphertext_block: 'ef'.repeat(16), key_size: 128, rounds: 18 }),
    })
    expect(cam[3].view.out).toBe('ef'.repeat(16))

    const cmac = cmacEngine.build({
      ...base,
      operation: 'mac',
      inputs: { message: 'abc', key_hex: '00'.repeat(16) },
      result: rawResult({ mac_hex: 'aa'.repeat(16), key_size: 128, mac_size: 16 }),
    })
    expect(cmac[3].view.mac).toBe('aa'.repeat(16))

    const pol = poly1305Engine.build({
      ...base,
      operation: 'mac',
      inputs: { message: 'abc', key_hex: '85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b' },
      result: rawResult({ mac_hex: 'bb'.repeat(16), r_hex: 'aa'.repeat(16), s_hex: 'bb'.repeat(16) }),
    })
    expect(pol[3].view.mac).toBe('bb'.repeat(16))

    const x = x448Engine.build({
      ...base,
      operation: 'generate_keys',
      result: rawResult({
        alice: { private_hex: 'a'.repeat(112), public_hex: 'b'.repeat(112) },
        bob: { private_hex: 'c'.repeat(112), public_hex: 'd'.repeat(112) },
        shared_secret_hex: 'e'.repeat(112),
      }),
    })
    expect(x.map((s) => s.id)).toEqual(['x448-curve', 'x448-keys', 'x448-ladder', 'x448-shared'])
    expect(x[3].view.hasResult).toBe(true)
  })

  it('dsa and rsa_pss expose verdicts', () => {
    const dsaVerify = dsaEngine.build({
      ...ctx({ operation: 'verify', resultMatches: true }),
      inputs: { message: 'hi', hash_algorithm: 'sha256', key_size: 2048, private_key_pem: '' },
      result: rawResult({ public_key_pem: 'PEM', signature_hex: 'ab'.repeat(40) }, true),
    })
    expect(dsaVerify.map((s) => s.id)).toContain('dsa-verify')
    const dsaVerdict = dsaVerify.find((s) => s.id === 'dsa-verify')
    expect(dsaVerdict!.view.verdict).toBe('VALID')

    const pss = rsaPssEngine.build({
      ...ctx({ operation: 'verify', resultMatches: true }),
      inputs: { message: 'hi', hash_algorithm: 'sha256', key_size: 2048, private_key_pem: '' },
      result: rawResult({ public_key_pem: 'PEM', signature_hex: 'cd'.repeat(40) }, false),
    })
    expect(pss.find((s) => s.id === 'rsa_pss-verify')!.view.verdict).toBe('INVALID')
    expect(dsaEngine.build({
      ...ctx({ operation: 'generate_keys' }),
      result: rawResult({ public_key_pem: 'PEM' }),
    }).map((s) => s.id)).toEqual(['dsa-keygen1', 'dsa-keygen2', 'dsa-keygen3'])
  })
})
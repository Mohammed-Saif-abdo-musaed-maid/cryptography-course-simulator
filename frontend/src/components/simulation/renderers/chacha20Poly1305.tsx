import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'chacha20_poly1305'

const hexStrOf9 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

export const chacha20Poly1305Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.chacha20_poly1305.name',
  educationalKey: 'simulation.chacha20_poly1305.educational',
  demoInputs: {
    plaintext: 'Hello, cryptography!',
    ciphertext_hex: '',
    key_hex: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    nonce_hex: '000000000000000000000000',
    aad: '',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const plaintext = String(ctx.inputs.plaintext ?? '')
    const ciphertextHex = String(ctx.inputs.ciphertext_hex ?? '').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key_hex ?? '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F').replace(/\s/g, '')
    const nonceHex = String(ctx.inputs.nonce_hex ?? '000000000000000000000000').replace(/\s/g, '')
    const aad = String(ctx.inputs.aad ?? '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    const ciphertextHexB = hasResult ? (hexStrOf9(extra?.ciphertext_hex) ?? '') : ''
    const tagHex = hasResult ? (hexStrOf9(extra?.tag_hex) ?? '') : ''
    const aadHex = hasResult ? (hexStrOf9(extra?.aad_hex) ?? '') : ''
    const nonceHexB = hasResult ? (hexStrOf9(extra?.nonce_hex) ?? nonceHex) : nonceHex
    const plaintextHexB = hasResult ? (hexStrOf9(extra?.plaintext_hex) ?? '') : ''
    const auth = hasResult ? (hexStrOf9(extra?.authentication) ?? '') : ''
    const combinedHex = hasResult ? (hexStrOf9(extra?.combined_hex) ?? '') : ''
    const resultOut = hasResult && typeof ctx.result?.result === 'string' ? ctx.result.result : combinedHex

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.chacha20_poly1305.input.title',
        descKey: 'simulation.chacha20_poly1305.input.desc',
        phase: 'input',
        view: { kind: 'cp-input', plaintext, ciphertext: ciphertextHex, key: keyHex, nonce: nonceHex, aad, decrypt },
      },
      {
        id: `${id}-stream`,
        titleKey: decrypt ? 'simulation.chacha20_poly1305.stream.dTitle' : 'simulation.chacha20_poly1305.stream.title',
        descKey: decrypt ? 'simulation.chacha20_poly1305.stream.dDesc' : 'simulation.chacha20_poly1305.stream.desc',
        phase: 'transform',
        view: { kind: 'cp-stream', ct: ciphertextHexB, pt: plaintextHexB, decrypt },
      },
      {
        id: `${id}-mackey`,
        titleKey: 'simulation.chacha20_poly1305.mackey.title',
        descKey: 'simulation.chacha20_poly1305.mackey.desc',
        phase: 'key',
        view: { kind: 'cp-mackey', nonce: nonceHexB },
      },
      {
        id: `${id}-poly`,
        titleKey: 'simulation.chacha20_poly1305.poly.title',
        descKey: 'simulation.chacha20_poly1305.poly.desc',
        phase: 'transform',
        view: { kind: 'cp-poly', aadHex, aad, tagHex, hasAad: hasResult ? (aad !== '' || aadHex !== '') : aad !== '' },
      },
      {
        id: `${id}-verify`,
        titleKey: decrypt ? 'simulation.chacha20_poly1305.verify.title' : 'simulation.chacha20_poly1305.verify.dTitle',
        descKey: 'simulation.chacha20_poly1305.verify.desc',
        phase: 'internal',
        view: { kind: 'cp-verify', auth, decrypt, tagHex },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.chacha20_poly1305.result.dTitle' : 'simulation.chacha20_poly1305.result.title',
        descKey: 'simulation.chacha20_poly1305.result.desc',
        phase: 'output',
        view: { kind: 'cp-result', out: resultOut, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'cp-input':
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'ciphertext (hex, incl. tag)' : 'plaintext'}
              value={(view.decrypt ? hexStrOf9(view.ciphertext) : hexStrOf9(view.plaintext)) ?? ''}
              tone="input"
            />
            <DataBlock label="key" value={hexStrOf9(view.key) ?? ''} tone="key" big />
            <DataBlock label="nonce" value={hexStrOf9(view.nonce) ?? ''} tone="key" />
            <DataBlock label="AAD" value={hexStrOf9(view.aad) ?? ''} tone="internal" />
          </div>
        )
      case 'cp-stream':
        return (
          <div className="lab-stage-view">
            <FlowArrow op={view.decrypt ? 'ChaCha20 decrypt' : 'ChaCha20 encrypt'} />
            {view.decrypt ? (
              <DataBlock label="plaintext (hex)" value={hexStrOf9(view.pt) ?? ''} tone="output" big />
            ) : (
              <DataBlock label="ciphertext (hex)" value={hexStrOf9(view.ct) ?? ''} tone="output" big />
            )}
            <DataBlock label="keystream" value="ChaCha20(key, nonce, counter=1) XOR data" tone="muted" />
          </div>
        )
      case 'cp-mackey':
        return (
          <div className="lab-stage-view">
            <FlowArrow op="Poly1305 key = ChaCha20 block 0 (first 32 bytes)" />
            <DataBlock label="nonce" value={hexStrOf9(view.nonce) ?? ''} tone="key" />
            <DataBlock label="one-time key" value="r, s from keystream block 0" tone="internal" />
          </div>
        )
      case 'cp-poly': {
        const aadH = hexStrOf9(view.aadHex) ?? ''
        const tagH = hexStrOf9(view.tagHex) ?? ''
        return (
          <div className="lab-stage-view">
            <FlowArrow op="Poly1305(r, s, AAD ‖ ciphertext ‖ len)" />
            <DataBlock label="AAD (hex)" value={view.hasAad ? aadH : '—'} tone="internal" />
            <DataBlock label="tag" value={tagH} tone="output" big />
          </div>
        )
      }
      case 'cp-verify':
        return (
          <div className="lab-stage-view">
            {view.decrypt ? (
              <DataBlock label="authentication" value={hexStrOf9(view.auth) === 'PASS' ? 'PASS' : 'verify tag before returning plaintext'} tone={hexStrOf9(view.auth) === 'PASS' ? 'output' : 'muted'} big />
            ) : (
              <DataBlock label="tag" value={`${hexStrOf9(view.tagHex) ?? ''}`} tone="output" />
            )}
          </div>
        )
      case 'cp-result':
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'plaintext' : 'ciphertext ‖ tag'}
              value={hexStrOf9(view.out) ?? ''}
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
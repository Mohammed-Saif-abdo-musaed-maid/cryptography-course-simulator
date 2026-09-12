import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'aes_gcm'

const hexStrOf8 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

export const aesGcmEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.aes_gcm.name',
  educationalKey: 'simulation.aes_gcm.educational',
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

    const ciphertextHexB = hasResult ? (hexStrOf8(extra?.ciphertext_hex) ?? '') : ''
    const tagHex = hasResult ? (hexStrOf8(extra?.tag_hex) ?? '') : ''
    const aadHex = hasResult ? (hexStrOf8(extra?.aad_hex) ?? '') : ''
    const nonceHexB = hasResult ? (hexStrOf8(extra?.nonce_hex) ?? nonceHex) : nonceHex
    const keySize = (hasResult && typeof extra?.key_size === 'number' ? extra.key_size : (keyHex.length / 2) * 8)
    const plaintextHexB = hasResult ? (hexStrOf8(extra?.plaintext_hex) ?? '') : ''
    const auth = hasResult ? (hexStrOf8(extra?.authentication) ?? '') : ''
    const combinedHex = hasResult ? (hexStrOf8(extra?.combined_hex) ?? '') : ''
    const resultOut = hasResult && typeof ctx.result?.result === 'string' ? ctx.result.result : combinedHex

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.aes_gcm.input.title',
        descKey: 'simulation.aes_gcm.input.desc',
        descArgs: { bits: keySize },
        phase: 'input',
        view: { kind: 'agcm-input', plaintext, ciphertext: ciphertextHex, key: keyHex, nonce: nonceHex, aad, decrypt },
      },
      {
        id: `${id}-stream`,
        titleKey: decrypt ? 'simulation.aes_gcm.stream.dTitle' : 'simulation.aes_gcm.stream.title',
        descKey: decrypt ? 'simulation.aes_gcm.stream.dDesc' : 'simulation.aes_gcm.stream.desc',
        phase: 'transform',
        view: { kind: 'agcm-stream', ct: ciphertextHexB, pt: plaintextHexB, decrypt },
      },
      {
        id: `${id}-mackey`,
        titleKey: 'simulation.aes_gcm.mackey.title',
        descKey: 'simulation.aes_gcm.mackey.desc',
        phase: 'key',
        view: { kind: 'agcm-mackey', nonce: nonceHexB },
      },
      {
        id: `${id}-ghash`,
        titleKey: 'simulation.aes_gcm.ghash.title',
        descKey: 'simulation.aes_gcm.ghash.desc',
        phase: 'transform',
        view: { kind: 'agcm-ghash', aadHex, aad, tagHex, hasAad: hasResult ? (aad !== '' || aadHex !== '') : aad !== '' },
      },
      {
        id: `${id}-verify`,
        titleKey: decrypt ? 'simulation.aes_gcm.verify.title' : 'simulation.aes_gcm.verify.dTitle',
        descKey: 'simulation.aes_gcm.verify.desc',
        phase: 'internal',
        view: { kind: 'agcm-verify', auth, decrypt, tagHex },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.aes_gcm.result.dTitle' : 'simulation.aes_gcm.result.title',
        descKey: 'simulation.aes_gcm.result.desc',
        phase: 'output',
        view: { kind: 'agcm-result', out: resultOut, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'agcm-input':
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'ciphertext (hex, incl. tag)' : 'plaintext'}
              value={(view.decrypt ? hexStrOf8(view.ciphertext) : hexStrOf8(view.plaintext)) ?? ''}
              tone="input"
            />
            <DataBlock label="key" value={hexStrOf8(view.key) ?? ''} tone="key" big />
            <DataBlock label="nonce" value={hexStrOf8(view.nonce) ?? ''} tone="key" />
            <DataBlock label="AAD" value={hexStrOf8(view.aad) ?? ''} tone="internal" />
          </div>
        )
      case 'agcm-stream':
        return (
          <div className="lab-stage-view">
            <FlowArrow op={view.decrypt ? 'AES-CTR decrypt' : 'AES-CTR encrypt'} />
            {view.decrypt ? (
              <DataBlock label="plaintext (hex)" value={hexStrOf8(view.pt) ?? ''} tone="output" big />
            ) : (
              <DataBlock label="ciphertext (hex)" value={hexStrOf8(view.ct) ?? ''} tone="output" big />
            )}
            <DataBlock label="CTR keystream" value="E_K(counter ‖ nonce) XOR plaintext" tone="muted" />
          </div>
        )
      case 'agcm-mackey':
        return (
          <div className="lab-stage-view">
            <FlowArrow op="H = E_K(0^128); J0 = nonce ‖ 0x00000001" />
            <DataBlock label="nonce" value={hexStrOf8(view.nonce) ?? ''} tone="key" />
            <DataBlock label="H subkey" value="AES-encrypt all-zero block" tone="internal" />
          </div>
        )
      case 'agcm-ghash': {
        const aadH = hexStrOf8(view.aadHex) ?? ''
        const tagH = hexStrOf8(view.tagHex) ?? ''
        return (
          <div className="lab-stage-view">
            <FlowArrow op="GHASH(H, AAD ‖ ciphertext ‖ len)" />
            <DataBlock label="AAD (hex)" value={view.hasAad ? aadH : '—'} tone="internal" />
            <DataBlock label="tag" value={tagH} tone="output" big />
          </div>
        )
      }
      case 'agcm-verify':
        return (
          <div className="lab-stage-view">
            {view.decrypt ? (
              <DataBlock label="authentication" value={hexStrOf8(view.auth) === 'PASS' ? 'PASS' : 'verify tag before returning plaintext'} tone={hexStrOf8(view.auth) === 'PASS' ? 'output' : 'muted'} big />
            ) : (
              <DataBlock label="tag" value={`${hexStrOf8(view.tagHex) ?? ''}`} tone="output" />
            )}
          </div>
        )
      case 'agcm-result':
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'plaintext' : 'ciphertext ‖ tag'}
              value={hexStrOf8(view.out) ?? ''}
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
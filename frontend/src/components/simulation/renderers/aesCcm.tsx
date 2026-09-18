import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'aes_ccm'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

export const aesCcmEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.aes_ccm.name',
  educationalKey: 'simulation.aes_ccm.educational',
  demoInputs: {
    plaintext: 'Hello, cryptography!',
    key_hex: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    nonce_hex: '000000000000000000000000',
    aad: '',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const plaintext = String(ctx.inputs.plaintext ?? '')
    const ciphertext = String(ctx.inputs.ciphertext_hex ?? '').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const nonce = String(ctx.inputs.nonce_hex ?? '').replace(/\s/g, '')
    const aad = String(ctx.inputs.aad ?? '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    const nonceB = hexStr(extra?.nonce_hex) || nonce
    const ct = hasResult ? hexStr(extra?.ciphertext_hex) : ''
    const tag = hasResult ? hexStr(extra?.tag_hex) : ''
    const aadHex = hasResult ? hexStr(extra?.aad_hex) : ''
    const combined = hasResult ? hexStr(extra?.combined_hex) || (ct + tag) : ''
    const ks = extra && typeof extra.key_size === 'number' ? extra.key_size : (keyHex.length / 2) * 8
    const tagLen = extra && typeof extra.tag_length === 'number' ? extra.tag_length : 0
    const authFail = decrypt && hasResult && extra?.authentication !== 'PASS'
    const authStates = Array.isArray(extra?.auth_states) ? (extra.auth_states as Record<string, unknown>[]) : []
    const encCounters = Array.isArray(extra?.enc_counter_blocks) ? (extra.enc_counter_blocks as string[]) : []
    const keystream = Array.isArray(extra?.keystream_blocks) ? (extra.keystream_blocks as string[]) : []

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.aes_ccm.input.title',
        descKey: decrypt ? 'simulation.aes_ccm.input.dDesc' : 'simulation.aes_ccm.input.desc',
        descArgs: { bits: ks },
        phase: 'input',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: 'agcm-input', plaintext, ciphertext, key: keyHex, nonce, aad, decrypt },
      },
      {
        id: `${id}-auth`,
        titleKey: 'simulation.aes_ccm.auth.title',
        descKey: 'simulation.aes_ccm.auth.desc',
        descArgs: { aadBytes: aadHex.length / 2 },
        phase: 'transform',
        traceIndex: hasResult ? 2 : undefined,
        view: { kind: `${id}-auth`, aadHex, aad, tag, hasTag: hasResult, hasResult, authStates },
      },
      {
        id: `${id}-stream`,
        titleKey: 'simulation.aes_ccm.stream.title',
        descKey: decrypt ? 'simulation.aes_ccm.stream.dDesc' : 'simulation.aes_ccm.stream.desc',
        descArgs: {},
        phase: 'transform',
        traceIndex: hasResult ? 3 : undefined,
        view: { kind: `${id}-stream`, ct, nonce: nonceB, decrypt, hasResult, encCounters, keystream },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.aes_ccm.result.title',
        descKey: decrypt ? 'simulation.aes_ccm.result.dDesc' : 'simulation.aes_ccm.result.desc',
        descArgs: { tagBytes: tagLen },
        phase: 'output',
        view: {
          kind: `${id}-result`,
          combined,
          out: ctx.result?.result != null ? String(ctx.result.result) : '',
          hasResult,
          decrypt,
          authFail,
        },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'agcm-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label={Boolean(view.decrypt) ? 'ciphertext (hex, incl. tag)' : 'plaintext'} value={String(Boolean(view.decrypt) ? view.ciphertext : view.plaintext)} tone="input" />
            <DataBlock label="key (hex)" value={String(view.key)} tone="key" big />
            <DataBlock label="nonce (7–13 bytes)" value={String(view.nonce)} tone="key" />
            <DataBlock label="AAD" value={String(view.aad) || '—'} tone="internal" />
          </div>
        )
      case `${id}-auth`: {
        const tag = hexStr(view.tag)
        const has = Boolean(view.hasResult)
        const states = (view.authStates as Record<string, unknown>[] | undefined) ?? []
        return (
          <div className="lab-stage-view">
            <FlowArrow op="CBC-MAC over (AAD ‖ plaintext)" />
            <DataBlock label="AAD (hex)" value={has ? hexStr(view.aadHex) || '—' : 'run to bind'} tone="internal" />
            {states.length > 0 && (
              <DataBlock
                label={`real CBC-MAC blocks (${states.length})`}
                value={states.map((s) => `${s.block}: ${s.input_block}`).join('  ')}
                tone="internal"
              />
            )}
            <DataBlock label="tag τ" value={Boolean(view.hasTag) ? tag : '—'} tone="output" big />
          </div>
        )
      }
      case `${id}-stream`:
        return (
          <div className="lab-stage-view">
            <FlowArrow op={Boolean(view.decrypt) ? 'AES-CTR decrypt' : 'AES-CTR encrypt (mode CTR)'} />
            <DataBlock label="ciphertext (hex)" value={hexStr(view.ct) || '—'} tone="output" big />
            <DataBlock
              label="counter blocks"
              value={
                (view.encCounters as string[] | undefined)?.length
                  ? (view.encCounters as string[]).join(' ')
                  : 'CTR blocks ctr0 ‖ ctr1 … start from the nonce'
              }
              tone="internal"
            />
            {(view.keystream as string[] | undefined)?.length ? (
              <DataBlock
                label="keystream (E_K(ctr+i))"
                value={(view.keystream as string[]).join(' ')}
                tone="transform"
              />
            ) : null}
          </div>
        )
      case `${id}-result`: {
        const dec = Boolean(view.decrypt)
        const has = Boolean(view.hasResult)
        const failing = Boolean(view.authFail)
        const out = dec ? hexStr(view.out) : hexStr(view.combined)
        return (
          <div className="lab-stage-view">
            {has && failing ? (
              <DataBlock label="authentication" value="FAILED — tampered ciphertext/tag/AAD/key; no plaintext returned" tone="error" big />
            ) : (
              <DataBlock
                label={dec ? 'plaintext' : 'ciphertext ‖ tag'}
                value={has ? out : '—'}
                tone={has ? 'output' : 'muted'}
                big
              />
            )}
            {has && !dec && (
              <p className="lab-note">AEAD output = ciphertext ‖ τ tag; decrypt verifies the tag first.</p>
            )}
          </div>
        )
      }
      default:
        return null
    }
  },
}
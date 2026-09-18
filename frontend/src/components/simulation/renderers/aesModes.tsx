import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { bytesToHex, hexToBytes, strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'

const BLOCK = 16

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

export function pkcs7Pad(text: string): { paddedHex: string; padBytes: number } {
  const bytes = strToBytes(text)
  const pad = BLOCK - (bytes.length % BLOCK)
  const padded = new Uint8Array(bytes.length + pad)
  padded.set(bytes)
  padded.fill(pad, bytes.length)
  return { paddedHex: bytesToHex(padded), padBytes: pad }
}

export function xorHex(a: string, b: string): string {
  const A = hexToBytes(a)
  const B = hexToBytes(b)
  const len = Math.max(A.length, B.length)
  const out = new Uint8Array(len)
  for (let i = 0; i < len; i++) out[i] = (A[i] ?? 0) ^ (B[i] ?? 0)
  return bytesToHex(out)
}

/** Big-endian 128-bit counter increments from a starting counter block. */
export function counterBlocks(counterHex: string, count: number): string[] {
  const raw = hexToBytes(counterHex)
  const block = raw.length === BLOCK ? Array.from(raw) : Array.from({ length: BLOCK }, (_, i) => raw[i] ?? 0)
  const out: string[] = []
  for (let c = 0; c < count; c++) {
    const cur = [...block]
    for (let i = BLOCK - 1; i >= 0; i--) {
      cur[i] = (cur[i] + 1) & 0xff
      if (cur[i] !== 0) break
    }
    out.push(bytesToHex(new Uint8Array(cur)))
  }
  return out
}

function keySize(v: unknown, keyHex: string): number {
  const n = v && typeof v === 'number' ? v : 0
  return n > 0 ? n : (keyHex.length / 2) * 8
}

function ctBlockCells(block: string): CharCell[] {
  return (block.match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone: 'output' as const }))
}

// ---------------------------------------------------------------------------
// AES-CBC
// ---------------------------------------------------------------------------

/** Number of 16-byte blocks a hex string spans (0 when not a whole number). */
function hexBlockCount(hex: string): number {
  const h = String(hex ?? '').replace(/\s/g, '')
  if (!h || h.length % 32 !== 0) return 0
  return h.length / 32
}

/** Chaining partner for a block: the IV (C0) or the previous ciphertext. */
function prevLabelFor(i: number): string {
  return i === 1 ? 'C0 = IV' : `C${i - 1}`
}

export const aesCbcEngine: SimulationEngine = {
  id: 'aes_cbc',
  nameKey: 'simulation.aes_cbc.name',
  educationalKey: 'simulation.aes_cbc.educational',
  demoInputs: {
    plaintext: 'Hello, cryptography!',
    key_hex: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    iv_hex: '00000000000000000000000000000000',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const plaintext = String(ctx.inputs.plaintext ?? '')
    const ciphertext = String(ctx.inputs.ciphertext_hex ?? '').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const ivHex = String(ctx.inputs.iv_hex ?? '').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const ks = keySize(extra?.key_size, keyHex)
    const iv = hexStr(extra?.iv_hex) || ivHex
    const ct = hexStr(extra?.ciphertext_hex) || ciphertext

    const list = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : [])
    const ctBlocks = list(extra?.ciphertext_blocks)
    const ptBlocks = list(extra?.plaintext_blocks).length
      ? list(extra?.plaintext_blocks)
      : list(extra?.padded_plaintext_blocks)
    const xorStates = list(extra?.xor_states)
    const prevStates = list(extra?.prev_states)

    // Number of blocks to visualize. Real runs source it from the backend
    // arrays; before a run, only the LAYOUT is derived (block count / indices)
    // from the input length — never any cryptographic value.
    const n = decrypt
      ? ctBlocks.length || hexBlockCount(ct)
      : ptBlocks.length ||
        ctBlocks.length ||
        hexBlockCount(hexStr(extra?.padded_plaintext_hex)) ||
        Math.max(1, hexBlockCount(pkcs7Pad(plaintext).paddedHex))

    /**
     * One block's real (or placeholder) values. `ctThrough` is the highest
     * block whose ciphertext is known so far: the current XOR stage knows
     * blocks 1..i-1, the AES stage knows 1..i.
     */
    const blockRecord = (j: number, ctThrough: number): Record<string, unknown> => {
      const real = (arr: string[], idx: number): string =>
        hasResult && arr[idx] ? arr[idx] : ''
      if (decrypt) {
        const prev = hasResult ? (j === 1 ? iv : prevStates[j - 1] ?? ctBlocks[j - 2] ?? '') : ''
        return {
          i: j,
          prev,
          prevLabel: prevLabelFor(j),
          ct: real(ctBlocks, j - 1),
          dec: real(xorStates, j - 1),
          pt: real(ptBlocks, j - 1),
        }
      }
      const prev = hasResult ? (j === 1 ? iv : prevStates[j - 1] ?? ctBlocks[j - 2] ?? '') : ''
      return {
        i: j,
        prev,
        prevLabel: prevLabelFor(j),
        pt: real(ptBlocks, j - 1),
        xored: real(xorStates, j - 1),
        ct: hasResult && j <= ctThrough && ctBlocks[j - 1] ? ctBlocks[j - 1] : null,
      }
    }

    const histUpTo = (i: number, ctThrough: number): Record<string, unknown>[] =>
      Array.from({ length: i }, (_, k) => blockRecord(k + 1, ctThrough))

    const stages: SimStage[] = [
      {
        id: 'aes_cbc-input',
        titleKey: 'simulation.aes_cbc.input.title',
        descKey: decrypt ? 'simulation.aes_cbc.input.dDesc' : 'simulation.aes_cbc.input.desc',
        descArgs: { bits: ks },
        phase: 'input',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: 'aes_cbc-input', plaintext, ciphertext, key: keyHex, iv, decrypt },
      },
    ]

    if (!decrypt) {
      const paddedHex = hexStr(extra?.padded_plaintext_hex)
      const realPad = hasResult && paddedHex ? (paddedHex.length / 2) - strToBytes(plaintext).length : 0
      stages.push({
        id: 'aes_cbc-padding',
        titleKey: 'simulation.aes_cbc.padding.title',
        descKey: 'simulation.aes_cbc.padding.desc',
        descArgs: { padBytes: realPad },
        phase: 'transform',
        traceIndex: hasResult ? 2 : undefined,
        view: {
          kind: 'aes_cbc-padding',
          paddedHex: paddedHex || pkcs7Pad(plaintext).paddedHex,
          hasPadding: hasResult && !!paddedHex,
          decrypt,
        },
      })
    }

    for (let i = 1; i <= n; i++) {
      const prevLabel = prevLabelFor(i)
      if (decrypt) {
        stages.push({
          id: `aes_cbc-dec-${i}`,
          titleKey: 'simulation.aes_cbc.dec.title',
          titleArgs: { i },
          descKey: 'simulation.aes_cbc.dec.desc',
          descArgs: { i, n },
          phase: 'transform',
          traceIndex: hasResult ? 2 * i : undefined,
          view: {
            kind: 'aes_cbc-dec',
            i,
            n,
            hasResult,
            decrypt: true,
            prevLabel,
            input: blockRecord(i, i).ct,
            decrypted: blockRecord(i, i).dec,
            formula: `M${i} = AES⁻¹_K(C${i})`,
            whyKey: 'simulation.aes_cbc.whyDec',
            hist: histUpTo(i, i),
          },
        })
        const rec = blockRecord(i, i)
        stages.push({
          id: `aes_cbc-xorD-${i}`,
          titleKey: 'simulation.aes_cbc.xorD.title',
          titleArgs: { i, prev: prevLabel },
          descKey: 'simulation.aes_cbc.xorD.desc',
          descArgs: { i, n, prev: prevLabel },
          phase: 'transform',
          traceIndex: hasResult ? 2 * i + 1 : undefined,
          view: {
            kind: 'aes_cbc-xorD',
            i,
            n,
            hasResult,
            decrypt: true,
            prevLabel,
            prev: rec.prev,
            decrypted: rec.dec,
            plaintext: rec.pt,
            formula: `P${i} = M${i} ⊕ ${prevLabel}`,
            whyKey: 'simulation.aes_cbc.whyXorD',
            hist: histUpTo(i, i),
          },
        })
      } else {
        const rec = blockRecord(i, i - 1)
        stages.push({
          id: `aes_cbc-xor-${i}`,
          titleKey: 'simulation.aes_cbc.xor.title',
          titleArgs: { i, prev: prevLabel },
          descKey: 'simulation.aes_cbc.xor.desc',
          descArgs: { i, n, prev: prevLabel },
          phase: 'transform',
          traceIndex: hasResult ? 2 * i + 1 : undefined,
          view: {
            kind: 'aes_cbc-xor',
            i,
            n,
            hasResult,
            decrypt: false,
            prevLabel,
            prev: rec.prev,
            input: rec.pt,
            xored: rec.xored,
            formula: `X${i} = P${i} ⊕ ${prevLabel}`,
            whyKey: 'simulation.aes_cbc.whyXor',
            hist: histUpTo(i, i - 1),
          },
        })
        const aesRec = blockRecord(i, i)
        stages.push({
          id: `aes_cbc-aes-${i}`,
          titleKey: 'simulation.aes_cbc.aes.title',
          titleArgs: { i },
          descKey: 'simulation.aes_cbc.aes.desc',
          descArgs: { i, n },
          phase: 'transform',
          traceIndex: hasResult ? 2 * i + 2 : undefined,
          view: {
            kind: 'aes_cbc-aes',
            i,
            n,
            hasResult,
            decrypt: false,
            prevLabel,
            input: aesRec.xored,
            xored: aesRec.xored,
            ciphertext: aesRec.ct === null ? '' : aesRec.ct,
            formula: `C${i} = AES_K(X${i})`,
            whyKey: 'simulation.aes_cbc.whyAes',
            hist: histUpTo(i, i),
          },
        })
      }
    }

    if (decrypt) {
      stages.push({
        id: 'aes_cbc-unpad',
        titleKey: 'simulation.aes_cbc.unpad.title',
        descKey: 'simulation.aes_cbc.unpad.desc',
        phase: 'transform',
        traceIndex: hasResult ? 2 * n + 2 : undefined,
        view: {
          kind: 'aes_cbc-unpad',
          hasResult,
          plaintextHex: hexStr(extra?.plaintext_hex),
          paddedHex: ptBlocks.join(''),
        },
      })
    }

    stages.push({
      id: 'aes_cbc-result',
      titleKey: 'simulation.aes_cbc.result.title',
      descKey: decrypt ? 'simulation.aes_cbc.result.dDesc' : 'simulation.aes_cbc.result.desc',
      phase: 'output',
      view: {
        kind: 'aes_cbc-result',
        out: decrypt
          ? hasResult
            ? String(ctx.result?.result ?? extra?.plaintext ?? '')
            : ''
          : ct,
        hasResult,
        decrypt,
      },
    })

    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'aes_cbc-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label={Boolean(view.decrypt) ? 'ciphertext (hex)' : 'plaintext'} value={String(Boolean(view.decrypt) ? view.ciphertext : view.plaintext)} tone="input" />
            <DataBlock label="key (hex, hidden in 3D)" value={String(view.key)} tone="key" big />
            <DataBlock label="IV (hex)" value={String(view.iv)} tone="key" />
          </div>
        )
      case 'aes_cbc-padding': {
        const hasPadding = Boolean(view.hasPadding)
        return (
          <div className="lab-stage-view">
            {hasPadding ? (
              <>
                <CharRow
                  label="padded"
                  size="sm"
                  cells={(hexStr(view.paddedHex).match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone: 'transform' as const }))}
                />
                <DataBlock label="PKCS#7 padding" value={`+${String(view.padBytes ?? 0)} byte(s) to a multiple of 16`} tone="key" />
              </>
            ) : (
              <DataBlock label="padding" value="run to compute" tone="muted" />
            )}
          </div>
        )
      }
      case 'aes_cbc-xor': {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label={`plaintext block P${String(view.i)}`} value={String(view.input)} tone="input" />
            <DataBlock label={`chain input ${String(view.prevLabel)}`} value={String(view.prev)} tone="internal" />
            <CharRow
              label={`X${String(view.i)} = P${String(view.i)} ⊕ ${String(view.prevLabel)}`}
              size="sm"
              cells={String(view.xored).match(/.{2}/g)?.map((h) => ({ ch: h, tone: 'transform' as const })) ?? []}
            />
            {!has && <p className="lab-note">Educational representation — run the simulator to bind the real block values.</p>}
          </div>
        )
      }
      case 'aes_cbc-aes': {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label={`AES input X${String(view.i)}`} value={String(view.xored)} tone="transform" />
            <CharRow
              label={`C${String(view.i)} = AES_K(X${String(view.i)})`}
              size="sm"
              cells={String(view.ciphertext).match(/.{2}/g)?.map((h) => ({ ch: h, tone: 'output' as const })) ?? []}
            />
            {!has && <p className="lab-note">Educational representation — run the simulator to bind the real block values.</p>}
          </div>
        )
      }
      case 'aes_cbc-dec': {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label={`ciphertext block C${String(view.i)}`} value={String(view.input)} tone="input" />
            <CharRow
              label={`M${String(view.i)} = AES⁻¹_K(C${String(view.i)})`}
              size="sm"
              cells={String(view.decrypted).match(/.{2}/g)?.map((h) => ({ ch: h, tone: 'internal' as const })) ?? []}
            />
            {!has && <p className="lab-note">Educational representation — run the simulator to bind the real block values.</p>}
          </div>
        )
      }
      case 'aes_cbc-xorD': {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label={`M${String(view.i)} = AES⁻¹_K(C${String(view.i)})`} value={String(view.decrypted)} tone="internal" />
            <DataBlock label={`chaining input ${String(view.prevLabel)}`} value={String(view.prev)} tone="key" />
            <CharRow
              label={`P${String(view.i)} = M${String(view.i)} ⊕ ${String(view.prevLabel)}`}
              size="sm"
              cells={String(view.plaintext).match(/.{2}/g)?.map((h) => ({ ch: h, tone: 'output' as const })) ?? []}
            />
            {!has && <p className="lab-note">Educational representation — run the simulator to bind the real block values.</p>}
          </div>
        )
      }
      case 'aes_cbc-unpad': {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            {has && String(view.paddedHex) ? (
              <CharRow
                label="padded plaintext (hex)"
                size="sm"
                cells={(hexStr(view.paddedHex).match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone: 'transform' as const }))}
              />
            ) : (
              <DataBlock label="padded plaintext" value="run to compute" tone="muted" />
            )}
            <DataBlock label="plaintext after unpad" value={has ? String(view.plaintextHex) : '—'} tone="output" />
          </div>
        )
      }
      case 'aes_cbc-result': {
        const has = Boolean(view.hasResult)
        const decrypt = Boolean(view.decrypt)
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={decrypt ? 'plaintext' : 'ciphertext (hex)'}
              value={has ? String(view.out) : '—'}
              tone={has ? 'output' : 'muted'}
              big
            />
            {has && !decrypt && (
              <p className="lab-note">CBC provides confidentiality only — no integrity.</p>
            )}
          </div>
        )
      }
      default:
        return null
    }
  },
}

// ---------------------------------------------------------------------------
// AES-CTR
// ---------------------------------------------------------------------------

export const aesCtrEngine: SimulationEngine = {
  id: 'aes_ctr',
  nameKey: 'simulation.aes_ctr.name',
  educationalKey: 'simulation.aes_ctr.educational',
  demoInputs: {
    plaintext: 'Hello, cryptography!',
    key_hex: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    counter_hex: '00000000000000000000000000000000',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const plaintext = String(ctx.inputs.plaintext ?? '')
    const ciphertext = String(ctx.inputs.ciphertext_hex ?? '').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const counterHex = String(ctx.inputs.counter_hex ?? '').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const ks = keySize(extra?.key_size, keyHex)
    const counter = hexStr(extra?.counter_hex) || counterHex

    const ct = hasResult ? (decrypt ? hexStr(extra?.ciphertext_hex) || ciphertext : hexStr(extra?.ciphertext_hex)) : ''
    const pt = hasResult
      ? hexStr(extra?.plaintext_hex) || bytesToHex(strToBytes(plaintext))
      : bytesToHex(strToBytes(plaintext))

    const traceCounters = Array.isArray(extra?.counter_blocks) ? (extra.counter_blocks as string[]) : []
    const traceKeystream = Array.isArray(extra?.keystream_blocks) ? (extra.keystream_blocks as string[]) : []
    const ksStream = hasResult
      ? (traceKeystream.join('') || xorHex(pt, ct) || '')
      : ''

    const length = Math.max(
      1,
      Math.ceil((hasResult ? Math.max(pt.length, ct.length) : 0) / 2 / BLOCK),
    )
    const counters = traceCounters.length > 0 ? traceCounters : counterBlocks(counter, Math.min(length, 8))
    const keystreamBlocks = traceKeystream.length > 0 ? traceKeystream : []

    return [
      {
        id: 'aes_ctr-input',
        titleKey: 'simulation.aes_ctr.input.title',
        descKey: decrypt ? 'simulation.aes_ctr.input.dDesc' : 'simulation.aes_ctr.input.desc',
        descArgs: { bits: ks },
        phase: 'input',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: 'aes_ctr-input', plaintext, ciphertext, key: keyHex, counter, decrypt },
      },
      {
        id: 'aes_ctr-counter',
        titleKey: 'simulation.aes_ctr.counter.title',
        descKey: 'simulation.aes_ctr.counter.desc',
        descArgs: { blocks: length },
        phase: 'key',
        traceIndex: hasResult ? 2 : undefined,
        view: { kind: 'aes_ctr-counter', counters, hasResult },
      },
      {
        id: 'aes_ctr-xor',
        titleKey: 'simulation.aes_ctr.xor.title',
        descKey: 'simulation.aes_ctr.xor.desc',
        descArgs: { bytes: Math.max(pt.length, ct.length) / 2 },
        phase: 'transform',
        traceIndex: hasResult ? 3 : undefined,
        view: { kind: 'aes_ctr-xor', pt, ct, keystream: ksStream, keystreamBlocks, hasResult, decrypt },
      },
      {
        id: 'aes_ctr-result',
        titleKey: 'simulation.aes_ctr.result.title',
        descKey: decrypt ? 'simulation.aes_ctr.result.dDesc' : 'simulation.aes_ctr.result.desc',
        phase: 'output',
        view: {
          kind: 'aes_ctr-result',
          out: ctx.result?.result != null ? String(ctx.result.result) : '',
          ct,
          hasResult,
          decrypt,
        },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'aes_ctr-input':
        return (
          <div className="lab-stage-view">
            <DataBlock label={Boolean(view.decrypt) ? 'ciphertext (hex)' : 'plaintext'} value={String(Boolean(view.decrypt) ? view.ciphertext : view.plaintext)} tone="input" />
            <DataBlock label="key (hex)" value={String(view.key)} tone="key" big />
            <DataBlock label="counter block a0 (hex)" value={String(view.counter)} tone="key" />
          </div>
        )
      case 'aes_ctr-counter': {
        const counters = (view.counters as string[] | undefined) ?? []
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            {counters.length > 0 && has ? (
              <div className="lab-rows">
                {counters.map((c, i) => (
                  <CharRow key={i} label={`counter+${i}`} size="sm" cells={ctBlockCells(c)} />
                ))}
              </div>
            ) : (
              <DataBlock label="counter blocks" value="a0 ‖ a0+1 ‖ a0+2 … — never reuse a counter under one key" tone="muted" />
            )}
            <DataBlock label="keystream" value="E_K(counter+i)" tone="internal" />
          </div>
        )
      }
      case 'aes_ctr-xor': {
        const decrypt = Boolean(view.decrypt)
        const has = Boolean(view.hasResult)
        const pt = hexStr(view.pt)
        const ct = hexStr(view.ct)
        const ks = hexStr(view.keystream)
        const ksBlocks = (view.keystreamBlocks as string[] | undefined) ?? []
        const row = (label: string, hex: string, tone: CharCell['tone']) => (
          <CharRow label={label} size="sm" cells={(hex.match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone }))} />
        )
        return (
          <div className="lab-stage-view">
            {has ? (
              <>
                <div className="lab-rows">
                  {row(decrypt ? 'C' : 'P', decrypt ? ct : pt, 'input')}
                  {row('keystream', ks.length ? ks : 'keystream = E_K(counter)', 'transform')}
                  {row(decrypt ? 'P' : 'C', decrypt ? pt : ct, 'output')}
                </div>
                {ksBlocks.length > 0 && (
                  <DataBlock label="real keystream blocks (E_K(counter+i))" value={ksBlocks.join(' ')} tone="internal" />
                )}
              </>
            ) : (
              <DataBlock label="XOR" value="P ⊕ keystream = C — run to bind the real values" tone="muted" />
            )}
          </div>
        )
      }
      case 'aes_ctr-result': {
        const decrypt = Boolean(view.decrypt)
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={decrypt ? 'plaintext' : 'ciphertext (hex)'}
              value={has ? String(decrypt ? view.out : view.ct) : '—'}
              tone={has ? 'output' : 'muted'}
              big
            />
            <p className="lab-note">CTR is a stream mode: encrypt and decrypt are the same operation.</p>
          </div>
        )
      }
      default:
        return null
    }
  },
}
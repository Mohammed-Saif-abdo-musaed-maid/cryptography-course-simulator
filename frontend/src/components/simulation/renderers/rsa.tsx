import type { SimulationContext, SimulationEngine, SimStage, SimView, CharCell } from '../simulationTypes'
import {
  rsaKeygen,
  rsaEncode,
  rsaDecode,
  modPowSteps,
  gcdBig,
  isPrime,
} from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'rsa'

function encodeToCells(message: string): CharCell[] {
  return message
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .map((ch) => ({
      ch,
      tone: 'input' as const,
      note: `${ch} -> ${ch.charCodeAt(0) - 64}`,
    }))
}

function toBase27Cells(value: number): CharCell[] {
  const digits: number[] = []
  let x = value
  while (x > 0) {
    digits.unshift(x % 27)
    x = Math.floor(x / 27)
  }
  return digits.map((v, i) => ({
    ch: v === 0 ? ' ' : String.fromCharCode(64 + v),
    tone: 'transform' as const,
    note: `digit[${i}] = ${v}`,
  }))
}

export const rsaEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.rsa.name',
  educationalKey: 'simulation.rsa.educational',
  demoInputs: { message: 'HI', p: 61, q: 53, e: 65537 },
  build(ctx) {
    const message = String(ctx.inputs.message ?? 'HI')
    const p = Number(ctx.inputs.p ?? 61)
    const q = Number(ctx.inputs.q ?? 53)
    const eInput = ctx.inputs.e != null ? Number(ctx.inputs.e) : 65537
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const pValid = isPrime(p)
    const qValid = isPrime(q)
    const primesDistinct = p !== q
    const primesOk = pValid && qValid && primesDistinct

    if (!primesOk) {
      const reasons: string[] = []
      if (!pValid) reasons.push(`p = ${p} is not prime`)
      if (!qValid) reasons.push(`q = ${q} is not prime`)
      if (!primesDistinct) reasons.push('p and q must be distinct')
      return [
        {
          id: `${id}-error`,
          titleKey: 'simulation.rsa.error.title',
          descKey: 'simulation.rsa.error.desc',
          descArgs: { reasons: reasons.join('; ') },
          phase: 'input',
          view: { kind: 'rsa-error', reasons },
        },
      ] as SimStage[]
    }

    const keys = rsaKeygen(p, q, eInput)
    const { n, phi, e, d } = keys

    const encoding = rsaEncode(message)
    const M = encoding.m
    const tooLarge = M >= n

    if (tooLarge) {
      return [
        {
          id: `${id}-error`,
          titleKey: 'simulation.rsa.error.title',
          descKey: 'simulation.rsa.error.too_large',
          descArgs: { message, n },
          phase: 'input',
          view: { kind: 'rsa-error', reasons: [`M = ${M} >= n = ${n}: message too long`] },
        },
      ] as SimStage[]
    }

    const encryptPow = modPowSteps(BigInt(M), BigInt(e), BigInt(n))
    const C = Number(encryptPow.result)

    let Cp = C
    let recoveredM = M
    let decryptResult = ''
    if (extra && typeof extra.cipher === 'number') {
      Cp = extra.cipher as number
      const decryptPow = modPowSteps(BigInt(Cp), BigInt(d), BigInt(n))
      recoveredM = Number(decryptPow.result)
      decryptResult = rsaDecode(recoveredM)
    } else {
      const decryptPow = modPowSteps(BigInt(C), BigInt(d), BigInt(n))
      recoveredM = Number(decryptPow.result)
      decryptResult = rsaDecode(recoveredM)
      Cp = C
    }

    const msgCells = encodeToCells(message)
    const m27Cells = toBase27Cells(M)

    const encryptRows = encryptPow.rows.map((r, i) => ({
      label: `bit ${i}`,
      cells: [
        { ch: r.bit, tone: 'key' as const, note: `bit = ${r.bit}` },
        { ch: r.square, tone: 'transform' as const, note: 'squared' },
        ...(r.multiply
          ? [{ ch: r.multiply, tone: 'output' as const, note: 'multiply' }]
          : [{ ch: '-', tone: 'muted' as const, note: 'skip' }]),
      ],
    }))

    return [
      {
        id: `${id}-keygen`,
        titleKey: 'simulation.rsa.keygen.title',
        descKey: 'simulation.rsa.keygen.desc',
        descArgs: { p, q },
        phase: 'key',
        view: {
          kind: 'rsa-keygen',
          n,
          phi,
          e,
          d,
          p,
          q,
          gcdCheck: Number(gcdBig(BigInt(e), BigInt(phi))),
          eNote: keys.eNote,
        },
      },
      {
        id: `${id}-encode`,
        titleKey: 'simulation.rsa.encode.title',
        descKey: 'simulation.rsa.encode.desc',
        descArgs: { message, M },
        phase: 'input',
        view: {
          kind: 'rsa-encode',
          message,
          M,
          msgCells,
          m27Cells,
        },
      },
      {
        id: `${id}-encrypt`,
        titleKey: 'simulation.rsa.encrypt.title',
        descKey: 'simulation.rsa.encrypt.desc',
        descArgs: { M, e, n },
        phase: 'transform',
        view: {
          kind: 'rsa-encrypt',
          M,
          e,
          n,
          C,
          encryptRows,
          bits: encryptPow.bits,
        },
      },
      {
        id: `${id}-decrypt`,
        titleKey: 'simulation.rsa.decrypt.title',
        descKey: 'simulation.rsa.decrypt.desc',
        descArgs: { C: Cp, d, n },
        phase: 'transform',
        view: {
          kind: 'rsa-decrypt',
          C: Cp,
          d,
          n,
          M: recoveredM,
          result: decryptResult,
        },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.rsa.result.title',
        descKey: 'simulation.rsa.result.desc',
        descArgs: { out: decryptResult },
        phase: 'output',
        view: { kind: 'rsa-result', text: decryptResult },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'rsa-error':
        return (
          <div className="lab-stage-view">
            <DataBlock label="Error" value={(view.reasons as string[]).join('; ')} tone="muted" big />
          </div>
        )
      case 'rsa-keygen':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="p" value={String(view.p)} tone="key" />
              <DataBlock label="q" value={String(view.q)} tone="key" />
              <FlowArrow op="*" />
              <DataBlock label="n = p x q" value={String(view.n)} tone="internal" big />
            </div>
            <div className="lab-ec-plane">
              <DataBlock label="phi(n)" value={String(view.phi)} tone="internal" />
              <FlowArrow />
              <DataBlock label={`gcd(e, phi)`} value={String(view.gcdCheck)} tone="internal" />
            </div>
            <div className="lab-ec-plane">
              <DataBlock label="e (public)" value={String(view.e)} tone="key" big />
              <DataBlock label="d (private)" value={String(view.d)} tone="output" big />
            </div>
            {Boolean(view.eNote) && <DataBlock label="Note" value={String(view.eNote)} tone="muted" />}
          </div>
        )
      case 'rsa-encode':
        return (
          <div className="lab-stage-view">
            <CharRows
              rows={[
                { label: 'Text', cells: view.msgCells as CharCell[] },
                { label: 'Base27', cells: view.m27Cells as CharCell[] },
              ]}
            />
            <DataBlock label="M (integer)" value={String(view.M)} tone="output" big />
          </div>
        )
      case 'rsa-encrypt':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="M" value={String(view.M)} tone="input" />
              <DataBlock label="e" value={String(view.e)} tone="key" />
              <DataBlock label="n" value={String(view.n)} tone="internal" />
            </div>
            <FlowArrow op="M^e mod n" />
            <div className="lab-ec-row">
              <CharRows
                rows={view.encryptRows as Array<{ label: string; cells: CharCell[] }>}
              />
            </div>
            <DataBlock label="C" value={String(view.C)} tone="output" big />
            <DataBlock label="textbook note" value="Textbook RSA (no padding) - OAEP required in practice" tone="muted" />
          </div>
        )
      case 'rsa-decrypt':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="C" value={String(view.C)} tone="input" />
              <DataBlock label="d" value={String(view.d)} tone="key" />
              <DataBlock label="n" value={String(view.n)} tone="internal" />
            </div>
            <FlowArrow op="C^d mod n" />
            <DataBlock label="M'" value={String(view.M)} tone="output" />
            <FlowArrow />
            <DataBlock label="Plaintext" value={String(view.result)} tone="output" big />
          </div>
        )
      case 'rsa-result':
        return (
          <div className="lab-stage-view">
            <DataBlock label="Decrypted" value={String(view.text)} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
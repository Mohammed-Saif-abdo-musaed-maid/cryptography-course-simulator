import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { modPowBig, upperLetters } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { CharRow } from '../common/CharRow'

const id = 'elgamal'

interface ElgamalValues {
  p: number
  g: number
  x: number
  y: number
  m: number
  k: number
  c1: number
  yk: number
  c2: number
  c1Bound: number | null
  c2Bound: number | null
}

function demoCompute(message: string, p: number, g: number, x: number | null): ElgamalValues {
  const pr = Math.max(p, 3)
  const pp = BigInt(pr)
  const gp = BigInt(g)
  const xp = BigInt(x ?? 1)
  const y = Number(modPowBig(gp, xp, pp))

  const msgLetters = upperLetters(message).split('')
  const m = msgLetters.length
    ? msgLetters
        .slice(0, 10)
        .reduce((acc, ch) => acc * 27 + (ch.charCodeAt(0) - 64), 0)
    : 42
  const k = Math.max(1, (m + 2) % (pr - 1))
  const c1 = Number(modPowBig(gp, BigInt(k), pp))
  const yk = Number(modPowBig(BigInt(y), BigInt(k), pp))
  const c2 = (m * yk) % pr
  return { p: pr, g, x: x ?? 1, y, m, k, c1, yk, c2, c1Bound: null, c2Bound: null }
}

function decodeM(c2: number, c1: number, x: number, p: number): number {
  const c1x = Number(modPowBig(BigInt(c1), BigInt(x), BigInt(p)))
  let inv = 0
  for (let t = 0; t < p; t++) {
    if ((c1x * t) % p === 1) {
      inv = t
      break
    }
  }
  return (c2 * inv) % p
}

export const elgamalEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.elgamal.name',
  educationalKey: 'simulation.elgamal.educational',
  demoInputs: { message: 'HI', p: 467, g: 2, x: 127 },
  build(ctx) {
    const message = String(ctx.inputs.message ?? 'HI')
    const p0 = ctx.inputs.p != null ? Number(ctx.inputs.p) : 467
    const g = ctx.inputs.g != null ? Number(ctx.inputs.g) : 2
    const x = ctx.inputs.x != null ? Number(ctx.inputs.x) : 127
    const extra = ctx.result?.extra as Record<string, unknown> | undefined

    const stepsValues = extra?.steps_values as Record<string, unknown> | undefined
    const cipherInfo = extra?.cipher as Record<string, unknown> | undefined
    const encParams = ctx.result?.parameters as Record<string, unknown> | undefined

    let values: ElgamalValues
    if (extra && stepsValues && typeof stepsValues.y === 'number') {
      values = {
        p: Number(encParams?.p ?? p0),
        g: Number(encParams?.g ?? g),
        x: Number(encParams?.x ?? x),
        y: Number(stepsValues.y),
        m: Number(stepsValues.m ?? 0),
        k: Number(stepsValues.k ?? 0),
        c1: Number(stepsValues.c1),
        yk: Number(stepsValues.y_k ?? 1),
        c2: Number(stepsValues.c2),
        c1Bound: typeof cipherInfo?.c1 === 'number' ? Number(cipherInfo.c1) : null,
        c2Bound: typeof cipherInfo?.c2 === 'number' ? Number(cipherInfo.c2) : null,
      }
    } else {
      values = demoCompute(message, p0, g, Number.isFinite(x) ? x : null)
    }

    const pr = values.p
    const useC1 = values.c1Bound ?? values.c1
    const useC2 = values.c2Bound ?? values.c2
    let mRecovered: number | null = null
    if (values.c1Bound !== null && values.c2Bound !== null) {
      mRecovered = decodeM(values.c2Bound, values.c1Bound, values.x, pr)
    }

    return [
      {
        id: `${id}-keygen`,
        titleKey: 'simulation.elgamal.keygen.title',
        descKey: 'simulation.elgamal.keygen.desc',
        descArgs: { p: pr, g, x: values.x },
        phase: 'key',
        view: { kind: 'elgamal-keygen', p: pr, g, x: values.x, y: values.y },
      },
      {
        id: `${id}-encode`,
        titleKey: 'simulation.elgamal.encode.title',
        descKey: 'simulation.elgamal.encode.desc',
        descArgs: { message, m: values.m, p: pr },
        phase: 'input',
        view: { kind: 'elgamal-encode', message, m: values.m },
      },
      {
        id: `${id}-ephemeral`,
        titleKey: 'simulation.elgamal.ephemeral.title',
        descKey: 'simulation.elgamal.ephemeral.desc',
        descArgs: { k: values.k },
        phase: 'key',
        view: { kind: 'elgamal-ephemeral', k: values.k, p: pr, g },
      },
      {
        id: `${id}-encrypt`,
        titleKey: 'simulation.elgamal.encrypt.title',
        descKey: 'simulation.elgamal.encrypt.desc',
        descArgs: { y: values.y, k: values.k, m: values.m, g, p: pr },
        phase: 'transform',
        view: {
          kind: 'elgamal-encrypt',
          p: pr,
          g,
          x: values.x,
          y: values.y,
          m: values.m,
          k: values.k,
          c1: useC1,
          yk: values.yk,
          c2: useC2,
          bound: values.c1Bound !== null || values.c2Bound !== null,
        },
      },
      {
        id: `${id}-decrypt`,
        titleKey: 'simulation.elgamal.decrypt.title',
        descKey: 'simulation.elgamal.decrypt.desc',
        descArgs: { x: values.x, p: pr },
        phase: 'transform',
        view: {
          kind: 'elgamal-decrypt',
          x: values.x,
          p: pr,
          c1: useC1,
          c2: useC2,
          m: mRecovered,
        },
      },
      {
        id: `${id}-formula`,
        titleKey: 'simulation.elgamal.formula.title',
        descKey: ctx.language === 'ar' ? 'simulation.elgamal.formula.descAr' : 'simulation.elgamal.formula.desc',
        descArgs: { p: pr, g, x: values.x },
        phase: 'key',
        view: {
          kind: 'elgamal-formula',
          p: pr,
          g,
          x: values.x,
          y: values.y,
        },
      },
    ] as SimStage[]
  },

  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case 'elgamal-keygen':
        return (
          <div className="lab-ec-plane">
            <DataBlock label="p" value={String(view.p)} tone="internal" />
            <DataBlock label="g" value={String(view.g)} tone="internal" />
            <DataBlock label="x (private)" value={String(view.x)} tone="key" />
            <FlowArrow op="y = g^x mod p" />
            <DataBlock label="y (public)" value={String(view.y)} tone="output" big />
          </div>
        )
      case 'elgamal-encode':
        return (
          <div className="lab-stage-view">
            <CharRow
              label="text"
              cells={String(view.message)
                .toUpperCase()
                .split('')
                .map((ch) => ({
                  ch,
                  tone: 'input' as const,
                  note: `${ch} -> ${ch.charCodeAt(0) - 64}`,
                }))}
            />
            <DataBlock label="M (integer)" value={String(view.m)} tone="output" />
          </div>
        )
      case 'elgamal-ephemeral':
        return (
          <div className="lab-stage-view">
            <DataBlock label="k (ephemeral)" value={String(view.k)} tone="key" big />
            <div className="lab-ec-plane">
              <DataBlock label="g" value={String(view.g)} tone="internal" />
              <DataBlock label="k" value={String(view.k)} tone="key" />
              <DataBlock label="p" value={String(view.p)} tone="internal" />
            </div>
          </div>
        )
      case 'elgamal-encrypt':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="c1 = g^k mod p" value={String(view.c1)} tone="transform" big />
              <FlowArrow />
              <DataBlock label="c2 = m * y^k mod p" value={String(view.c2)} tone="output" big />
            </div>
            <div className="lab-ec-plane">
              <DataBlock label="y" value={String(view.y)} tone="key" />
              <DataBlock label="k" value={String(view.k)} tone="key" />
              <DataBlock label="m" value={String(view.m)} tone="input" />
            </div>
            {Boolean(view.bound) && <DataBlock label="source" value="backend cipher (bound)" tone="muted" />}
          </div>
        )
      case 'elgamal-decrypt':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="c1" value={String(view.c1)} tone="transform" />
              <DataBlock label="c2" value={String(view.c2)} tone="transform" />
            </div>
            <FlowArrow op="m = c2 * c1^-x mod p" />
            <DataBlock
              label="M' (integer)"
              value={view.m != null ? String(view.m) : '-'}
              tone="output"
              big
            />
          </div>
        )
      case 'elgamal-formula':
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="y" value={`g^x mod p = ${String(view.y)}`} tone="output" />
              <DataBlock label="c1" value="g^k mod p" tone="transform" />
              <DataBlock label="c2" value="m * y^k mod p" tone="output" />
            </div>
            <DataBlock label="educational" value="Parameters shown are small teaching sizes only" tone="muted" />
          </div>
        )
      default:
        return null
    }
  },
}
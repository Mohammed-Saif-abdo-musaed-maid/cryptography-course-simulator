import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hexToBytes, bytesToHex } from '../simulationShared'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'
import { desLive } from './des'

const id = 'triple_des'

const hexStrOf5 = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)

const splitKeys = (keyHex: string): { k1: string; k2: string; k3: string } => {
  const key = hexToBytes(keyHex.replace(/\s/g, ''))
  const k = (start: number, end: number): string => bytesToHex(new Uint8Array(key.slice(start, end)))
  return { k1: k(0, 8), k2: k(8, 16), k3: k(16, 24) }
}

interface TdesStage {
  stage: string
  operation: string
  key: string
  input: string
  output: string
}

interface TdesLive {
  k1: string
  k2: string
  k3: string
  stages: TdesStage[]
  formula: string
  resultHex: string
}

function tdesLive(blockHex: string, keyHex: string, decrypt: boolean): TdesLive {
  const { k1, k2, k3 } = splitKeys(keyHex)
  const etap: Array<{ op: string; key: string; label: string }> = decrypt
    ? [
        { op: 'decrypt', key: k3, label: 'D(K3)' },
        { op: 'encrypt', key: k2, label: 'E(K2)' },
        { op: 'decrypt', key: k1, label: 'D(K1)' },
      ]
    : [
        { op: 'encrypt', key: k1, label: 'E(K1)' },
        { op: 'decrypt', key: k2, label: 'D(K2)' },
        { op: 'encrypt', key: k3, label: 'E(K3)' },
      ]
  const stages: TdesStage[] = []
  let current = blockHex.replace(/\s/g, '')
  for (const e of etap) {
    const out = desLive(current, e.key, e.op === 'decrypt').resultHex
    stages.push({ stage: e.label, operation: e.op, key: e.key, input: current, output: out })
    current = out
  }
  return {
    k1,
    k2,
    k3,
    stages,
    formula: decrypt ? 'P = D(K1, E(K2, D(K3, C)))' : 'C = E(K3, D(K2, E(K1, P)))',
    resultHex: current,
  }
}

const boundStagesOf = (rows: Array<Record<string, unknown>>): TdesStage[] =>
  rows
    .map((s) => ({
      stage: hexStrOf5(s.stage) ?? '',
      operation: hexStrOf5(s.operation) ?? '',
      key: hexStrOf5(s.key) ?? '',
      input: hexStrOf5(s.input) ?? '',
      output: hexStrOf5(s.output) ?? '',
    }))
    .filter((s) => s.output)

export const tripleDesEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.triple_des.name',
  educationalKey: 'simulation.triple_des.educational',
  demoInputs: {
    block: '0123456789ABCDEF',
    key: '133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const blockHex = String(ctx.inputs.block ?? '0123456789ABCDEF').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key ?? '133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)

    let live: TdesLive | null = null
    try {
      live = tdesLive(blockHex, keyHex, decrypt)
    } catch {
      live = null
    }

    const boundStages = hasResult && Array.isArray(extra?.stages) ? boundStagesOf(extra?.stages as Array<Record<string, unknown>>) : undefined
    const stages = boundStages ?? live?.stages ?? []
    const k1 = hasResult ? (hexStrOf5(extra?.k1) ?? live?.k1 ?? '') : (live?.k1 ?? '')
    const k2 = hasResult ? (hexStrOf5(extra?.k2) ?? live?.k2 ?? '') : (live?.k2 ?? '')
    const k3 = hasResult ? (hexStrOf5(extra?.k3) ?? live?.k3 ?? '') : (live?.k3 ?? '')
    const formula = hasResult ? (hexStrOf5(extra?.formula) ?? live?.formula ?? '') : (live?.formula ?? '')
    const resultHex = hasResult ? (hexStrOf5(ctx.result?.result)?.replace(/\s/g, '') ?? live?.resultHex ?? '') : (live?.resultHex ?? '')

    const stage1 = stages[0]
    const stage2 = stages[1]
    const stage3 = stages[2]

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.triple_des.key.title',
        descKey: 'simulation.triple_des.key.desc',
        phase: 'key',
        view: { kind: 'tdes-key', block: blockHex, key: keyHex, k1, k2, k3 },
      },
      {
        id: `${id}-pass1`,
        titleKey: 'simulation.triple_des.pass1.title',
        descKey: 'simulation.triple_des.pass1.desc',
        descArgs: { op: stage1?.stage ?? 'E(K1)' },
        phase: 'transform',
        view: { kind: 'tdes-pass', stage: stage1, index: 1 },
      },
      {
        id: `${id}-pass2`,
        titleKey: 'simulation.triple_des.pass2.title',
        descKey: 'simulation.triple_des.pass2.desc',
        descArgs: { op: stage2?.stage ?? 'D(K2)' },
        phase: 'transform',
        view: { kind: 'tdes-pass', stage: stage2, index: 2 },
      },
      {
        id: `${id}-pass3`,
        titleKey: 'simulation.triple_des.pass3.title',
        descKey: 'simulation.triple_des.pass3.desc',
        descArgs: { op: stage3?.stage ?? 'E(K3)' },
        phase: 'transform',
        view: { kind: 'tdes-pass', stage: stage3, index: 3 },
      },
      {
        id: `${id}-formula`,
        titleKey: 'simulation.triple_des.formula.title',
        descKey: 'simulation.triple_des.formula.desc',
        phase: 'internal',
        view: { kind: 'tdes-formula', formula, decrypt },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.triple_des.result.dTitle' : 'simulation.triple_des.result.title',
        descKey: 'simulation.triple_des.result.desc',
        phase: 'output',
        view: { kind: 'tdes-result', hex: resultHex, decrypt },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'tdes-key':
        return (
          <div className="lab-stage-view">
            <DataBlock label="block" value={hexStrOf5(view.block) ?? ''} tone="input" big />
            <DataBlock label="key (24 bytes)" value={hexStrOf5(view.key) ?? ''} tone="key" big />
            <FlowArrow op="split" />
            <DataBlock label="K1" value={hexStrOf5(view.k1) ?? ''} tone="key" />
            <DataBlock label="K2" value={hexStrOf5(view.k2) ?? ''} tone="key" />
            <DataBlock label="K3" value={hexStrOf5(view.k3) ?? ''} tone="key" />
          </div>
        )
      case 'tdes-pass': {
        const stage = view.stage as TdesStage | undefined
        if (!stage) return null
        return (
          <div className="lab-stage-view">
            <DataBlock label="operation" value={stage.stage} tone="transform" />
            <DataBlock label="key" value={stage.key} tone="key" />
            <FlowArrow />
            <DataBlock label="input" value={stage.input} tone="input" />
            <FlowArrow />
            <DataBlock label="output" value={stage.output} tone="output" big />
          </div>
        )
      }
      case 'tdes-formula':
        return (
          <div className="lab-stage-view">
            <DataBlock label="EDE chain" value={hexStrOf5(view.formula) ?? ''} tone={view.decrypt ? 'input' : 'output'} big />
          </div>
        )
      case 'tdes-result':
        return (
          <div className="lab-stage-view">
            <DataBlock label={view.decrypt ? 'plaintext' : 'ciphertext'} value={hexStrOf5(view.hex) ?? ''} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
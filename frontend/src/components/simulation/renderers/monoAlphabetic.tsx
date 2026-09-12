import type { CharCell, SimulationContext, SimulationEngine, SimView } from '../simulationTypes'
import { monoChars, ALPHABET } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'monoalphabetic'

export const monoAlphabeticEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.monoalphabetic.name',
  demoInputs: { text: 'HELLO', substitution: 'QAZWSXEDCRFVTGBYHNUJMIKOLP' },
  build(ctx) {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const substitution = String(ctx.inputs.substitution ?? 'QAZWSXEDCRFVTGBYHNUJMIKOLP')
    const { chars, sub, inverse } = monoChars(text, substitution, decrypt)

    const pRow: CharCell[] = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === 'ignored' ? 'muted' : 'input',
      note: c.note,
    }))
    const mRow: CharCell[] = chars.map((c) => ({
      ch: c.mapped,
      tone: c.note === 'ignored' ? 'muted' : 'output',
      note: c.note,
    }))
    const finalText = chars.filter((c) => c.note !== 'ignored').map((c) => c.mapped).join('')

    const gridRows: Array<{ label?: string; cells: CharCell[] }> = [
      {
        cells: ALPHABET.split('').map((ch) => ({ ch, tone: 'input' as const })),
      },
      {
        cells: ALPHABET.split('').map((ch) => ({
          ch: decrypt ? (inverse[ALPHABET.indexOf(ch)] ?? ch) : sub[ALPHABET.indexOf(ch)],
          tone: 'transform' as const,
        })),
      },
    ]

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.monoalphabetic.key.title',
        descKey: 'simulation.monoalphabetic.key.desc',
        phase: 'key',
        view: {
          kind: 'mono-key',
          sub,
        },
      },
      {
        id: `${id}-input`,
        titleKey: 'simulation.monoalphabetic.input.title',
        descKey: 'simulation.monoalphabetic.input.desc',
        phase: 'input',
        view: {
          kind: 'mono-input',
          text,
          chars: pRow,
        },
      },
      {
        id: `${id}-mapping`,
        titleKey: 'simulation.monoalphabetic.mapping.title',
        descKey: decrypt ? 'simulation.monoalphabetic.mapping.dDesc' : 'simulation.monoalphabetic.mapping.desc',
        phase: 'transform',
        view: {
          kind: 'mono-sub-grid',
          gridRows,
        },
      },
      {
        id: `${id}-chars`,
        titleKey: decrypt ? 'simulation.monoalphabetic.chars.dTitle' : 'simulation.monoalphabetic.chars.title',
        descKey: 'simulation.monoalphabetic.chars.desc',
        phase: 'transform',
        view: {
          kind: 'mono-chars',
          pRow,
          mRow,
        },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.monoalphabetic.result.dTitle' : 'simulation.monoalphabetic.result.title',
        descKey: 'simulation.monoalphabetic.result.desc',
        phase: 'output',
        view: {
          kind: 'result',
          text: finalText,
          chars: mRow,
        },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'mono-key': {
        const sub = String(view.sub)
        return (
          <div className="lab-stage-view">
            <DataBlock label="alphabet" value={ALPHABET} tone="input" />
            <FlowArrow op="maps to" />
            <DataBlock label="substitution" value={sub} tone="key" big />
          </div>
        )
      }
      case 'mono-input': {
        const chars = view.chars as CharCell[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={[{ label: 'Input', cells: chars }]} />
          </div>
        )
      }
      case 'mono-sub-grid': {
        const gridRows = view.gridRows as Array<{ label?: string; cells: CharCell[] }>
        return (
          <div className="lab-stage-view">
            <CharRows rows={gridRows} size="sm" />
          </div>
        )
      }
      case 'mono-chars': {
        const pR = view.pRow as CharCell[]
        const mR = view.mRow as CharCell[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={[
              { label: 'P', cells: pR },
              { label: 'C', cells: mR },
            ]} />
          </div>
        )
      }
      case 'result': {
        const chars = view.chars as CharCell[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={[{ label: ctx.operation === 'decrypt' ? 'P' : 'C', cells: chars }]} />
            <FlowArrow />
            <DataBlock label="result" value={String(view.text)} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}

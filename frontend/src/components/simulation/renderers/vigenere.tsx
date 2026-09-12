import type { CharCell, SimulationContext, SimulationEngine, SimView } from '../simulationTypes'
import { vigenereChars, ALPHABET } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'vigenere'

export const vigenereEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.vigenere.name',
  demoInputs: { text: 'ATTACKATDAWN', key: 'LEMON' },
  build(ctx) {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const key = String(ctx.inputs.key ?? 'LEMON')
    const { chars, knownLetters } = vigenereChars(text, key, decrypt)

    const pRow: CharCell[] = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === 'ignored' ? 'muted' : 'input',
      note: c.note,
    }))
    const kRow: CharCell[] = chars.map((c) => ({
      ch: c.note === 'ignored' ? '' : (c.keyValue !== undefined ? ALPHABET[c.keyValue] : ''),
      tone: c.note === 'ignored' ? 'muted' : 'key',
      note: c.note,
    }))
    const cRow: CharCell[] = chars.map((c) => ({
      ch: c.mapped,
      tone: c.note === 'ignored' ? 'muted' : 'output',
      note: c.note,
    }))
    const finalText = chars.filter((c) => c.note !== 'ignored').map((c) => c.mapped).join('')

    const sign = decrypt ? '-' : '+'
    const vRow: CharCell[] = chars.map((c) => ({
      ch: c.value >= 0 ? String(c.value) : '',
      tone: c.note === 'ignored' ? 'muted' : 'input',
      note: '',
    }))
    const kvRow: CharCell[] = chars.map((c) => ({
      ch: c.keyValue !== undefined ? String(c.keyValue) : '',
      tone: c.note === 'ignored' ? 'muted' : 'key',
      note: '',
    }))
    const cvRow: CharCell[] = chars.map((c) => {
      if (c.value < 0 || c.keyValue === undefined) return { ch: '', tone: 'muted' as const, note: '' }
      const v = decrypt ? ((c.value - c.keyValue + 260) % 26) : ((c.value + c.keyValue) % 26)
      return { ch: String(v), tone: 'transform' as const, note: '' }
    })

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.vigenere.key.title',
        descKey: 'simulation.vigenere.key.desc',
        phase: 'key',
        view: { kind: 'vig-key', key: knownLetters },
      },
      {
        id: `${id}-input`,
        titleKey: 'simulation.vigenere.input.title',
        descKey: 'simulation.vigenere.input.desc',
        phase: 'input',
        view: { kind: 'vig-input', text, chars: pRow },
      },
      {
        id: `${id}-rail`,
        titleKey: 'simulation.vigenere.rail.title',
        descKey: 'simulation.vigenere.rail.desc',
        phase: 'transform',
        view: { kind: 'vig-rail', key: knownLetters, text: text.toUpperCase().replace(/[^A-Z]/g, '') },
      },
      {
        id: `${id}-chars`,
        titleKey: decrypt ? 'simulation.vigenere.chars.dTitle' : 'simulation.vigenere.chars.title',
        descKey: decrypt ? 'simulation.vigenere.chars.dDesc' : 'simulation.vigenere.chars.desc',
        descArgs: { sign },
        phase: 'transform',
        view: { kind: 'rows', rows: [
          { label: 'P', cells: pRow },
          { label: 'K', cells: kRow },
          { label: `${sign}  mod 26`, cells: cvRow },
          { label: 'P val', cells: vRow },
          { label: 'K val', cells: kvRow },
          { label: 'C', cells: cRow },
        ] },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.vigenere.result.dTitle' : 'simulation.vigenere.result.title',
        descKey: 'simulation.vigenere.result.desc',
        phase: 'output',
        view: { kind: 'result', text: finalText, chars: cRow },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'vig-key': {
        const key = String(view.key)
        return (
          <div className="lab-stage-view">
            <DataBlock label="key" value={key} tone="key" big />
          </div>
        )
      }
      case 'vig-input': {
        const chars = view.chars as CharCell[]
        return (
          <div className="lab-stage-view">
            <CharRows rows={[{ label: 'Input', cells: chars }]} />
          </div>
        )
      }
      case 'vig-rail': {
        const key = String(view.key)
        const letters = String(view.text)
        const repeated = (key + key.repeat(Math.ceil(letters.length / key.length))).slice(0, letters.length)
        return (
          <div className="lab-stage-view">
            <div className="lab-rail" dir="ltr">
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">P</span>
                {letters.split('').map((ch, i) => (
                  <span key={i} className="lab-cell lab-cell-sm tone-input">{ch}</span>
                ))}
              </div>
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">K</span>
                {repeated.split('').map((ch, i) => (
                  <span key={i} className="lab-cell lab-cell-sm tone-key">{ch}</span>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case 'rows':
        return (
          <div className="lab-stage-view">
            <CharRows rows={view.rows as Array<{ label?: string; cells: CharCell[] }>} />
          </div>
        )
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

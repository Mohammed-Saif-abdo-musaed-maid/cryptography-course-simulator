import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { caesarChars, ALPHABET } from '../simulationShared'
import { CharRows } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'caesar'

export const caesarEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.caesar.name',
  demoInputs: { text: 'HELLO WORLD', shift: 3 },
  educationalKey: 'simulation.caesar.educational',
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const shift = Number(ctx.inputs.shift ?? 3)
    const { chars, k } = caesarChars(text, shift, decrypt)
    const sign = decrypt ? '-' : '+'

    const cell = (c: (typeof chars)[number], tone: CharCell['tone']): CharCell => ({
      ch: c.mapped,
      tone,
      note: c.note ?? `${c.plain}(${c.value}) ${sign}${k} → ${c.mapped}`,
    })

    const pRow: CharCell[] = chars.map((c) => ({
      ch: c.raw,
      tone: c.note === 'ignored' ? 'muted' : 'input',
      note: c.note,
    }))
    const kRow: CharCell[] = chars.map((c) => ({
      ch: c.note === 'ignored' ? '·' : sign + String(c.keyValue ?? k),
      tone: c.note === 'ignored' ? 'muted' : 'key',
      note: '',
    }))
    const cValRow: CharCell[] = chars.map((c) => ({
      ch: c.value >= 0 ? String(modOut(c.value, sign, c.keyValue ?? 0)) : '·',
      tone: c.note === 'ignored' ? 'muted' : 'transform',
      note: '',
    }))
    const cRow: CharCell[] = chars.map((c) => cell(c, 'output'))
    const finalC = chars.filter((c) => c.note !== 'ignored').map((c) => c.mapped).join('')

    return [
      {
        id: `${id}-input`,
        titleKey: 'simulation.caesar.input.title',
        descKey: 'simulation.caesar.input.desc',
        descArgs: { shift },
        phase: 'input',
        view: {
          kind: 'caesar-input',
          text,
          shift,
          chars: pRow.map((cc) => cc.ch).join(''),
        },
      },
      {
        id: `${id}-rail`,
        titleKey: 'simulation.caesar.rail.title',
        descKey: decrypt ? 'simulation.caesar.rail.descLeft' : 'simulation.caesar.rail.desc',
        descArgs: { k },
        phase: 'transform',
        view: { kind: 'caesar-rail', alphabet: ALPHABET.split(''), k, decrypt },
      },
      {
        id: `${id}-places`,
        titleKey: 'simulation.caesar.places.title',
        descKey: 'simulation.caesar.places.desc',
        descArgs: { k, sign },
        phase: 'transform',
        view: { kind: 'rows', rows: [
          { label: 'P', cells: pRow },
          { label: 'k', cells: kRow },
          { label: 'mod 26', cells: cValRow },
          { label: 'C', cells: cRow },
        ] },
      },
      {
        id: `${id}-chars`,
        titleKey: decrypt ? 'simulation.caesar.chars.dTitle' : 'simulation.caesar.chars.title',
        descKey: 'simulation.caesar.chars.desc',
        descArgs: { k, sign },
        phase: 'transform',
        view: { kind: 'rows', rows: [
          { label: 'P', cells: pRow },
          { label: 'C', cells: cRow },
        ] },
      },
      {
        id: `${id}-result`,
        titleKey: decrypt ? 'simulation.caesar.result.dTitle' : 'simulation.caesar.result.title',
        descKey: decrypt ? 'simulation.caesar.result.desc' : 'simulation.caesar.result.desc',
        descArgs: { out: finalC },
        phase: 'output',
        view: { kind: 'result', text: finalC, chars: cRow },
      },
    ]
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'caesar-input': {
        const text = String(view.text)
        return (
          <div className="lab-stage-view">
            <DataBlock label="k" value={String(view.shift)} tone="key" big />
            <CharRows rows={[{ label: 'Input', cells: text.split('').map((ch) => ({ ch, tone: 'input' })) }]} />
          </div>
        )
      }
      case 'caesar-rail': {
        const alphabet = view.alphabet as string[]
        const k = Number(view.k)
        const decrypt = Boolean(view.decrypt)
        const shifted = alphabet.map((_, i) =>
          decrypt ? alphabet[(i - k + 26 * 100) % 26] : alphabet[(i + k) % 26],
        )
        return (
          <div className="lab-stage-view">
            <div className="lab-rail" dir="ltr">
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">{decrypt ? 'P' : 'C'}</span>
                {shifted.map((ch, i) => (
                  <span key={i} className={`lab-cell lab-cell-sm tone-transform`}>{ch}</span>
                ))}
              </div>
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">idx</span>
                {Array.from({ length: 26 }, (_, i) => <span className="lab-rail-guide" key={i}>{i}</span>)}
              </div>
              <div className="lab-rail-row">
                <span className="lab-rail-rowlabel">{decrypt ? 'C' : 'P'}</span>
                {alphabet.map((ch, i) => (
                  <span key={i} className={`lab-cell lab-cell-sm tone-input`}>{ch}</span>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case 'rows':
        return (
          <div className="lab-stage-view">
            <CharRows
              rows={(view.rows as Array<{ label?: string; cells: CharCell[] }>)}
            />
          </div>
        )
      case 'result':
        return (
          <div className="lab-stage-view">
            <CharRows rows={[{ label: '→', cells: view.chars as CharCell[] }]} />
            <FlowArrow />
            <DataBlock label="result" value={String(view.text)} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}

function modOut(v: number, sign: string, k: number): number {
  const m = sign === '-' ? v - k : v + k
  return ((m % 26) + 26) % 26
}
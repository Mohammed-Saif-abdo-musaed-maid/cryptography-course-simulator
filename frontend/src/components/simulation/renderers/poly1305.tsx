import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'poly1305'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function hexCells(hex: string, tone: 'input' | 'key' | 'internal' | 'output' | 'transform' | 'muted'): Array<{ ch: string; tone: typeof tone }> {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone }))
}

export const poly1305Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.poly1305.name',
  educationalKey: 'simulation.poly1305.educational',
  demoInputs: {
    message: 'Cryptographic Forum Research Group',
    key_hex: '85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b',
  },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const keyHex = String(ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const macHex = hasResult ? hexStr(extra?.mac_hex) : ''
    const rHex = extra && hasResult ? hexStr(extra?.r_hex) : keyHex.slice(0, 32)
    const sHex = extra && hasResult ? hexStr(extra?.s_hex) : keyHex.slice(32, 64)
    const data = strToBytes(message)
    const blockCount = data.length ? Math.ceil(data.length / 16) : 0

    const clamped = extra && hasResult ? hexStr(extra?.r_clamped_hex) : ''
    const accStates = Array.isArray(extra?.accumulator_states) ? (extra.accumulator_states as string[]) : []
    const cap = Math.min(4, blockCount)
    const rows: Array<{ label: string; cells: ReturnType<typeof hexCells> }> = []
    if (hasResult && accStates.length > 0) {
      for (let i = 0; i < Math.min(cap, accStates.length); i++) {
        rows.push({
          label: `acc${i}`,
          cells: hexCells(accStates[i], 'internal'),
        })
      }
    } else {
      for (let b = 0; b < cap; b++) {
        const chunk = data.subarray(b * 16, (b + 1) * 16)
        rows.push({
          label: `b${b}`,
          cells: (Array.from(chunk).map((x) => x.toString(16).padStart(2, '0')).join('').match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone: 'internal' as const })),
        })
      }
    }
    if (blockCount > cap) rows.push({ label: '…', cells: [{ ch: `+${blockCount - cap}`, tone: 'muted' as const }] })

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.poly1305.key.title',
        descKey: 'simulation.poly1305.key.desc',
        phase: 'key',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: `${id}-key`, r: rHex, s: sHex, clamped, hasResult },
      },
      {
        id: `${id}-blocks`,
        titleKey: 'simulation.poly1305.blocks.title',
        descKey: 'simulation.poly1305.blocks.desc',
        descArgs: { blocks: blockCount },
        phase: 'transform',
        traceIndex: hasResult ? 2 : undefined,
        view: { kind: `${id}-blocks`, rows, hasResult },
      },
      {
        id: `${id}-poly`,
        titleKey: 'simulation.poly1305.poly.title',
        descKey: 'simulation.poly1305.poly.desc',
        phase: 'transform',
        traceIndex: hasResult ? 3 : undefined,
        view: { kind: `${id}-poly`, hasResult, accStates },
      },
      {
        id: `${id}-tag`,
        titleKey: 'simulation.poly1305.tag.title',
        descKey: 'simulation.poly1305.tag.desc',
        phase: 'output',
        traceIndex: hasResult ? 4 : undefined,
        view: { kind: `${id}-tag`, mac: macHex, hasResult },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case `${id}-key`:
        return (
          <div className="lab-stage-view">
            <CharRow label="r (16B)" size="sm" cells={hexCells(hexStr(view.r), 'key')} />
            <CharRow label="s (16B)" size="sm" cells={hexCells(hexStr(view.s), 'key')} />
            <FlowArrow op="r is clamped before use" />
            {Boolean(view.hasResult) && hexStr(view.clamped) && (
              <CharRow label="r clamped" size="sm" cells={hexCells(hexStr(view.clamped), 'internal')} />
            )}
          </div>
        )
      case `${id}-blocks`: {
        const rows = (view.rows as Array<{ label: string; cells: Array<{ ch: string; tone: string }> }>) ?? []
        const cast = rows as unknown as Array<{ label: string; cells: Array<{ ch: string; tone: 'internal' | 'muted' }> }>
        return (
          <div className="lab-stage-view">
            {rows.length > 0 ? (
              <div className="lab-rows">
                {cast.map((r, i) => (
                  <CharRow key={i} label={r.label} size="sm" cells={r.cells} />
                ))}
              </div>
            ) : (
              <DataBlock label="blocks" value="message split into 16-byte little-endian blocks + 2¹²⁸ bit" tone="muted" />
            )}
          </div>
        )
      }
      case `${id}-poly`:
        return (
          <div className="lab-stage-view">
            <FlowArrow op="acc = (acc + block)·r mod 2¹³⁰ − 5" />
            {(view.accStates as string[] | undefined)?.length ? (
              <DataBlock
                label="real accumulator states"
                value={(view.accStates as string[]).join(' → ')}
                tone="internal"
              />
            ) : (
              <DataBlock label="accumulator" value={view.hasResult ? 'computed by the server execution' : 'structural'} tone={view.hasResult ? 'internal' : 'muted'} />
            )}
            <FlowArrow op="tag = (acc + s) mod 2¹²⁸" />
          </div>
        )
      case `${id}-tag`: {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label="Poly1305 tag" value={has ? hexStr(view.mac) : '—'} tone={has ? 'output' : 'muted'} big />
            {has && (
              <p className="lab-note lab-note-warn">One-time key: reusing (r, s) for two messages allows forgery.</p>
            )}
          </div>
        )
      }
      default:
        return null
    }
  },
}
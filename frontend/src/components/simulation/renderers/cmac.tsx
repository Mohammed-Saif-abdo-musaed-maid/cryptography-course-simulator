import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'cmac'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function hexCells(hex: string, tone: 'input' | 'key' | 'internal' | 'output' | 'transform' | 'muted'): Array<{ ch: string; tone: typeof tone }> {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone }))
}

export const cmacEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.cmac.name',
  educationalKey: 'simulation.cmac.educational',
  demoInputs: { message: 'Important message', key_hex: '2b7e151628aed2a6abf7158809cf4f3c' },
  build(ctx): SimStage[] {
    const message = String(ctx.inputs.message ?? '')
    const keyHex = String(ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const ks = extra && typeof extra.key_size === 'number' ? extra.key_size : (keyHex.length / 2) * 8
    const macHex = hasResult ? hexStr(extra?.mac_hex) : ''
    const macSize = extra && typeof extra.mac_size === 'number' ? extra.mac_size : 0
    const data = strToBytes(message)
    const blockCount = Math.max(0, Math.floor(data.length / 16))
    const finalFull = data.length > 0 && data.length % 16 === 0

    const k1 = hexStr(extra?.k1_hex)
    const k2 = hexStr(extra?.k2_hex)
    const macStates = Array.isArray(extra?.mac_states) ? (extra.mac_states as Record<string, unknown>[]) : []
    const finalBlock = hexStr(extra?.final_block_hex)

    const blockRows = (() => {
      const cap = Math.min(4, Math.ceil(data.length / 16))
      const rows: Array<{ label: string; cells: ReturnType<typeof hexCells> }> = []
      if (hasResult && macStates.length > 0) {
        for (const s of macStates) {
          const x = String(s.output ?? '')
          rows.push({
            label: `X${String(s.block ?? 0)}`,
            cells: x.match(/.{2}/g)?.map((h) => ({ ch: h, tone: 'internal' as const })) ?? [],
          })
        }
        return rows.slice(0, 4)
      }
      for (let b = 0; b < cap; b++) {
        const chunk = data.subarray(b * 16, (b + 1) * 16)
        rows.push({
          label: `M${b}`,
          cells: (Array.from(chunk).map((x) => x.toString(16).padStart(2, '0')).join('').match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone: 'internal' as const })),
        })
      }
      if (data.length > cap * 16) rows.push({ label: '…', cells: [{ ch: `+${Math.floor(data.length / 16) - cap}`, tone: 'muted' as const }] })
      return rows
    })()

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.cmac.key.title',
        descKey: 'simulation.cmac.key.desc',
        descArgs: { bits: ks },
        phase: 'key',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: `${id}-key`, key: keyHex, k1, k2, hasResult },
      },
      {
        id: `${id}-chain`,
        titleKey: 'simulation.cmac.chain.title',
        descKey: 'simulation.cmac.chain.desc',
        descArgs: { blocks: blockCount },
        phase: 'transform',
        traceIndex: hasResult ? 2 : undefined,
        view: { kind: `${id}-chain`, rows: blockRows, hasResult, macStates },
      },
      {
        id: `${id}-mask`,
        titleKey: 'simulation.cmac.mask.title',
        descKey: 'simulation.cmac.mask.desc',
        descArgs: { mask: finalFull ? 'complete → XOR K1' : 'partial → pad 0x80‖0…, XOR K2' },
        phase: 'transform',
        traceIndex: hasResult ? 3 : undefined,
        view: { kind: `${id}-mask`, finalFull, finalBlock, k1, k2, hasResult },
      },
      {
        id: `${id}-tag`,
        titleKey: 'simulation.cmac.tag.title',
        descKey: 'simulation.cmac.tag.desc',
        descArgs: { size: macSize },
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
            <DataBlock label="key (hex)" value={hexStr(view.key)} tone="key" big />
            <FlowArrow op="doubling in GF(2¹²⁸)" />
            {Boolean(view.hasResult) && hexStr(view.k1) ? (
              <>
                <DataBlock label="subkey K1 = dbl(E_K(0¹²⁸))" value={hexStr(view.k1)} tone="internal" />
                <DataBlock label="subkey K2 = dbl(K1)" value={hexStr(view.k2)} tone="internal" />
              </>
            ) : (
              <DataBlock label="subkeys" value="K1 = dbl(E_K(0¹²⁸)); K2 = dbl(K1)" tone="internal" />
            )}
          </div>
        )
      case `${id}-chain`: {
        const rows = (view.rows as Array<{ label: string; cells: Array<{ ch: string; tone: string }> }>) ?? []
        const cast = rows as unknown as Array<{ label: string; cells: Array<{ ch: string; tone: 'internal' | 'muted' }> }>
        return (
          <div className="lab-stage-view">
            {view.hasResult ? (
              <div className="lab-rows">
                {cast.map((r, i) => (
                  <CharRow key={i} label={r.label} size="sm" cells={r.cells} />
                ))}
              </div>
            ) : (
              <DataBlock label="chain" value="Xᵢ = E_K(Xᵢ₋₁ ⊕ Mᵢ) — CBC-MAC over 16-byte blocks" tone="muted" />
            )}
          </div>
        )
      }
      case `${id}-mask`:
        return (
          <div className="lab-stage-view">
            <FlowArrow op="final masking" />
            <DataBlock
              label="last block"
              value={view.finalFull ? 'complete → XOR K1' : 'partial → pad 0x80‖0…, XOR K2'}
              tone="transform"
            />
            {Boolean(view.hasResult) && hexStr(view.finalBlock) && (
              <DataBlock
                label="real final block (before masking)"
                value={hexStr(view.finalBlock)}
                tone="internal"
              />
            )}
            {Boolean(view.hasResult) && (
              <DataBlock
                label="mask applied"
                value={view.finalFull ? `K1 = ${hexStr(view.k1)}` : `K2 = ${hexStr(view.k2)}`}
                tone="internal"
              />
            )}
          </div>
        )
      case `${id}-tag`: {
        const has = Boolean(view.hasResult)
        return (
          <div className="lab-stage-view">
            <DataBlock label="CMAC tag" value={has ? hexStr(view.mac) : '—'} tone={has ? 'output' : 'muted'} big />
            {has && <p className="lab-note">CMAC authenticates integrity — it does not encrypt the message.</p>}
          </div>
        )
      }
      default:
        return null
    }
  },
}
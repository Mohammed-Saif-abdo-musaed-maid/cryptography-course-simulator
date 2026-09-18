import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'camellia'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function hexCells(hex: string, tone: 'input' | 'key' | 'internal' | 'output' | 'transform'): Array<{ ch: string; tone: typeof tone }> {
  return (hex.match(/.{2}/g) ?? []).map((h) => ({ ch: h, tone }))
}

export const camelliaEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.camellia.name',
  educationalKey: 'simulation.camellia.educational',
  demoInputs: {
    block: '0123456789abcdeffedcba9876543210',
    key: '000102030405060708090a0b0c0d0e0f',
  },
  build(ctx): SimStage[] {
    const decrypt = ctx.operation === 'decrypt'
    const block = String(ctx.inputs.block ?? ctx.inputs.block_hex ?? '').replace(/\s/g, '')
    const keyHex = String(ctx.inputs.key ?? ctx.inputs.key_hex ?? '').replace(/\s/g, '')
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const hasResult = !!(ctx.result && ctx.resultMatches)
    const ks = extra && typeof extra.key_size === 'number' ? extra.key_size : (keyHex.length / 2) * 8
    const roundCount = extra && typeof extra.rounds === 'number' ? extra.rounds : (keyHex.length === 16 ? 18 : 24)
    const outBlock = hasResult
      ? hexStr(decrypt ? extra?.plaintext_block : extra?.ciphertext_block)
      : ''

    return [
      {
        id: `${id}-key`,
        titleKey: 'simulation.camellia.key.title',
        descKey: decrypt ? 'simulation.camellia.key.dDesc' : 'simulation.camellia.key.desc',
        descArgs: { bits: ks, rounds: roundCount },
        phase: 'key',
        traceIndex: hasResult ? 1 : undefined,
        view: { kind: `${id}-key`, block, key: keyHex, decrypt },
      },
      {
        id: `${id}-schedule`,
        titleKey: 'simulation.camellia.schedule.title',
        descKey: 'simulation.camellia.schedule.desc',
        descArgs: { bits: ks },
        phase: 'transform',
        traceIndex: hasResult ? 2 : undefined,
        view: { kind: `${id}-schedule`, hasResult },
      },
      {
        id: `${id}-rounds`,
        titleKey: 'simulation.camellia.rounds.title',
        descKey: 'simulation.camellia.rounds.desc',
        descArgs: { rounds: roundCount },
        phase: 'transform',
        traceIndex: hasResult ? 3 : undefined,
        view: { kind: `${id}-rounds`, input: block, output: outBlock, hasResult, decrypt, rounds: roundCount },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.camellia.result.title',
        descKey: decrypt ? 'simulation.camellia.result.dDesc' : 'simulation.camellia.result.desc',
        phase: 'output',
        traceIndex: hasResult ? 4 : undefined,
        view: { kind: `${id}-result`, out: outBlock, hasResult, decrypt },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case `${id}-key`:
        return (
          <div className="lab-stage-view">
            <CharRow label="block (128b)" size="sm" cells={hexCells(hexStr(view.block), 'input')} />
            <CharRow label="key" size="sm" cells={hexCells(hexStr(view.key), 'key')} />
            <DataBlock label="structure" value="Feistel network · 128-bit blocks · 128/192/256-bit keys" tone="internal" />
          </div>
        )
      case `${id}-schedule`:
        return (
          <div className="lab-stage-view">
            <FlowArrow op="key schedule" />
            <DataBlock label="subkeys" value="KL ‖ KA (rotations + constant XORs) → round subkeys + FL/FL⁻¹ keys" tone="internal" />
          </div>
        )
      case `${id}-rounds`:
        return (
          <div className="lab-stage-view">
            {view.hasResult ? (
              <div className="lab-rows">
                <CharRow label="in" size="sm" cells={hexCells(hexStr(view.input), 'input')} />
                <FlowArrow op="F = S1..S4 then P" />
                <CharRow label="out" size="sm" cells={hexCells(hexStr(view.output), 'output')} />
              </div>
            ) : (
              <DataBlock label="rounds" value={`${String(view.rounds)} Feistel rounds (18 for 128-bit keys, 24 otherwise)`} tone="muted" />
            )}
          </div>
        )
      case `${id}-result`:
        return (
          <div className="lab-stage-view">
            <DataBlock
              label={view.decrypt ? 'plaintext (hex)' : 'ciphertext (hex)'}
              value={view.hasResult ? hexStr(view.out) : '—'}
              tone={view.hasResult ? 'output' : 'muted'}
              big
            />
            <p className="lab-note">Single-block ECB primitive — real-world use needs a mode (CBC/CTR/GCM).</p>
          </div>
        )
      default:
        return null
    }
  },
}
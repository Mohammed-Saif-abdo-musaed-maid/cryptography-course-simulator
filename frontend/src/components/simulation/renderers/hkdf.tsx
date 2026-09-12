import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hkdfSha256, strToBytes, bytesToHex } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'hkdf'

function hexCells(hex: string, tone: CharCell['tone'], cap: number): CharCell[] {
  const cells: CharCell[] = []
  for (let i = 0; i + 1 < hex.length && cells.length < cap; i += 2) {
    cells.push({ ch: hex.slice(i, i + 2), tone })
  }
  const bytes = hex.length / 2
  if (bytes > cap) cells.push({ ch: `+${bytes - cap}`, tone: 'muted' })
  return cells
}

export const hkdfEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.hkdf.name',
  demoInputs: { ikm: 'shared secret', salt: 'salt', info: 'context', length: 32 },
  educationalKey: 'simulation.hkdf.educational',
  build(ctx) {
    const ikm = String(ctx.inputs.ikm ?? '')
    const salt = String(ctx.inputs.salt ?? '')
    const info = String(ctx.inputs.info ?? '')
    const length = Math.max(1, Math.round(Number(ctx.inputs.length ?? 32)))
    const { prk, outHex, blocks } = hkdfSha256(ikm, salt, info, length)

    const ikmLen = strToBytes(ikm).length
    const saltHex = bytesToHex(strToBytes(salt))
    const saltLen = saltHex.length / 2
    const infoLen = strToBytes(info).length

    const stages: SimStage[] = [
      {
        id: `${id}-input`,
        titleKey: 'simulation.hkdf.input.title',
        descKey: 'simulation.hkdf.input.desc',
        descArgs: { ikmLen, saltLen, infoLen, length },
        phase: 'input',
        view: { kind: 'hkdf-input', ikmLen, saltHex, saltLen, infoLen, length },
      },
      {
        id: `${id}-extract`,
        titleKey: 'simulation.hkdf.extract.title',
        descKey: 'simulation.hkdf.extract.desc',
        descArgs: { saltLen, ikmLen },
        phase: 'key',
        view: { kind: 'hkdf-extract', prk, saltHex },
      },
      {
        id: `${id}-expand`,
        titleKey: 'simulation.hkdf.expand.title',
        descKey: 'simulation.hkdf.expand.desc',
        descArgs: { blocks: blocks.length, length },
        phase: 'internal',
        view: { kind: 'hkdf-expand', blocks, info },
      },
      {
        id: `${id}-concat`,
        titleKey: 'simulation.hkdf.concat.title',
        descKey: 'simulation.hkdf.concat.desc',
        descArgs: { blocks: blocks.length, length },
        phase: 'transform',
        view: { kind: 'hkdf-concat', blocks, length, outHex },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.hkdf.result.title',
        descKey: 'simulation.hkdf.result.desc',
        descArgs: { length },
        phase: 'output',
        view: { kind: 'hkdf-result', outHex },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'hkdf-input': {
        const ikmLen = Number(view.ikmLen)
        const saltHex = String(view.saltHex)
        const saltLen = Number(view.saltLen)
        const infoLen = Number(view.infoLen)
        const length = Number(view.length)
        return (
          <div className="lab-stage-view">
            <DataBlock label="ikm (bytes)" value={String(ikmLen)} tone="key" />
            <CharRow label="salt" size="sm" cells={hexCells(saltHex, 'input', 24)} />
            <DataBlock label="salt (bytes)" value={String(saltLen)} tone="muted" />
            <DataBlock label="info (bytes)" value={String(infoLen)} tone="muted" />
            <DataBlock label="output length" value={String(length)} tone="transform" />
          </div>
        )
      }
      case 'hkdf-extract': {
        const prk = String(view.prk)
        const saltHex = String(view.saltHex)
        return (
          <div className="lab-stage-view">
            <DataBlock label="PRK = HMAC-SHA-256(salt, ikm)" value="" tone="key" />
            <CharRow label="salt" size="sm" cells={hexCells(saltHex, 'key', 24)} />
            <FlowArrow />
            <DataBlock label="PRK (32 bytes)" value={prk} tone="internal" big />
          </div>
        )
      }
      case 'hkdf-expand': {
        const blocks = view.blocks as string[]
        const info = String(view.info)
        const shown = blocks.slice(0, 6)
        return (
          <div className="lab-stage-view">
            {shown.map((b, i) => (
              <div key={i} className="lab-stage-view">
                <CharRow
                  label={`T${i + 1} = HMAC(PRK, T${i} || info || 0x${(i + 1).toString(16).padStart(2, '0')})`}
                  size="sm"
                  cells={hexCells(b, 'transform', 16)}
                />
                <DataBlock label={`T${i + 1}`} value={b} tone="internal" />
              </div>
            ))}
            {blocks.length > shown.length && (
              <p className="lab-note">+{blocks.length - shown.length} further block(s) not drawn …</p>
            )}
            {info.length > 0 && <p className="lab-note">info {JSON.stringify(info)} mixed into every T block</p>}
          </div>
        )
      }
      case 'hkdf-concat': {
        const blocks = view.blocks as string[]
        const length = Number(view.length)
        const outHex = String(view.outHex)
        return (
          <div className="lab-stage-view">
            {blocks.map((b, i) => (
              <DataBlock key={i} label={`T${i + 1}`} value={b} tone="internal" />
            ))}
            <FlowArrow />
            <DataBlock label={`concatenated → first ${length} bytes`} value={outHex} tone="output" />
          </div>
        )
      }
      case 'hkdf-result': {
        const outHex = String(view.outHex)
        return (
          <div className="lab-stage-view">
            <DataBlock label="OKM" value={outHex} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}
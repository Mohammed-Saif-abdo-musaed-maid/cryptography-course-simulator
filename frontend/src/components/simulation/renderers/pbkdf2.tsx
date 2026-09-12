import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { pbkdf2Sha256, hmacSha256, strToBytes, bytesToHex } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'pbkdf2'

function hexCells(hex: string, tone: CharCell['tone'], cap: number): CharCell[] {
  const cells: CharCell[] = []
  for (let i = 0; i + 1 < hex.length && cells.length < cap; i += 2) {
    cells.push({ ch: hex.slice(i, i + 2), tone })
  }
  const bytes = hex.length / 2
  if (bytes > cap) cells.push({ ch: `+${bytes - cap}`, tone: 'muted' })
  return cells
}

interface LoopRow {
  n: number
  u: string
  xor: string
}

function leadingLoopRows(password: string, salt: string, count: number): LoopRow[] {
  const saltBytes = strToBytes(salt)
  const base = new Uint8Array(saltBytes.length + 4)
  base.set(saltBytes)
  base[base.length - 4] = 0
  base[base.length - 3] = 0
  base[base.length - 2] = 0
  base[base.length - 1] = 1
  let ui = hmacSha256(password, base)
  const acc = new Uint8Array(ui.length)
  acc.set(ui)
  const rows: LoopRow[] = [{ n: 1, u: bytesToHex(ui), xor: bytesToHex(acc) }]
  for (let n = 2; n <= count; n++) {
    ui = hmacSha256(password, ui)
    for (let i = 0; i < acc.length; i++) acc[i] ^= ui[i]
    rows.push({ n, u: bytesToHex(ui), xor: bytesToHex(acc) })
  }
  return rows
}

export const pbkdf2Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.pbkdf2.name',
  demoInputs: { password: 'correct horse battery staple', salt: 'salty', iterations: 1000, key_length: 32 },
  educationalKey: 'simulation.pbkdf2.educational',
  build(ctx) {
    const password = String(ctx.inputs.password ?? '')
    const salt = String(ctx.inputs.salt ?? '')
    const iterations = Math.max(1, Math.round(Number(ctx.inputs.iterations ?? 100000)))
    const keyLength = Math.max(1, Math.min(64, Math.round(Number(ctx.inputs.key_length ?? 32))))
    const hashLen = 32
    const totalBlocks = Math.max(1, Math.ceil(keyLength / hashLen))
    const { dkHex, blockDigests, u1 } = pbkdf2Sha256(password, salt, iterations, keyLength)

    const pwBytes = strToBytes(password).length
    const saltHex = bytesToHex(strToBytes(salt))
    const saltLen = saltHex.length / 2

    const shownCount = iterations <= 6 ? iterations : 3
    const rows = leadingLoopRows(password, salt, shownCount)
    const more = Math.max(0, iterations - shownCount)
    const finalBlock = blockDigests[0] ?? ''

    const stages: SimStage[] = [
      {
        id: `${id}-input`,
        titleKey: 'simulation.pbkdf2.input.title',
        descKey: 'simulation.pbkdf2.input.desc',
        descArgs: { pwBytes, saltLen },
        phase: 'input',
        view: { kind: 'pbkdf2-input', pwBytes, saltHex, saltLen },
      },
      {
        id: `${id}-params`,
        titleKey: 'simulation.pbkdf2.params.title',
        descKey: 'simulation.pbkdf2.params.desc',
        descArgs: { iterations, keyLength, blocks: totalBlocks },
        phase: 'key',
        view: { kind: 'pbkdf2-params', iterations, keyLength, hashLen, blocks: totalBlocks },
      },
      {
        id: `${id}-u1`,
        titleKey: 'simulation.pbkdf2.u1.title',
        descKey: 'simulation.pbkdf2.u1.desc',
        phase: 'transform',
        view: { kind: 'pbkdf2-u1', u1 },
      },
      {
        id: `${id}-loop`,
        titleKey: 'simulation.pbkdf2.loop.title',
        descKey: 'simulation.pbkdf2.loop.desc',
        descArgs: { shown: shownCount, more, iterations },
        phase: 'internal',
        view: { kind: 'pbkdf2-loop', rows, more, iterations, finalBlock },
      },
      {
        id: `${id}-assemble`,
        titleKey: 'simulation.pbkdf2.assemble.title',
        descKey: 'simulation.pbkdf2.assemble.desc',
        descArgs: { blocks: totalBlocks, keyLength },
        phase: 'transform',
        view: { kind: 'pbkdf2-assemble', blockDigests, keyLength, dkHex },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.pbkdf2.result.title',
        descKey: 'simulation.pbkdf2.result.desc',
        descArgs: { keyLength },
        phase: 'output',
        view: { kind: 'pbkdf2-result', dkHex },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'pbkdf2-input': {
        const pwBytes = Number(view.pwBytes)
        const saltHex = String(view.saltHex)
        const saltLen = Number(view.saltLen)
        return (
          <div className="lab-stage-view">
            <DataBlock label="password (bytes)" value={String(pwBytes)} tone="input" />
            <CharRow label="salt" size="sm" cells={hexCells(saltHex, 'input', 24)} />
            <DataBlock label="salt (bytes)" value={String(saltLen)} tone="muted" />
          </div>
        )
      }
      case 'pbkdf2-params': {
        const iterations = Number(view.iterations)
        const keyLength = Number(view.keyLength)
        const hashLen = Number(view.hashLen)
        const blocks = Number(view.blocks)
        return (
          <div className="lab-stage-view">
            <DataBlock label="PRF" value="HMAC-SHA-256" tone="key" />
            <DataBlock label="iterations" value={String(iterations)} tone="key" big />
            <DataBlock label="hash size" value={`${hashLen} bytes`} tone="internal" />
            <DataBlock label="output" value={`${blocks} × ${hashLen} bytes → ${keyLength}`} tone="transform" />
          </div>
        )
      }
      case 'pbkdf2-u1': {
        const u1 = String(view.u1)
        return (
          <div className="lab-stage-view">
            <CharRow label="U1" size="sm" cells={hexCells(u1, 'transform', 32)} />
            <DataBlock label="U1 (hex)" value={u1} tone="internal" />
          </div>
        )
      }
      case 'pbkdf2-loop': {
        const rows = view.rows as LoopRow[]
        const more = Number(view.more)
        const iterations = Number(view.iterations)
        const finalBlock = String(view.finalBlock)
        return (
          <div className="lab-stage-view">
            {rows.map((r) => (
              <div key={r.n} className="lab-stage-view">
                <CharRow label={`U${r.n} = HMAC(password, U${r.n - 1})`} size="sm" cells={hexCells(r.u, 'transform', 16)} />
                <CharRow label={`T = XOR(U1..U${r.n})`} size="sm" cells={hexCells(r.xor, 'internal', 16)} />
              </div>
            ))}
            {more > 0 && <p className="lab-note">+{more} more iteration(s) not drawn …</p>}
            <FlowArrow />
            <CharRow label={`DK block (XOR of U1..U${iterations})`} size="sm" cells={hexCells(finalBlock, 'output', 16)} />
          </div>
        )
      }
      case 'pbkdf2-assemble': {
        const blockDigests = view.blockDigests as string[]
        const keyLength = Number(view.keyLength)
        const dkHex = String(view.dkHex)
        return (
          <div className="lab-stage-view">
            {blockDigests.map((b, i) => (
              <DataBlock key={i} label={`block ${i + 1}`} value={b} tone="internal" />
            ))}
            {blockDigests.length > 1 && (
              <>
                <FlowArrow />
                <DataBlock label={`concatenated → truncated to ${keyLength}`} value={dkHex} tone="output" />
              </>
            )}
            {blockDigests.length === 1 && blockDigests[0] !== undefined && (
              <DataBlock label="= derived key" value={dkHex} tone="output" />
            )}
          </div>
        )
      }
      case 'pbkdf2-result': {
        const dkHex = String(view.dkHex)
        return (
          <div className="lab-stage-view">
            <DataBlock label="DK" value={dkHex} tone="output" big />
          </div>
        )
      }
      default:
        return null
    }
  },
}
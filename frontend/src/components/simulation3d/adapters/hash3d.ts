// Shared scene builders used by the hash 3D adapters (sha256, sha512, sha1,
// md5, sha3, blake2, blake3) and the KDF family.
import { charRow, gridObject, hexStrip, rows3D, valuePlate } from './scene'
import type { CellProps } from './scene'
import type { ResolvedObject3D, Vec3 } from '../types/simulation3d'

type Tone = CellProps['tone']

/** Message + bytes input view for hash-family adapters. */
export function msgInputScene(text: string, bytesHex: string): ResolvedObject3D[] {
  const chars = (text || '·').split('')
  return [
    ...charRow('msg', chars.map((ch) => ({ label: ch, tone: 'input' })), [0, 0.6, -2.2], {
      cellSize: 0.72,
      gap: 0.09,
    }).objects,
    ...valuePlate('hex', [0, -0.3, 1.6], 'bytes', bytesHex.toUpperCase(), 'input'),
  ]
}

/** Padded block rows: message bytes internal, pad bytes key. */
export function padRowsScene(
  blocksHex: string[],
  msgLen: number,
  opts: { piece?: number; msgBytesPerBlock?: number } = {},
): ResolvedObject3D[] {
  const piece = opts.piece ?? 2
  const blockBytes = opts.msgBytesPerBlock ?? 64
  const rows = blocksHex.map((block, bi) => ({
    label: `block ${bi}`,
    cells: (block.match(new RegExp(`.{${piece}}`, 'g')) ?? []).map((h, i): CellProps => ({
      label: h.toUpperCase(),
      tone: bi * blockBytes + i * piece < msgLen ? 'internal' : 'key',
    })),
  }))
  return rows3D(rows, [0, 0, 0], { rowStep: 2.4, cellSize: 0.52, gap: 0.03 }).objects
}

/** A row of 8-hex words (h-state, chaining vectors). */
export function wordLaneScene(idPrefix: string, words: string[], tone: Tone, origin: Vec3): ResolvedObject3D[] {
  const cells: CellProps[] = (words ?? []).map((w) => ({ label: w.toUpperCase(), tone }))
  return charRow(idPrefix, cells, origin, { cellSize: 0.62, gap: 0.05, cubeY: 0.3, glyphY: 1 }).objects
}

/** Spheres on a horizontal ring; `samples` get the active tone. */
export function roundRingScene(
  idPrefix: string,
  count: number,
  opts: { samples?: number[]; radius?: number; note?: string; tone?: Tone } = {},
): ResolvedObject3D[] {
  const radius = opts.radius ?? 6.5
  const samples = new Set(opts.samples ?? [])
  const tone = opts.tone ?? 'internal'
  const objs: ResolvedObject3D[] = [
    {
      id: `${idPrefix}-orbit`,
      kind: 'ring',
      position: [0, 0.4, 0],
      ringRadius: radius,
      ringTube: 0.08,
      tone: 'path',
    },
  ]
  for (let i = 0; i < count; i++) {
    const a = i * ((Math.PI * 2) / count)
    const r = samples.has(i) ? radius * 0.96 : radius
    objs.push({
      id: `${idPrefix}-${i}`,
      kind: 'sphere',
      position: [r * Math.cos(a), 0.55, r * Math.sin(a)],
      size: samples.has(i) ? [0.5, 0.5, 0.5] : [0.34, 0.34, 0.34],
      tone: samples.has(i) ? 'active' : tone,
      emphasize: samples.has(i),
    })
  }
  const cap = opts.note ?? `${count} rounds`
  objs.push(...valuePlate(`${idPrefix}-cap`, [0, 2.5, -radius * 0.9], 'rounds', cap, 'transform'))
  return objs
}

/** Keccak-style 5×5 lanes; first `rateLanes` cells are the rate region. */
export function lanesScene(
  idPrefix: string,
  opts: { rateLanes?: number; values?: string[]; tone?: Tone } = {},
): ResolvedObject3D[] {
  const rateLanes = opts.rateLanes ?? 0
  const rows: CellProps[][] = []
  for (let y = 0; y < 5; y++) {
    const row: CellProps[] = []
    for (let x = 0; x < 5; x++) {
      const idx = y * 5 + x
      row.push({ label: opts.values?.[idx] ?? '·', tone: idx < rateLanes ? opts.tone ?? 'internal' : 'key' })
    }
    rows.push(row)
  }
  return [gridObject(idPrefix, rows, { cellSize: 1.15, gap: 0.14, labelScale: 0.9, height: 1.4 })]
}

/** Round-dot strip: first `active` dots are output (reversible XOF view). */
export function byteCountScene(idPrefix: string, count: number, active: number, note: string): ResolvedObject3D[] {
  const gap = 0.16
  const cellSize = 0.42
  const off = ((count - 1) * (cellSize + gap)) / 2
  const objs: ResolvedObject3D[] = []
  for (let i = 0; i < count; i++) {
    const on = i < active
    const x = -off + i * (cellSize + gap)
    objs.push(
      {
        id: `${idPrefix}-${i}`,
        kind: 'box',
        position: [x, 0.3, 0],
        size: [cellSize, cellSize, cellSize],
        tone: on ? 'output' : 'key',
        opacity: on ? 1 : 0.5,
      },
      {
        id: `${idPrefix}-${i}g`,
        kind: 'glyph',
        position: [x, 0.95, 0],
        label: on ? '•' : '·',
        glyphScale: 0.6,
        tone: on ? 'output' : 'key',
        opacity: on ? 1 : 0.5,
      },
    )
  }
  objs.push(...valuePlate(`${idPrefix}-cap`, [0, 2.5, 1.8], 'XOF', note, 'output'))
  return objs
}

/** Final digest: labeled plate + full byte strip. */
export function digestScene(hex: string, deco: string): ResolvedObject3D[] {
  const obj = hex.replace(/\s/g, '')
  if (!obj) {
    return [
      ...valuePlate('dg', [0, 1.1, -2.4], 'digest', deco.toUpperCase(), 'output', { emphasize: true }),
      ...valuePlate('dg-pending', [0, -1.4, 2.2], 'result', '—', 'muted'),
      ...valuePlate('dg-run', [0, -3, 4.6], 'note', 'run the algorithm to get the real digest', 'muted'),
    ]
  }
  return [
    ...valuePlate('dg', [0, 1.1, -2.4], 'digest', deco.toUpperCase(), 'output', { emphasize: true }),
    ...hexStrip('dgs', obj.toUpperCase(), 'output', [0, -1, 2.8], { piece: 2, cellSize: 0.5, gap: 0.03 }),
  ]
}
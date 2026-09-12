// Shared, algorithm-agnostic helpers for turning 2D view payloads into
// ResolvedObject3D scenes. Plain functions, no React, no state.
import type { CellTone } from '../../simulation/simulationTypes'
import type {
  CameraConfig,
  ResolvedObject3D,
  Sim3DGridCell,
  Sim3DGridLayer,
  Sim3DTone,
  Vec3,
} from '../types/simulation3d'

// ---------------------------------------------------------------------------
// Tone mapping: 2D CellTone → 3D tone. The 3D palette has a few extra roles.
// ---------------------------------------------------------------------------

const TONE3: Record<CellTone, Sim3DTone> = {
  input: 'input',
  key: 'key',
  internal: 'internal',
  output: 'output',
  transform: 'transform',
  active: 'active',
  muted: 'muted',
  error: 'error',
}

export function tone3(t: CellTone | Sim3DTone | undefined, fallback: Sim3DTone = 'muted'): Sim3DTone {
  if (!t) return fallback
  if (t in TONE3) return TONE3[t as CellTone]
  return t as Sim3DTone
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

export interface CellProps {
  label: string
  tone?: CellTone | Sim3DTone
  emphasize?: boolean
  opacity?: number
  visible?: boolean
}

export function gridCell(c: CellProps | null): Sim3DGridCell | null {
  if (!c) return null
  return {
    label: c.label,
    tone: tone3(c.tone),
    emphasize: c.emphasize,
    opacity: c.opacity,
    visible: c.visible,
  }
}

/**
 * A 4×4-style hex matrix rendered with the raised `grid` primitive. Cells in
 * `highlight` get the active tone to point out byte-level changes.
 */
export function hexMatrixGrid(
  id: string,
  matrix: string[][],
  baseTone: CellTone | Sim3DTone,
  origin: Vec3,
  opts: { highlight?: Array<[number, number]>; cellSize?: number; gap?: number; height?: number; titleTone?: Sim3DTone } = {},
): ResolvedObject3D {
  const hl = new Set((opts.highlight ?? []).map(([r, c]) => `${r},${c}`))
  return gridObject(
    id,
    matrix.map((row, r) =>
      row.map((cell, c) => ({
        label: cell,
        tone: hl.has(`${r},${c}`) ? 'active' : baseTone,
      })),
    ),
    {
      cellSize: opts.cellSize ?? 1,
      gap: opts.gap ?? 0.16,
      height: opts.height ?? 1.6,
      position: origin,
    },
  )
}

export interface GridOptions {
  cellSize?: number
  gap?: number
  height?: number
  labelScale?: number
}

/** Build a single-layer grid object from a 2D array of cells. */
export function gridObject(
  id: string,
  rows: (CellProps | null)[][],
  opts: GridOptions & { layers?: Sim3DGridLayer[]; position?: Vec3; visible?: boolean; tone?: Sim3DTone } = {},
): ResolvedObject3D {
  const layers: Sim3DGridLayer[] = opts.layers?.length
    ? opts.layers
    : [
        {
          rows: rows.length,
          cols: Math.max(1, rows[0]?.length ?? 0),
          cellSize: opts.cellSize,
          gap: opts.gap,
          labelScale: opts.labelScale,
          cells: rows.map((r) => r.map(gridCell)),
        },
      ]
  return {
    id,
    kind: 'grid',
    position: opts.position ?? [0, 0, 0],
    visible: opts.visible ?? true,
    tone: tone3(opts.tone ?? 'muted'),
    grid: { layers, height: opts.height },
  }
}

/** A flat labeled tile (used for values, keys, participants). */
export function plate(
  id: string,
  position: Vec3,
  label: string,
  tone: CellTone | Sim3DTone = 'internal',
  opts: { size?: Vec3; glycolY?: number; emphasize?: boolean; visible?: boolean } = {},
): ResolvedObject3D[] {
  const size = opts.size ?? [1.6, 0.55, 1.3]
  const t = tone3(tone)
  return [
    {
      id,
      kind: 'box',
      position,
      size,
      tone: t,
      emphasize: opts.emphasize ?? false,
      visible: opts.visible ?? true,
    },
    {
      id: `${id}-glyph`,
      kind: 'glyph',
      position: [position[0], position[1] + (opts.glycolY ?? 0.75), position[2]],
      label,
      glyphScale: 1,
      tone: t,
      visible: opts.visible ?? true,
    },
  ]
}

/** A box without a label (for opaque values / masking). */
export function block(
  id: string,
  position: Vec3,
  tone: CellTone | Sim3DTone,
  opts: { size?: Vec3; emphasize?: boolean; visible?: boolean } = {},
): ResolvedObject3D {
  return {
    id,
    kind: 'box',
    position,
    size: opts.size ?? [1.6, 1.1, 1.3],
    tone: tone3(tone),
    emphasize: opts.emphasize ?? false,
    visible: opts.visible ?? true,
  }
}

export function arrow(
  id: string,
  from: Vec3,
  to: Vec3,
  tone: CellTone | Sim3DTone = 'path',
  opts: { visible?: boolean } = {},
): ResolvedObject3D {
  return {
    id,
    kind: 'arrow',
    position: [0, 0, 0],
    from,
    to,
    tone: tone3(tone),
    visible: opts.visible ?? true,
  }
}

export function glowSphere(
  id: string,
  position: Vec3,
  tone: CellTone | Sim3DTone = 'active',
  opts: { radius?: number; emphasize?: boolean; visible?: boolean } = {},
): ResolvedObject3D {
  return {
    id,
    kind: 'sphere',
    position,
    size: [opts.radius ?? 0.4, opts.radius ?? 0.4, opts.radius ?? 0.4],
    tone: tone3(tone),
    emphasize: opts.emphasize ?? true,
    visible: opts.visible ?? true,
  }
}

// ---------------------------------------------------------------------------
// Hex / string → cell strips (hashes, blocks, keys)
// ---------------------------------------------------------------------------

/** Split a hex digest into an array of hex tokens of `piece` chars. */
export function hexChunks(hex: string, piece = 2): string[] {
  const h = (hex ?? '').replace(/\s/g, '')
  const out: string[] = []
  for (let i = 0; i < h.length; i += piece) out.push(h.slice(i, i + piece))
  return out
}

/** One inventory cell row for a hex-based value. */
export function hexRow(
  hex: string,
  tone: CellTone | Sim3DTone,
  opts: { piece?: number; chunkGap?: number } = {},
): CellProps[] {
  return hexChunks(hex, opts.piece ?? 2).map((label) => ({ label, tone }))
}

/**
 * A flat hex nibble/byte row laid along X. Returns the object array (usable as
 * `...hexStrip(...)`) which also carries `.objects` and `.positions` for the
 * call sites that need the cell coordinates for arrow wiring.
 */
export function hexStrip(
  idPrefix: string,
  hex: string,
  tone: CellTone | Sim3DTone,
  origin: Vec3,
  opts: { cellSize?: number; gap?: number; piece?: number; cubeY?: number; glyphY?: number } = {},
): ResolvedObject3D[] & { objects: ResolvedObject3D[]; positions: (Vec3 | null)[] } {
  const piece = opts.piece ?? 2
  const cells = hexRow(hex, tone, { piece })
  const { objects, positions } = charRow(idPrefix, cells, origin, {
    cellSize: opts.cellSize ?? 0.7,
    gap: opts.gap ?? 0.07,
    cubeY: opts.cubeY ?? 0.3,
    glyphY: opts.glyphY ?? 0.95,
  })
  const arr = objects as ResolvedObject3D[] & { objects: ResolvedObject3D[]; positions: (Vec3 | null)[] }
  arr.objects = objects
  arr.positions = positions.map((p) => (p ? p.position : null))
  return arr
}

// ---------------------------------------------------------------------------
// Message / key rows with a per-letter tone callback
// ---------------------------------------------------------------------------

export interface LetterPos {
  position: Vec3
  cell: CellProps
}

/**
 * Lay out a string as a row of labeled cells along X. Returns the objects and
 * each letter's world position (glyph top, cube center) for arrow wiring.
 */
export function charRow(
  idPrefix: string,
  chars: (CellProps | null)[],
  origin: Vec3,
  opts: { cellSize?: number; gap?: number; cubeY?: number; glyphY?: number } = {},
): { objects: ResolvedObject3D[]; positions: (LetterPos | null)[] } {
  const cellSize = opts.cellSize ?? 0.92
  const gap = opts.gap ?? 0.12
  const cubeY = opts.cubeY ?? 0.55
  const glyphY = opts.glyphY ?? 1.25
  const objects: ResolvedObject3D[] = []
  const positions: (LetterPos | null)[] = []
  const step = cellSize + gap
  const off = ((chars.length - 1) * step) / 2
  chars.forEach((c, i) => {
    if (!c) {
      positions.push(null)
      return
    }
    const pos: Vec3 = [origin[0] - off + i * step, origin[1], origin[2]]
    const t = tone3(c.tone)
    objects.push(
      {
        id: `${idPrefix}-${i}`,
        kind: 'box',
        position: [pos[0], origin[1] + cubeY, pos[2]],
        size: [cellSize, cellSize, cellSize],
        tone: t,
        emphasize: c.emphasize ?? false,
        opacity: c.opacity ?? 1,
        visible: c.visible ?? true,
      },
      {
        id: `${idPrefix}g-${i}`,
        kind: 'glyph',
        position: [pos[0], origin[1] + glyphY, pos[2]],
        label: c.label === ' ' ? '·' : c.label,
        glyphScale: 0.95,
        tone: t,
        opacity: c.opacity ?? 1,
        visible: c.visible ?? true,
      },
    )
    positions.push({ position: pos, cell: c })
  })
  return { objects, positions }
}

// ---------------------------------------------------------------------------
// Camera presets
// ---------------------------------------------------------------------------

function centroid(points: Vec3[]): Vec3 {
  if (points.length === 0) return [0, 0.4, 0]
  let x = 0
  let y = 0
  let z = 0
  for (const p of points) {
    x += p[0]
    y += p[1]
    z += p[2]
  }
  return [x / points.length, y / points.length, z / points.length]
}

const DEFAULT_DIR: Vec3 = [0.78, 0.72, 1]

/** Camera that centers on the given points. */
export function fitCamera(
  points: Vec3[],
  opts: { distance?: number; dir?: Vec3; instant?: boolean } = {},
): CameraConfig {
  const target = centroid(points)
  const spread = Math.max(
    2,
    ...points.map((p) => Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2])),
  )
  const distance = opts.distance ?? spread * 2.5 + 6
  const dir = opts.dir ?? DEFAULT_DIR
  const d = Math.hypot(dir[0], dir[1], dir[2]) || 1
  return {
    position: [
      target[0] + (dir[0] / d) * distance,
      target[1] + (dir[1] / d) * distance,
      target[2] + (dir[2] / d) * distance,
    ],
    target,
    instant: opts.instant,
  }
}

export function camRightView(points: Vec3[]): CameraConfig {
  return fitCamera(points, { dir: [1, 0.55, 0.12] })
}

export function camTopView(points: Vec3[]): CameraConfig {
  return fitCamera(points, { dir: [0, 1, 0.12] })
}

export function camPipeline(points: Vec3[]): CameraConfig {
  return fitCamera(points, { dir: [0.6, 0.5, 1], distance: 13 })
}

export function camTwoParty(points: Vec3[]): CameraConfig {
  return fitCamera(points, { dir: [-0.3, 1, 1.6] })
}

// ---------------------------------------------------------------------------
// Small layout helpers
// ---------------------------------------------------------------------------

/** 1D positions spaced evenly around origin along X. */
export function xPositions(count: number, span: number, y = 0, z = 0): Vec3[] {
  const out: Vec3[] = []
  if (count === 1) return [[0, y, z]]
  for (let i = 0; i < count; i++) {
    out.push([-span / 2 + (span * i) / (count - 1), y, z])
  }
  return out
}

/** Merge object arrays (helper to keep step builders terse). */
export function merge(...groups: (ResolvedObject3D[] | ResolvedObject3D)[]): ResolvedObject3D[] {
  return groups.flatMap((g) => (Array.isArray(g) ? g : [g]))
}

export function allVisible(objects: ResolvedObject3D[], ids: string[], visible: boolean): ResolvedObject3D[] {
  const set = new Set(ids)
  return objects.map((o) =>
    set.has(o.id) ? { ...o, visible: visible && o.visible !== false } : { ...o, visible: false },
  )
}

export function setTone(
  objects: ResolvedObject3D[],
  ids: string[],
  tone: CellTone | Sim3DTone,
): ResolvedObject3D[] {
  const set = new Set(ids)
  return objects.map((o) => (set.has(o.id) ? { ...o, tone: tone3(tone) } : o))
}

// ---------------------------------------------------------------------------
// Multi-row layout (the 2D `rows` view 1:1)
// ---------------------------------------------------------------------------

export interface Row3DRow {
  label?: string
  cells: (CellProps | null)[]
}

export interface Rows3DResult {
  objects: ResolvedObject3D[]
  /** world cube-center positions indexed [row][col] (null for skip cells) */
  cells: (Vec3 | null)[][]
}

/**
 * Stack labeled rows of cells along DEPTH (Z). Columns align across rows in X;
 * each row is a horizontal strip one `rowStep` deeper than the previous.
 * Returns cube-center positions [row][col] for arrow wiring.
 */
export function rows3D(
  rows: Row3DRow[],
  origin: Vec3,
  opts: { rowStep?: number; cellSize?: number; gap?: number; labelOffset?: number } = {},
): Rows3DResult {
  const rowStep = opts.rowStep ?? 2.1
  const cellSize = opts.cellSize ?? 0.92
  const gap = opts.gap ?? 0.12
  const objects: ResolvedObject3D[] = []
  const cells: (Vec3 | null)[][] = []
  const maxLen = Math.max(0, ...rows.map((r) => (r.cells ?? []).length))
  const step = cellSize + gap
  const off = ((maxLen - 1) * step) / 2
  const y = origin[1] + cellSize / 2
  const glyphY = origin[1] + cellSize + 0.28
  rows.forEach((row, ri) => {
    const z = origin[2] + ri * rowStep
    if (row.label) {
      objects.push({
        id: `rowlabel-${ri}`,
        kind: 'glyph',
        position: [origin[0] - off - (opts.labelOffset ?? 1.6), y + 0.35, z],
        label: row.label,
        glyphScale: 0.9,
        tone: 'muted',
      })
    }
    const rowCells: (Vec3 | null)[] = []
    ;(row.cells ?? []).forEach((c, ci) => {
      if (!c) {
        rowCells.push(null)
        return
      }
      const x = origin[0] - off + ci * step
      const t = tone3(c.tone)
      objects.push(
        {
          id: `R${ri}C${ci}`,
          kind: 'box',
          position: [x, y, z],
          size: [cellSize, cellSize, cellSize],
          tone: t,
          emphasize: c.emphasize ?? false,
          opacity: c.opacity ?? 1,
          visible: c.visible ?? true,
        },
        {
          id: `R${ri}C${ci}g`,
          kind: 'glyph',
          position: [x, glyphY, z],
          label: c.label === ' ' ? '·' : c.label,
          glyphScale: 0.92,
          tone: t,
          opacity: c.opacity ?? 1,
          visible: c.visible ?? true,
        },
      )
      rowCells.push([x, y, z])
    })
    cells.push(rowCells)
  })
  return { objects, cells }
}

/**
 * A matrix laid flat on the ground (columns → X, rows → Z) as individual
 * box+glyph cells whose world positions are returned for arrow wiring.
 */
export function manualGrid(
  idPrefix: string,
  matrix: (CellProps | null)[][],
  origin: Vec3,
  opts: { cellSize?: number; gap?: number; glyphOffset?: number } = {},
): { objects: ResolvedObject3D[]; cells: Vec3[][] } {
  const cellSize = opts.cellSize ?? 0.9
  const gap = opts.gap ?? 0.1
  const stepp = cellSize + gap
  const rows = matrix.length
  const cols = Math.max(1, matrix[0]?.length ?? 0)
  const offX = ((cols - 1) * stepp) / 2
  const offZ = ((rows - 1) * stepp) / 2
  const objects: ResolvedObject3D[] = []
  const cells: Vec3[][] = []
  matrix.forEach((row, r) => {
    const rowCells: Vec3[] = []
    for (let ci = 0; ci < cols; ci++) {
      const c = row[ci]
      const x = origin[0] - offX + ci * stepp
      const z = origin[2] - offZ + r * stepp
      rowCells.push([x, origin[1] + 0.12, z])
      if (!c) continue
      const t = tone3(c.tone)
      objects.push(
        {
          id: `${idPrefix}-${r}-${ci}`,
          kind: 'box',
          position: [x, origin[1] + 0.12, z],
          size: [cellSize, 0.24, cellSize],
          tone: t,
          emphasize: c.emphasize ?? false,
          opacity: c.opacity ?? 1,
        },
        {
          id: `${idPrefix}-${r}-${ci}g`,
          kind: 'glyph',
          position: [x, origin[1] + 0.62, z],
          label: c.label,
          glyphScale: 0.9,
          tone: t,
          opacity: c.opacity ?? 1,
        },
      )
    }
    cells.push(rowCells)
  })
  return { objects, cells }
}

/** A single labeled value shown as a floating plate with a small key glyph. */
/** Auto-frame a camera that fits every rendered object. */
export function camToObjects(
  objects: ResolvedObject3D[],
  opts: { dir?: Vec3; instant?: boolean; pad?: number } = {},
): CameraConfig {
  const xs: number[] = []
  const ys: number[] = []
  const zs: number[] = []
  const touch = (p: Vec3 | undefined, pad = 0.6) => {
    if (!p) return
    xs.push(p[0] + pad, p[0] - pad)
    ys.push(p[1] + pad, p[1] - pad)
    zs.push(p[2] + pad, p[2] - pad)
  }
  for (const o of objects) {
    if (o.kind === 'grid' && o.grid?.layers) {
      for (const layer of o.grid.layers) {
        const cell = layer.cellSize ?? 1
        const gap = layer.gap ?? 0.14
        const w = (Math.max(1, layer.cols) - 1) * (cell + gap) + cell
        const d = (Math.max(1, layer.rows) - 1) * (cell + gap) + cell
        touch([o.position[0] + w / 2, o.position[1], o.position[2] - d / 2])
        touch([o.position[0] - w / 2, o.position[1], o.position[2] + d / 2])
      }
      continue
    }
    touch(o.position)
    if (o.kind === 'arrow') {
      touch(o.from, 1)
      touch(o.to, 1)
    }
    if (o.kind === 'arc' && o.points?.length) {
      for (const p of o.points) touch(p)
    }
  }
  if (xs.length === 0) {
    xs.push(0, 1)
    ys.push(0, 1)
    zs.push(0, 1)
  }
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2
  const span = Math.max(
    4,
    Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), Math.max(...zs) - Math.min(...zs)),
  )
  const distance = span * 1.35 + 4.5
  const dir = opts.dir ?? DEFAULT_DIR
  const d = Math.hypot(dir[0], dir[1], dir[2]) || 1
  const p = opts.pad ?? 0
  return {
    position: [cx + (dir[0] / d) * (distance + p), cy + (dir[1] / d) * (distance + p), cz + (dir[2] / d) * (distance + p)],
    target: [cx, cy, cz],
    instant: opts.instant,
  }
}

export function valuePlate(
  id: string,
  position: Vec3,
  label: string,
  value: string,
  tone: CellTone | Sim3DTone = 'internal',
  opts: { emphasize?: boolean } = {},
): ResolvedObject3D[] {
  const t = tone3(tone)
  return [
    {
      id,
      kind: 'box',
      position,
      size: [Math.max(1.2, Math.min(4, 0.35 * Math.max(value.length, label.length) + 1)), 0.5, 1.2],
      tone: t,
      emphasize: opts.emphasize ?? false,
    },
    {
      id: `${id}-lbl`,
      kind: 'glyph',
      position: [position[0], position[1] + 0.72, position[2]],
      label,
      glyphScale: 0.55,
      tone: 'muted',
      opacity: 0.85,
    },
    {
      id: `${id}-val`,
      kind: 'glyph',
      position: [position[0], position[1] - 0.05, position[2]],
      label: value,
      glyphScale: 0.9,
      tone: t,
    },
  ]
}
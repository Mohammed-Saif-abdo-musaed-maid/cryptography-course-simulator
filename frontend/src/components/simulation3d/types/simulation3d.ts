import type { AlgorithmResult } from '../../../types'

/** Color roles shared with the 2D lab palette (see styles/theme.css). */
export type Sim3DTone =
  | 'input'
  | 'plaintext'
  | 'key'
  | 'internal'
  | 'transform'
  | 'output'
  | 'active'
  | 'complete'
  | 'muted'
  | 'path'
  | 'error'
  | 'warning'

export type Sim3DPhase = 'input' | 'key' | 'internal' | 'transform' | 'output'

export type Vec3 = [number, number, number]

/** Absolute camera state described by an algorithm step. */
export interface CameraConfig {
  position: Vec3
  target: Vec3
  /** Jump to the camera immediately instead of easing to it. */
  instant?: boolean
}

/** Geometry variants understood by the 3D engine. */
export type Object3DKind = 'box' | 'sphere' | 'glyph' | 'ring' | 'arrow' | 'arc' | 'orbit' | 'grid'

/** One cell of a 2D matrix primitive. `null` skips the cell entirely. */
export interface Sim3DGridCell {
  label?: string
  tone?: Sim3DTone
  emphasize?: boolean
  opacity?: number
  visible?: boolean
}

/** A 2D matrix laid out on the XZ plane (columns → X, rows → Z). */
export interface Sim3DGridLayer {
  rows: number
  cols: number
  cellSize?: number
  gap?: number
  cells: (Sim3DGridCell | null)[][]
  /** Per-cell sprite scale (auto-shrinks for long labels). */
  labelScale?: number
}

/** Stacked matrix layers (e.g. DES left/right halves, AES rounds). */
export interface Simulation3DGrid {
  layers?: Sim3DGridLayer[]
  /** Cell tile thickness. */
  height?: number
}

/**
 * A fully resolved description of one logical object for one step.
 * Steps are absolute keyframes: every object present in a step is listed.
 */
export interface ResolvedObject3D {
  id: string
  kind: Object3DKind
  position: Vec3
  rotation?: Vec3
  scale?: Vec3
  visible?: boolean
  tone?: Sim3DTone
  /** 0..1 opacity, default 1. */
  opacity?: number
  /** Emissive highlight used to draw attention to the active object. */
  emphasize?: boolean
  /**
   * Box mesh draws a cube of `size` per axis; a sphere uses size[0] as radius;
   * a ring uses `ringRadius` / `ringTube`; an arc uses `points`.
   */
  size?: Vec3
  /** Sphere radius (falls back to `size[0]`). */
  radius?: number
  /** Sphere / tube segment detail (defaults to 32). */
  segments?: number
  ringRadius?: number
  ringTube?: number
  /** Glyph label drawn on a billboarded texture sprite. Keep it short. */
  label?: string
  glyphScale?: number
  /** Arc path (tube spline) through these world points. */
  points?: Vec3[]
  /** Arrow endpoints. */
  from?: Vec3
  to?: Vec3
  /**
   * Orbit animation: the object moves along a circle that lies in the XZ plane.
   * When a parent step provides `orbit.fromAngle`/`toAngle` the engine
   * interpolates the angle instead of the raw position.
   */
  orbit?: {
    center: Vec3
    radius: number
    y: number
    fromAngle: number
    toAngle: number
  }
  /** Matrix primitive: one or more stacked 2D layers of labeled cells. */
  grid?: Simulation3DGrid
}

/** One keyframe of the 3D sequence. */
export interface Simulation3DStep {
  id: string
  titleKey: string
  titleArgs?: Record<string, string | number>
  descKey: string
  descArgs?: Record<string, string | number>
  phase?: Sim3DPhase
  /** Full scene state for this step. */
  objects: ResolvedObject3D[]
  /** Optional camera cue for this step. */
  camera?: CameraConfig
  /** Animation duration in ms (defaults to the engine base duration). */
  duration?: number
  /**
   * Optional semantic metadata. When present the engine renders the Step
   * Inspector; the scene itself is always built from REAL algorithm values,
   * this metadata only explains them. Adapters that omit it render exactly as
   * they did before — this field is fully additive.
   */
  meta?: Simulation3DStepMeta
}

/** Granularity of explanation chosen by the adapter for a step. */
export type EducationLevel = 'concept' | 'algorithm' | 'operation' | 'bit'

/** Semantic event types understood by the simulation layer. */
export type SimulationEventType =
  | 'INPUT_CREATED'
  | 'PADDING_APPLIED'
  | 'BLOCK_CREATED'
  | 'SCHEDULE_READY'
  | 'DATA_MOVED'
  | 'BYTE_TRANSFORMED'
  | 'XOR_EXECUTED'
  | 'ADD_EXECUTED'
  | 'ROTATE_EXECUTED'
  | 'SUBSTITUTE_EXECUTED'
  | 'PERMUTE_EXECUTED'
  | 'MUL_EXECUTED'
  | 'MOD_EXECUTED'
  | 'HASH_FINALIZED'
  | 'YIELD_EXECUTED'
  | 'ROUND_STARTED'
  | 'ROUND_COMPLETED'
  | 'STATE_UPDATED'
  | 'KEY_GENERATED'
  | 'PUBLIC_VALUE_EXCHANGED'
  | 'SHARED_SECRET_COMPUTED'
  | 'KEY_DERIVED'
  | 'TAG_COMPUTED'
  | 'RESULT_READY'
  | 'PARAMETERS_SET'
  | 'INVALID_INPUT'

/** One entity that changed in this step (register, cell, lane…). */
export interface SimChangedValue {
  /** Entity id (register / cell / lane name, e.g. "a", "W[5]"). */
  entity: string
  label: string
  before: string
  after: string
  /** Formula snippet that produced the change (e.g. "a = T1 + T2"). */
  reason?: string
  tone?: Sim3DTone
}

/** Explicit data-flow edge inside one step (source → destination). */
export interface SimDataFlow {
  from: string[]
  to: string[]
  operation: string
  formula?: string
}

/**
 * Educational metadata attached to a step. All fields optional; the inspector
 * shows only what the adapter actually filled in.
 */
export interface Simulation3DStepMeta {
  level?: EducationLevel
  event?: SimulationEventType
  /** Short operation name, e.g. "AddRoundKey" or "Quarter Round". */
  operation?: string
  /** The mathematical formula of this step, e.g. "T1 = h + Σ1(e) + Ch(e,f,g) + K[i] + W[i]". */
  formula?: string
  /** Named inputs of this step (displayed as label → value). */
  inputs?: Record<string, string>
  /** Named outputs of this step (displayed as label → value). */
  outputs?: Record<string, string>
  /** Named state before this step (displayed in the disclosure block). */
  stateBefore?: Record<string, string>
  /** Named state after this step (displayed in the disclosure block). */
  stateAfter?: Record<string, string>
  /** Entity-by-entity value changes with before/after (the core of the inspector). */
  changedValues?: SimChangedValue[]
  /** Object ids that should be visually highlighted in the scene. */
  highlightedEntities?: string[]
  /** One-line "why does this happen" explanation. */
  why?: string
}

export interface LegendEntry {
  id: string
  labelKey: string
  tone: Sim3DTone
}

/** Algorithm adapter that turns live inputs into a 3D sequence. */
export interface Simulation3DAdapter {
  id: string
  nameKey: string
  educationalKey?: string
  demoInputs?: Record<string, unknown>
  defaultCamera?: CameraConfig
  getLegend?: (ctx: Simulation3DContext) => LegendEntry[]
  buildSteps: (ctx: Simulation3DContext) => Simulation3DStep[]
}

/** Context handed to adapters — mirrors the 2D SimulationContext contract. */
export interface Simulation3DContext {
  id: string
  operation: string
  inputs: Record<string, unknown>
  demo: boolean
  language: 'ar' | 'en'
  dir: 'ltr' | 'rtl'
  theme: 'dark' | 'light'
  result: AlgorithmResult | null
  resultMatches: boolean
  t: (key: string) => string
}

/** Imperative handle of the canvas layer. */
export interface Simulation3DCanvasHandle {
  apply(
    objects: ResolvedObject3D[],
    opts?: { animate?: boolean; duration?: number; camera?: CameraConfig },
  ): Promise<void>
  resetCamera(): void
  /** Focus the camera on a world point, preserving direction and distance. */
  focusAt(point: Vec3): void
  /** Toggle browser fullscreen for this scene. */
  toggleFullscreen(): void
}
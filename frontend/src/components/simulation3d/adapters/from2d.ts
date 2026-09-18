// Bridge: reuse a pure 2D engine's build(ctx) output (SimStage[]) and its
// existing i18n keys to produce Simulation3DStep[]. Every 3D adapter supplies
// a per-view-kind scene so values stay EXACTLY the ones the 2D lab computed.
import type { CharCell, SimulationEngine, SimStage } from '../../simulation/simulationTypes'
import type { StepDetail } from '../../../types'
import type {
  CameraConfig,
  EducationLevel,
  LegendEntry,
  ResolvedObject3D,
  Simulation3DAdapter,
  Simulation3DStep,
  Simulation3DStepMeta,
  Vec3,
} from '../types/simulation3d'
import { camToObjects, rows3D, valuePlate } from './scene'

export function stagesToSteps(
  stages: SimStage[],
  scene: (stage: SimStage, index: number) => ResolvedObject3D[],
  metaFor?: (stage: SimStage, index: number) => Simulation3DStepMeta | undefined,
): Simulation3DStep[] {
  return stages.map((st, i) => {
    const objects = scene(st, i)
    const meta = metaFor?.(st, i)
    return {
      id: `3d-${st.id}`,
      titleKey: st.titleKey,
      titleArgs: st.titleArgs,
      descKey: st.descKey,
      descArgs: st.descArgs,
      phase: st.phase,
      objects,
      camera: i === 0 ? camToObjects(objects) : undefined,
      duration: 800,
      ...(meta ? { meta } : {}),
    }
  })
}

/** Re-frame a camera to frame only the given object ids. */
export function focusObjects(
  objects: ResolvedObject3D[],
  ids: string[],
): CameraConfig | undefined {
  const set = new Set(ids)
  const picked = objects.filter((o) => set.has(o.id))
  if (picked.length === 0) return undefined
  return camToObjects(picked)
}

export function viewKind(stage: SimStage): string {
  return String(stage.view.kind)
}

// ---------------------------------------------------------------------------
// Generic honest step metadata
// ---------------------------------------------------------------------------

const PHASE_LEVEL: Partial<Record<string, EducationLevel>> = {
  input: 'concept',
  key: 'algorithm',
  transform: 'operation',
  internal: 'bit',
  output: 'algorithm',
}

function humanizeKind(kind: string): string {
  return kind
    .replace(/[_\-\s]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

/**
 * Summary meta derived purely from the stage (phase → level, view kind →
 * operation). It never invents values, formulas or motivations — adapters that
 * provide richer per-step meta keep full control by passing `metaFor`.
 *
 * When the stage declares a `traceIndex` and the real backend trace is
 * available, the genuine input/output of that trace step are surfaced as
 * `inputs`/`outputs`/`changedValues` so the Step Inspector shows real values.
 */
export function defaultStageMeta(stage: SimStage, trace?: StepDetail[]): Simulation3DStepMeta {
  const level = stage.phase ? PHASE_LEVEL[stage.phase] : undefined
  const meta: Simulation3DStepMeta = {
    level: level ?? 'algorithm',
    operation: humanizeKind(viewKind(stage)),
  }
  const idx = stage.traceIndex
  const traced = idx && trace ? trace[idx - 1] : undefined
  if (traced) {
    meta.inputs = { input: traced.input }
    meta.outputs = { output: traced.output }
    if (traced.description) meta.why = traced.description
    meta.changedValues = [
      {
        entity: traced.title || `step ${traced.step}`,
        label: traced.title || `step ${traced.step}`,
        before: traced.input,
        after: traced.output,
        reason: traced.description || undefined,
      },
    ]
  }
  return meta
}

// ---------------------------------------------------------------------------
// Shared view scenes (kinds used across many engines)
// ---------------------------------------------------------------------------

/** `rows` view: labeled rows of CharCells → depth-stacked 3D strips. */
export function rowsViewScene(v: Record<string, unknown>, origin: Vec3 = [0, 0, 0]): ResolvedObject3D[] {
  const rows = (v.rows ?? []) as Array<{ label?: string; cells: CharCell[] }>
  return rows3D(
    rows.map((r) => ({
      label: r.label,
      cells: (r.cells ?? []).map((c) => ({ label: c.ch, tone: c.tone })),
    })),
    origin,
  ).objects
}

/** `result` view: character row (chars) + big value plate (text). */
export function resultViewScene(v: Record<string, unknown>, origin: Vec3 = [0, 0, 0]): ResolvedObject3D[] {
  const chars = (v.chars ?? []) as CharCell[]
  const text = String(v.text ?? '')
  const out: ResolvedObject3D[] = []
  const { objects } = rows3D(
    [{ cells: chars.map((c) => ({ label: c.ch, tone: c.tone })) }],
    origin,
  )
  out.push(...objects)
  out.push(
    ...valuePlate(
      'result-value',
      [0, 1.6, 4.6],
      'result',
      text || '·',
      'output',
      { emphasize: true },
    ),
  )
  return out
}

// ---------------------------------------------------------------------------
// Adapter factory — most algorithms follow this exact shape
// ---------------------------------------------------------------------------

const DEFAULT_LEGEND: LegendEntry[] = [
  { id: 'input', labelKey: 'simulation3d.legend.input', tone: 'input' },
  { id: 'plaintext', labelKey: 'simulation3d.legend.plaintext', tone: 'plaintext' },
  { id: 'key', labelKey: 'simulation3d.legend.key', tone: 'key' },
  { id: 'active', labelKey: 'simulation3d.legend.active', tone: 'active' },
  { id: 'transform', labelKey: 'simulation3d.legend.transform', tone: 'transform' },
  { id: 'output', labelKey: 'simulation3d.legend.output', tone: 'output' },
]

export function createAdapterFromEngine(
  engine: SimulationEngine,
  scene: (stage: SimStage) => ResolvedObject3D[],
  overrides: Partial<Simulation3DAdapter> = {},
  metaFor?: (stage: SimStage, index: number) => Simulation3DStepMeta | undefined,
): Simulation3DAdapter {
  return {
    id: engine.id,
    nameKey: engine.nameKey,
    educationalKey: engine.educationalKey,
    demoInputs: engine.demoInputs,
    buildSteps(ctx) {
      const trace = ctx.trace
      return stagesToSteps(
        engine.build(ctx),
        (st) => scene(st),
        (st, i) => (metaFor ? metaFor(st, i) : defaultStageMeta(st, trace)),
      )
    },
    getLegend: () => DEFAULT_LEGEND,
    ...overrides,
  }
}
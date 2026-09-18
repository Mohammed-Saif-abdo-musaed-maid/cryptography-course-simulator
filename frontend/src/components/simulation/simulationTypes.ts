import type { FC } from 'react'
import type { AlgorithmResult, StepDetail } from '../../types'

export type SimPhase = 'input' | 'transform' | 'internal' | 'key' | 'output'

/** Serializable, kind-tagged view payload rendered by the engine's View component. */
export type SimView = { kind: string } & Record<string, unknown>

export interface SimStage {
  id: string
  titleKey: string
  titleArgs?: Record<string, string | number>
  descKey: string
  descArgs?: Record<string, string | number>
  phase?: SimPhase
  view: SimView
  /** 1-based index of the backend trace step this stage corresponds to. */
  traceIndex?: number
}

export interface SimulationContext {
  id: string
  operation: string
  inputs: Record<string, unknown>
  demo: boolean
  language: 'ar' | 'en'
  dir: 'ltr' | 'rtl'
  theme: 'dark' | 'light'
  result: AlgorithmResult | null
  resultMatches: boolean
  /** The real backend execution trace (result.steps) shown in the step panel. */
  trace: StepDetail[]
  t: (key: string) => string
}

export interface SimulationEngine {
  id: string
  nameKey: string
  educationalKey?: string
  demoInputs?: Record<string, unknown>
  build: (ctx: SimulationContext) => SimStage[]
  View: FC<{ view: SimView; ctx: SimulationContext }>
}

/** Color coding for a single character cell inside the lab visualisation. */
export type CellTone =
  | 'input'
  | 'key'
  | 'internal'
  | 'output'
  | 'transform'
  | 'active'
  | 'muted'
  | 'error'

export interface CharCell {
  ch: string
  tone: CellTone
  note?: string
}

/** Replace `{{key}}` and `{key}` placeholders with rendering args. */
export function interpolate(tpl: string, args?: Record<string, string | number>): string {
  if (!args) return tpl
  const fill = (m: string, k: string) => (k in args ? String(args[k]) : m)
  return tpl
    .replace(/\{\{(\w+)\}\}/g, fill)
    .replace(/\{(\w+)\}/g, fill)
}
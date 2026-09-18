import { useEffect, useMemo, useRef } from 'react'
import type { AlgorithmResult } from '../../../types'
import { useI18n } from '../../../i18n'
import { useTheme } from '../../../theme'
import type { Simulation3DAdapter, Simulation3DContext } from '../types/simulation3d'

const INPUT_PRIORITY = [
  'message',
  'plaintext',
  'password',
  'text',
  'block',
  'input',
  'data',
  'ikm',
  'salt',
]

function firstInputValue(inputs: Record<string, unknown>): string {
  for (const k of INPUT_PRIORITY) {
    const v = inputs[k]
    if (v !== undefined && String(v) !== '') return String(v)
  }
  for (const v of Object.values(inputs)) {
    if (v !== undefined && String(v) !== '') return String(v)
  }
  return ''
}

export interface Simulation3DSource {
  adapter: Simulation3DAdapter | undefined
  ctx: Simulation3DContext
}

/**
 * Builds the Simulation3DContext for one algorithm tab. Mirrors the 2D
 * SimulationTab source handling: demo inputs when nothing is typed and
 * result-freshness tracking against the live form values.
 */
export function useSimulation3DSource(
  adapter: Simulation3DAdapter | undefined,
  id: string,
  values: Record<string, unknown>,
  operation: string,
  result: AlgorithmResult | null,
): Simulation3DSource {
  const { t, language, dir } = useI18n()
  const { theme } = useTheme()

  const hasInputs = useMemo(
    () => Object.values(values ?? {}).some((v) => String(v ?? '').trim() !== ''),
    [values],
  )
  const demo = adapter ? !hasInputs : false

  const inputs = useMemo(() => {
    if (demo && adapter?.demoInputs) {
      const merged = { ...adapter.demoInputs }
      merged._demo = firstInputValue(adapter.demoInputs)
      return merged
    }
    return values ?? {}
  }, [demo, adapter, values])

  const frozenKey = useRef<string | null>(null)
  const lastResult = useRef<AlgorithmResult | null>(result)
  const lastId = useRef<string | null>(null)

  const liveKey = `${adapter?.id ?? id}|${operation}|${JSON.stringify(values ?? {})}`

  useEffect(() => {
    if (lastId.current !== id) {
      lastId.current = id
      frozenKey.current = null
    }
    if (lastResult.current !== result) {
      lastResult.current = result
      if (result) frozenKey.current = liveKey
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, result, liveKey])

  const resultMatches = demo ? false : !!result && frozenKey.current === liveKey

  const ctx: Simulation3DContext = useMemo(
    () => ({
      id: adapter?.id ?? id,
      operation,
      inputs,
      demo,
      language,
      dir,
      theme,
      result,
      resultMatches,
      trace: result?.steps ?? [],
      t,
    }),
    [adapter, id, operation, inputs, demo, language, dir, theme, result, resultMatches, t],
  )

  return { adapter, ctx }
}
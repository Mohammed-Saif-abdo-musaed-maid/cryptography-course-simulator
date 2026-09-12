import { useEffect, useMemo, useRef } from 'react'
import type { AlgorithmResult } from '../../types'
import { useI18n } from '../../i18n'
import { useTheme } from '../../theme'
import { getEngine } from './registry'
import { SimulationEngine as SimulationEngineView } from './SimulationEngine'
import type { SimulationContext } from './simulationTypes'

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

export function SimulationTab({
  id,
  values,
  operation,
  result,
}: {
  id: string
  values: Record<string, unknown>
  operation: string
  result: AlgorithmResult | null
}) {
  const { t, language, dir } = useI18n()
  const { theme } = useTheme()
  const engine = getEngine(id)

  const hasInputs = useMemo(
    () => Object.values(values ?? {}).some((v) => String(v ?? '').trim() !== ''),
    [values],
  )
  const demo = engine ? !hasInputs : false

  const inputs = useMemo(() => {
    if (demo && engine?.demoInputs) {
      const merged = { ...engine.demoInputs }
      merged._demo = firstInputValue(engine.demoInputs)
      return merged
    }
    return values ?? {}
  }, [demo, engine, values])

  const frozenKey = useRef<string | null>(null)
  const lastResult = useRef<AlgorithmResult | null>(result)
  const lastId = useRef<string | null>(null)

  const liveKey = `${engine?.id ?? id}|${operation}|${JSON.stringify(values ?? {})}`

  useEffect(() => {
    if (lastId.current !== id) {
      lastId.current = id
      frozenKey.current = null
    }
    if (lastResult.current !== result) {
      lastResult.current = result
      if (result) frozenKey.current = liveKey
    }
  }, [id, result, liveKey])

  const resultMatches = demo ? false : !!result && frozenKey.current === liveKey

  const ctx: SimulationContext = useMemo(
    () => ({
      id: engine?.id ?? id,
      operation,
      inputs,
      demo,
      language,
      dir,
      theme,
      result,
      resultMatches,
      t,
    }),
    [engine, id, operation, inputs, demo, language, dir, theme, result, resultMatches, t],
  )

  if (!engine) {
    return (
      <div className="lab-root">
        <p className="lab-note">{t('simulation.common.unavailable')}</p>
      </div>
    )
  }

  return <SimulationEngineView engine={engine} ctx={ctx} />
}
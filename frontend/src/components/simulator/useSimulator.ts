import { useState } from 'react'
import type { AlgorithmField, AlgorithmResult } from '../../types'
import { api, ApiClientError } from '../../services/api'
import { useI18n } from '../../i18n'

export async function executor(args: {
  algorithm: string
  operation: string
  inputs: Record<string, unknown>
}): Promise<AlgorithmResult> {
  return api.execute(args.algorithm, args.operation, args.inputs)
}

export type OpKey = 'encrypt' | 'decrypt' | 'hash' | 'exchange' | 'generate'

export function useSimulator(defaultOp: string) {
  const { t } = useI18n()
  const [operation, setOperation] = useState<string>(defaultOp)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AlgorithmResult | null>(null)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())

  async function run(
    algorithm: string,
    fields: AlgorithmField[],
    values: Record<string, unknown>,
    baseExecutor: typeof executor = executor,
  ) {
    setError(null)
    const missing = fields
      .filter((f) => f.required)
      .filter((f) => {
        const v = values[f.name]
        return v === undefined || v === '' || v === null
      })
      .map((f) => f.name)

    if (missing.length > 0) {
      setInvalidFields(new Set(missing))
      setError(`${t('simulator.errorHint')} (${missing.join(', ')})`)
      return
    }
    setInvalidFields(new Set())
    setRunning(true)
    try {
      const res = await baseExecutor({ algorithm, operation, inputs: values })
      setResult(res)
    } catch (e) {
      const message =
        e instanceof ApiClientError ? e.message : e instanceof Error ? e.message : String(e)
      setError(message)
      setResult(null)
    } finally {
      setRunning(false)
    }
  }

  return { operation, setOperation, running, error, result, run, invalidFields }
}
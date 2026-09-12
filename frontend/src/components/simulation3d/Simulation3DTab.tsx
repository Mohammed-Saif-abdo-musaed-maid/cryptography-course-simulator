import { useMemo } from 'react'
import type { AlgorithmResult } from '../../types'
import { useI18n } from '../../i18n'
import { get3DAdapter } from './registry3d'
import { useSimulation3DSource } from './hooks/useSimulation3D'
import { Simulation3DEngine } from './Simulation3DEngine'

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

export function Simulation3DTab({
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
  const { t } = useI18n()
  const webgl = useMemo(supportsWebGL, [])
  const adapter = useMemo(() => get3DAdapter(id), [id])
  const source = useSimulation3DSource(adapter, id, values, operation, result)

  if (!webgl) {
    return (
      <div className="lab-root sim3d-root">
        <div className="sim3d-fallback">
          <h3 className="sim3d-fallback-title">{t('simulation3d.common.webglUnsupported')}</h3>
          <p className="lab-note">{t('simulation3d.common.webglHint')}</p>
        </div>
      </div>
    )
  }

  if (!source.adapter) {
    return (
      <div className="lab-root sim3d-root">
        <div className="sim3d-fallback">
          <p className="lab-note">{t('simulation3d.common.unavailable')}</p>
        </div>
      </div>
    )
  }

  return <Simulation3DEngine adapter={source.adapter} ctx={source.ctx} />
}
interface Simulation3DStatusProps {
  t: (key: string) => string
}

export function Simulation3DStatus({ t }: Simulation3DStatusProps) {
  return (
    <div className="sim3d-status">
      <span className="sim3d-hint">{t('simulation3d.common.cameraHint')}</span>
      <span className="sim3d-kbd-hint">{t('simulation3d.common.keyboard')}</span>
    </div>
  )
}
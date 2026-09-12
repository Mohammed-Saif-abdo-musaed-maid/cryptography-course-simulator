import { useI18n } from '../../i18n'

export function Spinner({ label }: { label?: string }) {
  const { t } = useI18n()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 'var(--sp-4)',
        color: 'var(--text-muted)',
        fontSize: 'var(--fs-sm)',
      }}
      role="status"
    >
      <span className="spinner" aria-hidden="true" />
      {label ?? t('common.loading')}
    </div>
  )
}
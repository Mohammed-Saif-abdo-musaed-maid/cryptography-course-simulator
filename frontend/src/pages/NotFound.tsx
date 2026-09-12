import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export function NotFound() {
  const { t } = useI18n()
  return (
    <div className="empty-state" style={{ marginTop: 'var(--sp-7)' }}>
      <h1 style={{ fontSize: 'var(--fs-3xl)', margin: '0 0 8px', color: 'var(--text-strong)' }}>404</h1>
      <p style={{ margin: '0 0 16px' }}>{t('algorithm.notFound')}</p>
      <Link to="/" className="btn btn-primary">
        {t('nav.dashboard')}
      </Link>
    </div>
  )
}
import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n'

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { t, language, toggleLanguage } = useI18n()

  return (
    <header className="navbar">
      <div className="navbar-start">
        <button
          type="button"
          className="navbar-burger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo" aria-hidden="true">🔏</span>
          <span className="navbar-brand-text">
            <strong>{t('app.title')}</strong>
            <small>{t('app.tagline')}</small>
          </span>
        </NavLink>
      </div>
      <div className="navbar-end">
        <button
          type="button"
          className="btn btn-sm btn-ghost lang-toggle"
          onClick={toggleLanguage}
          aria-label={`Switch to ${language === 'ar' ? 'English' : 'العربية'}`}
        >
          {language === 'ar' ? 'EN' : 'ع'}
        </button>
        <NavLink to="/docs" className="btn btn-sm btn-ghost navbar-docs-link">
          📚 {t('nav.docs')}
        </NavLink>
      </div>
    </header>
  )
}
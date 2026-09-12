import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ALGORITHMS } from '../data/catalog'
import { CATEGORY_ICONS } from '../data/categoryMeta'
import type { Category } from '../types'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-hidden={!open}>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/" end className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">🏠</span>
            <span>{t('nav.dashboard')}</span>
          </NavLink>

          <div className="sidebar-group">{t('nav.course')}</div>
          <NavLink to="/theory" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">📖</span>
            <span>{t('nav.introduction')}</span>
          </NavLink>

          <div className="sidebar-group">{t('nav.laboratory')}</div>
          <NavLink to="/playground" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">🧪</span>
            <span>{t('nav.playground')}</span>
          </NavLink>
          <NavLink to="/compare" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">⚖️</span>
            <span>{t('nav.compare')}</span>
          </NavLink>
          <NavLink to="/mathematics" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">∑</span>
            <span>{t('nav.mathematics')}</span>
          </NavLink>

          <div className="sidebar-group">{t('nav.practice')}</div>
          <NavLink to="/exercises" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">✏️</span>
            <span>{t('nav.exercises')}</span>
          </NavLink>
          <NavLink to="/quizzes" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">🎯</span>
            <span>{t('nav.quizzes')}</span>
          </NavLink>

          <div className="sidebar-group">{t('nav.playground')}</div>

          {(Object.keys(CATEGORY_ICONS) as Category[]).map((cat) => (
            <div key={cat}>
              <div className="sidebar-group">{t(`category.${cat}`)}</div>
              {ALGORITHMS.filter((a) => a.category === cat).map((alg) => (
                <NavLink key={alg.id} to={`/algorithms/${alg.id}`} className="sidebar-link sidebar-link-sub" onClick={onClose}>
                  <span className="sidebar-ico">{CATEGORY_ICONS[cat]}</span>
                  <span>{alg.name}</span>
                </NavLink>
              ))}
            </div>
          ))}

          <div className="sidebar-spacer" />

          <NavLink to="/settings" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">⚙️</span>
            <span>{t('nav.settings')}</span>
          </NavLink>
          <NavLink to="/docs" className="sidebar-link" onClick={onClose}>
            <span className="sidebar-ico">📚</span>
            <span>{t('nav.documentation')}</span>
          </NavLink>
        </nav>
      </aside>
    </>
  )
}
import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { byId } from '../data/catalog'

interface Crumb {
  to?: string
  label: string
}

function buildCrumbs(pathname: string, t: (k: string) => string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ to: '/', label: t('nav.dashboard') }]

  let acc = ''
  for (const part of parts) {
    acc += `/${part}`
    if (part === 'algorithms') {
      crumbs.push({ to: acc, label: t('nav.laboratory') })
      continue
    }
    const alg = byId(part)
    if (alg) {
      crumbs.push({ to: acc, label: alg.name })
      break
    }
    const keys: Record<string, string> = {
      theory: t('nav.introduction'),
      playground: t('nav.playground'),
      compare: t('nav.compare'),
      mathematics: t('nav.mathematics'),
      exercises: t('nav.exercises'),
      quizzes: t('nav.quizzes'),
      settings: t('nav.settings'),
      docs: t('nav.documentation'),
    }
    crumbs.push({ to: acc, label: keys[part] ?? part })
  }
  return crumbs
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const crumbs = buildCrumbs(pathname, t)

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs" style={{ marginBottom: 'var(--sp-4)' }}>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <Fragment key={i}>
            {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">/</span>}
            {crumb.to && !isLast ? (
              <Link to={crumb.to} className="breadcrumb-link">{crumb.label}</Link>
            ) : (
              <span className="breadcrumb-current">{crumb.label}</span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
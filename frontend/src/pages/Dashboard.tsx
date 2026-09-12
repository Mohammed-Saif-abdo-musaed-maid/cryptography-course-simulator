import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { ALGORITHMS, CATEGORIES_ORDER } from '../data/catalog'
import { groupCounts } from '../data/grouping'
import { CATEGORY_ICONS } from '../data/categoryMeta'
import { StatCard } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { CategoryBadge, StatusBadge } from '../components/ui/Badge'

export function Dashboard() {
  const { t } = useI18n()
  const counts = groupCounts()
  const total = ALGORITHMS.length

  return (
    <div className="animate-fade-up">
      <section
        style={{
          background: 'var(--grad-panel)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border-strong)',
          padding: 'var(--sp-7)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            insetInlineEnd: -60,
            top: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <h1 className="section-title" style={{ fontSize: 'var(--fs-3xl)', marginBottom: 8 }}>
          {t('dashboard.welcome')}
        </h1>
        <p className="section-sub" style={{ maxWidth: 680, marginBottom: 16 }}>
          {t('dashboard.heroSubtitle')}
        </p>
        <div className="pill-row">
          <Link to="/playground" className="btn btn-primary btn-lg">
            🧪 {t('dashboard.openLaboratory')}
          </Link>
          <Link to="/theory" className="btn btn-lg">
            📖 {t('dashboard.startLearning')}
          </Link>
        </div>
      </section>

      <section className="grid-4" style={{ marginBlockStart: 'var(--sp-6)' }}>
        <StatCard value={total} label={t('dashboard.stats.algorithms')} icon="🧮" />
        <StatCard value={counts.classical} label={t('dashboard.stats.classical')} icon="🏛️" />
        <StatCard value={counts.symmetric} label={t('dashboard.stats.symmetric')} icon="🔐" />
        <StatCard value={counts.asymmetric} label={t('dashboard.stats.asymmetric')} icon="🗝️" />
        <StatCard value={counts.key_exchange} label={t('dashboard.stats.keyExchange')} icon="🤝" />
        <StatCard value={counts.hashing} label={t('dashboard.stats.hash')} icon="🌀" />
      </section>

      <section style={{ marginBlockStart: 'var(--sp-7)' }}>
        <h2 className="section-title">{t('dashboard.categories')}</h2>
        <div className="grid-3" style={{ marginBlockStart: 'var(--sp-4)' }}>
          {CATEGORIES_ORDER.map((cat) => (
            <Card key={cat} hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--fs-2xl)' }}>{CATEGORY_ICONS[cat]}</span>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>{t(`category.${cat}`)}</h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>
                    {ALGORITHMS.filter((a) => a.category === cat).length} {t('dashboard.stats.algorithms')}
                  </span>
                </div>
              </div>
              <div className="pill-row">
                {ALGORITHMS.filter((a) => a.category === cat).map((alg) => (
                  <Link
                    key={alg.id}
                    to={`/algorithms/${alg.id}`}
                    className="badge badge-category"
                    style={{ textTransform: 'none', fontSize: 'var(--fs-xs)' }}
                  >
                    {alg.name}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ marginBlockStart: 'var(--sp-7)' }}>
        <h2 className="section-title">{t('dashboard.quickLaunch')}</h2>
        <div className="table-wrap" style={{ marginBlockStart: 'var(--sp-4)' }}>
          <table className="table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('common.category')}</th>
                <th>{t('common.description')}</th>
                <th>{t('common.securityStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {ALGORITHMS.map((alg) => (
                <tr key={alg.id}>
                  <td>
                    <Link to={`/algorithms/${alg.id}`} style={{ fontWeight: 700 }}>
                      {alg.name}
                    </Link>
                  </td>
                  <td>
                    <CategoryBadge category={alg.category} />
                  </td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: 380 }}>{alg.description}</td>
                  <td>
                    <StatusBadge status={alg.security_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
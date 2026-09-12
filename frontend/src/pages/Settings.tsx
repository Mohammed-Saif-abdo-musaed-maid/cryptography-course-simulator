import { useI18n } from '../i18n'
import { useTheme } from '../theme'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'

export function Settings() {
  const { t, language, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.settings')} subtitle={undefined} />

      <Card title={t('settings.language')}>
        <p className="card-sub">{t('settings.languageHint')}</p>
        <div className="pill-row">
          <button
            type="button"
            className={`btn ${language === 'ar' ? 'btn-primary' : ''}`}
            onClick={() => setLanguage('ar')}
          >
            العربية (RTL)
          </button>
          <button
            type="button"
            className={`btn ${language === 'en' ? 'btn-primary' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English (LTR)
          </button>
        </div>
      </Card>

      <Card title={t('settings.theme')}>
        <p className="card-sub">{t('settings.themeHint')}</p>
        <div className="pill-row">
          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-primary' : ''}`}
            onClick={() => setTheme('dark')}
          >
            {t('settings.themeDark')}
          </button>
          <button
            type="button"
            className={`btn ${theme === 'light' ? 'btn-primary' : ''}`}
            onClick={() => setTheme('light')}
          >
            {t('settings.themeLight')}
          </button>
        </div>
      </Card>

      <Card title={t('settings.about')}>
        <p className="card-sub">{t('settings.aboutText')}</p>
        <p className="io-label">
          Backend: FastAPI · Frontend: React + TypeScript · {t('dashboard.stats.testCoverage')}: 135 ✓
        </p>
      </Card>
    </div>
  )
}
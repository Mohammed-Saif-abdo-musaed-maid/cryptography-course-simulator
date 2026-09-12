import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { api, ApiClientError } from '../services/api'
import type { Exercise, ExerciseResult } from '../types'

export function Exercises() {
  const { t } = useI18n()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, ExerciseResult>>({})

  const load = useCallback(async (category = 'all') => {
    setLoading(true)
    try {
      const res = await api.exercises(category)
      setExercises(res.exercises)
      setError(null)
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const check = async (ex: Exercise) => {
    const answer = answers[ex.id] ?? ''
    try {
      setChecked({ ...checked, [ex.id]: await api.checkExercise(ex.id, answer) })
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : String(e))
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.exercises')} subtitle={t('exercises.subtitle')} actions={undefined} />

      <div className="pill-row" style={{ marginBottom: 'var(--sp-5)' }}>
        {['all', 'classical', 'symmetric', 'asymmetric', 'key_exchange', 'hashing'].map((cat) => (
          <button key={cat} type="button" className="btn btn-sm" onClick={() => { setChecked({}); setAnswers({}); void load(cat) }}>
            {cat === 'all' ? t('common.all') : t(`category.${cat}`)}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error && <Alert variant="error" >{error}</Alert>}

      {!loading && exercises.length === 0 && !error && (
        <div className="empty-state">{t('common.empty')}</div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {exercises.map((ex) => {
          const res = checked[ex.id]
          return (
            <Card key={ex.id} title={ex.question}>
              <div className="pill-row" style={{ marginBottom: 12 }}>
                <span className="badge badge-category">{t(`category.${ex.category}`)}</span>
                <span className="badge badge-secure">{ex.type}</span>
              </div>
              {ex.options.length > 0 ? (
                <div className="pill-row">
                  {ex.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`btn btn-sm ${answers[ex.id] === opt ? 'btn-primary' : ''}`}
                      onClick={() => setAnswers({ ...answers, [ex.id]: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="input"
                  dir="ltr"
                  placeholder={t('exercises.answer')}
                  value={answers[ex.id] ?? ''}
                  onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
                />
              )}

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button variant="success" onClick={() => void check(ex)}>
                  {t('exercises.check')}
                </Button>
                {res && (
                  <Alert variant={res.correct ? 'success' : 'error'}>
                    {res.correct ? t('exercises.correct') : t('exercises.incorrect')}
                  </Alert>
                )}
              </div>
              {res && !res.correct && (
                <p style={{ marginTop: 10, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  <strong>{t('common.explain')}:</strong> {res.explanation}
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
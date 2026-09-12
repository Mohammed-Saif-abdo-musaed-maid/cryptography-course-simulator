import { useState } from 'react'
import { useI18n } from '../i18n'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { api, ApiClientError } from '../services/api'
import type { QuizQuestion, QuizResult } from '../types'

const CATEGORIES = ['mixed', 'classical', 'symmetric', 'asymmetric', 'key_exchange', 'hashing', 'mathematics', 'general_security']

export function Quizzes() {
  const { t } = useI18n()
  const [category, setCategory] = useState('mixed')
  const [difficulty, setDifficulty] = useState('easy')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const start = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setAnswers({})
    try {
      const res = await api.quizQuestions(category, difficulty, 5)
      setQuestions(res.questions)
      setStarted(true)
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    setLoading(true)
    try {
      setResult(await api.quizCheck(category, difficulty, answers))
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.quizzes')} subtitle={t('quizzes.subtitle')} actions={undefined} />

      {!started ? (
        <Card title={t('quizzes.start')}>
          <div className="grid-2">
            <div className="field">
              <label className="field-label">{t('common.selectCategory')}</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'mixed' ? 'Mixed' : c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">{t('common.selectDifficulty')}</label>
              <select className="select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="mixed">Mixed</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          {error && <Alert variant="error" >{error}</Alert>}
          <Button variant="primary" size="lg" disabled={loading} onClick={() => void start()} block>
            {loading ? <Spinner label={t('common.loading')} /> : `▶ ${t('quizzes.start')}`}
          </Button>
        </Card>
      ) : (
        <>
          {result ? (
            <Card title={`${t('quizzes.results')}: ${result.score}/${result.total} (${Math.round(result.percentage)}%)`}>
              <div className="progress" style={{ marginBottom: 16 }}>
                <div className="progress-fill" style={{ width: `${result.percentage}%` }} />
              </div>
              {result.details.map((d) => (
                <div key={d.question_id} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-strong)' }}>{d.question}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 'var(--fs-sm)' }}>
                    <span style={d.correct ? { color: 'var(--success)' } : { color: 'var(--danger)' }}>
                      {d.correct ? '✓ ' : `✗ ${t('quizzes.answered')}: ${d.selected} `}
                    </span>
                    <span className="io-label">✓ {d.correct_answer}</span>
                  </p>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{d.explanation}</p>
                </div>
              ))}
              <Button variant="ghost" onClick={() => { setStarted(false); setResult(null); }}>
                {t('quizzes.newQuiz')}
              </Button>
            </Card>
          ) : (
            <Card title={`${t('nav.quizzes')} — Q ${Object.keys(answers).length + 1}/${questions.length}`}>
              {questions.map((q, qi) => (
                <div key={q.id} style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-strong)', margin: '0 0 10px' }}>
                    {qi + 1}. {q.question}
                  </p>
                  <div className="pill-row">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`btn btn-sm ${answers[q.id] === opt ? 'btn-primary' : ''}`}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {error && <Alert variant="error" >{error}</Alert>}
              <Button variant="success" size="lg" block disabled={loading || Object.keys(answers).length < questions.length} onClick={() => void submit()}>
                {loading ? <Spinner label={t('common.loading')} /> : t('quizzes.correctAnswers')}
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
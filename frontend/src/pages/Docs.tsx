import { useI18n } from '../i18n'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { CodeBlock } from '../components/ui/CodeBlock'
import { Tabs } from '../components/ui/Tabs'
import { useState } from 'react'

const ARCHITECTURE = `Cryptography & Information Security Course Simulator
================================================
Stack
-----  Frontend : React 18 + TypeScript + Vite
         Backend : FastAPI (Python 3.13) + uvicorn
         Testing : pytest (backend) · tsc/vitest (frontend)

Backend layout
--------------
  app/
    algorithms/  23 real implementations (caesar…blake3)
    services/    algorithm_service, math_service,
                 exercise_service, quiz_service
    api/routes/  REST endpoints under /api
    core/        config, logging, security
    utils/       math_utils, steps engine, errors
  tests/         algorithm vectors + API + lifecycle

Frontend layout
---------------
  src/
    pages/        dashboard, algorithm, theory, compare,
                  playground, exercises, quizzes, math, docs
    components/   ui/ (design system), simulator/
    data/         static algorithm catalog
    i18n/         en + ar dictionaries (RTL support)
    services/     REST client for the backend
    styles/       design tokens and component styles

REST API (all algorithms are executed on the backend)
-----------------------------------------------------
  GET  /api/health
  GET  /api/algorithms
  GET  /api/algorithms/{id}
  POST /api/algorithms/execute     {algorithm, operation, inputs}
  POST /api/math/{tool}            number-theory laboratory
  GET  /api/exercises              practice problems
  POST /api/exercises/{id}/check
  GET  /api/quizzes/questions
  POST /api/quizzes/check          answers = {qid: optionText}`

const API_EXAMPLE = `POST /api/algorithms/execute
Content-Type: application/json

{
  "algorithm": "caesar",
  "operation": "encrypt",
  "inputs": { "text": "HELLO", "shift": 3 }
}

→ 200 OK
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "input": "HELLO",
  "result": "KHOOR",
  "extra": { ... },
  "steps": [
    { "step": 1, "title": "Map letters",
      "description": "...",
      "input": "HELLO", "output": "KHOOR",
      "detail": { ... } },
    ...
  ]
}`

export function Docs() {
  const { t } = useI18n()
  const [tab, setTab] = useState('architecture')

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.documentation')} subtitle={t('docs.subtitle')} actions={undefined} />

      <Tabs
        tabs={[
          { id: 'architecture', label: 'Architecture' },
          { id: 'api', label: 'API Reference' },
          { id: 'curl', label: 'curl Examples' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'architecture' && (
        <Card>
          <CodeBlock>{ARCHITECTURE}</CodeBlock>
        </Card>
      )}

      {tab === 'api' && (
        <Card>
          <div className="card-sub" style={{ marginBottom: 12 }}>
            {t('docs.apiDocs')}:{' '}
            <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">
              http://127.0.0.1:8000/docs
            </a>
          </div>
          <CodeBlock>{API_EXAMPLE}</CodeBlock>
        </Card>
      )}

      {tab === 'curl' && (
        <Card>
          <CodeBlock>{`# Health
curl http://127.0.0.1:8000/api/health

# Encrypt with Caesar
curl -X POST http://127.0.0.1:8000/api/algorithms/execute \\
  -H "Content-Type: application/json" \\
  -d '{"algorithm":"caesar","operation":"encrypt","inputs":{"text":"HELLO","shift":3}}'

# Modular inverse
curl -X POST http://127.0.0.1:8000/api/math/modular-inverse \\
  -H "Content-Type: application/json" \\
  -d '{"a":3,"modulus":11}'`}</CodeBlock>
        </Card>
      )}
    </div>
  )
}
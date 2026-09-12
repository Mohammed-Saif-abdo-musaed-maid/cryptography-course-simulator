import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { ALGORITHMS, operationFormFields } from '../data/catalog'
import { operationLabels } from '../data/grouping'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { AlgorithmForm } from '../components/simulator/AlgorithmForm'
import { useSimulator } from '../components/simulator/useSimulator'
import { ResultPanel } from '../components/ui/ResultPanel'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'

export function Playground() {
  const { t } = useI18n()
  const [algorithmId, setAlgorithmId] = useState('caesar')
  const [values, setValues] = useState<Record<string, unknown>>({})

  const alg = ALGORITHMS.find((a) => a.id === algorithmId) ?? ALGORITHMS[0]
  const ops = useMemo(() => operationLabels(algorithmId), [algorithmId])
  // Default operation comes from the current algorithm, not a global constant.
  const sim = useSimulator(ops[0]?.value ?? 'encrypt')
  const formFields = useMemo(
    () => operationFormFields(algorithmId, sim.operation, alg.fields),
    [algorithmId, sim.operation, alg],
  )

  const selectAlgorithm = (id: string) => {
    setAlgorithmId(id)
    setValues({})
    sim.setOperation(
      operationLabels(id)[0]?.value ?? 'encrypt',
    )
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title={t('nav.playground')}
        subtitle={t('playground.subtitle')}
      />

      <Card title={t('simulator.operationLabel')} subtitle={t('common.selectAlgorithm')}>
        <div className="grid-2">
          <div className="field">
            <label className="field-label" htmlFor="pg-alg">{t('common.selectAlgorithm')} *</label>
            <select
              id="pg-alg"
              className="select"
              value={algorithmId}
              onChange={(e) => selectAlgorithm(e.target.value)}
            >
              {ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="pg-op">{t('simulator.operationLabel')} *</label>
            <select
              id="pg-op"
              className="select"
              value={sim.operation}
              onChange={(e) => sim.setOperation(e.target.value)}
            >
              {ops.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 'var(--sp-2)' }}>
          <AlgorithmForm
            fields={formFields}
            values={values}
            onChange={setValues}
            invalid={(name) => sim.invalidFields.has(name)}
          />
        </div>

        <Button
          variant="primary"
          block
          size="lg"
          disabled={sim.running}
          onClick={() => sim.run(alg.id, formFields, values)}
        >
          {sim.running ? <Spinner label={t('common.loading')} /> : `▶ ${t('simulator.run')}`}
        </Button>
      </Card>

      <div style={{ marginBlockStart: 'var(--sp-5)' }}>
        <ResultPanel data={sim.result} error={sim.error} />
      </div>
    </div>
  )
}
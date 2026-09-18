import { useMemo, useState } from 'react'
import { byId, operationFormFields } from '../../data/catalog'
import { useI18n } from '../../i18n'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ResultPanel } from '../ui/ResultPanel'
import { Spinner } from '../ui/Spinner'
import { AlgorithmForm } from '../simulator/AlgorithmForm'
import { useSimulator } from '../simulator/useSimulator'

export function KeyExchangeLab({ algorithm }: { algorithm: string }) {
  const { t } = useI18n()
  const alg = byId(algorithm)
  const sim = useSimulator('exchange')
  const [values, setValues] = useState<Record<string, unknown>>({})
  const fields = useMemo(
    () => operationFormFields(algorithm, 'exchange', alg ? alg.fields : []),
    [algorithm, alg],
  )

  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.keyExchange.intro')}</Alert>

      <div className="grid-2">
        <Card title={t('lab.keyExchange.parameters')}>
          <AlgorithmForm
            fields={fields}
            values={values}
            onChange={setValues}
            invalid={(name) => sim.invalidFields.has(name)}
          />
          <Button
            variant="primary"
            block
            size="lg"
            disabled={sim.running}
            onClick={() => sim.run(algorithm, fields, values)}
          >
            {sim.running ? <Spinner label={t('common.loading')} /> : `▶ ${t('lab.keyExchange.run')}`}
          </Button>
        </Card>

        <Card title={t('common.result')}>
          {sim.error ? <ResultPanel error={sim.error} /> : <ResultPanel data={sim.result} />}
        </Card>
      </div>

      <Alert variant="warning">{t('lab.keyExchange.caution')}</Alert>
    </div>
  )
}

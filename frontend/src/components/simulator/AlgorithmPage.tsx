import { useMemo, useState, useEffect, Suspense, lazy } from 'react'
import { ALGORITHMS, byId, operationFormFields } from '../../data/catalog'
import type { AlgorithmExample } from '../../data/examples'
import { operationLabels } from '../../data/grouping'
import { labTabLabelKey, labTabsFor } from '../../data/labTabs'
import { useI18n } from '../../i18n'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ResultPanel } from '../ui/ResultPanel'
import { StatusBadge, CategoryBadge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import { AlgorithmForm } from './AlgorithmForm'
import { useSimulator } from './useSimulator'

const TheoryTab = lazy(() => import('./SimulatorTabs').then((m) => ({ default: m.TheoryTab })))
const ExamplesTab = lazy(() => import('./SimulatorTabs').then((m) => ({ default: m.ExamplesTab })))
const SecurityTab = lazy(() => import('./SimulatorTabs').then((m) => ({ default: m.SecurityTab })))
const SimulationTab = lazy(() => import('../simulation/SimulationTab').then((m) => ({ default: m.SimulationTab })))
const Simulation3DTab = lazy(() =>
  import('../simulation3d/Simulation3DTab').then((m) => ({ default: m.Simulation3DTab })),
)
const LabPanel = lazy(() =>
  import('../lab/LabPanel').then((m) => ({ default: m.LabPanel })),
)

const INVENTED: Record<string, string> = {
  caesar: 'Roman era',
  monoalphabetic: 'Antiquity',
  vigenere: '1553',
  playfair: '1854',
  hill: '1929',
  rail_fence: 'Classical',
  columnar: 'Classical',
  des: '1977',
  triple_des: '1990s',
  aes: '2001',
  blowfish: '1993',
  twofish: '1998',
  chacha20: '2008',
  rsa: '1977',
  diffie_hellman: '1976',
  elgamal: '1985',
  sha256: '2001',
  sha512: '2001',
  sha1: '1995',
  md5: '1992',
  sha3: '2015',
  blake2: '2012',
  blake3: '2020',
  aes_gcm: '2001',
  chacha20_poly1305: '2008 / 2018',
  hmac: '1996',
  pbkdf2: '2000',
  bcrypt: '1999',
  scrypt: '2009',
  argon2: '2015',
  hkdf: '2010',
  ecdh: '1985',
  x25519: '2006',
  ecdsa: '1992',
  ed25519: '2011',
  sha224: '2001',
  sha384: '2001',
  ripemd160: '1996',
  aes_cbc: '2001',
  aes_ctr: '1979 / 2001',
  aes_ccm: '2002',
  camellia: '2000',
  cmac: '2005',
  poly1305: '2005',
  x448: '2014',
  dsa: '1994',
  rsa_pss: '1996',
}

export function AlgorithmPage({ id }: { id: string }) {
  const { t } = useI18n()

  // The default operation is derived from the CURRENT algorithm, never a
  // hardcoded global value like "encrypt"/"decrypt".
  const alg = byId(id)
  const supportedOps = useMemo(() => alg?.operations ?? [], [id])
  const sim = useSimulator(supportedOps[0] ?? 'encrypt')

  // Keep the selected operation in sync with the algorithm's supported
  // operations: React Router reuses this component instance when navigating
  // between /algorithms/:id pages, so the operation state would otherwise be
  // stale (e.g. "decrypt" carried over from AES). Keep the current operation
  // when it is still supported, otherwise reset to the first supported one.
  useEffect(() => {
    if (supportedOps.length > 0 && !supportedOps.includes(sim.operation)) {
      sim.setOperation(supportedOps[0])
    }
  }, [id, supportedOps, sim.operation])

  const [values, setValues] = useState<Record<string, unknown>>({})
  const [tab, setTab] = useState<string>('simulator')

  // Laboratory tabs are derived purely from the backend capability model.
  const labTabs = useMemo(() => labTabsFor(alg?.capabilities), [alg])

  // When navigating between algorithms (the router reuses this instance),
  // keep the current tab only if the new algorithm still exposes it.
  useEffect(() => {
    const baseTabs = ['simulator', 'theory', 'examples', 'simulation', 'simulation3d', 'security']
    if (!baseTabs.includes(tab) && !labTabs.includes(tab as (typeof labTabs)[number])) {
      setTab('simulator')
    }
  }, [id, labTabs, tab])

  const operations = useMemo(() => operationLabels(id), [id])
  const formFields = useMemo(
    () => operationFormFields(id, sim.operation, alg ? alg.fields : []),
    [id, sim.operation, alg],
  )

  const loadExample = (ex: AlgorithmExample) => {
    sim.setOperation(ex.operation)
    setValues({ ...ex.values })
    setTab('simulator')
  }

  if (!alg) {
    return (
      <div className="container">
        <Alert variant="error">{t('algorithm.notFound')}</Alert>
      </div>
    )
  }

  const ops = operations.length > 0 ? operations : [{ value: 'encrypt', label: 'Encrypt' }]

  return (
    <div className="animate-fade-up">
      <header style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--fs-3xl)' }}>🔐</span>
          <div>
            <h1 className="section-title" style={{ margin: 0 }}>{alg.name}</h1>
            <div className="pill-row" style={{ marginTop: 6 }}>
              <CategoryBadge category={alg.category} />
              <StatusBadge status={alg.security_status} />
              <span className="badge badge-category">{INVENTED[id] ?? ''}</span>
            </div>
          </div>
        </div>
        <p className="section-sub" style={{ marginTop: 10 }}>{alg.description}</p>
      </header>

      <nav className="tabs" role="tablist">
        {[
          { id: 'simulator', label: t('algorithm.tabs.simulator') },
          { id: 'theory', label: t('algorithm.tabs.theory') },
          { id: 'examples', label: t('algorithm.tabs.examples') },
          { id: 'simulation', label: t('algorithm.tabs.simulation') },
          { id: 'simulation3d', label: t('algorithm.tabs.simulation3d') },
          { id: 'security', label: t('algorithm.tabs.documentation') },
          ...labTabs.map((labTab) => ({ id: labTab, label: t(labTabLabelKey(labTab)) })),
        ].map((tk) => (
          <button
            key={tk.id}
            type="button"
            role="tab"
            aria-selected={tab === tk.id}
            className={`tab ${tab === tk.id ? 'tab-active' : ''}`}
            onClick={() => setTab(tk.id)}
          >
            {tk.label}
          </button>
        ))}
      </nav>

      {tab === 'simulator' && (
        <div className="grid-2">
          <Card
            title={t('simulator.operationLabel')}
            actions={
              <div style={{ marginBlockEnd: 12 }}>
                <label className="field-label" htmlFor="op-select">
                  {t('simulator.operationLabel')}
                </label>
                <select
                  id="op-select"
                  className="select"
                  value={sim.operation}
                  onChange={(e) => sim.setOperation(e.target.value)}
                  aria-label="Operation"
                >
                  {ops.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            <h4 className="card-title" style={{ marginTop: 4 }}>{t('simulator.parametersLabel')}</h4>
            <AlgorithmForm
              fields={formFields}
              values={values}
              onChange={setValues}
              invalid={(name) => sim.invalidFields.has(name)}
            />
            <Button
              variant="primary"
              block
              size="lg"
              disabled={sim.running}
              onClick={() => sim.run(id, formFields, values)}
            >
              {sim.running ? <Spinner label={t('common.loading')} /> : `▶ ${t('simulator.run')}`}
            </Button>
          </Card>

          <Card title={t('common.result')}>
            {sim.error ? (
              <ResultPanel error={sim.error} />
            ) : (
              <ResultPanel data={sim.result} />
            )}
          </Card>
        </div>
      )}

      {tab === 'theory' && (
        <Card>
          <Suspense fallback={<Spinner />}>
            <TheoryTab id={id} />
          </Suspense>
        </Card>
      )}

      {tab === 'examples' && (
        <Card>
          <Suspense fallback={<Spinner />}>
            <ExamplesTab id={id} onLoad={loadExample} />
          </Suspense>
        </Card>
      )}

      {tab === 'simulation' && (
        <Suspense fallback={<Spinner />}>
          <SimulationTab id={id} values={values} operation={sim.operation} result={sim.result} />
        </Suspense>
      )}

      {tab === 'simulation3d' && (
        <Suspense fallback={<Spinner />}>
          <Simulation3DTab id={id} values={values} operation={sim.operation} result={sim.result} />
        </Suspense>
      )}

      {tab === 'security' && (
        <Card>
          <Suspense fallback={<Spinner />}>
            <SecurityTab id={id} />
          </Suspense>
        </Card>
      )}

      {labTabs.includes(tab as (typeof labTabs)[number]) && (
        <Suspense fallback={<Spinner />}>
          <LabPanel tabId={tab as (typeof labTabs)[number]} algorithmId={id} />
        </Suspense>
      )}
    </div>
  )
}

export { ALGORITHMS }
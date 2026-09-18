import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type {
  LabCertificateCheck,
  LabCertificateInfo,
  LabCertificateSignResponse,
  LabCertificateVerifyResponse,
  LabCertSignResponse,
  LabCertVerifyResponse,
  LabChainVerifyResponse,
  LabCsrResponse,
  LabSelfSignedResponse,
} from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { CertificateSummary } from './CertificateSummary'
import { FileDropzone } from './FileDropzone'
import { KeyFields } from './KeyFields'
import { LabResult } from './LabResult'
import { textToBase64 } from './labUtils'
import { useLabFile } from './useLabFile'
import { useSignatureKeys } from './useSignatureKeys'
import type { SignAlgorithm } from './types'

const EKU_OPTIONS = ['server_auth', 'client_auth', 'code_signing', 'email_protection']
const HASH_OPTIONS = ['sha256', 'sha384', 'sha512']

type Mode = 'generate' | 'issue' | 'view' | 'verify' | 'sign'

interface SubjectValue {
  common_name: string
  organization: string
  country: string
  locality: string
}

const EMPTY_SUBJECT: SubjectValue = {
  common_name: '',
  organization: '',
  country: '',
  locality: '',
}

function subjectPayload(value: SubjectValue): Record<string, string> {
  const payload: Record<string, string> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (raw.trim()) payload[key] = raw.trim()
  }
  return payload
}

function SubjectFields({
  value,
  onChange,
  idPrefix,
}: {
  value: SubjectValue
  onChange: (value: SubjectValue) => void
  idPrefix: string
}) {
  const { t } = useI18n()
  const update = (key: keyof SubjectValue) => (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: event.target.value })
  return (
    <div className="lab-grid-2">
      <Field label={t('lab.certificate.subject.commonName')} required>
        <input
          id={`${idPrefix}-cn`}
          value={value.common_name}
          placeholder={t('lab.certificate.subject.commonNamePlaceholder')}
          onChange={update('common_name')}
        />
      </Field>
      <Field label={t('lab.certificate.subject.organization')}>
        <input value={value.organization} onChange={update('organization')} />
      </Field>
      <Field label={t('lab.certificate.subject.country')}>
        <input value={value.country} onChange={update('country')} />
      </Field>
      <Field label={t('lab.certificate.subject.locality')}>
        <input value={value.locality} onChange={update('locality')} />
      </Field>
    </div>
  )
}

function EkuPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  const { t } = useI18n()
  return (
    <Field label={t('lab.certificate.fields.eku')}>
      <div className="lab-checklist">
        {EKU_OPTIONS.map((option) => (
          <label key={option} className="lab-check">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...value, option]
                    : value.filter((item) => item !== option),
                )
              }
            />
            <span className="mono" dir="ltr">
              {option}
            </span>
          </label>
        ))}
      </div>
    </Field>
  )
}

function ChecksList({ checks }: { checks: LabCertificateCheck[] }) {
  const { t } = useI18n()
  return (
    <ul className="lab-checks">
      {checks.map((check) => (
        <li key={check.name} className={check.passed ? 'is-pass' : 'is-fail'}>
          <span className="mono" dir="ltr">
            {check.name}
          </span>
          <span className="lab-check-detail">{check.detail}</span>
          <span className="lab-check-state">
            {check.passed ? t('lab.certificate.verify.passed') : t('lab.certificate.verify.failed')}
          </span>
        </li>
      ))}
    </ul>
  )
}

function CertificateLearn() {
  const { t } = useI18n()
  const keys = [
    'signature',
    'certificate',
    'ca',
    'csr',
    'chain',
    'selfSigned',
    'trust',
  ] as const
  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.certificate.intro')}</Alert>
      <div className="lab-learn">
        {keys.map((key) => (
          <div key={key} className="lab-learn-item">
            <strong>{t(`lab.certificate.learn.${key}`)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeneratePanel({ algorithm }: { algorithm: SignAlgorithm }) {
  const { t } = useI18n()
  const keys = useSignatureKeys(algorithm)
  const [subject, setSubject] = useState<SubjectValue>({ ...EMPTY_SUBJECT })
  const [validity, setValidity] = useState(365)
  const [isCa, setIsCa] = useState(false)
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256')
  const [sanDns, setSanDns] = useState('')
  const [eku, setEku] = useState<string[]>([])
  const [result, setResult] = useState<LabSelfSignedResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    if (!keys.privateKeyPem) {
      setError(t('lab.certificate.errors.noKey'))
      return
    }
    if (!subject.common_name.trim()) {
      setError(t('lab.certificate.errors.noSubject'))
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    api.lab
      .certificateSelfSigned({
        algorithm,
        private_key_pem: keys.privateKeyPem,
        subject: subjectPayload(subject),
        validity_days: validity,
        is_ca: isCa,
        hash_algorithm: hashAlgorithm,
        extended_key_usage: eku,
        san_dns: sanDns
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      .then(setResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Card title={t('lab.certificate.generate.title')}>
        <div className="lab-grid-2">
          <Field label={t('lab.certificate.types')}>
            <select value={isCa ? 'ca' : 'leaf'} onChange={(e) => setIsCa(e.target.value === 'ca')}>
              <option value="leaf">{t('lab.certificate.typeLeaf')}</option>
              <option value="ca">{t('lab.certificate.typeCa')}</option>
            </select>
          </Field>
          <Field label={t('lab.certificate.fields.validity')}>
            <input
              type="number"
              min={1}
              max={3650}
              value={validity}
              onChange={(e) => setValidity(Number(e.target.value))}
            />
          </Field>
          {algorithm !== 'ed25519' && (
            <Field label={t('lab.certificate.fields.hash')}>
              <select value={hashAlgorithm} onChange={(e) => setHashAlgorithm(e.target.value)}>
                {HASH_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label={t('lab.certificate.fields.san')} hint={t('lab.certificate.fields.sanHint')}>
            <input value={sanDns} onChange={(e) => setSanDns(e.target.value)} dir="ltr" />
          </Field>
        </div>
        <EkuPicker value={eku} onChange={setEku} />
        <p className="field-hint">
          {isCa ? t('lab.certificate.generate.caHint') : t('lab.certificate.generate.leafHint')}
        </p>
      </Card>

      <Card title={t('lab.certificate.subject.title')}>
        <SubjectFields value={subject} onChange={setSubject} idPrefix="self" />
      </Card>

      <Card title={t('lab.certificate.generate.keySection')}>
        <KeyFields algorithm={algorithm} state={keys} />
      </Card>

      <Button variant="primary" onClick={run} disabled={busy}>
        {busy ? t('common.loading') : t('lab.certificate.generate.run')}
      </Button>
      {error && <Alert variant="error">{error}</Alert>}
      {result && (
        <CertificateSummary
          certificate={result.certificate}
          title={t('lab.certificate.generate.done')}
          processingMs={result.processing_ms}
        />
      )}
    </div>
  )
}

function IssuePanel({ algorithm }: { algorithm: SignAlgorithm }) {
  const { t } = useI18n()
  const subjectKeys = useSignatureKeys(algorithm)
  const caKeys = useSignatureKeys(algorithm)
  const [subject, setSubject] = useState<SubjectValue>({ ...EMPTY_SUBJECT })
  const [caSubject, setCaSubject] = useState<SubjectValue>({
    ...EMPTY_SUBJECT,
    common_name: 'My Root CA',
  })
  const [validity, setValidity] = useState(365)
  const [caValidity, setCaValidity] = useState(3650)
  const [eku, setEku] = useState<string[]>(['server_auth'])
  const [csr, setCsr] = useState<LabCsrResponse | null>(null)
  const [ca, setCa] = useState<LabSelfSignedResponse | null>(null)
  const [issued, setIssued] = useState<LabCertificateSignResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCsr = () => {
    if (!subjectKeys.privateKeyPem) {
      setError(t('lab.certificate.errors.noKey'))
      return
    }
    if (!subject.common_name.trim()) {
      setError(t('lab.certificate.errors.noSubject'))
      return
    }
    setBusy(true)
    setError(null)
    api.lab
      .certificateCsr({
        algorithm,
        private_key_pem: subjectKeys.privateKeyPem,
        subject: subjectPayload(subject),
      })
      .then(setCsr)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  const createCa = () => {
    if (!caKeys.privateKeyPem) {
      setError(t('lab.certificate.errors.noKey'))
      return
    }
    if (!caSubject.common_name.trim()) {
      setError(t('lab.certificate.errors.noSubject'))
      return
    }
    setBusy(true)
    setError(null)
    api.lab
      .certificateCa({
        algorithm,
        private_key_pem: caKeys.privateKeyPem,
        subject: subjectPayload(caSubject),
        validity_days: caValidity,
      })
      .then(setCa)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  const signCsr = () => {
    if (!csr) {
      setError(t('lab.certificate.issue.noCsr'))
      return
    }
    if (!ca) {
      setError(t('lab.certificate.issue.noCa'))
      return
    }
    if (!caKeys.privateKeyPem) {
      setError(t('lab.certificate.errors.noKey'))
      return
    }
    setBusy(true)
    setError(null)
    setIssued(null)
    api.lab
      .certificateSign({
        csr_pem: csr.csr_pem,
        ca_certificate_pem: ca.certificate.pem,
        ca_private_key_pem: caKeys.privateKeyPem,
        validity_days: validity,
        extended_key_usage: eku,
      })
      .then(setIssued)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Card title={t('lab.certificate.issue.caTitle')}>
        <SubjectFields value={caSubject} onChange={setCaSubject} idPrefix="ca" />
        <Field label={t('lab.certificate.fields.validity')}>
          <input
            type="number"
            min={1}
            max={3650}
            value={caValidity}
            onChange={(e) => setCaValidity(Number(e.target.value))}
          />
        </Field>
        <Card title={t('lab.certificate.issue.caKeySection')}>
          <KeyFields algorithm={algorithm} state={caKeys} />
        </Card>
        <div className="lab-actions">
          <Button variant="default" onClick={createCa} disabled={busy}>
            {t('lab.certificate.issue.createCa')}
          </Button>
        </div>
        {ca && (
          <LabResult
            variant="success"
            title={t('lab.certificate.issue.caReady')}
            rows={[
              {
                label: t('lab.certificate.result.subject'),
                value: String(ca.certificate.subject.common_name ?? ''),
              },
            ]}
          />
        )}
      </Card>

      <Card title={t('lab.certificate.issue.subjectTitle')}>
        <SubjectFields value={subject} onChange={setSubject} idPrefix="csr" />
        <Field label={t('lab.certificate.fields.validity')}>
          <input
            type="number"
            min={1}
            max={3650}
            value={validity}
            onChange={(e) => setValidity(Number(e.target.value))}
          />
        </Field>
        <EkuPicker value={eku} onChange={setEku} />
        <Card title={t('lab.certificate.issue.caKeySection')}>
          <KeyFields algorithm={algorithm} state={subjectKeys} />
        </Card>
        <div className="lab-actions">
          <Button variant="default" onClick={generateCsr} disabled={busy}>
            {t('lab.certificate.issue.generateCsr')}
          </Button>
          <Button variant="primary" onClick={signCsr} disabled={busy}>
            {t('lab.certificate.issue.signCsr')}
          </Button>
        </div>
        {csr && (
          <LabResult
            variant="success"
            title={t('lab.certificate.issue.csrReady')}
            processingMs={csr.processing_ms}
            download={{
              dataText: csr.csr_pem,
              filename: 'request.csr',
              mime: 'application/pkcs10',
            }}
            rows={[
              {
                label: t('lab.certificate.result.subject'),
                value: String(csr.subject.common_name ?? ''),
              },
              {
                label: 'signature',
                value: csr.signature_valid ? t('lab.certificate.verify.passed') : t('lab.certificate.verify.failed'),
              },
            ]}
          />
        )}
      </Card>

      {error && <Alert variant="error">{error}</Alert>}
      {issued && (
        <CertificateSummary
          certificate={issued.certificate}
          title={`${t('lab.certificate.issue.issued')} ${issued.issuer_common_name}`}
          processingMs={issued.processing_ms}
        />
      )}
    </div>
  )
}

function ViewPanel() {
  const { t } = useI18n()
  const file = useLabFile()
  const [pemText, setPemText] = useState('')
  const [parsed, setParsed] = useState<LabCertificateInfo | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    if (!file.dataB64 && !pemText.trim()) {
      setError(t('lab.certificate.errors.noCertificate'))
      return
    }
    setBusy(true)
    setError(null)
    setParsed(null)
    api.lab
      .certificateParse(
        file.dataB64 ? { certificate_b64: file.dataB64 } : { certificate: pemText },
      )
      .then(setParsed)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Card title={t('lab.certificate.view.title')}>
        <Alert variant="info">{t('lab.certificate.view.hint')}</Alert>
        <Field label={t('lab.certificate.view.paste')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={6}
            value={pemText}
            spellCheck={false}
            onChange={(e) => setPemText(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.view.upload')}>
          <FileDropzone
            file={file.file}
            onSelect={file.select}
            onClear={file.clear}
            accept=".pem,.crt,.cer,.der"
          />
        </Field>
        <Button variant="primary" onClick={run} disabled={busy}>
          {busy ? t('common.loading') : t('lab.certificate.view.parse')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>
      {parsed && (
        <CertificateSummary
          certificate={parsed}
          title={t('lab.certificate.view.parsed')}
          processingMs={parsed.processing_ms}
        />
      )}
    </div>
  )
}

function VerifyPanel() {
  const { t } = useI18n()
  const [certPem, setCertPem] = useState('')
  const [caPem, setCaPem] = useState('')
  const [hostname, setHostname] = useState('')
  const [result, setResult] = useState<LabCertificateVerifyResponse | null>(null)
  const [chainLeaf, setChainLeaf] = useState('')
  const [chainIntermediate, setChainIntermediate] = useState('')
  const [chainRoot, setChainRoot] = useState('')
  const [chainResult, setChainResult] = useState<LabChainVerifyResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    if (!certPem.trim()) {
      setError(t('lab.certificate.errors.noCertificate'))
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    api.lab
      .certificateVerify({
        certificate: certPem,
        ca_certificate: caPem.trim() || undefined,
        expected_hostname: hostname.trim() || undefined,
      })
      .then(setResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  const runChain = () => {
    const chain = [chainLeaf, chainIntermediate, chainRoot].map((item) => item.trim()).filter(Boolean)
    if (chain.length < 1) {
      setError(t('lab.certificate.errors.noCertificate'))
      return
    }
    setBusy(true)
    setError(null)
    setChainResult(null)
    api.lab
      .certificateChainVerify({ chain })
      .then(setChainResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Card title={t('lab.certificate.verify.title')}>
        <Field label={t('lab.certificate.verify.certificate')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={6}
            value={certPem}
            spellCheck={false}
            onChange={(e) => setCertPem(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.verify.ca')} hint={t('lab.certificate.verify.caHint')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={4}
            value={caPem}
            spellCheck={false}
            onChange={(e) => setCaPem(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.verify.hostname')}>
          <input value={hostname} onChange={(e) => setHostname(e.target.value)} dir="ltr" />
        </Field>
        <Button variant="primary" onClick={run} disabled={busy}>
          {busy ? t('common.loading') : t('lab.certificate.verify.run')}
        </Button>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <LabResult
          variant={result.valid ? 'success' : 'error'}
          title={result.valid ? t('lab.certificate.verify.valid') : t('lab.certificate.verify.invalid')}
          message={result.trusted ? t('lab.certificate.verify.trusted') : t('lab.certificate.verify.untrusted')}
          processingMs={result.processing_ms}
        >
          <ChecksList checks={result.checks} />
        </LabResult>
      )}

      <Card title={t('lab.certificate.verify.chainTitle')}>
        <Field label={t('lab.certificate.verify.chainLeaf')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={4}
            value={chainLeaf}
            spellCheck={false}
            onChange={(e) => setChainLeaf(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.verify.chainIntermediate')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={4}
            value={chainIntermediate}
            spellCheck={false}
            onChange={(e) => setChainIntermediate(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.verify.chainRoot')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={4}
            value={chainRoot}
            spellCheck={false}
            onChange={(e) => setChainRoot(e.target.value)}
          />
        </Field>
        <Button variant="primary" onClick={runChain} disabled={busy}>
          {busy ? t('common.loading') : t('lab.certificate.verify.chainRun')}
        </Button>
        {chainResult && (
          <LabResult
            variant={chainResult.valid ? 'success' : 'error'}
            title={
              chainResult.valid
                ? t('lab.certificate.verify.chainValid')
                : t('lab.certificate.verify.chainInvalid')
            }
            processingMs={chainResult.processing_ms}
            rows={[
              {
                label: t('lab.certificate.verify.length'),
                value: chainResult.length,
              },
            ]}
          >
            <ChecksList checks={chainResult.checks} />
            <ol className="pki-chain" dir="ltr">
              {chainResult.chain.map((entry, index) => (
                <li key={`${entry.serial_number}-${index}`}>
                  <span className="mono">{entry.subject || '—'}</span>
                  <span className="lab-check-detail"> ← {entry.issuer || '—'}</span>
                  {entry.is_ca && <span className="badge badge-category">CA</span>}
                </li>
              ))}
            </ol>
          </LabResult>
        )}
      </Card>
    </div>
  )
}

function SignPanel({ algorithm }: { algorithm: SignAlgorithm }) {
  const { t } = useI18n()
  const keys = useSignatureKeys(algorithm)
  const file = useLabFile()
  const [source, setSource] = useState<'text' | 'file'>('text')
  const [message, setMessage] = useState('')
  const [certificate, setCertificate] = useState('')
  const [caCertificate, setCaCertificate] = useState('')
  const [signatureHex, setSignatureHex] = useState('')
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256')
  const [signResult, setSignResult] = useState<LabCertSignResponse | null>(null)
  const [verifyResult, setVerifyResult] = useState<LabCertVerifyResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dataB64 = source === 'file' ? file.dataB64 : message ? textToBase64(message) : ''

  const run = (action: 'sign' | 'verify') => {
    if (!certificate.trim()) {
      setError(t('lab.certificate.errors.noCertificate'))
      return
    }
    if (!dataB64) {
      setError(source === 'file' ? t('lab.certificate.errors.noFile') : t('lab.certificate.errors.noMessage'))
      return
    }
    setBusy(true)
    setError(null)
    setSignResult(null)
    setVerifyResult(null)

    const hash = algorithm === 'ed25519' ? undefined : hashAlgorithm
    const request =
      action === 'sign'
        ? keys.privateKeyPem
          ? api.lab.certificateSignData({
              data_b64: dataB64,
              algorithm,
              private_key_pem: keys.privateKeyPem,
              certificate,
              hash_algorithm: hash,
            })
          : Promise.reject(new Error(t('lab.certificate.errors.noKey')))
        : signatureHex.trim()
          ? api.lab.certificateVerifyData({
              data_b64: dataB64,
              signature_hex: signatureHex,
              algorithm,
              certificate,
              ca_certificate: caCertificate.trim() || undefined,
              hash_algorithm: hash,
            })
          : Promise.reject(new Error(t('lab.certificate.errors.noSignature')))

    request
      .then((response) => {
        if (action === 'sign') setSignResult(response as LabCertSignResponse)
        else setVerifyResult(response as LabCertVerifyResponse)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.certificate.sign.intro')}</Alert>

      <Card title={t('lab.certificate.sign.title')}>
        <div className="lab-grid-2">
          <Field label={t('lab.certificate.sign.source')}>
            <select value={source} onChange={(e) => setSource(e.target.value as 'text' | 'file')}>
              <option value="text">{t('lab.certificate.sign.sourceText')}</option>
              <option value="file">{t('lab.certificate.sign.sourceFile')}</option>
            </select>
          </Field>
          {algorithm !== 'ed25519' && (
            <Field label={t('lab.certificate.fields.hash')}>
              <select value={hashAlgorithm} onChange={(e) => setHashAlgorithm(e.target.value)}>
                {HASH_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        {source === 'text' ? (
          <Field label={t('lab.certificate.sign.message')}>
            <textarea
              rows={4}
              value={message}
              placeholder={t('lab.certificate.sign.messagePlaceholder')}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>
        ) : (
          <Field label={t('lab.certificate.sign.sourceFile')}>
            <FileDropzone file={file.file} onSelect={file.select} onClear={file.clear} />
          </Field>
        )}

        <Field label={t('lab.certificate.sign.certificate')} hint={t('lab.certificate.sign.certificateHint')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={5}
            value={certificate}
            spellCheck={false}
            onChange={(e) => setCertificate(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.sign.ca')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={3}
            value={caCertificate}
            spellCheck={false}
            onChange={(e) => setCaCertificate(e.target.value)}
          />
        </Field>
        <Field label={t('lab.certificate.sign.signature')} hint={t('lab.certificate.sign.signatureHint')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={3}
            value={signatureHex}
            spellCheck={false}
            onChange={(e) => setSignatureHex(e.target.value)}
          />
        </Field>

        <div className="lab-actions">
          <Button variant="primary" onClick={() => run('sign')} disabled={busy}>
            {t('lab.certificate.sign.sign')}
          </Button>
          <Button variant="default" onClick={() => run('verify')} disabled={busy}>
            {t('lab.certificate.sign.verify')}
          </Button>
        </div>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      <Card title={t('lab.certificate.generate.keySection')}>
        <KeyFields algorithm={algorithm} state={keys} />
      </Card>

      {signResult && (
        <LabResult
          variant="success"
          title={t('lab.certificate.sign.signed')}
          processingMs={signResult.processing_ms}
          download={{
            dataText: signResult.signature_hex,
            filename: 'signature.sig',
            mime: 'text/plain',
          }}
          rows={[
            {
              label: t('lab.certificate.sign.signature'),
              value: signResult.signature_hex,
              mono: true,
              copyText: signResult.signature_hex,
            },
            {
              label: t('lab.certificate.sign.certificateValid'),
              value: signResult.certificate_valid
                ? t('lab.certificate.sign.valid')
                : t('lab.certificate.sign.invalid'),
            },
            {
              label: t('lab.certificate.result.subject'),
              value: signResult.certificate_subject,
            },
          ]}
        />
      )}

      {verifyResult && (
        <LabResult
          variant={verifyResult.signature_valid ? 'success' : 'error'}
          title={
            verifyResult.signature_valid
              ? t('lab.certificate.sign.validSignature')
              : t('lab.certificate.sign.invalidSignature')
          }
          processingMs={verifyResult.processing_ms}
          rows={[
            {
              label: t('lab.certificate.sign.signatureValid'),
              value: verifyResult.signature_valid
                ? t('lab.certificate.sign.valid')
                : t('lab.certificate.sign.invalid'),
            },
            {
              label: t('lab.certificate.sign.certificateValid'),
              value: verifyResult.certificate_valid
                ? t('lab.certificate.sign.valid')
                : t('lab.certificate.sign.invalid'),
            },
            {
              label: t('lab.certificate.sign.certificateTrusted'),
              value: verifyResult.certificate_trusted
                ? t('lab.certificate.sign.valid')
                : t('lab.certificate.sign.invalid'),
            },
          ]}
        >
          <ChecksList checks={verifyResult.checks} />
        </LabResult>
      )}
    </div>
  )
}

export function CertificateLab({ algorithm }: { algorithm: SignAlgorithm }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<Mode>('generate')
  const modes: Mode[] = ['generate', 'issue', 'view', 'verify', 'sign']

  return (
    <div className="lab-stack">
      <CertificateLearn />
      <div className="lab-mode-tabs" role="group" aria-label={t('algorithm.tabs.certificate')}>
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            className={`lab-mode${mode === item ? ' is-active' : ''}`}
            onClick={() => setMode(item)}
          >
            {t(`lab.certificate.modes.${item}`)}
          </button>
        ))}
      </div>

      {mode === 'generate' && <GeneratePanel algorithm={algorithm} />}
      {mode === 'issue' && <IssuePanel algorithm={algorithm} />}
      {mode === 'view' && <ViewPanel />}
      {mode === 'verify' && <VerifyPanel />}
      {mode === 'sign' && <SignPanel algorithm={algorithm} />}
    </div>
  )
}

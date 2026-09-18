import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabSignResponse, LabVerifyResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { KeyFields } from './KeyFields'
import { LabResult } from './LabResult'
import { textToBase64 } from './labUtils'
import { useSignatureKeys } from './useSignatureKeys'
import type { SignAlgorithm } from './types'

interface SignatureLabProps {
  algorithm: SignAlgorithm
  mode: 'sign' | 'verify'
}

export function SignatureLab({ algorithm, mode }: SignatureLabProps) {
  const { t } = useI18n()
  const keys = useSignatureKeys(algorithm)
  const [message, setMessage] = useState('')
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256')
  const [signatureHex, setSignatureHex] = useState('')
  const [signResult, setSignResult] = useState<LabSignResponse | null>(null)
  const [verifyResult, setVerifyResult] = useState<LabVerifyResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSign = mode === 'sign'
  const supportsHash = algorithm !== 'ed25519'

  const run = () => {
    if (!message) {
      setError(t('lab.errors.noMessage'))
      return
    }
    setBusy(true)
    setError(null)
    setSignResult(null)
    setVerifyResult(null)
    const dataB64 = textToBase64(message)
    const request = isSign
      ? keys.privateKeyPem
        ? api.lab.sign({
            data_b64: dataB64,
            algorithm,
            private_key_pem: keys.privateKeyPem,
            hash_algorithm: supportsHash ? hashAlgorithm : undefined,
          })
        : Promise.reject(new Error(t('lab.errors.noPrivateKey')))
      : signatureHex && keys.publicKeyPem
        ? api.lab.verify({
            data_b64: dataB64,
            signature_hex: signatureHex,
            algorithm,
            public_key_pem: keys.publicKeyPem,
            hash_algorithm: supportsHash ? hashAlgorithm : undefined,
          })
        : Promise.reject(
            new Error(signatureHex ? t('lab.errors.noPublicKey') : t('lab.errors.noSignature')),
          )
    request
      .then((response) => {
        if (isSign) setSignResult(response as LabSignResponse)
        else setVerifyResult(response as LabVerifyResponse)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Alert variant="info">
        {t('lab.sign.intro')}{' '}
        <span className="mono" dir="ltr">
          {algorithm.toUpperCase()}
        </span>
      </Alert>

      <Card title={t('lab.sign.message')}>
        <Field label={t('lab.sign.message')}>
          <textarea
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t('lab.sign.messagePlaceholder')}
          />
        </Field>

        {supportsHash && (
          <Field label={t('lab.sign.hash')}>
            <select
              value={hashAlgorithm}
              onChange={(event) => setHashAlgorithm(event.target.value)}
            >
              <option value="sha256">SHA-256</option>
              <option value="sha384">SHA-384</option>
              <option value="sha512">SHA-512</option>
            </select>
          </Field>
        )}

        {!isSign && (
          <Field label={t('lab.sign.signature')} hint={t('lab.sign.signatureHint')}>
            <textarea
              className="mono"
              dir="ltr"
              rows={4}
              value={signatureHex}
              spellCheck={false}
              onChange={(event) => setSignatureHex(event.target.value)}
            />
          </Field>
        )}

        <Button variant="primary" onClick={run} disabled={busy} data-testid="lab-sign-run">
          {busy ? t('common.loading') : isSign ? t('lab.sign.sign') : t('lab.sign.verify')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      <Card title={t('lab.keys.title')}>
        <KeyFields algorithm={algorithm} state={keys} />
      </Card>

      {signResult && (
        <LabResult
          variant="success"
          title={t('lab.sign.signed')}
          processingMs={signResult.processing_ms}
          download={{
            dataText: signResult.signature_hex,
            filename: 'message.sig',
            mime: 'text/plain',
          }}
          rows={[
            { label: t('lab.sign.signature'), value: signResult.signature_hex, mono: true, copyText: signResult.signature_hex },
            { label: t('lab.meta.algorithm'), value: signResult.algorithm, mono: true },
            {
              label: t('lab.sign.signatureSize'),
              value: `${signResult.signature_size} B`,
            },
          ]}
        />
      )}

      {verifyResult && (
        <LabResult
          variant={verifyResult.valid ? 'success' : 'error'}
          title={verifyResult.valid ? t('lab.sign.valid') : t('lab.sign.invalid')}
          message={verifyResult.valid ? t('lab.sign.validHint') : t('lab.sign.invalidHint')}
          processingMs={verifyResult.processing_ms}
        />
      )}
    </div>
  )
}

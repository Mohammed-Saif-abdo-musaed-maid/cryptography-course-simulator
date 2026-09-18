import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabFileResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { FileDropzone } from './FileDropzone'
import { KeyFields } from './KeyFields'
import { LabResult } from './LabResult'
import { formatBytes } from './labUtils'
import { useLabFile } from './useLabFile'
import { useSignatureKeys } from './useSignatureKeys'

interface HybridLabProps {
  mode?: 'encrypt' | 'decrypt'
}

export function HybridLab({ mode: initialMode = 'encrypt' }: HybridLabProps) {
  const { t } = useI18n()
  const keys = useSignatureKeys('rsa')
  const file = useLabFile()
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>(initialMode)
  const [symmetricAlgorithm, setSymmetricAlgorithm] = useState('aes_gcm')
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256')
  const [result, setResult] = useState<LabFileResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEncrypt = mode === 'encrypt'

  const run = () => {
    if (!file.dataB64) {
      setError(t('lab.errors.noFile'))
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    const request = isEncrypt
      ? keys.publicKeyPem
        ? api.lab.hybridEncrypt({
            data_b64: file.dataB64,
            public_key_pem: keys.publicKeyPem,
            symmetric_algorithm: symmetricAlgorithm,
            hash_algorithm: hashAlgorithm,
            filename: file.file?.name ?? '',
            mime_type: file.file?.type ?? '',
          })
        : Promise.reject(new Error(t('lab.errors.noPublicKey')))
      : keys.privateKeyPem
        ? api.lab.hybridDecrypt({
            container_b64: file.dataB64,
            private_key_pem: keys.privateKeyPem,
          })
        : Promise.reject(new Error(t('lab.errors.noPrivateKey')))
    request
      .then(setResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  const download = result
    ? isEncrypt
      ? {
          dataB64: result.container_b64,
          filename: result.output_filename,
          mime: 'application/octet-stream',
        }
      : {
          dataB64: result.data_b64,
          filename: result.output_filename,
          mime: result.metadata.original_mime_type || 'application/octet-stream',
        }
    : null

  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.hybrid.intro')}</Alert>

      <div className="lab-toggle">
        <label>
          <input
            type="radio"
            checked={isEncrypt}
            onChange={() => setMode('encrypt')}
          />{' '}
          {t('lab.hybrid.encrypt')}
        </label>
        <label>
          <input
            type="radio"
            checked={!isEncrypt}
            onChange={() => setMode('decrypt')}
          />{' '}
          {t('lab.hybrid.decrypt')}
        </label>
      </div>

      <div className="hybrid-flow" aria-hidden="true">
        <div className="hybrid-flow-node">{t('lab.hybrid.flowFile')}</div>
        <div className="hybrid-flow-arrow">→</div>
        <div className="hybrid-flow-node">{t('lab.hybrid.flowData')}</div>
        <div className="hybrid-flow-arrow">→</div>
        <div className="hybrid-flow-node">{t('lab.hybrid.flowContainer')}</div>
      </div>
      <div className="hybrid-flow hybrid-flow-key" aria-hidden="true">
        <div className="hybrid-flow-node">{t('lab.hybrid.flowRandomKey')}</div>
        <div className="hybrid-flow-arrow">→</div>
        <div className="hybrid-flow-node">{t('lab.hybrid.flowRsaWrap')}</div>
        <div className="hybrid-flow-arrow">→</div>
        <div className="hybrid-flow-node">{t('lab.hybrid.flowWrappedKey')}</div>
      </div>

      <Card title={isEncrypt ? t('lab.hybrid.pickPlain') : t('lab.hybrid.pickContainer')}>
        <FileDropzone
          file={file.file}
          onSelect={file.select}
          onClear={file.clear}
          accept={isEncrypt ? undefined : '.hcs'}
          error={file.error ? t(`lab.file.${file.error}`) : null}
        />
      </Card>

      <Card title={t('lab.keys.title')}>
        <KeyFields
          algorithm="rsa"
          state={keys}
          privateLabel={t('lab.keys.privateDecrypt')}
          publicLabel={t('lab.keys.publicEncrypt')}
        />
      </Card>

      {isEncrypt && (
        <Card title={t('lab.hybrid.options')}>
          <Field label={t('lab.hybrid.symmetric')}>
            <select
              value={symmetricAlgorithm}
              onChange={(event) => setSymmetricAlgorithm(event.target.value)}
            >
              <option value="aes_gcm">AES-256-GCM</option>
              <option value="chacha20_poly1305">ChaCha20-Poly1305</option>
            </select>
          </Field>
          <Field label={t('lab.hybrid.oaepHash')}>
            <select value={hashAlgorithm} onChange={(event) => setHashAlgorithm(event.target.value)}>
              <option value="sha256">SHA-256</option>
              <option value="sha384">SHA-384</option>
              <option value="sha512">SHA-512</option>
            </select>
          </Field>
        </Card>
      )}

      <Card title={t('lab.hybrid.run')}>
        <Button variant="primary" onClick={run} disabled={busy || !file.dataB64}>
          {busy ? t('common.loading') : isEncrypt ? t('lab.hybrid.encrypt') : t('lab.hybrid.decrypt')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      {result && (
        <LabResult
          variant="success"
          title={isEncrypt ? t('lab.hybrid.encrypted') : t('lab.hybrid.decrypted')}
          message={result.output_filename}
          processingMs={result.processing_ms}
          download={download}
          rows={[
            { label: t('lab.meta.mode'), value: result.metadata.mode, mono: true },
            { label: t('lab.meta.algorithm'), value: result.metadata.algorithm, mono: true },
            { label: t('lab.hybrid.keyAlgorithm'), value: result.metadata.key_algorithm ?? '—', mono: true },
            {
              label: t('lab.hybrid.wrappedKey'),
              value: result.metadata.wrapped_key_present
                ? t('lab.hybrid.wrappedPresent')
                : t('lab.hybrid.wrappedAbsent'),
            },
            {
              label: t('lab.meta.originalSize'),
              value: formatBytes(result.metadata.original_size),
            },
            {
              label: t('lab.meta.ciphertextLength'),
              value: formatBytes(result.metadata.ciphertext_length),
            },
          ]}
        />
      )}
    </div>
  )
}

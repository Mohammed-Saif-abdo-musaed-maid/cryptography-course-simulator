import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabFileResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { FileDropzone } from './FileDropzone'
import { LabResult } from './LabResult'
import { formatBytes } from './labUtils'
import { useLabFile } from './useLabFile'

interface FileCryptoLabProps {
  algorithm: string
  mode: 'encrypt' | 'decrypt'
}

export function FileCryptoLab({ algorithm, mode }: FileCryptoLabProps) {
  const { t } = useI18n()
  const file = useLabFile()
  const [password, setPassword] = useState('')
  const [keyHex, setKeyHex] = useState('')
  const [useKey, setUseKey] = useState(false)
  const [kdf, setKdf] = useState('pbkdf2_sha256')
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
      ? api.lab.fileEncrypt({
          data_b64: file.dataB64,
          filename: file.file?.name ?? '',
          mime_type: file.file?.type ?? '',
          algorithm,
          kdf,
          password: useKey ? undefined : password || undefined,
          key_hex: useKey ? keyHex || undefined : undefined,
        })
      : api.lab.fileDecrypt({
          container_b64: file.dataB64,
          password: password || undefined,
          key_hex: keyHex || undefined,
        })
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
      <Alert variant="info">
        {isEncrypt ? t('lab.file.encryptIntro') : t('lab.file.decryptIntro')}
      </Alert>

      <Card title={isEncrypt ? t('lab.file.pickPlain') : t('lab.file.pickContainer')}>
        <FileDropzone
          file={file.file}
          onSelect={file.select}
          onClear={file.clear}
          accept={isEncrypt ? undefined : '.hcs'}
          error={file.error ? t(`lab.file.${file.error}`) : null}
        />
      </Card>

      <Card title={t('lab.file.keySection')}>
        {isEncrypt && (
          <div className="lab-toggle">
            <label>
              <input type="radio" checked={!useKey} onChange={() => setUseKey(false)} />{' '}
              {t('lab.file.usePassword')}
            </label>
            <label>
              <input type="radio" checked={useKey} onChange={() => setUseKey(true)} />{' '}
              {t('lab.file.useHexKey')}
            </label>
          </div>
        )}

        {(!isEncrypt || !useKey) && (
          <Field label={t('lab.file.password')} hint={t('lab.file.passwordHint')}>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
        )}

        {(isEncrypt ? useKey : true) && (
          <Field label={t('lab.file.hexKey')} hint={t('lab.file.hexKeyHint')}>
            <input
              className="mono"
              dir="ltr"
              value={keyHex}
              autoComplete="off"
              onChange={(event) => setKeyHex(event.target.value)}
              placeholder="64 hex characters"
            />
          </Field>
        )}

        {isEncrypt && !useKey && (
          <Field label={t('lab.file.kdf')}>
            <select value={kdf} onChange={(event) => setKdf(event.target.value)}>
              <option value="pbkdf2_sha256">PBKDF2-HMAC-SHA256</option>
              <option value="argon2id">Argon2id</option>
            </select>
          </Field>
        )}

        <Button variant="primary" onClick={run} disabled={busy || !file.dataB64}>
          {busy ? t('common.loading') : isEncrypt ? t('lab.file.encrypt') : t('lab.file.decrypt')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      {result && (
        <LabResult
          variant="success"
          title={isEncrypt ? t('lab.file.encrypted') : t('lab.file.decrypted')}
          message={result.output_filename}
          processingMs={result.processing_ms}
          download={download}
          rows={[
            { label: t('lab.meta.algorithm'), value: result.metadata.algorithm, mono: true },
            { label: t('lab.meta.mode'), value: result.metadata.mode, mono: true },
            {
              label: t('lab.meta.kdf'),
              value: result.metadata.kdf ?? t('lab.meta.none'),
              mono: true,
            },
            {
              label: t('lab.meta.originalFilename'),
              value: result.metadata.original_filename || '—',
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

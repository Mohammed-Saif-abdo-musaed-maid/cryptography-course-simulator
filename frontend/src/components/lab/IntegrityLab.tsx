import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabHashVerifyResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { FileDropzone } from './FileDropzone'
import { LabResult } from './LabResult'
import { useLabFile } from './useLabFile'

interface VariantOption {
  value: string | number
  label: string
}

const VARIANTS: Record<string, VariantOption[]> = {
  sha3: [
    { value: 'sha3_256', label: 'SHA3-256' },
    { value: 'sha3_224', label: 'SHA3-224' },
    { value: 'sha3_384', label: 'SHA3-384' },
    { value: 'sha3_512', label: 'SHA3-512' },
  ],
  blake2: [
    { value: 'blake2b', label: 'BLAKE2b-512' },
    { value: 'blake2s', label: 'BLAKE2s-256' },
  ],
  blake3: [
    { value: 32, label: 'BLAKE3-256' },
    { value: 64, label: 'BLAKE3-512' },
  ],
}

export function IntegrityLab({ algorithm }: { algorithm: string }) {
  const { t } = useI18n()
  const file = useLabFile()
  const options = VARIANTS[algorithm]
  const [variant, setVariant] = useState<string | number>(options?.[0]?.value ?? '')
  const [expectedHex, setExpectedHex] = useState('')
  const [result, setResult] = useState<LabHashVerifyResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    if (!file.dataB64) {
      setError(t('lab.errors.noFile'))
      return
    }
    if (!expectedHex.trim()) {
      setError(t('lab.errors.noExpectedHash'))
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    api.lab
      .hashVerify({
        data_b64: file.dataB64,
        expected_hex: expectedHex.trim(),
        algorithm,
        variant: variant === '' ? undefined : variant,
      })
      .then(setResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Alert variant="warning">{t('lab.integrity.intro')}</Alert>

      <Card title={t('lab.integrity.pickFile')}>
        <FileDropzone
          file={file.file}
          onSelect={file.select}
          onClear={file.clear}
          error={file.error ? t(`lab.file.${file.error}`) : null}
        />

        {options && (
          <Field label={t('lab.hash.variant')}>
            <select
              value={String(variant)}
              onChange={(event) => {
                const selected = options.find((option) => String(option.value) === event.target.value)
                setVariant(selected ? selected.value : event.target.value)
              }}
            >
              {options.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label={t('lab.integrity.expected')} hint={t('lab.integrity.expectedHint')}>
          <textarea
            className="mono"
            dir="ltr"
            rows={3}
            value={expectedHex}
            spellCheck={false}
            onChange={(event) => setExpectedHex(event.target.value)}
          />
        </Field>

        <Button variant="primary" onClick={run} disabled={busy || !file.dataB64}>
          {busy ? t('common.loading') : t('lab.integrity.verify')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      {result && (
        <LabResult
          variant={result.match ? 'success' : 'error'}
          title={result.match ? t('lab.integrity.match') : t('lab.integrity.mismatch')}
          message={result.match ? t('lab.integrity.matchHint') : t('lab.integrity.mismatchHint')}
          processingMs={result.processing_ms}
          rows={[
            { label: t('lab.integrity.expectedShort'), value: result.expected_hex, mono: true },
            { label: t('lab.integrity.actual'), value: result.digest_hex, mono: true, copyText: result.digest_hex },
          ]}
        />
      )}
    </div>
  )
}

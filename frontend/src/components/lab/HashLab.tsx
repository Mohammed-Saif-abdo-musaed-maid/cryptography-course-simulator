import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabHashResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { FileDropzone } from './FileDropzone'
import { LabResult } from './LabResult'
import { formatBytes } from './labUtils'
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

export function HashLab({ algorithm }: { algorithm: string }) {
  const { t } = useI18n()
  const file = useLabFile()
  const options = VARIANTS[algorithm]
  const [variant, setVariant] = useState<string | number>(options?.[0]?.value ?? '')
  const [result, setResult] = useState<LabHashResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    if (!file.dataB64) {
      setError(t('lab.errors.noFile'))
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    api.lab
      .hash({ data_b64: file.dataB64, algorithm, variant: variant === '' ? undefined : variant })
      .then(setResult)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.hash.intro')}</Alert>

      <Card title={t('lab.hash.pickFile')}>
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

        <Button variant="primary" onClick={run} disabled={busy || !file.dataB64}>
          {busy ? t('common.loading') : t('lab.hash.compute')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      {result && (
        <LabResult
          variant="success"
          title={t('lab.hash.digest')}
          processingMs={result.processing_ms}
          download={{
            dataText: result.digest_hex,
            filename: `${algorithm}-digest.txt`,
            mime: 'text/plain',
          }}
          rows={[
            { label: t('lab.meta.algorithm'), value: result.variant || result.algorithm, mono: true },
            { label: t('lab.hash.digest'), value: result.digest_hex, mono: true, copyText: result.digest_hex },
            { label: t('lab.hash.digestSize'), value: `${result.digest_size} B` },
            { label: t('lab.meta.fileSize'), value: formatBytes(result.input_size) },
          ]}
        />
      )}
    </div>
  )
}

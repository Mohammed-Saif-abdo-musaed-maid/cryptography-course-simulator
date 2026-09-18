import { useState } from 'react'
import { useI18n } from '../../i18n'
import { api } from '../../services/api'
import type { LabMacResponse, LabMacVerifyResponse } from '../../types'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Field } from '../ui/Field'
import { FileDropzone } from './FileDropzone'
import { LabResult } from './LabResult'
import { textToBase64 } from './labUtils'
import { useLabFile } from './useLabFile'

interface MacLabProps {
  mode: 'generate' | 'verify'
}

type KeyKind = 'text' | 'hex'

interface MacOption {
  id: string
  label: string
  keyKind: KeyKind
}

const MAC_OPTIONS: readonly MacOption[] = [
  { id: 'hmac_sha256', label: 'HMAC-SHA256', keyKind: 'text' },
  { id: 'hmac_sha512', label: 'HMAC-SHA512', keyKind: 'text' },
  { id: 'cmac_aes128', label: 'AES-CMAC-128', keyKind: 'hex' },
  { id: 'cmac_aes192', label: 'AES-CMAC-192', keyKind: 'hex' },
  { id: 'cmac_aes256', label: 'AES-CMAC-256', keyKind: 'hex' },
  { id: 'poly1305', label: 'Poly1305', keyKind: 'hex' },
]

function optionFor(id: string): MacOption {
  return MAC_OPTIONS.find((option) => option.id === id) ?? MAC_OPTIONS[0]
}

export function MacLab({ mode }: MacLabProps) {
  const { t } = useI18n()
  const file = useLabFile()
  const [source, setSource] = useState<'text' | 'file'>('text')
  const [text, setText] = useState('')
  const [key, setKey] = useState('')
  const [algorithm, setAlgorithm] = useState('hmac_sha256')
  const [macHex, setMacHex] = useState('')
  const [generated, setGenerated] = useState<LabMacResponse | null>(null)
  const [verified, setVerified] = useState<LabMacVerifyResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isGenerate = mode === 'generate'
  const option = optionFor(algorithm)
  const dataB64 = source === 'file' ? file.dataB64 : textToBase64(text)

  const keyHint = () => {
    if (option.keyKind === 'text') return t('lab.mac.secretHint')
    if (option.id === 'poly1305') return t('lab.mac.secretHintPoly')
    return t('lab.mac.secretHintHex')
  }

  const changeAlgorithm = (id: string) => {
    setAlgorithm(id)
    setKey('')
    setMacHex('')
    setGenerated(null)
    setVerified(null)
    setError(null)
  }

  const run = () => {
    if (!dataB64) {
      setError(source === 'file' ? t('lab.errors.noFile') : t('lab.errors.noMessage'))
      return
    }
    if (!key) {
      setError(t('lab.errors.noSecret'))
      return
    }
    if (!isGenerate && !macHex.trim()) {
      setError(t('lab.errors.noMac'))
      return
    }
    setBusy(true)
    setError(null)
    setGenerated(null)
    setVerified(null)
    const request = isGenerate
      ? api.lab.macGenerate({ data_b64: dataB64, key, algorithm })
      : api.lab.macVerify({
          data_b64: dataB64,
          key,
          mac_hex: macHex.trim(),
          algorithm,
        })
    request
      .then((response) => {
        if (isGenerate) setGenerated(response as LabMacResponse)
        else setVerified(response as LabMacVerifyResponse)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'error'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="lab-stack">
      <Alert variant="info">{t('lab.mac.intro')}</Alert>

      <Card title={t('lab.mac.source')}>
        <div className="lab-toggle">
          <label>
            <input type="radio" checked={source === 'text'} onChange={() => setSource('text')} />{' '}
            {t('lab.mac.sourceText')}
          </label>
          <label>
            <input type="radio" checked={source === 'file'} onChange={() => setSource('file')} />{' '}
            {t('lab.mac.sourceFile')}
          </label>
        </div>

        {source === 'text' ? (
          <Field label={t('lab.mac.message')}>
            <textarea
              rows={4}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t('lab.sign.messagePlaceholder')}
            />
          </Field>
        ) : (
          <FileDropzone
            file={file.file}
            onSelect={file.select}
            onClear={file.clear}
            error={file.error ? t(`lab.file.${file.error}`) : null}
          />
        )}

        <Field label={t('lab.mac.algorithm')}>
          <select value={algorithm} onChange={(event) => changeAlgorithm(event.target.value)}>
            {MAC_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('lab.mac.secret')} hint={keyHint()}>
          <input
            type={option.keyKind === 'text' ? 'password' : 'text'}
            className={option.keyKind === 'text' ? undefined : 'mono'}
            dir={option.keyKind === 'text' ? undefined : 'ltr'}
            value={key}
            spellCheck={false}
            autoComplete="new-password"
            onChange={(event) => setKey(event.target.value)}
          />
        </Field>

        {!isGenerate && (
          <Field label={t('lab.mac.mac')} hint={t('lab.mac.macHint')}>
            <textarea
              className="mono"
              dir="ltr"
              rows={3}
              value={macHex}
              spellCheck={false}
              onChange={(event) => setMacHex(event.target.value)}
            />
          </Field>
        )}

        <Button variant="primary" onClick={run} disabled={busy}>
          {busy ? t('common.loading') : isGenerate ? t('lab.mac.generate') : t('lab.mac.verify')}
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </Card>

      {generated && (
        <LabResult
          variant="success"
          title={t('lab.mac.generated')}
          processingMs={generated.processing_ms}
          download={{
            dataText: generated.mac_hex,
            filename: 'mac.txt',
            mime: 'text/plain',
          }}
          rows={[
            { label: t('lab.mac.mac'), value: generated.mac_hex, mono: true, copyText: generated.mac_hex },
            { label: t('lab.meta.algorithm'), value: generated.algorithm, mono: true },
            { label: t('lab.mac.macSize'), value: `${generated.mac_size} B` },
          ]}
        />
      )}

      {verified && (
        <LabResult
          variant={verified.valid ? 'success' : 'error'}
          title={verified.valid ? t('lab.mac.valid') : t('lab.mac.invalid')}
          message={verified.valid ? t('lab.mac.validHint') : t('lab.mac.invalidHint')}
          processingMs={verified.processing_ms}
        />
      )}
    </div>
  )
}

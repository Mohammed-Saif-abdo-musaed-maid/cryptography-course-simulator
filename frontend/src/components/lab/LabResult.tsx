import type { ReactNode } from 'react'
import { useI18n } from '../../i18n'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { CopyButton } from '../ui/CodeBlock'
import { downloadBase64, downloadText } from './labUtils'
import type { LabResultVariant } from './types'

export interface LabResultRow {
  label: string
  value: ReactNode
  mono?: boolean
  copyText?: string
}

interface LabResultProps {
  variant: LabResultVariant
  title: string
  message?: ReactNode
  rows?: LabResultRow[]
  processingMs?: number
  download?: {
    dataB64?: string
    dataText?: string
    filename: string
    mime?: string
  } | null
  children?: ReactNode
}

export function LabResult({
  variant,
  title,
  message,
  rows,
  processingMs,
  download,
  children,
}: LabResultProps) {
  const { t } = useI18n()
  return (
    <div className="lab-result">
      <Alert variant={variant}>
        <strong>{title}</strong>
        {message ? <span> — {message}</span> : null}
      </Alert>

      {rows && rows.length > 0 && (
        <dl className="lab-result-rows">
          {rows.map((row) => (
            <div key={row.label} className="lab-result-row">
              <dt>{row.label}</dt>
              <dd className={row.mono ? 'mono' : undefined} dir={row.mono ? 'ltr' : undefined}>
                <span className="lab-result-value">{row.value}</span>
                {row.copyText ? <CopyButton text={row.copyText} label={row.label} /> : null}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {typeof processingMs === 'number' && (
        <p className="lab-timing">
          {t('lab.timing')}: <span className="mono" dir="ltr">{processingMs} ms</span>
        </p>
      )}

      {download && (
        <div className="lab-result-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (download.dataB64 !== undefined) {
                downloadBase64(download.dataB64, download.filename, download.mime)
              } else if (download.dataText !== undefined) {
                downloadText(download.dataText, download.filename, download.mime)
              }
            }}
          >
            {t('lab.download')}
          </Button>
        </div>
      )}

      {children}
    </div>
  )
}

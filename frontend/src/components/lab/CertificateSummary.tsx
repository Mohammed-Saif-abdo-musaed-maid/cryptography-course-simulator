import { useI18n } from '../../i18n'
import type { LabCertificateInfo, LabName } from '../../types'
import { Button } from '../ui/Button'
import { downloadBase64 } from './labUtils'
import { LabResult } from './LabResult'

interface CertificateSummaryProps {
  certificate: LabCertificateInfo
  title?: string
  processingMs?: number
}

function formatName(name: LabName): string {
  const parts = Object.entries(name)
    .filter(([key]) => key !== 'other')
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(' ') : value}`)
  return parts.join(', ') || '—'
}

function trueKeys(flags: Record<string, boolean> | null): string {
  if (!flags) return '—'
  const enabled = Object.entries(flags)
    .filter(([, value]) => value)
    .map(([key]) => key)
  return enabled.length > 0 ? enabled.join(', ') : '—'
}

export function CertificateSummary({ certificate, title, processingMs }: CertificateSummaryProps) {
  const { t } = useI18n()
  const publicKey = certificate.public_key
  const publicKeyText = [publicKey.algorithm, publicKey.curve, publicKey.key_size]
    .filter(Boolean)
    .join(' ')

  return (
    <LabResult
      variant="success"
      title={title ?? t('lab.certificate.result.title')}
      processingMs={processingMs}
      download={{
        dataText: certificate.pem,
        filename: 'certificate.pem',
        mime: 'application/x-pem-file',
      }}
      rows={[
        { label: t('lab.certificate.result.subject'), value: formatName(certificate.subject) },
        { label: t('lab.certificate.result.issuer'), value: formatName(certificate.issuer) },
        {
          label: t('lab.certificate.result.serial'),
          value: certificate.serial_hex,
          mono: true,
          copyText: certificate.serial_number,
        },
        {
          label: t('lab.certificate.result.validity'),
          value: `${certificate.not_valid_before.slice(0, 10)} → ${certificate.not_valid_after.slice(0, 10)} (${certificate.validity_days} ${t('lab.certificate.result.days')})`,
        },
        {
          label: t('lab.certificate.result.selfSigned'),
          value: certificate.self_signed
            ? t('lab.certificate.result.yes')
            : t('lab.certificate.result.no'),
        },
        {
          label: t('lab.certificate.result.isCa'),
          value: certificate.is_ca
            ? t('lab.certificate.result.yes')
            : t('lab.certificate.result.no'),
        },
        { label: t('lab.certificate.result.keyUsage'), value: trueKeys(certificate.key_usage) },
        {
          label: t('lab.certificate.result.eku'),
          value:
            certificate.extended_key_usage.length > 0
              ? certificate.extended_key_usage.join(', ')
              : t('lab.certificate.result.none'),
        },
        {
          label: t('lab.certificate.result.san'),
          value:
            (certificate.subject_alternative_name.dns ?? []).join(', ') ||
            t('lab.certificate.result.none'),
        },
        {
          label: t('lab.certificate.result.signatureAlgorithm'),
          value: certificate.signature_algorithm,
          mono: true,
        },
        { label: t('lab.certificate.result.publicKey'), value: publicKeyText, mono: true },
        {
          label: t('lab.certificate.result.fingerprint'),
          value: certificate.fingerprint_sha256,
          mono: true,
          copyText: certificate.fingerprint_sha256,
        },
      ]}
    >
      <div className="lab-result-actions">
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            downloadBase64(certificate.der_b64, 'certificate.der', 'application/pkix-cert')
          }
        >
          {t('lab.certificate.result.downloadDer')}
        </Button>
      </div>
    </LabResult>
  )
}

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../../i18n'

export function CodeBlock({ children }: { children: ReactNode }) {
  return <pre className="code-block">{children}</pre>
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" className="btn btn-sm btn-ghost" onClick={onCopy} aria-label={label ?? t('common.copy')}>
      {copied ? t('common.copied') : t('common.copy')}
    </button>
  )
}
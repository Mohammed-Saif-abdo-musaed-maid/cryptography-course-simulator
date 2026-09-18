import { useI18n } from '../../i18n'
import { CopyButton } from '../ui/CodeBlock'
import { Field } from '../ui/Field'

interface KeyTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  secret?: boolean
  rows?: number
  required?: boolean
  invalid?: boolean
  hint?: string
}

export function KeyTextarea({
  label,
  value,
  onChange,
  placeholder,
  secret,
  rows = 4,
  required,
  invalid,
  hint,
}: KeyTextareaProps) {
  const { t } = useI18n()
  return (
    <Field label={label} hint={hint} required={required} invalid={invalid}>
      <div className="lab-key">
        <textarea
          className="lab-textarea mono"
          dir="ltr"
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder ?? (secret ? t('lab.keys.pastePrivate') : t('lab.keys.pastePublic'))}
          spellCheck={false}
          autoComplete="off"
        />
        {value ? <CopyButton text={value} label={label} /> : null}
      </div>
    </Field>
  )
}

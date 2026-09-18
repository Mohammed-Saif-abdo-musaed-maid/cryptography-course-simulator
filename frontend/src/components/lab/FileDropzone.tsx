import { useRef, useState } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import { useI18n } from '../../i18n'
import { Button } from '../ui/Button'
import { formatBytes, MAX_LAB_BYTES } from './labUtils'

interface FileDropzoneProps {
  file: File | null
  onSelect: (file: File) => void
  onClear: () => void
  accept?: string
  error?: string | null
  label?: string
  hint?: string
}

export function FileDropzone({ file, onSelect, onClear, accept, error, label, hint }: FileDropzoneProps) {
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => inputRef.current?.click()

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) onSelect(dropped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  return (
    <div
      className={`lab-dropzone${dragging ? ' is-dragging' : ''}${error ? ' is-error' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={openPicker}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label ?? t('lab.file.dropTitle')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="lab-file-input"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) onSelect(selected)
          event.target.value = ''
        }}
      />
      {file ? (
        <div className="lab-dropzone-file">
          <span className="lab-file-name" dir="ltr">
            {file.name}
          </span>
          <span className="lab-file-meta">
            {formatBytes(file.size)}
            {file.type ? ` · ${file.type}` : ''}
          </span>
        </div>
      ) : (
        <div className="lab-dropzone-empty">
          <span className="lab-dropzone-title">{label ?? t('lab.file.dropTitle')}</span>
          <span className="lab-dropzone-hint">
            {hint ?? t('lab.file.dropHint')} ({formatBytes(MAX_LAB_BYTES)})
          </span>
        </div>
      )}
      <div className="lab-dropzone-actions">
        <Button variant={file ? 'ghost' : 'primary'} size="sm" onClick={(event) => {
          event.stopPropagation()
          if (file) onClear()
          else openPicker()
        }}>
          {file ? t('lab.file.remove') : t('lab.file.choose')}
        </Button>
      </div>
    </div>
  )
}

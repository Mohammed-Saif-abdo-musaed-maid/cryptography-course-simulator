import { useCallback, useState } from 'react'
import { fileToBase64, MAX_LAB_BYTES } from './labUtils'

export interface LabFileState {
  file: File | null
  dataB64: string
  error: 'tooLarge' | 'readFailed' | null
  reading: boolean
  select: (file: File) => Promise<void>
  clear: () => void
}

export function useLabFile(maxBytes = MAX_LAB_BYTES): LabFileState {
  const [file, setFile] = useState<File | null>(null)
  const [dataB64, setDataB64] = useState('')
  const [error, setError] = useState<'tooLarge' | 'readFailed' | null>(null)
  const [reading, setReading] = useState(false)

  const select = useCallback(
    async (selected: File) => {
      setError(null)
      if (selected.size > maxBytes) {
        setError('tooLarge')
        setFile(null)
        setDataB64('')
        return
      }
      setReading(true)
      try {
        const encoded = await fileToBase64(selected)
        setFile(selected)
        setDataB64(encoded)
      } catch {
        setError('readFailed')
        setFile(null)
        setDataB64('')
      } finally {
        setReading(false)
      }
    },
    [maxBytes],
  )

  const clear = useCallback(() => {
    setFile(null)
    setDataB64('')
    setError(null)
  }, [])

  return { file, dataB64, error, reading, select, clear }
}

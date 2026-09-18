import { useCallback, useState } from 'react'
import { api } from '../../services/api'
import type { SignatureKeysState, SignAlgorithm } from './types'

export function useSignatureKeys(algorithm: SignAlgorithm): SignatureKeysState {
  const [rsaBits, setRsaBits] = useState(2048)
  const [curve, setCurve] = useState('p256')
  const [privateKeyPem, setPrivateKeyPem] = useState('')
  const [publicKeyPem, setPublicKeyPem] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(() => {
    setGenerating(true)
    setError(null)
    const body =
      algorithm === 'rsa'
        ? { algorithm, rsa_bits: rsaBits }
        : algorithm === 'ecdsa'
          ? { algorithm, curve }
          : { algorithm }
    api.lab
      .signatureKeys(body)
      .then((keys) => {
        setPrivateKeyPem(keys.private_key_pem)
        setPublicKeyPem(keys.public_key_pem)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'error')
      })
      .finally(() => setGenerating(false))
  }, [algorithm, rsaBits, curve])

  return {
    rsaBits,
    setRsaBits,
    curve,
    setCurve,
    privateKeyPem,
    setPrivateKeyPem,
    publicKeyPem,
    setPublicKeyPem,
    generating,
    error,
    generate,
  }
}

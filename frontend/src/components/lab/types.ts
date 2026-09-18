export type LabResultVariant = 'success' | 'error' | 'info' | 'warning'

export type SignAlgorithm = 'rsa' | 'ecdsa' | 'ed25519'

export type SymmetricAlgorithm = 'aes_gcm' | 'chacha20_poly1305'

export type LabMode = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'generate'

export interface SignatureKeysState {
  rsaBits: number
  setRsaBits: (value: number) => void
  curve: string
  setCurve: (value: string) => void
  privateKeyPem: string
  setPrivateKeyPem: (value: string) => void
  publicKeyPem: string
  setPublicKeyPem: (value: string) => void
  generating: boolean
  error: string | null
  generate: () => void
}

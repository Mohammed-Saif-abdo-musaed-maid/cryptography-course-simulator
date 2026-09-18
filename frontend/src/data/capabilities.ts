import type { AlgorithmCapabilities } from '../types'

/**
 * Static capability mirror of the backend Algorithm Registry
 * (backend/app/algorithms/registry.py -> CAPABILITIES).
 *
 * This follows the project convention of keeping a static frontend mirror of
 * the backend registry (see data/catalog.ts). Capabilities control UI surface
 * (dynamic tabs, badges) — they never replace `operations`, which still
 * drives the simulator dispatch.
 */

function caps(
  flags: Partial<Record<keyof AlgorithmCapabilities, boolean>> = {},
): AlgorithmCapabilities {
  return {
    textEncryption: false,
    textDecryption: false,
    fileEncryption: false,
    fileDecryption: false,
    digitalSignature: false,
    signatureVerification: false,
    fileSignature: false,
    fileSignatureVerification: false,
    hashing: false,
    fileHashing: false,
    integrityVerification: false,
    mac: false,
    macVerification: false,
    keyExchange: false,
    keyDerivation: false,
    hybridEncryption: false,
    digitalCertificate: false,
    certificateAuthority: false,
    ...flags,
  }
}

const textCipher = () => caps({ textEncryption: true, textDecryption: true })

export const CAPABILITIES: Record<string, AlgorithmCapabilities> = {
  // Classical educational ciphers: text-only.
  caesar: textCipher(),
  monoalphabetic: textCipher(),
  vigenere: textCipher(),
  playfair: textCipher(),
  hill: textCipher(),
  rail_fence: textCipher(),
  columnar: textCipher(),
  // Educational symmetric block/stream modules (hex-block based): text-only.
  des: textCipher(),
  triple_des: textCipher(),
  aes: textCipher(),
  blowfish: textCipher(),
  twofish: textCipher(),
  chacha20: textCipher(),
  camellia: textCipher(),
  aes_cbc: textCipher(),
  aes_ctr: textCipher(),
  // AEAD backed by the "cryptography" library: bytes-safe file crypto.
  aes_gcm: caps({
    textEncryption: true,
    textDecryption: true,
    fileEncryption: true,
    fileDecryption: true,
  }),
  chacha20_poly1305: caps({
    textEncryption: true,
    textDecryption: true,
    fileEncryption: true,
    fileDecryption: true,
  }),
  aes_ccm: caps({
    textEncryption: true,
    textDecryption: true,
    fileEncryption: true,
    fileDecryption: true,
  }),
  hmac: caps({ mac: true, macVerification: true }),
  cmac: caps({ mac: true, macVerification: true }),
  poly1305: caps({ mac: true, macVerification: true }),
  pbkdf2: caps({ keyDerivation: true }),
  bcrypt: caps({ keyDerivation: true }),
  scrypt: caps({ keyDerivation: true }),
  argon2: caps({ keyDerivation: true }),
  hkdf: caps({ keyDerivation: true }),
  ecdh: caps({ keyExchange: true }),
  x25519: caps({ keyExchange: true }),
  x448: caps({ keyExchange: true }),
  diffie_hellman: caps({ keyExchange: true }),
  ecdsa: caps({
    digitalSignature: true,
    signatureVerification: true,
    fileSignature: true,
    fileSignatureVerification: true,
    digitalCertificate: true,
    certificateAuthority: true,
  }),
  ed25519: caps({
    digitalSignature: true,
    signatureVerification: true,
    fileSignature: true,
    fileSignatureVerification: true,
    digitalCertificate: true,
    certificateAuthority: true,
  }),
  dsa: caps({ digitalSignature: true, signatureVerification: true }),
  rsa_pss: caps({ digitalSignature: true, signatureVerification: true }),
  rsa: caps({
    textEncryption: true,
    textDecryption: true,
    digitalSignature: true,
    signatureVerification: true,
    fileSignature: true,
    fileSignatureVerification: true,
    hybridEncryption: true,
    digitalCertificate: true,
    certificateAuthority: true,
  }),
  elgamal: textCipher(),
  md5: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha1: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha256: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha512: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha3: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  blake2: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  blake3: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha224: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  sha384: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
  ripemd160: caps({ hashing: true, fileHashing: true, integrityVerification: true }),
}

export const emptyCapabilities: AlgorithmCapabilities = caps()
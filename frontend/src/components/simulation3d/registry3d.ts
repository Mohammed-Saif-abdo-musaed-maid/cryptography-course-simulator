import type { Simulation3DAdapter } from './types/simulation3d'
import { caesar3DAdapter } from './adapters/caesar3D'
import { vigenere3DAdapter } from './adapters/vigenere3D'
import { monoAlphabetic3DAdapter } from './adapters/monoAlphabetic3D'
import { playfair3DAdapter } from './adapters/playfair3D'
import { hill3DAdapter } from './adapters/hill3D'
import { railFence3DAdapter } from './adapters/railFence3D'
import { columnar3DAdapter } from './adapters/columnar3D'
import { des3DAdapter } from './adapters/des3D'
import { tripleDes3DAdapter } from './adapters/tripleDes3D'
import { aes3DAdapter } from './adapters/aes3D'
import { blowfish3DAdapter } from './adapters/blowfish3D'
import { twofish3DAdapter } from './adapters/twofish3D'
import { chacha203DAdapter } from './adapters/chacha203D'
import { aesGcm3DAdapter } from './adapters/aesGcm3D'
import { chacha20Poly13053DAdapter } from './adapters/chacha20Poly13053D'
import { sha256Adapter } from './adapters/sha2563D'
import { sha512Adapter } from './adapters/sha5123D'
import { sha224Adapter, sha384Adapter, ripemd160Adapter } from './adapters/hashFamily3D'
import { sha1Adapter } from './adapters/sha13D'
import { md5Adapter } from './adapters/md53D'
import { sha3Adapter } from './adapters/sha33D'
import { blake2Adapter } from './adapters/blake23D'
import { blake3Adapter } from './adapters/blake33D'
import { hmacAdapter } from './adapters/hmac3D'
import { pbkdf2Adapter } from './adapters/pbkdf23D'
import { bcryptAdapter } from './adapters/bcrypt3D'
import { scryptAdapter } from './adapters/scrypt3D'
import { argon2Adapter } from './adapters/argon23D'
import { hkdfAdapter } from './adapters/hkdf3D'
import { rsaAdapter } from './adapters/rsa3D'
import { elgamalAdapter } from './adapters/elgamal3D'
import { ecdhAdapter } from './adapters/ecdh3D'
import { x25519Adapter } from './adapters/x255193D'
import { ecdsaAdapter } from './adapters/ecdsa3D'
import { ed25519Adapter } from './adapters/ed255193D'
import { diffieHellmanAdapter } from './adapters/diffieHellman3D'
import { aesCbc3DAdapter } from './adapters/aesCbc3D'
import { aesCtr3DAdapter } from './adapters/aesCtr3D'
import { aesCcm3DAdapter } from './adapters/aesCcm3D'
import { camellia3DAdapter } from './adapters/camellia3D'
import { cmac3DAdapter } from './adapters/cmac3D'
import { poly13053DAdapter } from './adapters/poly13053D'
import { x4483DAdapter } from './adapters/x4483D'
import { dsa3DAdapter } from './adapters/dsa3D'
import { rsaPss3DAdapter } from './adapters/rsaPss3D'

/**
 * Registry of algorithms that ship a 3D simulation. Adding a new 3D
 * visualization means registering its adapter here — no other wiring needed.
 */
const REGISTRY: Record<string, Simulation3DAdapter> = {
  [caesar3DAdapter.id]: caesar3DAdapter,
  [vigenere3DAdapter.id]: vigenere3DAdapter,
  [monoAlphabetic3DAdapter.id]: monoAlphabetic3DAdapter,
  [playfair3DAdapter.id]: playfair3DAdapter,
  [hill3DAdapter.id]: hill3DAdapter,
  [railFence3DAdapter.id]: railFence3DAdapter,
  [columnar3DAdapter.id]: columnar3DAdapter,
  [des3DAdapter.id]: des3DAdapter,
  [tripleDes3DAdapter.id]: tripleDes3DAdapter,
  [aes3DAdapter.id]: aes3DAdapter,
  [blowfish3DAdapter.id]: blowfish3DAdapter,
  [twofish3DAdapter.id]: twofish3DAdapter,
  [chacha203DAdapter.id]: chacha203DAdapter,
  [aesGcm3DAdapter.id]: aesGcm3DAdapter,
  [chacha20Poly13053DAdapter.id]: chacha20Poly13053DAdapter,
  [sha256Adapter.id]: sha256Adapter,
  [sha512Adapter.id]: sha512Adapter,
  [sha224Adapter.id]: sha224Adapter,
  [sha384Adapter.id]: sha384Adapter,
  [ripemd160Adapter.id]: ripemd160Adapter,
  [sha1Adapter.id]: sha1Adapter,
  [aesCbc3DAdapter.id]: aesCbc3DAdapter,
  [aesCtr3DAdapter.id]: aesCtr3DAdapter,
  [aesCcm3DAdapter.id]: aesCcm3DAdapter,
  [camellia3DAdapter.id]: camellia3DAdapter,
  [cmac3DAdapter.id]: cmac3DAdapter,
  [poly13053DAdapter.id]: poly13053DAdapter,
  [x4483DAdapter.id]: x4483DAdapter,
  [dsa3DAdapter.id]: dsa3DAdapter,
  [rsaPss3DAdapter.id]: rsaPss3DAdapter,
  [md5Adapter.id]: md5Adapter,
  [sha3Adapter.id]: sha3Adapter,
  [blake2Adapter.id]: blake2Adapter,
  [blake3Adapter.id]: blake3Adapter,
  [hmacAdapter.id]: hmacAdapter,
  [pbkdf2Adapter.id]: pbkdf2Adapter,
  [bcryptAdapter.id]: bcryptAdapter,
  [scryptAdapter.id]: scryptAdapter,
  [argon2Adapter.id]: argon2Adapter,
  [hkdfAdapter.id]: hkdfAdapter,
  [rsaAdapter.id]: rsaAdapter,
  [elgamalAdapter.id]: elgamalAdapter,
  [ecdhAdapter.id]: ecdhAdapter,
  [x25519Adapter.id]: x25519Adapter,
  [ecdsaAdapter.id]: ecdsaAdapter,
  [ed25519Adapter.id]: ed25519Adapter,
  [diffieHellmanAdapter.id]: diffieHellmanAdapter,
}

export function has3DAdapter(id: string): boolean {
  return id in REGISTRY
}

export function get3DAdapter(id: string): Simulation3DAdapter | undefined {
  return REGISTRY[id]
}

/** All registered 3D adapters (id → adapter). Test/audit tooling use this. */
export function getAll3DAdapters(): Record<string, Simulation3DAdapter> {
  return { ...REGISTRY }
}
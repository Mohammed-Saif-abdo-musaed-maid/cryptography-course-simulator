import type { SimulationEngine } from './simulationTypes'
import { aesEngine } from './renderers/aes'
import { aesGcmEngine } from './renderers/aesGcm'
import { argon2Engine } from './renderers/argon2'
import { bcryptEngine } from './renderers/bcrypt'
import { blake2Engine } from './renderers/blake2'
import { blake3Engine } from './renderers/blake3'
import { blowfishEngine } from './renderers/blowfish'
import { caesarEngine } from './renderers/caesar'
import { chacha20Engine } from './renderers/chacha20'
import { chacha20Poly1305Engine } from './renderers/chacha20Poly1305'
import { columnarEngine } from './renderers/columnar'
import { desEngine } from './renderers/des'
import { diffieHellmanEngine } from './renderers/diffieHellman'
import { ecdhEngine } from './renderers/ecdh'
import { ecdsaEngine } from './renderers/ecdsa'
import { ed25519Engine } from './renderers/ed25519'
import { elgamalEngine } from './renderers/elgamal'
import { hillEngine } from './renderers/hill'
import { hkdfEngine } from './renderers/hkdf'
import { hmacEngine } from './renderers/hmac'
import { md5Engine } from './renderers/md5'
import { monoAlphabeticEngine } from './renderers/monoAlphabetic'
import { pbkdf2Engine } from './renderers/pbkdf2'
import { playfairEngine } from './renderers/playfair'
import { railFenceEngine } from './renderers/railFence'
import { rsaEngine } from './renderers/rsa'
import { scryptEngine } from './renderers/scrypt'
import { sha1Engine } from './renderers/sha1'
import { sha256Engine } from './renderers/sha256'
import { sha3Engine } from './renderers/sha3'
import { sha512Engine } from './renderers/sha512'
import { tripleDesEngine } from './renderers/tripleDes'
import { twofishEngine } from './renderers/twofish'
import { vigenereEngine } from './renderers/vigenere'
import { x25519Engine } from './renderers/x25519'

const ENGINES: Record<string, SimulationEngine> = {
  caesar: caesarEngine,
  vigenere: vigenereEngine,
  monoalphabetic: monoAlphabeticEngine,
  playfair: playfairEngine,
  hill: hillEngine,
  rail_fence: railFenceEngine,
  columnar: columnarEngine,
  des: desEngine,
  triple_des: tripleDesEngine,
  aes: aesEngine,
  blowfish: blowfishEngine,
  twofish: twofishEngine,
  chacha20: chacha20Engine,
  aes_gcm: aesGcmEngine,
  chacha20_poly1305: chacha20Poly1305Engine,
  md5: md5Engine,
  sha1: sha1Engine,
  sha256: sha256Engine,
  sha512: sha512Engine,
  sha3: sha3Engine,
  blake2: blake2Engine,
  blake3: blake3Engine,
  hmac: hmacEngine,
  pbkdf2: pbkdf2Engine,
  bcrypt: bcryptEngine,
  scrypt: scryptEngine,
  argon2: argon2Engine,
  hkdf: hkdfEngine,
  rsa: rsaEngine,
  elgamal: elgamalEngine,
  diffie_hellman: diffieHellmanEngine,
  ecdh: ecdhEngine,
  x25519: x25519Engine,
  ecdsa: ecdsaEngine,
  ed25519: ed25519Engine,
}

export function getEngine(id: string): SimulationEngine | undefined {
  return ENGINES[id]
}

export function hasEngine(id: string): boolean {
  return id in ENGINES
}
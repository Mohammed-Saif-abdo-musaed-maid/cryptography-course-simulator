import { byId } from '../../data/catalog'
import { ALGORITHM_EXAMPLES } from '../../data/examples'
import type { AlgorithmExample } from '../../data/examples'
import { operationLabels } from '../../data/grouping'
import { useI18n } from '../../i18n'
import { Button } from '../ui/Button'
import { CodeBlock } from '../ui/CodeBlock'
import { Alert } from '../ui/Alert'

const THEORY: Record<string, string[]> = {
  caesar: [
    'The Caesar cipher is the simplest substitution cipher. Every plaintext letter is replaced by the letter a fixed number of positions further along the alphabet.',
    'Encryption: C = (P + k) mod 26. Decryption: P = (C − k) mod 26.',
    'With only 25 meaningful shifts, brute-force decryption trivially recovers the message — try the brute-force operation in the simulator.',
  ],
  monoalphabetic: [
    'Each plaintext letter is replaced by another letter according to a fixed permutation (the substitution alphabet).',
    'The key space of 26! ≈ 4×10²⁶ permutations is huge, yet the cipher is still trivially broken with frequency analysis because every letter maps to exactly one ciphertext letter.',
  ],
  vigenere: [
    'A polyalphabetic cipher where shifting is applied with the repeating keyword: letter i uses shift of the i-th keyword letter.',
    'Encryption: Cᵢ = (Pᵢ + Kᵢ) mod 26. It defeated simple frequency analysis for 300 years.',
    'Kasiski’s examination and the index of coincidence break it by first recovering the keyword length, then solving each Caesar column.',
  ],
  playfair: [
    'Digraph substitution. Build a 5×5 square from the keyword (I and J share a cell).',
    'Each pair of plaintext letters is replaced according to: same row → letters to the right; same column → letters below; rectangle → opposite corners.',
    'Used by the British in WW2. Still breakable by digraph frequency analysis.',
  ],
  hill: [
    'A block cipher over vectors: the plaintext is split into blocks of size n and each block is multiplied by an invertible key matrix K modulo 26.',
    'Encryption: C = K·P mod 26. Decryption needs the modular inverse of K (which exists only when gcd(det K, 26) = 1).',
    'Known-plaintext attacks can recover K from just n pairs.',
  ],
  rail_fence: [
    'A transposition cipher: plaintext is written in a zig-zag across n "rails", then read off row by row.',
    'It does not change characters, only their order, so letter frequencies are preserved.',
  ],
  columnar: [
    'Transposition using a keyword: write the message in rows under the keyword, then read columns in the alphabetical order of the keyword letters.',
    'In this implementation, ties in the keyword are resolved left-to-right (stable order).',
  ],
  des: [
    'Data Encryption Standard — the famous 64-bit Feistel block cipher with a 56-bit effective key and 16 rounds.',
    'Each round: expansion, XOR with the round subkey, substitution through 8 S-boxes, permutation, then swap halves.',
    'In 1998 the EFF cracked a DES key in 56 hours; triple-DES and then AES replaced it.',
  ],
  triple_des: [
    'Applies DES three times in EDE mode: C = E(K3, D(K2, E(K1, P))).',
    'When K1 = K2 = K3 it reduces to single DES — try it with three identical keys in the simulator.',
    'Effective key space ≈ 112 bits. Deprecated since NIST withdrew it in 2023 in favour of AES.',
  ],
  aes: [
    'Advanced Encryption Standard (Rijndael): a 128-bit block cipher with 128/192/256-bit keys and 10/12/14 rounds.',
    'Each round applies SubBytes (S-box), ShiftRows, MixColumns (except the last) and AddRoundKey.',
    'No practical attacks are known against full AES; it is the global standard.',
  ],
  blowfish: [
    'Designed by Bruce Schneier in 1993: a 64-bit block cipher with a variable-length 32–448-bit key and 16 Feistel rounds.',
    'The P-array and four S-boxes are initialized from the hexadecimal digits of π and then randomized by encrypting zero blocks — the output of that key schedule makes the boxes key-dependent.',
    'F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]. Its 64-bit block is too small for modern modes (birthday bound), so it is deprecated in favour of AES.',
  ],
  twofish: [
    'An AES-competition finalist (1998) by Schneier, Kelsey, Whiting, Wagner, Hall and Ferguson.',
    'The key schedule builds key-dependent S-boxes from the fixed q0/q1 permutations, mixes them with a 4×4 MDS matrix over GF(2⁸), and derives whitening plus round subkeys via the (12,8) Reed–Solomon code over GF(2⁸).',
    'Each of the 16 rounds applies g() twice, a Pseudo-Hadamard Transform (PHT) with a subkey, and 1-bit word rotations. Twofish remains unbroken and unpatented.',
  ],
  chacha20: [
    'A modern stream cipher by Daniel J. Bernstein (2008), standardized in RFC 8439 and used by TLS 1.3.',
    '20 rounds (10 double rounds) are applied to a 16-word state built from constants, the 256-bit key, a block counter and a 96-bit nonce; the working state is added to the initial state to produce a 64-byte keystream block.',
    'C = P XOR keystream, and decryption is identical. The nonce MUST be unique per key.',
  ],
  rsa: [
    'The first practical public-key system: a trapdoor based on the hardness of factoring large composites.',
    'Choose primes p, q; n = p·q; φ = (p−1)(q−1); pick e coprime to φ; d = e⁻¹ mod φ. Public: (n, e). Private: d.',
    'Encryption: C = Mᵉ mod n. Decryption: M = Cᵈ mod n, guaranteed by Euler’s theorem.',
    'Always pair with proper padding (OAEP). Here messages are encoded in base 27 so every plaintext integer must be < n.',
  ],
  diffie_hellman: [
    'A protocol for two parties to agree on a shared secret over an insecure channel.',
    'Alice computes A = gᵃ mod p and Bob computes B = gᵇ mod p; they exchange A and B. The shared secret is s = Bᵃ mod p = Aᵇ mod p.',
    'Security rests on the discrete logarithm being hard for large p.',
  ],
  elgamal: [
    'Asymmetric encryption tightly related to Diffie–Hellman.',
    'Key generation: y = gˣ mod p. Encryption with ephemeral k: c1 = gᵏ mod p, c2 = m·yᵏ mod p.',
    'Decryption: m = c2 · c1⁻ˣ mod p. Because k is random, the same plaintext gives different ciphertexts every time.',
  ],
  sha256: [
    'A member of the SHA-2 family producing a fixed 256-bit digest from arbitrary-length input.',
    'Input is padded with a 1 bit, zeros, and a 64-bit length field into an exact number of 512-bit blocks.',
    'Each block runs 64 rounds of a compression function over 32-bit words (additions, rotations, XOR, logical gates).',
    'Preimage, second-preimage and collision resistance are all believed strong — no feasible attacks exist.',
  ],
  sha512: [
    'A SHA-2 variant with 64-bit words and an 80-round compression function, producing a 512-bit digest.',
    'Message blocks are 1024 bits; the round constants are the fractional parts of the cube roots of the first 80 primes and the initial words the square roots of the first 8 primes.',
    'Its structure mirrors SHA-256 but with larger words: LAU Σ, CH, MAJ and the σ operators all operate on 64-bit values.',
  ],
  sha1: [
    'SHA-1 produces a 160-bit digest using five 32-bit working registers over 80 rounds.',
    'It was the workhorse of TLS and Git for two decades, but in 2017 the SHAttered team produced a real chosen-prefix collision.',
    'SHA-1 is broken for collision resistance and formally deprecated: use SHA-2 or SHA-3.',
  ],
  md5: [
    'MD5 produces a 128-bit digest from the padding scheme of Merkle–Damgård: a 1 bit, zeros to finalization and a 64-bit length.',
    'The four 32-bit registers A, B, C, D pass through 4 rounds of 16 operations each with a different non-linear function (F, G, H, I).',
    'Fragments of the compression function (e.g. step 12 line 94, added as a backdoor) are what broke it — collisions can be forged in seconds.',
    'MD5 is broken: only retained here to demonstrate why legacy hashes must be retired.',
  ],
  sha3: [
    'SHA-3 is built on the Keccak sponge: the message is absorbed into the 1600-bit state (rate r + capacity c), then the digest is squeezed out.',
    'The permutation Keccak-f[1600] runs 24 rounds of five steps: θ, ρ, π, χ and ι.',
    'The four standardized variants SHA-3-224/256/384/512 differ only in the rate (144/136/104/72 bytes) and digest size.',
    'The sponge construction gives a security level of c/2 and enables generating digests of variable length (extendable output).',
  ],
  blake2: [
    'BLAKE2 improves on BLAKE (the SHA-3 finalist): a chained construction where the 64-byte (or 128-byte) message block, counter and final-block flag are mixed into the state.',
    'The initial state comes from the SHA-256/SHA-512 IV words XORed with the 32-bit parameter word (digest size and flags).',
    'BLAKE2b uses 128-byte blocks and 12 rounds of the BLAKE2s G function (rotations 32, 24, 16, 63); BLAKE2s uses 64-byte blocks and 10 rounds (rotations 16, 12, 8, 7).',
  ],
  blake3: [
    'BLAKE3 is a Merkle tree of 1024-byte chunks, each chunk compressed with the BLAKE2s round function (7 rounds of 8 G-functions with rotation pairs 16, 12, 8, 7).',
    'Every chunk is a tree leaf and is compressed independently — this enables SIMD and multithreaded hashing.',
    'Features (i) tree (parallelization) (ii) XOF (extendable output length) (iii) KDF and MAC (keyed hashing) (iv) single function — no variants.',
  ],
  aes_gcm: [
    'AES-GCM is Authenticated Encryption with Associated Data (AEAD): it combines AES in counter mode for confidentiality with the GHASH universal-hash polynomial for a 128-bit authentication tag.',
    'A unique 96-bit nonce MUST be used per key — reusing a nonce destroys both secrecy and integrity.',
    'On decryption the tag is checked first; if it does not match, NOTHING is returned and the data is rejected. Never strip GCM tags.',
  ],
  chacha20_poly1305: [
    'RFC 8439 combines the ChaCha20 stream cipher with the Poly1305 one-time authenticator into an AEAD used by TLS 1.3.',
    'The Poly1305 key is derived from the first 32 bytes of the ChaCha20 keystream; the tag covers the ciphertext and the associated data (AAD).',
    'It is fast in software and free of patents — the default AEAD in many modern protocols.',
  ],
  hmac: [
    'HMAC is a Message Authentication Code: a keyed hash that proves both integrity and authenticity of data shared through a symmetric key.',
    'The key is XORed with ipad (0x36) and opad (0x5c) and hashed twice: H((K opad) || H((K ipad) || m)).',
    'HMAC-SHA-256 is the foundation of TLS, JWT signatures and the PBKDF2/HKDF KDFs. Anyone without the key cannot forge a valid tag.',
  ],
  pbkdf2: [
    'PBKDF2 (RFC 8018) derives a key or password verifier by iterating HMAC over password + salt.',
    'Each iteration XORs successive HMAC outputs; the iteration count adds deliberate cost, so offline guessing is slow.',
    'For password storage, prefer a memory-hard KDF (scrypt, Argon2) — but PBKDF2 is still widely deployed (WPA2, legacy systems).',
  ],
  bcrypt: [
    'bcrypt is an adaptive password hash built on the Blowfish key schedule and the magic string "OrpheanBeholderScryDoubt".',
    'Its cost factor makes the work 2^cost times the base: doubling the factor doubles the time, keeping it future-proof.',
    'bcrypt ignores bytes beyond the first 72 of the password, and each random 128-bit salt guarantees a unique hash per password.',
  ],
  scrypt: [
    'scrypt (RFC 7914) is a memory-hard KDF: unlike PBKDF2 it requires a large block of RAM, defeating GPU/ASIC crackers.',
    'Parameters: N (cost) must be a power of two, r (block size) and p (parallelism). The final output is PBKDF2-HMAC-SHA256.',
    'Litecoin, Ripple, backups and password managers (e.g. VeraCrypt) use scrypt.',
  ],
  argon2: [
    'Argon2 won the Password Hashing Competition (2015). It is memory-hard, time-scalable and has three modes.',
    'argon2id (recommended) mixes the data-dependent and data-independent passes of argon2i and argon2d, resisting both GPU and side-channel attacks.',
    'The PHC hash embeds salt and parameters, so verification reads every needed value from the stored string.',
  ],
  hkdf: [
    'HKDF (RFC 5869) turns a high-entropy input key material (IKM) into many independent sub-keys.',
    'Two phases: HKDF-Extract uses the salt to compress the IKM into a pseudorandom key (PRK); HKDF-Expand then creates arbitrary-length output key material.',
    'Used in TLS 1.3 and WPA3 to derive per-direction, per-session keys from a single shared secret. The optional "info" binds each sub-key to its purpose.',
  ],
  ecdh: [
    'ECDH lets two parties derive a shared secret from their elliptic-curve key pairs: S = a·B = b·A.',
    'Only public keys travel over the channel; the ECDLP makes recovering the scalars infeasible for curves like P-256.',
    'Pairs with a key confirmation / signature step — ECDH alone gives no authentication of who you exchanged with.',
  ],
  x25519: [
    'X25519 (RFC 7748) is ECDH over Curve25519 using only x-coordinates; keys are always exactly 32 bytes.',
    'It is constant-time, un-patented and deliberately simpler than generic ECDH — the recommended modern choice (TLS 1.3, WireGuard, Signal).',
    'As with all DH, authentication must be layered on top (signatures, pre-shared keys).',
  ],
  ecdsa: [
    'ECDSA produces signatures (r, s) proving that the holder of the private key signed the message.',
    'The security relies on the ECDLP and on a fresh random nonce k per signature — reusing k leaks the private key entirely.',
    'Unlike encryption, ECDSA keeps the message readable: it authenticates (origin + integrity) but does not hide content.',
  ],
  ed25519: [
    'Ed25519 (RFC 8032) is a modern deterministic signature scheme on the Edwards curve.',
    'Deterministic means the same message always produces the same 64-byte signature — no random nonce, so no nonce-reuse attacks.',
    'Fast, side-channel resistant, and used in SSH, TLS and many blockchains. Signs, does not encrypt.',
  ],
}

export function TheoryTab({ id }: { id: string }) {
  const { t } = useI18n()
  const alg = byId(id)
  const paragraphs = THEORY[id] ?? []

  return (
    <div>
      <h4 className="card-title">{t('common.theory')}</h4>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ color: 'var(--text)', fontSize: 'var(--fs-md)' }}>{p}</p>
      ))}
      {alg && (
        <>
          <CodeBlock>
            {`Formula: ${alg.formula}
Key kind: ${alg.key_kind}
Block size: ${alg.block_size}
Reversible: ${alg.reversible ? 'yes' : 'no'}
Category: ${t(`category.${alg.category}`)}`}
          </CodeBlock>
          {alg.security_status === 'deprecated' && (
            <Alert variant="warning" >
              <strong>{t('security.title')}: </strong>
              {t('security.deprecatedNote')}
            </Alert>
          )}
        </>
      )}
    </div>
  )
}

export function ExamplesTab({
  id,
  onLoad,
}: {
  id: string
  onLoad?: (example: AlgorithmExample) => void
}) {
  const { t } = useI18n()
  const exampleList = ALGORITHM_EXAMPLES[id] ?? []
  const ops = operationLabels(id)
  const fields = byId(id)?.fields ?? []

  const labelOf = (name: string) => {
    const f = fields.find((x) => x.name === name)
    return f ? f.label : name
  }
  const opLabel = (op: string) =>
    ops.find((o) => o.value === op)?.label ?? op.replace(/_/g, ' ')

  return (
    <div>
      <h4 className="card-title">{t('common.examples')}</h4>
      {exampleList.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('theory.comingSoon')}</p>
      ) : (
        <>
          <p className="examples-hint">{t('examples.hint')}</p>
          <div className="examples-grid">
            {exampleList.map((ex) => (
              <div className="example-card" key={ex.id}>
                <div className="example-card-head">
                  <span className="badge badge-category">{ex.title}</span>
                  <span className="badge">{opLabel(ex.operation)}</span>
                </div>
                <div className="example-values">
                  {Object.keys(ex.values).length === 0 ? (
                    <p className="example-empty">{t('examples.noParams')}</p>
                  ) : (
                    Object.entries(ex.values).map(([k, v]) => (
                      <div className="example-value" key={k}>
                        <span className="example-key">{labelOf(k)}</span>
                        <span className={`example-val ${typeof v === 'string' ? 'mono' : ''}`}>
                          {Array.isArray(v) ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                {ex.note && <p className="example-note">{ex.note}</p>}
                {ex.expected && (
                  <CodeBlock>{`${t('examples.expected')}: ${ex.expected}`}</CodeBlock>
                )}
                {onLoad && (
                  <Button variant="primary" size="sm" onClick={() => onLoad(ex)}>
                    {t('examples.load')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <p style={{ color: 'var(--text-faint)', fontSize: 'var(--fs-xs)', marginTop: 12 }}>
        {t('simulator.validation')}
      </p>
    </div>
  )
}

export function SecurityTab({ id }: { id: string }) {
  const { t } = useI18n()
  const alg = byId(id)
  if (!alg) return null
  return (
    <div>
      <h4 className="card-title">{t('security.title')}</h4>
      {alg.security_status === 'deprecated' ? (
        <Alert variant="warning" >
          {t('security.deprecatedNote')}
        </Alert>
      ) : alg.security_status === 'broken' ? (
        <Alert variant="error" >
          {alg.name} is BROKEN: practical attacks recover original messages and forge collisions. It must NEVER be used for real data — shown here to illustrate why legacy hashes are retired.
        </Alert>
      ) : alg.security_status === 'broken_deprecated' ? (
        <Alert variant="error" >
          {alg.name} is broken for collision resistance and deprecated. Do not use it for real data — shown here for historical and educational study.
        </Alert>
      ) : alg.security_status === 'secure' ? (
        <Alert variant="success" >
          {alg.name} is considered secure for modern use when implemented correctly.
        </Alert>
      ) : (
        <Alert variant="info" >
          {alg.name} requires additional discipline ({alg.security_status.replace('_', ' ')}).
        </Alert>
      )}
      <CodeBlock>
        {`Security status : ${alg.security_status}
Key kind        : ${alg.key_kind}
Block size      : ${alg.block_size}
Reversible      : ${alg.reversible ? 'yes' : 'no'}
Formula         : ${alg.formula}`}
      </CodeBlock>
    </div>
  )
}
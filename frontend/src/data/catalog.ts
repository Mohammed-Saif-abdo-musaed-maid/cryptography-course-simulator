import type { AlgorithmDescriptor, AlgorithmField, Category, SecurityStatus } from '../types'

export interface StaticAlgorithm extends AlgorithmDescriptor {
  invented: string
  theory: Record<'ar' | 'en', { paragraphs: string[]; example?: string[] }>
}

type F = AlgorithmDescriptor['fields']

function field(
  name: string,
  type: AlgorithmDescriptor['fields'][number]['type'],
  label: string,
  opts: Partial<AlgorithmDescriptor['fields'][number]> = {},
) {
  return { name, type, label, required: true, ...opts }
}

const base = (
  id: string,
  name: string,
  category: Category,
  operations: string[],
  fields: F,
  meta: {
    security_status: SecurityStatus
    reversible: boolean
    key_kind: string
    block_size: string
    description: string
    formula: string
    invented: string
  },
): StaticAlgorithm => ({
  id,
  name,
  category,
  category_label: id,
  operations,
  fields,
  theory: { ar: { paragraphs: [] }, en: { paragraphs: [] } },
  ...meta,
})

export const ALGORITHMS: StaticAlgorithm[] = [
  base('caesar', 'Caesar Cipher', 'classical', ['encrypt', 'decrypt', 'brute_force'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELLO WORLD' }),
    field('shift', 'number', 'Shift (k)', { default: 3, min: 1, max: 25 }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'shift (integer 1–25)',
    block_size: '1 character',
    description: 'Each letter is shifted a fixed number of positions.',
    formula: 'C = (P + k) mod 26',
    invented: 'Roman era (used by Julius Caesar)',
  }),
  base('monoalphabetic', 'Monoalphabetic Substitution', 'classical', ['encrypt', 'decrypt', 'generate_alphabet'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELLO' }),
    field('substitution', 'text', 'Substitution alphabet', {
      default: 'QAZWSXEDCRFVTGBYHNUJMIKOLP',
      placeholder: 'QAZWSXEDCRFVTGBYHNUJMIKOLP',
    }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'substitution alphabet (26 letters)',
    block_size: '1 character',
    description: 'Each letter maps to a fixed substitute letter.',
    formula: 'cipher(c) = substitution[position(c)]',
    invented: 'Ancient atbash substitutions',
  }),
  base('vigenere', 'Vigenère Cipher', 'classical', ['encrypt', 'decrypt'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'ATTACKATDAWN' }),
    field('key', 'text', 'Keyword', { default: 'LEMON', placeholder: 'LEMON' }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'keyword (letters)',
    block_size: '1 character',
    description: 'Polyalphabetic shifts selected by a repeating keyword.',
    formula: 'Cᵢ = (Pᵢ + Kᵢ) mod 26',
    invented: 'Bellaso (1553), published by Vigenère (1586)',
  }),
  base('playfair', 'Playfair Cipher', 'classical', ['encrypt', 'decrypt'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELLO WORLD' }),
    field('keyword', 'text', 'Keyword', { default: 'MONARCHY', placeholder: 'MONARCHY' }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'keyword (letters)',
    block_size: '2 characters (digraph)',
    description: 'Digraph substitution using a 5×5 key square.',
    formula: 'digraph rules (row/column/rectangle)',
    invented: 'Charles Wheatstone (1854)',
  }),
  base('hill', 'Hill Cipher', 'classical', ['encrypt', 'decrypt'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELP' }),
    field('matrix', 'matrix', 'Key matrix (2×2 or 3×3)', { default: [[3, 3], [2, 5]] }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'invertible matrix (mod 26)',
    block_size: 'n letters (2 or 3)',
    description: 'Linear-algebra block cipher over Z/26Z.',
    formula: 'C = K·P (mod 26)',
    invented: 'Lester S. Hill (1929)',
  }),
  base('rail_fence', 'Rail Fence Cipher', 'classical', ['encrypt', 'decrypt'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELLOWORLD' }),
    field('rails', 'number', 'Number of rails', { default: 3, min: 2, max: 26 }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'number of rails',
    block_size: 'whole message',
    description: 'Zig-zag transposition across n rails.',
    formula: 'zig-zag write, row-by-row read',
    invented: 'Ancient Greeks (scytale transposition)',
  }),
  base('columnar', 'Columnar Transposition', 'classical', ['encrypt', 'decrypt'], [
    field('text', 'textarea', 'Plaintext / Ciphertext', { placeholder: 'HELLOWORLD' }),
    field('key', 'text', 'Keyword', { default: 'ZEBRA', placeholder: 'ZEBRA' }),
  ], {
    security_status: 'historic',
    reversible: true,
    key_kind: 'keyword (letters)',
    block_size: 'whole message',
    description: 'Write in rows, read columns in key order.',
    formula: 'column order = alphabetical key order',
    invented: 'Classical transposition cipher',
  }),
  base('des', 'DES', 'symmetric', ['encrypt', 'decrypt'], [
    field('block', 'text', 'Block (16 hex digits)', { default: '0123456789ABCDEF', placeholder: '0123456789ABCDEF' }),
    field('key', 'text', 'Key (16 hex digits)', { default: '133457799BBCDFF1', placeholder: '133457799BBCDFF1' }),
  ], {
    security_status: 'deprecated',
    reversible: true,
    key_kind: '56-bit effective key (8 bytes hex)',
    block_size: '64 bits',
    description: '64-bit Feistel block cipher with 56-bit key, 16 rounds.',
    formula: 'Feistel network with S-boxes',
    invented: 'IBM / NIST standardization (1977)',
  }),
  base('triple_des', '3DES (Triple DES)', 'symmetric', ['encrypt', 'decrypt'], [
    field('block', 'text', 'Block (16 hex digits)', { default: '0123456789ABCDEF', placeholder: '0123456789ABCDEF' }),
    field('key', 'text', 'Key (48 hex digits = 3×8 bytes)', {
      default: '133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1',
      placeholder: '133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1',
    }),
  ], {
    security_status: 'deprecated',
    reversible: true,
    key_kind: '3 × DES keys (24 bytes hex)',
    block_size: '64 bits',
    description: 'DES applied three times (EDE) — deprecated, prefer AES.',
    formula: 'C = E(K3, D(K2, E(K1, P)))',
    invented: '1990s (to extend DES key length)',
  }),
  base('aes', 'AES', 'symmetric', ['encrypt', 'decrypt'], [
    field('block', 'text', 'Block (32 hex digits)', {
      default: '00112233445566778899AABBCCDDEEFF',
      placeholder: '00112233445566778899AABBCCDDEEFF',
    }),
    field('key', 'text', 'Key (32/48/64 hex digits)', {
      default: '000102030405060708090A0B0C0D0E0F',
      placeholder: '000102030405060708090A0B0C0D0E0F',
    }),
  ], {
    security_status: 'secure',
    reversible: true,
    key_kind: '128 / 192 / 256 bits (hex)',
    block_size: '128 bits',
    description: 'Rijndael — the current recommended symmetric cipher.',
    formula: 'SubBytes, ShiftRows, MixColumns, AddRoundKey',
    invented: 'Rijndael (Daemen & Rijmen), standardized 2001',
  }),
  base('blowfish', 'Blowfish', 'symmetric', ['encrypt', 'decrypt'], [
    field('block', 'text', 'Block (16 hex digits)', {
      default: '0123456789ABCDEF',
      placeholder: '0123456789ABCDEF',
    }),
    field('key', 'text', 'Key (8–112 hex digits)', {
      default: '0123456789ABCDEFFEDCBA9876543210',
      placeholder: '0123456789ABCDEFFEDCBA9876543210',
    }),
  ], {
    security_status: 'deprecated',
    reversible: true,
    key_kind: 'variable 32–448 bits (4–56 bytes hex)',
    block_size: '64 bits',
    description: 'Variable-length-key Feistel block cipher by Bruce Schneier (1993); deprecated due to its 64-bit block.',
    formula: '16-round Feistel; F(x) = ((S0[a]+S1[b]) XOR S2[c]) + S3[d]',
    invented: 'Bruce Schneier (1993)',
  }),
  base('twofish', 'Twofish', 'symmetric', ['encrypt', 'decrypt'], [
    field('block', 'text', 'Block (32 hex digits)', {
      default: '00000000000000000000000000000000',
      placeholder: '00000000000000000000000000000000',
    }),
    field('key', 'text', 'Key (32/48/64 hex digits)', {
      default: '0123456789ABCDEFFEDCBA9876543210',
      placeholder: '0123456789ABCDEFFEDCBA98765432100011223344556677',
    }),
  ], {
    security_status: 'secure',
    reversible: true,
    key_kind: '128 / 192 / 256 bits (hex)',
    block_size: '128 bits',
    description: 'AES competition finalist (Schneier et al., 1998): 128-bit block, 16 rounds, key-dependent S-boxes and an MDS matrix over GF(2^8).',
    formula: 'g() (keyed S-boxes + MDS) → PHT → 1-bit rotations',
    invented: 'Schneier, Kelsey, Whiting, Wagner, Hall & Ferguson (1998)',
  }),
  base('chacha20', 'ChaCha20', 'symmetric', ['encrypt', 'decrypt'], [
    field('message', 'textarea', 'Plaintext / Ciphertext (hex)', {
      placeholder: 'Plaintext, or the hex ciphertext when decrypting',
    }),
    field('key', 'text', 'Key (64 hex digits)', {
      default: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
      placeholder: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    }),
    field('nonce', 'text', 'Nonce (24 hex digits)', {
      default: '000000000000004A00000000',
      placeholder: '000000000000004A00000000',
    }),
    field('counter', 'number', 'Initial block counter', { default: 1, min: 0 }),
  ], {
    security_status: 'secure',
    reversible: true,
    key_kind: '256-bit key (64 hex) + 96-bit nonce (24 hex)',
    block_size: 'stream cipher (64-byte blocks)',
    description: 'RFC 8439 stream cipher used by TLS 1.3: a keystream is XORed with the data — the same operation encrypts and decrypts.',
    formula: 'keystream = ChaCha20(key, nonce, counter); C = P XOR keystream',
    invented: 'Daniel J. Bernstein (2008), RFC 8439 (2018)',
  }),
  base('aes_gcm', 'AES-GCM', 'aead', ['encrypt', 'decrypt'], [
    field('plaintext', 'textarea', 'Plaintext', { placeholder: 'Hello, world!' }),
    field('ciphertext_hex', 'textarea', 'Ciphertext (hex, ciphertext+tag)', {
      placeholder: 'hex ciphertext (incl. 16-byte tag)',
      required: false,
    }),
    field('key_hex', 'text', 'Key (32/48/64 hex digits)', {
      default: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    }),
    field('nonce_hex', 'text', 'Nonce (24 hex digits)', {
      default: '000000000000000000000000',
    }),
    field('aad', 'textarea', 'AAD (optional, authenticated)', { required: false, default: '' }),
  ], {
    security_status: 'secure',
    reversible: true,
    key_kind: '128/192/256-bit key (hex) + 96-bit nonce',
    block_size: '128-bit blocks (CTR + GCTR)',
    description: 'Authenticated encryption: AES in counter mode plus a GHASH tag; detects tampering on decryption.',
    formula: 'C = CTR-mode AES; τ = GHASH(H, A, C)',
    invented: 'NIST (2007), from GCM by McGrew & Viega',
  }),
  base('chacha20_poly1305', 'ChaCha20-Poly1305', 'aead', ['encrypt', 'decrypt'], [
    field('plaintext', 'textarea', 'Plaintext', { placeholder: 'Hello, world!' }),
    field('ciphertext_hex', 'textarea', 'Ciphertext (hex, ciphertext+tag)', {
      placeholder: 'hex ciphertext (incl. 16-byte tag)',
      required: false,
    }),
    field('key_hex', 'text', 'Key (64 hex digits)', {
      default: '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F',
    }),
    field('nonce_hex', 'text', 'Nonce (24 hex digits)', {
      default: '000000000000000000000000',
    }),
    field('aad', 'textarea', 'AAD (optional, authenticated)', { required: false, default: '' }),
  ], {
    security_status: 'secure',
    reversible: true,
    key_kind: '256-bit key (hex) + 96-bit nonce',
    block_size: 'stream cipher + Poly1305 tag',
    description: 'Authenticated encryption from RFC 8439 (TLS 1.3): ChaCha20 stream cipher plus a Poly1305 MAC tag.',
    formula: 'C = ChaCha20(P); τ = Poly1305(key, A, C)',
    invented: 'Bernstein (2008); RFC 8439 (2018)',
  }),
  base('hmac', 'HMAC', 'mac', ['sign', 'verify'], [
    field('message', 'textarea', 'Message', { placeholder: 'Important message' }),
    field('key', 'text', 'Secret key', { placeholder: 'super-secret-key' }),
    field('algorithm', 'select', 'Hash algorithm', { options: ['sha256', 'sha512'], default: 'sha256' }),
    field('output_format', 'select', 'MAC encoding', { options: ['hex', 'base64'], default: 'hex' }),
    field('mac', 'text', 'Provided MAC (for verify)', { required: false, placeholder: 'hex/base64 MAC to check' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'shared secret key',
    block_size: '64-byte input blocks (SHA-256)',
    description: 'Keyed-Hash Message Authentication Code: proves integrity and authenticity with a shared key.',
    formula: 'HMAC = H((K′ ⊕ opad) ‖ H((K′ ⊕ ipad) ‖ m))',
    invented: 'Mihir Bellare, Ran Canetti & Hugo Krawczyk (1996)',
  }),
  base('pbkdf2', 'PBKDF2', 'kdf', ['derive', 'verify'], [
    field('password', 'text', 'Password', { placeholder: 'correct horse battery staple' }),
    field('salt', 'text', 'Salt (text; blank = random)', { required: false, default: '' }),
    field('salt_hex', 'text', 'Salt (hex, for verify)', { required: false }),
    field('expected_key_hex', 'text', 'Expected derived key (hex, for verify)', { required: false }),
    field('iterations', 'number', 'Iterations', { default: 100000, min: 1, max: 10000000 }),
    field('key_length', 'number', 'Derived key length (bytes)', { default: 32, min: 1, max: 64 }),
    field('algorithm', 'select', 'Hash algorithm', { options: ['sha256', 'sha512'], default: 'sha256' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'password + salt + iteration count',
    block_size: '—',
    description: 'Key derivation / password hashing that iterates HMAC over the password and salt (RFC 8018).',
    formula: 'F(P, S, c) = U₁ ⊕ U₂ ⊕ … ⊕ Uc',
    invented: 'PKCS#5 v2.0 (RSA Labs, 2000)',
  }),
  base('bcrypt', 'bcrypt', 'kdf', ['hash_password', 'verify'], [
    field('password', 'text', 'Password', { placeholder: 'correct horse battery staple' }),
    field('rounds', 'number', 'Cost factor (rounds)', { default: 12, min: 4, max: 31, required: false }),
    field('hash_str', 'text', 'bcrypt hash (for verify)', { required: false, placeholder: '$2b$12$…' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'password + salt (self-contained in $2b$ hash)',
    block_size: '—',
    description: 'Adaptive password hashing built on the Blowfish key schedule; cost factor doubles the work each step.',
    formula: 'Blowfish key schedule over password + 128-bit salt',
    invented: 'Niels Provos & David Mazières (1999)',
  }),
  base('scrypt', 'scrypt', 'kdf', ['derive', 'verify'], [
    field('password', 'text', 'Password', { placeholder: 'correct horse battery staple' }),
    field('salt', 'text', 'Salt (text; blank = random)', { required: false, default: '' }),
    field('salt_hex', 'text', 'Salt (hex, for verify)', { required: false }),
    field('expected_key_hex', 'text', 'Expected derived key (hex, for verify)', { required: false }),
    field('n', 'number', 'Cost parameter N (power of 2)', { default: 16384, min: 2, max: 1048576 }),
    field('r', 'number', 'Block size r', { default: 8, min: 1, max: 64 }),
    field('p', 'number', 'Parallelism p', { default: 1, min: 1, max: 16 }),
    field('key_length', 'number', 'Derived key length (bytes)', { default: 32, min: 1, max: 128 }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'password + salt + (N, r, p)',
    block_size: '—',
    description: 'Memory-hard key derivation (RFC 7914): PBKDF2 plus the Salsa20/8 core, resistant to GPU/ASIC brute force.',
    formula: 'PBKDF2 then ROMix (Salsa20/8 inner loop)',
    invented: 'Colin Percival (2009), RFC 7914 (2016)',
  }),
  base('argon2', 'Argon2', 'kdf', ['hash_password', 'verify'], [
    field('password', 'text', 'Password', { placeholder: 'correct horse battery staple' }),
    field('time_cost', 'number', 'Time cost t', { default: 3, min: 1, max: 10, required: false }),
    field('memory_cost', 'number', 'Memory cost m (KiB)', { default: 65536, min: 8, max: 1048576, required: false }),
    field('parallelism', 'number', 'Parallelism p', { default: 2, min: 1, max: 16, required: false }),
    field('hash_length', 'number', 'Hash length (bytes)', { default: 32, min: 1, max: 64, required: false }),
    field('variant', 'select', 'Variant', { options: ['argon2id', 'argon2i', 'argon2d'], default: 'argon2id', required: false }),
    field('hash_str', 'text', 'Argon2 hash (for verify)', { required: false, placeholder: '$argon2id$…' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'password + random salt (self-contained in hash)',
    block_size: '—',
    description: 'Winner of the Password Hashing Competition (2015); the current recommended password hasher (argon2id).',
    formula: 'memory-hard BLAKE2b rounds over a 2D lane matrix',
    invented: 'Biryukov, Dinu & Khovratovich (2015)',
  }),
  base('hkdf', 'HKDF', 'kdf', ['derive'], [
    field('ikm', 'text', 'Input key material (ikm)', { placeholder: 'shared secret or random seed' }),
    field('salt', 'text', 'Salt (text; blank = random)', { required: false, default: '' }),
    field('info', 'text', 'Context info (optional)', { required: false, default: '' }),
    field('length', 'number', 'Output length (bytes)', { default: 32, min: 1, max: 4096 }),
    field('algorithm', 'select', 'Hash algorithm', { options: ['sha256', 'sha512'], default: 'sha256' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'ikm + optional salt/info',
    block_size: '—',
    description: 'Key derivation (RFC 5869): HKDF-Extract + HKDF-Expand turn one master key into many sub-keys.',
    formula: 'PRK = HMAC(salt, ikm); OKM = HMAC(PRK, T‖info‖ctr)…',
    invented: 'Krawczyk & Eronen (2010), RFC 5869',
  }),
  base('ecdh', 'ECDH', 'key_exchange', ['exchange'], [
    field('curve', 'select', 'Curve', { options: ['p256', 'p384', 'p521'], default: 'p256' }),
  ], {
    security_status: 'secure_with_auth',
    reversible: false,
    key_kind: 'EC key pair (private scalar + public point)',
    block_size: '—',
    description: 'Elliptic-curve Diffie–Hellman: derive a shared secret from two curve key pairs. Needs authentication.',
    formula: 'S = a·B = b·A (x-coordinate)',
    invented: 'Victor S. Miller & Neal Koblitz (1985)',
  }),
  base('x25519', 'X25519', 'key_exchange', ['exchange'], [], {
    security_status: 'secure_with_auth',
    reversible: false,
    key_kind: '32-byte private scalar + 32-byte public key',
    block_size: '—',
    description: 'RFC 7748 ECDH over Curve25519 (x-coordinate only). Fast and constant-time; used in TLS 1.3.',
    formula: 'u = X25519(private, u-coordinate); s = X25519(a, B)',
    invented: 'Daniel J. Bernstein (2006), RFC 7748 (2016)',
  }),
  base('ecdsa', 'ECDSA', 'signature', ['generate_keys', 'sign', 'verify'], [
    field('message', 'textarea', 'Message', { placeholder: 'Message to sign' }),
    field('curve', 'select', 'Curve', { options: ['p256', 'p384', 'p521'], default: 'p256' }),
    field('signature_hex', 'text', 'Signature (hex, for verify)', { required: false }),
    field('public_hex', 'text', 'Public key (hex, for verify)', { required: false }),
    field('public_x', 'number', 'Public key x (optional)', { required: false }),
    field('public_y', 'number', 'Public key y (optional)', { required: false }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'EC key pair (FIPS 186-4)',
    block_size: '—',
    description: 'Elliptic-curve digital signatures (r, s). It authenticates — it does not encrypt.',
    formula: 'r = (k·G).x mod n; s = k⁻¹(z + r·d) mod n',
    invented: 'Scott Vanstone (1992), ANSI X9.62 / FIPS 186-4',
  }),
  base('ed25519', 'Ed25519', 'signature', ['generate_keys', 'sign', 'verify'], [
    field('message', 'textarea', 'Message', { placeholder: 'Message to sign' }),
    field('signature_hex', 'text', 'Signature (hex, for verify)', { required: false }),
    field('public_hex', 'text', 'Public key (hex, for verify)', { required: false }),
    field('private_hex', 'text', 'Private key (hex, optional)', { required: false, placeholder: 'blank = auto-generate' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: '32-byte key pair',
    block_size: '—',
    description: 'Modern deterministic signatures (RFC 8032) on the Edwards curve; fast, constant-time, 64-byte signatures.',
    formula: 'R = r·B; S = r + SHA-512(R‖A‖M)·a (mod L)',
    invented: 'Daniel J. Bernstein et al. (2011), RFC 8032 (2017)',
  }),
  base('rsa', 'RSA', 'asymmetric', [
    'encrypt', 'decrypt', 'generate_keys',
    'encrypt_oaep', 'decrypt_oaep', 'sign_pss', 'verify_pss',
  ], [
    field('message', 'textarea', 'Message', { placeholder: 'HI' }),
    field('p', 'number', 'Prime p', { default: 61, min: 2 }),
    field('q', 'number', 'Prime q', { default: 53, min: 2 }),
    field('e', 'number', 'Exponent e (optional)', { default: 65537, min: 3, required: false }),
    field('ciphertext_hex', 'textarea', 'Ciphertext (hex, for OAEP decrypt)', { required: false, placeholder: 'abcdef…' }),
    field('signature_hex', 'textarea', 'Signature (hex, for PSS verify)', { required: false, placeholder: 'abcdef…' }),
    field('public_key_pem', 'textarea', 'Public key PEM (optional; blank = auto-generate)', { required: false, placeholder: '-----BEGIN PUBLIC KEY-----…' }),
    field('private_key_pem', 'textarea', 'Private key PEM (optional for sign; required for OAEP decrypt)', { required: false, placeholder: '-----BEGIN PRIVATE KEY-----…' }),
  ], {
    security_status: 'secure_with_padding',
    reversible: true,
    key_kind: 'primes p, q + exponent e',
    block_size: 'integer < n',
    description: 'Public-key cryptosystem based on the hardness of factoring.',
    formula: 'C = Mᵉ mod n; M = Cᵈ mod n',
    invented: 'Rivest, Shamir & Adleman (1977)',
  }),
  base('diffie_hellman', 'Diffie–Hellman', 'key_exchange', ['exchange'], [
    field('p', 'number', 'Prime p', { default: 23, min: 2 }),
    field('g', 'number', 'Generator g', { default: 5, min: 2 }),
    field('a_private', 'number', 'Alice private (a)', { default: 6, min: 1 }),
    field('b_private', 'number', 'Bob private (b)', { default: 15, min: 1 }),
  ], {
    security_status: 'secure_with_auth',
    reversible: false,
    key_kind: 'p, g and two private keys',
    block_size: '—',
    description: 'Key exchange protocol — derives a shared secret over an insecure channel.',
    formula: 's = Bᵃ mod p = Aᵇ mod p',
    invented: 'Diffie & Hellman (1976)',
  }),
  base('elgamal', 'ElGamal', 'asymmetric', ['encrypt', 'decrypt', 'generate_keys'], [
    field('message', 'textarea', 'Message (for encrypt)', { placeholder: 'HI' }),
    field('p', 'number', 'Prime p', { default: 467, min: 2 }),
    field('g', 'number', 'Generator g', { default: 2, min: 2 }),
    field('x', 'number', 'Private key x', { default: 127, min: 1 }),
    field('c1', 'number', 'Cipher component c1 (decrypt)', { required: false, min: 1 }),
    field('c2', 'number', 'Cipher component c2 (decrypt)', { required: false, min: 1 }),
  ], {
    security_status: 'secure_with_padding',
    reversible: true,
    key_kind: 'p, g, private x, ephemeral k',
    block_size: 'integer < p',
    description: 'Randomized asymmetric encryption based on the DH problem.',
    formula: 'c1 = gᵏ mod p; c2 = m·yᵏ mod p',
    invented: 'Taher ElGamal (1985)',
  }),
  base('sha256', 'SHA-256', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'none',
    block_size: '512-bit blocks',
    description: 'One-way cryptographic hash producing a 256-bit digest.',
    formula: 'compression function, 64 rounds',
    invented: 'NIST (SHA-2 family, 2001)',
  }),
  base('sha512', 'SHA-512', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'none',
    block_size: '1024-bit blocks',
    description: 'One-way cryptographic hash producing a 512-bit digest.',
    formula: 'compression function, 80 rounds',
    invented: 'NIST (SHA-2 family, 2001)',
  }),
  base('sha1', 'SHA-1', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
  ], {
    security_status: 'broken_deprecated',
    reversible: false,
    key_kind: 'none',
    block_size: '512-bit blocks',
    description: 'Legacy one-way hash; SHA-1 collisions are practical and it is deprecated (160-bit digest).',
    formula: 'compression function, 80 rounds',
    invented: 'NIST & NSA (1995)',
  }),
  base('md5', 'MD5', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
  ], {
    security_status: 'broken',
    reversible: false,
    key_kind: 'none',
    block_size: '512-bit blocks',
    description: 'Legacy one-way hash with broken collision resistance (128-bit digest).',
    formula: 'compression function, 4 rounds × 16 steps',
    invented: 'Ron Rivest (1992)',
  }),
  base('sha3', 'SHA-3', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
    field('variant', 'select', 'Variant', { options: ['224', '256', '384', '512'], default: '256' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'none',
    block_size: 'Keccak sponge (rate 144/136/104/72 bytes)',
    description: 'Sponge-based one-way hash (Keccak-f[1600], SHA-3-224/256/384/512).',
    formula: 'Keccak-f[1600] sponge, 24 rounds',
    invented: 'Bertoni, Daemen, Peeters & Van Assche (2008), NIST 2015',
  }),
  base('blake2', 'BLAKE2', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
    field('variant', 'select', 'Variant', { options: ['512', '256'], default: '512' }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'none',
    block_size: '128-byte blocks (BLAKE2b) / 64-byte blocks (BLAKE2s)',
    description: 'Fast one-way hash with parameterized variants (BLAKE2b-512, BLAKE2s-256).',
    formula: 'BLAKE2b: 12 rounds; BLAKE2s: 10 rounds',
    invented: 'Aumasson, Neves, Wilcox-O\'Hearn & Winnerlein (2012)',
  }),
  base('blake3', 'BLAKE3', 'hashing', ['hash'], [
    field('message', 'textarea', 'Message', { placeholder: 'Hello, cryptography!' }),
    field('length', 'number', 'Digest length (bytes)', { default: 32, min: 1, max: 64 }),
  ], {
    security_status: 'secure',
    reversible: false,
    key_kind: 'none',
    block_size: '64-byte blocks / 1024-byte chunks',
    description: 'Very fast one-way hash built as a Merkle tree of chunks (extendable output).',
    formula: 'BLAKE2s rounds over a Merkle tree of chunks',
    invented: 'O\'Connor, Aumasson, Neves & Wilcox-O\'Hearn (2020)',
  }),
]

export const CATEGORIES_ORDER: Category[] = [
  'classical',
  'symmetric',
  'asymmetric',
  'key_exchange',
  'mac',
  'kdf',
  'aead',
  'signature',
  'hashing',
]

export const byId = (id: string): StaticAlgorithm | undefined =>
  ALGORITHMS.find((a) => a.id === id)

export const operationsFor = (id: string): string[] => {
  const alg = byId(id)
  return alg ? alg.operations : []
}

/**
 * Fields relevant to a specific operation. Special operations are given a
 * reduced form (e.g. RSA/ElGamal key generation doesn't need the message) and
 * ElGamal decryption exposes the cipher components c1/c2.
 */
export function operationFormFields(
  id: string,
  op: string,
  fields: AlgorithmField[],
): AlgorithmField[] {
  if (op === 'generate_keys' || op === 'generate_alphabet') {
    const keep: Record<string, string[]> = {
      rsa: ['p', 'q', 'e'],
      elgamal: ['p', 'g', 'x'],
      ecdsa: ['curve'],
      ed25519: [],
    }
    const names = keep[id] ?? []
    return fields.filter((f) => names.includes(f.name)).map((f) => ({ ...f, required: true }))
  }
  if (id === 'caesar' && op === 'brute_force') {
    return fields.filter((f) => f.name === 'text')
  }
  if (id === 'elgamal' && op === 'decrypt') {
    return fields
      .filter((f) => ['p', 'g', 'x', 'c1', 'c2'].includes(f.name))
      .map((f) => ({ ...f, required: true }))
  }
  if (id === 'elgamal') {
    return fields.filter((f) => !['c1', 'c2'].includes(f.name))
  }

  if (id === 'aes_gcm' || id === 'chacha20_poly1305') {
    const hidden = op === 'encrypt' ? ['ciphertext_hex'] : ['plaintext']
    return fields.filter((f) => !hidden.includes(f.name)).map((f) =>
      op === 'encrypt' && f.name === 'plaintext' ? { ...f, required: true } :
      op === 'decrypt' && f.name === 'ciphertext_hex' ? { ...f, required: true } : f,
    )
  }

  if (id === 'hmac') {
    if (op === 'sign') return fields.filter((f) => f.name !== 'mac')
    return fields.filter((f) =>
      ['message', 'key', 'algorithm', 'output_format', 'mac'].includes(f.name),
    )
  }

  if (id === 'pbkdf2' || id === 'scrypt') {
    if (op === 'derive') {
      return fields.filter((f) => !['salt_hex', 'expected_key_hex'].includes(f.name))
    }
    return fields
      .filter((f) =>
        ['password', 'salt_hex', 'expected_key_hex', 'iterations', 'key_length', 'algorithm', 'n', 'r', 'p'].includes(f.name),
      )
      .map((f) => ({ ...f, required: true }))
  }

  if (id === 'bcrypt' || id === 'argon2') {
    if (op === 'hash_password') {
      return id === 'bcrypt'
        ? fields.filter((f) => f.name !== 'hash_str')
        : fields.filter((f) => f.name !== 'hash_str')
    }
    return fields.filter((f) => ['password', 'hash_str'].includes(f.name))
  }

  if (id === 'ecdsa' || id === 'ed25519') {
    if (op === 'sign') {
      return id === 'ecdsa'
        ? fields.filter((f) => ['message', 'curve'].includes(f.name))
        : fields.filter((f) => ['message', 'private_hex'].includes(f.name))
    }
    if (op === 'verify') {
      return id === 'ecdsa'
        ? fields.filter((f) =>
            ['message', 'curve', 'signature_hex', 'public_hex', 'public_x', 'public_y'].includes(f.name),
          ).map((f) => ({ ...f, required: true }))
        : fields.filter((f) =>
            ['message', 'signature_hex', 'public_hex'].includes(f.name),
          ).map((f) => ({ ...f, required: true }))
    }
  }

  if (id === 'rsa') {
    if (op === 'encrypt_oaep') {
      return fields.filter((f) => ['message', 'public_key_pem'].includes(f.name))
    }
    if (op === 'decrypt_oaep') {
      return fields.filter((f) => ['ciphertext_hex', 'private_key_pem'].includes(f.name)).map((f) => ({ ...f, required: true }))
    }
    if (op === 'sign_pss') {
      return fields.filter((f) => ['message', 'private_key_pem'].includes(f.name))
    }
    if (op === 'verify_pss') {
      return fields.filter((f) => ['message', 'signature_hex', 'public_key_pem'].includes(f.name)).map((f) => ({ ...f, required: true }))
    }
    return fields.filter((f) => ['message', 'p', 'q', 'e'].includes(f.name))
  }

  return fields
}
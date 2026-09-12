// Scientific-accurate, verifiable live maths for the simulation layer.
// Everything here is computed client-side so the visualisation shows REAL values.

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const mod = (n: number, m: number): number => ((n % m) + m) % m
export const upperLetters = (s: string): string => s.toUpperCase().replace(/[^A-Z]/g, '')
export const isLetter = (ch: string): boolean => /[a-zA-Z]/.test(ch)

export const strToBytes = (s: string): Uint8Array => new TextEncoder().encode(s)
export const bytesToHex = (b: Uint8Array): string =>
  Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')

export const u32ToHex = (v: number): string => ('00000000' + v.toString(16)).slice(-8)

export function hexToBytes(hex: string): Uint8Array {
  const h = hex.replace(/[\s_]/g, '')
  if (h.length % 2 !== 0) throw new Error('odd hex length')
  const out = new Uint8Array(h.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16)
  return out
}

// ---------------------------------------------------------------------------
// Big integer modular arithmetic
// ---------------------------------------------------------------------------

export const modPowBig = (base: bigint, exp: bigint, m: bigint): bigint => {
  let r = 1n
  let b = base
  let e = exp
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return r
}

export const gcdBig = (a: bigint, b: bigint): bigint => {
  while (b) {
    const t = a % b
    a = b
    b = t
  }
  return a
}

export function modInverseBig(a: bigint, m: bigint): bigint {
  let oldR = a
  let r = m
  let oldS = 1n
  let s = 0n
  while (r) {
    const q = oldR / r
    const nr = oldR - q * r
    oldR = r
    r = nr
    const ns = oldS - q * s
    oldS = s
    s = ns
  }
  if (oldR !== 1n) throw new Error('no modular inverse')
  return ((oldS % m) + m) % m
}

export interface ModPowRow {
  bit: string
  square: string
  multiply?: string
}

export function modPowSteps(base: bigint, exponent: bigint, m: bigint): {
  result: bigint
  bits: string
  rows: ModPowRow[]
} {
  const bits = exponent.toString(2)
  let result = 1n
  const rows: ModPowRow[] = []
  for (const bit of bits) {
    result = (result * result) % m
    const row: ModPowRow = { bit, square: result.toString() }
    if (bit === '1') {
      result = (result * base) % m
      row.multiply = result.toString()
    }
    rows.push(row)
  }
  return { result, bits, rows }
}

// ---------------------------------------------------------------------------
// Classical ciphers (live — mirror backend semantics exactly)
// ---------------------------------------------------------------------------

export interface LiveChar {
  raw: string
  plain: string
  value: number
  keyValue?: number
  mapped: string
  note?: string
}

export function caesarChars(text: string, shift: number, decrypt: boolean): {
  chars: LiveChar[]
  alphabet: string[]
  k: number
} {
  const alphabet = ALPHABET.split('')
  const k = mod(shift, 26)
  const chars: LiveChar[] = []
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: 'ignored' })
      continue
    }
    const plain = ch.toUpperCase()
    const value = plain.charCodeAt(0) - 65
    const mappedVal = mod(decrypt ? value - k : value + k, 26)
    const mapped =
      ch === plain.toUpperCase() ? alphabet[mappedVal] : alphabet[mappedVal].toLowerCase()
    chars.push({ raw: ch, plain, value, keyValue: k, mapped })
  }
  return { chars, alphabet, k }
}

export function vigenereChars(text: string, key: string, decrypt: boolean): {
  chars: LiveChar[]
  knownLetters: string
} {
  const keyU = upperLetters(key)
  const keyVals = keyU.split('').map((c) => c.charCodeAt(0) - 65)
  const chars: LiveChar[] = []
  let ki = 0
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: 'ignored' })
      continue
    }
    const plain = ch.toUpperCase()
    const value = plain.charCodeAt(0) - 65
    const kv = keyVals[ki % keyVals.length]
    const mappedVal = mod(decrypt ? value - kv : value + kv, 26)
    const mapped =
      ch === plain.toUpperCase() ? ALPHABET[mappedVal] : ALPHABET[mappedVal].toLowerCase()
    chars.push({ raw: ch, plain, value, keyValue: kv, mapped, note: `key[${ki}]` })
    ki++
  }
  return { chars, knownLetters: keyU }
}

/** Monoalphabetic: user gives a 26-letter substitution permutation. */
export function monoChars(text: string, substitution: string, decrypt: boolean): {
  chars: LiveChar[]
  sub: string
  inverse: string
} {
  const sub = upperLetters(substitution)
  const inverse = ALPHABET.split('')
    .map((c) => {
      const pos = sub.indexOf(c)
      return pos === -1 ? c : ALPHABET[pos]
    })
    .join('')
  const chars: LiveChar[] = []
  for (const ch of text) {
    if (!isLetter(ch)) {
      chars.push({ raw: ch, plain: ch, value: -1, mapped: ch, note: 'ignored' })
      continue
    }
    const plain = ch.toUpperCase()
    const pos = plain.charCodeAt(0) - 65
    const mappedUp = decrypt ? ABSolve(plain, sub) : sub[pos]
    const mapped = ch === plain ? mappedUp : mappedUp.toLowerCase()
    chars.push({ raw: ch, plain, value: pos, mapped, note: `${plain}→${mappedUp}` })
  }
  return { chars, sub, inverse }
}

function ABSolve(cipher: string, sub: string): string {
  const pos = sub.indexOf(cipher)
  return pos === -1 ? cipher : ALPHABET[pos]
}

/** Playfair: distinct keyword letters, then alphabet, I/J merged (A-Z without J). */
export function playfairSquare(keyword: string): string[][] {
  const cleaned: string[] = []
  const seen = new Set<string>()
  const push = (c: string) => {
    if (!seen.has(c)) {
      seen.add(c)
      cleaned.push(c)
    }
  }
  for (const ch of keyword.toUpperCase()) {
    if (/[A-Z]/.test(ch)) push(ch === 'J' ? 'I' : ch)
  }
  for (const ch of ALPHABET.replace('J', '')) push(ch)
  const square: string[][] = []
  for (let r = 0; r < 5; r++) square.push(cleaned.slice(r * 5, r * 5 + 5))
  return square
}

export interface PlayfairPairInfo {
  a: string
  b: string
  ra: number
  ca: number
  rb: number
  cb: number
  rule: string
  out: string
  kind: string
}

export function playfairPrepare(text: string): { pairs: string[]; notes: string[] } {
  const norm = upperLetters(text).replace(/J/g, 'I')
  const pairs: string[] = []
  const notes: string[] = []
  let i = 0
  while (i < norm.length) {
    const a = norm[i]
    if (i + 1 < norm.length && norm[i + 1] === a) {
      pairs.push(a + 'X')
      notes.push(`repeated '${a}' → filler X`)
      i += 1
    } else if (i + 1 < norm.length) {
      pairs.push(norm.slice(i, i + 2))
      notes.push('normal pair')
      i += 2
    } else {
      pairs.push(a + 'X')
      notes.push(`odd tail '${a}' → filler X`)
      i += 1
    }
  }
  return { pairs, notes }
}

export function playfairPairs(text: string, keyword: string, decrypt: boolean): {
  square: string[][]
  pairs: string[]
  notes: string[]
  steps: PlayfairPairInfo[]
  result: string
} {
  const square = playfairSquare(keyword)
  const pos: Record<string, [number, number]> = {}
  square.forEach((row, r) => row.forEach((ch, c) => (pos[ch] = [r, c])))
  const { pairs, notes } = playfairPrepare(text)
  const steps: PlayfairPairInfo[] = []
  const out: string[] = []
  for (let k = 0; k < pairs.length; k++) {
    const [a, b] = pairs[k].split('')
    const [ra, ca] = pos[a]
    const [rb, cb] = pos[b]
    let rule = ''
    let oa = ''
    let ob = ''
    if (ra === rb) {
      oa = square[ra][(ca + (decrypt ? 3 : 1)) % 5]
      ob = square[rb][(cb + (decrypt ? 3 : 1)) % 5]
      rule = decrypt ? 'same row → shift left' : 'same row → shift right'
    } else if (ca === cb) {
      oa = square[(ra + (decrypt ? 3 : 1)) % 5][ca]
      ob = square[(rb + (decrypt ? 3 : 1)) % 5][cb]
      rule = decrypt ? 'same column → shift up' : 'same column → shift down'
    } else {
      oa = square[ra][cb]
      ob = square[rb][ca]
      rule = 'rectangle → swap corners'
    }
    steps.push({ a, b, ra, ca, rb, cb, rule, out: oa + ob, kind: notes[k] || '' })
    out.push(oa + ob)
  }
  return { square, pairs, notes, steps, result: out.join('') }
}

// --- Hill cipher (live; decrypt via modular inverse matrix) ------------------

export interface HillCell {
  ch: string
  v: number
  out: number
  mapped: string
}

export function matrixInverseMod(matrix: number[][], modu: number): {
  det: number
  detInv: number
  inverse: number[][]
  valid: boolean
} {
  const n = matrix.length
  let det: number
  if (n === 2) det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  else {
    const [a, b, c, d, e, f, g, h, i] = matrix.flat()
    det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  }
  const detMod = mod(det, modu)
  const detInv = modInverse(detMod, modu)
  if (detInv === null) return { det: detMod, detInv: 0, inverse: [], valid: false }
  let cof: number[][]
  if (n === 2) {
    cof = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]],
    ]
  } else {
    const [a, b, c, d, e, f, g, h, i] = matrix.flat()
    cof = [
      [e * i - f * h, -(d * i - f * g), d * h - e * g],
      [-(b * i - c * h), a * i - c * g, -(a * h - b * g)],
      [b * f - c * e, -(a * f - c * d), a * e - b * d],
    ]
  }
  const inverse = cof.map((row) => row.map((x) => mod(x * detInv, modu)))
  return { det: detMod, detInv, inverse, valid: true }
}

export function hillBlocks(matrix: number[][], text: string, decrypt: boolean): {
  n: number
  blocks: HillCell[][]
  padded: number
  determin: number
  detInv: number | null
  inverse: number[][]
  valid: boolean
} {
  const n = matrix.length
  const letters = text.toUpperCase().replace(/[^A-Z]/g, '').split('')
  let padded = 0
  if (letters.length % n !== 0) {
    padded = n - (letters.length % n)
    for (let i = 0; i < padded; i++) letters.push('X')
  }
  const inv = matrixInverseMod(matrix, 26)
  const work = decrypt ? (inv.valid ? inv.inverse : []) : matrix
  const blocks: HillCell[][] = []
  for (let b = 0; b < letters.length; b += n) {
    const v = letters.slice(b, b + n).map((c) => c.charCodeAt(0) - 65)
    const block: HillCell[] = []
    for (let r = 0; r < n; r++) {
      let s = 0
      for (let c = 0; c < n; c++) s += work[r][c] * v[c]
      const out = mod(s, 26)
      block.push({ ch: letters[b + r], v: v[r], out, mapped: String.fromCharCode(65 + out) })
    }
    blocks.push(block)
  }
  return {
    n,
    blocks,
    padded,
    determin: inv.det,
    detInv: inv.valid ? inv.detInv : null,
    inverse: inv.inverse,
    valid: inv.valid,
  }
}

export function modInverse(a: number, m: number): number | null {
  const g = gcd(a, m)
  if (g !== 1) return null
  let t = 0
  let newT = 1
  let r = m
  let newR = a
  while (newR !== 0) {
    const q = Math.floor(r / newR)
    const nr = r - q * newR
    r = newR
    newR = nr
    const nt = t - q * newT
    t = newT
    newT = nt
  }
  return mod(t, m)
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = x % y
    x = y
    y = t
  }
  return x
}

// --- Rail fence -----------------------------------------------------------------

export function railPositions(length: number, rails: number): number[] {
  const cycle = 2 * (rails - 1) || 1
  const out: number[] = []
  for (let i = 0; i < length; i++) {
    const m = i % cycle
    out.push(m < rails ? m : cycle - m)
  }
  return out
}

export function railFenceEncrypt(text: string, rails: number): {
  positions: number[]
  ciphertext: string
  rows: string[]
  cycle: number
} {
  const positions = railPositions(text.length, rails)
  const rows: string[] = Array.from({ length: rails }, () => '')
  text.split('').forEach((ch, i) => {
    rows[positions[i]] += ch
  })
  return { positions, ciphertext: rows.join(''), rows, cycle: 2 * (rails - 1) }
}

/** Letter-only pattern grid (mirrors backend `_pattern`). */
export function railFencePattern(text: string, rails: number): {
  rows: string[]
  rowTexts: string[]
} {
  const letters = text.split('').filter((c) => c !== ' ' && c !== '\n')
  const positions = railPositions(text.length, rails)
  const grid: (string | null)[][] = Array.from({ length: rails }, () =>
    Array<string | null>(text.length).fill(null),
  )
  letters.forEach((ch, col) => {
    grid[positions[col]][col] = ch
  })
  return {
    rows: grid.map((row) => row.map((c) => c ?? '.').join('')),
    rowTexts: grid.map((row) => row.filter((c): c is string => c !== null).join('')),
  }
}

export function railFenceDecrypt(text: string, rails: number): {
  plaintext: string
  positions: number[]
  counts: number[]
} {
  const n = text.length
  const positions = railPositions(n, rails)
  const counts = Array.from({ length: rails }, (_, r) => positions.filter((p) => p === r).length)
  const chunks: string[] = []
  let pos = 0
  for (let r = 0; r < rails; r++) {
    chunks.push(text.slice(pos, pos + counts[r]))
    pos += counts[r]
  }
  const cursor = counts.map(() => 0)
  const placeholders = positions.map((r) => chunks[r][cursor[r]++] ?? '')
  const plaintext = placeholders.join('')
  return { plaintext, positions, counts }
}

// --- Columnar transposition ------------------------------------------------------

export function columnOrder(key: string): number[] {
  const keys = upperLetters(key)
  const indexed = keys.split('').map((c, i) => [c, i] as [string, number])
  indexed.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] < b[0] ? -1 : 1))
  return indexed.map(([, i]) => i)
}

export function columnarEncrypt(text: string, key: string): {
  rows: string[][]
  cols: number
  order: number[]
  columnTexts: string[]
  ciphertext: string
} {
  const cols = upperLetters(key).length
  const rowsNeeded = Math.ceil(text.length / cols)
  const grid: string[][] = []
  let idx = 0
  for (let r = 0; r < rowsNeeded; r++) {
    const row: string[] = []
    for (let c = 0; c < cols; c++) row.push(idx < text.length ? text[idx++] : '')
    grid.push(row)
  }
  const columnTexts = Array.from({ length: cols }, (_, c) =>
    grid.map((row) => row[c]).join(''),
  )
  const order = columnOrder(key)
  return { rows: grid, cols, order, columnTexts, ciphertext: order.map((c) => columnTexts[c]).join('') }
}

export function columnarDecrypt(text: string, key: string): { plaintext: string } {
  const cols = upperLetters(key).length
  const rows = Math.ceil(text.length / cols)
  const padded = rows * cols - text.length
  const colLengths = Array(cols).fill(rows)
  const order = columnOrder(key)
  let pad = padded
  for (let i = order.length - 1; i >= 0 && pad > 0; i--) {
    colLengths[order[i]] -= 1
    pad -= 1
  }
  const colTexts: string[] = []
  let pos = 0
  for (let c = 0; c < cols; c++) {
    colTexts.push(text.slice(pos, pos + colLengths[c]))
    pos += colLengths[c]
  }
  const rowsOut: string[][] = []
  for (let r = 0; r < rows; r++) {
    const row: string[] = []
    for (let c = 0; c < cols; c++) row.push(r < colTexts[c].length ? colTexts[c][r] : '')
    rowsOut.push(row)
  }
  return { plaintext: rowsOut.map((row) => row.join('')).join('') }
}

// ---------------------------------------------------------------------------
// RSA / DH building blocks
// ---------------------------------------------------------------------------

export interface RsaKeyData {
  p: number
  q: number
  n: number
  phi: number
  e: number
  d: number
  eNote: string
}

export function rsaKeygen(p: number, q: number, eChoice: number | null): RsaKeyData {
  const n = p * q
  const phi = (p - 1) * (q - 1)
  const candidates = [3, 5, 7, 11, 13, 17, 19, 23, 65537]
  let e = eChoice ?? 65537
  let eNote = ''
  if (e >= phi || gcd(e, phi) !== 1) {
    for (const cand of candidates) {
      if (cand < phi && gcd(cand, phi) === 1) {
        eNote = `preferred e=${e} unusable → e=${cand}`
        e = cand
        break
      }
    }
  }
  const d = Number(modInverseBig(BigInt(e), BigInt(phi)))
  return { p, q, n, phi, e, d, eNote }
}

export function rsaEncode(message: string): { m: number; limbs: number[]; digits: string } {
  const msg = upperLetters(message)
  let m = 0
  const limbs: number[] = []
  for (const ch of msg) {
    const v = ch.charCodeAt(0) - 65 + 1
    limbs.push(v)
    m = m * 27 + v
  }
  return { m, limbs, digits: msg }
}

export function rsaDecode(m: number): string {
  const digits: number[] = []
  let x = m
  while (x > 0) {
    digits.unshift(x % 27)
    x = Math.floor(x / 27)
  }
  let out = ''
  for (const v of digits) {
    if (v === 0) out += ' '
    else out += String.fromCharCode(64 + v)
  }
  return out
}

export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false
  return true
}

/**
 * Regular modular exponentiation step-by-step (used when the exponent is small
 * enough to enumerate each multiplication — only for tiny educational numbers).
 */
export function modExpSteps(base: number, exp: number, modu: number): string[] {
  if (exp > 40) return []
  const steps: string[] = []
  let r = 1n
  const b = BigInt(base)
  const m = BigInt(modu)
  for (let i = 0; i < exp; i++) {
    r = (r * b) % m
  }
  steps.push(`${base}^${exp} mod ${modu} = ${r.toString()}`)
  return steps
}

// ---------------------------------------------------------------------------
// Hash padding + real SHA-256 / SHA-1 / MD5 implementations (verified)
// ---------------------------------------------------------------------------

export function hashPaddingInfo(
  msg: Uint8Array,
  blockBytes: number,
  lengthWordBytes: number,
  lengthLE: boolean,
): {
  blocks: Uint8Array[]
  originalBytes: number
  bitLength: number
  padBytes: number
  blockCount: number
} {
  const bitLength = msg.length * 8
  const innerPad = (blockBytes - ((msg.length + 1 + lengthWordBytes) % blockBytes)) % blockBytes
  const padded = new Uint8Array(msg.length + 1 + innerPad + lengthWordBytes)
  padded.set(msg)
  padded[msg.length] = 0x80
  for (let i = 0; i < lengthWordBytes; i++) {
    const shift = lengthLE ? i : lengthWordBytes - 1 - i
    padded[msg.length + 1 + innerPad + i] = Math.floor(bitLength / Math.pow(2, shift * 8)) & 0xff
  }
  const blocks: Uint8Array[] = []
  for (let i = 0; i < padded.length; i += blockBytes) blocks.push(padded.slice(i, i + blockBytes))
  return {
    blocks,
    originalBytes: msg.length,
    bitLength,
    padBytes: 1 + innerPad + lengthWordBytes,
    blockCount: blocks.length,
  }
}

// prettier-ignore
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n))
}
function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n))
}

export interface RoundCapture {
  t: number
  w: string
  t1?: string
  t2?: string
  state: string[]
}

export function sha256Detail(msg: Uint8Array): {
  digest: string
  blocksHex: string[]
  schedule: string[]
  hInit: string[]
  hFinal: string[]
  rounds: RoundCapture[]
} {
  const { blocks } = hashPaddingInfo(msg, 64, 8, false)
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f,
    0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const hInit = Array.from(h, u32ToHex)
  const w = new Uint32Array(64)
  const rounds: RoundCapture[] = []
  let schedule: string[] = []
  const blocksHex = blocks.map(bytesToHex)
  blocks.forEach((block, bi) => {
    for (let t = 0; t < 16; t++) {
      w[t] =
        ((block[t * 4] << 24) | (block[t * 4 + 1] << 16) | (block[t * 4 + 2] << 8) | block[t * 4 + 3]) >>>
        0
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3)
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10)
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0
    }
    if (bi === 0) schedule = Array.from(w, u32ToHex)
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7]
    for (let t = 0; t < 64; t++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (hh + s1 + ch + SHA256_K[t] + w[t]) >>> 0
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (s0 + maj) >>> 0
      hh = g; g = f; f = e
      e = (d + t1) >>> 0
      d = c; c = b; b = a
      a = (t1 + t2) >>> 0
      if (bi === 0) {
        rounds.push({
          t,
          w: u32ToHex(w[t]),
          t1: u32ToHex(t1),
          t2: u32ToHex(t2),
          state: [a, b, c, d, e, f, g, hh].map(u32ToHex),
        })
      }
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0
    h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0
  })
  return {
    digest: Array.from(h, u32ToHex).join(''),
    blocksHex,
    schedule,
    hInit,
    hFinal: Array.from(h, u32ToHex),
    rounds,
  }
}

const SHA1_K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]

export function sha1Detail(msg: Uint8Array): {
  digest: string
  blocksHex: string[]
  hInit: string[]
  hFinal: string[]
} {
  const { blocks } = hashPaddingInfo(msg, 64, 8, false)
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  const hInit = h.map(u32ToHex)
  const w = new Uint32Array(80)
  const blocksHex = blocks.map(bytesToHex)
  blocks.forEach((block) => {
    for (let t = 0; t < 16; t++) {
      w[t] =
        ((block[t * 4] << 24) | (block[t * 4 + 1] << 16) | (block[t * 4 + 2] << 8) | block[t * 4 + 3]) >>>
        0
    }
    for (let t = 16; t < 80; t++) w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1)
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4]
    for (let t = 0; t < 80; t++) {
      const k = SHA1_K[Math.floor(t / 20)]
      let f: number
      if (t < 20) f = (b & c) | (~b & d)
      else if (t < 40) f = b ^ c ^ d
      else if (t < 60) f = (b & c) | (b & d) | (c & d)
      else f = b ^ c ^ d
      const tmp = (rotl(a, 5) + f + e + k + w[t]) >>> 0
      e = d; d = c
      c = rotl(b, 30)
      b = a; a = tmp
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0; h[4] = (h[4] + e) >>> 0
  })
  return {
    digest: h.map((x) => ('00000000' + x.toString(16)).slice(-8)).join(''),
    blocksHex,
    hInit,
    hFinal: h.map(u32ToHex),
  }
}

const MD5_S = new Uint8Array([
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
])

const md5K = (i: number): number => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)

export function md5Detail(msg: Uint8Array): {
  digest: string
  blocksHex: string[]
  hInit: string[]
} {
  const { blocks } = hashPaddingInfo(msg, 64, 8, true)
  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476
  const hInit = [a0, b0, c0, d0].map(u32ToHex)
  const blocksHex = blocks.map(bytesToHex)
  const M = new Uint32Array(16)
  blocks.forEach((block) => {
    for (let i = 0; i < 16; i++) {
      M[i] =
        (block[i * 4] | (block[i * 4 + 1] << 8) | (block[i * 4 + 2] << 16) | (block[i * 4 + 3] << 24)) >>>
        0
    }
    let A = a0
    let B = b0
    let C = c0
    let D = d0
    for (let i = 0; i < 64; i++) {
      let F: number
      let g: number
      if (i < 16) {
        F = (B & C) | (~B & D)
        g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D
        g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D)
        g = (7 * i) % 16
      }
      const sum = (A + F + md5K(i) + M[g]) >>> 0
      const tmp = D
      D = C
      C = B
      B = (B + rotl(sum, MD5_S[i])) >>> 0
      A = tmp
    }
    a0 = (a0 + A) >>> 0
    b0 = (b0 + B) >>> 0
    c0 = (c0 + C) >>> 0
    d0 = (d0 + D) >>> 0
  })
  const digest = [a0, b0, c0, d0]
    .map((x) => u32ToHex(x).match(/../g)!.reverse().join(''))
    .join('')
  return { digest, blocksHex, hInit }
}

// --- HMAC / PBKDF2 / HKDF (live, HMAC-SHA-256) ----------------------------------

export function sha256Digest(msg: Uint8Array): Uint8Array {
  return hexToBytes(sha256Detail(msg).digest)
}

export interface HmacDetail {
  digest: string
  keySize: number
  keyTooLong: boolean
  keyPadded: string
  ipad: string
  opad: string
  innerMsg: string
  innerDigest: string
}

export function hmacSha256Detail(keyText: string, message: string): HmacDetail {
  const blockSize = 64
  const orig = strToBytes(keyText)
  const keyTooLong = orig.length > blockSize
  const key = keyTooLong ? sha256Digest(orig) : orig
  const keyBytes = new Uint8Array(blockSize)
  keyBytes.set(key)
  const ik = new Uint8Array(blockSize)
  const ok = new Uint8Array(blockSize)
  for (let i = 0; i < blockSize; i++) {
    ik[i] = keyBytes[i] ^ 0x36
    ok[i] = keyBytes[i] ^ 0x5c
  }
  const msg = strToBytes(message)
  const inner = new Uint8Array(blockSize + msg.length)
  inner.set(ik)
  inner.set(msg, blockSize)
  const innerDigest = sha256Digest(inner)
  const outer = new Uint8Array(blockSize + 32)
  outer.set(ok)
  outer.set(innerDigest, blockSize)
  return {
    digest: bytesToHex(sha256Digest(outer)),
    keySize: orig.length,
    keyTooLong,
    keyPadded: bytesToHex(keyBytes),
    ipad: bytesToHex(ik),
    opad: bytesToHex(ok),
    innerMsg: bytesToHex(inner),
    innerDigest: bytesToHex(innerDigest),
  }
}

export function hmacSha256(key: Uint8Array | string, message: Uint8Array | string): Uint8Array {
  const blockSize = 64
  let keyBytes: Uint8Array = typeof key === 'string' ? strToBytes(key) : key
  if (keyBytes.length > blockSize) keyBytes = sha256Digest(keyBytes)
  const ik = new Uint8Array(blockSize)
  const ok = new Uint8Array(blockSize)
  for (let i = 0; i < blockSize; i++) {
    ik[i] = (keyBytes[i] ?? 0) ^ 0x36
    ok[i] = (keyBytes[i] ?? 0) ^ 0x5c
  }
  const msg = typeof message === 'string' ? strToBytes(message) : message
  const inner = new Uint8Array(blockSize + msg.length)
  inner.set(ik)
  inner.set(msg, blockSize)
  const innerDigest = sha256Digest(inner)
  const outer = new Uint8Array(blockSize + 32)
  outer.set(ok)
  outer.set(innerDigest, blockSize)
  return sha256Digest(outer)
}

export function pbkdf2Sha256(
  password: string,
  salt: string,
  iterations: number,
  dkLen: number,
): { dkHex: string; blockDigests: string[]; u1: string } {
  const hashLen = 32
  const totalBlocks = Math.ceil(dkLen / hashLen)
  const saltBytes = strToBytes(salt)
  const out = new Uint8Array(dkLen)
  let offset = 0
  let u1 = ''
  const blockDigests: string[] = []
  for (let i = 1; i <= totalBlocks; i++) {
    const int = new Uint8Array(4)
    int[0] = (i >>> 24) & 0xff
    int[1] = (i >>> 16) & 0xff
    int[2] = (i >>> 8) & 0xff
    int[3] = i & 0xff
    const saltWithInt = new Uint8Array(saltBytes.length + 4)
    saltWithInt.set(saltBytes)
    saltWithInt.set(int, saltBytes.length)
    let ui = hmacSha256(password, saltWithInt)
    if (i === 1) u1 = bytesToHex(ui)
    const acc = new Uint8Array(ui.length)
    acc.set(ui)
    for (let c = 1; c < iterations; c++) {
      ui = hmacSha256(password, ui)
      for (let j = 0; j < acc.length; j++) acc[j] ^= ui[j]
    }
    blockDigests.push(bytesToHex(acc))
    out.set(acc.subarray(0, Math.min(dkLen - offset, acc.length)), offset)
    offset += acc.length
  }
  return { dkHex: bytesToHex(out), blockDigests, u1 }
}

export function hkdfSha256(
  ikm: string,
  salt: string,
  info: string,
  len: number,
): { prk: string; outHex: string; blocks: string[] } {
  const prk = hmacSha256(salt, ikm)
  const blocks: string[] = []
  const out = new Uint8Array(len)
  let prev: Uint8Array = new Uint8Array(0)
  let offset = 0
  let counter = 1
  while (offset < len) {
    const input = new Uint8Array(prev.length + strToBytes(info).length + 1)
    input.set(prev)
    input.set(strToBytes(info), prev.length)
    input[input.length - 1] = counter
    const t = hmacSha256(prk, input)
    blocks.push(bytesToHex(t))
    out.set(t.subarray(0, Math.min(len - offset, t.length)), offset)
    offset += t.length
    prev = t
    counter++
  }
  return { prk: bytesToHex(prk), outHex: bytesToHex(out), blocks }
}
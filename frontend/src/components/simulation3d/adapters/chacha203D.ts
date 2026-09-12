// ChaCha20 3D adapter — Phase 2 pilot of the algorithm-driven laboratory.
//
// The single 2D "rounds" stage is expanded into the 10 real double-round
// steps: each step shows the 4×4 working state BEFORE and AFTER with the
// full 16-word before/after registry, the column/diagonal quarter-round
// description and the educational "why". All values are the actual ChaCha20
// words (real arithmetic, mirrored from the 2D engine — never decorative).
import { chacha20Engine } from '../../simulation/renderers/chacha20'
import { hexToBytes, strToBytes, bytesToHex } from '../../simulation/simulationShared'
import { arrow, hexMatrixGrid, hexStrip, merge, valuePlate } from './scene'
import type {
  ResolvedObject3D as SimObject,
  Simulation3DAdapter,
  Simulation3DStep,
  Simulation3DStepMeta,
  SimChangedValue,
} from '../types/simulation3d'

type M = string[][]

const w8 = (v: number): string => (v >>> 0).toString(16).padStart(8, '0')

const rotl = (v: number, s: number): number => ((v << s) | (v >>> (32 - s))) >>> 0

const addMod = (a: number, b: number): number => (a + b) >>> 0

function quarterRound(s: number[], a: number, b: number, c: number, d: number): void {
  s[a] = addMod(s[a], s[b])
  s[d] = rotl(s[d] ^ s[a], 16)
  s[c] = addMod(s[c], s[d])
  s[b] = rotl(s[b] ^ s[c], 12)
  s[a] = addMod(s[a], s[b])
  s[d] = rotl(s[d] ^ s[a], 8)
  s[c] = addMod(s[c], s[d])
  s[b] = rotl(s[b] ^ s[c], 7)
}

const COLUMNS: Array<[number, number, number, number]> = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
]

const DIAGONALS: Array<[number, number, number, number]> = [
  [0, 5, 10, 15],
  [1, 6, 11, 12],
  [2, 7, 8, 13],
  [3, 4, 9, 14],
]

const CONSTANT_WORDS = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]

const leWords = (bytes: Uint8Array): number[] => {
  const out: number[] = []
  for (let i = 0; i < bytes.length; i += 4) {
    const b0 = bytes[i] ?? 0
    const b1 = bytes[i + 1] ?? 0
    const b2 = bytes[i + 2] ?? 0
    const b3 = bytes[i + 3] ?? 0
    out.push((b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0)
  }
  return out
}

function initialState(keyHex: string, nonceHex: string, counter: number): number[] {
  return CONSTANT_WORDS.concat(leWords(hexToBytes(keyHex))).concat([counter >>> 0]).concat(leWords(hexToBytes(nonceHex)))
}

const wordsToHex = (ws: number[]): string[] => ws.map(w8)

const wordsFromHex = (ws: string[]): number[] => ws.map((w) => parseInt(w, 16) >>> 0)

const matrix4 = (words: string[]): M =>
  Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => words[r * 4 + c] ?? '--------'))

/** The real result of quarter_round(0,4,8,12) applied to `buf`. */
function quarterRoundAfter(buf: number[]): number[] {
  const s = buf.slice()
  quarterRound(s, 0, 4, 8, 12)
  return s
}

/** Coordinates of cells whose values differ between two 4×4 state matrices. */
function changedCells(before: M, after: M): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if ((before[r][c] ?? '--------') !== (after[r][c] ?? '--------')) out.push([r, c])
    }
  }
  return out
}

const setToHex = (n: number): string => n.toString(16).padStart(8, '0')

interface ChachaRun {
  init: string[]
  doubles: string[][]
  final: string[]
  ks: string[]
  resultHex: string
}

/** Real ChaCha20 block math — mirrors the 2D engine exactly. */
function chachaRun(message: string, keyHex: string, nonceHex: string, counter: number, decrypt: boolean): ChachaRun | null {
  try {
    const init = initialState(keyHex, nonceHex, counter)
    const working = init.slice()
    const doubles: number[][] = []
    for (let r = 0; r < 10; r++) {
      for (const q of COLUMNS) quarterRound(working, q[0], q[1], q[2], q[3])
      for (const q of DIAGONALS) quarterRound(working, q[0], q[1], q[2], q[3])
      doubles.push(working.slice())
    }
    const ks = init.map((w, i) => addMod(w, working[i]))
    const ksBytes = new Uint8Array(ks.length * 4)
    ks.forEach((w, i) => {
      ksBytes[4 * i] = w & 0xff
      ksBytes[4 * i + 1] = (w >>> 8) & 0xff
      ksBytes[4 * i + 2] = (w >>> 16) & 0xff
      ksBytes[4 * i + 3] = (w >>> 24) & 0xff
    })
    const dataBytes = decrypt ? hexToBytes(message.toLowerCase()) : strToBytes(message)
    const cipherBytes = ksBytes.slice(0, dataBytes.length).map((b, i) => b ^ (dataBytes[i] ?? 0))
    return {
      init: wordsToHex(init),
      doubles: doubles.map(wordsToHex),
      final: wordsToHex(working),
      ks: wordsToHex(ks),
      resultHex: bytesToHex(cipherBytes),
    }
  } catch {
    return null
  }
}

const changedRows = (before: string[], after: string[], reason: string): SimChangedValue[] =>
  before
    .map((b, i) => ({
      entity: `w${i}`,
      label: `word ${i}`,
      before: b.toUpperCase(),
      after: (after[i] ?? '--------').toUpperCase(),
      reason,
      tone: 'active' as const,
    }))
    .filter((r) => r.before !== r.after)

/** A before→after pair of 4×4 states with an arrow and a double-round plate. */
function doubleRoundScene(prefix: string, before: M, after: M, note: string): SimObject[] {
  return [
    hexMatrixGrid(`${prefix}-b`, before, 'internal', [-4.4, 0, 0]),
    hexMatrixGrid(`${prefix}-a`, after, 'transform', [4.4, 0, 0], { highlight: changedCells(before, after) }),
    arrow(`${prefix}-ar`, [-1.4, 0.7, 0], [2.4, 0.7, 0], 'path'),
    ...valuePlate(`${prefix}-cap`, [0, 3.8, 0], 'double round', note, 'transform'),
  ]
}

export const chacha203DAdapter: Simulation3DAdapter = {
  id: chacha20Engine.id,
  nameKey: chacha20Engine.nameKey,
  educationalKey: chacha20Engine.educationalKey,
  demoInputs: chacha20Engine.demoInputs,

  buildSteps(ctx): Simulation3DStep[] {
    const t = ctx.t
    const stages = chacha20Engine.build(ctx)
    const input = stages.find((s) => s.id === 'chacha20-input')
    const state = stages.find((s) => s.id === 'chacha20-state')
    const quarter = stages.find((s) => s.id === 'chacha20-quarter')
    const double = stages.find((s) => s.id === 'chacha20-double')
    const rounds = stages.find((s) => s.id === 'chacha20-rounds')
    const keystream = stages.find((s) => s.id === 'chacha20-keystream')
    const result = stages.find((s) => s.id === 'chacha20-result')
    if (!input || !state || !quarter || !double || !rounds || !keystream || !result) return []

    const v = (kind: string) =>
      (stages.find((s) => s.view?.kind === kind)?.view ?? {}) as Record<string, unknown>
    const iv = v('chacha-input')
    const sv = v('chacha-state')
    const qv = v('chacha-quarter')
    const kv = v('chacha-keystream')
    const rv = v('chacha-result')

    const decrypt = Boolean(rv.decrypt)
    const message = String(iv.message ?? '')
    const keyHex = String(iv.key ?? '').replace(/\s/g, '').toLowerCase()
    const nonceHex = String(iv.nonce ?? '').replace(/\s/g, '').toLowerCase()
    const counter = Number(iv.counter ?? 1) || 0
    const run = chachaRun(message, keyHex, nonceHex, counter, decrypt)
    const resultHex = String(rv.hex ?? '').toUpperCase()

    const mk = (
      st: (typeof stages)[number],
      objects: SimObject[],
      meta: Simulation3DStepMeta,
      p: Partial<Simulation3DStep> = {},
    ): Simulation3DStep => ({
      id: `3d-${st.id}${p.id ?? ''}`,
      titleKey: p.titleKey ?? st.titleKey,
      titleArgs: p.titleArgs,
      descKey: p.descKey ?? st.descKey,
      descArgs: p.descArgs ?? st.descArgs,
      phase: p.phase ?? st.phase,
      objects,
      camera: p.camera,
      duration: p.duration ?? 800,
      meta,
    })

    const steps: Simulation3DStep[] = []

    // 1) Input -------------------------------------------------------------
    steps.push(
      mk(
        input,
        [
          ...hexStrip('msg', message, 'input', [-4, 0.8, -2.6], { cellSize: 0.7, gap: 0.08, glyphY: 1.6 }),
          ...hexStrip('ky', keyHex.toUpperCase(), 'key', [0, 0.8, 0.2], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...hexStrip('nc', nonceHex.toUpperCase(), 'key', [0, 0.8, 1.6], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...valuePlate('ctr', [4.6, 0.5, 2.2], 'counter', String(counter), 'key', { emphasize: true }),
          ...valuePlate('cap', [0, 3.2, -2.6], 'inputs', 'message · key (32 B) · nonce · counter', 'internal'),
        ],
        {
          level: 'concept',
          event: 'INPUT_CREATED',
          operation: 'Setup',
          inputs: { message, key: keyHex.toUpperCase(), nonce: nonceHex.toUpperCase(), counter: String(counter) },
          why: t('simulation3d.chacha20.whyInput'),
        },
      ),
    )

    // 2) Initial 4×4 state --------------------------------------------------
    const initGrid = (sv.grid as M | undefined) ?? (run ? matrix4(run.init) : undefined)
    if (initGrid) {
      steps.push(
        mk(
          state,
          [
            hexMatrixGrid('cc-st', initGrid, 'internal', [0, 0, 0]),
            ...valuePlate('cc-cap', [0, 3.7, 3.2], 'initial state', 'c · k(8) · counter · nonce · c', 'internal'),
            ...valuePlate('cc-rows', [0, -2, 4.6], 'layout', 'ccckkkkkkxxxx', 'muted'),
          ],
          {
            level: 'algorithm',
            event: 'STATE_UPDATED',
            operation: 'Assemble state',
            formula: 'S[0..3] = c || S[4..11] = key || S[12] = counter || S[13..15] = nonce',
            inputs: run ? { 'constant': CONSTANT_WORDS.map(setToHex).join(' '), 'counter': setToHex(counter) } : undefined,
            stateBefore: run ? Object.fromEntries(run.init.map((w, i) => [`w${i}`, w.toUpperCase()])) : undefined,
            why: t('simulation3d.chacha20.whyState'),
          },
        ),
      )
    }

    // 3) Textbook quarter round on the initial state --------------------------
    const qrBefore = (qv.grid as M | undefined) ?? initGrid
    const qrAfterM =
      (qv.after as M | undefined) ?? (run ? matrix4(wordsToHex(quarterRoundAfter(wordsFromHex(run.init)))) : undefined)
    if (qrBefore && qrAfterM && run) {
      steps.push(
        mk(
          quarter,
          [
            hexMatrixGrid('cc-qr-b', qrBefore, 'internal', [-3.6, 0, 0], { highlight: [[0, 0], [1, 0], [2, 0], [3, 0]] }),
            hexMatrixGrid('cc-qr-a', qrAfterM, 'active', [3.6, 0, 0], { highlight: [[0, 0], [1, 0], [2, 0], [3, 0]] }),
            arrow('cc-qr-ar', [-0.2, 0.6, 0], [1.6, 0.6, 0], 'path'),
            ...valuePlate('cc-qr-cap', [0, 3.7, 0], 'quarter round', 'quarter_round(0, 4, 8, 12)', 'transform'),
          ],
          {
            level: 'operation',
            event: 'ROTATE_EXECUTED',
            operation: 'Quarter round (0,4,8,12)',
            formula: 'a+=b · d=RROTL(d^a,16) · c+=d · b=RROTL(b^c,12) · a+=b · d=RROTL(d^a,8) · c+=d · b=RROTL(b^c,7)',
            changedValues: changedRows(
              (qrBefore as M).flat(),
              (qrAfterM as M).flat(),
              'quarter round',
            ),
            why: t('simulation3d.chacha20.whyQuarter'),
          },
        ),
      )
    }

    // 4..13) The ten real double rounds ---------------------------------------
    if (run) {
      run.doubles.forEach((afterWords, i) => {
        const beforeWords = i === 0 ? run.init : run.doubles[i - 1]
        const before = matrix4(beforeWords)
        const after = matrix4(afterWords)
        steps.push(
          mk(
            double,
            doubleRoundScene(`cc-dr${i}`, before, after, `double round ${i + 1} / 10`),
            {
              level: i === 0 ? 'operation' : 'bit',
              event: 'ROUND_STARTED',
              operation: `Double round ${i + 1} of 10`,
              formula:
                'column round: (0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15) · diagonal round: (0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)',
              inputs: {},
              stateBefore: Object.fromEntries(beforeWords.map((w, x) => [`w${x}`, w.toUpperCase()])),
              stateAfter: Object.fromEntries(afterWords.map((w, x) => [`w${x}`, w.toUpperCase()])),
              changedValues: changedRows(beforeWords, afterWords, 'column + diagonal QR'),
              why: t('simulation3d.chacha20.whyDouble'),
            },
            {
              id: `-round-${i + 1}`,
              titleKey: 'simulation3d.chacha20.doubleTitle',
              titleArgs: { n: i + 1 },
              descKey: 'simulation3d.chacha20.doubleDesc',
              descArgs: { n: i + 1 },
            },
          ),
        )
      })

      // 14) Working state after 20 rounds ---------------------------------------
      steps.push(
        mk(
          rounds,
          [
            hexMatrixGrid('cc-wrk', matrix4(run.final), 'internal', [0, 0, 0]),
            ...valuePlate('cc-wrk-cap', [0, 3.7, 3.2], 'working state', 'state after all 20 rounds', 'transform'),
          ],
          {
            level: 'algorithm',
            event: 'ROUND_COMPLETED',
            operation: 'Working state',
            formula: 'after 10 × (column round + diagonal round)',
            inputs: { 'double rounds': '10' },
            why: t('simulation3d.chacha20.whyRounds'),
          },
        ),
      )

      // 15) Keystream block = init + working (mod 2^32) -------------------------
      const kGridInit = (kv.init as M | undefined) ?? matrix4(run.init)
      const kGridKs = (kv.ks as M | undefined) ?? matrix4(run.ks)
      const ksHex = String(kv.ksHex ?? '')
      steps.push(
        mk(
          keystream,
          [
            hexMatrixGrid('cc-ks-i', kGridInit, 'muted', [-5, 0, 0]),
            hexMatrixGrid('cc-ks-z', kGridKs, 'transform', [5, 0, 0]),
            arrow('cc-ks-ar1', [-2, 0.7, 0], [-0.4, 0.7, 0], 'path'),
            arrow('cc-ks-ar2', [2.2, 0.7, 0], [4, 0.7, 0], 'path'),
            ...valuePlate('cc-ks-cap', [0, 3.5, 0], 'keystream block', 'init + working (mod 2³²)', 'transform'),
            ...(ksHex ? hexStrip('cc-ksh', ksHex.toUpperCase(), 'output', [0, -0.6, 4.6], { piece: 2, cellSize: 0.46, gap: 0.025, glyphY: 0.15 }) : []),
          ],
          {
            level: 'operation',
            event: 'ADD_EXECUTED',
            operation: 'Keystream block Z',
            formula: 'Z[i] = init[i] + working[i] (mod 2³²)',
            changedValues: changedRows(run.init, run.ks, 'init + working (mod 2³²)'),
            why: t('simulation3d.chacha20.whyKeystream'),
          },
        ),
      )
    } else {
      // Fallback: keep the ORIGINAL 2D-expanded stages when live math is unavailable.
      const fg = (sv.grid as M | undefined) ?? (qv.grid as M | undefined)
      if (fg) {
        steps.push(
          mk(state, [hexMatrixGrid('st', fg, 'internal', [0, 0, 0])], {
            level: 'algorithm',
            event: 'STATE_UPDATED',
            operation: 'Initial state',
          }),
        )
      }
      steps.push(
        mk(double, [hexMatrixGrid('cc-b', fg ?? [], 'internal', [0, 0, 0])], {
          level: 'operation',
          event: 'ROUND_STARTED',
          operation: 'Rounds',
        }),
      )
    }

    // 16) Ciphertext / plaintext ------------------------------------------------
    steps.push(
      mk(
        result,
        merge(
          ...hexStrip('out', resultHex, 'output', [0, 0.6, 0], { piece: 1, cellSize: 0.5, gap: 0.028, glyphY: 1.3 }),
          ...valuePlate('cc-out-cap', [0, 2.5, 0], decrypt ? 'plaintext' : 'ciphertext', resultHex, 'output', { emphasize: true }),
        ),
        {
          level: 'concept',
          event: 'XOR_EXECUTED',
          operation: decrypt ? 'Decrypt (XOR)' : 'Encrypt (XOR)',
          formula: decrypt ? 'P = C ⊕ Z' : 'C = P ⊕ Z',
          inputs: { message, 'keystream': 'first 64 bytes' },
          outputs: { result: resultHex },
          why: t('simulation3d.chacha20.whyResult'),
        },
      ),
    )

    return steps
  },
}
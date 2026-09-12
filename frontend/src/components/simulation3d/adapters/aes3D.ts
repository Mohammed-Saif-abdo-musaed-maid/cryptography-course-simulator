// AES 3D adapter — Phase 2 pilot of the algorithm-driven laboratory.
//
// Like the SHA-512 pilot, this adapter expands the single 2D "rounds" stage
// into one 3D step per real AES round (SubBytes → ShiftRows → MixColumns →
// AddRoundKey), each with the full 16-byte before/after registry and the
// list of actually-changed cells. Every value comes straight from the 2D
// engine's stage payloads (bound backend matrices when available) — nothing
// is invented.
import { aesEngine } from '../../simulation/renderers/aes'
import { arrow, hexMatrixGrid, hexStrip, valuePlate } from './scene'
import type {
  ResolvedObject3D as SimObject,
  Simulation3DAdapter,
  Simulation3DStep,
  Simulation3DStepMeta,
  SimChangedValue,
  Vec3,
} from '../types/simulation3d'

type HexMatrix = string[][]

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

const cellsOf = (m: HexMatrix | undefined): Record<string, string> | undefined => {
  if (!m) return undefined
  const entries: Array<[string, string]> = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) entries.push([`s${r}${c}`, (m[r]?.[c] ?? '').toUpperCase()])
  return Object.fromEntries(entries)
}

const diffCells = (before: HexMatrix | undefined, after: HexMatrix | undefined, reason: string): SimChangedValue[] => {
  if (!before || !after) return []
  const out: SimChangedValue[] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const b = before[r]?.[c]
      const a = after[r]?.[c]
      if (b && a && b !== a) {
        out.push({
          entity: `s${r}${c}`,
          label: `byte (row ${r}, col ${c})`,
          before: b.toUpperCase(),
          after: a.toUpperCase(),
          reason,
          tone: 'active',
        })
      }
    }
  }
  return out
}

const highlightsOf = (
  before: HexMatrix | undefined,
  after: HexMatrix | undefined,
): Array<[number, number]> => {
  if (!before || !after) return []
  const out: Array<[number, number]> = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (before[r]?.[c] !== after[r]?.[c]) out.push([r, c])
  return out
}

/** before → after pair with an arrow and an operation plate (chessboard view). */
function transitionScene(prefix: string, before: HexMatrix | undefined, after: HexMatrix | undefined, note: string): SimObject[] {
  return [
    ...(before ? [hexMatrixGrid(`${prefix}-b`, before, 'internal', [-5.8, 0, 0])] : []),
    ...(after ? [hexMatrixGrid(`${prefix}-a`, after, 'transform', [5.8, 0, 0], { highlight: highlightsOf(before, after) })] : []),
    arrow(`${prefix}-ar`, [-2.4, 0.8, 0], [3.4, 0.8, 0], 'path'),
    ...valuePlate(`${prefix}-cap`, [0, 3.8, 0], 'AES round', note, 'transform'),
  ]
}

export const aes3DAdapter: Simulation3DAdapter = {
  id: aesEngine.id,
  nameKey: aesEngine.nameKey,
  educationalKey: aesEngine.educationalKey,
  demoInputs: aesEngine.demoInputs,

  buildSteps(ctx): Simulation3DStep[] {
    const t = ctx.t
    const stages = aesEngine.build(ctx)
    const input = stages.find((s) => s.id === 'aes-input')
    const key = stages.find((s) => s.id === 'aes-key')
    const addkey = stages.find((s) => s.id === 'aes-addkey')
    const sbox = stages.find((s) => s.id === 'aes-sbox')
    const round = stages.find((s) => s.id === 'aes-round')
    const rounds = stages.find((s) => s.id === 'aes-rounds')
    const final = stages.find((s) => s.id === 'aes-final')
    if (!input || !key || !addkey || !sbox || !round || !rounds || !final) return []

    const v = (kind: string) =>
      (stages.find((s) => s.view?.kind === kind)?.view ?? {}) as Record<string, unknown>
    const iv = v('aes-input')
    const kv = v('aes-key')
    const av = v('aes-addkey')
    const sv = v('aes-sbox')
    const rv = v('aes-round')
    const mv = v('aes-rounds')
    const fv = v('aes-final')

    const decrypt = ctx.operation === 'decrypt'
    const nk = Number(kv.nk ?? 4)
    const nr = Number(kv.nr ?? 10)
    const roundKeys = Array.isArray(kv.roundKeys) ? (kv.roundKeys as string[]) : []
    const blockMatrix = (av.before as HexMatrix | undefined) ?? null
    const initial = (av.after as HexMatrix | undefined) ?? null
    const firstKeyMatrix = (av.roundKey as HexMatrix | undefined) ?? null
    const addkeyHighlight = (av.highlight as Array<[number, number]> | undefined) ?? highlightsOf(blockMatrix ?? undefined, initial ?? undefined)
    const sboxIn = (sv.byteIn as HexMatrix | undefined) ?? null
    const sboxOut = (sv.byteOut as HexMatrix | undefined) ?? null
    const dA = (rv.a as HexMatrix | undefined) ?? null
    const dB = (rv.b as HexMatrix | undefined) ?? null
    const dC = (rv.c as HexMatrix | undefined) ?? null
    const dD = (rv.d as HexMatrix | undefined) ?? null
    const roundKeyHex = hexStr(rv.roundKey)
    const midStates = (mv.rounds as HexMatrix[] | undefined) ?? []
    const finalState = (fv.state as HexMatrix | undefined) ?? null
    const resultHex = hexStr(fv.hex).toUpperCase()
    const blockHex = hexStr(iv.block).toUpperCase()
    const keyHex = hexStr(iv.key).toUpperCase()

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

    // 1) Block & key --------------------------------------------------------
    steps.push(
      mk(
        input,
        [
          ...hexStrip('blk', blockHex, 'input', [0, 1.6, -3.6], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...hexStrip('ky', keyHex, 'key', [0, 1.6, -1.4], { piece: 1, cellSize: 0.55, gap: 0.03 }).objects,
          ...(blockMatrix ? [hexMatrixGrid('in-state', blockMatrix, 'input', [0, 0, -0.5])] : []),
          ...valuePlate('cap', [0, 4.2, 3.2], 'state', 'block laid column-major', 'internal'),
        ],
        {
          level: 'concept',
          event: 'INPUT_CREATED',
          operation: 'Setup',
          inputs: { block: blockHex, key: keyHex, 'key words (Nk)': String(nk), rounds: String(nr) },
          why: t('simulation3d.aes.whyInput'),
        },
      ),
    )

    // 2) Key schedule ---------------------------------------------------------
    steps.push(
      mk(
        key,
        (() => {
          const objs: SimObject[] = []
          roundKeys.forEach((k, i) => {
            const a = i * ((Math.PI * 2) / Math.max(roundKeys.length, 1))
            const pos: Vec3 = [9 * Math.cos(a), 0.5, 9 * Math.sin(a)]
            objs.push(...valuePlate(`k${i}`, pos, `K${i}`, k.toUpperCase(), i === 0 ? 'key' : i % 2 === 0 ? 'internal' : 'transform'))
          })
          objs.push(
            {
              id: 'rk-ring',
              kind: 'ring',
              position: [0, 0, 0],
              ringRadius: 9,
              ringTube: 0.12,
              tone: 'key',
            },
            ...valuePlate('schedule', [0, 2.6, 0], 'round keys', `Nk = ${nk} · ${roundKeys.length} keys`, 'key'),
          )
          return objs
        })(),
        {
          level: 'algorithm',
          event: 'KEY_GENERATED',
          operation: 'Key expansion',
          formula: 'W[i] = W[i-Nk] ⊕ SubWord(RotWord(W[i-1])) ⊕ Rcon for i ≡ 0 (mod Nk)',
          inputs: { 'Nk': String(nk), 'rounds (Nr)': String(nr), 'derived round keys': String(roundKeys.length) },
          why: t('simulation3d.aes.whyKey'),
        },
      ),
    )

    // 3) AddRoundKey (K0) ----------------------------------------------------
    steps.push(
      mk(
        addkey,
        [
          ...(blockMatrix ? [hexMatrixGrid('ak-b', blockMatrix, 'input', [-7.6, 0, 0])] : []),
          ...(firstKeyMatrix ? [hexMatrixGrid('ak-k', firstKeyMatrix, 'key', [0, 0, 0], { cellSize: 0.9 })] : []),
          ...(initial ? [hexMatrixGrid('ak-a', initial, 'transform', [7.6, 0, 0], { highlight: addkeyHighlight })] : []),
          arrow('ak-a1', [-5.4, 1, 0], [-2.8, 1, 0], 'path'),
          arrow('ak-a2', [2.8, 1, 0], [5.4, 1, 0], 'path'),
          ...valuePlate('ak-x1', [-4.1, 2.4, 0], 'AddRoundKey', 'XOR K0', 'transform'),
          ...valuePlate('ak-x2', [4.1, 2.4, 0], 'AddRoundKey', 'state ⊕ key', 'transform'),
        ],
        {
          level: 'operation',
          event: 'XOR_EXECUTED',
          operation: 'AddRoundKey(K0)',
          formula: 'state[i] = state[i] ⊕ key[i] — every byte of the block XOR-ed with the first round key',
          stateBefore: cellsOf(blockMatrix ?? undefined),
          stateAfter: cellsOf(initial ?? undefined),
          changedValues: diffCells(blockMatrix ?? undefined, initial ?? undefined, 'XOR K0'),
          why: t('simulation3d.aes.whyAddKey'),
        },
      ),
    )

    // 4) SubBytes -----------------------------------------------------------
    if (sboxIn && sboxOut) {
      const targets = new Set(sboxIn.flat())
      const sboxM = Array.from({ length: 16 }, (_, r) =>
        Array.from({ length: 16 }, (_, c) => `${(r * 16 + c).toString(16).padStart(2, '0').toUpperCase()}`),
      )
      const sboxCells = sboxM.map((row) =>
        row.map((cell) => ({
          label: cell,
          tone: (targets.has(cell) ? 'active' : 'muted') as 'active' | 'muted',
        })),
      )
      steps.push(
        mk(
          sbox,
          [
            ...(sboxIn ? [hexMatrixGrid('sb-in', sboxIn, 'internal', [-10.5, 0, 0])] : []),
            {
              id: 'sb-grid',
              kind: 'grid',
              position: [0, 0, 0],
              tone: 'muted',
              grid: {
                height: 1.2,
                layers: [
                  {
                    rows: 16,
                    cols: 16,
                    cellSize: 0.42,
                    gap: 0.05,
                    labelScale: 0.7,
                    cells: sboxCells,
                  },
                ],
              },
            },
            ...(sboxOut ? [hexMatrixGrid('sb-out', sboxOut, 'transform', [10.5, 0, 0])] : []),
            arrow('sb-ar1', [-8.2, 1.2, 0], [-4.4, 1.2, 0], 'path'),
            arrow('sb-ar2', [4.4, 1.2, 0], [8.2, 1.2, 0], 'path'),
            ...valuePlate('sb-op', [0, 2.6, 0], decrypt ? 'InvSubBytes' : 'SubBytes', decrypt ? 'inv S-box' : 'S-box · 16×16', 'transform'),
          ],
          {
            level: 'operation',
            event: 'SUBSTITUTE_EXECUTED',
            operation: decrypt ? 'InvSubBytes' : 'SubBytes',
            formula: 'each byte b is replaced by S-box[b] — a nonlinear GF(2⁸) map',
            stateBefore: cellsOf(sboxIn),
            stateAfter: cellsOf(sboxOut),
            changedValues: diffCells(sboxIn, sboxOut, decrypt ? 'inverse S-box' : 'S-box'),
            why: t('simulation3d.aes.whySubBytes'),
          },
        ),
      )
    }

    // 5) Round-1 pipeline breakdown ------------------------------------------
    if (dA && dB && dC && dD) {
      steps.push(
        mk(
          round,
          [
            hexMatrixGrid('r1-a', dA, 'internal', [-9.6, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid('r1-b', dB, 'transform', [-3.2, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid('r1-c', dC, 'transform', [3.2, 0, 0], { cellSize: 0.85, height: 1.4 }),
            hexMatrixGrid('r1-d', dD, 'output', [9.6, 0, 0], { cellSize: 0.85, height: 1.4 }),
            arrow('r1-ar1', [-6.4, 1, 0], [-5.6, 1, 0], 'path'),
            arrow('r1-ar2', [0, 1, 0], [0.8, 1, 0], 'path'),
            arrow('r1-ar3', [6.4, 1, 0], [7.2, 1, 0], 'path'),
            ...valuePlate('r1-op1', [-6.4, 2.7, 0], decrypt ? 'InvShiftRows' : 'ShiftRows', 'rotate rows', 'transform'),
            ...valuePlate('r1-op2', [0, 2.7, 0], decrypt ? 'InvMixColumns' : 'MixColumns', 'mix columns', 'transform'),
            ...valuePlate('r1-op3', [6.4, 2.7, 0], 'AddRoundKey', 'XOR round key', 'transform'),
            ...(roundKeyHex ? valuePlate('r1-rk', [0, -2.4, 4.4], 'round key', roundKeyHex, 'key') : []),
          ],
          {
            level: 'bit',
            event: 'ROUND_STARTED',
            operation: decrypt ? 'First inverse round, magnified' : 'First round, magnified',
            formula: decrypt
              ? 'InvShiftRows → InvSubBytes → AddRoundKey → InvMixColumns'
              : 'ShiftRows → MixColumns → AddRoundKey',
            inputs: { 'round key': roundKeyHex || '' },
            why: t('simulation3d.aes.whyRoundDetail'),
          },
        ),
      )
    }

    // 6) Mid-round overview + per-round transitions ----------------------------
    if (midStates.length > 0) {
      const overviewObjs: SimObject[] = []
      midStates.forEach((m, i) => {
        const z = (i - (midStates.length - 1) / 2) * 3.4
        overviewObjs.push(
          hexMatrixGrid(`ov-${i}`, m, i % 2 === 0 ? 'internal' : 'transform', [0, 0, z], { cellSize: 0.9, height: 1.5 }),
          ...valuePlate(`ovc-${i}`, [0, 3.2, z], `round ${i + 1}`, '', 'muted'),
        )
      })
      overviewObjs.push(...valuePlate('ov-legend', [0, -1.8, -16], 'rounds', `${midStates.length} mid-round states`, 'internal'))
      steps.push(
        mk(
          rounds,
          overviewObjs,
          {
            level: 'concept',
            event: 'ROUND_STARTED',
            operation: 'Round journey',
            inputs: { rounds: String(nr - 1), 'key words (Nk)': String(nk) },
            why: t('simulation3d.aes.whyRounds'),
          },
        ),
      )

      midStates.forEach((m, i) => {
        const roundNo = i + 1
        const prev = roundNo === 1 ? (initial ?? midStates[0]) : midStates[i - 1]
        const keyIdx = decrypt ? nr - roundNo : roundNo
        const keyLabel = roundKeys[keyIdx] ?? ''
        const note = decrypt ? `inverse round ${roundNo}/${nr - 1} · K${keyIdx}` : `round ${roundNo}/${nr - 1} · K${keyIdx}`
        steps.push(
          mk(
            rounds,
            transitionScene(`aes-rm${roundNo}`, prev, m, note),
            {
              level: 'bit',
              event: 'ROUND_COMPLETED',
              operation: decrypt ? `Inverse round ${roundNo} of ${nr - 1} done` : `Round ${roundNo} of ${nr - 1} done`,
              formula: decrypt
                ? 'InvShiftRows → InvSubBytes → AddRoundKey(K' + keyIdx + ') → InvMixColumns'
                : 'SubBytes → ShiftRows → MixColumns → AddRoundKey(K' + keyIdx + ')',
              inputs: keyLabel ? { [`K${keyIdx}`]: keyLabel } : undefined,
              stateBefore: cellsOf(prev),
              stateAfter: cellsOf(m),
              changedValues: diffCells(prev, m, 'AES round'),
              why: t('simulation3d.aes.whyRound'),
            },
            {
              id: `-round-${roundNo}`,
              titleKey: 'simulation3d.aes.roundTitle',
              titleArgs: { n: roundNo, total: nr - 1 },
              descKey: 'simulation3d.aes.roundDesc',
              descArgs: { n: roundNo, total: nr - 1 },
            },
          ),
        )
      })
    }

    // 7) Final state ----------------------------------------------------------
    steps.push(
      mk(
        final,
        [
          ...(finalState ? [hexMatrixGrid('fn-st', finalState, 'output', [-4.2, 0, 0])] : []),
          arrow('fn-ar', [-0.9, 0.6, 0], [1.6, 0.6, 0], 'path'),
          ...hexStrip('fn-out', resultHex, 'output', [4.2, 0.5, 0], { piece: 1, cellSize: 0.5, gap: 0.028 }).objects,
          ...valuePlate('fn-cap', [4.2, 2.5, 0], decrypt ? 'plaintext' : 'ciphertext', resultHex, 'output', { emphasize: true }),
        ],
        {
          level: 'concept',
          event: 'RESULT_READY',
          operation: decrypt ? 'Decrypted plaintext' : 'Encrypted ciphertext',
          inputs: { [decrypt ? 'plaintext' : 'ciphertext']: resultHex },
          why: t('simulation3d.aes.whyFinal'),
        },
      ),
    )

    return steps
  },
}
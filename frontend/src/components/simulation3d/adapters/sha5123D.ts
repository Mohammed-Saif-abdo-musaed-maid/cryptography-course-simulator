// SHA-512 3D adapter — Phase 2 pilot of the algorithm-driven laboratory.
//
// Unlike the decorative siblings, this adapter expands the single 2D
// "rounds" stage into the FULL 80-round traversal: one 3D step per real
// compression round, each carrying semantic metadata (event, formula,
// register before/after, changed values, educational "why"). The scene
// shows only REAL values returned by the backend: W[t], K[t], T1, T2 and
// the eight 64-bit working registers.
import { sha512Engine } from '../../simulation/renderers/sha512'
import type { SimStage } from '../../simulation/simulationTypes'
import { arrow, charRow, fitCamera, gridObject, valuePlate } from './scene'
import type { CellProps } from './scene'
import type {
  LegendEntry,
  ResolvedObject3D as SimObject,
  Simulation3DAdapter,
  Simulation3DStep,
  Simulation3DStepMeta,
  SimChangedValue,
} from '../types/simulation3d'
import { digestScene, msgInputScene, roundRingScene, wordLaneScene } from './hash3d'

interface RoundBound {
  t: number
  W: string
  K: string
  T1: string
  T2: string
  state: string[]
}

interface BlockBound {
  block_index: number
  block_hex: string
  rounds: RoundBound[]
  state_before: string[]
  state_after: string[]
}

const REG_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function regsOf(words: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  REG_NAMES.forEach((n, i) => {
    out[n] = (words[i] ?? '').toUpperCase()
  })
  return out
}

/** 8 register change rows computed from the PREVIOUS vs THIS round state. */
function roundChanges(prev: string[], cur: string[]): SimChangedValue[] {
  const row = (name: string, before: string, after: string, reason: string): SimChangedValue => ({
    entity: name,
    label: `register ${name}`,
    before: before.toUpperCase(),
    after: after.toUpperCase(),
    reason,
    tone: 'active',
  })
  return [
    row('a', prev[0], cur[0], 'a = T1 + T2'),
    row('b', prev[0], cur[1], 'b ← a'),
    row('c', prev[1], cur[2], 'c ← b'),
    row('d', prev[2], cur[3], 'd ← c'),
    row('e', prev[4], cur[4], 'e = d + T1'),
    row('f', prev[4], cur[5], 'f ← e'),
    row('g', prev[5], cur[6], 'g ← f'),
    row('h', prev[6], cur[7], 'h ← g'),
  ]
}

/** A compact ring cursor pointing at the current round index. */
function roundCursor(prefix: string, t: number, count: number): SimObject[] {
  const a = t * ((Math.PI * 2) / count)
  return [
    {
      id: `${prefix}-ring`,
      kind: 'ring',
      position: [0, 0.7, 0],
      ringRadius: 1.7,
      ringTube: 0.05,
      tone: 'path',
    },
    {
      id: `${prefix}-dot`,
      kind: 'sphere',
      position: [1.7 * Math.cos(a), 0.85, 1.7 * Math.sin(a)],
      size: [0.42, 0.42, 0.42],
      tone: 'active',
      emphasize: true,
    },
  ]
}

/** The eight working registers; cells for a and e (the freshly computed ones) glow. */
function regLane(prefix: string, state: string[]): SimObject[] {
  const cells: CellProps[] = state.map((w, i) => ({
    label: w.toUpperCase(),
    tone: i === 0 || i === 4 ? 'active' : 'internal',
    emphasize: i === 0 || i === 4,
  }))
  return charRow(prefix, cells, [0, 0.95, 1.7], { cellSize: 0.62, gap: 0.05, cubeY: 0.3, glyphY: 1 }).objects
}

/** Padded message blocks as 8×8 word grids. */
function paddingScene(blocksHex: string[]): SimObject[] {
  if (blocksHex.length === 0) return []
  const objs: SimObject[] = []
  blocksHex.forEach((block, bi) => {
    const words: string[] = []
    for (let i = 0; i < block.length; i += 16) words.push(block.slice(i, i + 16))
    const z = (bi - (blocksHex.length - 1) / 2) * 3.1
    const rows: string[][] = []
    for (let i = 0; i < words.length; i += 8) rows.push(words.slice(i, i + 8))
    objs.push(
      gridObject(
        `blk-${bi}`,
        rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: 'internal' }))),
        { cellSize: 1.15, gap: 0.12, labelScale: 0.75, height: 1.3 },
      ),
    )
    objs.push(...valuePlate(`blkc-${bi}`, [0, 2.7, z], `block ${bi}`, '512-bit', 'muted'))
  })
  return objs
}

export const sha512Adapter: Simulation3DAdapter = {
  id: sha512Engine.id,
  nameKey: sha512Engine.nameKey,
  educationalKey: sha512Engine.educationalKey,
  demoInputs: sha512Engine.demoInputs,

  getLegend(): LegendEntry[] {
    return [
      { id: 'input', labelKey: 'simulation3d.legend.input', tone: 'input' },
      { id: 'key', labelKey: 'simulation3d.legend.key', tone: 'key' },
      { id: 'active', labelKey: 'simulation3d.legend.active', tone: 'active' },
      { id: 'transform', labelKey: 'simulation3d.legend.transform', tone: 'transform' },
      { id: 'internal', labelKey: 'simulation3d.legend.internal', tone: 'internal' },
      { id: 'output', labelKey: 'simulation3d.legend.output', tone: 'output' },
      { id: 'path', labelKey: 'simulation3d.legend.path', tone: 'path' },
    ]
  },

  buildSteps(ctx): Simulation3DStep[] {
    const t = ctx.t
    const stages = sha512Engine.build(ctx)
    const input = stages.find((s) => s.id === 'sha512-input')
    const padding = stages.find((s) => s.id === 'sha512-padding')
    const rounds = stages.find((s) => s.id === 'sha512-rounds')
    const state = stages.find((s) => s.id === 'sha512-state')
    const digest = stages.find((s) => s.id === 'sha512-digest')
    if (!input || !padding || !rounds || !state || !digest) return []

    const surface = (kind: string) =>
      (stages.find((s) => s.view?.kind === kind)?.view ?? {}) as Record<string, unknown>
    const iv = surface('sha512-input')
    const pv = surface('sha512-padding')
    const sv = surface('sha512-state')
    const dv = surface('sha512-digest')

    const extra = (ctx.result?.extra ?? {}) as Record<string, unknown>
    const blocks = Array.isArray(extra.blocks) ? (extra.blocks as unknown as BlockBound[]) : []
    const first = blocks[0]
    const rnd = first?.rounds ?? []
    const hInit = Array.isArray(sv.hInit) ? (sv.hInit as string[]) : []
    const finalWords = Array.isArray(sv.state) ? (sv.state as string[]) : []
    const hasRounds = rnd.length > 0
    const hasState = hInit.length === 8 && finalWords.length === 8 && Boolean(sv.hasResult)
    const digestHex = String(dv.digest ?? '')
    const hasDigest = digestHex.length > 0 && Boolean(dv.hasResult)

    const mk = (
      st: SimStage,
      objects: SimObject[],
      meta: Simulation3DStepMeta,
      extra2: Partial<Simulation3DStep> = {},
    ): Simulation3DStep => ({
      id: `3d-${st.id}${extra2.id ?? ''}`,
      titleKey: extra2.titleKey ?? st.titleKey,
      titleArgs: extra2.titleArgs,
      descKey: extra2.descKey ?? st.descKey,
      descArgs: extra2.descArgs ?? st.descArgs,
      phase: extra2.phase ?? st.phase,
      objects,
      camera: extra2.camera,
      duration: extra2.duration ?? 800,
      meta,
    })

    const steps: Simulation3DStep[] = []

    // Step 0 — message bytes -------------------------------------------------
    const text = String(iv.text ?? '')
    const hex = String(iv.hex ?? '')
    steps.push(
      mk(input, msgInputScene(text, hex), {
        level: 'concept',
        event: 'INPUT_CREATED',
        operation: 'Encode input',
        inputs: { message: text || '·', bytes: hex.toUpperCase() },
        why: t('simulation3d.sha512.whyInput'),
      }),
    )

    // Step 1 — padding -------------------------------------------------------
    const blocksHex = Array.isArray(pv.blocksHex) ? (pv.blocksHex as string[]) : []
    steps.push(
      mk(padding, paddingScene(blocksHex), {
        level: 'algorithm',
        event: 'PADDING_APPLIED',
        operation: 'MD padding',
        inputs: {
          'bytes': String(iv.len ?? 0),
          'bits': String(iv.bits ?? 0),
          'blocks': String(Number(pv.blockCount ?? 0)),
          'pad bytes': String(Number(pv.padBytes ?? 0)),
        },
        why: t('simulation3d.sha512.whyPadding'),
      }),
    )

    if (hasRounds) {
      // Step 2 — message schedule -------------------------------------------
      const w0 = rnd.slice(0, 16).map((r) => r.W)
      const sampleExpanded = [16, 20, 63]
        .filter((n) => rnd[n])
        .map((n) => ({ [n]: rnd[n].W }))
        .reduce<Record<string, string>>((acc, it) => ({ ...acc, ...it }), {})
      steps.push(
        mk(
          rounds,
          [
            ...wordLaneScene('sh-sch', w0, 'input', [0, 1, 0.8]),
            ...valuePlate('sh-schcap', [0, 2.8, -1.6], 'W[0..15]', 'message words', 'transform'),
            ...valuePlate('sh-lexp', [0, -1.4, 2.4], 'W[16..79]', 'σ0 + σ1 expansion', 'key'),
          ],
          {
            level: 'operation',
            event: 'SCHEDULE_READY',
            operation: 'Message schedule',
            formula: 'W[t] = σ0(W[t-15]) + W[t-16] + σ1(W[t-2]) + W[t-7]',
            inputs: { 'W[0..15]': 'block 0 words', σ0: 'ROTR1 ⊕ ROTR8 ⊕ SHR7', σ1: 'ROTR19 ⊕ ROTR61 ⊕ SHR6' },
            outputs: sampleExpanded,
            why: t('simulation3d.sha512.whySchedule'),
          },
        ),
      )

      // Step 3 — the 80-round ring -----------------------------------------
      steps.push(
        mk(
          rounds,
          roundRingScene('sh-ov', 80, { samples: [0, 20, 63], radius: 8.2, note: '80 rounds' }),
          {
            level: 'concept',
            event: 'ROUND_STARTED',
            operation: 'Round traversal',
            inputs: { 'working registers': 'a,b,c,d,e,f,g,h', rounds: '80' },
            why: t('simulation3d.sha512.whyOverview'),
          },
        ),
      )

      // Steps 4..83 — one 3D step per real compression round -----------------
      rnd.forEach((r, i) => {
        const prev = i === 0 ? (first?.state_before ?? []) : rnd[i - 1].state
        const objs: SimObject[] = [
          ...roundCursor(`sh-cu-${r.t}`, r.t, 80),
          ...regLane(`sh-rt-${r.t}`, r.state),
          ...valuePlate(`sh-w-${r.t}`, [-3.4, 0.3, -2.8], `W[${r.t}]`, r.W, 'key'),
          ...valuePlate(`sh-k-${r.t}`, [-1.1, 0.3, -2.8], `K[${r.t}]`, r.K, 'input'),
          ...valuePlate(`sh-t1-${r.t}`, [1.4, 0.3, -2.8], 'T1', r.T1, 'transform'),
          ...valuePlate(`sh-t2-${r.t}`, [3.7, 0.3, -2.8], 'T2', r.T2, 'internal'),
        ]
        steps.push(
          mk(
            rounds,
            objs,
            {
              level: 'operation',
              event: 'ROUND_STARTED',
              operation: `Round t = ${r.t} — compression`,
              formula: 'T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t] · T2 = Σ0(a) + Maj(a,b,c) · a ← T1+T2 · e ← d+T1',
              inputs: { 'W[t]': r.W, 'K[t]': r.K },
              outputs: { T1: r.T1, T2: r.T2, 'new a': r.state[0] },
              stateBefore: regsOf(prev),
              stateAfter: regsOf(r.state),
              changedValues: roundChanges(prev, r.state),
              highlightedEntities: [`sh-rt-${r.t}-0`, `sh-rt-${r.t}-4`],
              why: t('simulation3d.sha512.whyRound'),
            },
            {
              id: `-round-${r.t}`,
              titleKey: 'simulation3d.sha512.roundTitle',
              titleArgs: { n: r.t },
              descKey: 'simulation3d.sha512.roundDesc',
              descArgs: { n: r.t },
              camera: i === 0 ? fitCamera(objs.map((o) => o.position), { distance: 13 }) : undefined,
            },
          ),
        )
      })
    } else {
      // No live result: still show the 80-round journey ring as a preview.
      steps.push(
        mk(
          rounds,
          roundRingScene('sh-ov', 80, { samples: [], radius: 8.2, note: '80 rounds' }),
          {
            level: 'concept',
            event: 'ROUND_STARTED',
            operation: 'Round traversal',
            why: t('simulation3d.sha512.whyOverview'),
          },
        ),
      )
    }

    // Chaining state ----------------------------------------------------------
    const stateObjs: SimObject[] = hasState
      ? [
          ...wordLaneScene('sh-h0', hInit, 'input', [0, 0.4, -3.6]),
          arrow('sh-ar', [0, 0.5, -2.2], [0, 0.5, -1.1], 'path'),
          ...wordLaneScene('sh-h1', finalWords, 'transform', [0, 0.4, 0.6]),
          ...valuePlate('sh-stcap', [0, 2.6, 3.8], 'state', 'h0..h7 after all blocks', 'internal'),
        ]
      : [...wordLaneScene('sh-h0', hInit, 'input', [0, 0.4, 0])]
    steps.push(
      mk(state, stateObjs, {
        level: 'algorithm',
        event: 'STATE_UPDATED',
        operation: 'Chaining update',
        formula: 'H[i] ← H[i] + compressed word[i]',
        inputs: hasState ? { 'chaining in': hInit.join(' ') } : undefined,
        outputs: hasState ? { 'chaining out': finalWords.join(' ') } : undefined,
        stateBefore: hasState
          ? Object.fromEntries(hInit.map((w, i) => [`h${i}`, w.toUpperCase()]))
          : undefined,
        stateAfter: hasState
          ? Object.fromEntries(finalWords.map((w, i) => [`h${i}`, w.toUpperCase()]))
          : undefined,
        changedValues: hasState
          ? hInit.map((b, i) => ({
              entity: `h${i}`,
              label: `chaining word h${i}`,
              before: b.toUpperCase(),
              after: finalWords[i].toUpperCase(),
              reason: 'add compressed block words',
              tone: 'transform',
            }))
          : undefined,
        why: t('simulation3d.sha512.whyState'),
      }),
    )

    // Digest ------------------------------------------------------------------
    steps.push(
      mk(
        digest,
        digestScene(hasDigest ? digestHex : '—', 'SHA-512'),
        {
          level: 'concept',
          event: 'HASH_FINALIZED',
          operation: 'Finalize digest',
          inputs: { digest: hasDigest ? digestHex : '—' },
          why: t('simulation3d.sha512.whyDigest'),
        },
        { id: hasDigest ? '' : '-preview' },
      ),
    )

    return steps
  },
}
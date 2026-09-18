import { aesCbcEngine } from '../../simulation/renderers/aesModes'
import type { SimStage } from '../../simulation/simulationTypes'
import type {
  ResolvedObject3D,
  Simulation3DAdapter,
  Simulation3DContext,
  Simulation3DStepMeta,
  Sim3DTone,
  Vec3,
} from '../types/simulation3d'
import { arrow, camToObjects, plate, rows3D, valuePlate } from './scene'
import { stagesToSteps } from './from2d'

/** Rendered hex snippet — every full value lives in the step inspector. */
function short(v: unknown): string {
  const s = String(v ?? '')
  if (!s) return '·'
  return s.length > 16 ? `${s.slice(0, 16)}…` : s
}

const inHex = (v: unknown): string => String(v ?? '')

/** X spacing between block columns, so the chain runs P → XOR → AES → C. */
const COL = 4.4
const MAX_COLS = 4

// Encrypt column rows (top → bottom): P → ⊕ → AES_K → C
const ENC_P_Y = 2.7
const ENC_XOR_Y = 1.45
const ENC_AES_Y = 0.2
const ENC_C_Y = -1.2

// Decrypt column rows (top → bottom): C → AES⁻¹ → M → ⊕ → P
const DEC_C_Y = 2.7
const DEC_AES_Y = 1.3
const DEC_M_Y = -0.1
const DEC_XOR_Y = -1.4
const DEC_P_Y = -2.7

/** A labeled transform box with a short math glyph. */
function gate(
  id: string,
  pos: Vec3,
  label: string,
  tone: Sim3DTone,
  active: boolean,
): ResolvedObject3D[] {
  return [
    { id, kind: 'box', position: pos, size: [1.35, 0.9, 0.9], tone, emphasize: active },
    { id: `${id}-glyph`, kind: 'glyph', position: [pos[0], pos[1] + 0.74, pos[2]], label, glyphScale: 1.15, tone, emphasize: active },
  ]
}

/** The AES primitive box: the only place the key is applied. */
function aesCore(
  id: string,
  pos: Vec3,
  label: string,
  tone: Sim3DTone,
  active: boolean,
): ResolvedObject3D[] {
  return [
    { id, kind: 'box', position: pos, size: [1.8, 1.05, 1.05], tone, emphasize: active },
    { id: `${id}-glyph`, kind: 'glyph', position: [pos[0], pos[1] + 0.85, pos[2]], label, glyphScale: 1.05, tone, emphasize: active },
  ]
}

interface ColumnOptions {
  x: number
  total: number
  hasResult: boolean
  decrypt: boolean
  active: boolean
  highlight: 'xor' | 'aes' | 'dec' | 'xorD' | 'none'
  /** Prev-column C plate world position (chaining source), if visible. */
  prevSource: Vec3 | null
  prevLabel: string
  showIv: boolean
}

/**
 * Draw one block column. Encrypt: P → ⊕ → AES_K → C (prev enters the XOR).
 * Decrypt: C → AES⁻¹ → M → ⊕ → P (prev enters the XOR). Real values come
 * straight from the backend trace arrays; unbound values are honest
 * placeholders (muted) until the simulator binds them.
 */
function blockColumn(rec: Record<string, unknown>, o: ColumnOptions): ResolvedObject3D[] {
  const objs: ResolvedObject3D[] = []
  const x = o.x
  const blockNo = String(rec.i)
  const real = (key: string): boolean => o.hasResult && !!rec[key]
  const plateOf = (id: string, y: number, label: string, key: string, tone: Sim3DTone, emphasize = false) => {
    objs.push(
      ...valuePlate(id, [x, y, 0], label, real(key) ? short(rec[key]) : '·', real(key) ? tone : 'muted', { emphasize }),
    )
  }

  // Chaining partner plate + arrow on the left edge of the XOR gate.
  const prevPort = (px: number): void => {
    const port: Vec3 = [px - 2.5, o.decrypt ? DEC_XOR_Y : ENC_XOR_Y, 0]
    objs.push(...plate(`blk-${blockNo}-prev`, port, `prev ${o.prevLabel}`, (o.showIv ? 'key' : 'path') as Sim3DTone, { size: [1.5, 0.5, 1.1] }))
    if (o.showIv) {
      objs.push(arrow(`blk-${blockNo}-iv`, [px - 3.5, port[1], 0], [port[0] + 0.75, port[1], 0], 'key'))
    } else if (o.prevSource) {
      objs.push(arrow(`blk-${blockNo}-chain`, [o.prevSource[0], o.prevSource[1], 0], [port[0] + 0.75, port[1], 0], 'path'))
    } else {
      objs.push(arrow(`blk-${blockNo}-prevstub`, [px - 3.9, port[1], 0], [port[0] + 0.75, port[1], 0], 'muted'))
    }
  }

  if (o.decrypt) {
    const decActive = o.active && o.highlight === 'dec'
    const xorActive = o.active && o.highlight === 'xorD'
    plateOf(`blk-${blockNo}-cv`, DEC_C_Y, `C${blockNo}`, 'ct', 'input')
    objs.push(arrow(`blk-${blockNo}-c2d`, [x, DEC_C_Y - 0.25, 0], [x, DEC_AES_Y + 0.5, 0], 'path'))
    objs.push(...aesCore(`blk-${blockNo}-aes`, [x, DEC_AES_Y, 0], 'AES⁻¹_K', 'internal', decActive))
    objs.push(arrow(`blk-${blockNo}-d2m`, [x, DEC_AES_Y - 0.5, 0], [x, DEC_M_Y + 0.25, 0], 'path'))
    plateOf(`blk-${blockNo}-m`, DEC_M_Y, `M${blockNo}`, 'dec', 'internal')
    objs.push(arrow(`blk-${blockNo}-m2x`, [x, DEC_M_Y - 0.25, 0], [x, DEC_XOR_Y + 0.45, 0], 'path'))
    objs.push(...gate(`blk-${blockNo}-xor`, [x, DEC_XOR_Y, 0], '⊕', 'transform', xorActive))
    objs.push(arrow(`blk-${blockNo}-x2p`, [x, DEC_XOR_Y - 0.45, 0], [x, DEC_P_Y + 0.25, 0], 'path'))
    plateOf(`blk-${blockNo}-p`, DEC_P_Y, `P${blockNo}`, 'pt', 'plaintext')
    prevPort(x)
  } else {
    const xorActive = o.active && o.highlight === 'xor'
    const aesActive = o.active && o.highlight === 'aes'
    plateOf(`blk-${blockNo}-p`, ENC_P_Y, `P${blockNo}`, 'pt', 'input')
    objs.push(arrow(`blk-${blockNo}-p2x`, [x, ENC_P_Y - 0.55, 0], [x, ENC_XOR_Y + 0.45, 0], 'path'))
    objs.push(...gate(`blk-${blockNo}-xor`, [x, ENC_XOR_Y, 0], '⊕', 'transform', xorActive))
    objs.push(arrow(`blk-${blockNo}-x2a`, [x, ENC_XOR_Y - 0.45, 0], [x, ENC_AES_Y + 0.5, 0], 'path'))
    objs.push(...aesCore(`blk-${blockNo}-aes`, [x, ENC_AES_Y, 0], 'AES_K', 'internal', aesActive))
    objs.push(arrow(`blk-${blockNo}-a2c`, [x, ENC_AES_Y - 0.5, 0], [x, ENC_C_Y + 0.25, 0], 'path'))
    plateOf(`blk-${blockNo}-cv`, ENC_C_Y, `C${blockNo}`, 'ct', 'output')
    prevPort(x)
  }

  // "Current Block i / n" tag above the active column.
  if (o.active) {
    objs.push(
      ...plate(`blk-${blockNo}-cur`, [x, Math.max(ENC_P_Y, DEC_C_Y) + 1.1, 0], `Block ${blockNo} / ${String(o.total)}`, 'active', {
        size: [2.4, 0.5, 1.2],
        emphasize: true,
      }),
    )
  }
  return objs
}

/** The whole (visible slice of the) CBC chain for the current stage state. */
function pipelineScene(v: Record<string, unknown>): ResolvedObject3D[] {
  const decrypt = Boolean(v.decrypt)
  const hasResult = Boolean(v.hasResult)
  const n = Number(v.n ?? 0)
  const cur = Number(v.i ?? 1)
  const hist = (v.hist as Array<Record<string, unknown>> | undefined) ?? []

  const objs: ResolvedObject3D[] = []
  if (n === 0 || hist.length === 0) {
    objs.push(
      ...valuePlate('cbc-empty', [0, 0.4, 0], 'CBC pipeline', decrypt ? 'enter ciphertext to see the chain' : 'enter plaintext to see the chain', 'muted'),
    )
    return objs
  }

  // Window of up to MAX_COLS columns centred on the current block index.
  const start = Math.max(1, Math.min(cur, Math.max(1, n) - MAX_COLS + 1))
  const end = Math.min(start + MAX_COLS - 1, n, cur)
  const center = (start + end) / 2
  const highlight = String(v.kind).split('-')[1] as ColumnOptions['highlight']

  const byId = new Map(hist.map((h) => [Number(h.i), h]))
  for (let j = start; j <= end; j++) {
    const rec = byId.get(j)
    if (!rec) continue
    const x = (j - center) * COL
    const prevLabel = String(rec.prevLabel ?? (j === 1 ? 'C0 = IV' : `C${j - 1}`))
    let prevSource: Vec3 | null = null
    if (j > start && byId.has(j - 1)) {
      const pX = (j - 1 - center) * COL
      prevSource = [pX + 0.75, decrypt ? DEC_C_Y : ENC_C_Y, 0]
    }
    objs.push(
      ...blockColumn(rec, {
        x,
        total: n,
        hasResult,
        decrypt,
        active: j === cur,
        highlight,
        prevSource,
        prevLabel,
        showIv: j === 1 && start === 1,
      }),
    )
  }

  if (end < n) {
    objs.push(
      ...valuePlate('cbc-more', [(end - center) * COL + 1.4, 0.4, 0], 'more blocks', `… ${n - end} more`, 'muted'),
    )
  }
  return objs
}

function cbcScene(stage: SimStage): ResolvedObject3D[] {
  const v = stage.view
  const decrypt = Boolean(v.decrypt)
  switch (v.kind) {
    case 'aes_cbc-input':
      return [
        ...valuePlate('input-plate', [0, 1.4, -2.4], decrypt ? 'ciphertext input' : 'plaintext input', short(decrypt ? v.ciphertext : v.plaintext), 'input'),
        ...valuePlate('iv-plate', [0, -0.1, 0.4], 'IV (C0)', short(v.iv), 'key'),
        ...valuePlate('key-plate', [0, -1.7, 2.2], 'AES key', 'hidden — not exposed', 'muted'),
      ]
    case 'aes_cbc-padding': {
      if (!v.hasResult) {
        return [
          ...valuePlate('pad-placeholder', [0, 0.6, 0], 'padding', 'run to compute', 'muted'),
          ...valuePlate('padcap', [0, 2.3, 2.2], 'PKCS#7 padding', 'to a multiple of 16 bytes', 'key'),
        ]
      }
      const cells = (inHex(v.paddedHex).match(/.{2}/g) ?? []).slice(0, 24).map((h) => ({ label: h, tone: 'transform' as const }))
      return [
        ...rows3D([{ label: 'padded', cells }], [0, 0, 0], { cellSize: 0.5, gap: 0.05, rowStep: 1.6 }).objects,
        ...valuePlate('padcap', [0, 2.3, 2.2], 'PKCS#7 padding', 'to a multiple of 16 bytes', 'key'),
      ]
    }
    case 'aes_cbc-xor':
    case 'aes_cbc-aes':
    case 'aes_cbc-dec':
    case 'aes_cbc-xorD':
      return pipelineScene(v)
    case 'aes_cbc-unpad': {
      if (!v.hasResult) {
        return [
          ...valuePlate('unpad-placeholder', [0, 0.8, 0], 'PKCS#7 unpad', 'run to compute', 'muted'),
        ]
      }
      const cells = (inHex(v.paddedHex).match(/.{2}/g) ?? []).slice(0, 24).map((h) => ({ label: h, tone: 'transform' as const }))
      return [
        ...rows3D([{ label: 'recover', cells }], [0, 0, 0], { cellSize: 0.5, gap: 0.05 }).objects,
        ...valuePlate('padded', [0, 2.2, 2.4], 'PKCS#7 unpad', short(inHex(v.plaintextHex)), 'output'),
      ]
    }
    case 'aes_cbc-result':
      return [
        ...valuePlate(
          'out',
          [0, 0.6, 0],
          decrypt ? 'plaintext' : 'ciphertext (hex)',
          Boolean(v.hasResult) ? short(v.out) : '—',
          Boolean(v.hasResult) ? 'output' : 'muted',
          { emphasize: Boolean(v.hasResult) },
        ),
      ]
    default:
      return []
  }
}

function cbcMeta(stage: SimStage, ctx: Simulation3DContext): Simulation3DStepMeta | undefined {
  const v = stage.view
  const t = ctx.t
  const hasResult = Boolean(v.hasResult)
  const source: 'backend' | 'educational' = hasResult ? 'backend' : 'educational'
  const blockNo = String(v.i)

  switch (v.kind) {
    case 'aes_cbc-input': {
      const keyHex = String(v.key)
      const bits = keyHex ? (keyHex.length / 2) * 8 : 0
      return {
        level: 'concept',
        event: 'INPUT_CREATED',
        operation: 'AES-CBC inputs',
        source,
        inputs: {
          [Boolean(v.decrypt) ? 'ciphertext (hex)' : 'plaintext']: String(Boolean(v.decrypt) ? v.ciphertext : v.plaintext),
          'IV (C0)': String(v.iv),
          'key bits': bits ? `${bits}` : '—',
        },
        highlightedEntities: ['input-plate', 'iv-plate'],
      }
    }
    case 'aes_cbc-padding': {
      const paddedHex = hasResult ? inHex(v.paddedHex) : ''
      const metaBase: Simulation3DStepMeta = {
        level: 'algorithm',
        event: 'PADDING_APPLIED',
        operation: 'PKCS#7 padding',
        formula: 'len → next multiple of 16',
        source,
        inputs: { 'padded bytes (hex)': hasResult ? paddedHex : '·' },
      }
      if (hasResult) {
        metaBase.changedValues = [
          {
            entity: 'message',
            label: 'message',
            before: `${hasResult ? (paddedHex.length / 2) : 0} bytes (incl. pad)` as string,
            after: `${paddedHex.length / 2} bytes padded`,
            reason: 'PKCS#7 appends 1..16 pad bytes',
          },
        ]
      }
      return metaBase
    }
    case 'aes_cbc-aes':
      return {
        level: 'operation',
        event: 'BLOCK_ENCRYPTED',
        operation: 'AES_K',
        formula: String(v.formula),
        source,
        inputs: { [`X${blockNo}`]: String(v.xored) },
        outputs: { [`C${blockNo}`]: String(v.ciphertext) },
        changedValues: [
          {
            entity: `C${blockNo}`,
            label: `C${blockNo}`,
            before: String(v.xored),
            after: String(v.ciphertext),
            reason: String(v.formula),
            tone: 'output',
          },
        ],
        why: t(String(v.whyKey ?? '')),
        highlightedEntities: [`blk-${blockNo}-aes`],
      }
    case 'aes_cbc-dec':
      return {
        level: 'operation',
        event: 'BLOCK_DECRYPTED',
        operation: 'AES⁻¹_K',
        formula: String(v.formula),
        source,
        inputs: { [`C${blockNo}`]: String(v.input) },
        outputs: { [`M${blockNo}`]: String(v.decrypted) },
        changedValues: [
          {
            entity: `M${blockNo}`,
            label: `M${blockNo}`,
            before: String(v.input),
            after: String(v.decrypted),
            reason: String(v.formula),
            tone: 'internal',
          },
        ],
        why: t(String(v.whyKey ?? '')),
        highlightedEntities: [`blk-${blockNo}-aes`],
      }
    case 'aes_cbc-xor':
    case 'aes_cbc-xorD': {
      const isDec = String(v.kind) === 'aes_cbc-xorD'
      const outKey = isDec ? `P${blockNo}` : `X${blockNo}`
      const outVal = isDec ? String(v.plaintext) : String(v.xored)
      const inKey = isDec ? `M${blockNo}` : `P${blockNo}`
      const inVal = isDec ? String(v.decrypted) : String(v.input)
      return {
        level: 'operation',
        event: 'XOR_EXECUTED',
        operation: '⊕',
        formula: String(v.formula),
        source,
        inputs: { [inKey]: inVal, [String(v.prevLabel)]: String(v.prev) },
        outputs: { [outKey]: outVal },
        changedValues: [
          {
            entity: outKey,
            label: outKey,
            before: inVal,
            after: outVal,
            reason: String(v.formula),
            tone: 'transform',
          },
        ],
        why: t(String(v.whyKey ?? '')),
        highlightedEntities: [`blk-${blockNo}-xor`],
      }
    }
    case 'aes_cbc-unpad':
      return {
        level: 'algorithm',
        event: 'PADDING_REMOVED',
        operation: 'PKCS#7 unpad',
        source,
        inputs: { 'padded plaintext (hex)': hasResult ? String(v.paddedHex) : '·' },
        outputs: { 'plaintext after unpad (hex)': hasResult ? String(v.plaintextHex) : '·' },
      }
    case 'aes_cbc-result':
      return {
        level: 'algorithm',
        event: 'RESULT_READY',
        operation: 'AES-CBC result',
        source,
        outputs: {
          [Boolean(v.decrypt) ? 'plaintext' : 'ciphertext (hex)']: hasResult ? String(v.out) : '—',
        },
      }
    default:
      return undefined
  }
}

export const aesCbc3DAdapter: Simulation3DAdapter = {
  id: aesCbcEngine.id,
  nameKey: aesCbcEngine.nameKey,
  educationalKey: aesCbcEngine.educationalKey,
  demoInputs: aesCbcEngine.demoInputs,
  buildSteps(ctx) {
    const stages = aesCbcEngine.build(ctx)
    return stagesToSteps(stages, cbcScene, (st) => cbcMeta(st, ctx)).map((s) => ({
      ...s,
      camera: camToObjects(s.objects),
    }))
  },
  getLegend: () => [
    { id: 'input', labelKey: 'simulation3d.legend.input', tone: 'input' },
    { id: 'plaintext', labelKey: 'simulation3d.legend.plaintext', tone: 'plaintext' },
    { id: 'key', labelKey: 'simulation3d.legend.key', tone: 'key' },
    { id: 'transform', labelKey: 'simulation3d.legend.transform', tone: 'transform' },
    { id: 'internal', labelKey: 'simulation3d.legend.internal', tone: 'internal' },
    { id: 'output', labelKey: 'simulation3d.legend.output', tone: 'output' },
    { id: 'active', labelKey: 'simulation3d.legend.active', tone: 'active' },
  ],
}
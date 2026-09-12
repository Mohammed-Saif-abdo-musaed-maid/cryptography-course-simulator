import type {
  LegendEntry,
  ResolvedObject3D,
  Sim3DPhase,
  Simulation3DAdapter,
  Simulation3DContext,
  Simulation3DStep,
  Vec3,
} from '../types/simulation3d'
import { ALPHABET, caesarChars } from '../../simulation/simulationShared'
import { valuePlate } from './scene'

const RING_R = 8
const GLYPH_Y = 1.15
const PT_R = 12.2
const CUBE_Y = 0.55
const ARC_R = 8.6
const ARC_Y = 0.35
const TRAVELER_R = 8.6
const TRAVELER_Y = 0.5
const KEY_BLOCK: Vec3 = [-6.4, 3, -3.2]
const KEY_LABEL: Vec3 = [-6.4, 4.6, -3.2]
const MAX_LETTERS = 12

const TAU = Math.PI * 2
const DEFAULT_CAMERA = { position: [9.5, 10, 15] as Vec3, target: [0, 0.4, 0] as Vec3 }

const angleOf = (idx: number): number => (idx / 26) * TAU

const ringPoint = (idx: number, radius: number, y: number): Vec3 => {
  const a = angleOf(idx)
  return [radius * Math.cos(a), y, radius * Math.sin(a)]
}

interface RingGlyph {
  tone: 'muted' | 'active' | 'complete' | 'internal'
  emphasize?: boolean
}

interface LetterInfo {
  plain: string
  value: number
  mapped: string
  mappedVal: number
}

interface SceneState {
  glyphs?: RingGlyph[]
  keyOn?: boolean
  ringEmphasize?: boolean
  activeLetter?: number
  travelerVisible?: boolean
  travelerAt?: 'source' | 'target'
  arcVisible?: boolean
  ptArrows?: number[]
  otArrows?: number[]
  resultArrow?: boolean
  revealed?: number[]
  fadePlain?: number[]
  dimPlain?: number[]
}

interface SceneInfo {
  letters: LetterInfo[]
  k: number
  sign: number
}

function buildScene(info: SceneInfo, s: SceneState): ResolvedObject3D[] {
  const objects: ResolvedObject3D[] = []
  const n = info.letters.length
  const sign = info.sign

  const ptAngle = (i: number): number => {
    if (n <= 1) return Math.PI / 2
    const span = Math.min(1.05, 0.35 + 0.1 * n)
    return Math.PI / 2 - span + (2 * span * i) / (n - 1)
  }
  const ptPos = (i: number): Vec3 => [PT_R * Math.cos(ptAngle(i)), CUBE_Y, PT_R * Math.sin(ptAngle(i))]
  const otPos = (i: number): Vec3 => [-PT_R * Math.cos(ptAngle(i)), CUBE_Y, -PT_R * Math.sin(ptAngle(i))]

  // Alphabet ring.
  objects.push({
    id: 'ring',
    kind: 'ring',
    position: [0, 0, 0],
    ringRadius: RING_R,
    ringTube: 0.22,
    tone: 'muted',
    emphasize: s.ringEmphasize ?? false,
  })

  // Letter glyphs around the ring.
  for (let i = 0; i < 26; i++) {
    const g = s.glyphs?.[i]
    objects.push({
      id: `glyph-${i}`,
      kind: 'glyph',
      position: ringPoint(i, RING_R, GLYPH_Y),
      label: ALPHABET[i],
      glyphScale: 1.1,
      tone: g?.tone ?? 'muted',
      emphasize: g?.emphasize ?? false,
    })
  }

  // Shift key floating block + value label.
  objects.push({
    id: 'key-block',
    kind: 'box',
    position: KEY_BLOCK,
    size: [1.5, 1.2, 1.5],
    tone: 'key',
    emphasize: s.keyOn ?? false,
  })
  objects.push({
    id: 'key-label',
    kind: 'glyph',
    position: KEY_LABEL,
    label: String(info.k),
    glyphScale: 1.25,
    tone: 'key',
    emphasize: s.keyOn ?? false,
  })

  // Plaintext cubes on the near side.
  for (let i = 0; i < n; i++) {
    const isActive = i === s.activeLetter
    const isFaded = s.fadePlain?.includes(i) ?? false
    const isDim = s.dimPlain?.includes(i) ?? false
    objects.push({
      id: `pt-${i}`,
      kind: 'box',
      position: ptPos(i),
      size: [1.3, 1.3, 1.3],
      tone: isActive ? 'active' : 'plaintext',
      emphasize: isActive,
      scale: isActive ? [1.25, 1.25, 1.25] : [1, 1, 1],
      opacity: isFaded ? 0.35 : 1,
    })
    objects.push({
      id: `ptg-${i}`,
      kind: 'glyph',
      position: [ptPos(i)[0], 1.95, ptPos(i)[2]],
      label: info.letters[i].plain,
      glyphScale: 1,
      tone: isActive ? 'active' : isDim ? 'muted' : 'plaintext',
    })
  }

  // Ciphertext cubes on the far side (revealed progressively).
  for (let i = 0; i < n; i++) {
    const revealed = s.revealed?.includes(i) ?? false
    objects.push({
      id: `ot-${i}`,
      kind: 'box',
      position: otPos(i),
      size: [1.3, 1.3, 1.3],
      tone: 'output',
      visible: revealed,
      emphasize: revealed,
    })
    objects.push({
      id: `otg-${i}`,
      kind: 'glyph',
      position: [otPos(i)[0], 1.95, otPos(i)[2]],
      label: info.letters[i].mapped,
      glyphScale: 1,
      tone: 'output',
      visible: revealed,
    })
  }

  // Shift path arcs (one per letter, exposed on demand).
  for (let i = 0; i < n; i++) {
    const visible = (s.arcVisible ?? false) && i === s.activeLetter
    objects.push({
      id: `arc-${i}`,
      kind: 'arc',
      position: [0, 0, 0],
      points: arcPoints(info.letters[i].value, sign, info.k),
      ringTube: 0.16,
      tone: 'transform',
      visible,
      emphasize: visible,
    })
  }

  // Plaintext → ring arrows.
  for (let i = 0; i < n; i++) {
    const visible = s.ptArrows?.includes(i) ?? false
    const from = ptPos(i)
    const to = ringPoint(info.letters[i].value, RING_R, 1.05)
    objects.push({
      id: `ptar-${i}`,
      kind: 'arrow',
      position: [0, 0, 0],
      from: [from[0], 0.3, from[2]],
      to,
      tone: 'path',
      visible,
    })
  }

  // Ring → ciphertext arrows.
  for (let i = 0; i < n; i++) {
    const visible = s.otArrows?.includes(i) ?? false
    const to = otPos(i)
    const from = ringPoint(info.letters[i].mappedVal, RING_R, 1.05)
    objects.push({
      id: `otar-${i}`,
      kind: 'arrow',
      position: [0, 0, 0],
      from,
      to: [to[0], 0.3, to[2]],
      tone: 'output',
      visible,
    })
  }

  // Traveler — glides along the ring between source and target.
  const activeIdx = s.activeLetter ?? -1
  const travelerVisible = (s.travelerVisible ?? false) && activeIdx >= 0 && activeIdx < n
  if (travelerVisible) {
    const letter = info.letters[activeIdx]
    const fromIdx = letter.value
    objects.push({
      id: 'traveler',
      kind: 'sphere',
      position: [0, TRAVELER_Y, 0],
      size: [0.48, 0.48, 0.48],
      tone: s.travelerAt === 'target' ? 'complete' : 'active',
      emphasize: true,
      orbit: {
        center: [0, 0, 0],
        radius: TRAVELER_R,
        y: TRAVELER_Y,
        fromAngle: angleOf(fromIdx),
        // Unwrapped angle so wrapping letters travel the short path in the
        // shift direction (e.g. Y → B travels +3 forward through Z, A).
        toAngle: s.travelerAt === 'target' ? angleOf(fromIdx + sign * info.k) : angleOf(fromIdx),
      },
    })
  }

  // Final overview arrow from plaintext side to ciphertext side.
  objects.push({
    id: 'result-arrow',
    kind: 'arrow',
    position: [0, 0, 0],
    from: [0, 2.4, PT_R + 0.4],
    to: [0, 2.4, -(PT_R + 0.4)],
    tone: 'transform',
    visible: s.resultArrow ?? false,
  })

  return objects
}

function arcPoints(sourceIndex: number, sign: number, k: number): Vec3[] {
  const toIdx = sourceIndex + (sign >= 0 ? 1 : -1) * k
  const points: Vec3[] = []
  const STEPS = 64
  for (let f = 0; f <= 1; f += 1 / STEPS) {
    const idx = sourceIndex + (toIdx - sourceIndex) * f
    const a = (idx / 26) * TAU
    points.push([ARC_R * Math.cos(a), ARC_Y, ARC_R * Math.sin(a)])
  }
  return points
}

function baseGlyphs(): RingGlyph[] {
  return Array.from({ length: 26 }, () => ({ tone: 'muted' as const }))
}

export const caesar3DAdapter: Simulation3DAdapter = {
  id: 'caesar',
  nameKey: 'simulation3d.caesar.name',
  educationalKey: 'simulation3d.caesar.educational',
  demoInputs: { text: 'HELLO', shift: 3 },
  defaultCamera: DEFAULT_CAMERA,

  getLegend(): LegendEntry[] {
    return [
      { id: 'plaintext', labelKey: 'simulation3d.legend.input', tone: 'plaintext' },
      { id: 'key', labelKey: 'simulation3d.legend.key', tone: 'key' },
      { id: 'path', labelKey: 'simulation3d.legend.path', tone: 'transform' },
      { id: 'active', labelKey: 'simulation3d.legend.active', tone: 'active' },
      { id: 'output', labelKey: 'simulation3d.legend.output', tone: 'output' },
    ]
  },

  buildSteps(ctx: Simulation3DContext): Simulation3DStep[] {
    const decrypt = ctx.operation === 'decrypt'
    const text = String(ctx.inputs.text ?? '')
    const shift = Number.isFinite(Number(ctx.inputs.shift)) ? Number(ctx.inputs.shift) : 3
    const { chars, k } = caesarChars(text, shift, decrypt)

    const usable = chars.filter((c) => c.note !== 'ignored')
    const fullOut = usable.map((c) => c.mapped.toUpperCase()).join('')
    const truncated = usable.length > MAX_LETTERS

    const letters: LetterInfo[] = usable
      .slice(0, MAX_LETTERS)
      .map((c): LetterInfo => {
        const mapped = c.mapped.toUpperCase()
        return {
          plain: c.plain.toUpperCase(),
          value: c.value,
          mapped,
          mappedVal: ALPHABET.indexOf(mapped),
        }
      })

    const sign = decrypt ? -1 : 1
    const info: SceneInfo = { letters, k, sign }
    const steps: Simulation3DStep[] = []
    const n = letters.length

    // Guard: only whitespace/punctuation → minimal overview scene.
    if (n === 0) {
      steps.push({
        id: 'caesar3d-empty',
        titleKey: 'simulation3d.caesar.intro.title',
        descKey: 'simulation3d.caesar.intro.desc',
        descArgs: { k },
        phase: 'input',
        objects: buildScene({ ...info, letters: [] }, { keyOn: true }),
        camera: DEFAULT_CAMERA,
        duration: 0,
      })
      return steps
    }

    const phases: Record<string, Sim3DPhase> = {
      intro: 'input',
      key: 'key',
      ring: 'internal',
      select: 'transform',
      move: 'transform',
      result: 'output',
    }

    const introGlyphs = baseGlyphs()
    const intro: SceneState = { glyphs: introGlyphs, keyOn: true }

    steps.push({
      id: 'caesar3d-intro',
      titleKey: 'simulation3d.caesar.intro.title',
      descKey: 'simulation3d.caesar.intro.desc',
      descArgs: { k },
      phase: phases.intro,
      objects: buildScene(info, intro),
      camera: DEFAULT_CAMERA,
      duration: 900,
    })

    steps.push({
      id: 'caesar3d-key',
      titleKey: 'simulation3d.caesar.key.title',
      descKey: 'simulation3d.caesar.key.desc',
      descArgs: { k },
      phase: phases.key,
      objects: buildScene(info, { ...intro, keyOn: true }),
      duration: 700,
    })

    steps.push({
      id: 'caesar3d-ring',
      titleKey: 'simulation3d.caesar.ring.title',
      descKey: 'simulation3d.caesar.ring.desc',
      descArgs: { k, signed: sign > 0 ? `+${k}` : `−${k}` },
      phase: phases.ring,
      objects: buildScene(info, { ...intro, ringEmphasize: true }),
      duration: 900,
    })

    const revealed: number[] = []
    const dashed: number[] = []

    for (let i = 0; i < n; i++) {
      const li = letters[i]
      const signed = sign > 0 ? `+${k}` : `−${k}`

      const selectGlyphs = baseGlyphs()
      selectGlyphs[li.value].tone = 'active'
      selectGlyphs[li.value].emphasize = true

      steps.push({
        id: `caesar3d-l${i}-select`,
        titleKey: 'simulation3d.caesar.select.title',
        descKey: 'simulation3d.caesar.select.desc',
        titleArgs: { ch: li.plain },
        descArgs: { ch: li.plain, i: li.value, j: li.mappedVal, k: signed },
        phase: phases.select,
        objects: buildScene(info, {
          glyphs: selectGlyphs,
          keyOn: true,
          activeLetter: i,
          travelerVisible: true,
          travelerAt: 'source',
          arcVisible: true,
          ptArrows: [i],
          dimPlain: dashed,
        }),
        duration: 900,
      })

      revealed.push(i)

      const moveGlyphs = baseGlyphs()
      moveGlyphs[li.mappedVal].tone = 'complete'
      moveGlyphs[li.mappedVal].emphasize = true

      steps.push({
        id: `caesar3d-l${i}-move`,
        titleKey: 'simulation3d.caesar.move.title',
        descKey: 'simulation3d.caesar.move.desc',
        titleArgs: { ch: li.plain, cipher: li.mapped },
        descArgs: { ch: li.plain, i: li.value, j: li.mappedVal, k: signed, cipher: li.mapped },
        phase: phases.move,
        objects: buildScene(info, {
          glyphs: moveGlyphs,
          keyOn: true,
          activeLetter: i,
          travelerVisible: true,
          travelerAt: 'target',
          arcVisible: true,
          revealed: revealed.slice(),
          otArrows: [i],
          fadePlain: [i],
          dimPlain: dashed,
        }),
        duration: 1100,
      })

      dashed.push(i)
    }

    const finalGlyphs = baseGlyphs()
    steps.push({
      id: 'caesar3d-result',
      titleKey: 'simulation3d.caesar.result.title',
      descKey: 'simulation3d.caesar.result.desc',
      descArgs: { out: fullOut },
      phase: phases.result,
      objects: [
        ...buildScene(info, {
          glyphs: finalGlyphs,
          keyOn: true,
          revealed: revealed.slice(),
          resultArrow: true,
        }),
        ...valuePlate('caesar-full', [0, -2.8, 12.4], 'ciphertext', fullOut || '·', 'output', { emphasize: true }),
        ...(truncated
          ? valuePlate('caesar-note', [0, -4.7, 8.4], 'note', `ring shows the first ${MAX_LETTERS} letters · ${usable.length} letters total`, 'muted')
          : []),
      ],
      duration: 900,
    })

    return steps
  },
}
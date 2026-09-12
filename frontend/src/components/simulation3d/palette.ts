import type { Sim3DTone } from './types/simulation3d'

/**
 * Theme palette for the 3D scene, read from the existing design tokens
 * (styles/theme.css). The scene consumes the application theme — no separate
 * 3D theming system is introduced.
 */
export interface Simulation3DPalette {
  background: string
  gridLine: string
  gridCenter: string
  text: string
  tones: Record<Sim3DTone, string>
}

/** CSS variable used for every tone role. */
const TONE_VARS: Record<Sim3DTone, string> = {
  input: '--simulation-input',
  plaintext: '--simulation-plaintext',
  key: '--simulation-key',
  internal: '--cyan',
  transform: '--simulation-transform',
  output: '--simulation-output',
  active: '--simulation-active',
  complete: '--simulation-complete',
  muted: '--text-faint',
  path: '--primary',
  error: '--danger',
  warning: '--warning',
}

/** Robust fallbacks used when a token cannot be resolved. */
const TONE_FALLBACK: Record<Sim3DTone, string> = {
  input: '#86b7ff',
  plaintext: '#a9d3ff',
  key: '#f5c07a',
  internal: '#22d3ee',
  transform: '#6ee7b7',
  output: '#c4b5fd',
  active: '#38bdf8',
  complete: '#34d399',
  muted: '#5f7796',
  path: '#38bdf8',
  error: '#f87171',
  warning: '#fbbf24',
}

function cssVar(name: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return v.length > 0 ? v : fallback
  } catch {
    return fallback
  }
}

/** Extract a hex color from a possible `rgb(...)`/`rgba(...)` CSS value. */
export function parseCssColor(value: string, fallback: string): string {
  const match3 = value.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (match3) {
    const [r, g, b] = match3.slice(1).map((n) => Number(n))
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
  }
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value
  return fallback
}

/** Read the current theme palette directly from the DOM tokens. */
export function readCurrentPalette(): Simulation3DPalette {
  const bg = cssVar('--bg-deep', '#0b1728')
  const gridRaw = cssVar('--simulation-grid', 'rgba(147, 184, 228, 0.12)')
  const grid = parseCssColor(gridRaw, '#93b8e4')
  const text = cssVar('--text-faint', '#5f7796')

  const tones = {} as Record<Sim3DTone, string>
  for (const tone of Object.keys(TONE_VARS) as Sim3DTone[]) {
    tones[tone] = cssVar(TONE_VARS[tone], TONE_FALLBACK[tone])
  }

  return { background: bg, gridLine: grid, gridCenter: grid, text, tones }
}

/** Convert a CSS hex color into `THREE.Color` accepts both. */
export function colorOf(palette: Simulation3DPalette, tone: Sim3DTone | undefined, fallback: Sim3DTone): string {
  return palette.tones[tone ?? fallback]
}
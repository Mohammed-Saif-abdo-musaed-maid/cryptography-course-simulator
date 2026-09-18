// Vertical concept pipeline for signature / construction flows. The scene is
// built from REAL algorithm values only: each step reveals the pipeline up to
// the current trace state and the active stage carries a real value (or an
// honest placeholder when the backend value is not bound yet).
import type { ResolvedObject3D, Sim3DTone } from '../types/simulation3d'
import { arrow, plate, valuePlate } from './scene'

export interface PipelineSlot {
  key: string
  label: string
  tone: Sim3DTone
}

export interface PipelineLayout {
  yTop: number
  stepY: number
  x: number
}

export const PIPELINE_LAYOUT: PipelineLayout = { yTop: 2.9, stepY: 1.45, x: 0 }

/**
 * Stacked labeled stages laid out along Y (top = first concept). `revealCount`
 * shows the concepts reached so far; the newest slot is emphasized. Objects not
 * yet reached are emitted with visible=false so the absolute keyframe framing
 * (camera) stays stable while the pipeline grows.
 */
export function verticalPipeline(
  idPrefix: string,
  slots: PipelineSlot[],
  revealCount: number,
  opts: Partial<PipelineLayout> = {},
): ResolvedObject3D[] {
  const { yTop, stepY, x } = { ...PIPELINE_LAYOUT, ...opts }
  const objects: ResolvedObject3D[] = []
  slots.forEach((slot, i) => {
    const visible = i < revealCount
    objects.push(
      ...plate(
        `${idPrefix}-s${i}`,
        [x, yTop - i * stepY, 0],
        slot.label,
        i === revealCount - 1 ? 'active' : slot.tone,
        { visible },
      ),
    )
  })
  for (let i = 0; i < slots.length - 1; i++) {
    if (i + 1 < revealCount) {
      objects.push(arrow(`${idPrefix}-a${i}`, [x, yTop - i * stepY - 0.7, 0], [x, yTop - (i + 1) * stepY + 0.7, 0], 'path'))
    }
  }
  return objects
}

/** Real-value display for the active slot, or an honest "educational representation". */
export function activeValuePlate(
  id: string,
  slotIndex: number,
  label: string,
  value: string,
  tone: Sim3DTone,
  opts: Partial<PipelineLayout> & { xOffset?: number } = {},
): ResolvedObject3D[] {
  const { yTop, stepY, x, xOffset } = { xOffset: 2.6, ...PIPELINE_LAYOUT, ...opts }
  return valuePlate(id, [x + xOffset, yTop - slotIndex * stepY, 0], label, value || '—', tone, {
    emphasize: true,
  })
}
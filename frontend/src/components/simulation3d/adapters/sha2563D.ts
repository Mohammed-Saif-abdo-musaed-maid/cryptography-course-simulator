import { sha256Engine } from '../../simulation/renderers/sha256'
import { arrow, gridObject, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { msgInputScene, padRowsScene, roundRingScene, wordLaneScene } from './hash3d'

export const sha256Adapter: Simulation3DAdapter = createAdapterFromEngine(
  sha256Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'sha256-input':
        return msgInputScene(String(v.text ?? ''), String(v.hex ?? ''))
      case 'sha256-padding': {
        return [
          ...padRowsScene((v.blocksHex as string[]) ?? [], Number(v.msgLen ?? 0)),
          ...valuePlate('padcap', [0, 1.6, -4.4], 'padding', `${Number(v.blockCount)} block(s) · ${Number(v.padBytes)} pad bytes`, 'key'),
        ]
      }
      case 'sha256-schedule': {
        const schedule = (v.schedule as string[]) ?? []
        const rows: string[][] = []
        for (let i = 0; i < schedule.length; i += 8) rows.push(schedule.slice(i, i + 8))
        return [
          gridObject(
            'schedule',
            rows.map((r) => r.map((w) => ({ label: w.toUpperCase(), tone: 'internal' }))),
            { cellSize: 1.35, gap: 0.12, labelScale: 0.85, height: 1.5 },
          ),
          ...valuePlate('schedule-cap', [0, 2.4, -4.6], 'message schedule', 'W[0..63] · 8×8', 'internal'),
        ]
      }
      case 'sha256-rounds': {
        const rounds = (v.rounds ?? []) as Array<{ t: number; state: string[]; t1?: string; t2?: string; w: string }>
        const samples = (v.samples as number[]) ?? []
        const objs: ResolvedObject3D[] = roundRingScene('sha256-rt', rounds.length, { samples })
        rounds
          .filter((r) => samples.includes(r.t))
          .forEach((r, i) => {
            const x = (i - (Math.min(samples.length, 3) - 1) / 2) * 4.6
            objs.push(
              ...valuePlate(`rs${i}`, [x, 1.25, 3.2], `round t = ${r.t}`, `W=${r.w}`, 'internal'),
              ...wordLaneScene(`rs${i}-st`, r.state, 'transform', [x - 2, -0.7, 3.2]),
            )
          })
        return objs
      }
      case 'sha256-final': {
        const hInit = (v.hInit as string[]) ?? []
        const hFinal = (v.hFinal as string[]) ?? []
        const digest = String(v.digest ?? '')
        return [
          ...wordLaneScene('h0', hInit, 'input', [0, 0.4, -4.8]),
          arrow('f1', [0, 0.5, -3.4], [0, 0.5, -1.6], 'path'),
          ...wordLaneScene('h1', hFinal, 'transform', [0, 0.4, 0]),
          arrow('f2', [0, 0.5, 1.4], [0, 0.5, 3.2], 'path'),
          ...hexStrip('dig', digest.toUpperCase(), 'output', [0, 0.55, 4.4], { piece: 2, cellSize: 0.44, gap: 0.026 }).objects,
          ...valuePlate('hstate', [0, 2.9, -4.6], 'state', 'h0 · h1 · … · h7', 'input'),
        ]
      }
      default:
        return []
    }
  },
)
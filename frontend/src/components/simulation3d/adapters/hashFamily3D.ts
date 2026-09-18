import type { SimulationEngine } from '../../simulation/simulationTypes'
import { ripemd160Engine, sha224Engine, sha384Engine } from '../../simulation/renderers/hashFamily'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { arrow, valuePlate } from './scene'
import { createAdapterFromEngine } from './from2d'
import { digestScene, msgInputScene, padRowsScene, roundRingScene, wordLaneScene } from './hash3d'

function makeHash3DAdapter(engine: SimulationEngine): Simulation3DAdapter {
  const id = engine.id
  const msgBytesPerBlock = id === 'sha384' ? 128 : 64
  return createAdapterFromEngine(engine, (stage) => {
    const v = stage.view
    switch (v.kind) {
      case `${id}-input`:
        return msgInputScene(String(v.text ?? ''), String(v.hex ?? ''))
      case `${id}-padding`:
        return [
          ...padRowsScene((v.blocksHex as string[]) ?? [], Number(v.msgLen ?? 0), { msgBytesPerBlock }),
          ...valuePlate('padcap', [0, 1.9, -4.8], 'padding', `${Number(v.blockCount)} block(s) · ${Number(v.padBytes)} pad bytes`, 'key'),
        ]
      case `${id}-rounds`: {
        const lines = Number(v.lines ?? 1)
        const rounds = Number(v.rounds ?? 0)
        const objs: ResolvedObject3D[] = []
        if (lines === 2) {
          objs.push(...roundRingScene(`${id}-left`, rounds, { radius: 4.4, note: 'left line · 40 rounds' }))
          objs.push(...roundRingScene(`${id}-right`, rounds, { radius: 4.4, note: 'right line · 40 rounds', tone: 'transform' }))
        } else {
          objs.push(...roundRingScene(`${id}-rt`, rounds, { note: `${rounds} compression rounds` }))
        }
        return objs
      }
      case `${id}-digest`: {
        const iv = (v.iv as string[]) ?? []
        const digest = String(v.digest ?? '')
        const objs: ResolvedObject3D[] = []
        if (iv.length > 0) {
          objs.push(...wordLaneScene(`${id}-iv`, iv, 'input', [0, -1.6, -5]))
          objs.push(arrow(`${id}-ivf`, [0, 0.2, -3.9], [0, 0.2, -2], 'path'))
        }
        objs.push(
          ...digestScene(digest, `${String(v.deco ?? engine.id)} · ${Number(v.digestBits)} bits`),
        )
        return objs
      }
      default:
        return []
    }
  })
}

export const sha224Adapter = makeHash3DAdapter(sha224Engine)
export const sha384Adapter = makeHash3DAdapter(sha384Engine)
export const ripemd160Adapter = makeHash3DAdapter(ripemd160Engine)
import { blake3Engine } from '../../simulation/renderers/blake3'
import { valuePlate, xPositions } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { byteCountScene, digestScene, msgInputScene, wordLaneScene } from './hash3d'

export const blake3Adapter: Simulation3DAdapter = createAdapterFromEngine(
  blake3Engine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'blake3-input':
        return [
          ...msgInputScene(String(v.text ?? ''), String(v.hex ?? '')),
          ...valuePlate('olen', [0, 2.6, 4.2], 'output length', `${Number(v.length)} bytes (XOF)`, 'key'),
        ]
      case 'blake3-chunks': {
        const ranges = (v.ranges as string[]) ?? []
        const chunkCount = Math.max(1, Number(v.chunkCount ?? 1))
        const objs: ResolvedObject3D[] = []
        const span = Math.min(18, Math.max(5, chunkCount * 3))
        ranges.forEach((range, i) => {
          const [x, , z] = xPositions(chunkCount, span)[i]
          objs.push(
            ...valuePlate(`chunk-${i}`, [x, 0.4, z], `chunk ${i}`, `b[${range}]`, 'transform'),
          )
        })
        objs.push(
          ...valuePlate('chunks-cap', [0, 2.6, -3.4], 'chunks', `${chunkCount} chunk(s) of up to 1024 bytes`, 'internal'),
        )
        return objs
      }
      case 'blake3-tree': {
        const levels = (v.levels as number[]) ?? []
        const rootCv = (v.rootCv as string[]) ?? []
        const objs: ResolvedObject3D[] = []
        const last = levels.length - 1
        levels.forEach((count, li) => {
          const y = li * 1.7 + 0.3
          const span = Math.max(3, count * 2.2)
          const positions = xPositions(count, span, y)
          const tone = li === last ? 'output' : li === 0 ? 'internal' : 'transform'
          positions.forEach((p, ci) => {
            objs.push({
              id: `tree-${li}-${ci}`,
              kind: 'sphere',
              position: [p[0], y, p[2]],
              size: [li === last ? 0.62 : 0.42, li === last ? 0.62 : 0.42, li === last ? 0.62 : 0.42],
              tone,
              emphasize: li === last,
            })
          })
        })
        if (rootCv.length) {
          objs.push(...wordLaneScene('root-cv', rootCv, 'output', [0, 0.4, -3.2]))
          objs.push(...valuePlate('rootcap', [0, 2.4, -3.4], 'root chaining value', rootCv.length > 1 ? `${rootCv[0].toUpperCase()} … +${rootCv.length - 1} more` : rootCv[0].toUpperCase(), 'internal'))
        }
        return objs
      }
      case 'blake3-xof':
        return byteCountScene('xof', 64, Number(v.length ?? 32), `first ${Number(v.length)} bytes`)
      case 'blake3-digest': {
        if (!Boolean(v.hasResult)) {
          return valuePlate('dg', [0, 0.5, 0], 'digest', '—', 'muted')
        }
        return digestScene(String(v.digest ?? ''), 'BLAKE3')
      }
      default:
        return []
    }
  },
)
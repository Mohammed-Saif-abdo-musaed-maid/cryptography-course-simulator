import { ecdhEngine } from '../../simulation/renderers/ecdh'
import { arrow, hexStrip, valuePlate } from './scene'
import type { ResolvedObject3D, Simulation3DAdapter } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'

interface CurveField {
  name: string
  value: string
}

export const ecdhAdapter: Simulation3DAdapter = createAdapterFromEngine(
  ecdhEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'ecdh-curve': {
        const fields = (v.fields as CurveField[]) ?? []
        const pts = curveHint()
        const objs: ResolvedObject3D[] = [
          {
            id: 'curve-hint',
            kind: 'arc',
            position: [0, 0, 0],
            points: pts,
            ringTube: 0.14,
            tone: 'path',
          },
          {
            id: 'base-G',
            kind: 'sphere',
            position: [2.4, 1.2, -1.2],
            size: [0.55, 0.55, 0.55],
            tone: 'active',
            emphasize: true,
          },
          ...valuePlate('bglabel', [2.4, 2.5, -0.4], 'G', 'base point', 'key'),
        ]
        fields.slice(0, 6).forEach((f, i) => {
          const col = i % 2
          const row = Math.floor(i / 2)
          const x = -6 + col * 12
          const z = -2.6 + row * 4.6
          const val = f.value.length > 18 ? `${f.value.slice(0, 18)}…` : f.value
          objs.push(...valuePlate(`f${i}`, [x, -0.3, z], f.name, val, 'internal'))
        })
        objs.push(
          ...valuePlate('sec', [6.4, 4, 4.6], 'security', `~${String(v.security ?? '')} bits`, 'muted'),
          ...valuePlate('note', [-5, 4.4, 4.6], 'full constants', 'see the 2D lab for exact hex', 'muted'),
        )
        return objs
      }
      case 'ecdh-keys': {
        const aliceHex = v.aliceHex ? String(v.aliceHex) : null
        const bobHex = v.bobHex ? String(v.bobHex) : null
        return [
          ...agentCard('alice', [-7, 0, 0], [
            ...valuePlate('da', [-7, 1.6, -0.6], 'dA (private)', String(v.dA ?? ''), 'key'),
            arrow('a1', [-7, 0.6, 0.8], [-7, 0.6, 2.2], 'path'),
            ...valuePlate('Aa', [-7, 0.6, 4.4], 'public A', aliceHex ? `${aliceHex.slice(0, 24)}…` : 'dA·G', 'output'),
          ]),
          ...agentCard('bob', [7, 0, 0], [
            ...valuePlate('db', [7, 1.6, -0.6], 'dB (private)', String(v.dB ?? ''), 'key'),
            arrow('b1', [7, 0.6, 0.8], [7, 0.6, 2.2], 'path'),
            ...valuePlate('Bb', [7, 0.6, 4.4], 'public B', bobHex ? `${bobHex.slice(0, 24)}…` : 'dB·G', 'output'),
          ]),
          arrow('wire', [-2, 0.4, 0], [2, 0.4, 0], 'path'),
          ...valuePlate('op', [0, 2.2, 0], 'keygen', 'A = dA·G · B = dB·G', 'transform'),
        ]
      }
      case 'ecdh-exchange': {
        const aliceHex = v.aliceHex ? String(v.aliceHex) : null
        const bobHex = v.bobHex ? String(v.bobHex) : null
        return [
          ...agentCard('alice', [-7, 0, 0], valuePlate('Aex', [-7, 0.7, 1], 'public A →', aliceHex ? `${aliceHex.slice(0, 16)}…` : 'A', 'output')),
          ...agentCard('bob', [7, 0, 0], valuePlate('Bex', [7, 0.7, 1], '→ public B', bobHex ? `${bobHex.slice(0, 16)}…` : 'B', 'output')),
          arrow('wa', [-4.4, 0.4, -0.8], [-2.6, 0.4, -0.8], 'path'),
          arrow('wb', [2.6, 0.4, 0.8], [4.4, 0.4, 0.8], 'path'),
          ...valuePlate('chan', [0, 2.6, -1], 'channel', 'only public points cross the wire', 'muted'),
          ...valuePlate('note', [0, 1, 3.4], 'note', 'eavesdropper cannot recover dA / dB', 'muted'),
        ]
      }
      case 'ecdh-shared': {
        const shared = v.shared ? String(v.shared) : null
        return [
          ...agentCard('alice', [-7, 0, 0], valuePlate('Sa', [-7, 0.7, 1], 'S = dA·B', shared ? `${shared.slice(0, 32)}…` : 'dA·B', 'output')),
          ...agentCard('bob', [7, 0, 0], valuePlate('Sb', [7, 0.7, 1], 'S = dB·A', shared ? `${shared.slice(0, 32)}…` : 'dB·A', 'output')),
          arrow('wa', [-4.4, 0.6, -0.6], [-2.6, 0.6, -0.6], 'path'),
          arrow('wb', [2.6, 0.6, 0.6], [4.4, 0.6, 0.6], 'path'),
          ...(shared
            ? [
                ...hexStrip('shared', shared.toUpperCase(), 'output', [0, 0.3, 3], { piece: 2, cellSize: 0.34, gap: 0.02 }).objects,
                ...valuePlate('sharedcap', [0, 2.4, 3], 'shared secret', 'equal x-coordinate on both sides', 'output'),
              ]
            : valuePlate('sharedcap', [0, 1.2, 3], 'shared secret', 'x-coordinate of dA·dB·G', 'output')),
        ]
      }
      default:
        return []
    }
  },
)

function curveHint(): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= 24; i++) {
    const t = -4 + i * (8 / 24)
    pts.push([t, 0.4 + 1.1 * Math.sin(t * 0.9), 1.8 - 0.28 * t * t / 4])
  }
  return pts
}

function agentCard(
  prefix: string,
  origin: [number, number, number],
  inner: ResolvedObject3D[],
): ResolvedObject3D[] {
  return [
    {
      id: `${prefix}-bg`,
      kind: 'box',
      position: [origin[0], -0.2, -3.6],
      size: [4.4, 0.16, 9],
      tone: prefix === 'alice' ? 'input' : 'key',
      opacity: 0.12,
    },
    ...inner,
  ]
}
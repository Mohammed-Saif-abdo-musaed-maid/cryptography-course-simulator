// DSA 3D scene. Every visible stage maps to a real backend trace state:
//   generate_keys → domain params → private x → public y (3 real states)
//   sign     → Message → Hash → nonce k → (r, s) → Signature (trace steps 1..3)
//   verify   → Signature → Hash → public check → verdict (trace steps 1..2)
// Real values (digest, r, s, signature, verdict) come from the execution-trace
// payloads; hidden values (x, k) are labelled honestly — never invented.
import { dsaEngine } from '../../simulation/renderers/dsa'
import type { Simulation3DAdapter, Sim3DTone } from '../types/simulation3d'
import { createAdapterFromEngine } from './from2d'
import { activeValuePlate, verticalPipeline, type PipelineSlot } from './pipeline'

const B = (v: unknown) => Boolean(v)

function trunc(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s
}

const EDU = 'Educational representation'

const SIGN_SLOTS: PipelineSlot[] = [
  { key: 'msg', label: 'MESSAGE', tone: 'input' },
  { key: 'hash', label: 'HASH', tone: 'transform' },
  { key: 'k', label: 'NONCE k (secret)', tone: 'key' },
  { key: 'rs', label: '(r, s) = (g^k mod p mod q, k⁻¹(H+x·r) mod q)', tone: 'internal' },
  { key: 'sig', label: 'SIGNATURE', tone: 'output' },
]

const VERIFY_SLOTS: PipelineSlot[] = [
  { key: 'sig', label: 'SIGNATURE', tone: 'output' },
  { key: 'hash', label: 'HASH', tone: 'transform' },
  { key: 'chk', label: 'PUBLIC CHECK v ≡ r (mod q)', tone: 'internal' },
  { key: 'vd', label: 'VERDICT', tone: 'output' },
]

const KEYGEN_SLOTS: PipelineSlot[] = [
  { key: 'params', label: 'DOMAIN PARAMS p, q, g', tone: 'internal' },
  { key: 'x', label: 'PRIVATE x (secret)', tone: 'key' },
  { key: 'y', label: 'PUBLIC y = g^x mod p', tone: 'output' },
]

export const dsa3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  dsaEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'dsa-keygen': {
        const kg = Number(v.kgStep ?? 1)
        const objs = verticalPipeline('dsa-kg', KEYGEN_SLOTS, kg)
        if (kg === 1)
          objs.push(...activeValuePlate('dsa-kg-params', 0, 'domain parameters', `p, q, g with q | p−1 (${String(v.keySize)} bits)`, 'internal'))
        if (kg === 2)
          objs.push(...activeValuePlate('dsa-kg-x', 1, 'private x', 'random in [1, q−1] — hidden', 'key'))
        if (kg === 3)
          objs.push(
            ...activeValuePlate('dsa-kg-y', 2, 'public key (PEM)', B(v.hasPub) ? trunc(String(v.pubPem), 40) : 'run generate_keys to bind', 'output'),
          )
        return objs
      }
      case 'dsa-hash': {
        const value = B(v.hasResult) && String(v.digestHex) ? String(v.digestHex) : `${EDU} — real digest after Run`
        return [
          ...verticalPipeline('dsa-s', SIGN_SLOTS, 2),
          ...activeValuePlate('dsa-s-msg', 0, 'message (input)', trunc(String(v.message), 32), 'input'),
          ...activeValuePlate('dsa-s-digest', 1, `H(m) digest (${String(v.hash)})`, trunc(value, 40), B(v.hasResult) ? 'transform' : 'muted'),
        ]
      }
      case 'dsa-params': {
        const hasRS = B(v.hasResult) && (String(v.rHex).length > 0 || String(v.sHex).length > 0)
        const rValue = hasRS ? trunc(String(v.rHex), 44) : `${EDU} — r = (g^k mod p) mod q`
        const sValue = hasRS ? trunc(String(v.sHex), 44) : `${EDU} — s = k⁻¹(H+x·r) mod q`
        const kValue = 'fresh secret per message — never reused'
        return [
          ...verticalPipeline('dsa-s', SIGN_SLOTS, 4),
          ...activeValuePlate('dsa-s-k', 2, 'nonce k', kValue, 'key'),
          ...activeValuePlate('dsa-s-r', 3, 'r (real)', rValue, hasRS ? 'internal' : 'muted'),
          ...activeValuePlate('dsa-s-s', 3, 's (real)', sValue, hasRS ? 'internal' : 'muted', { xOffset: -2.6 }),
        ]
      }
      case 'dsa-sign': {
        const hasSig = B(v.hasSig) && String(v.sigHex).length > 0
        const sigValue = hasSig ? trunc(String(v.sigHex), 44) : `${EDU} — DER (r, s) after Run`
        return [
          ...verticalPipeline('dsa-s', SIGN_SLOTS, 5),
          ...activeValuePlate('dsa-s-sig', 4, 'signature (DER hex)', sigValue, hasSig ? 'output' : 'muted'),
        ]
      }
      case 'dsa-vhash': {
        const value = B(v.hasResult) && String(v.digestHex) ? String(v.digestHex) : `${EDU} — real digest after Run`
        return [
          ...verticalPipeline('dsa-v', VERIFY_SLOTS, 2),
          ...activeValuePlate('dsa-v-digest', 1, `recomputed H(m) (${String(v.hash)})`, trunc(value, 40), B(v.hasResult) ? 'transform' : 'muted'),
        ]
      }
      case 'dsa-verify': {
        const verdict = B(v.hasResult) ? String(v.verdict) || '—' : 'run verify'
        const verdictTone: Sim3DTone =
          String(v.verdict) === 'VALID' ? 'output' : String(v.verdict) === 'INVALID' ? 'error' : 'muted'
        return [
          ...verticalPipeline('dsa-v', VERIFY_SLOTS, 4),
          ...activeValuePlate('dsa-v-chk', 2, 'recompute', 'w = s⁻¹, u₁ = H(m)·w, u₂ = r·w, v = (g^u₁·y^u₂ mod p) mod q', 'internal'),
          ...activeValuePlate('dsa-v-vd', 3, 'verdict', verdict, verdictTone),
        ]
      }
      default:
        return []
    }
  },
  {
    getLegend: () => [
      { id: 'input', labelKey: 'simulation3d.legend.input', tone: 'input' },
      { id: 'key', labelKey: 'simulation3d.legend.key', tone: 'key' },
      { id: 'transform', labelKey: 'simulation3d.legend.transform', tone: 'transform' },
      { id: 'internal', labelKey: 'simulation3d.legend.internal', tone: 'internal' },
      { id: 'output', labelKey: 'simulation3d.legend.output', tone: 'output' },
      { id: 'muted', labelKey: 'simulation3d.legend.muted', tone: 'muted' },
    ],
  },
)
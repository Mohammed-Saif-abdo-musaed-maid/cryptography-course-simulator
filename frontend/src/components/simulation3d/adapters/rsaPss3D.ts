// RSA-PSS 3D scene. Every visible stage maps to a real backend trace state:
//   generate_keys → primes → e → private d → exported keys (4 real states)
//   sign          → Message → Hash → PSS Encoding → EM → RSA private → Signature (trace steps 1..3)
//   verify        → Signature → RSA public → EM′ → PSS verify → hash compare → verdict (trace steps 1..3)
// Real values (digest, EM, trailer, salt, signature, verdict) come from the
// execution-trace payloads; values the backend cannot expose byte-wise are
// labelled honestly as "Educational representation" — never invented numbers.
import { rsaPssEngine } from '../../simulation/renderers/rsaPss'
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
  { key: 'pss', label: 'PSS ENCODING (EMSA-PSS)', tone: 'internal' },
  { key: 'em', label: 'ENCODED MESSAGE (EM)', tone: 'internal' },
  { key: 'priv', label: 'RSA PRIVATE s = EM^d mod n', tone: 'key' },
  { key: 'sig', label: 'SIGNATURE', tone: 'output' },
]

const VERIFY_SLOTS: PipelineSlot[] = [
  { key: 'sig', label: 'SIGNATURE', tone: 'output' },
  { key: 'pub', label: 'RSA PUBLIC EM\u2032 = s^e mod n', tone: 'transform' },
  { key: 'em', label: 'ENCODED MESSAGE (EM\u2032)', tone: 'internal' },
  { key: 'pss', label: 'PSS VERIFY (decode salt + DB)', tone: 'internal' },
  { key: 'hc', label: 'HASH COMPARE (H(m) vs H column)', tone: 'transform' },
  { key: 'vd', label: 'VERDICT', tone: 'output' },
]

const KEYGEN_SLOTS: PipelineSlot[] = [
  { key: 'primes', label: 'PRIMES p, q  \u2192 n = p\u00b7q', tone: 'internal' },
  { key: 'e', label: 'PUBLIC EXPONENT e = 65537', tone: 'internal' },
  { key: 'd', label: 'PRIVATE d = e\u207b\u00b9 mod \u03bb(n)', tone: 'key' },
  { key: 'export', label: 'KEY PAIR EXPORTED', tone: 'output' },
]

function pipeScene(reveal: number, slots: PipelineSlot[], idPrefix: string) {
  return verticalPipeline(idPrefix, slots, reveal)
}

export const rsaPss3DAdapter: Simulation3DAdapter = createAdapterFromEngine(
  rsaPssEngine,
  (stage) => {
    const v = stage.view
    switch (v.kind) {
      case 'rsa_pss-keygen': {
        const kg = Number(v.kgStep ?? 1)
        const objs = pipeScene(kg, KEYGEN_SLOTS, 'pss-kg')
        if (kg === 1) objs.push(...activeValuePlate('pss-kg-mod', 0, `n = p·q (${String(v.keySize)} bits)`, B(v.hasPub) ? 'bound after Run — p, q never shown' : 'Educational representation — modulus n', 'internal'))
        if (kg === 4)
          objs.push(
            ...activeValuePlate('pss-kg-pub', 3, 'public key (PEM)', B(v.hasPub) ? trunc(String(v.pubPem), 40) : 'run generate_keys to bind', 'output'),
          )
        return objs
      }
      case 'rsa_pss-hash': {
        const value = B(v.hasResult) && String(v.digestHex) ? String(v.digestHex) : `${EDU} — real digest after Run`
        return [
          ...pipeScene(2, SIGN_SLOTS, 'pss-s'),
          ...activeValuePlate('pss-s-digest', 1, `H(m) digest (${String(v.hash)})`, trunc(value, 40), B(v.hasResult) ? 'transform' : 'muted'),
          ...activeValuePlate('pss-s-msg', 0, 'message (input)', trunc(String(v.message), 32), 'input'),
        ]
      }
      case 'rsa_pss-encode': {
        const hasEm = B(v.hasResult) && String(v.emHex).length > 0
        const emValue = hasEm ? trunc(String(v.emHex), 44) : `${EDU} — maskedDB ‖ H ‖ 0xBC`
        const saltValue = B(v.hasResult) && Number(v.saltBytes) > 0 ? `${Number(v.saltBytes)} bytes (emLen − HLen − 2)` : 'random salt — real after Run'
        return [
          ...pipeScene(4, SIGN_SLOTS, 'pss-s'),
          ...activeValuePlate('pss-s-em', 3, 'EM (encoded message)', emValue, hasEm ? 'internal' : 'muted'),
          ...activeValuePlate('pss-s-salt', 2, 'salt (random per signature)', saltValue, B(v.hasResult) ? 'key' : 'muted'),
          ...activeValuePlate('pss-s-trailer', 3, 'trailer 0xBC', B(v.hasResult) ? (B(v.emTrailer) ? 'confirmed' : '—') : 'real after Run', B(v.hasResult) ? 'output' : 'muted', { xOffset: -2.6 }),
        ]
      }
      case 'rsa_pss-sign': {
        const hasSig = B(v.hasSig) && String(v.sigHex).length > 0
        const sigValue = hasSig ? trunc(String(v.sigHex), 44) : `${EDU} — s = EM^d mod n (real after Run)`
        return [
          ...pipeScene(6, SIGN_SLOTS, 'pss-s'),
          ...activeValuePlate('pss-s-sig', 5, 'signature (DER hex)', sigValue, hasSig ? 'output' : 'muted'),
          ...activeValuePlate('pss-s-priv', 4, 'private d', 'd = e⁻¹ mod λ(n) — never displayed', 'key'),
        ]
      }
      case 'rsa_pss-vhash': {
        const value = B(v.hasResult) && String(v.digestHex) ? String(v.digestHex) : `${EDU} — real digest after Run`
        return [
          ...pipeScene(1, VERIFY_SLOTS, 'pss-v'),
          ...activeValuePlate('pss-v-digest', 0, `recomputed H(m) (${String(v.hash)})`, trunc(value, 40), B(v.hasResult) ? 'transform' : 'muted'),
        ]
      }
      case 'rsa_pss-vrecover': {
        const hasEm = B(v.hasResult) && String(v.emHex).length > 0
        const emValue = hasEm ? trunc(String(v.emHex), 44) : `${EDU} — EM′ after Run`
        return [
          ...pipeScene(3, VERIFY_SLOTS, 'pss-v'),
          ...activeValuePlate('pss-v-em', 2, 'EM′ = s^e mod n', emValue, hasEm ? 'internal' : 'muted'),
          ...activeValuePlate('pss-v-trailer', 2, 'trailer 0xBC', B(v.hasResult) ? (B(v.emTrailer) ? 'confirmed' : 'not found') : 'real after Run', B(v.hasResult) ? 'output' : 'muted'),
        ]
      }
      case 'rsa_pss-verify': {
        const verdict = B(v.hasResult) ? String(v.verdict) || '—' : 'run verify'
        const verdictTone: Sim3DTone =
          String(v.verdict) === 'VALID' ? 'output' : String(v.verdict) === 'INVALID' ? 'error' : 'muted'
        return [...pipeScene(6, VERIFY_SLOTS, 'pss-v'), ...activeValuePlate('pss-v-vd', 5, 'verdict', verdict, verdictTone)]
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
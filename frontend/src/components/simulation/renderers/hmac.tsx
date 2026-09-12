import type { ReactNode } from 'react'
import type { CharCell, SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { hmacSha256Detail, hexToBytes, strToBytes } from '../simulationShared'
import { CharRow } from '../common/CharRow'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'hmac'

const SHA_BLOCK: Record<string, number> = { sha256: 64, sha512: 128 }
const HASH_NAME: Record<string, string> = { sha256: 'SHA-256', sha512: 'SHA-512' }

const pad2 = (v: number): string => v.toString(16).padStart(2, '0')

const hexToNumbers = (hex: string): number[] => Array.from(hexToBytes(hex))

function hexCells(
  hex: string,
  tone: CharCell['tone'],
  cap: number,
  noteFn?: (b: number, i: number) => string,
): CharCell[] {
  const bytes = hexToNumbers(hex)
  const shown = bytes.slice(0, cap)
  const cells: CharCell[] = shown.map((b, i) => ({
    ch: pad2(b),
    tone,
    note: noteFn ? noteFn(b, i) : undefined,
  }))
  if (bytes.length > cap) cells.push({ ch: `+${bytes.length - cap}`, tone: 'muted' })
  return cells
}

function constantCells(constant: number, count: number, cap: number): CharCell[] {
  const cells: CharCell[] = Array.from({ length: Math.min(count, cap) }, (_, i) => ({
    ch: pad2(constant),
    tone: 'muted',
    note: `constant 0x${pad2(constant)} · byte ${i}`,
  }))
  if (count > cap) cells.push({ ch: `+${count - cap}`, tone: 'muted' })
  return cells
}

function xorCells(bytes: number[], constant: number, cap: number): CharCell[] {
  const shown = bytes.slice(0, cap)
  const cells: CharCell[] = shown.map((b, i) => ({
    ch: pad2(b ^ constant),
    tone: 'transform',
    note: `0x${pad2(b)} XOR 0x${pad2(constant)} = 0x${pad2(b ^ constant)} · byte ${i}`,
  }))
  if (bytes.length > cap) cells.push({ ch: `+${bytes.length - cap}`, tone: 'muted' })
  return cells
}

function HashBox({ title, tone, children }: { title: string; tone: CharCell['tone']; children: ReactNode }) {
  return (
    <div className={`lab-box tone-${tone}`}>
      <div className="lab-box-title mono">{title}</div>
      <div className="lab-box-body">{children}</div>
    </div>
  )
}

function backendString(ctx: SimulationContext, field: string): string {
  const extra = ctx.result?.extra
  const v = extra && typeof extra[field] === 'string' ? extra[field] : ctx.result?.result
  return typeof v === 'string' ? v : ''
}

export const hmacEngine: SimulationEngine = {
  id,
  nameKey: 'simulation.hmac.name',
  demoInputs: { message: 'Important message', key: 'super-secret-key' },
  educationalKey: 'simulation.hmac.educational',
  build(ctx) {
    const message = String(ctx.inputs.message ?? '')
    const key = String(ctx.inputs.key ?? '')
    const algorithm = String(ctx.inputs.algorithm ?? 'sha256')
    const isSha256 = algorithm === 'sha256'
    const block = SHA_BLOCK[algorithm] ?? 64
    const hashName = HASH_NAME[algorithm] ?? 'SHA-256'
    const live = isSha256 ? hmacSha256Detail(key, message) : null
    const boundMac = backendString(ctx, 'mac')
    const digest = live ? live.digest : boundMac
    const structural = !isSha256
    const keyLen = strToBytes(key).length
    const msgLen = strToBytes(message).length

    const stages: SimStage[] = [
      {
        id: `${id}-key`,
        titleKey: 'simulation.hmac.key.title',
        descKey: isSha256 ? 'simulation.hmac.key.desc' : 'simulation.hmac.key.descSha512',
        descArgs: { block, keyLen },
        phase: 'key',
        view: {
          kind: 'hmac-key',
          structural,
          hashName,
          block,
          keyLen,
          keyTooLong: isSha256 ? Boolean(live?.keyTooLong) : keyLen > block,
          keyPadded: live ? live.keyPadded : '',
        },
      },
      {
        id: `${id}-xor`,
        titleKey: 'simulation.hmac.xor.title',
        descKey: 'simulation.hmac.xor.desc',
        descArgs: { block },
        phase: 'internal',
        view: { kind: 'hmac-xor', structural, keyPadded: live ? live.keyPadded : '' },
      },
      {
        id: `${id}-inner`,
        titleKey: 'simulation.hmac.inner.title',
        descKey: 'simulation.hmac.inner.desc',
        descArgs: { msgLen, hashName },
        phase: 'internal',
        view: {
          kind: 'hmac-inner',
          structural,
          hashName,
          innerMsg: live ? live.innerMsg : '',
          innerDigest: live ? live.innerDigest : '',
        },
      },
      {
        id: `${id}-outer`,
        titleKey: 'simulation.hmac.outer.title',
        descKey: 'simulation.hmac.outer.desc',
        descArgs: { hashName, inputBytes: 64 + 32 },
        phase: 'transform',
        view: {
          kind: 'hmac-outer',
          structural,
          hashName,
          opad: live ? live.opad : '',
          innerDigest: live ? live.innerDigest : '',
          digest,
        },
      },
      {
        id: `${id}-result`,
        titleKey: 'simulation.hmac.result.title',
        descKey: 'simulation.hmac.result.desc',
        descArgs: { digest: digest || '—' },
        phase: 'output',
        view: { kind: 'hmac-result', structural, digest },
      },
    ]
    return stages
  },
  View({ view }: { view: SimView; ctx: SimulationContext }) {
    switch (view.kind) {
      case 'hmac-key': {
        const structural = Boolean(view.structural)
        const keyLen = Number(view.keyLen)
        const keyTooLong = Boolean(view.keyTooLong)
        const keyPadded = String(view.keyPadded)
        const hashName = String(view.hashName)
        const block = Number(view.block)
        return (
          <div className="lab-stage-view">
            <DataBlock label="key (bytes)" value={String(keyLen)} tone="key" />
            {structural ? (
              <>
                <DataBlock label="K0" value={`${hashName} · ${block}-byte block`} tone="key" big />
                {keyTooLong && (
                  <p className="lab-note">
                    key length {keyLen} &gt; {block}: the key is hashed once to {hashName === 'SHA-512' ? 64 : 32}{' '}
                    bytes before padding
                  </p>
                )}
              </>
            ) : (
              <>
                <CharRow label="K0" size="sm" cells={hexCells(keyPadded, 'key', 32)} />
                {keyTooLong && (
                  <p className="lab-note">key length {keyLen} &gt; {block}: the key is hashed to 32 bytes once</p>
                )}
              </>
            )}
          </div>
        )
      }
      case 'hmac-xor': {
        const structural = Boolean(view.structural)
        const keyPadded = String(view.keyPadded)
        if (structural) {
          return (
            <div className="lab-stage-view">
              <DataBlock label="inner key" value="K0 XOR ipad (0x36)" tone="internal" />
              <FlowArrow />
              <DataBlock label="outer key" value="K0 XOR opad (0x5c)" tone="internal" />
            </div>
          )
        }
        const padded = hexToNumbers(keyPadded)
        return (
          <div className="lab-stage-view">
            <CharRow label="K0" size="sm" cells={hexCells(keyPadded, 'key', 32)} />
            <CharRow label="ipad" size="sm" cells={constantCells(0x36, padded.length, 32)} />
            <CharRow label="XOR ipad" size="sm" cells={xorCells(padded, 0x36, 32)} />
            <FlowArrow op="inner key" />
            <CharRow label="opad" size="sm" cells={constantCells(0x5c, padded.length, 32)} />
            <CharRow label="XOR opad" size="sm" cells={xorCells(padded, 0x5c, 32)} />
            <FlowArrow op="outer key" />
          </div>
        )
      }
      case 'hmac-inner': {
        const structural = Boolean(view.structural)
        const innerMsg = String(view.innerMsg)
        const innerDigest = String(view.innerDigest)
        const hashName = String(view.hashName)
        if (structural) {
          return (
            <div className="lab-stage-view">
              <DataBlock label="input" value="(K0 XOR ipad) || message" tone="input" />
              <FlowArrow />
              <DataBlock label="inner digest" value="bound from execution" tone="internal" />
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <HashBox title={`${hashName} (inner)`} tone="internal">
              <CharRow label="ipad||msg" size="sm" cells={hexCells(innerMsg, 'input', 24)} />
              <FlowArrow />
              <DataBlock label="inner digest" value={innerDigest} tone="internal" />
            </HashBox>
          </div>
        )
      }
      case 'hmac-outer': {
        const structural = Boolean(view.structural)
        const opad = String(view.opad)
        const innerDigest = String(view.innerDigest)
        const digest = String(view.digest)
        const hashName = String(view.hashName)
        if (structural) {
          return (
            <div className="lab-stage-view">
              <DataBlock label="input" value="(K0 XOR opad) || inner_digest" tone="input" />
              <FlowArrow />
              <DataBlock label="MAC" value={digest || '—'} tone="output" big />
            </div>
          )
        }
        return (
          <div className="lab-stage-view">
            <HashBox title={`${hashName} (outer)`} tone="transform">
              <CharRow label="opad||inner" size="sm" cells={hexCells(opad, 'key', 24)} />
              <DataBlock label="inner digest" value={innerDigest} tone="internal" />
              <FlowArrow />
              <HashBox title={`${hashName} (inner)`} tone="internal">
                <DataBlock label="ipad||msg hashed" value={innerDigest} tone="internal" />
              </HashBox>
              <FlowArrow />
              <DataBlock label="MAC" value={digest} tone="output" big />
            </HashBox>
          </div>
        )
      }
      case 'hmac-result': {
        const structural = Boolean(view.structural)
        const digest = String(view.digest)
        return (
          <div className="lab-stage-view">
            <DataBlock label="HMAC" value={digest || '—'} tone="output" big />
            {structural && digest && <p className="lab-note">digest bound from server execution</p>}
          </div>
        )
      }
      default:
        return null
    }
  },
}
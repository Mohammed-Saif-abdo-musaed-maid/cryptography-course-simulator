import type { SimulationContext, SimulationEngine, SimStage, SimView } from '../simulationTypes'
import { DataBlock } from '../common/DataBlock'
import { FlowArrow } from '../common/FlowArrow'

const id = 'x448'

const hexStr = (v: unknown): string => (typeof v === 'string' ? v : '')

function truncateShort(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s
}

export const x448Engine: SimulationEngine = {
  id,
  nameKey: 'simulation.x448.name',
  educationalKey: 'simulation.x448.educational',
  build(ctx): SimStage[] {
    const extra = ctx.result?.extra as Record<string, unknown> | undefined
    const aliceData = extra?.alice as Record<string, unknown> | undefined
    const bobData = extra?.bob as Record<string, unknown> | undefined
    const aPriv = typeof aliceData?.private_hex === 'string' ? aliceData.private_hex : ''
    const bPriv = typeof bobData?.private_hex === 'string' ? bobData.private_hex : ''
    const aPub = typeof aliceData?.public_hex === 'string' ? aliceData.public_hex : ''
    const bPub = typeof bobData?.public_hex === 'string' ? bobData.public_hex : ''
    const aClamped = typeof aliceData?.clamped_private_hex === 'string' ? aliceData.clamped_private_hex : ''
    const bClamped = typeof bobData?.clamped_private_hex === 'string' ? bobData.clamped_private_hex : ''
    const shared = typeof extra?.shared_secret_hex === 'string' ? extra.shared_secret_hex : null

    return [
      {
        id: `${id}-curve`,
        titleKey: 'simulation.x448.curve.title',
        descKey: 'simulation.x448.curve.desc',
        phase: 'input',
        view: { kind: `${id}-curve` },
      },
      {
        id: `${id}-keys`,
        titleKey: 'simulation.x448.keys.title',
        descKey: 'simulation.x448.keys.desc',
        phase: 'key',
        traceIndex: shared ? 1 : undefined,
        view: { kind: `${id}-keys`, aPriv, bPriv, aPub, bPub, hasResult: !!shared },
      },
      {
        id: `${id}-ladder`,
        titleKey: 'simulation.x448.ladder.title',
        descKey: 'simulation.x448.ladder.desc',
        phase: 'transform',
        traceIndex: shared ? 2 : undefined,
        view: { kind: `${id}-ladder`, aPriv, bPriv, aClamped, bClamped, hasResult: !!shared },
      },
      {
        id: `${id}-shared`,
        titleKey: 'simulation.x448.shared.title',
        descKey: 'simulation.x448.shared.desc',
        phase: 'output',
        traceIndex: shared ? 4 : undefined,
        view: { kind: `${id}-shared`, shared, hasResult: !!shared },
      },
    ]
  },
  View({ view, ctx }: { view: SimView; ctx: SimulationContext }) {
    void ctx
    switch (view.kind) {
      case `${id}-curve`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="curve" value="Curve448 (Goldilocks)" tone="internal" big />
              <DataBlock label="form" value="y² = x³ − 3x − 2 (twisted Edwards)" tone="internal" />
              <DataBlock label="base point" value="u = 5 (x-coordinate only)" tone="key" big />
              <DataBlock label="field prime p" value="2⁴⁴⁸ − 2²²⁴ − 1" tone="internal" />
            </div>
          </div>
        )
      case `${id}-keys`:
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="private (hex, truncated)" value={truncateShort(hexStr(view.aPriv), 32)} tone="key" />
                <FlowArrow op="X448" />
                <DataBlock label="public (hex, truncated)" value={truncateShort(hexStr(view.aPub), 28)} tone="output" />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="private (hex, truncated)" value={truncateShort(hexStr(view.bPriv), 32)} tone="key" />
                <FlowArrow op="X448" />
                <DataBlock label="public (hex, truncated)" value={truncateShort(hexStr(view.bPub), 28)} tone="output" />
              </div>
            </div>
          </div>
        )
      case `${id}-ladder`:
        return (
          <div className="lab-stage-view">
            <div className="lab-ec-plane">
              <DataBlock label="secret scalar" value="56 bytes · clamp bits 0,1,2 and 447" tone="transform" />
              <FlowArrow op="constant-time Montgomery ladder" />
            </div>
            {hexStr(view.aClamped) && (
              <DataBlock label="real clamped scalar (Alice, hex)" value={truncateShort(hexStr(view.aClamped), 80)} tone="internal" />
            )}
            {hexStr(view.bClamped) && (
              <DataBlock label="real clamped scalar (Bob, hex)" value={truncateShort(hexStr(view.bClamped), 80)} tone="internal" />
            )}
            <DataBlock label="operation" value="scalar × base point on Curve448 (x-coordinate only)" tone="internal" />
          </div>
        )
      case `${id}-shared`:
        return (
          <div className="lab-stage-view">
            <div className="lab-dh-channel">
              <div className="lab-agent-card">
                <div className="lab-card-title">Alice</div>
                <DataBlock label="S = X448(a, B)" value="X448 private × Bob public" tone="output" big />
              </div>
              <div className="lab-agent-card">
                <div className="lab-card-title">Bob</div>
                <DataBlock label="S = X448(b, A)" value="X448 private × Alice public" tone="output" big />
              </div>
            </div>
            <DataBlock label="shared secret (56 bytes)" value={hexStr(view.shared) ? truncateShort(hexStr(view.shared), 32) + '…' : 'run to derive'} tone="output" big />
          </div>
        )
      default:
        return null
    }
  },
}
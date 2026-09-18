import { useI18n } from '../../i18n'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { KeyTextarea } from './KeyTextarea'
import type { SignatureKeysState, SignAlgorithm } from './types'

interface KeyFieldsProps {
  algorithm: SignAlgorithm
  state: SignatureKeysState
  privateLabel?: string
  publicLabel?: string
}

export function KeyFields({ algorithm, state, privateLabel, publicLabel }: KeyFieldsProps) {
  const { t } = useI18n()
  return (
    <div className="lab-keys">
      <div className="lab-keys-controls">
        <Button variant="primary" size="sm" onClick={state.generate} disabled={state.generating}>
          {state.generating ? t('lab.keys.generating') : t('lab.keys.generate')}
        </Button>

        {algorithm === 'rsa' && (
          <label className="lab-inline-field">
            <span>{t('lab.keys.rsaBits')}</span>
            <select
              value={state.rsaBits}
              onChange={(event) => state.setRsaBits(Number(event.target.value))}
            >
              <option value={2048}>2048</option>
              <option value={3072}>3072</option>
              <option value={4096}>4096</option>
            </select>
          </label>
        )}

        {algorithm === 'ecdsa' && (
          <label className="lab-inline-field">
            <span>{t('lab.keys.curve')}</span>
            <select value={state.curve} onChange={(event) => state.setCurve(event.target.value)}>
              <option value="p256">P-256</option>
              <option value="p384">P-384</option>
              <option value="p521">P-521</option>
            </select>
          </label>
        )}
      </div>

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <KeyTextarea
        label={privateLabel ?? t('lab.keys.private')}
        value={state.privateKeyPem}
        onChange={state.setPrivateKeyPem}
        secret
        rows={5}
        hint={t('lab.keys.neverShare')}
      />
      <KeyTextarea
        label={publicLabel ?? t('lab.keys.public')}
        value={state.publicKeyPem}
        onChange={state.setPublicKeyPem}
        rows={4}
      />
    </div>
  )
}

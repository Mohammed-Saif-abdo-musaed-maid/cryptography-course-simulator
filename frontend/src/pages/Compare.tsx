import { useState } from 'react'
import { useI18n } from '../i18n'
import { ALGORITHMS } from '../data/catalog'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { StatusBadge, CategoryBadge } from '../components/ui/Badge'
import { Alert } from '../components/ui/Alert'

const USAGE: Record<string, string> = {
  caesar: 'Educational only',
  monoalphabetic: 'Puzzles / educational',
  vigenere: 'Historical study',
  playfair: 'Historical field use',
  hill: 'Linear-algebra teaching',
  rail_fence: 'Transposition teaching',
  columnar: 'Classical exercises',
  des: 'Legacy systems (not allowed)',
  triple_des: 'Legacy payment systems',
  aes: 'Everywhere: TLS, disk, files',
  blowfish: 'Legacy/teaching; 64-bit block (deprecated)',
  twofish: 'Legacy disk encryption, teaching',
  chacha20: 'TLS 1.3, WireGuard, mobile encryption',
  rsa: 'Key exchange, digital signatures',
  diffie_hellman: 'Session key agreement',
  elgamal: 'Protocols (e.g., PGP), signature',
  sha256: 'Integrity, password hashing, signatures',
  sha512: 'Integrity, digital signatures',
  sha1: 'Legacy (deprecated — avoid)',
  md5: 'Legacy checksums only (never security)',
  sha3: 'Integrity, signatures, future-proof choice',
  blake2: 'Password hashing, integrity',
  blake3: 'Parallel hashing, verification, XOF',
}

const COMPLEXITY: Record<string, string> = {
  caesar: '★☆☆☆☆',
  monoalphabetic: '★☆☆☆☆',
  vigenere: '★★☆☆☆',
  playfair: '★★☆☆☆',
  hill: '★★★☆☆',
  rail_fence: '★☆☆☆☆',
  columnar: '★★☆☆☆',
  des: '★★★★☆',
  triple_des: '★★★★☆',
  aes: '★★★★★',
  blowfish: '★★★☆☆',
  twofish: '★★★★★',
  chacha20: '★★★★☆',
  rsa: '★★★★☆',
  diffie_hellman: '★★★☆☆',
  elgamal: '★★★★☆',
  sha256: '★★★★★',
  sha512: '★★★★★',
  sha1: '★★☆☆☆',
  md5: '★★☆☆☆',
  sha3: '★★★★★',
  blake2: '★★★★☆',
  blake3: '★★★★★',
}

export function Compare() {
  const { t } = useI18n()
  const [selected, setSelected] = useState<string[]>(['caesar', 'aes', 'rsa'])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? prev : [...prev, id],
    )
  }

  const rows = ALGORITHMS.filter((a) => selected.includes(a.id))

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.compare')} subtitle={t('compare.subtitle')} />

      <Card>
        <div className="pill-row">
          {ALGORITHMS.map((alg) => {
            const active = selected.includes(alg.id)
            return (
              <button
                key={alg.id}
                type="button"
                className={`btn btn-sm ${active ? 'btn-primary' : ''}`}
                onClick={() => toggle(alg.id)}
                aria-pressed={active}
              >
                {alg.name}
              </button>
            )
          })}
        </div>
        {rows.length === 0 && (
          <Alert variant="info" >
            {t('compare.selectHint')}
          </Alert>
        )}
      </Card>

      {rows.length > 0 && (
        <div className="table-wrap" style={{ marginBlockStart: 'var(--sp-5)' }}>
          <table className="table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('common.category')}</th>
                <th>{t('compare.type')}</th>
                <th>{t('compare.keySize')}</th>
                <th>{t('compare.blockSize')}</th>
                <th>{t('compare.security')}</th>
                <th>{t('compare.reversible')}</th>
                <th>{t('compare.useCase')}</th>
                <th>{t('compare.complexity')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((alg) => (
                <tr key={alg.id}>
                  <td style={{ fontWeight: 700 }}>{alg.name}</td>
                  <td><CategoryBadge category={alg.category} /></td>
                  <td>{alg.id === 'chacha20' ? 'Stream cipher' : alg.category === 'hashing' ? 'Hash' : alg.category === 'key_exchange' ? 'Key Exchange' : alg.category === 'symmetric' ? 'Block cipher' : alg.category === 'classical' ? 'Classical' : 'Public-key'}</td>
                  <td>{alg.key_kind}</td>
                  <td className="mono">{alg.block_size}</td>
                  <td><StatusBadge status={alg.security_status} /></td>
                  <td>{alg.reversible ? t('status.yes') : t('status.no')}</td>
                  <td>{USAGE[alg.id] ?? '—'}</td>
                  <td className="mono">{COMPLEXITY[alg.id] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'

const SECTIONS: { key: string; items: { label: string; to: string; desc: string }[] }[] = [
  {
    key: 'mathFoundations',
    items: [
      {
        label: 'Modular Arithmetic',
        to: '/mathematics',
        desc: 'a mod n, congruence classes, the arithmetic that all ciphers run on.',
      },
      {
        label: 'Primes & Compositeness',
        to: '/mathematics',
        desc: 'Why primes are the building blocks of asymmetric cryptography.',
      },
      {
        label: "Euler's Theorem & φ(n)",
        to: '/mathematics',
        desc: 'The engine behind RSA decryption correctness.',
      },
    ],
  },
  {
    key: 'classical',
    items: [
      { label: 'Caesar & Substitution', to: '/algorithms/caesar', desc: 'Frequency analysis breaks simple substitution completely.' },
      { label: 'Polyalphabetic ciphers', to: '/algorithms/vigenere', desc: 'Vigenère resists naive frequency analysis for centuries.' },
      { label: 'Transposition ciphers', to: '/algorithms/columnar', desc: 'Rail fence and columnar rearrange, never replace.' },
    ],
  },
  {
    key: 'symmetric',
    items: [
      { label: 'Block ciphers & Feistel', to: '/algorithms/des', desc: 'DES as the canonical Feistel design.' },
      { label: 'AES & Rijndael', to: '/algorithms/aes', desc: 'SP-networks, S-boxes, and why 128 bits is enough.' },
    ],
  },
  {
    key: 'asymmetric',
    items: [
      { label: 'Public-key primitives', to: '/algorithms/rsa', desc: 'Trapdoors: easy one way, hard to invert.' },
      { label: 'Key agreement', to: '/algorithms/diffie_hellman', desc: 'Agreeing on secrets across adversarial networks.' },
      { label: 'Hash functions', to: '/algorithms/sha256', desc: 'One-way compression, integrity, and signatures.' },
    ],
  },
]

export function Theory() {
  const { t } = useI18n()

  return (
    <div className="animate-fade-up">
      <PageHeader title={t('nav.introduction')} subtitle={t('dashboard.heroSubtitle')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {SECTIONS.map((section) => (
          <Card
            key={section.key}
            title={t(`nav.${section.key}`)}
            actions={<></>}
          >
            <div className="grid-2" style={{ marginTop: 8 }}>
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="card card-hover"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <h4 className="card-title" style={{ color: 'var(--primary)' }}>{item.label}</h4>
                  <p className="card-sub" style={{ margin: 0 }}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AlgorithmPage } from '../components/simulator/AlgorithmPage'
import { I18nProvider } from '../i18n'

function renderAlgorithm(id: string) {
  return render(
    <I18nProvider>
      <AlgorithmPage id={id} />
    </I18nProvider>,
  )
}

function tabNames(): string[] {
  return screen.queryAllByRole('tab').map((tab) => tab.textContent ?? '')
}

describe('capability-driven lab tabs', () => {
  it('shows signature tabs (and no file-encryption tab) for Ed25519', () => {
    renderAlgorithm('ed25519')
    const names = tabNames()
    expect(names).toContain('Digital Signature')
    expect(names).toContain('Signature Verification')
    expect(names).toContain('File Signature')
    expect(names).toContain('File Signature Verification')
    expect(names).not.toContain('File Encryption')
    expect(names).not.toContain('Hybrid Encryption')
  })

  it('shows file encryption tabs for AES-GCM', () => {
    renderAlgorithm('aes_gcm')
    const names = tabNames()
    expect(names).toContain('File Encryption')
    expect(names).toContain('File Decryption')
    expect(names).not.toContain('Digital Signature')
  })

  it('shows hybrid + signature tabs but never file encryption for RSA', () => {
    renderAlgorithm('rsa')
    const names = tabNames()
    expect(names).toContain('Hybrid Encryption')
    expect(names).toContain('Digital Signature')
    expect(names).toContain('File Signature')
    expect(names).not.toContain('File Encryption')
    expect(names).not.toContain('File Decryption')
  })

  it('shows file hash + integrity tabs for SHA-256', () => {
    renderAlgorithm('sha256')
    const names = tabNames()
    expect(names).toContain('File Hash')
    expect(names).toContain('File Integrity')
  })

  it('shows MAC tabs for HMAC', () => {
    renderAlgorithm('hmac')
    expect(tabNames()).toContain('MAC Verification')
  })

  it('shows MAC tabs for AES-CMAC and Poly1305', () => {
    renderAlgorithm('poly1305')
    expect(tabNames()).toContain('MAC')
    renderAlgorithm('cmac_aes128')
    expect(tabNames()).toContain('MAC Verification')
  })

  it('shows the key exchange tab for X25519', () => {
    renderAlgorithm('x25519')
    expect(tabNames()).toContain('Key Exchange')
  })

  it('shows a single certificate tab for Ed25519 (deduplicated)', () => {
    renderAlgorithm('ed25519')
    const certificates = tabNames().filter((name) => name === 'Certificate / PKI')
    expect(certificates).toHaveLength(1)
  })

  it('lazy-loads the certificate panel when its tab is selected', async () => {
    renderAlgorithm('rsa')
    fireEvent.click(screen.getByRole('tab', { name: 'Certificate / PKI' }))
    expect(await screen.findByRole('button', { name: 'Self-signed certificate' })).toBeTruthy()
  })

  it('shows no laboratory tabs for a text-only cipher', () => {
    renderAlgorithm('caesar')
    const names = tabNames()
    expect(names).toContain('Simulator')
    expect(names).not.toContain('File Encryption')
    expect(names).not.toContain('Digital Signature')
    expect(names).not.toContain('File Hash')
  })

  it('lazy-loads a laboratory panel when its tab is selected', async () => {
    renderAlgorithm('ed25519')
    fireEvent.click(screen.getByRole('tab', { name: 'File Signature' }))
    expect(await screen.findByText('Key pair')).toBeTruthy()
  })
})

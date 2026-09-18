import { describe, expect, it } from 'vitest'
import type { AlgorithmCapabilities } from '../types'
import { hasLabTabs, labTabLabelKey, labTabsFor } from '../data/labTabs'

function caps(flags: Partial<AlgorithmCapabilities> = {}): AlgorithmCapabilities {
  return {
    textEncryption: false,
    textDecryption: false,
    fileEncryption: false,
    fileDecryption: false,
    digitalSignature: false,
    signatureVerification: false,
    fileSignature: false,
    fileSignatureVerification: false,
    hashing: false,
    fileHashing: false,
    integrityVerification: false,
    mac: false,
    macVerification: false,
    keyExchange: false,
    keyDerivation: false,
    hybridEncryption: false,
    digitalCertificate: false,
    certificateAuthority: false,
    ...flags,
  }
}

describe('labTabsFor', () => {
  it('returns no tabs without capabilities', () => {
    expect(labTabsFor(null)).toEqual([])
    expect(labTabsFor(undefined)).toEqual([])
    expect(hasLabTabs(caps())).toBe(false)
  })

  it('maps file encryption capabilities to file crypto tabs', () => {
    expect(labTabsFor(caps({ fileEncryption: true, fileDecryption: true }))).toEqual([
      'fileEncryption',
      'fileDecryption',
    ])
  })

  it('maps signature capabilities to the four signature tabs', () => {
    expect(
      labTabsFor(
        caps({
          digitalSignature: true,
          signatureVerification: true,
          fileSignature: true,
          fileSignatureVerification: true,
        }),
      ),
    ).toEqual([
      'digitalSignature',
      'signatureVerification',
      'fileSignature',
      'fileSignatureVerification',
    ])
  })

  it('shows hybrid + signature but never file encryption for RSA', () => {
    const rsa = caps({
      textEncryption: true,
      textDecryption: true,
      digitalSignature: true,
      signatureVerification: true,
      fileSignature: true,
      fileSignatureVerification: true,
      hybridEncryption: true,
    })
    const tabs = labTabsFor(rsa)
    expect(tabs).toContain('hybridEncryption')
    expect(tabs).toContain('digitalSignature')
    expect(tabs).not.toContain('fileEncryption')
    expect(tabs).not.toContain('fileDecryption')
  })

  it('maps every hash algorithm to file hash + integrity tabs', () => {
    expect(
      labTabsFor(caps({ hashing: true, fileHashing: true, integrityVerification: true })),
    ).toEqual(['fileHash', 'fileIntegrity'])
  })

  it('maps MAC capabilities to the MAC tabs in order', () => {
    expect(labTabsFor(caps({ mac: true, macVerification: true }))).toEqual([
      'mac',
      'macVerification',
    ])
  })

  it('maps key exchange capability to the key exchange tab', () => {
    expect(labTabsFor(caps({ keyExchange: true }))).toEqual(['keyExchange'])
  })

  it('keeps a stable order regardless of flag order', () => {
    const tabs = labTabsFor(
      caps({
        keyExchange: true,
        macVerification: true,
        mac: true,
        integrityVerification: true,
        fileHashing: true,
        hashing: true,
        fileDecryption: true,
        fileEncryption: true,
      }),
    )
    expect(tabs).toEqual([
      'fileEncryption',
      'fileDecryption',
      'fileHash',
      'fileIntegrity',
      'mac',
      'macVerification',
      'keyExchange',
    ])
  })

  it('maps certificate capabilities to a single Certificate / PKI tab', () => {
    expect(
      labTabsFor(caps({ digitalCertificate: true, certificateAuthority: true })),
    ).toEqual(['certificate'])
    expect(labTabsFor(caps({ digitalCertificate: true }))).toEqual(['certificate'])
    expect(labTabsFor(caps({ certificateAuthority: true }))).toEqual(['certificate'])
  })

  it('does not show certificate tabs for signature-only capabilities', () => {
    expect(
      labTabsFor(caps({ digitalSignature: true, signatureVerification: true })),
    ).not.toContain('certificate')
  })

  it('exposes i18n keys for every lab tab', () => {
    expect(labTabLabelKey('fileHash')).toBe('algorithm.tabs.fileHash')
    expect(labTabLabelKey('hybridEncryption')).toBe('algorithm.tabs.hybridEncryption')
    expect(labTabLabelKey('certificate')).toBe('algorithm.tabs.certificate')
  })
})

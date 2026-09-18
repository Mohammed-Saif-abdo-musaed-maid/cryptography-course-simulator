import type { AlgorithmCapabilities } from '../types'

/**
 * Capability-driven laboratory tabs.
 *
 * A lab tab is shown for an algorithm if and only if the backend capability
 * model reports the matching capability. There are no per-algorithm string
 * checks anywhere in the UI: adding a new algorithm only requires updating the
 * capability model on the backend.
 */
export type LabTabId =
  | 'fileEncryption'
  | 'fileDecryption'
  | 'digitalSignature'
  | 'signatureVerification'
  | 'fileSignature'
  | 'fileSignatureVerification'
  | 'fileHash'
  | 'fileIntegrity'
  | 'mac'
  | 'macVerification'
  | 'hybridEncryption'
  | 'keyExchange'
  | 'certificate'

interface LabTabDefinition {
  id: LabTabId
  capability: keyof AlgorithmCapabilities
}

const LAB_TAB_DEFINITIONS: readonly LabTabDefinition[] = [
  { id: 'fileEncryption', capability: 'fileEncryption' },
  { id: 'fileDecryption', capability: 'fileDecryption' },
  { id: 'digitalSignature', capability: 'digitalSignature' },
  { id: 'signatureVerification', capability: 'signatureVerification' },
  { id: 'fileSignature', capability: 'fileSignature' },
  { id: 'fileSignatureVerification', capability: 'fileSignatureVerification' },
  { id: 'fileHash', capability: 'fileHashing' },
  { id: 'fileIntegrity', capability: 'integrityVerification' },
  { id: 'mac', capability: 'mac' },
  { id: 'macVerification', capability: 'macVerification' },
  { id: 'hybridEncryption', capability: 'hybridEncryption' },
  { id: 'keyExchange', capability: 'keyExchange' },
  // Related but separate capabilities share one Certificate / PKI tab.
  { id: 'certificate', capability: 'digitalCertificate' },
  { id: 'certificate', capability: 'certificateAuthority' },
]

export function labTabsFor(
  capabilities: AlgorithmCapabilities | null | undefined,
): LabTabId[] {
  if (!capabilities) return []
  const tabs = LAB_TAB_DEFINITIONS.filter((tab) => capabilities[tab.capability]).map(
    (tab) => tab.id,
  )
  return Array.from(new Set(tabs))
}

export function hasLabTabs(
  capabilities: AlgorithmCapabilities | null | undefined,
): boolean {
  return labTabsFor(capabilities).length > 0
}

export function labTabLabelKey(id: LabTabId): string {
  return `algorithm.tabs.${id}`
}

import type { LabTabId } from '../../data/labTabs'
import { CertificateLab } from './CertificateLab'
import { FileCryptoLab } from './FileCryptoLab'
import { FileSignatureLab } from './FileSignatureLab'
import { HashLab } from './HashLab'
import { HybridLab } from './HybridLab'
import { IntegrityLab } from './IntegrityLab'
import { KeyExchangeLab } from './KeyExchangeLab'
import { MacLab } from './MacLab'
import { SignatureLab } from './SignatureLab'
import type { SignAlgorithm } from './types'

const SIGN_ALGORITHMS: readonly SignAlgorithm[] = ['rsa', 'ecdsa', 'ed25519']

function asSignAlgorithm(id: string): SignAlgorithm | null {
  return (SIGN_ALGORITHMS as readonly string[]).includes(id) ? (id as SignAlgorithm) : null
}

interface LabPanelProps {
  tabId: LabTabId
  algorithmId: string
}

export function LabPanel({ tabId, algorithmId }: LabPanelProps) {
  const signAlgorithm = asSignAlgorithm(algorithmId)

  switch (tabId) {
    case 'fileEncryption':
      return <FileCryptoLab algorithm={algorithmId} mode="encrypt" />
    case 'fileDecryption':
      return <FileCryptoLab algorithm={algorithmId} mode="decrypt" />
    case 'digitalSignature':
      return signAlgorithm ? <SignatureLab algorithm={signAlgorithm} mode="sign" /> : null
    case 'signatureVerification':
      return signAlgorithm ? <SignatureLab algorithm={signAlgorithm} mode="verify" /> : null
    case 'fileSignature':
      return signAlgorithm ? <FileSignatureLab algorithm={signAlgorithm} mode="sign" /> : null
    case 'fileSignatureVerification':
      return signAlgorithm ? <FileSignatureLab algorithm={signAlgorithm} mode="verify" /> : null
    case 'fileHash':
      return <HashLab algorithm={algorithmId} />
    case 'fileIntegrity':
      return <IntegrityLab algorithm={algorithmId} />
    case 'mac':
      return <MacLab mode="generate" />
    case 'macVerification':
      return <MacLab mode="verify" />
    case 'hybridEncryption':
      return signAlgorithm === 'rsa' ? <HybridLab /> : null
    case 'keyExchange':
      return <KeyExchangeLab algorithm={algorithmId} />
    case 'certificate':
      return signAlgorithm ? <CertificateLab algorithm={signAlgorithm} /> : null
    default:
      return null
  }
}

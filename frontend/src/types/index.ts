export type Category =
  | 'classical'
  | 'symmetric'
  | 'asymmetric'
  | 'key_exchange'
  | 'hashing'
  | 'mac'
  | 'kdf'
  | 'aead'
  | 'signature'

export type SecurityStatus =
  | 'historic'
  | 'deprecated'
  | 'broken'
  | 'broken_deprecated'
  | 'secure'
  | 'secure_with_padding'
  | 'secure_with_auth'

export type FieldType = 'text' | 'textarea' | 'number' | 'matrix' | 'select'

export interface AlgorithmField {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  default?: string | number | number[][]
  min?: number
  max?: number
  options?: string[]
}

export interface AlgorithmCapabilities {
  textEncryption: boolean
  textDecryption: boolean
  fileEncryption: boolean
  fileDecryption: boolean
  digitalSignature: boolean
  signatureVerification: boolean
  fileSignature: boolean
  fileSignatureVerification: boolean
  hashing: boolean
  fileHashing: boolean
  integrityVerification: boolean
  mac: boolean
  macVerification: boolean
  keyExchange: boolean
  keyDerivation: boolean
  hybridEncryption: boolean
  digitalCertificate: boolean
  certificateAuthority: boolean
}

export interface AlgorithmDescriptor {
  id: string
  name: string
  category: Category
  category_label: string
  operations: string[]
  fields: AlgorithmField[]
  security_status: SecurityStatus
  reversible: boolean
  key_kind: string
  block_size: string
  description: string
  formula: string
  capabilities: AlgorithmCapabilities
}

export interface Catalog {
  algorithms: AlgorithmDescriptor[]
  categories: Record<string, number>
}

export interface StepDetail {
  step: number
  title: string
  description: string
  input: string
  output: string
  detail?: Record<string, unknown> | null
}

export interface AlgorithmResult {
  algorithm: string
  operation: string
  input: string
  parameters: Record<string, unknown>
  result: string | number | Record<string, unknown>
  extra?: Record<string, unknown> | null
  steps: StepDetail[]
}

export interface ApiError {
  error: string
  message: string
  status: number
  path?: string
}

export interface QuizQuestion {
  id: string
  category: string
  difficulty: string
  question: string
  options: string[]
}

export interface QuizGeneration {
  count: number
  questions: QuizQuestion[]
}

export interface QuizResult {
  score: number
  total: number
  percentage: number
  details: {
    question_id: string
    question: string
    selected: string
    correct: boolean
    correct_index: number
    correct_answer: string
    explanation: string
  }[]
}

export interface Exercise {
  id: string
  algorithm: string
  category: string
  type: string
  difficulty: string
  question: string
  options: string[]
  explanation: string
}

export interface ExerciseResult {
  exercise_id: string
  correct: boolean
  expected: string
  submitted: string
  explanation: string
}

export interface MathResult extends AlgorithmResult {}

// ---------------------------------------------------------------------------
// Phase-3 lab DTOs (mirror backend/app/schemas/lab.py and the lab services).
// ---------------------------------------------------------------------------

export interface LabContainerMetadata {
  magic: string
  version: number
  mode: 'symmetric' | 'hybrid'
  algorithm: string
  kdf: string | null
  kdf_params: Record<string, unknown>
  salt_b64: string | null
  nonce_b64: string
  tag_b64: string
  wrapped_key_present: boolean
  key_algorithm: string | null
  key_size: number | null
  original_filename: string
  original_extension: string
  original_mime_type: string
  original_size: number
  ciphertext_length: number
}

export interface LabFileResponse {
  container_b64?: string
  data_b64?: string
  filename: string
  output_filename: string
  metadata: LabContainerMetadata
  processing_ms: number
}

export interface LabKeyPair {
  algorithm: string
  private_key_pem: string
  public_key_pem: string
  key_size?: number
  curve?: string
  processing_ms?: number
}

export interface LabSignResponse {
  algorithm: string
  hash_algorithm: string | null
  signature_hex: string
  signature_size: number
  data_size: number
  processing_ms: number
}

export interface LabVerifyResponse {
  valid: boolean
  algorithm: string
  processing_ms: number
}

export interface LabHashResponse {
  algorithm: string
  variant: string
  digest_size: number
  digest_hex: string
  input_size: number
  processing_ms: number
}

export interface LabHashVerifyResponse {
  match: boolean
  digest_hex: string
  expected_hex: string
  algorithm: string
  processing_ms: number
}

export interface LabMacResponse {
  algorithm: string
  mac_hex: string
  mac_size: number
  data_size: number
  processing_ms: number
}

export interface LabMacVerifyResponse {
  valid: boolean
  algorithm: string
  processing_ms: number
}

export interface LabInfo {
  file_algorithms: string[]
  kdfs: string[]
  signature_algorithms: string[]
  hash_algorithms: string[]
  hmac_algorithms: string[]
  mac_algorithms: string[]
  hybrid_algorithms: string[]
  certificate_algorithms: string[]
  certificate_hashes: string[]
  certificate_curves: string[]
  extended_key_usages: string[]
  max_file_bytes: number
}

// ---------------------------------------------------------------------------
// Phase-4 certificate / PKI DTOs (mirror backend/app/lab/pki.py).
// ---------------------------------------------------------------------------

export type LabName = Record<string, string | string[]>

export interface LabPkiPublicKey {
  algorithm: string
  key_size?: number
  curve?: string
}

export interface LabCertificateInfo {
  subject: LabName
  issuer: LabName
  serial_number: string
  serial_hex: string
  not_valid_before: string
  not_valid_after: string
  validity_days: number
  is_ca: boolean
  path_length: number | null
  key_usage: Record<string, boolean> | null
  extended_key_usage: string[]
  subject_alternative_name: Record<string, string[]>
  subject_key_identifier: string | null
  authority_key_identifier: string | null
  signature_algorithm: string
  signature_hash: string | null
  public_key: LabPkiPublicKey
  version: string
  self_signed: boolean
  is_expired: boolean
  is_not_yet_valid: boolean
  fingerprint_sha256: string
  fingerprint_sha1: string
  pem: string
  der_b64: string
  der_size: number
  processing_ms?: number
}

export interface LabSelfSignedResponse {
  self_signed: boolean
  certificate: LabCertificateInfo
  processing_ms?: number
}

export interface LabCsrResponse {
  csr_pem: string
  subject: LabName
  public_key: LabPkiPublicKey
  signature_valid: boolean
  signature_algorithm: string
  pem_size: number
  processing_ms?: number
}

export interface LabCertificateSignResponse {
  certificate: LabCertificateInfo
  issuer_common_name: string
  processing_ms?: number
}

export interface LabCertificateCheck {
  name: string
  passed: boolean
  detail: string
}

export interface LabCertificateVerifyResponse {
  valid: boolean
  trusted: boolean
  self_signed: boolean
  checks: LabCertificateCheck[]
  errors: string[]
  certificate: LabCertificateInfo
  processing_ms?: number
}

export interface LabChainVerifyResponse {
  valid: boolean
  length: number
  checks: LabCertificateCheck[]
  errors: string[]
  chain: {
    subject: string
    issuer: string
    is_ca: boolean
    serial_number: string
  }[]
  processing_ms?: number
}

export interface LabCertSignResponse {
  algorithm: string
  hash_algorithm: string | null
  signature_hex: string
  signature_size: number
  data_size: number
  certificate_valid: boolean
  certificate_subject: string
  certificate_fingerprint_sha256: string
  processing_ms?: number
}

export interface LabCertVerifyResponse {
  signature_valid: boolean
  certificate_valid: boolean
  certificate_trusted: boolean
  algorithm: string
  hash_algorithm: string | null
  data_size: number
  certificate_subject: string
  checks: LabCertificateCheck[]
  errors: string[]
  processing_ms?: number
}
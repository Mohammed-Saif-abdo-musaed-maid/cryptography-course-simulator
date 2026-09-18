import type {
  AlgorithmDescriptor,
  AlgorithmResult,
  ApiError,
  Catalog,
  Exercise,
  ExerciseResult,
  LabFileResponse,
  LabHashResponse,
  LabHashVerifyResponse,
  LabMacResponse,
  LabMacVerifyResponse,
  LabInfo,
  LabKeyPair,
  LabSignResponse,
  LabVerifyResponse,
  LabSelfSignedResponse,
  LabCsrResponse,
  LabCertificateInfo,
  LabCertificateSignResponse,
  LabCertificateVerifyResponse,
  LabChainVerifyResponse,
  LabCertSignResponse,
  LabCertVerifyResponse,
  QuizGeneration,
  QuizResult,
} from '../types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:8000/api'

export class ApiClientError extends Error {
  code: string
  status: number
  path?: string

  constructor(payload: ApiError) {
    super(payload.message)
    this.code = payload.error
    this.status = payload.status
    this.path = payload.path
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiClientError({
      error: 'network_error',
      message:
        'Cannot reach the backend service. If you are running the app locally, make sure the FastAPI server is running (http://127.0.0.1:8000). If you are on the public site, the service may be starting up or temporarily unavailable — please try again in a moment.',
      status: 0,
    })
  }

  if (!response.ok) {
    let payload: ApiError
    try {
      payload = (await response.json()) as ApiError
    } catch {
      payload = {
        error: 'http_error',
        message: `Request failed with status ${response.status}`,
        status: response.status,
      }
    }
    throw new ApiClientError(payload)
  }

  return (await response.json()) as T
}

export const api = {
  catalog: () => request<Catalog>('/algorithms'),

  algorithmDetail: (id: string) =>
    request<AlgorithmDescriptor>(`/algorithms/${id}`),

  execute: (
    algorithm: string,
    operation: string,
    inputs: Record<string, unknown>,
  ) => request<AlgorithmResult>('/algorithms/execute', {
    method: 'POST',
    body: JSON.stringify({ algorithm, operation, inputs }),
  }),

  math: (tool: string, body: Record<string, unknown>) =>
    request<AlgorithmResult>(`/math/${tool}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  mathTools: () => request<{ tools: string[] }>('/math/tools'),

  exercises: (category = 'all') =>
    request<{ total: number; exercises: Exercise[] }>(`/exercises?category=${category}`),

  checkExercise: (id: string, answer: string) =>
    request<ExerciseResult>(`/exercises/${id}/check`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    }),

  quizQuestions: (category: string, difficulty: string, count: number) =>
    request<QuizGeneration>(
      `/quizzes/questions?category=${category}&difficulty=${difficulty}&count=${count}`,
    ),

  quizCheck: (category: string, difficulty: string, answers: Record<string, string>) =>
    request<QuizResult>('/quizzes/check', {
      method: 'POST',
      body: JSON.stringify({ category, difficulty, answers }),
    }),

  health: () => request<{ status: string; app: string; version: string }>('/health'),

  lab: {
    info: () => request<LabInfo>('/lab/info'),

    fileEncrypt: (body: {
      data_b64: string
      filename?: string
      mime_type?: string
      algorithm: string
      password?: string
      key_hex?: string
      kdf?: string
    }) =>
      request<LabFileResponse>('/lab/file/encrypt', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    fileDecrypt: (body: { container_b64: string; password?: string; key_hex?: string }) =>
      request<LabFileResponse>('/lab/file/decrypt', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    signatureKeys: (body: { algorithm: string; rsa_bits?: number; curve?: string }) =>
      request<LabKeyPair>('/lab/signature/keys', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    sign: (body: {
      data_b64: string
      algorithm: string
      private_key_pem: string
      hash_algorithm?: string
    }) =>
      request<LabSignResponse>('/lab/signature/sign', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    verify: (body: {
      data_b64: string
      signature_hex: string
      algorithm: string
      public_key_pem: string
      hash_algorithm?: string
    }) =>
      request<LabVerifyResponse>('/lab/signature/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    hash: (body: { data_b64: string; algorithm: string; variant?: string | number }) =>
      request<LabHashResponse>('/lab/hash', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    hashVerify: (body: {
      data_b64: string
      expected_hex: string
      algorithm: string
      variant?: string | number
    }) =>
      request<LabHashVerifyResponse>('/lab/hash/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    macGenerate: (body: { data_b64: string; key: string; algorithm?: string }) =>
      request<LabMacResponse>('/lab/mac/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    macVerify: (body: {
      data_b64: string
      key: string
      mac_hex: string
      algorithm?: string
    }) =>
      request<LabMacVerifyResponse>('/lab/mac/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    hybridEncrypt: (body: {
      data_b64: string
      public_key_pem: string
      symmetric_algorithm?: string
      hash_algorithm?: string
      filename?: string
      mime_type?: string
    }) =>
      request<LabFileResponse>('/lab/hybrid/encrypt', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    hybridDecrypt: (body: { container_b64: string; private_key_pem: string }) =>
      request<LabFileResponse>('/lab/hybrid/decrypt', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateSelfSigned: (body: {
      algorithm: string
      private_key_pem: string
      subject: Record<string, string>
      validity_days?: number
      is_ca?: boolean
      key_usage?: Record<string, boolean>
      extended_key_usage?: string[]
      san_dns?: string[]
      san_ip?: string[]
      san_email?: string[]
      san_uri?: string[]
      hash_algorithm?: string
    }) =>
      request<LabSelfSignedResponse>('/lab/certificate/self-signed', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateCa: (body: {
      algorithm: string
      private_key_pem: string
      subject: Record<string, string>
      validity_days?: number
      hash_algorithm?: string
    }) =>
      request<LabSelfSignedResponse>('/lab/certificate/ca', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateCsr: (body: {
      algorithm: string
      private_key_pem: string
      subject: Record<string, string>
      san_dns?: string[]
      san_ip?: string[]
      san_email?: string[]
      san_uri?: string[]
      hash_algorithm?: string
    }) =>
      request<LabCsrResponse>('/lab/certificate/csr', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateCsrParse: (body: { certificate?: string; certificate_b64?: string }) =>
      request<LabCsrResponse>('/lab/certificate/csr/parse', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateSign: (body: {
      csr_pem: string
      ca_certificate_pem: string
      ca_private_key_pem: string
      validity_days?: number
      is_ca?: boolean
      key_usage?: Record<string, boolean>
      extended_key_usage?: string[]
      san_dns?: string[]
      san_ip?: string[]
      san_email?: string[]
      san_uri?: string[]
      hash_algorithm?: string
    }) =>
      request<LabCertificateSignResponse>('/lab/certificate/sign', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateParse: (body: { certificate?: string; certificate_b64?: string }) =>
      request<LabCertificateInfo>('/lab/certificate/parse', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateVerify: (body: {
      certificate?: string
      certificate_b64?: string
      ca_certificate?: string
      expected_hostname?: string
    }) =>
      request<LabCertificateVerifyResponse>('/lab/certificate/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateChainVerify: (body: { chain: string[] }) =>
      request<LabChainVerifyResponse>('/lab/certificate/chain/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateSignData: (body: {
      data_b64: string
      algorithm: string
      private_key_pem: string
      certificate: string
      hash_algorithm?: string
    }) =>
      request<LabCertSignResponse>('/lab/certificate/sign-with-certificate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    certificateVerifyData: (body: {
      data_b64: string
      signature_hex: string
      algorithm: string
      certificate: string
      ca_certificate?: string
      expected_hostname?: string
      hash_algorithm?: string
    }) =>
      request<LabCertVerifyResponse>('/lab/certificate/verify-with-certificate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
}
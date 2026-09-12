import type {
  AlgorithmDescriptor,
  AlgorithmResult,
  ApiError,
  Catalog,
  Exercise,
  ExerciseResult,
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
}
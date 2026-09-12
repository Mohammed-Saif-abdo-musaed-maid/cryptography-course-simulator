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
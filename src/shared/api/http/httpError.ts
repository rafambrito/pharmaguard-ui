import { isAxiosError } from 'axios'

interface ProblemDetailError {
  field?: string
  message?: string
}

interface ProblemDetail {
  detail?: string
  title?: string
  errors?: ProblemDetailError[]
}

export function extractHttpErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ProblemDetail>(error)) {
    return fallback
  }

  const problem = error.response?.data

  if (problem?.errors?.length) {
    return problem.errors
      .map((item) => (item.field ? `${item.field}: ${item.message}` : item.message))
      .filter(Boolean)
      .join(' | ')
  }

  return problem?.detail ?? problem?.title ?? fallback
}

interface JwtPayload {
  sub?: string
  preferred_username?: string
  roles?: string[]
  authorities?: string[]
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const withPadding = padding === 0 ? normalized : normalized + '='.repeat(4 - padding)
  return atob(withPadding)
}

export function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const payloadText = decodeBase64Url(parts[1])
    const payload = JSON.parse(payloadText) as JwtPayload
    return payload
  } catch {
    return null
  }
}

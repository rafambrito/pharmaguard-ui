export interface AccessControlInput {
  isAuthenticated: boolean
  requiredRoles: string[]
  currentRoles: string[]
}

export function canAccessRoute(input: AccessControlInput): boolean {
  if (!input.isAuthenticated) {
    return false
  }

  if (input.requiredRoles.length === 0) {
    return true
  }

  return input.requiredRoles.some((role) => input.currentRoles.includes(role))
}

function decodeUsername(jwtToken: string | null | undefined): string | null {
  if (!jwtToken) return null
  try {
    const parts = jwtToken.split('.')
    if (parts.length < 2) return null
    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    return payload.username || null
  } catch {
    return null
  }
}

export function useAuth() {
  const token = useCookie<string | null>('jwt_token', { default: () => null })

  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => decodeUsername(token.value))

  const setToken = (newToken: string | null) => {
    token.value = newToken
  }

  const logout = () => {
    setToken(null)
  }

  return {
    token,
    isAuthenticated,
    username,
    setToken,
    logout
  }
}

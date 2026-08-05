export function useAuth() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const isAuthenticated = computed(() => !!user.value)
  
  const username = computed(() => {
    if (!user.value) return null
    return user.value.user_metadata?.username || user.value.email?.split('@')[0] || 'Utilizator'
  })

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    isAuthenticated,
    username,
    logout
  }
}

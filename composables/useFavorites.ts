import type { Database } from '~/types/database.types'

export const useFavorites = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const router = useRouter()
  
  // Use Nuxt's useCookie for SSR-friendly persistence across page refreshes
  const favoriteCookie = useCookie<number[]>('movie_app_favorites', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  // Shared reactive state in Nuxt initialized from cookie
  const favoriteIds = useState<number[]>('favoriteIds', () => favoriteCookie.value || [])
  const isLoaded = useState<boolean>('favoritesLoaded', () => false)

  // Track in-flight request movie IDs to prevent rapid click race conditions
  const pendingIdsState = useState<number[]>('pendingFavoriteMovieIds', () => [])
  
  // Track last user ID for which favorites were loaded from Supabase
  const lastLoadedUserId = useState<string | null>('lastLoadedUserId', () => null)

  const isPending = (movieId: number | string): boolean => {
    const idNum = Number(movieId)
    return pendingIdsState.value.includes(idNum)
  }

  const getUserId = (): string | null => {
    if (!user.value) return null
    return user.value.id || (user.value as { sub?: string })?.sub || user.value.email || null
  }

  // Clear favorites from state, cookies, and localStorage explicitly (invoked on explicit logout)
  const clearFavorites = () => {
    favoriteIds.value = []
    favoriteCookie.value = []
    lastLoadedUserId.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem('movie_app_favorite_ids')
      } catch (err) {
        console.warn('Eroare la ștergerea favoritelor din localStorage:', err)
      }
    }
    isLoaded.value = true
  }

  // Helper to update favoriteIds only if the elements changed
  const saveFavorites = (ids: number[]) => {
    const current = favoriteIds.value
    if (
      current.length === ids.length &&
      current.every((val, index) => val === ids[index])
    ) {
      return
    }

    favoriteIds.value = ids
    favoriteCookie.value = ids

    if (import.meta.client) {
      try {
        localStorage.setItem('movie_app_favorite_ids', JSON.stringify(ids))
      } catch (err) {
        console.warn('Eroare la salvarea favoritelor în localStorage:', err)
      }
    }
  }

  // Restore stored favorites from cookie or localStorage
  const syncFavoritesFromStorage = () => {
    if (import.meta.client) {
      try {
        let storedIds: number[] = []
        if (favoriteCookie.value && Array.isArray(favoriteCookie.value) && favoriteCookie.value.length > 0) {
          storedIds = favoriteCookie.value.map(id => Number(id)).filter(id => !isNaN(id))
        } else {
          const stored = localStorage.getItem('movie_app_favorite_ids')
          if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) {
              storedIds = parsed.map(id => Number(id)).filter(id => !isNaN(id))
            }
          }
        }

        if (storedIds.length > 0) {
          const merged = Array.from(new Set([...favoriteIds.value, ...storedIds]))
          saveFavorites(merged)
        }
      } catch (err) {
        console.warn('Eroare la sincronizarea favoritelor:', err)
      }
    }
  }

  const loadFavorites = async (force: boolean = false) => {
    syncFavoritesFromStorage()
    const currentUserId = getUserId()
    
    if (!currentUserId) {
      isLoaded.value = true
      return
    }

    if (isLoaded.value && !force && lastLoadedUserId.value === currentUserId) {
      return
    }
    
    try {
      const { data, error } = (await supabase
        .from('favorites')
        .select('movie_id')
        .eq('user_id', currentUserId)) as { data: { movie_id: number }[] | null, error: any }
        
      if (!error && data) {
        const loadedIds = data.map((row) => Number(row.movie_id))
        saveFavorites(loadedIds)
        lastLoadedUserId.value = currentUserId
      } else if (error) {
        console.warn('Eroare Supabase la încărcarea favoritelor:', error.message)
      }
    } catch (err) {
      console.warn('Eroare la conexiunea cu Supabase:', err)
    } finally {
      isLoaded.value = true
    }
  }

  const toggleFavorite = async (movieId: number | string) => {
    const idNum = Number(movieId)
    if (isNaN(idNum)) return

    // Guard: Prevent duplicate in-flight requests for the same movie ID
    if (pendingIdsState.value.includes(idNum)) {
      return
    }

    const currentUserId = getUserId()

    if (!currentUserId) {
      alert('Trebuie să fii autentificat pentru a adăuga la favorite.')
      router.push('/login')
      return
    }

    // Set pending tracking
    pendingIdsState.value = [...pendingIdsState.value, idNum]

    const isFav = favoriteIds.value.includes(idNum)
    const previousState = [...favoriteIds.value]

    try {
      if (isFav) {
        const updated = favoriteIds.value.filter(id => id !== idNum)
        saveFavorites(updated)
        
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUserId)
          .eq('movie_id', idNum)

        if (error) {
          console.warn('Eroare la ștergerea din Supabase:', error.message)
          saveFavorites(previousState)
        }
      } else {
        if (!favoriteIds.value.includes(idNum)) {
          const updated = [...favoriteIds.value, idNum]
          saveFavorites(updated)
        }

        const payload = {
          user_id: currentUserId,
          movie_id: idNum
        } as never
        
        const { error } = await supabase
          .from('favorites')
          .insert(payload)

        if (error) {
          console.warn('Eroare la adăugarea în Supabase:', error.message)
          saveFavorites(previousState)
        }
      }
    } catch (err) {
      console.warn('Eroare la procesarea favoritelor:', err)
      saveFavorites(previousState)
    } finally {
      // Clear pending tracking when promise resolves
      pendingIdsState.value = pendingIdsState.value.filter(id => id !== idNum)
    }
  }

  const isFavorite = (movieId: number | string) => {
    const idNum = Number(movieId)
    return favoriteIds.value.includes(idNum)
  }
  
  // Watch user ID with immediate execution to sync auth state
  watch(
    () => getUserId(),
    async (newUserId) => {
      if (newUserId && newUserId !== lastLoadedUserId.value) {
        await loadFavorites(true)
      } else {
        isLoaded.value = true
      }
    },
    { immediate: true }
  )

  const favoriteCount = computed(() => favoriteIds.value.length)

  return {
    favoriteIds,
    favoriteCount,
    isLoaded,
    isPending,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    clearFavorites
  }
}
